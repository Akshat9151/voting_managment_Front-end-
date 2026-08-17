import React from 'react';
import { Card } from './Card';
import { clsx } from 'clsx';

export interface StatCardProps {
  title: string;
  value: string | number;
  subtext?: string;
  trend?: string;
  trendPositive?: boolean;
  icon: React.ReactNode;
  color?: 'cyan' | 'purple' | 'mint' | 'amber' | 'rose';
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtext,
  trend,
  trendPositive = true,
  icon,
  color = 'cyan',
  onClick
}) => {
  const colorMap = {
    cyan: 'bg-sky-50 text-sky-600 border-sky-200',
    purple: 'bg-violet-50 text-violet-600 border-violet-200',
    mint: 'bg-emerald-50 text-emerald-600 border-emerald-200',
    amber: 'bg-amber-50 text-amber-600 border-amber-200',
    rose: 'bg-rose-50 text-rose-600 border-rose-200'
  };

  return (
    <Card
      variant={onClick ? 'interactive' : 'default'}
      onClick={onClick}
      className="flex flex-col justify-between"
    >
      <div className="flex items-center justify-between gap-3 mb-2">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{title}</span>
        <div className={clsx('w-9 h-9 rounded-xl flex items-center justify-center border', colorMap[color])}>
          {icon}
        </div>
      </div>
      <div className="flex items-baseline gap-2">
        <div className="text-2xl sm:text-3xl font-extrabold font-heading text-slate-900">{value}</div>
        {trend && (
          <span className={clsx('text-xs font-bold px-1.5 py-0.5 rounded-full', trendPositive ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700')}>
            {trend}
          </span>
        )}
      </div>
      {subtext && <div className="text-xs text-slate-500 mt-1">{subtext}</div>}
    </Card>
  );
};
