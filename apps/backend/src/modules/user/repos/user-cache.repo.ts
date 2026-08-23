import { Injectable } from '@nestjs/common';
import { RedisCacheService } from 'src/common/redis-cache/redis-cache.service';

export interface CachedCoreProfile {
  id: string;
  email: string;
  userName: string;
  avatarUrl: string | null;
  timeZone: string;
  dayStartTime: string;
  isOnboarded: boolean;
  hasPassword: boolean;
}

@Injectable()
export class UserCacheRepository {
  constructor(private readonly redisCache: RedisCacheService) {}

  private getKey(userId: string): string {
    return `user:${userId}:profile`;
  }

  async getCoreProfile(userId: string): Promise<CachedCoreProfile | null> {
    const data = await this.redisCache.hgetall(this.getKey(userId));

    if (!data || Object.keys(data).length === 0) {
      return null;
    }

    return {
      id: data.id,
      email: data.email,
      userName: data.userName,
      avatarUrl: data.avatarUrl || null,
      timeZone: data.timeZone,
      dayStartTime: data.dayStartTime,
      // Cast Redis strings back to booleans
      isOnboarded: data.isOnboarded === 'true',
      hasPassword: data.hasPassword === 'true',
    };
  }

  async setCoreProfile(
    userId: string,
    profile: CachedCoreProfile,
  ): Promise<void> {
    // Convert booleans to strings for Redis Hash compatibility
    const hashData = {
      ...profile,
      avatarUrl: profile.avatarUrl || '', // Ensure no nulls are passed to Redis
      isOnboarded: String(profile.isOnboarded),
      hasPassword: String(profile.hasPassword),
    };

    await this.redisCache.hset(this.getKey(userId), hashData);
    await this.redisCache.expire(this.getKey(userId), 86400); // 24-hour TTL
  }

  async invalidateProfile(userId: string): Promise<void> {
    await this.redisCache.del(this.getKey(userId));
  }
}
