// src/modules/notification/processors/notification.processor.ts
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { PrismaService } from 'src/common/prisma/prisma.service';
import {
  DispatchNotificationDto,
  NotificationPayload,
} from '../notification.types';
import { InAppProvider } from '../providers/in-app.provider';
import { WebPushProvider } from '../providers/web-push.provider';
import { NotificationTemplates } from '../templates/notification.registry';

@Processor('notification-queue')
export class NotificationProcessor extends WorkerHost {
  private readonly logger = new Logger(NotificationProcessor.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly inAppService: InAppProvider,
    private readonly webPushService: WebPushProvider,
  ) {
    super();
  }

  async process(job: Job<DispatchNotificationDto>) {
    this.logger.log(
      `[Worker] Processing job ${job.id} for User ${job.data.userId}`,
    );

    try {
      const { userId, category, templateId, context } = job.data;

      // 1. Fetch the exact template from your registry
      const templateGenerator = NotificationTemplates[templateId];
      if (!templateGenerator) {
        this.logger.error(`Template ID '${templateId}' not found in registry.`);
        return { success: false, reason: 'TEMPLATE_NOT_FOUND' };
      }

      // 2. Generate the dynamic payload (title, body, type, data)
      const payload: NotificationPayload = templateGenerator(context);

      // 3. Deliver to In-App Service (MongoDB + Live WebSocket) for PROGRESS / Rank Up
      if (category === 'PROGRESS') {
        await this.inAppService.send(userId, payload);
      }

      // 4. Fire Web Push (Desktop OS Notification)
      await this.webPushService.send(userId, payload);

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
