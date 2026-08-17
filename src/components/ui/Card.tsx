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
        'rounded-2xl bg-white border border-slate-200/90 shadow-card p-4 sm:p-5 transition-all',
        variant === 'interactive' && 'hover:shadow-elevated hover:border-slate-300 hover:-translate-y-0.5 cursor-pointer',
        variant === 'glass' && 'bg-white/95 backdrop-blur-md',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
