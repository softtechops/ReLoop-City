import React, { useRef } from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  spotlight?: boolean;
  as?: 'div' | 'section' | 'article';
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className = '',
  spotlight = true,
  as: Tag = 'div',
}) => {
  const ref = useRef<HTMLDivElement>(null);

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty('--spot-x', `${e.clientX - r.left}px`);
    el.style.setProperty('--spot-y', `${e.clientY - r.top}px`);
  };

  return (
    <Tag
      ref={ref as never}
      onMouseMove={spotlight ? onMove : undefined}
      className={`glass-panel rounded-2xl ${spotlight ? 'spotlight-card' : ''} ${className}`}
    >
      {children}
    </Tag>
  );
};
