import { useState, useEffect, useCallback } from 'react';

export type Theme = 'light' | 'dark' | 'system';
export type ResolvedTheme = 'light' | 'dark';

const STORAGE_KEY = 'reloop-theme';

function getStoredTheme(): Theme {
  try {
    const val = localStorage.getItem(STORAGE_KEY);
    if (val === 'light' || val === 'dark' || val === 'system') {
      return val;
    }
  } catch {
    // LocalStorage unavailable
  }
  return 'system'; // Default is system, follows OS live
}

function getSystemPrefersDark(): boolean {
  if (typeof window === 'undefined' || !window.matchMedia) return false;
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

function applyThemeToDocument(resolved: ResolvedTheme, animate = true) {
  if (typeof document === 'undefined') return;

  const root = document.documentElement;
  const isReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (animate && !isReducedMotion) {
    root.classList.add('theme-transition');
    window.setTimeout(() => {
      root.classList.remove('theme-transition');
    }, 200);
  }

  if (resolved === 'dark') {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }

  const meta = document.getElementById('theme-color-meta') || document.querySelector('meta[name="theme-color"]');
  if (meta) {
    meta.setAttribute('content', resolved === 'dark' ? '#0B1220' : '#F8FAFC');
  }
}

// Global subscribers for synchronizing across component instances
const listeners = new Set<() => void>();
let globalTheme: Theme = typeof window !== 'undefined' ? getStoredTheme() : 'system';

export function useTheme() {
  const [theme, setInternalTheme] = useState<Theme>(globalTheme);
  const [systemDark, setSystemDark] = useState<boolean>(getSystemPrefersDark);

  const resolvedTheme: ResolvedTheme = theme === 'system' ? (systemDark ? 'dark' : 'light') : theme;

  useEffect(() => {
    const handleChange = () => {
      setInternalTheme(globalTheme);
    };
    listeners.add(handleChange);
    return () => {
      listeners.delete(handleChange);
    };
  }, []);

  // Sync OS prefers-color-scheme changes
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const update = (e: MediaQueryListEvent) => {
      setSystemDark(e.matches);
      if (globalTheme === 'system') {
        applyThemeToDocument(e.matches ? 'dark' : 'light', true);
      }
    };

    if (media.addEventListener) {
      media.addEventListener('change', update);
      return () => media.removeEventListener('change', update);
    } else if ('addListener' in media) {
      // Legacy browser support
      (media as { addListener: (cb: (e: MediaQueryListEvent) => void) => void }).addListener(update);
      return () => {
        (media as { removeListener: (cb: (e: MediaQueryListEvent) => void) => void }).removeListener(update);
      };
    }
  }, []);

  const setTheme = useCallback((newTheme: Theme) => {
    globalTheme = newTheme;
    try {
      localStorage.setItem(STORAGE_KEY, newTheme);
    } catch {
      // LocalStorage unavailable
    }

    const currentSystemDark = getSystemPrefersDark();
    const resolved: ResolvedTheme = newTheme === 'system' ? (currentSystemDark ? 'dark' : 'light') : newTheme;
    applyThemeToDocument(resolved, true);

    listeners.forEach((listener) => listener());
  }, []);

  const toggle = useCallback(() => {
    const next = resolvedTheme === 'dark' ? 'light' : 'dark';
    setTheme(next);
  }, [resolvedTheme, setTheme]);

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
