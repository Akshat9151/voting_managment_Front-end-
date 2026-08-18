import React from 'react';
import { clsx } from 'clsx';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'mint' | 'cyan' | 'purple' | 'amber' | 'rose' | 'slate';
  size?: 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'slate',
  size = 'md',
  className
}) => {
  const variantStyles = {
    mint: 'bg-emerald-50 text-emerald-700 border-emerald-200/80 dark:bg-emerald-900/40 dark:text-emerald-300 dark:border-emerald-700',
    cyan: 'bg-sky-50 text-sky-700 border-sky-200/80 dark:bg-sky-900/40 dark:text-sky-300 dark:border-sky-700',
    purple: 'bg-violet-50 text-violet-700 border-violet-200/80 dark:bg-violet-900/40 dark:text-violet-300 dark:border-violet-700',
    amber: 'bg-amber-50 text-amber-700 border-amber-200/80 dark:bg-amber-900/40 dark:text-amber-300 dark:border-amber-700',
    rose: 'bg-rose-50 text-rose-700 border-rose-200/80 dark:bg-rose-900/40 dark:text-rose-300 dark:border-rose-700',
    slate: 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700'
  };

  const sizeStyles = {
    sm: 'text-[11px] px-2 py-0.5 font-semibold',
    md: 'text-xs px-2.5 py-1 font-bold'
  };

  return (
    <span className={clsx('inline-flex items-center gap-1 rounded-full border leading-tight select-none', variantStyles[variant], sizeStyles[size], className)}>
      {children}
    </span>
  );
};
