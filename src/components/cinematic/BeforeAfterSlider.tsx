import React, { useRef, useState } from 'react';

interface BeforeAfterSliderProps {
  beforeLabel?: string;
  afterLabel?: string;
}

export const BeforeAfterSlider: React.FC<BeforeAfterSliderProps> = ({
  beforeLabel = 'Baseline — linear city',
  afterLabel = 'ReLoop — circular city',
}) => {
  const [pct, setPct] = useState(52);
  const track = useRef<HTMLDivElement>(null);

  const setFromClientX = (clientX: number) => {
    const el = track.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const next = ((clientX - r.left) / r.width) * 100;
    setPct(Math.max(4, Math.min(96, next)));
  };

  return (
    <div
      ref={track}
      className="relative h-[280px] sm:h-[380px] rounded-3xl overflow-hidden border border-white/10 select-none"
      onPointerDown={(e) => {
        (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
        setFromClientX(e.clientX);
      }}
      onPointerMove={(e) => {
        if (e.buttons === 1) setFromClientX(e.clientX);
      }}
      role="slider"
      aria-label="Compare baseline chaos with ReLoop circular operations"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(pct)}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'ArrowLeft') setPct((p) => Math.max(4, p - 4));
        if (e.key === 'ArrowRight') setPct((p) => Math.min(96, p + 4));
      }}
    >
      <Scene variant="reloop" />
      <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pct}% 0 0)` }}>
        <Scene variant="baseline" />
      </div>
      <div
        className="absolute top-0 bottom-0 w-0.5 bg-white shadow-[0_0_18px_rgba(255,255,255,0.8)]"
        style={{ left: `${pct}%` }}
      >
        <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-11 h-11 rounded-full bg-white text-slate-900 grid place-items-center font-bold shadow-lg">
          ↔
        </div>
      </div>
      <span className="absolute top-4 left-4 text-xs font-semibold px-2.5 py-1 rounded-full bg-rose-500/20 text-rose-100 border border-rose-400/40">
        {beforeLabel}
      </span>
      <span className="absolute top-4 right-4 text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-100 border border-emerald-400/40">
        {afterLabel}
      </span>
    </div>
  );
};

const Scene: React.FC<{ variant: 'baseline' | 'reloop' }> = ({ variant }) => {
  const chaos = variant === 'baseline';
  return (
    <div className={`absolute inset-0 ${chaos ? 'bg-[#1a0d12]' : 'bg-[#07140f]'}`}>
      <svg viewBox="0 0 640 360" className="w-full h-full">
        {[...Array(8)].map((_, i) => (
          <circle
            key={i}
            cx={80 + i * 70}
            cy={chaos ? 80 + (i % 3) * 70 : 160}
            r={chaos ? 10 + (i % 4) * 4 : 8}
            fill={chaos ? (i % 2 ? '#F43F5E' : '#FBBF24') : '#34D399'}
            opacity={chaos ? 0.85 : 0.9}
          />
        ))}
        <path
          d={
            chaos
              ? 'M40 280 C 120 40, 200 320, 280 80 S 460 300, 600 60'
              : 'M40 200 C 180 180, 320 170, 600 160'
          }
          fill="none"
          stroke={chaos ? '#F43F5E' : '#34D399'}
          strokeWidth={chaos ? 4 : 3}
          opacity="0.85"
        />
        <text x="24" y="340" fill={chaos ? '#FDA4AF' : '#A7F3D0'} fontSize="12" fontFamily="IBM Plex Mono, monospace">
          {chaos ? 'Overflowing bins · long routes' : 'Balanced bins · short routes'}
        </text>
      </svg>
    </div>
  );
};
