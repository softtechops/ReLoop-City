import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../lib/useTheme';

interface ThemeToggleProps {
  className?: string;
  showTooltip?: boolean;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  className = '',
  showTooltip = true,
}) => {
  const { resolvedTheme, toggle } = useTheme();
  const isDark = resolvedTheme === 'dark';

  const label = isDark ? 'Switch to day mode' : 'Switch to night mode';
  const tooltipText = `${label} (Press T)`;

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={label}
      aria-pressed={isDark}
      title={showTooltip ? tooltipText : undefined}
      className={`relative min-h-[44px] min-w-[44px] p-2.5 rounded-xl border border-line bg-surface hover:bg-surface-muted text-fg hover:text-emerald-500 transition-colors flex items-center justify-center cursor-pointer shadow-xs focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-emerald-500 select-none ${className}`}
    >
      <div className="relative w-5 h-5 flex items-center justify-center overflow-hidden">
        {/* Sun Icon */}
        <Sun
          className={`w-5 h-5 absolute text-amber-500 transition-all duration-200 ease-out ${
            isDark
              ? 'opacity-0 -rotate-90 scale-50 pointer-events-none'
              : 'opacity-100 rotate-0 scale-100'
          }`}
          aria-hidden="true"
        />
        {/* Moon Icon */}
        <Moon
          className={`w-4.5 h-4.5 absolute text-emerald-400 transition-all duration-200 ease-out ${
            isDark
              ? 'opacity-100 rotate-0 scale-100'
              : 'opacity-0 rotate-90 scale-50 pointer-events-none'
          }`}
          aria-hidden="true"
        />
      </div>
      <span className="sr-only">{label}</span>
    </button>
  );
};
