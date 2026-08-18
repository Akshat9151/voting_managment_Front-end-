import React from 'react';
import { clsx } from 'clsx';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'interactive' | 'glass';
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  className,
  ...props
}) => {
  return (
    <div
      className={clsx(
        'rounded-2xl bg-white border border-slate-200/90 shadow-card p-4 sm:p-5 transition-all dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100',
        variant === 'interactive' && 'hover:shadow-elevated hover:border-slate-300 hover:-translate-y-0.5 cursor-pointer dark:hover:border-slate-600',
        variant === 'glass' && 'bg-white/95 backdrop-blur-md dark:bg-slate-900/90',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
