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
    mint: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
    cyan: 'bg-sky-50 text-sky-700 border-sky-200/80',
    purple: 'bg-violet-50 text-violet-700 border-violet-200/80',
    amber: 'bg-amber-50 text-amber-700 border-amber-200/80',
    rose: 'bg-rose-50 text-rose-700 border-rose-200/80',
    slate: 'bg-slate-100 text-slate-700 border-slate-200'
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
