import React, { useEffect, useRef } from 'react';
import { useUiPrefs } from '../../store/useUiPrefs';

interface ParticleFlowProps {
  className?: string;
  density?: number;
}

export const ParticleFlow: React.FC<ParticleFlowProps> = ({ className = '', density = 48 }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduce = useUiPrefs((s) => s.reduceEffects);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || reduce) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let raf = 0;
    let running = true;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);

    const particles = Array.from({ length: density }, () => ({
      x: Math.random(),
      y: Math.random(),
      v: 0.0004 + Math.random() * 0.0012,
      r: 0.6 + Math.random() * 1.4,
    }));

    const resize = () => {
      const { width, height } = canvas.getBoundingClientRect();
      canvas.width = Math.max(1, width * dpr);
      canvas.height = Math.max(1, height * dpr);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const onVis = () => {
      running = document.visibilityState === 'visible';
    };
    document.addEventListener('visibilitychange', onVis);

    const loop = () => {
      if (!running) {
        raf = requestAnimationFrame(loop);
        return;
      }
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);
      particles.forEach((p) => {
        p.x += p.v;
        if (p.x > 1.05) {
          p.x = -0.05;
          p.y = Math.random();
        }
        ctx.beginPath();
        ctx.fillStyle = 'rgba(52,211,153,0.55)';
        ctx.arc(p.x * w, p.y * h, p.r * dpr, 0, Math.PI * 2);
        ctx.fill();
      });
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      ro.disconnect();
      document.removeEventListener('visibilitychange', onVis);
    };
  }, [density, reduce]);

  if (reduce) return <div className={className} aria-hidden="true" />;

  return <canvas ref={canvasRef} className={`absolute inset-0 pointer-events-none ${className}`} aria-hidden="true" />;
};
