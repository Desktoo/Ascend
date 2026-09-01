import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  AppNotification,
  AppNotificationSchema,
} from './schemas/notification.schema';
import { InAppProvider } from './providers/in-app.provider';
import { NotificationGateway } from './gateways/notification.gateway';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { RedisCacheService } from 'src/common/redis-cache/redis-cache.service';
import { WebPushProvider } from './providers/web-push.provider';
import { LocalRedisModule } from 'src/common/local-redis/local-redis.module';
import { JwtService } from '@nestjs/jwt';
import { NotificationCron } from './cron/notification.cron';
import { BullModule } from '@nestjs/bullmq';
import { NotificationProcessor } from './consumers/notification.processor';
import { NotificationListener } from './listeners/notification.listener';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: AppNotification.name, schema: AppNotificationSchema },
    ]),
    LocalRedisModule,
    BullModule.registerQueue({
      name: 'notification-queue',
    }),
  ],
  providers: [
    NotificationService,
    InAppProvider,
    WebPushProvider,
    JwtService,
    NotificationGateway,
    PrismaService,
    RedisCacheService,
    NotificationCron,
    NotificationProcessor,
    NotificationListener,
  ],
  controllers: [NotificationController],
})
export class NotificationModule {}
