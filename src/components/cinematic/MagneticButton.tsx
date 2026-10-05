import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { requestBootSequence } from '../../store/useUiPrefs';

interface MagneticButtonProps {
  to: string;
  children: React.ReactNode;
  className?: string;
  onNavigate?: () => void;
}

export const MagneticButton: React.FC<MagneticButtonProps> = ({
  to,
  children,
  className = '',
  onNavigate,
}) => {
  const ref = useRef<HTMLAnchorElement>(null);

  return (
    <Link
      ref={ref}
      to={to}
      onClick={() => {
        requestBootSequence();
        onNavigate?.();
      }}
      onMouseMove={(e) => {
        const el = ref.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        const x = e.clientX - r.left - r.width / 2;
        const y = e.clientY - r.top - r.height / 2;
        el.style.transform = `translate(${x * 0.12}px, ${y * 0.12}px)`;
      }}
      onMouseLeave={() => {
        if (ref.current) ref.current.style.transform = 'translate(0,0)';
      }}
      className={`relative overflow-hidden btn-press inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-semibold text-base shadow-[0_0_32px_rgba(52,211,153,0.45)] min-h-[48px] transition-transform duration-150 ease-spring ${className}`}
    >
      <span className="absolute inset-0 pointer-events-none">
        <span className="absolute top-0 -left-1/2 h-full w-1/3 bg-white/30 blur-md animate-[shine_2.4s_linear_infinite]" />
      </span>
      <span className="relative z-10 flex items-center gap-2">{children}</span>
    </Link>
  );
};
