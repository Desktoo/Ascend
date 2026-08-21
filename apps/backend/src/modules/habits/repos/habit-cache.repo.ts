import { Injectable } from '@nestjs/common';
import { RedisCacheService } from 'src/common/redis-cache/redis-cache.service';
import { CachedHabitMeta } from 'src/common/types/types';

@Injectable()
export class HabitsCacheRepository {
  constructor(private readonly cache: RedisCacheService) {}

  public getHabitHashKey(userId: string, habitId: string): string {
    return `user:${userId}:habit:${habitId}:meta`;
  }

  async getHabitHash(
    userId: string,
    habitId: string,
  ): Promise<Record<string, string>> {
    return this.cache.hgetall(this.getHabitHashKey(userId, habitId));
  }

  async updateHabitMeta(
    userId: string,
    habitId: string,
    data: Record<string, string>,
    ttlSeconds: number,
  ): Promise<void> {
    const key = this.getHabitHashKey(userId, habitId);
    await this.cache.hset(key, data);
    await this.cache.client.expire(key, ttlSeconds);
  }

  async initializeHabitCache(
    userId: string,
    habitId: string,
    data: {
      currentStreak: string;
      longestStreak: string;
      stabilityScore: string;
      isScheduledForToday: boolean;
    },
  ): Promise<void> {
    const pipeline = this.cache.pipeline();
    pipeline.hset(this.getHabitHashKey(userId, habitId), {
      currentStreak: data.currentStreak,
      longestStreak: data.longestStreak,
      stabilityScore: data.stabilityScore,
    });

    if (data.isScheduledForToday) {
      const todayDateStr = new Date().toISOString().split('T')[0];
      const trackingKey = `user:${userId}:habit:${habitId}:status:${todayDateStr}`;
      pipeline.set(trackingKey, 'PENDING', 'EX', 172800);
    }

    await pipeline.exec();
  }

  async getHabitsMetaBulk(
    userId: string,
    habitIds: string[],
  ): Promise<(CachedHabitMeta | null)[]> {
    if (habitIds.length === 0) return [];

    const pipeline = this.cache.pipeline();
    habitIds.forEach((id) => {
      pipeline.hgetall(this.getHabitHashKey(userId, id));
    });

    const results = await pipeline.exec();

    return (results ?? []).map(([error, res]) => {
      if (error || !res || Object.keys(res).length === 0) return null;
      return res as CachedHabitMeta;
    });
  }
}
