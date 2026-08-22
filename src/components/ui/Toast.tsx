import React from 'react';
import { useToast } from '../../context/ToastContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { clsx } from 'clsx';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-16 right-3 sm:right-4 z-[9999] flex flex-col gap-2 w-[calc(100vw-24px)] sm:w-auto sm:max-w-[340px] pointer-events-none">
      {toasts.map(toast => {
        const isSuccess = toast.type === 'success';
        const isError = toast.type === 'error';
        const isInfo = toast.type === 'info' || !toast.type;

        return (
          <div
            key={toast.id}
            className={clsx(
              'pointer-events-auto flex items-start gap-2.5 px-3.5 py-2.5 rounded-xl shadow-lg border text-sm font-medium animate-slide-down',
              isSuccess && 'bg-white border-emerald-200 text-slate-800 dark:bg-slate-900 dark:border-emerald-800 dark:text-slate-100',
              isError  && 'bg-white border-rose-200 text-slate-800 dark:bg-slate-900 dark:border-rose-800 dark:text-slate-100',
              isInfo   && 'bg-white border-sky-200 text-slate-800 dark:bg-slate-900 dark:border-sky-800 dark:text-slate-100',
            )}
            style={{ backdropFilter: 'blur(8px)' }}
          >
            {/* Colored accent strip */}
            <div className={clsx(
              'w-0.5 self-stretch rounded-full flex-shrink-0 mt-0.5',
              isSuccess && 'bg-emerald-500',
              isError   && 'bg-rose-500',
              isInfo    && 'bg-sky-500',
            )} />

            {/* Icon */}
            <div className="flex-shrink-0 mt-0.5">
              {isSuccess && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
              {isError   && <AlertCircle   className="w-4 h-4 text-rose-500" />}
              {isInfo    && <Info          className="w-4 h-4 text-sky-500" />}
            </div>

            {/* Message */}
            <span className="flex-1 text-xs leading-relaxed">{toast.message}</span>

            {/* Dismiss */}
            <button
              onClick={() => removeToast(toast.id)}
              className="flex-shrink-0 p-0.5 rounded text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
              aria-label="Dismiss"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
