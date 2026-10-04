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
  isHero = false,
  accentColor = 'navy',
  icon,
  subtitle,
}) => {
  // Map legacy 'sage' to 'emerald' as per global color palette rules
  const normalizedColor = accentColor === 'sage' ? 'emerald' : accentColor;

  const accentBorder = {
    navy: 'hover:border-navy-400',
    emerald: 'hover:border-emerald-400',
    amber: 'hover:border-amber-400',
    charcoal: 'hover:border-charcoal-400',
  }[normalizedColor];

  const valueColor = {
    navy: 'text-navy-900',
    emerald: 'text-emerald-700',
    amber: 'text-amber-700',
    charcoal: 'text-charcoal-800',
  }[normalizedColor];

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
        const timer = setTimeout(() => setIsHighlighted(false), 900);
        return () => clearTimeout(timer);
      }
    }
  }, [value]);

  return (
    <div
      className={`relative rounded-2xl bg-white border border-charcoal-200 shadow-sm hover:shadow-md transition-all duration-200 ${accentBorder} ${
        isHero
          ? 'p-6 sm:p-7 bg-gradient-to-b from-white to-slate-50/60 ring-1 ring-navy-900/5'
          : 'p-5 sm:p-6'
      }`}
    >
      {/* Top Row: Title + Info Popover */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          {icon && (
            <span className="p-1.5 rounded-xl bg-navy-50 text-navy-800 flex-shrink-0" aria-hidden="true">
              {icon}
            </span>
          )}
          <span className="text-xs font-bold uppercase tracking-wider text-charcoal-600">
            {title}
          </span>
        </div>
        <InfoPopover content={calculationInfo} label={`Learn how ${title} is calculated`} />
      </div>

      {/* Main Metric Value with Sparkline */}
      <div className="flex items-end justify-between gap-3 mb-2 flex-wrap">
        <div className="flex items-baseline gap-2 flex-wrap">
          <span
            className={`font-black font-heading tracking-tight transition-all duration-300 rounded-md px-1 -mx-1 ${
              isHero ? 'text-3xl sm:text-4xl md:text-5xl' : 'text-2xl sm:text-3xl'
            } ${valueColor} ${
              isHighlighted
                ? 'bg-emerald-100 text-emerald-900 ring-2 ring-emerald-400 scale-[1.02]'
                : ''
            }`}
          >
            {value}
          </span>
          {unit && (
            <span className="text-sm font-semibold text-charcoal-600">
              {unit}
            </span>
          )}
        </div>

        {/* Decorative mini sparkline curve */}
        <div className="w-16 h-7 flex-shrink-0 opacity-80 pb-1" aria-hidden="true">
          <svg viewBox="0 0 64 28" fill="none" className="w-full h-full">
            <path
              d="M 2 22 Q 18 10 32 16 T 62 4"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={normalizedColor === 'emerald' ? 'text-emerald-500' : normalizedColor === 'amber' ? 'text-amber-500' : 'text-navy-600'}
            />
          </svg>
        </div>
      </div>

      {/* Bottom Subtitle / Delta Row */}
      <div className="pt-2 border-t border-charcoal-100 flex items-center justify-between gap-2 text-sm">
        {subtitle ? (
          <span className="text-charcoal-600 text-sm truncate">{subtitle}</span>
        ) : delta ? (
          <div className="flex items-center gap-1.5 flex-wrap">
            {delta.isNeutral ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg font-semibold text-xs bg-charcoal-100 text-charcoal-700">
                <Minus className="w-3.5 h-3.5" aria-hidden="true" />
                <span>{delta.percentStr}</span>
              </span>
            ) : delta.isImprovement ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg font-bold text-xs bg-emerald-100 text-emerald-800 border border-emerald-200">
                <ArrowUpRight className="w-3.5 h-3.5 text-emerald-700" aria-hidden="true" />
                <span>{delta.percentStr}</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg font-bold text-xs bg-red-100 text-red-800 border border-red-200">
                <ArrowDownRight className="w-3.5 h-3.5 text-red-700" aria-hidden="true" />
                <span>{delta.percentStr}</span>
              </span>
            )}
            <span className="text-charcoal-600 text-sm font-medium" aria-hidden="true">
              {deltaLabel}
            </span>
            <span className="sr-only">{delta.ariaLabel}</span>
          </div>
        ) : (
          <span className="text-charcoal-500 text-sm">Live Pilot Corridor</span>
        )}
      </div>
    </div>
  );
};
