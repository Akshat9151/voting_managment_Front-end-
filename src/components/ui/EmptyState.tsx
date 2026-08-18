import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from './Button';

export type EmptyStateProps = {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
};

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
}) => {
  return (
    <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/70 p-8 text-center shadow-sm">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-sky-600 shadow-sm ring-1 ring-slate-200">
        <Icon className="h-7 w-7" />
      </div>

      <h3 className="mt-5 text-base font-extrabold text-slate-900">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">{description}</p>

      {actionLabel && onAction && (
        <div className="mt-5 flex justify-center">
          <Button variant="primary" size="sm" onClick={onAction} rightIcon={<ArrowRight className="h-3.5 w-3.5" />}>
            {actionLabel}
          </Button>
        </div>
      )}
    </div>
  );
};
