import { create } from 'zustand';

const SOUND_KEY = 'reloop_ui_sound';
const REDUCE_KEY = 'reloop_reduce_effects';

function readBool(key: string, fallback: boolean): boolean {
  try {
    const v = localStorage.getItem(key);
    if (v === null) return fallback;
    return v === 'true';
  } catch {
    return fallback;
  }
}

function systemPrefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export interface UiPrefsState {
  soundEnabled: boolean;
  reduceEffects: boolean;
  presentationMode: boolean;
  helpOpen: boolean;
  paletteOpen: boolean;
  bootPlaying: boolean;
  setSoundEnabled: (v: boolean) => void;
  setReduceEffects: (v: boolean) => void;
  setPresentationMode: (v: boolean) => void;
  setHelpOpen: (v: boolean) => void;
  setPaletteOpen: (v: boolean) => void;
  setBootPlaying: (v: boolean) => void;
  toggleSound: () => void;
  toggleReduceEffects: () => void;
  togglePresentation: () => void;
}

export const useUiPrefs = create<UiPrefsState>((set, get) => ({
  soundEnabled: readBool(SOUND_KEY, false),
  reduceEffects: readBool(REDUCE_KEY, systemPrefersReducedMotion()),
  presentationMode: false,
  helpOpen: false,
  paletteOpen: false,
  bootPlaying: false,
  setSoundEnabled: (v) => {
    try {
      localStorage.setItem(SOUND_KEY, String(v));
    } catch {
      /* ignore */
    }
    set({ soundEnabled: v });
  },
  setReduceEffects: (v) => {
    try {
      localStorage.setItem(REDUCE_KEY, String(v));
    } catch {
      /* ignore */
    }
    set({ reduceEffects: v });
  },
  setPresentationMode: (v) => set({ presentationMode: v }),
  setHelpOpen: (v) => set({ helpOpen: v }),
  setPaletteOpen: (v) => set({ paletteOpen: v }),
  setBootPlaying: (v) => set({ bootPlaying: v }),
  toggleSound: () => get().setSoundEnabled(!get().soundEnabled),
  toggleReduceEffects: () => get().setReduceEffects(!get().reduceEffects),
  togglePresentation: () => set({ presentationMode: !get().presentationMode }),
}));

export function requestBootSequence(): void {
  try {
    sessionStorage.setItem('reloop_boot_pending', '1');
  } catch {
    /* ignore */
  }
}

export function consumeBootPending(): boolean {
  try {
    const pending = sessionStorage.getItem('reloop_boot_pending') === '1';
    const shown = sessionStorage.getItem('reloop_boot_shown') === '1';
    if (pending && !shown) {
      sessionStorage.removeItem('reloop_boot_pending');
      return true;
    }
    sessionStorage.removeItem('reloop_boot_pending');
    return false;
  } catch {
    return false;
  }
}

export function markBootShown(): void {
  try {
    sessionStorage.setItem('reloop_boot_shown', '1');
  } catch {
    /* ignore */
  }
}
