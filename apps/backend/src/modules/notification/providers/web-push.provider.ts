import { Injectable, Logger } from '@nestjs/common';
import { INotificationProvider } from './notification-provider.interface';
import { NotificationPayload } from '../notification.types';
import * as webpush from 'web-push';
import { env } from '@day-mark/config';
import { PrismaService } from '../../../common/prisma/prisma.service';

@Injectable()
export class WebPushProvider implements INotificationProvider {
  readonly channelType = 'WEB_PUSH';
  private readonly logger = new Logger(WebPushProvider.name);

  constructor(private readonly prisma: PrismaService) {
    webpush.setVapidDetails(
      'mailto:akshat.krishan.02@gmail.com',
      env.VAPID_PUBLIC_KEY,
      env.VAPID_PRIVATE_KEY,
    );
  }

  async send(userId: string, payload: NotificationPayload): Promise<void> {
    const subscriptions = await this.prisma.client.pushSubscription.findMany({
      where: { userId: userId },
    });

    if (subscriptions.length === 0) return;

    const pushPayload = JSON.stringify({
      title: payload.title,
      body: payload.body,
      url: payload.data?.url || '/',
    });

    const promises = subscriptions.map(async (sub) => {
      const pushConfig = {
        endpoint: sub.endpoint,
        keys: { p256dh: sub.p256dh, auth: sub.auth },
      };

      try {
        await webpush.sendNotification(pushConfig, pushPayload);
      } catch (error: unknown) {
        // 1. Check if it's specifically a Web-Push error (which has a statusCode)
        if (error instanceof webpush.WebPushError) {
          if (error.statusCode === 410 || error.statusCode === 404) {
            this.logger.warn(
              `Push subscription dead for user ${userId}. Deleting...`,
            );
            await this.prisma.client.pushSubscription.delete({
              where: { id: sub.id },
            });
          } else {
            this.logger.error(
              `Web Push API Error: ${error.statusCode}`,
              error.body,
            );
          }
        }
        // 2. Fallback for normal Javascript errors (network failure, etc.)
        else if (error instanceof Error) {
          this.logger.error('System error sending web push:', error.message);
        }
      }
    });

    await Promise.all(promises);
  }
}
