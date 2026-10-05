import React from 'react';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'navy' | 'emerald' | 'sage' | 'amber' | 'gray' | 'red' | 'outline';
  size?: 'sm' | 'md';
  icon?: React.ReactNode;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'emerald',
  size = 'md',
  icon,
  className = '',
}) => {
  const base =
    'inline-flex items-center font-medium rounded-full tracking-normal select-none';

  const variants = {
    navy: 'bg-slate-100 text-slate-800 border border-slate-200',
    emerald: 'bg-emerald-50 text-emerald-800 border border-emerald-200',
    sage: 'bg-emerald-50 text-emerald-800 border border-emerald-200',
    amber: 'bg-amber-50 text-amber-800 border border-amber-200',
    gray: 'bg-slate-100 text-slate-700 border border-slate-200',
    red: 'bg-red-50 text-red-800 border border-red-200',
    outline: 'bg-transparent text-slate-700 border border-slate-300',
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
