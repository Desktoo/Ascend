// src/modules/notification/schemas/notification.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true }) // Automatically adds createdAt and updatedAt
export class AppNotification extends Document {
  @Prop({ required: true, index: true })
  userId!: string; // Maps perfectly to your Postgres User ID

  @Prop({ required: true })
  type!: string; // e.g., 'RANK_UP', 'REMINDER'

  @Prop({ required: true })
  title!: string;

  @Prop({ required: true })
  body!: string;

  @Prop({ type: Object, default: {} })
  data!: Record<string, any>;

  // This creates a TTL index. 2592000 seconds = 30 days.
  // MongoDB will run a background job every 60 seconds and silently drop expired docs.
  @Prop({ type: Date, default: Date.now, expires: 2592000 })
  createdAt!: Date;
}

export const AppNotificationSchema =
  SchemaFactory.createForClass(AppNotification);
