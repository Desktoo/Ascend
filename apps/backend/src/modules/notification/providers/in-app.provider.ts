// src/modules/notification/providers/in-app.provider.ts
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { INotificationProvider } from './notification-provider.interface';
import { NotificationPayload } from '../notification.types';
import { AppNotification } from '../schemas/notification.schema';
import { NotificationGateway } from '../gateways/notification.gateway';

@Injectable()
export class InAppProvider implements INotificationProvider {
  readonly channelType = 'IN_APP';
  private readonly logger = new Logger(InAppProvider.name);

  constructor(
    @InjectModel(AppNotification.name)
    private readonly notificationModel: Model<AppNotification>,
    private readonly gateway: NotificationGateway,
  ) {}

  async send(userId: string, payload: NotificationPayload): Promise<void> {
    this.logger.debug(`Buffering In-App notification for User ${userId}`);

    // 1. WRITE: Save it to MongoDB
    const newNotification = await this.notificationModel.create({
      userId,
      type: payload.type || 'SYSTEM',
      title: payload.title,
      body: payload.body,
      data: payload.data,
    });

    // 2. PUSH: Convert the Mongo Document to a standard object and broadcast it
    // The Gateway uses Redis Pub/Sub under the hood to reach all K8s pods
    this.gateway.sendNotificationToUser(userId, newNotification.toObject());
  }
}
