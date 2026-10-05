import React from 'react';
import { ParticleFlow } from './ParticleFlow';

const LINKS = [
  { from: 'Waste', to: 'Power', color: '#22D3EE' },
  { from: 'Waste', to: 'Bio-CNG', color: '#FBBF24' },
  { from: 'Waste', to: 'Compost', color: '#A3E635' },
  { from: 'Waste', to: 'Recycled', color: '#34D399' },
];

export const SankeyFlow: React.FC = () => {
  return (
    <div className="relative h-40 rounded-2xl overflow-hidden border border-white/10 bg-white/5">
      <ParticleFlow density={36} />
      <svg viewBox="0 0 400 160" className="absolute inset-0 w-full h-full">
        {LINKS.map((l, i) => (
          <path
            key={l.to}
            d={`M40 80 C 160 ${20 + i * 30}, 240 ${20 + i * 30}, 360 ${28 + i * 32}`}
            fill="none"
            stroke={l.color}
            strokeWidth="6"
            opacity="0.35"
          />
        ))}
        <text x="16" y="84" fill="#94A3B8" fontSize="11" fontFamily="IBM Plex Mono, monospace">In</text>
        {['Power', 'CNG', 'Compost', 'Recycle'].map((t, i) => (
          <text key={t} x="318" y={32 + i * 32} fill="#E2E8F0" fontSize="10" fontFamily="IBM Plex Mono, monospace">{t}</text>
        ))}
      </svg>
    </div>
  );
};
