import React from 'react';
import { useNotifications } from '@/hooks/useNotifications';
import { NotificationItem } from '@/components/notifications/NotificationItem';
import { Button } from '@/components/common/Button';
import { Bell, CheckCheck, ShieldCheck, Sparkles } from 'lucide-react';

export const CitizenNotifications: React.FC = () => {
  const { notifications, unreadCount, markAsRead, markAllAsRead, requestPushPermission } =
    useNotifications();

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-6 space-y-6 text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 flex items-center gap-2.5">
            <Bell className="w-6 h-6 text-blue-600" />
            <span>Civic Notification Center</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time status updates, SLA escalations, and resolution confirmations.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              leftIcon={<CheckCheck className="w-4 h-4" />}
              onClick={() => markAllAsRead()}
            >
              Mark all read ({unreadCount})
            </Button>
          )}

          <Button
            variant="primary"
            size="sm"
            leftIcon={<Sparkles className="w-4 h-4" />}
            onClick={() => requestPushPermission()}
          >
            Enable Web Push
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        {notifications.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center text-slate-500">
            <Bell className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <p className="text-sm font-bold text-slate-700">No notifications</p>
            <p className="text-xs text-slate-400 mt-1">
              You will receive automated updates when officers accept or resolve your complaints.
            </p>
          </div>
        ) : (
          notifications.map((notif) => (
            <NotificationItem
              key={notif.id}
              notification={notif}
              onMarkRead={markAsRead}
            />
          ))
        )}
      </div>
    </div>
  );
};
