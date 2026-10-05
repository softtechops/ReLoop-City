import React from 'react';
import { useUiPrefs } from '../../store/useUiPrefs';

export const HelpOverlay: React.FC = () => {
  const open = useUiPrefs((s) => s.helpOpen);
  const setOpen = useUiPrefs((s) => s.setHelpOpen);
  if (!open) return null;

  const rows = [
    ['1–7', 'Jump between loop steps'],
    ['M', 'Toggle Baseline / ReLoop'],
    ['Space', 'Play / pause simulation'],
    ['P', 'Presentation mode'],
    ['⌘/Ctrl K', 'Command palette'],
    ['?', 'This help overlay'],
    ['Esc', 'Close overlays / skip boot'],
  ];

  return (
    <div
      className="fixed inset-0 z-[70] bg-black/55 backdrop-blur-sm flex items-center justify-center px-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="help-title"
      onClick={() => setOpen(false)}
    >
      <div className="w-full max-w-md glass-panel rounded-2xl p-6" onClick={(e) => e.stopPropagation()}>
        <h2 id="help-title" className="text-lg font-display font-semibold text-white mb-4">Keyboard shortcuts</h2>
        <dl className="space-y-2 text-sm">
          {rows.map(([k, v]) => (
            <div key={k} className="flex items-center justify-between gap-4">
              <dt className="font-mono text-emerald-300 text-xs">{k}</dt>
              <dd className="text-slate-300">{v}</dd>
            </div>
          ))}
        </dl>
        <button
          type="button"
          className="mt-5 w-full min-h-[44px] rounded-xl bg-white/10 text-white text-sm font-semibold"
          onClick={() => setOpen(false)}
        >
          Close
        </button>
      </div>
    </div>
  );
};
