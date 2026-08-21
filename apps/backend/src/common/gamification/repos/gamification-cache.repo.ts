import { Injectable } from '@nestjs/common';
import { RedisCacheService } from 'src/common/redis-cache/redis-cache.service';

@Injectable()
export class GamificationCacheRepository {
  constructor(private readonly redisCache: RedisCacheService) {}

  private getGamificationKey(userId: string): string {
    return `user:gamification:${userId}`;
  }

  async getHashField(
    userId: string,
    field: 'level' | 'xp',
  ): Promise<string | null> {
    return this.redisCache.hget(this.getGamificationKey(userId), field);
  }

  async getFullHash(userId: string): Promise<Record<string, string> | null> {
    const data = await this.redisCache.hgetall(this.getGamificationKey(userId));
    return Object.keys(data).length === 0 ? null : data;
  }

  async setHashFields(
    userId: string,
    data: { level: number | string; xp: number | string; rank: string },
  ): Promise<void> {
    await this.redisCache.hset(this.getGamificationKey(userId), {
      level: String(data.level),
      xp: String(data.xp),
      rank: data.rank,
    });
  }

  async incrementHashField(
    userId: string,
    field: 'level' | 'xp',
    amount: number,
  ): Promise<number> {
    return this.redisCache.hincrby(
      this.getGamificationKey(userId),
      field,
      amount,
    );
  }

  async markUserAsDirty(userId: string): Promise<void> {
    await this.redisCache.sadd('users:dirty', userId);
  }

  async clearDirtyUserFlag(userId: string): Promise<void> {
    await this.redisCache.srem('users:dirty', userId);
  }

  async getDirtyUsers(): Promise<string[]> {
    return this.redisCache.smembers('users:dirty');
  }
}
