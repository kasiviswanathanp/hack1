import React from 'react';
import { cn } from '@/utils';
import { AlertCircle, FolderOpen, RefreshCw } from 'lucide-react';
import { Button } from './Button';

export const EmptyState: React.FC<{
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
  className?: string;
}> = ({
  icon = <FolderOpen className="w-10 h-10 text-slate-400 stroke-1" />,
  title,
  description,
  actionText,
  onAction,
  className,
}) => {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center p-8 md:p-12 text-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50',
        className
      )}
    >
      <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-white shadow-xs border border-slate-200/80 mb-4">
        {icon}
      </div>
      <h4 className="text-base font-bold text-slate-800 tracking-tight">{title}</h4>
      <p className="text-xs md:text-sm text-slate-500 max-w-sm mt-1 mb-5">{description}</p>
      {actionText && onAction && (
        <Button variant="primary" size="sm" onClick={onAction}>
          {actionText}
        </Button>
      )}
    </div>
  );
};

export const LoadingState: React.FC<{ message?: string; count?: number; className?: string }> = ({
  message = 'Loading civic records...',
  count = 3,
  className,
}) => {
  return (
    <div className={cn('w-full space-y-4 py-4', className)}>
      <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
        <RefreshCw className="w-3.5 h-3.5 animate-spin text-blue-600" />
        <span>{message}</span>
      </div>
      <div className="space-y-3">
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            className="animate-pulse rounded-xl border border-slate-200 bg-white p-5 space-y-3 shadow-xs"
          >
            <div className="flex items-center justify-between">
              <div className="h-4 bg-slate-200 rounded-md w-1/4" />
              <div className="h-4 bg-slate-200 rounded-md w-16" />
            </div>
            <div className="h-3 bg-slate-200 rounded-md w-3/4" />
            <div className="h-3 bg-slate-100 rounded-md w-1/2" />
          </div>
        ))}
      </div>
    </div>
  );
};

export const ErrorState: React.FC<{
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}> = ({
  title = 'Service Unavailable',
  message = 'Unable to fetch municipal records. Please verify your connection.',
  onRetry,
  className,
}) => {
  return (
    <div
      className={cn(
        'rounded-xl border border-red-200 bg-red-50/50 p-6 text-center flex flex-col items-center justify-center',
        className
      )}
    >
      <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600 mb-3">
        <AlertCircle className="w-5 h-5" />
      </div>
      <h4 className="text-sm font-bold text-red-900">{title}</h4>
      <p className="text-xs text-red-700 max-w-md mt-1 mb-4">{message}</p>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry} leftIcon={<RefreshCw className="w-3.5 h-3.5" />}>
          Try Again
        </Button>
      )}
    </div>
  );
};
