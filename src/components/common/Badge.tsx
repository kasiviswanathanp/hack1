import React from 'react';
import { cn } from '@/utils';
import { STATUS_CONFIG, PRIORITY_CONFIG } from '@/constants';
import { ComplaintStatus, PriorityLevel } from '@/types';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'neutral' | 'outline' | 'success' | 'warning' | 'danger';
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  className,
  ...props
}) => {
  const variants = {
    default: 'bg-blue-50 text-blue-700 border-blue-200',
    neutral: 'bg-slate-100 text-slate-700 border-slate-200',
    outline: 'bg-transparent text-slate-700 border-slate-300',
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    warning: 'bg-amber-50 text-amber-800 border-amber-200',
    danger: 'bg-rose-50 text-rose-700 border-rose-200',
  };

  const sizes = {
    sm: 'text-[11px] px-2 py-0.5 font-medium',
    md: 'text-xs px-2.5 py-1 font-semibold',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};

export const StatusBadge: React.FC<{ status: ComplaintStatus; className?: string }> = ({
  status,
  className,
}) => {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.SUBMITTED;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border tracking-wide uppercase',
        config.bg,
        config.text,
        config.border,
        className
      )}
    >
      <span
        className={cn(
          'w-1.5 h-1.5 rounded-full',
          status === 'ESCALATED' ? 'bg-rose-600 animate-ping' : 'bg-current'
        )}
      />
      {config.label}
    </span>
  );
};

export const PriorityBadge: React.FC<{ priority: PriorityLevel; className?: string }> = ({
  priority,
  className,
}) => {
  const config = PRIORITY_CONFIG[priority] || PRIORITY_CONFIG.LOW;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-bold border tracking-wider uppercase',
        config.bg,
        config.text,
        config.border,
        className
      )}
    >
      <span className={cn('w-2 h-2 rounded-full shrink-0', config.dot)} />
      {config.label}
    </span>
  );
};
