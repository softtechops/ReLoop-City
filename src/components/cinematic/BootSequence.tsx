import React, { useEffect, useState } from 'react';
import { consumeBootPending, markBootShown, useUiPrefs } from '../../store/useUiPrefs';

const LINES = [
  'Connecting 100 smart bins…',
  'Calibrating Pune PCMC corridor…',
  'Hydrating CVRP solver…',
  'ReLoop AI online ✓',
];

export const BootSequence: React.FC<{ onDone: () => void }> = ({ onDone }) => {
  const reduce = useUiPrefs((s) => s.reduceEffects);
  const [line, setLine] = useState(0);
  const [progress, setProgress] = useState(8);

  useEffect(() => {
    if (reduce) {
      markBootShown();
      onDone();
      return;
    }
    const t = window.setInterval(() => {
      setLine((n) => Math.min(LINES.length - 1, n + 1));
      setProgress((p) => Math.min(100, p + 28));
    }, 280);
    const end = window.setTimeout(() => {
      markBootShown();
      onDone();
    }, 1200);
    const skip = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        markBootShown();
        onDone();
      }
    };
    window.addEventListener('keydown', skip);
    return () => {
      window.clearInterval(t);
      window.clearTimeout(end);
      window.removeEventListener('keydown', skip);
    };
  }, [onDone, reduce]);

  return (
    <div
      className="fixed inset-0 z-[80] bg-[#060B14] text-emerald-100 flex flex-col items-center justify-center px-6 cursor-pointer"
      role="dialog"
      aria-label="Entering command center"
      onClick={() => {
        markBootShown();
        onDone();
      }}
    >
      <div className="absolute inset-0 blueprint-grid-dark opacity-70" style={{ animation: 'bootGrid 0.8s ease both' }} />
      <p className="relative z-10 font-mono text-xs uppercase tracking-[0.3em] text-emerald-400 mb-6">System boot</p>
      <div className="relative z-10 w-full max-w-md space-y-2 font-mono text-sm">
        {LINES.slice(0, line + 1).map((l) => (
          <p key={l} className="text-emerald-200">{'>'} {l}</p>
        ))}
      </div>
      <div className="relative z-10 mt-8 w-full max-w-md h-1.5 rounded-full bg-white/10 overflow-hidden">
        <div
          className="h-full bg-emerald-400 shadow-[0_0_16px_#34D399]"
          style={{ width: `${progress}%`, transition: 'width 0.28s ease' }}
        />
      </div>
      <p className="relative z-10 mt-6 text-xs text-slate-400">Click or press Esc to skip</p>
    </div>
  );
};

export function shouldPlayBoot(): boolean {
  const reduce = useUiPrefs.getState().reduceEffects;
  if (reduce || (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches)) {
    return false;
  }
  return consumeBootPending();
}
