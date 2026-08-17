import React from 'react';
import { clsx } from 'clsx';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, className, id, ...props }, ref) => {
    const areaId = id || `textarea-${Math.random().toString(36).substring(2, 9)}`;

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={areaId} className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            {label}
          </label>
        )}
        <textarea
          id={areaId}
          ref={ref}
          className={clsx(
            'w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm text-slate-900 transition-all placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 font-medium',
            error ? 'border-rose-300' : 'border-slate-300 hover:border-slate-400',
            className
          )}
          {...props}
        />
        {error && <p className="mt-1 text-xs text-rose-600 font-semibold">{error}</p>}
      </div>
    );
  }
);
Textarea.displayName = 'Textarea';
