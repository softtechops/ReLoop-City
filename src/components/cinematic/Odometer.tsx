import React, { useEffect, useRef, useState } from 'react';
import { useUiPrefs } from '../../store/useUiPrefs';

interface OdometerProps {
  value: number;
  decimals?: number;
  className?: string;
  prefix?: string;
  suffix?: string;
}

export const Odometer: React.FC<OdometerProps> = ({
  value,
  decimals = 1,
  className = '',
  prefix = '',
  suffix = '',
}) => {
  const reduce = useUiPrefs((s) => s.reduceEffects);
  const [display, setDisplay] = useState(value);
  const [flash, setFlash] = useState(false);
  const prev = useRef(value);

  useEffect(() => {
    if (reduce) {
      setDisplay(value);
      return;
    }
    const from = prev.current;
    const start = performance.now();
    const dur = 420;
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / dur);
      const ease = 1 - Math.pow(1 - p, 3);
      setDisplay(from + (value - from) * ease);
      if (p < 1) raf = requestAnimationFrame(tick);
      else prev.current = value;
    };
    if (from !== value) {
      setFlash(true);
      const to = window.setTimeout(() => setFlash(false), 280);
      raf = requestAnimationFrame(tick);
      return () => {
        cancelAnimationFrame(raf);
        window.clearTimeout(to);
      };
    }
    return () => cancelAnimationFrame(raf);
  }, [value, reduce]);

  const formatted = Number.isFinite(display)
    ? display.toLocaleString('en-IN', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })
    : '—';

  return (
    <span
      className={`inline-block tabular-nums font-display tracking-tight ${flash ? 'text-emerald-300 drop-shadow-[0_0_12px_rgba(52,211,153,0.85)]' : ''} ${className}`}
    >
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
};
