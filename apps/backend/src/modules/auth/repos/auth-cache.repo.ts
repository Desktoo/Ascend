import { Injectable } from '@nestjs/common';
import { RedisCacheService } from 'src/common/redis-cache/redis-cache.service';

@Injectable()
export class AuthCacheRepository {
  constructor(private readonly redisCache: RedisCacheService) {}

  private getRefreshKey(userId: string): string {
    return `refresh:${userId}`;
  }

  async setRefreshToken(
    userId: string,
    token: string,
    ttlSeconds: number,
  ): Promise<void> {
    await this.redisCache.set(this.getRefreshKey(userId), token, ttlSeconds);
  }

  async getRefreshToken(userId: string): Promise<string | null> {
    return this.redisCache.get(this.getRefreshKey(userId));
  }

  async revokeRefreshToken(userId: string): Promise<void> {
    await this.redisCache.del(this.getRefreshKey(userId));
  }
}
