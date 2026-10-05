import React from 'react';

export interface SectionCardProps {
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  headerAction?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  padding?: 'normal' | 'compact' | 'none';
  id?: string;
}

export const SectionCard: React.FC<SectionCardProps> = ({
  title,
  subtitle,
  headerAction,
  children,
  footer,
  className = '',
  padding = 'normal',
  id,
}) => {
  const paddingClass = {
    normal: 'p-6',
    compact: 'p-4',
    none: 'p-0',
  }[padding];

  return (
    <section
      id={id}
      className={`rounded-2xl bg-white border border-slate-200 shadow-sm transition-shadow duration-200 overflow-hidden ${className}`}
    >
      {(title || headerAction) && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-6 pt-6 pb-4 border-b border-slate-100">
          <div>
            {typeof title === 'string' ? (
              <h2 className="text-xl font-semibold text-slate-900">
                {title}
              </h2>
            ) : (
              title
            )}
            {subtitle && (
              <div className="text-sm text-slate-500 mt-0.5">
                {subtitle}
              </div>
            )}
          </div>
          {headerAction && (
            <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
              {headerAction}
            </div>
          )}
        </div>
      )}

      <div className={paddingClass}>{children}</div>

      {footer && (
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-100 text-xs text-slate-500">
          {footer}
        </div>
      )}
    </section>
  );
};
