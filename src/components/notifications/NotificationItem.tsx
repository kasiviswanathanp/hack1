import React from 'react';
import { CivicNotification } from '@/types';
import { formatTimeRelative } from '@/utils';
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  HardHat,
  Sparkles,
  UserCheck,
  Wrench,
  Bell,
  ArrowRight,
} from 'lucide-react';
import { cn } from '@/utils';
import { useNavigate } from 'react-router-dom';

export const NotificationItem: React.FC<{
  notification: CivicNotification;
  onMarkRead?: (id: string) => void;
  onClose?: () => void;
}> = ({ notification, onMarkRead, onClose }) => {
  const navigate = useNavigate();

  const getIcon = () => {
    switch (notification.type) {
      case 'COMPLAINT_ESCALATED':
        return <AlertTriangle className="w-4 h-4 text-rose-600" />;
      case 'COMPLAINT_RESOLVED':
        return <CheckCircle2 className="w-4 h-4 text-emerald-600" />;
      case 'WORK_STARTED':
      case 'WORK_COMPLETED':
        return <Wrench className="w-4 h-4 text-purple-600" />;
      case 'FIELD_TEAM_ASSIGNED':
        return <HardHat className="w-4 h-4 text-indigo-600" />;
      case 'OFFICER_ASSIGNED':
      case 'COMPLAINT_ACCEPTED':
        return <UserCheck className="w-4 h-4 text-blue-600" />;
      default:
        return <Sparkles className="w-4 h-4 text-amber-600" />;
    }
  };

  const handleClick = () => {
    if (!notification.read && onMarkRead) {
      onMarkRead(notification.id);
    }
    if (notification.actionUrl) {
      navigate(notification.actionUrl);
      if (onClose) onClose();
    }
  };

  return (
    <div
      onClick={handleClick}
      className={cn(
        'group flex items-start gap-3 p-3.5 rounded-xl transition-all cursor-pointer text-left',
        notification.read
          ? 'bg-white hover:bg-slate-50 border border-transparent'
          : 'bg-blue-50/60 hover:bg-blue-50 border border-blue-200/80 shadow-2xs'
      )}
    >
      <div
        className={cn(
          'p-2 rounded-xl shrink-0 mt-0.5 shadow-2xs',
          notification.type === 'COMPLAINT_ESCALATED'
            ? 'bg-rose-100'
            : notification.type === 'COMPLAINT_RESOLVED'
            ? 'bg-emerald-100'
            : 'bg-white border border-slate-200'
        )}
      >
        {getIcon()}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-1">
          <h5
            className={cn(
              'text-xs md:text-sm font-bold truncate group-hover:text-blue-600 transition-colors',
              notification.read ? 'text-slate-800' : 'text-blue-950 font-extrabold'
            )}
          >
            {notification.title}
          </h5>
          <span className="text-[10px] text-slate-400 shrink-0 font-mono">
            {formatTimeRelative(notification.createdAt)}
          </span>
        </div>
        <p className="text-xs text-slate-600 mt-0.5 leading-relaxed line-clamp-2">
          {notification.message}
        </p>
      </div>

      {!notification.read && (
        <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0 self-center" />
      )}
    </div>
  );
};
