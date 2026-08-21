import { apiClient } from '@/core/services/client';

function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export const PushNotificationService = {
  /**
   * Checks if the browser supports Service Workers and Push Notifications
   */
  isSupported(): boolean {
    return (
      typeof window !== 'undefined' &&
      'serviceWorker' in navigator &&
      'PushManager' in window
    );
  },

  /**
   * Requests permission and registers the device with the backend
   */
  async enablePushNotifications(vapidPublicKey: string): Promise<boolean> {
    if (!this.isSupported()) {
      console.warn('Push notifications are not supported in this browser.');
      return false;
    }

    try {
      // 1. Ask the user for permission
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        console.warn('Notification permission denied by user.');
        return false;
      }

      // 2. Register (or get) the Service Worker
      await navigator.serviceWorker.register('/sw.js');
      await navigator.serviceWorker.ready;

      // 3. Generate the Subscription Mailbox
      const registration = await navigator.serviceWorker.getRegistration();
      if (!registration) {
        throw new Error('Service Worker registration failed.');
      }

      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
      });

      const subJson = subscription.toJSON();

      // 4. Construct clean payload (strip unexpected browser keys like expirationTime)
      const payload = {
        endpoint: subJson.endpoint,
        keys: {
          p256dh: subJson.keys?.p256dh,
          auth: subJson.keys?.auth,
        },
      };

      // 5. Send subscription payload via apiClient
      await apiClient('/notifications/push/subscribe', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      return true;
    } catch (error) {
      console.error('Error enabling push notifications:', error);
      return false;
    }
  },
};