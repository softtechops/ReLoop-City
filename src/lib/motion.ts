import { useUiPrefs } from '../store/useUiPrefs';

export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function effectsOff(): boolean {
  return useUiPrefs.getState().reduceEffects || prefersReducedMotion();
}

export function useEffectsOff(): boolean {
  return useUiPrefs((s) => s.reduceEffects);
}

export function applyDocumentFlags() {
  if (typeof document === 'undefined') return;
  const { reduceEffects, presentationMode } = useUiPrefs.getState();
  document.documentElement.classList.toggle('reduce-effects', reduceEffects);
  document.documentElement.classList.toggle('presentation-mode', presentationMode);
}
