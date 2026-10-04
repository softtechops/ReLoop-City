import React, { useEffect, useState, useRef } from 'react';
import { useStore } from '../../store/useStore';
import { Sparkles, Clock, X } from 'lucide-react';

export const Toast: React.FC = () => {
  const mode = useStore((state) => state.mode);
  const [toast, setToast] = useState<{ message: string; type: 'reloop' | 'baseline' } | null>(null);
  const prevModeRef = useRef(mode);
  const isInitialMount = useRef(true);

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

      const timer = setTimeout(() => {
        setToast(null);
      }, 3200);

      return () => clearTimeout(timer);
    }
  }, [mode]);

  if (!toast) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-20 md:bottom-6 right-4 sm:right-6 z-50 max-w-sm pointer-events-auto"
    >
      <div
        className={`flex items-center gap-3 px-4 py-3 rounded-2xl shadow-xl border text-sm font-semibold transition-all motion-safe:animate-in motion-safe:slide-in-from-bottom-2 duration-200 ${
          toast.type === 'reloop'
            ? 'bg-navy-950 text-white border-emerald-500/40 shadow-emerald-950/20'
            : 'bg-navy-950 text-white border-amber-500/40 shadow-amber-950/20'
        }`}
      >
        <span
          className={`p-1.5 rounded-xl flex-shrink-0 ${
            toast.type === 'reloop' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
          }`}
          aria-hidden="true"
        >
          {toast.type === 'reloop' ? <Sparkles className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
        </span>
        <span className="flex-1 text-sm font-medium">{toast.message}</span>
        <button
          type="button"
          onClick={() => setToast(null)}
          className="p-1 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors"
          aria-label="Dismiss notification"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
