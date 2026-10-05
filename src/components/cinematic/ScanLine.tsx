import React from 'react';

export const ScanLine: React.FC<{ active: boolean }> = ({ active }) => {
  if (!active) return null;
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-2xl" aria-hidden="true">
      <div className="absolute left-0 right-0 h-12 bg-gradient-to-b from-transparent via-cyan-300/40 to-transparent animate-[scan_2s_ease-in-out_infinite]" />
    </div>
  );
};

export const RippleBoot: React.FC<{ show: boolean }> = ({ show }) => {
  if (!show) return null;
  return (
    <span className="absolute inset-0 rounded-full border border-emerald-400/70 animate-ping" aria-hidden="true" />
  );
};
