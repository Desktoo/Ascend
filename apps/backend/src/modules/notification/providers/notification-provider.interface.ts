// modules/notification/providers/notification-provider.interface.ts

import { NotificationPayload } from '../notification.types';

export interface INotificationProvider {
  /**
   * Identifies the channel (e.g., 'IN_APP', 'WEB_PUSH')
   */
  readonly channelType: string;

  /**
   * The actual method that will push the data to the client/browser
   */
  send(userId: string, payload: NotificationPayload): Promise<void>;
}
