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
      className={`flex flex-col items-center justify-center text-center p-8 sm:p-12 rounded-2xl bg-white border border-dashed border-navy-200 text-charcoal-500 space-y-3 ${className}`}
    >
      {icon && (
        <div className="w-12 h-12 rounded-2xl bg-navy-50 text-navy-700 flex items-center justify-center mb-1" aria-hidden="true">
          {icon}
        </div>
      )}
      <div className="max-w-md space-y-1">
        <h3 className="text-base font-bold text-navy-800 font-['Outfit']">
          {title}
        </h3>
        <p className="text-xs text-charcoal-500 leading-relaxed">
          {description}
        </p>
      </div>
      {actionText && onAction && (
        <Button variant="primary" size="sm" onClick={onAction} className="mt-2">
          {actionText}
        </Button>
      )}
    </div>
  );
};
