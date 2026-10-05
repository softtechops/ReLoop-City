import React from 'react';
import { Odometer } from './Odometer';

interface GlowGaugeProps {
  percent: number;
  label: string;
  mode: 'reloop' | 'baseline';
}

export const GlowGauge: React.FC<GlowGaugeProps> = ({ percent, label, mode }) => {
  const clamped = Math.max(0, Math.min(100, percent));
  const r = 86;
  const c = 2 * Math.PI * r;
  const offset = c - (clamped / 100) * c;
  const color = mode === 'reloop' ? '#34D399' : '#FBBF24';
  const glow = mode === 'reloop' ? 'drop-shadow-[0_0_18px_rgba(52,211,153,0.55)]' : 'drop-shadow-[0_0_18px_rgba(251,191,36,0.45)]';

  return (
    <div className="relative flex flex-col items-center justify-center">
      <svg viewBox="0 0 200 200" className={`w-48 h-48 sm:w-56 sm:h-56 ${glow}`} aria-hidden="true">
        <circle cx="100" cy="100" r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="12" />
        <circle
          cx="100"
          cy="100"
          r={r}
          fill="none"
          stroke={color}
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
          transform="rotate(-90 100 100)"
          style={{ transition: 'stroke-dashoffset 0.6s cubic-bezier(0.22,1,0.36,1), stroke 0.4s ease' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <span className="text-[11px] uppercase tracking-[0.18em] text-slate-400 font-mono">{label}</span>
        <Odometer
          value={clamped}
          decimals={1}
          suffix="%"
          className="text-5xl sm:text-6xl font-bold text-white"
        />
        <span className={`text-xs font-semibold mt-1 ${mode === 'reloop' ? 'text-emerald-300' : 'text-amber-300'}`}>
          {mode === 'reloop' ? 'Circular loop' : 'Fixed schedule'}
        </span>
      </div>
    </div>
  );
};
