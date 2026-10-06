import { useState, useEffect, useCallback } from 'react';

export type Theme = 'light' | 'dark';
export type ResolvedTheme = 'light' | 'dark';

// Clean up any legacy saved theme key so old values cannot force dark mode
try {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('reloop-theme');
  }
} catch {
  // LocalStorage unavailable
}

function applyThemeToDocument(resolved: ResolvedTheme, animate = true) {
  if (typeof document === 'undefined') return;

  const root = document.documentElement;
  const isReducedMotion = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (animate && !isReducedMotion) {
    root.classList.add('theme-transition');
    window.setTimeout(() => {
      root.classList.remove('theme-transition');
    }, 200);
  }

  if (resolved === 'dark') {
    root.classList.add('dark');
    root.style.colorScheme = 'dark';
  } else {
    root.classList.remove('dark');
    root.style.colorScheme = 'light';
  }

  const meta = document.getElementById('theme-color-meta') || document.querySelector('meta[name="theme-color"]');
  if (meta) {
    meta.setAttribute('content', resolved === 'dark' ? '#0B1220' : '#F8FAFC');
  }
}

// In-memory session theme state: ALWAYS starts in Light mode on every fresh visit / page load
const listeners = new Set<() => void>();
let globalTheme: Theme = 'light';

export function useTheme() {
  const [theme, setInternalTheme] = useState<Theme>(globalTheme);
  const resolvedTheme: ResolvedTheme = theme;

  useEffect(() => {
    const handleChange = () => {
      setInternalTheme(globalTheme);
    };
    listeners.add(handleChange);
    return () => {
      listeners.delete(handleChange);
    };
  }, []);

  const setTheme = useCallback((newTheme: Theme) => {
    globalTheme = newTheme;
    applyThemeToDocument(newTheme, true);
    listeners.forEach((listener) => listener());
  }, []);

  const toggle = useCallback(() => {
    const next: Theme = globalTheme === 'dark' ? 'light' : 'dark';
    setTheme(next);
  }, [setTheme]);

  // Global 'T' shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 't' || e.key === 'T') {
        const target = e.target as HTMLElement | null;
        if (
          target &&
          (target.tagName === 'INPUT' ||
            target.tagName === 'TEXTAREA' ||
            target.tagName === 'SELECT' ||
            target.isContentEditable)
        ) {
          return;
        }
        if (!e.ctrlKey && !e.metaKey && !e.altKey) {
          e.preventDefault();
          toggle();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggle]);

  return {
    theme,
    resolvedTheme,
    setTheme,
    toggle,
  };
}
