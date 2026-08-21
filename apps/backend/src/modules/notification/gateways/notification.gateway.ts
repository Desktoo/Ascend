import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AppNotification } from '../schemas/notification.schema';

@Injectable()
@WebSocketGateway({ cors: { origin: '*' } })
export class NotificationGateway implements OnGatewayConnection {
  @WebSocketServer()
  server!: Server;

  private readonly logger = new Logger(NotificationGateway.name);

  constructor(
    // Inject Mongo so the Gateway can sweep the DB
    @InjectModel(AppNotification.name)
    private readonly notificationModel: Model<AppNotification>,
  ) {}

  handleConnection(client: Socket) {
    const userId = client.handshake.query.userId as string;
    if (!userId) {
      client.disconnect();
      return;
    }
    void client.join(`user:${userId}`);
  }

  // Called by the Provider to push the alert
  sendNotificationToUser(userId: string, payload: any): void {
    this.server.to(`user:${userId}`).emit('NEW_NOTIFICATION', payload);
  }

  // 3. THE SWEEP: Listen for the frontend ACK
  @SubscribeMessage('ACK_NOTIFICATION')
  async handleAcknowledgment(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { notificationId: string },
  ) {
    const userId = client.handshake.query.userId as string;

    if (!payload.notificationId) return;

    this.logger.debug(
      `User ${userId} ACK'd notification ${payload.notificationId}`,
    );

    // Delete the notification fro Mongo so it doesn't show up in the offline fetch
    await this.notificationModel.deleteOne({
      _id: payload.notificationId,
      userId: userId, // Security: Ensure they only delete their own notifications
    });
  }
}
