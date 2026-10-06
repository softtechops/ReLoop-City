import React, { useEffect, useState, useRef } from 'react';
import { useStore } from '../../store/useStore';
import { Sparkles, Clock, X, CheckCircle2, AlertTriangle, Info } from 'lucide-react';

export const Toast: React.FC = () => {
  const mode = useStore((state) => state.mode);
  const toastNotification = useStore((state) => state.toastNotification);
  const clearToast = useStore((state) => state.clearToast);

  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'info' | 'error' | 'reloop' | 'baseline';
  } | null>(null);

  const prevModeRef = useRef(mode);
  const isInitialMount = useRef(true);

  // Listen for mode changes
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    if (prevModeRef.current !== mode) {
      prevModeRef.current = mode;
      const message =
        mode === 'reloop'
          ? 'Switched to ReLoop mode (AI-optimized)'
          : 'Switched to Baseline mode (Fixed schedule)';
      setToast({ message, type: mode });
    }
  }, [mode]);

  // Listen for store toast notifications
  useEffect(() => {
    if (toastNotification) {
      setToast({ message: toastNotification.message, type: toastNotification.type || 'info' });
      clearToast();
    }
  }, [toastNotification, clearToast]);

  // Auto-dismiss after 3.8s
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      setToast(null);
    }, 3800);
    return () => clearTimeout(timer);
  }, [toast]);

  if (!toast) return null;

  const getBorderAndBg = () => {
    switch (toast.type) {
      case 'error':
        return 'bg-surface text-fg border-rose-500/40 shadow-xl';
      case 'success':
      case 'reloop':
        return 'bg-surface text-fg border-emerald-500/40 shadow-xl';
      case 'baseline':
        return 'bg-surface text-fg border-amber-500/40 shadow-xl';
      default:
        return 'bg-surface text-fg border-line shadow-xl';
    }
  };

  const getIcon = () => {
    switch (toast.type) {
      case 'error':
        return (
          <span className="p-1.5 rounded-xl bg-red-500/20 text-red-400 flex-shrink-0" aria-hidden="true">
            <AlertTriangle className="w-4 h-4" />
          </span>
        );
      case 'success':
        return (
          <span className="p-1.5 rounded-xl bg-emerald-500/20 text-emerald-400 flex-shrink-0" aria-hidden="true">
            <CheckCircle2 className="w-4 h-4" />
          </span>
        );
      case 'reloop':
        return (
          <span className="p-1.5 rounded-xl bg-emerald-500/20 text-emerald-400 flex-shrink-0" aria-hidden="true">
            <Sparkles className="w-4 h-4" />
          </span>
        );
      case 'baseline':
        return (
          <span className="p-1.5 rounded-xl bg-amber-500/20 text-amber-400 flex-shrink-0" aria-hidden="true">
            <Clock className="w-4 h-4" />
          </span>
        );
      default:
        return (
          <span className="p-1.5 rounded-xl bg-navy-800 text-charcoal-300 flex-shrink-0" aria-hidden="true">
            <Info className="w-4 h-4" />
          </span>
        );
    }
  };

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-20 md:bottom-6 right-4 sm:right-6 z-50 max-w-sm pointer-events-auto"
    >
      <div
        className={`flex items-center gap-3 px-4 py-3 rounded-2xl shadow-xl border text-sm font-semibold transition-all motion-safe:animate-in motion-safe:slide-in-from-bottom-2 duration-200 ${getBorderAndBg()}`}
      >
        {getIcon()}
        <span className="flex-1 text-sm font-medium leading-snug">{toast.message}</span>
        <button
          type="button"
          onClick={() => setToast(null)}
          className="p-1 rounded-lg text-fg-muted hover:text-fg hover:bg-surface-muted transition-colors flex-shrink-0"
          aria-label="Dismiss notification"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
