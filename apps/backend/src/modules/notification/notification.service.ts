import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { INotificationProvider } from './providers/notification-provider.interface';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { RedisCacheService } from 'src/common/redis-cache/redis-cache.service';
import { UpdateNotificationPreferenceDto } from './dto/notification.dto';
import {
  CachedNotificationPreference,
  DispatchNotificationDto,
} from './notification.types';
import { NotificationTemplates } from './templates/notification.registry';
import { InAppProvider } from './providers/in-app.provider';
import { WebPushProvider } from './providers/web-push.provider';
import { InjectModel } from '@nestjs/mongoose';
import { AppNotification } from './schemas/notification.schema';
import { Model } from 'mongoose';
import { CreateWebPushSubscriptionDto } from './dto/web-push.dto';

@Injectable()
export class NotificationService implements OnModuleInit {
  private readonly logger = new Logger(NotificationService.name);

  private readonly providers = new Map<string, INotificationProvider>();

  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisCacheService,
    private readonly inAppProvider: InAppProvider,
    private readonly webPushProvider: WebPushProvider,
    @InjectModel(AppNotification.name)
    private readonly notificationModel: Model<AppNotification>,
  ) {}

  onModuleInit() {
    this.registerProvider(this.inAppProvider);
    this.registerProvider(this.webPushProvider);
  }

  registerProvider(provider: INotificationProvider) {
    this.providers.set(provider.channelType, provider);
    this.logger.log(
      `Registered Notification Provider: [${provider.channelType}]`,
    );
  }

  async getOfflineNotifications(userId: string) {
    return this.notificationModel
      .find({ userId })
      .sort({ createdAt: -1 })
      .exec();
  }

  async updatePreference(
    userId: string,
    data: UpdateNotificationPreferenceDto,
  ) {
    const updatedPrefs = await this.prisma.client.notificationPreference.upsert(
      {
        where: { userId },
        update: data,
        create: { userId, ...data },
      },
    );

    await this.redis.set(
      `user:${userId}:notification_prefs`,
      updatedPrefs,
      86400,
    ); // 24h TTL

    return updatedPrefs;
  }

  async saveWebPushSubscription(
    userId: string,
    subscriptionData: CreateWebPushSubscriptionDto,
  ) {
    await this.prisma.client.pushSubscription.upsert({
      where: { endpoint: subscriptionData.endpoint },
      create: {
        userId: userId,
        endpoint: subscriptionData.endpoint,
        p256dh: subscriptionData.keys.p256dh,
        auth: subscriptionData.keys.auth,
      },
      update: {
        userId: userId,
        p256dh: subscriptionData.keys.p256dh,
        auth: subscriptionData.keys.auth,
      },
    });
  }

  async dispatchNotification(dto: DispatchNotificationDto): Promise<void> {
    const { userId, category, templateId, context } = dto;
    const prefs = await this.getUserPreferences(userId);

    if (!prefs.masterNotification) {
      this.logger.debug(`User ${userId} has masterNotification OFF. Dropping.`);
      return;
    }

    if (
      category === 'REMINDER' &&
      templateId === 'REMINDER_MID_DAY' &&
      !prefs.midDayReminder
    ) {
      this.logger.debug(`User ${userId} disabled midDayReminder. Dropping.`);
      return;
    }

    const templateGenerator = NotificationTemplates[templateId];
    if (!templateGenerator) {
      this.logger.error(`Template ID [${templateId}] not found in registry.`);
      return;
    }
    const payload = templateGenerator(context);

    const activeChannels = ['IN_APP']; // In-App is usually always forced on if master is true
    if (prefs.webPushEnabled) activeChannels.push('WEB_PUSH');

    for (const channelType of activeChannels) {
      const provider = this.providers.get(channelType);
      if (provider) {
        try {
          await provider.send(userId, payload);
        } catch (error) {
          this.logger.error(
            `[${channelType}] failed for User ${userId}`,
            error,
          );
        }
      } else {
        this.logger.warn(`Provider [${channelType}] not found in registry.`);
      }
    }
  }

  private async getUserPreferences(
    userId: string,
  ): Promise<CachedNotificationPreference> {
    const cacheKey = `user:${userId}:notification_prefs`;

    const cachedData = await this.redis.get(cacheKey);
    if (cachedData) {
      // Cast through 'unknown' to satisfy strict ESLint rules for JSON.parse
      const parsedData: unknown = JSON.parse(cachedData);
      return parsedData as CachedNotificationPreference;
    }

    const prefs =
      await this.prisma.client.notificationPreference.findUniqueOrThrow({
        where: { userId },
      });

    await this.redis.set(cacheKey, prefs, 86400);

    return prefs;
  }
}
