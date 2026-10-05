import React, { forwardRef } from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'sage' | 'emerald' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      icon,
      iconPosition = 'left',
      isLoading = false,
      className = '',
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-semibold rounded-xl transition-all select-none min-h-[44px] active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900';

    const variantStyles = {
      primary:
        'bg-slate-900 hover:bg-slate-800 text-white shadow-sm dark:bg-emerald-500 dark:hover:bg-emerald-400 dark:text-slate-950 dark:shadow-none active:scale-[0.98]',
      secondary:
        'bg-surface hover:bg-surface-muted text-fg border border-line shadow-2xs hover:border-slate-300 dark:hover:border-slate-700',
      ghost:
        'bg-transparent hover:bg-surface-muted text-fg-muted hover:text-fg border border-transparent',
      danger:
        'bg-red-600 hover:bg-red-700 text-white shadow-xs active:bg-red-800 dark:bg-red-500 dark:hover:bg-red-600',
      sage:
        'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm shadow-emerald-600/20 active:bg-emerald-800 dark:bg-emerald-500 dark:text-slate-950',
      emerald:
        'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm shadow-emerald-600/20 active:bg-emerald-800 dark:bg-emerald-500 dark:text-slate-950',
      outline:
        'bg-transparent hover:bg-surface-muted text-fg border border-line hover:border-slate-300 dark:hover:border-slate-700',
    };

    const sizeStyles = {
      sm: 'px-3 py-1.5 text-sm gap-1.5',
      md: 'px-4 py-2 text-sm gap-2',
      lg: 'px-6 py-3 text-base gap-2.5',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
        {...props}
      >
        {isLoading ? (
          <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" aria-hidden="true" />
        ) : (
          icon && iconPosition === 'left' && <span className="flex-shrink-0" aria-hidden="true">{icon}</span>
        )}
        <span>{children}</span>
        {!isLoading && icon && iconPosition === 'right' && (
          <span className="flex-shrink-0" aria-hidden="true">{icon}</span>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
