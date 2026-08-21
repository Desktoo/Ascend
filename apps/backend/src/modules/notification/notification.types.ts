// modules/notification/notification.types.ts

export interface CachedNotificationPreference {
  id: string;
  userId: string;
  masterNotification: boolean;
  webPushEnabled: boolean;
  midDayReminder: boolean;
  // Note: Redis JSON.stringify converts Dates to strings
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface TemplateContext {
  rank?: string;
  streak?: number;
  habitName?: string;
  taskName?: string;
}

export type NotificationCategory = 'PROGRESS' | 'REMINDER' | 'SYSTEM';

export interface NotificationPayload {
  type: NotificationCategory;
  title: string;
  body: string;
  data?: Record<string, string>;
}

export interface DispatchNotificationDto {
  userId: string;
  category: NotificationCategory;
  templateId: string; // Maps to the exact text in the registry
  context?: TemplateContext; // Dynamic data like rank names, habit names
}

export interface InAppNotificationData extends NotificationPayload {
  id: string;
  isRead: boolean;
  createdAt: string;
}
