import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { useTheme } from '../lib/useTheme';
import { ReloopLogo } from './brand/ReloopLogo';
import { ThemeToggle } from './ui/ThemeToggle';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Sparkles, 
  Clock, 
  ArrowLeft,
  MoreHorizontal,
  Gauge,
  HelpCircle,
  Sun,
  Moon,
} from 'lucide-react';
import { WhatCanIDoModal } from './WhatCanIDoModal';
import { useUiPrefs } from '../store/useUiPrefs';

export const Header: React.FC = () => {
  const {
    simState,
    isSimRunning,
    simSpeed,
    mode,
    startSimulation,
    pauseSimulation,
    setSimSpeed,
    openResetConfirm,
    setMode,
    startGuidedTour,
  } = useStore();

  const { theme, setTheme } = useTheme();
  const { presentationMode } = useUiPrefs();

  const [isOverflowOpen, setIsOverflowOpen] = useState(false);
  const [isWhatCanIDoOpen, setIsWhatCanIDoOpen] = useState(false);
  
  const overflowRef = useRef<HTMLDivElement>(null);
  const overflowButtonRef = useRef<HTMLButtonElement>(null);
  const menuItemsRef = useRef<(HTMLButtonElement | HTMLAnchorElement | null)[]>([]);

  // Keyboard accessibility for overflow menu (Esc to close, arrows to navigate)
  useEffect(() => {
    if (!isOverflowOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOverflowOpen(false);
        overflowButtonRef.current?.focus();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        const activeIndex = menuItemsRef.current.findIndex((el) => el === document.activeElement);
        const nextIndex = activeIndex < menuItemsRef.current.length - 1 ? activeIndex + 1 : 0;
        menuItemsRef.current[nextIndex]?.focus();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        const activeIndex = menuItemsRef.current.findIndex((el) => el === document.activeElement);
        const prevIndex = activeIndex > 0 ? activeIndex - 1 : menuItemsRef.current.length - 1;
        menuItemsRef.current[prevIndex]?.focus();
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (overflowRef.current && !overflowRef.current.contains(e.target as Node)) {
        setIsOverflowOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOverflowOpen]);

  const statusPillText = `${isSimRunning ? 'Running' : 'Paused'} · Day ${simState.currentDay}, ${String(simState.currentHour).padStart(2, '0')}:00`;

  return (
    <header className="sticky top-0 z-30 bg-surface border-b border-line text-fg transition-all select-none">
      {/* Skip to main content link for screen readers */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 px-4 py-2 bg-slate-900 text-white rounded-xl shadow-lg focus:outline-hidden"
      >
        Skip to main content
      </a>

      {/* Main Header Container */}
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-16 flex items-center justify-between gap-4">
          
          {/* Left: Brand Identity */}
          <div className="flex items-center gap-3">
            <Link
              to="/app/dashboard"
              className="flex items-center gap-2 group rounded-xl p-1 -ml-1 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-emerald-600"
              aria-label="Reloop City - Return to dashboard"
            >
              <ReloopLogo className="h-7 w-auto" />
            </Link>
          </div>

          {/* Center: Baseline vs ReLoop Segmented Control (The ONLY place the toggle lives) */}
          <div
            role="radiogroup"
            aria-label="Operational Strategy Mode"
            className="flex items-center bg-surface-muted p-1 rounded-xl border border-line"
          >
            <button
              id="header-toggle-baseline"
              role="radio"
              aria-checked={mode === 'baseline'}
              type="button"
              onClick={() => setMode('baseline')}
              className={`flex items-center gap-1.5 px-3 sm:px-4 py-1.5 min-h-[38px] rounded-lg text-sm font-semibold transition-all focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-amber-500 cursor-pointer ${
                mode === 'baseline'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-fg-muted hover:text-fg hover:bg-surface/60'
              }`}
            >
              <Clock className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
              <span>Baseline</span>
              <span className="hidden md:inline font-normal text-xs opacity-90">(Fixed)</span>
            </button>

            <button
              id="header-toggle-reloop"
              role="radio"
              aria-checked={mode === 'reloop'}
              type="button"
              onClick={() => setMode('reloop')}
              className={`flex items-center gap-1.5 px-3 sm:px-4 py-1.5 min-h-[38px] rounded-lg text-sm font-semibold transition-all focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-emerald-600 cursor-pointer ${
                mode === 'reloop'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-fg-muted hover:text-fg hover:bg-surface/60'
              }`}
            >
              <Sparkles className="w-4 h-4 text-emerald-100 flex-shrink-0" aria-hidden="true" />
              <span>ReLoop</span>
              <span className="hidden md:inline font-normal text-xs opacity-90">(AI Loop)</span>
            </button>
          </div>

          {/* Right: Status Pill, Play/Pause, ThemeToggle, and "⋯" Menu */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Single Status Pill ("Running · Day 1, 14:00") */}
            {!presentationMode && (
              <div
                className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-medium ${
                  isSimRunning
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-300 dark:border-emerald-500/30'
                    : 'bg-surface-muted text-fg-subtle border-line'
                }`}
                title={isSimRunning ? 'Simulation running' : 'Simulation paused'}
              >
                <span
                  className={`w-2 h-2 rounded-full flex-shrink-0 ${
                    isSimRunning ? 'bg-emerald-600 dark:bg-emerald-400' : 'bg-slate-400'
                  }`}
                  aria-hidden="true"
                />
                <span>{statusPillText}</span>
              </div>
            )}

            {/* Primary Play / Pause Button - Always visible! */}
            <button
              type="button"
              onClick={() => (isSimRunning ? pauseSimulation() : startSimulation())}
              className={`min-h-[40px] px-3.5 sm:px-4 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-emerald-600 cursor-pointer ${
                isSimRunning
                  ? 'bg-amber-50 text-amber-900 hover:bg-amber-100 border border-amber-200 dark:bg-amber-400/15 dark:text-amber-300 dark:border-amber-400/30'
                  : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-xs'
              }`}
              aria-label={isSimRunning ? 'Pause simulation' : 'Run simulation'}
            >
              {isSimRunning ? (
                <>
                  <Pause className="w-4 h-4 fill-current" aria-hidden="true" />
                  <span className="hidden sm:inline">Pause</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" aria-hidden="true" />
                  <span className="hidden sm:inline">Run</span>
                </>
              )}
            </button>

            {!presentationMode && (
              <>
                {/* Day / Night ThemeToggle Component */}
                <ThemeToggle />

                {/* "⋯" Overflow Menu */}
                <div className="relative" ref={overflowRef}>
                  <button
                    ref={overflowButtonRef}
                    type="button"
                    onClick={() => setIsOverflowOpen((prev) => !prev)}
                    aria-haspopup="menu"
                    aria-expanded={isOverflowOpen}
                    aria-label="More simulation and navigation options"
                    className="min-h-[40px] min-w-[40px] p-2 rounded-xl border border-line hover:border-slate-300 dark:hover:border-slate-600 bg-surface hover:bg-surface-muted text-fg transition-all flex items-center justify-center cursor-pointer shadow-xs focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-emerald-600"
                  >
                    <MoreHorizontal className="w-5 h-5" aria-hidden="true" />
                  </button>

              {/* Accessible Dropdown Menu */}
              {isOverflowOpen && (
                <div
                  role="menu"
                  aria-label="Simulation Settings and Navigation"
                  className="absolute right-0 top-full mt-2 z-50 w-64 rounded-2xl bg-surface border border-line shadow-xl p-2 space-y-1 animate-in fade-in zoom-in-95 duration-100 text-fg"
                >
                  {/* Section: Day / Night / System Theme */}
                  <div className="px-3 py-2 border-b border-line">
                    <span className="text-xs font-semibold text-fg-subtle block mb-1.5 flex items-center gap-1.5">
                      <Sun className="w-3.5 h-3.5 text-amber-500" />
                      <span>Theme mode</span>
                    </span>
                    <div className="grid grid-cols-2 gap-1.5">
                      {(['light', 'dark'] as const).map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => setTheme(t)}
                          className={`min-h-[32px] px-2 py-1 rounded-lg text-xs font-semibold transition-all capitalize cursor-pointer flex items-center justify-center gap-1.5 ${
                            theme === t
                              ? 'bg-emerald-600 text-white shadow-2xs'
                              : 'bg-surface-muted text-fg-muted hover:text-fg hover:bg-slate-200 dark:hover:bg-slate-700'
                          }`}
                        >
                          {t === 'light' ? (
                            <>
                              <Sun className="w-3.5 h-3.5 text-amber-500" />
                              <span>Day</span>
                            </>
                          ) : (
                            <>
                              <Moon className="w-3.5 h-3.5 text-emerald-400" />
                              <span>Night</span>
                            </>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Section: Simulation Speed */}
                  <div className="px-3 py-2 border-b border-line">
                    <span className="text-xs font-semibold text-fg-subtle block mb-1.5 flex items-center gap-1.5">
                      <Gauge className="w-3.5 h-3.5 text-fg-muted" />
                      <span>Simulation speed</span>
                    </span>
                    <div className="grid grid-cols-3 gap-1">
                      {([1, 10, 60] as const).map((spd, index) => (
                        <button
                          key={spd}
                          ref={(el) => { menuItemsRef.current[index] = el; }}
                          role="menuitem"
                          type="button"
                          onClick={() => {
                            setSimSpeed(spd);
                            setIsOverflowOpen(false);
                          }}
                          className={`min-h-[34px] px-2 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                            simSpeed === spd
                              ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
                              : 'bg-surface-muted text-fg-muted hover:text-fg hover:bg-slate-200 dark:hover:bg-slate-700'
                          }`}
                        >
                          {spd}x
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Item: What can I do here? */}
                  <button
                    ref={(el) => { menuItemsRef.current[3] = el; }}
                    role="menuitem"
                    type="button"
                    onClick={() => {
                      setIsOverflowOpen(false);
                      setIsWhatCanIDoOpen(true);
                    }}
                    className="w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium text-fg hover:bg-emerald-50/70 dark:hover:bg-emerald-950/40 flex items-center gap-2.5 transition-colors cursor-pointer"
                  >
                    <HelpCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>What can I do here?</span>
                  </button>

                  {/* Item: Guided Tour */}
                  <button
                    ref={(el) => { menuItemsRef.current[4] = el; }}
                    role="menuitem"
                    type="button"
                    onClick={() => {
                      setIsOverflowOpen(false);
                      startGuidedTour();
                    }}
                    className="w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium text-fg hover:bg-surface-muted flex items-center gap-2.5 transition-colors cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>Guided Tour</span>
                  </button>

                  {/* Item: Reset Simulation */}
                  <button
                    ref={(el) => { menuItemsRef.current[5] = el; }}
                    role="menuitem"
                    type="button"
                    onClick={() => {
                      setIsOverflowOpen(false);
                      openResetConfirm();
                    }}
                    className="w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium text-fg hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 flex items-center gap-2.5 transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-4 h-4 text-fg-subtle hover:text-red-600 flex-shrink-0" />
                    <span>Reset to Day 1</span>
                  </button>

                  {/* Divider */}
                  <div className="border-t border-line my-1" />

                  {/* Item: Back to Public Website */}
                  <Link
                    ref={(el) => { menuItemsRef.current[6] = el; }}
                    role="menuitem"
                    to="/"
                    onClick={() => setIsOverflowOpen(false)}
                    className="w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium text-fg hover:bg-surface-muted flex items-center gap-2.5 transition-colors cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4 text-fg-subtle flex-shrink-0" />
                    <span>Back to Website</span>
                  </Link>
                </div>
              )}
            </div>
          </>
        )}

      </div>

        </div>
      </div>

      {/* What Can I Do Here? Help Dialog */}
      <WhatCanIDoModal
        isOpen={isWhatCanIDoOpen}
        onClose={() => setIsWhatCanIDoOpen(false)}
      />
    </header>
  );
};
