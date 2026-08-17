import React from 'react';
import { clsx } from 'clsx';

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options?: { value: string; label: string }[];
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, children, className, id, ...props }, ref) => {
    const selectId = id || `select-${Math.random().toString(36).substring(2, 9)}`;

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={selectId} className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            {label}
          </label>
        )}
        <select
          id={selectId}
          ref={ref}
          className={clsx(
            'w-full min-h-[44px] rounded-xl border bg-white px-3.5 py-2 text-sm text-slate-900 transition-all focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 font-medium',
            error ? 'border-rose-300' : 'border-slate-300 hover:border-slate-400',
            className
          )}
          {...props}
        >
          {options ? options.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          )) : children}
        </select>
        {error && <p className="mt-1 text-xs text-rose-600 font-semibold">{error}</p>}
      </div>
    );
  }
);
Select.displayName = 'Select';
