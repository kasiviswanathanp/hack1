import React from 'react';
import { useNotifications } from '@/hooks/useNotifications';
import { NotificationItem } from './NotificationItem';
import { Bell, CheckCheck, Sparkles } from 'lucide-react';
import { Button } from '@/components/common/Button';

export const NotificationCenter: React.FC<{ onClose?: () => void }> = ({ onClose }) => {
  const { notifications, unreadCount, markAsRead, markAllAsRead, requestPushPermission } =
    useNotifications();

  return (
    <div className="w-full max-w-sm rounded-2xl bg-white shadow-xl border border-slate-200 overflow-hidden text-left">
      <div className="p-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-blue-600" />
          <h4 className="text-sm font-bold text-slate-900">Notifications</h4>
          {unreadCount > 0 && (
            <span className="px-1.5 py-0.5 rounded-full bg-blue-600 text-white text-[10px] font-bold">
              {unreadCount}
            </span>
          )}
        </div>

        {unreadCount > 0 && (
          <button
            onClick={() => markAllAsRead()}
            className="text-[11px] font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
          >
            <CheckCheck className="w-3.5 h-3.5" />
            <span>Mark all read</span>
          </button>
        )}
      </div>

      <div className="max-h-[380px] overflow-y-auto divide-y divide-slate-100 p-2 space-y-1">
        {notifications.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-500">
            <Bell className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <span>No notifications yet</span>
          </div>
        ) : (
          notifications.map((notif) => (
            <NotificationItem
              key={notif.id}
              notification={notif}
              onMarkRead={markAsRead}
              onClose={onClose}
            />
          ))
        )}
      </div>

      <div className="p-2.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs">
        <span className="text-slate-500 text-[11px]">Real-time push enabled</span>
        <button
          onClick={() => requestPushPermission()}
          className="text-blue-600 font-semibold hover:underline text-[11px] cursor-pointer"
        >
          Enable Alerts
        </button>
      </div>
    </div>
  );
};
