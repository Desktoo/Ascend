import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PrismaService } from '../prisma/prisma.service';
import { RedisCacheService } from '../redis-cache/redis-cache.service';
import { Cron, CronExpression } from '@nestjs/schedule';
import { RankThemeType } from './constants/rankThemes';
import { calculateXpProgression } from './constants/calculateXpProgression';
import { getXpRequiredForNextLevel } from './constants/xpCalculator';
import { Prisma } from '@day-mark/db';
import { Lock } from 'redlock';
import { GamificationCacheRepository } from './repos/gamification-cache.repo';
import { UserRankUpEvent } from '../events/user-rank-up.event';

@Injectable()
export class GamificationService {
  private readonly logger = new Logger(GamificationService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisCacheService,
    private readonly gamificationCache: GamificationCacheRepository,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  /**
   * Safe entry-point to award XP.
   * It handles cache-misses elegantly by querying the DB if Redis is cold.
   */
  async processXpGain(userId: string, xpGained: number): Promise<void> {
    // 1. Try to read active session metrics from Redis
    const cached = await this.gamificationCache.getFullHash(userId);
    let currentLevel: number;
    let currentXp: number;
    let currentRank = '';
    let activeTheme: RankThemeType = 'GENERAL';

    if (!cached || !cached.xp) {
      // Cache Miss: Populate from the Database
      const userDb = await this.prisma.client.user.findUnique({
        where: { id: userId },
        select: { level: true, xp: true, rank: true, theme: true },
      });

      if (!userDb)
        throw new Error(`User profile parameters missing for ${userId}`);

      currentLevel = userDb.level;
      currentXp = userDb.xp;
      currentRank = userDb.rank;
      activeTheme = userDb.theme;
    } else {
      currentLevel = Number(cached.level);
      currentXp = Number(cached.xp);
      currentRank = cached.rank || '';
      const userDb = await this.prisma.client.user.findUnique({
        where: { id: userId },
        select: { theme: true, rank: true },
      });
      activeTheme = userDb?.theme as RankThemeType;
      if (!currentRank && userDb?.rank) {
        currentRank = userDb.rank;
      }
    }

    // 2. Run the pure math calculator
    const { newLevel, newXp, newRank } = calculateXpProgression(
      currentLevel,
      currentXp,
      xpGained,
      activeTheme,
    );

    // 3. Commit state changes to Redis instantly
    await this.gamificationCache.setHashFields(userId, {
      level: newLevel,
      xp: newXp,
      rank: newRank,
    });

    // 4. Emit rank-up event if rank changed
    if (currentRank && newRank && newRank !== currentRank) {
      this.logger.log(
        `User ${userId} ranked up from ${currentRank} to ${newRank}`,
      );
      this.eventEmitter.emit(
        'user.rank.up',
        new UserRankUpEvent(userId, newRank, Number(newLevel)),
      );
    }

    // 5. Flag the user as needing a database sync
    await this.gamificationCache.markUserAsDirty(userId);
  }

  /**
   * Async Write-Behind Sync Engine
   * Flushes Redis data to permanent storage every 10 seconds.
   */
  @Cron(CronExpression.EVERY_10_SECONDS)
  async syncRedisToDatabase() {
    const lockKey = 'locks:user-db-sync';
    const lockDuration = 8000;

    let lock: Lock | undefined;

    try {
      // Optional Catch Binding to prevent unused variable warnings
      lock = await this.redis.redlock.acquire([lockKey], lockDuration);
    } catch {
      return; // Secure dropout if lock is held by another instance node
    }

    // 1. Wrap the ENTIRE operational lifecycle in the master safety block
    try {
      const dirtyUserIds = await this.gamificationCache.getDirtyUsers();
      if (dirtyUserIds.length === 0) return;

      this.logger.log(
        `Worker running: Batch-syncing ${dirtyUserIds.length} profiles...`,
      );

      // 2. Performance Opt: Fetch all matching users in ONE single database pass
      const dbUsers = await this.prisma.client.user.findMany({
        where: { id: { in: dirtyUserIds } },
        select: { id: true, xp: true, level: true },
      });

      // Create a fast lookup map for O(1) matching memory retrieval speeds
      const dbUserMap = new Map(dbUsers.map((u) => [u.id, u]));

      const transactionBatchActions: Prisma.PrismaPromise<any>[] = [];
      const processedUsersList: string[] = [];

      for (const userId of dirtyUserIds) {
        const cachedData = await this.gamificationCache.getFullHash(userId);
        if (!cachedData || !cachedData.xp) continue;

        // Extract using lookup map instead of hitting the database repeatedly
        const currentDbUser = dbUserMap.get(userId);
        if (!currentDbUser) continue;

        const finalLevel = Number(cachedData.level);
        const finalXp = Number(cachedData.xp);
        const finalRank = cachedData.rank;

        let netXpGained = finalXp - currentDbUser.xp;
        if (finalLevel > currentDbUser.level) {
          let tempLevel = currentDbUser.level;
          netXpGained = -currentDbUser.xp;
          while (tempLevel < finalLevel) {
            netXpGained += getXpRequiredForNextLevel(tempLevel);
            tempLevel++;
          }
          netXpGained += finalXp;
        }

        transactionBatchActions.push(
          this.prisma.client.user.update({
            where: { id: userId },
            data: { xp: finalXp, level: finalLevel, rank: finalRank },
          }),
        );

        transactionBatchActions.push(
          this.prisma.client.xpTransaction.create({
            data: {
              userId,
              amount: netXpGained,
              reason: `Synchronised session metrics. Level: ${finalLevel}`,
            },
          }),
        );

        processedUsersList.push(userId);
      }

      // Execute database pipeline updates if changes are queued
      if (transactionBatchActions.length > 0) {
        await this.prisma.client.$transaction(transactionBatchActions);

        for (const userId of processedUsersList) {
          await this.gamificationCache.clearDirtyUserFlag(userId);
        }
        this.logger.log(
          `Successfully persisted ${processedUsersList.length} updates.`,
        );
      }
    } catch (error) {
      this.logger.error(
        'Database batch sync failed, changes safely rolled back',
        error,
      );
    } finally {
      // 3. The lock is now GUARANTEED to release cleanly regardless of where the routine exits
      if (lock) {
        try {
          await this.redis.redlock.release(lock);
        } catch (releaseError) {
          this.logger.error('Failed to release lock cleanly', releaseError);
        }
      }
    }
  }
}
