import React from 'react';

export interface SkeletonProps {
  className?: string;
  variant?: 'rect' | 'circle' | 'text';
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className = 'h-4 w-full',
  variant = 'rect',
}) => {
  const rounded = {
    rect: 'rounded-xl',
    circle: 'rounded-full',
    text: 'rounded-md',
  }[variant];

  return (
    <div
      role="progressbar"
      aria-label="Loading content..."
      className={`bg-navy-100/60 animate-pulse ${rounded} ${className}`}
    />
  );
};
