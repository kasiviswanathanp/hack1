import { demoStore } from './store/demoStore';
import { CivicNotification } from '@/types';

export const notificationService = {
  async getNotifications(userId: string): Promise<CivicNotification[]> {
    return demoStore.getNotifications(userId);
  },

  async markAsRead(id: string): Promise<void> {
    demoStore.markNotificationAsRead(id);
  },

  async markAllAsRead(userId: string): Promise<void> {
    demoStore.markAllNotificationsAsRead(userId);
  },

  subscribe(userId: string, callback: (notifications: CivicNotification[]) => void): () => void {
    const check = () => {
      const list = demoStore.getNotifications(userId);
      callback(list);
    };
    check();
    return demoStore.subscribe(check);
  },

  async requestPushPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
      console.warn('Browser does not support notifications');
      return false;
    }

    try {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    } catch {
      return false;
    }
  },
};
