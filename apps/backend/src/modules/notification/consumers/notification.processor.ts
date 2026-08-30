// src/modules/notification/processors/notification.processor.ts
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { PrismaService } from 'src/common/prisma/prisma.service';
import {
  DispatchNotificationDto,
  NotificationPayload,
} from '../notification.types';
import { WebPushProvider } from '../providers/web-push.provider';
import { NotificationTemplates } from '../templates/notification.registry';
// import { NotificationGateway } from '../gateways/notification.gateway';

@Processor('notification-queue')
export class NotificationProcessor extends WorkerHost {
  private readonly logger = new Logger(NotificationProcessor.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly webPushService: WebPushProvider,
    // private readonly notificationGateway: NotificationGateway,
  ) {
    super();
  }

  async process(job: Job<DispatchNotificationDto>) {
    this.logger.log(
      `[Worker] Processing job ${job.id} for User ${job.data.userId}`,
    );

    try {
      const { userId, templateId, context } = job.data;

      // 1. Fetch the exact template from your registry
      const templateGenerator = NotificationTemplates[templateId];
      if (!templateGenerator) {
        this.logger.error(`Template ID '${templateId}' not found in registry.`);
        return { success: false, reason: 'TEMPLATE_NOT_FOUND' };
      }

      // 2. Generate the dynamic payload (title, body, type, data)
      const payload: NotificationPayload = templateGenerator(context);

      // 3. Check User Preferences (Optional but recommended)
      // const prefs = await this.redis.get(`user:${userId}:notification_prefs`);
      // if (prefs && !prefs.masterNotification) return { success: true, skipped: true };

      // 4. Save to PostgreSQL (Offline Inbox)
      // Adjust this schema call to match your actual Prisma notification model
      /*
      await this.prisma.client.notification.create({
        data: {
          userId,
          title: payload.title,
          body: payload.body,
          type: payload.type, // 'PROGRESS' | 'REMINDER' | 'SYSTEM'
          isRead: false,
        },
      });
      */

      // 5. Fire Web Push (Desktop OS Notification)
      // Uses the exact send() method you provided
      await this.webPushService.send(userId, payload);

      // 6. Fire WebSocket (Live UI Toast & Red Dot)
      /*
      this.notificationGateway.sendLiveNotification(userId, payload);
      */

      this.logger.log(
        `[Worker] Successfully delivered ${templateId} to User ${userId}`,
      );
      return { success: true, deliveredAt: new Date() };
    } catch (error) {
      this.logger.error(`[Worker] Failed to process job ${job.id}`, error);
      throw error; // Let BullMQ handle retries
    }
  }
}
