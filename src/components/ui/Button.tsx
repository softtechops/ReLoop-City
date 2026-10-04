import React, { forwardRef } from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'sage';
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
      'inline-flex items-center justify-center font-semibold rounded-xl transition-all select-none min-h-[44px] sm:min-h-[38px] active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-navy-600 focus-visible:ring-offset-2';

    const variantStyles = {
      primary:
        'bg-navy-700 hover:bg-navy-800 text-white shadow-sm shadow-navy-700/20 active:bg-navy-900',
      secondary:
        'bg-white hover:bg-navy-50 text-navy-800 border border-navy-200 shadow-xs hover:border-navy-300',
      ghost:
        'bg-transparent hover:bg-navy-50/80 text-charcoal-700 hover:text-navy-900 border border-transparent',
      danger:
        'bg-red-600 hover:bg-red-700 text-white shadow-xs active:bg-red-800',
      sage:
        'bg-sage-600 hover:bg-sage-700 text-white shadow-sm shadow-sage-600/20 active:bg-sage-800',
    };

    const sizeStyles = {
      sm: 'px-3 py-1.5 text-xs gap-1.5',
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
