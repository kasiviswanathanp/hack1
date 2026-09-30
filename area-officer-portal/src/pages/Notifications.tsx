import React, { useEffect, useState } from 'react';
import { api } from '../api';
import { Bell, Clock, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Notifications: React.FC = () => {
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    api.getNotifications().then(setNotifications);
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 text-left space-y-6">
      <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
        Ward Officer Alerts & Notifications
      </h1>
      <div className="bg-white rounded-3xl border border-slate-200 divide-y divide-slate-100 shadow-sm">
        {notifications.map((n) => (
          <div key={n.id} className="p-4 sm:p-5 flex items-start gap-4">
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600 shrink-0 mt-0.5">
              <Bell className="w-4 h-4" />
            </div>
            <div className="space-y-1 flex-1">
              <h4 className="text-xs font-bold text-slate-900">{n.title}</h4>
              <p className="text-xs text-slate-600">{n.message}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
