import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from 'src/common/prisma/prisma.service'; // Adjust path based on your setup
import { RedisCacheService } from 'src/common/redis-cache/redis-cache.service';

@Injectable()
export class UserActivityService {
  private readonly logger = new Logger(UserActivityService.name);
  private static readonly REDIS_LAST_ACTIVE_KEY = 'user:last_active';

  constructor(
    private readonly redisCacheService: RedisCacheService,
    private readonly prisma: PrismaService,
  ) {}

  /**
   * Fast In-Memory Ping Write (< 2ms)
   * Writes/overwrites the ISO timestamp for the specific userId in a Redis Hash.
   */
  async recordActivity(userId: string): Promise<void> {
    const nowIso = new Date().toISOString();
    await this.redisCacheService.hset(
      UserActivityService.REDIS_LAST_ACTIVE_KEY,
      {
        [userId]: nowIso,
      },
    );
  }

  /**
   * Hourly Cron Job: Batch syncs lastActive timestamps from Redis to PostgreSQL.
   * Runs at minute 0 of every hour (e.g., 1:00, 2:00, 3:00).
   */
  @Cron(CronExpression.EVERY_HOUR)
  async handleHourlySync(): Promise<void> {
    this.logger.log('Starting hourly lastActive database sync task...');

    try {
      // 1. Fetch all pending user activity entries from Redis Hash
      const activeMap = await this.redisCacheService.hgetall(
        UserActivityService.REDIS_LAST_ACTIVE_KEY,
      );
      const userIds = Object.keys(activeMap);

      if (userIds.length === 0) {
        this.logger.log('No pending active user entries to sync.');
        return;
      }

      this.logger.log(
        `Syncing ${userIds.length} active user(s) from Redis to Database...`,
      );

      // 2. Build bulk update transactions for Prisma
      const updateStatements = userIds.map((id) =>
        this.prisma.client.user.update({
          where: { id },
          data: { lastActive: new Date(activeMap[id]) },
        }),
      );

      await this.prisma.client.$transaction(updateStatements);

      // 3. Clean up processed keys from Redis using a pipeline
      const pipeline = this.redisCacheService.pipeline();
      userIds.forEach((userId) => {
        pipeline.hdel(UserActivityService.REDIS_LAST_ACTIVE_KEY, userId);
      });
      await pipeline.exec();

      this.logger.log(
        `Successfully synced ${userIds.length} user(s) to Database.`,
      );
    } catch (error) {
      this.logger.error('Failed to sync lastActive users to Database:', error);
    }
  }
}
