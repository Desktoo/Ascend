// src/modules/notification/listeners/notification.listener.ts
import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { UserRankUpEvent } from 'src/common/events/user-rank-up.event';
import { DispatchNotificationDto } from '../notification.types';

@Injectable()
export class NotificationListener {
  private readonly logger = new Logger(NotificationListener.name);

  constructor(
    @InjectQueue('notification-queue')
    private notificationQueue: Queue<DispatchNotificationDto>,
  ) {}

  @OnEvent('user.rank.up')
  async handleUserRankUp(event: UserRankUpEvent) {
    this.logger.debug(`Caught rank up event for user ${event.userId}`);

    // Map the system event to a Notification Job
    await this.notificationQueue.add('send-notification', {
      userId: event.userId,
      category: 'PROGRESS',
      templateId: 'RANK_UP',
      context: { rank: event.newRank },
    });
  }
}
