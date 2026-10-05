import React from 'react';
import { Button } from './Button';

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionText,
  onAction,
  className = '',
}) => {
  return (
    <div
      role="status"
      className={`flex flex-col items-center justify-center text-center p-8 sm:p-12 rounded-2xl bg-surface border border-dashed border-line text-fg-muted space-y-3 ${className}`}
    >
      {icon && (
        <div className="w-14 h-14 rounded-2xl bg-surface-muted text-fg flex items-center justify-center mb-1" aria-hidden="true">
          {icon}
        </div>
      )}
      <div className="max-w-md space-y-1">
        <h3 className="text-base font-bold text-fg font-heading">
          {title}
        </h3>
        <p className="text-sm text-fg-muted leading-relaxed">
          {description}
        </p>
      </div>
      {actionText && onAction && (
        <Button variant="primary" size="md" onClick={onAction} className="mt-2 min-h-[44px]">
          {actionText}
        </Button>
      )}
    </div>
  );
};
