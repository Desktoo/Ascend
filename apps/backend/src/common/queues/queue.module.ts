import { env } from '@day-mark/config';
import { BullModule } from '@nestjs/bullmq';
import { Global, Module } from '@nestjs/common';
import { HABITS_QUEUE } from './queue-names';

@Global()
@Module({
  imports: [
    BullModule.forRoot({
      connection: {
        url: env.QUEUE_REDIS_URL,
        tls: env.NODE_ENV === 'production' ? {} : undefined,
        maxRetriesPerRequest: null,
        enableReadyCheck: false,
        keepAlive: 30000,
      },
    }),
    BullModule.registerQueue({
      name: HABITS_QUEUE,
      defaultJobOptions: {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 2000,
        },
        removeOnComplete: { age: 300, count: 50 },
        removeOnFail: { age: 3600, count: 100 },
      },
    }),
  ],
  exports: [BullModule],
})
export class QueueModule {}
