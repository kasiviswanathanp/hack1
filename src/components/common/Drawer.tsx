import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/utils';

export interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  position?: 'bottom' | 'right';
}

export const Drawer: React.FC<DrawerProps> = ({
  isOpen,
  onClose,
  title,
  children,
  position = 'bottom',
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex bg-slate-950/50 backdrop-blur-xs animate-in fade-in"
      onClick={onClose}
    >
      <div
        className={cn(
          'relative w-full bg-white shadow-2xl transition-transform duration-300',
          position === 'bottom'
            ? 'mt-auto rounded-t-2xl max-h-[85vh] overflow-y-auto p-6 border-t border-slate-200'
            : 'ml-auto h-full max-w-md overflow-y-auto p-6 border-l border-slate-200'
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {position === 'bottom' && (
          <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-4" />
        )}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <h3 className="text-base font-bold text-slate-900">{title || 'Details'}</h3>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="py-4">{children}</div>
      </div>
    </div>
  );
};
