import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';
import { Bell, Clock, ArrowRight, CheckCircle2, ShieldAlert } from 'lucide-react';

export const Notifications: React.FC = () => {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getNotifications()
      .then((data) => setNotifications(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 text-left space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Notifications & Alerts
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Live dispatch updates, officer acceptances, and SLA escalations for your reported defects.
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 divide-y divide-slate-100 shadow-sm">
        {notifications.map((n) => (
          <div key={n.id} className="p-4 sm:p-5 flex items-start gap-4 hover:bg-slate-50 transition-colors">
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600 shrink-0 mt-0.5">
              <Bell className="w-4 h-4" />
            </div>
            <div className="space-y-1 flex-1">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-900">{n.title}</h4>
                <span className="text-[10px] text-slate-400 font-mono">
                  {new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <p className="text-xs text-slate-600">{n.message}</p>
              {n.action_url && (
                <Link
                  to={n.action_url}
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 hover:underline pt-1"
                >
                  <span>View Details</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              )}
            </div>
          </div>
        ))}

        {notifications.length === 0 && !loading && (
          <div className="p-12 text-center text-xs text-slate-400">
            No notifications yet. You will receive updates here as field teams inspect your grievance.
          </div>
        )}
      </div>
    </div>
  );
};
