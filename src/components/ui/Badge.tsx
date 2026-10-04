import React from 'react';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'navy' | 'sage' | 'amber' | 'gray' | 'red' | 'outline';
  size?: 'sm' | 'md';
  icon?: React.ReactNode;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'navy',
  size = 'md',
  icon,
  className = '',
}) => {
  const base =
    'inline-flex items-center font-semibold rounded-full tracking-wide select-none';

  const variants = {
    navy: 'bg-navy-50 text-navy-800 border border-navy-200',
    sage: 'bg-sage-50 text-sage-800 border border-sage-200',
    // Amber text darkened for 4.5:1 contrast against light background
    amber: 'bg-amberGold-100 text-amberGold-800 border border-amberGold-300',
    gray: 'bg-charcoal-100 text-charcoal-800 border border-charcoal-200',
    red: 'bg-red-50 text-red-800 border border-red-200',
    outline: 'bg-transparent text-charcoal-700 border border-navy-200',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-xs gap-1',
    md: 'px-2.5 py-1 text-xs gap-1.5',
  };

  return (
    <span className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}>
      {icon && <span className="flex-shrink-0" aria-hidden="true">{icon}</span>}
      <span>{children}</span>
    </span>
  );
};
