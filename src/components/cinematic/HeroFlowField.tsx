import React, { useEffect, useRef } from 'react';
import { useUiPrefs } from '../../store/useUiPrefs';

/** SVG city skyline + waste particles flowing into 4 circular outputs. */
export const HeroFlowField: React.FC = () => {
  const reduce = useUiPrefs((s) => s.reduceEffects);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || reduce) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let raf = 0;
    let alive = true;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);

    const targets = [0.18, 0.4, 0.62, 0.84];
    const dots = Array.from({ length: 70 }, (_, i) => ({
      t: Math.random(),
      lane: i % 4,
      speed: 0.0018 + Math.random() * 0.0025,
    }));

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      canvas.width = r.width * dpr;
      canvas.height = r.height * dpr;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const vis = () => {
      alive = document.visibilityState === 'visible';
    };
    document.addEventListener('visibilitychange', vis);

    const bezier = (t: number, lane: number, w: number, h: number) => {
      const x0 = w * 0.08;
      const y0 = h * (0.35 + (lane * 0.08) % 0.22);
      const x1 = w * 0.42;
      const y1 = h * 0.2;
      const x2 = w * targets[lane];
      const y2 = h * 0.72;
      const u = 1 - t;
      const x = u * u * x0 + 2 * u * t * x1 + t * t * x2;
      const y = u * u * y0 + 2 * u * t * y1 + t * t * y2;
      return [x, y] as const;
    };

    const colors = ['#34D399', '#22D3EE', '#A3E635', '#FBBF24'];

    const loop = () => {
      if (!alive) {
        raf = requestAnimationFrame(loop);
        return;
      }
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = 'lighter';
      dots.forEach((d) => {
        d.t += d.speed;
        if (d.t > 1) d.t = 0;
        const [x, y] = bezier(d.t, d.lane, w, h);
        ctx.beginPath();
        ctx.fillStyle = colors[d.lane];
        ctx.globalAlpha = 0.55;
        ctx.arc(x, y, 2.2 * dpr, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = 'source-over';
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      ro.disconnect();
      document.removeEventListener('visibilitychange', vis);
    };
  }, [reduce]);

  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 800 420" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="skyline" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#34D399" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#060B14" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path
          fill="url(#skyline)"
          d="M0 280 L40 260 L55 300 L80 220 L110 280 L140 180 L160 240 L190 160 L220 250 L250 200 L280 270 L320 140 L350 230 L390 170 L430 260 L470 150 L510 240 L540 190 L580 270 L620 160 L660 250 L700 200 L740 280 L800 220 L800 420 L0 420 Z"
        />
      </svg>
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      <div className="absolute bottom-6 left-0 right-0 grid grid-cols-4 gap-2 px-4 text-center">
        {['Power', 'Bio-CNG', 'Compost', 'Recycled'].map((label) => (
          <div key={label} className="text-[10px] sm:text-xs font-mono uppercase tracking-widest text-emerald-200/90">
            {label}
          </div>
        ))}
      </div>
    </div>
  );
};
