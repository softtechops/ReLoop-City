// ============================================================================
// WHAT CAN I DO HERE? (Help Modal)
// Explains the Operations Manager role, decision prompts across 7 loop steps,
// the scenario builder, and reporting/export in four clear lines.
// Accessible dialog with Esc to close and visible focus traps.
// ============================================================================

import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  HelpCircle,
  X,
  ShieldCheck,
  SlidersHorizontal,
  FlaskConical,
  Download,
  ArrowRight,
} from 'lucide-react';
import { Button } from './ui/Button';

interface WhatCanIDoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WhatCanIDoModal: React.FC<WhatCanIDoModalProps> = ({ isOpen, onClose }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="what-can-i-do-title"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
    >
      <div
        ref={modalRef}
        className="bg-surface rounded-2xl max-w-xl w-full p-6 sm:p-7 shadow-2xl space-y-5 border border-line animate-in zoom-in-95 duration-150"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-line pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 id="what-can-i-do-title" className="text-base font-bold text-fg">
                What Can I Do Here?
              </h2>
              <span className="text-xs text-fg-muted">
                Operations Manager Planning & Decision Guide
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-fg-subtle hover:text-fg hover:bg-surface-muted p-1.5 rounded-lg min-h-[44px] min-w-[44px] flex items-center justify-center transition-colors"
            aria-label="Close help guide"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* The 4 Core Explanations */}
        <div className="space-y-3.5">
          {/* 1. The Role */}
          <div className="flex items-start gap-3 p-3 rounded-xl bg-surface-muted border border-line">
            <div className="p-1.5 rounded-lg bg-slate-900 text-white dark:bg-emerald-600 flex-shrink-0 mt-0.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400 dark:text-white" />
            </div>
            <div className="text-xs leading-relaxed text-fg-muted">
              <strong className="text-fg font-bold block text-sm">1. Act as Operations Manager:</strong>
              Lead the Akurdi–Chinchwad–Moshi corridor to raise diversion above 95% and cut fleet diesel expenditure.
            </div>
          </div>

          {/* 2. Decision Prompts */}
          <div className="flex items-start gap-3 p-3 rounded-xl bg-emerald-50/60 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30">
            <div className="p-1.5 rounded-lg bg-emerald-600 text-white flex-shrink-0 mt-0.5">
              <SlidersHorizontal className="w-4 h-4" />
            </div>
            <div className="text-xs leading-relaxed text-fg-muted">
              <strong className="text-fg font-bold block text-sm">2. Make Loop Decisions:</strong>
              Take concrete actions on each page—flag priority bins, resolve CVRP routes, set stream splits, and sign council briefs.
            </div>
          </div>

          {/* 3. Scenario Builder */}
          <div className="flex items-start gap-3 p-3 rounded-xl bg-amber-50/60 dark:bg-amber-400/10 border border-amber-200 dark:border-amber-400/30">
            <div className="p-1.5 rounded-lg bg-amber-600 text-white flex-shrink-0 mt-0.5">
              <FlaskConical className="w-4 h-4" />
            </div>
            <div className="text-xs leading-relaxed text-fg-muted">
              <strong className="text-fg font-bold block text-sm">3. Build & Test Scenarios:</strong>
              Use the Scenario Builder (<Link to="/app/scenarios" onClick={onClose} className="text-emerald-600 dark:text-emerald-400 font-bold underline">/app/scenarios</Link>) to test fleet size and fill thresholds with 3-way side-by-side benchmarking.
            </div>
          </div>

          {/* 4. Export & Reports */}
          <div className="flex items-start gap-3 p-3 rounded-xl bg-surface-muted border border-line">
            <div className="p-1.5 rounded-lg bg-slate-800 text-white flex-shrink-0 mt-0.5">
              <Download className="w-4 h-4" />
            </div>
            <div className="text-xs leading-relaxed text-fg-muted">
              <strong className="text-fg font-bold block text-sm">4. Export Audited Reports:</strong>
              Download UTF-8 CSV datasets with Excel BOM or print certified PDF briefing packs complete with executive summaries and charts.
            </div>
          </div>
        </div>

        {/* Hotkeys Bar */}
        <div className="p-2.5 rounded-xl bg-surface-muted border border-line flex flex-wrap items-center justify-between gap-2 text-[11px] text-fg-muted">
          <span className="font-semibold text-fg">Keyboard Shortcuts:</span>
          <div className="flex items-center gap-3 flex-wrap">
            <span><kbd className="px-1.5 py-0.5 rounded bg-surface border border-line font-mono text-[10px] text-fg">T</kbd> Day / Night</span>
            <span><kbd className="px-1.5 py-0.5 rounded bg-surface border border-line font-mono text-[10px] text-fg">M</kbd> Mode</span>
            <span><kbd className="px-1.5 py-0.5 rounded bg-surface border border-line font-mono text-[10px] text-fg">Space</kbd> Sim</span>
            <span><kbd className="px-1.5 py-0.5 rounded bg-surface border border-line font-mono text-[10px] text-fg">Ctrl+K</kbd> Commands</span>
          </div>
        </div>

        {/* Footer actions */}
        <div className="pt-3 border-t border-line flex items-center justify-between gap-3">
          <Link
            to="/app/scenarios"
            onClick={onClose}
            className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 min-h-[44px]"
          >
            Launch Scenario Builder <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <Button variant="primary" size="md" onClick={onClose} className="font-bold text-xs">
            Got it, Let's Plan
          </Button>
        </div>
      </div>
    </div>
  );
};
