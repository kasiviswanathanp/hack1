import React from 'react';
import { Modal } from './Modal';
import { Button } from './Button';
import { AlertTriangle, Info } from 'lucide-react';
import { cn } from '@/utils';

export interface ConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'primary';
  isLoading?: boolean;
}

export const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'primary',
  isLoading = false,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="sm">
      <div className="text-center pt-2">
        <div
          className={cn(
            'w-12 h-12 rounded-full mx-auto flex items-center justify-center mb-4',
            variant === 'danger'
              ? 'bg-red-100 text-red-600'
              : variant === 'warning'
              ? 'bg-amber-100 text-amber-600'
              : 'bg-blue-100 text-blue-600'
          )}
        >
          {variant === 'danger' || variant === 'warning' ? (
            <AlertTriangle className="w-6 h-6" />
          ) : (
            <Info className="w-6 h-6" />
          )}
        </div>
        <h3 className="text-base font-bold text-slate-900">{title}</h3>
        <p className="text-xs md:text-sm text-slate-600 mt-2 mb-6">{message}</p>
        <div className="grid grid-cols-2 gap-3">
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            {cancelText}
          </Button>
          <Button
            variant={variant === 'danger' ? 'destructive' : 'primary'}
            onClick={onConfirm}
            isLoading={isLoading}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export const StatsCard: React.FC<{
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  trend?: { value: string; positive: boolean };
  badgeText?: string;
  badgeVariant?: 'safe' | 'warning' | 'critical';
  className?: string;
  onClick?: () => void;
}> = ({ title, value, subtitle, icon, trend, badgeText, badgeVariant = 'safe', className, onClick }) => {
  return (
    <div
      onClick={onClick}
      className={cn(
        'rounded-xl border border-slate-200/90 bg-white p-5 shadow-xs transition-all hover:shadow-md hover:border-slate-300',
        onClick && 'cursor-pointer active:scale-[0.99]',
        className
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{title}</span>
        <div className="p-2 rounded-lg bg-slate-50 border border-slate-150 text-slate-700">{icon}</div>
      </div>
      <div className="mt-3 flex items-baseline justify-between">
        <span className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900">{value}</span>
        {badgeText && (
          <span
            className={cn(
              'text-[11px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider',
              badgeVariant === 'critical'
                ? 'bg-rose-100 text-rose-700'
                : badgeVariant === 'warning'
                ? 'bg-amber-100 text-amber-800'
                : 'bg-emerald-100 text-emerald-800'
            )}
          >
            {badgeText}
          </span>
        )}
      </div>
      {(subtitle || trend) && (
        <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
          <span>{subtitle}</span>
          {trend && (
            <span className={cn('font-semibold', trend.positive ? 'text-emerald-600' : 'text-rose-600')}>
              {trend.positive ? '↑' : '↓'} {trend.value}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
