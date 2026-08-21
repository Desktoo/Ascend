import { apiClient } from '@/core/services/client';

export interface UpdateNotificationPreferenceDto {
  masterNotification?: boolean;
  webPushEnabled?: boolean;
  midDayReminder?: boolean;
}

export const NotificationPreferencesService = {
  /**
   * Updates notification preferences on the NestJS backend
   */
  async updatePreferences(data: UpdateNotificationPreferenceDto) {
    return await apiClient('/notifications/preferences', {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },
};