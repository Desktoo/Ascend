import { env } from '@day-mark/config';
import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import Redis from 'ioredis';
import Redlock from 'redlock';

@Injectable()
export class RedisCacheService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RedisCacheService.name);
  public client!: Redis;
  public redlock!: Redlock;

  onModuleInit() {
    if (!env.UPSTASH_REDIS_URL) {
      this.logger.error('UPSTASH_REDIS_URL is missing from your env');
    }

    this.client = new Redis(env.UPSTASH_REDIS_URL, {
      family: 4,
      tls: {
        rejectUnauthorized: false,
      },
      // tls: env.NODE_ENV === 'production' ? {} : undefined,
      maxRetriesPerRequest: 10,
    });

    this.client.on('connect', () =>
      this.logger.log('Connected to Upstash Redis Safely'),
    );

    this.client.on('error', (err) =>
      this.logger.error('Redis Connection Error: ', err),
    );

    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    this.redlock = new Redlock([this.client as any], {
      driftFactor: 0.01,
      retryCount: 0,
      retryDelay: 200,
    });
  }

  onModuleDestroy() {
    this.client.disconnect();
  }

  // Generic String primitives
  async set(key: string, value: any, ttlSeconds?: number): Promise<void> {
    const standardizedValue =
      typeof value === 'object' ? JSON.stringify(value) : String(value);
    if (ttlSeconds) {
      await this.client.set(key, standardizedValue, 'EX', ttlSeconds);
    } else {
      await this.client.set(key, standardizedValue);
    }
  }

  async get(key: string): Promise<string | null> {
    return this.client.get(key);
  }

  async del(key: string): Promise<void> {
    await this.client.del(key);
  }

  // Inside RedisCacheService

  async expire(key: string, seconds: number): Promise<void> {
    // If using standard ioredis or upstash:
    await this.client.expire(key, seconds);
  }

  // Generic Hash primitives
  async hget(key: string, field: string): Promise<string | null> {
    return this.client.hget(key, field);
  }

  async hgetall(key: string): Promise<Record<string, string>> {
    return this.client.hgetall(key);
  }

  async hset(key: string, data: Record<string, any>): Promise<void> {
    await this.client.hset(key, data);
  }

  async hincrby(key: string, field: string, amount: number): Promise<number> {
    return this.client.hincrby(key, field, amount);
  }

  // Generic Set primitives
  async sadd(key: string, member: string): Promise<void> {
    await this.client.sadd(key, member);
  }

  async srem(key: string, member: string): Promise<void> {
    await this.client.srem(key, member);
  }

  async smembers(key: string): Promise<string[]> {
    return this.client.smembers(key);
  }

  // Pipeline pass-through
  pipeline() {
    return this.client.pipeline();
  }
}
