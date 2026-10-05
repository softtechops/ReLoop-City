import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LOOP_STEPS } from '../../data/loopSteps';
import { useStore } from '../../store/useStore';
import { useUiPrefs } from '../../store/useUiPrefs';
import { playTick } from '../../lib/sounds';
import { downloadReportCsv } from '../../utils/exportCsv';
import { computeMetrics } from '../../lib/metrics';

import { useTheme } from '../../lib/useTheme';

export const CommandPalette: React.FC = () => {
  const open = useUiPrefs((s) => s.paletteOpen);
  const setOpen = useUiPrefs((s) => s.setPaletteOpen);
  const sound = useUiPrefs((s) => s.soundEnabled);
  const navigate = useNavigate();
  const { setMode, mode, startGuidedTour, startSimulation, pauseSimulation, isSimRunning } = useStore();
  const { resolvedTheme, toggle: toggleTheme } = useTheme();
  const [q, setQ] = useState('');

  const actions = useMemo(
    () => [
      { id: 'dash', label: 'Open Dashboard', hint: 'G', run: () => navigate('/app/dashboard') },
      {
        id: 'theme',
        label: `Switch to ${resolvedTheme === 'dark' ? 'Day' : 'Night'} mode`,
        hint: 'T',
        run: () => toggleTheme(),
      },
      ...LOOP_STEPS.map((s) => ({
        id: `s${s.step}`,
        label: `Go to ${s.step}. ${s.name} · ${s.headline}`,
        hint: String(s.step),
        run: () => navigate(s.path),
      })),
      { id: 'mode', label: `Toggle mode (now ${mode})`, hint: 'M', run: () => setMode(mode === 'reloop' ? 'baseline' : 'reloop') },
      { id: 'run', label: isSimRunning ? 'Pause simulation' : 'Run simulation', hint: 'Space', run: () => (isSimRunning ? pauseSimulation() : startSimulation()) },
      { id: 'tour', label: 'Restart guided tour', hint: '', run: () => startGuidedTour() },
      { id: 'scen', label: 'Open scenario builder', hint: '', run: () => navigate('/app/scenarios') },
      {
        id: 'csv',
        label: 'Export report CSV',
        hint: '',
        run: () => {
          const { simState, config, mode: m, savedScenarios, activeScenarioId } = useStore.getState();
          const metrics = computeMetrics(simState, config, m);
          const scenario = savedScenarios.find((s) => s.id === activeScenarioId) || null;
          downloadReportCsv(metrics, config, m, scenario);
        },
      },
      { id: 'present', label: 'Presentation mode', hint: 'P', run: () => useUiPrefs.getState().togglePresentation() },
      { id: 'fx', label: 'Toggle reduce effects', hint: '', run: () => useUiPrefs.getState().toggleReduceEffects() },
    ],
    [isSimRunning, mode, navigate, pauseSimulation, resolvedTheme, setMode, startGuidedTour, startSimulation, toggleTheme]
  );

  const filtered = actions.filter((a) => a.label.toLowerCase().includes(q.toLowerCase()));

  useEffect(() => {
    if (!open) setQ('');
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[70] bg-black/60 backdrop-blur-sm flex items-start justify-center pt-[12vh] px-4"
      role="dialog"
      aria-modal="true"
      aria-label="Command palette"
      onClick={() => setOpen(false)}
    >
      <div
        className="w-full max-w-lg bg-surface text-fg border border-line shadow-2xl rounded-2xl overflow-hidden animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        <input
          autoFocus
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Jump to a step, toggle theme, export…"
          className="w-full bg-transparent px-4 py-3.5 text-sm text-fg placeholder:text-fg-subtle border-b border-line outline-none"
          aria-label="Search commands"
        />
        <ul className="max-h-80 overflow-y-auto py-2">
          {filtered.map((a) => (
            <li key={a.id}>
              <button
                type="button"
                className="w-full text-left px-4 py-2.5 text-sm text-fg hover:bg-surface-muted flex items-center justify-between min-h-[44px] transition-colors"
                onClick={() => {
                  if (sound) playTick();
                  a.run();
                  setOpen(false);
                }}
              >
                <span>{a.label}</span>
                {a.hint && <kbd className="text-[10px] font-mono text-fg-muted border border-line bg-surface-muted rounded px-1.5 py-0.5">{a.hint}</kbd>}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
