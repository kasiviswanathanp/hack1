import React from 'react';
import { calculateSLA } from '@/utils';
import { Clock, AlertTriangle, AlertCircle } from 'lucide-react';
import { cn } from '@/utils';

export const SLAIndicator: React.FC<{
  deadlineIso?: string;
  startIso?: string;
  compact?: boolean;
  className?: string;
}> = ({ deadlineIso, startIso, compact = false, className }) => {
  const sla = calculateSLA(deadlineIso, startIso);

  if (compact) {
    if (sla.isOverdue) {
      return (
        <span
          className={cn(
            'inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-wider bg-rose-100 text-rose-800 border border-rose-200',
            className
          )}
        >
          <AlertTriangle className="w-3 h-3 text-rose-600 animate-pulse" />
          <span>{sla.overdueDurationText || 'Overdue'}</span>
        </span>
      );
    }

    const badgeStyles = {
      safe: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      warning: 'bg-amber-50 text-amber-800 border-amber-200',
      critical: 'bg-rose-50 text-rose-700 border-rose-200',
      overdue: 'bg-rose-100 text-rose-800 border-rose-300',
    };

    return (
      <span
        className={cn(
          'inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold border',
          badgeStyles[sla.badgeVariant],
          className
        )}
      >
        <Clock className="w-3 h-3 opacity-80" />
        <span>{sla.timeRemainingText}</span>
      </span>
    );
  }

  return (
    <div
      className={cn(
        'rounded-xl p-3 border text-left',
        sla.isOverdue
          ? 'bg-rose-50/80 border-rose-200 text-rose-900'
          : sla.badgeVariant === 'critical'
          ? 'bg-amber-50/80 border-amber-200 text-amber-900'
          : 'bg-slate-50 border-slate-200 text-slate-800',
        className
      )}
    >
      <div className="flex items-center justify-between text-xs mb-1.5">
        <span className="font-semibold flex items-center gap-1.5">
          {sla.isOverdue ? (
            <AlertCircle className="w-4 h-4 text-rose-600 animate-pulse" />
          ) : (
            <Clock className="w-4 h-4 text-slate-500" />
          )}
          <span>{sla.isOverdue ? 'Response Deadline Exceeded' : 'Response Window SLA'}</span>
        </span>
        <span className="font-mono font-bold">
          {sla.isOverdue ? sla.overdueDurationText : sla.timeRemainingText}
        </span>
      </div>

      <div className="w-full bg-slate-200/80 rounded-full h-1.5 overflow-hidden">
        <div
          className={cn(
            'h-full transition-all duration-500',
            sla.isOverdue
              ? 'bg-rose-600 w-full'
              : sla.badgeVariant === 'critical'
              ? 'bg-rose-500'
              : sla.badgeVariant === 'warning'
              ? 'bg-amber-500'
              : 'bg-emerald-500'
          )}
          style={{ width: sla.isOverdue ? '100%' : `${sla.percentElapsed}%` }}
        />
      </div>
    </div>
  );
};
