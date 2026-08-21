// src/common/local-redis/local-redis.module.ts
import { Global, Module } from '@nestjs/common';
import { env } from '@day-mark/config';
import { Redis } from 'ioredis';

@Global()
@Module({
  providers: [
    {
      provide: 'LOCAL_REDIS',
      useFactory: () => {
        return new Redis(env.QUEUE_REDIS_URL, {
          maxRetriesPerRequest: null, // REQUIRED: If missing, BullMQ will crash!
        });
      },
    },
  ],
  exports: ['LOCAL_REDIS'],
})
export class LocalRedisModule {}
