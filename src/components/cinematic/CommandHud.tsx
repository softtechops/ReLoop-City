import React, { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useStore } from '../../store/useStore';
import { applyDocumentFlags } from '../../lib/motion';
import { playTick } from '../../lib/sounds';
import { useUiPrefs } from '../../store/useUiPrefs';
import { LOOP_STEPS } from '../../data/loopSteps';
import { CommandPalette } from './CommandPalette';
import { HelpOverlay } from './HelpOverlay';

const STEP_PATHS = LOOP_STEPS.map((s) => s.path);

export const CommandHud: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { mode, setMode, isSimRunning, startSimulation, pauseSimulation } = useStore();
  const {
    soundEnabled,
    presentationMode,
    reduceEffects,
    setPaletteOpen,
    setHelpOpen,
    togglePresentation,
  } = useUiPrefs();
  const stepIdx = useRef(0);

  useEffect(() => {
    applyDocumentFlags();
  }, [presentationMode, reduceEffects]);

  useEffect(() => {
    const isReloop = mode === 'reloop';
    document.title = isReloop
      ? 'ReLoop City · Circular loop online'
      : 'ReLoop City · Baseline (fixed routes)';
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', isReloop ? '#064E3B' : '#78350F');
  }, [mode]);

  useEffect(() => {
    if (!presentationMode) return;
    const id = window.setInterval(() => {
      stepIdx.current = (stepIdx.current + 1) % STEP_PATHS.length;
      navigate(STEP_PATHS[stepIdx.current]);
    }, 12000);
    return () => window.clearInterval(id);
  }, [presentationMode, navigate]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      const typing = tag === 'INPUT' || tag === 'TEXTAREA' || (e.target as HTMLElement)?.isContentEditable;
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setPaletteOpen(true);
        return;
      }
      if (typing) return;
      if (e.key === '?') {
        e.preventDefault();
        setHelpOpen(true);
      } else if (e.key === 'Escape') {
        setPaletteOpen(false);
        setHelpOpen(false);
      } else if (e.key.toLowerCase() === 'p') {
        togglePresentation();
      } else if (e.key.toLowerCase() === 'm') {
        if (soundEnabled) playTick();
        setMode(mode === 'reloop' ? 'baseline' : 'reloop');
      } else if (e.key === ' ') {
        e.preventDefault();
        if (isSimRunning) pauseSimulation();
        else startSimulation();
      } else if (/^[1-7]$/.test(e.key)) {
        const step = LOOP_STEPS[Number(e.key) - 1];
        if (step) navigate(step.path);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isSimRunning, mode, navigate, pauseSimulation, setHelpOpen, setMode, setPaletteOpen, soundEnabled, startSimulation, togglePresentation]);

  const caption = LOOP_STEPS.find((s) => location.pathname === s.path);

  return (
    <>
      <CommandPalette />
      <HelpOverlay />
      {presentationMode && caption && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] glass-panel px-5 py-2.5 rounded-full text-sm text-white">
          <span className="font-mono text-emerald-300 mr-2">Step {caption.step}</span>
          {caption.name} · {caption.headline}
        </div>
      )}
    </>
  );
};
