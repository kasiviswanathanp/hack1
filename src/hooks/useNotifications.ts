import { useEffect, useState } from 'react';
import { notificationService } from '@/services/notificationService';
import { CivicNotification } from '@/types';
import { useAuth } from '@/store/AuthContext';

export function useNotifications() {
  const { currentUser } = useAuth();
  const [notifications, setNotifications] = useState<CivicNotification[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const userId = currentUser?.uid || 'demo-citizen-1';

  useEffect(() => {
    setIsLoading(true);
    const unsub = notificationService.subscribe(userId, (list) => {
      setNotifications(list);
      setIsLoading(false);
    });

    return unsub;
  }, [userId]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = async (id: string) => {
    await notificationService.markAsRead(id);
  };

  const markAllAsRead = async () => {
    await notificationService.markAllAsRead(userId);
  };

  const requestPushPermission = async () => {
    return notificationService.requestPushPermission();
  };

  return {
    notifications,
    unreadCount,
    isLoading,
    markAsRead,
    markAllAsRead,
    requestPushPermission,
  };
}
