import React, { useState, useEffect, useRef } from 'react';
import { InfoPopover } from './InfoPopover';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

export interface StatCardProps {
  title: string;
  value: string | number;
  unit?: string;
  calculationInfo: string;
  delta?: {
    percentStr: string;
    isPositive: boolean;
    isNeutral: boolean;
    isImprovement: boolean;
    ariaLabel: string;
  };
  deltaLabel?: string;
  isHero?: boolean;
  accentColor?: 'navy' | 'emerald' | 'sage' | 'amber' | 'charcoal';
  icon?: React.ReactNode;
  subtitle?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  unit,
  calculationInfo,
  delta,
  deltaLabel = 'vs Baseline',
  accentColor = 'emerald',
  icon,
  subtitle,
}) => {
  const normalizedColor = accentColor === 'sage' ? 'emerald' : accentColor;

  // Brief highlight on value change (respects prefers-reduced-motion)
  const [isHighlighted, setIsHighlighted] = useState(false);
  const prevValueRef = useRef(value);
  const isInitialMount = useRef(true);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    if (prevValueRef.current !== value) {
      prevValueRef.current = value;
      const prefersReducedMotion =
        typeof window !== 'undefined' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (!prefersReducedMotion) {
        setIsHighlighted(true);
        const timer = setTimeout(() => setIsHighlighted(false), 800);
        return () => clearTimeout(timer);
      }
    }
  }, [value]);

  return (
    <div
      className="relative rounded-2xl bg-surface border border-line shadow-xs p-6 sm:p-8 hover:-translate-y-0.5 hover:border-emerald-500/50 hover:shadow-sm transition-all duration-200 flex flex-col justify-between h-full"
    >
      {/* Top Row: Label + Icon (Tooltip on label, no ? icon clutter) */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            {icon && (
              <span className="text-fg-subtle flex-shrink-0" aria-hidden="true">
                {icon}
              </span>
            )}
            <span
              className="text-sm font-medium text-fg-muted cursor-help border-b border-dotted border-fg-subtle/40 hover:text-fg hover:border-fg-subtle transition-colors"
              title={calculationInfo}
              tabIndex={0}
              aria-label={`${title}: ${calculationInfo}`}
            >
              {title}
            </span>
          </div>
        </div>

        {/* Main Metric Value with Sparkline */}
        <div className="flex items-baseline justify-between gap-3 mb-2 flex-wrap">
          <div className="flex items-baseline gap-2 flex-wrap">
            <span
              className={`text-4xl font-semibold tabular-nums text-fg tracking-tight transition-colors duration-200 ${
                isHighlighted ? 'text-emerald-500' : ''
              }`}
            >
              {value}
            </span>
            {unit && (
              <span className="text-sm font-normal text-fg-muted">
                {unit}
              </span>
            )}
          </div>

          {/* Clean minimal sparkline */}
          <div className="w-14 h-6 flex-shrink-0 opacity-70 pb-0.5" aria-hidden="true">
            <svg viewBox="0 0 56 24" fill="none" className="w-full h-full">
              <path
                d="M 2 19 C 14 17, 24 8, 36 12 C 44 14, 48 5, 54 4"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={
                  normalizedColor === 'amber'
                    ? 'text-amber-500'
                    : 'text-emerald-500'
                }
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Bottom Row: Delta Badge or Subtitle */}
      <div className="pt-3 border-t border-line flex items-center justify-between gap-2 text-sm">
        {subtitle ? (
          <span className="text-fg-muted text-sm truncate">{subtitle}</span>
        ) : delta ? (
          <div className="flex items-center gap-2 flex-wrap">
            {delta.isNeutral ? (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-medium text-xs bg-surface-muted text-fg-muted border border-line">
                <Minus className="w-3 h-3" aria-hidden="true" />
                <span>{delta.percentStr}</span>
              </span>
            ) : delta.isImprovement ? (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-medium text-xs bg-emerald-50 text-emerald-800 border border-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-300 dark:border-emerald-500/30">
                <ArrowUpRight className="w-3 h-3 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
                <span>{delta.percentStr}</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-medium text-xs bg-rose-50 text-rose-800 border border-rose-200 dark:bg-rose-500/15 dark:text-rose-300 dark:border-rose-500/30">
                <ArrowDownRight className="w-3 h-3 text-rose-600 dark:text-rose-400" aria-hidden="true" />
                <span>{delta.percentStr}</span>
              </span>
            )}
            <span className="text-fg-subtle text-xs font-medium" aria-hidden="true">
              {deltaLabel}
            </span>
            <span className="sr-only">{delta.ariaLabel}</span>
          </div>
        ) : (
          <span className="text-fg-subtle text-xs">Pilot corridor</span>
        )}
      </div>
    </div>
  );
};
