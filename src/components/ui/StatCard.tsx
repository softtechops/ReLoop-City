import React from 'react';
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
  accentColor?: 'navy' | 'sage' | 'amber' | 'charcoal';
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
  const accentBorder = {
    navy: 'hover:border-navy-400',
    sage: 'hover:border-sage-400',
    amber: 'hover:border-amberGold-400',
    charcoal: 'hover:border-charcoal-400',
  }[accentColor];

  const valueColor = {
    navy: 'text-navy-900',
    sage: 'text-sage-700',
    amber: 'text-amberGold-700',
    charcoal: 'text-charcoal-800',
  }[accentColor];

  return (
    <div
      className={`relative rounded-2xl bg-white border border-navy-100 shadow-blueprint transition-all duration-200 ${accentBorder} ${
        isHero
          ? 'p-6 sm:p-7 bg-gradient-to-b from-white to-[#F8FAFC]/50 ring-1 ring-navy-700/5'
          : 'p-5 sm:p-6'
      }`}
    >
      {/* Top Row: Title + Info Popover */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          {icon && (
            <span className="p-1.5 rounded-lg bg-navy-50 text-navy-700 flex-shrink-0" aria-hidden="true">
              {icon}
            </span>
          )}
          <span className="text-xs font-bold uppercase tracking-wider text-charcoal-500">
            {title}
          </span>
        </div>
        <InfoPopover content={calculationInfo} label={`Learn how ${title} is calculated`} />
      </div>

      {/* Main Metric Value */}
      <div className="flex items-baseline gap-2 mb-2 flex-wrap">
        <span
          className={`font-black font-['Outfit'] tracking-tight ${
            isHero ? 'text-3xl sm:text-4xl' : 'text-2xl sm:text-3xl'
          } ${valueColor}`}
        >
          {value}
        </span>
        {unit && (
          <span className="text-sm font-semibold text-charcoal-500">
            {unit}
          </span>
        )}
      </div>

      {/* Bottom Subtitle / Delta Row */}
      <div className="pt-2 border-t border-navy-50 flex items-center justify-between gap-2 text-xs">
        {subtitle ? (
          <span className="text-charcoal-500 text-xs truncate">{subtitle}</span>
        ) : delta ? (
          <div className="flex items-center gap-1.5 flex-wrap">
            {delta.isNeutral ? (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md font-semibold text-xs bg-navy-50 text-charcoal-700">
                <Minus className="w-3.5 h-3.5" aria-hidden="true" />
                <span>{delta.percentStr}</span>
              </span>
            ) : delta.isImprovement ? (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md font-bold text-xs bg-sage-100 text-sage-800">
                <ArrowUpRight className="w-3.5 h-3.5 text-sage-700" aria-hidden="true" />
                <span>{delta.percentStr}</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md font-bold text-xs bg-red-100 text-red-800">
                <ArrowDownRight className="w-3.5 h-3.5 text-red-700" aria-hidden="true" />
                <span>{delta.percentStr}</span>
              </span>
            )}
            <span className="text-charcoal-500 text-xs" aria-hidden="true">
              {deltaLabel}
            </span>
            <span className="sr-only">{delta.ariaLabel}</span>
          </div>
        ) : (
          <span className="text-charcoal-400 text-xs">Active Pilot Feed</span>
        )}
      </div>
    </div>
  );
};
