import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { ReloopLogo } from './brand/ReloopLogo';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Sparkles, 
  Clock, 
  X,
  ArrowLeft,
  MoreHorizontal,
  Compass,
  Gauge,
  HelpCircle,
  FlaskConical,
} from 'lucide-react';
import { WhatCanIDoModal } from './WhatCanIDoModal';

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
    savedScenarios,
    activeScenarioId,
  } = useStore();

  const [isOverflowOpen, setIsOverflowOpen] = useState(false);
  const [isWhatCanIDoOpen, setIsWhatCanIDoOpen] = useState(false);
  const [isSimBannerDismissed, setIsSimBannerDismissed] = useState(false);

  const activeScenario = React.useMemo(() => {
    if (!activeScenarioId) return null;
    return savedScenarios.find((s) => s.id === activeScenarioId) || null;
  }, [savedScenarios, activeScenarioId]);
  
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

  const compactTimeText = `Day ${simState.currentDay}, ${String(simState.currentHour).padStart(2, '0')}:00`;

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-charcoal-200 shadow-sm transition-all select-none">
      {/* Skip to main content link for screen readers */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:px-4 focus:py-2 focus:bg-navy-900 focus:text-white focus:rounded-xl focus:shadow-lg focus:outline-hidden"
      >
        Skip to main content
      </a>

      {/* Main Header Container */}
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-16 flex items-center justify-between gap-3">
          
          {/* Left: Brand Identity */}
          <div className="flex items-center gap-3">
            <Link
              to="/app/dashboard"
              className="flex items-center gap-2 group rounded-xl p-1 -ml-1 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-green-600"
              aria-label="Reloop City - Return to dashboard"
            >
              <ReloopLogo className="h-7 w-auto" />
            </Link>
          </div>

          {/* Center: Baseline vs ReLoop Toggle (Prominent, Central, Accessible on Desktop & Mobile) */}
          <div
            role="radiogroup"
            aria-label="Operational Strategy Mode"
            className="flex items-center bg-charcoal-100 p-1 rounded-2xl border border-charcoal-200 shadow-inner"
          >
            <button
              id="header-toggle-baseline"
              role="radio"
              aria-checked={mode === 'baseline'}
              type="button"
              onClick={() => setMode('baseline')}
              className={`flex items-center gap-1.5 px-3 sm:px-4 min-h-[44px] rounded-xl text-sm font-bold transition-all focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-navy-600 cursor-pointer ${
                mode === 'baseline'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-charcoal-700 hover:text-navy-900 hover:bg-white/60'
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
              className={`flex items-center gap-1.5 px-3 sm:px-4 min-h-[44px] rounded-xl text-sm font-bold transition-all focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-emerald-600 cursor-pointer ${
                mode === 'reloop'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-charcoal-700 hover:text-navy-900 hover:bg-white/60'
              }`}
            >
              <Sparkles className="w-4 h-4 text-emerald-100 flex-shrink-0" aria-hidden="true" />
              <span>ReLoop</span>
              <span className="hidden md:inline font-normal text-xs opacity-90">(AI Loop)</span>
            </button>
          </div>

          {/* Right: Simulation Run/Pause, Compact Status Chip, and "⋯" Overflow Menu */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Compact Status Chip (Text + Icon, not color alone) */}
            <div
              className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-mono font-semibold ${
                isSimRunning
                  ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
                  : 'bg-charcoal-50 text-charcoal-700 border-charcoal-200'
              }`}
              title={isSimRunning ? 'Simulation running' : 'Simulation paused'}
            >
              <span
                className={`w-2 h-2 rounded-full flex-shrink-0 ${
                  isSimRunning ? 'bg-emerald-600' : 'bg-charcoal-400'
                }`}
                aria-hidden="true"
              />
              <span className="font-bold">{isSimRunning ? 'RUN' : 'PAUSED'}</span>
              <span className="text-charcoal-400">·</span>
              <span>{compactTimeText}</span>
            </div>

            {/* Active Scenario Chip (Feature 2) */}
            {activeScenario && (
              <Link
                to="/app/scenarios"
                className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-emerald-300 bg-emerald-50 text-xs font-bold text-emerald-800 hover:bg-emerald-100 transition-colors shadow-2xs"
                title="Active operational policy scenario - click to manage"
              >
                <FlaskConical className="w-3.5 h-3.5 text-emerald-600" />
                <span className="truncate max-w-[120px]">Scenario: {activeScenario.name}</span>
              </Link>
            )}

            {/* Primary Play / Pause Button (≥44px tap target) */}
            <button
              type="button"
              onClick={() => (isSimRunning ? pauseSimulation() : startSimulation())}
              className={`min-h-[44px] px-3.5 sm:px-4 rounded-xl text-sm font-bold transition-all flex items-center gap-2 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-navy-600 cursor-pointer shadow-sm ${
                isSimRunning
                  ? 'bg-amber-100 text-amber-950 hover:bg-amber-200 border border-amber-300'
                  : 'bg-emerald-600 text-white hover:bg-emerald-700'
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

            {/* "⋯" Keyboard-Accessible Overflow Menu */}
            <div className="relative" ref={overflowRef}>
              <button
                ref={overflowButtonRef}
                type="button"
                onClick={() => setIsOverflowOpen((prev) => !prev)}
                aria-haspopup="menu"
                aria-expanded={isOverflowOpen}
                aria-label="More simulation and navigation options"
                className="min-h-[44px] min-w-[44px] p-2.5 rounded-xl border border-charcoal-200 hover:border-charcoal-300 bg-white hover:bg-charcoal-50 text-charcoal-700 hover:text-navy-900 transition-all flex items-center justify-center cursor-pointer shadow-2xs focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-navy-600"
              >
                <MoreHorizontal className="w-5 h-5" aria-hidden="true" />
              </button>

              {/* Accessible Dropdown Menu */}
              {isOverflowOpen && (
                <div
                  role="menu"
                  aria-label="Simulation Settings and Navigation"
                  className="absolute right-0 top-full mt-2 z-50 w-64 rounded-2xl bg-white border border-charcoal-200 shadow-xl p-2 space-y-1 animate-in fade-in zoom-in-95 duration-100"
                >
                  {/* Section: Simulation Speed */}
                  <div className="px-3 py-2 border-b border-charcoal-100">
                    <span className="text-xs font-bold uppercase tracking-wider text-charcoal-500 block mb-1.5 flex items-center gap-1.5">
                      <Gauge className="w-3.5 h-3.5 text-navy-700" />
                      <span>Simulation Speed</span>
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
                          className={`min-h-[36px] px-2 py-1 rounded-lg text-xs font-bold transition-all ${
                            simSpeed === spd
                              ? 'bg-navy-900 text-white shadow-2xs'
                              : 'bg-charcoal-50 text-charcoal-700 hover:bg-charcoal-100'
                          }`}
                        >
                          {spd}x
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Item: What can I do here? (Operations Manager Guide) */}
                  <button
                    ref={(el) => { menuItemsRef.current[3] = el; }}
                    role="menuitem"
                    type="button"
                    onClick={() => {
                      setIsOverflowOpen(false);
                      setIsWhatCanIDoOpen(true);
                    }}
                    className="w-full text-left px-3 py-2.5 rounded-xl text-sm font-semibold text-charcoal-700 hover:text-navy-900 hover:bg-emerald-50/70 flex items-center gap-2.5 transition-colors cursor-pointer"
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
                    className="w-full text-left px-3 py-2.5 rounded-xl text-sm font-semibold text-charcoal-700 hover:text-navy-900 hover:bg-charcoal-50 flex items-center gap-2.5 transition-colors cursor-pointer"
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
                    className="w-full text-left px-3 py-2.5 rounded-xl text-sm font-semibold text-charcoal-700 hover:text-red-700 hover:bg-red-50 flex items-center gap-2.5 transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-4 h-4 text-charcoal-500 hover:text-red-600 flex-shrink-0" />
                    <span>Reset to Day 1</span>
                  </button>

                  {/* Divider */}
                  <div className="border-t border-charcoal-100 my-1" />

                  {/* Item: Back to Public Website */}
                  <Link
                    ref={(el) => { menuItemsRef.current[6] = el; }}
                    role="menuitem"
                    to="/"
                    onClick={() => setIsOverflowOpen(false)}
                    className="w-full text-left px-3 py-2.5 rounded-xl text-sm font-semibold text-charcoal-700 hover:text-navy-900 hover:bg-charcoal-50 flex items-center gap-2.5 transition-colors cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4 text-charcoal-500 flex-shrink-0" />
                    <span>Back to Website</span>
                  </Link>
                </div>
              )}
            </div>

          </div>

        </div>
      </div>

      {/* Slim, Dismissible Simulated Data Banner (No pulse animation, clean contrast) */}
      {!isSimBannerDismissed && (
        <div
          role="status"
          aria-label="Simulation notice"
          className="bg-navy-950 text-white py-1.5 px-4 sm:px-6 border-t border-navy-800"
        >
          <div className="max-w-[1600px] mx-auto flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 overflow-hidden">
              <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 font-bold uppercase text-[11px] tracking-wider border border-amber-500/40 flex-shrink-0">
                Simulated Data
              </span>
              <span className="text-charcoal-300 truncate text-xs">
                Deterministic client-side simulation calibrated to Pune PCMC municipal pilot data. No live backend connection.
              </span>
            </div>
            <button
              type="button"
              onClick={() => setIsSimBannerDismissed(true)}
              className="p-1 rounded-lg text-charcoal-400 hover:text-white hover:bg-navy-800 transition-colors flex-shrink-0 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-emerald-500"
              aria-label="Dismiss simulated data notification"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* What Can I Do Here? Help Dialog */}
      <WhatCanIDoModal
        isOpen={isWhatCanIDoOpen}
        onClose={() => setIsWhatCanIDoOpen(false)}
      />
    </header>
  );
};
