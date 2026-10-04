import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  FastForward, 
  Sparkles, 
  Radio, 
  Clock, 
  SlidersHorizontal,
  ChevronDown,
  Info,
  X
} from 'lucide-react';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';

export const Header: React.FC = () => {
  const {
    simState,
    isSimRunning,
    simSpeed,
    mode,
    startSimulation,
    pauseSimulation,
    setSimSpeed,
    tickSimulation,
    openResetConfirm,
    setMode,
    startGuidedTour,
  } = useStore();

  const [isSimPopoverOpen, setIsSimPopoverOpen] = useState(false);
  const [isBadgeInfoOpen, setIsBadgeInfoOpen] = useState(false);
  const simPopoverRef = useRef<HTMLDivElement>(null);
  const badgePopoverRef = useRef<HTMLDivElement>(null);

  // Auto-tick effect when simulation is running
  // Also pause simulation when document is hidden (Page Visibility API, Section 8)
  useEffect(() => {
    if (!isSimRunning) return;

    let isDocumentVisible = !document.hidden;

    const handleVisibilityChange = () => {
      isDocumentVisible = !document.hidden;
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    const intervalMs = simSpeed === 60 ? 100 : simSpeed === 10 ? 450 : 1400;
    const interval = setInterval(() => {
      if (isDocumentVisible) {
        tickSimulation();
      }
    }, intervalMs);

    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isSimRunning, simSpeed, tickSimulation]);

  // Click outside listener for mobile sim popover
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (simPopoverRef.current && !simPopoverRef.current.contains(e.target as Node)) {
        setIsSimPopoverOpen(false);
      }
      if (badgePopoverRef.current && !badgePopoverRef.current.contains(e.target as Node)) {
        setIsBadgeInfoOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const statusChipText = isSimRunning
    ? `Running · ${simSpeed}x (Day ${simState.currentDay}, ${String(simState.currentHour).padStart(2, '0')}:00)`
    : `Paused · Day ${simState.currentDay}, ${String(simState.currentHour).padStart(2, '0')}:00`;

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-charcoal-200 shadow-xs transition-all">
      {/* Skip to main content link for screen readers */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:px-4 focus:py-2 focus:bg-navy-900 focus:text-white focus:rounded-xl focus:shadow-lg focus:outline-hidden"
      >
        Skip to main content
      </a>

      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Tier 1 / Main Header Bar */}
        <div className="h-16 flex items-center justify-between gap-3">
          
          {/* Brand Identity & Simulated Data Badge */}
          <div className="flex items-center gap-3">
            <Link
              to="/overview"
              className="flex items-center gap-2.5 group rounded-xl p-1 -ml-1 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-navy-600"
              aria-label="ReLoop City - Return to overview"
            >
              <div className="w-9 h-9 rounded-xl bg-navy-700 group-hover:bg-navy-800 flex items-center justify-center text-white font-bold shadow-md shadow-navy-700/20 transition-all">
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                  <path d="M3 3v5h5" />
                  <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
                  <path d="M16 21h5v-5" />
                </svg>
              </div>
              <div>
                <span className="font-extrabold text-xl tracking-tight text-navy-900 font-['Outfit'] block leading-none">
                  ReLoop <span className="text-sage-600">City</span>
                </span>
                <span className="text-xs text-charcoal-500 font-medium hidden sm:block mt-0.5">
                  Circular Municipal Platform
                </span>
              </div>
            </Link>

            {/* Persistent Simulated Data Badge with Accessible Popover (Section 2) */}
            <div className="relative" ref={badgePopoverRef}>
              <button
                type="button"
                onClick={() => setIsBadgeInfoOpen((prev) => !prev)}
                onMouseEnter={() => setIsBadgeInfoOpen(true)}
                onMouseLeave={() => setIsBadgeInfoOpen(false)}
                aria-expanded={isBadgeInfoOpen}
                aria-label="Explanation of simulated data mode"
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold tracking-wide bg-amberGold-100 text-amberGold-800 border border-amberGold-300 hover:bg-amberGold-200/80 transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-navy-600"
              >
                <span className="w-2 h-2 rounded-full bg-amberGold-600 animate-pulse" aria-hidden="true" />
                <span>SIMULATED DATA</span>
                <Info className="w-3 h-3 text-amberGold-700" aria-hidden="true" />
              </button>

              {isBadgeInfoOpen && (
                <div
                  role="tooltip"
                  className="absolute left-0 top-full mt-2 z-50 w-72 p-3 rounded-xl bg-navy-900 text-white text-xs shadow-xl border border-navy-700 space-y-1 animate-in fade-in zoom-in-95"
                >
                  <p className="font-bold text-amberGold-400">Client-Side Simulation</p>
                  <p className="text-navy-100 leading-relaxed text-xs">
                    All sensor fill levels, fleet routing, and resource metrics are generated locally using a seeded deterministic engine calibrated to Pune municipal data. No backend connection is required.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Desktop Center: The ONE Baseline vs ReLoop Toggle (Section 2) */}
          <div className="hidden lg:flex items-center bg-white p-1 rounded-xl border border-navy-200/80 shadow-xs">
            <span className="sr-only">Operational Strategy Mode</span>
            <button
              id="header-toggle-baseline"
              type="button"
              onClick={() => setMode('baseline')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-navy-600 ${
                mode === 'baseline'
                  ? 'bg-charcoal-700 text-white shadow-xs'
                  : 'text-charcoal-600 hover:text-navy-900 hover:bg-navy-50'
              }`}
            >
              <Clock className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Baseline (Fixed)</span>
            </button>

            <button
              id="header-toggle-reloop"
              type="button"
              onClick={() => setMode('reloop')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-navy-600 ${
                mode === 'reloop'
                  ? 'bg-navy-700 text-white shadow-sm shadow-navy-700/20'
                  : 'text-charcoal-600 hover:text-navy-900 hover:bg-navy-50'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amberGold-400" aria-hidden="true" />
              <span>ReLoop (AI-Optimized)</span>
            </button>
          </div>

          {/* Desktop Right: Controls & Guided Tour */}
          <div className="hidden md:flex items-center gap-2.5">
            {/* Status Chip */}
            <div
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-medium font-mono ${
                isSimRunning
                  ? 'bg-sage-50 text-sage-900 border-sage-200'
                  : 'bg-navy-50/70 text-charcoal-700 border-navy-100'
              }`}
            >
              <Radio
                className={`w-3 h-3 ${isSimRunning ? 'text-sage-600 animate-ping' : 'text-charcoal-400'}`}
                aria-hidden="true"
              />
              <span>{statusChipText}</span>
            </div>

            {/* Sim Control Button Group */}
            <div className="flex items-center bg-white rounded-xl border border-navy-200/80 p-0.5 shadow-xs">
              <button
                type="button"
                onClick={() => (isSimRunning ? pauseSimulation() : startSimulation())}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-navy-600 ${
                  isSimRunning
                    ? 'bg-amberGold-100 text-amberGold-900 hover:bg-amberGold-200'
                    : 'bg-sage-100 text-sage-900 hover:bg-sage-200'
                }`}
                aria-label={isSimRunning ? 'Pause simulation' : 'Run simulation'}
              >
                {isSimRunning ? (
                  <Pause className="w-3.5 h-3.5 fill-current" aria-hidden="true" />
                ) : (
                  <Play className="w-3.5 h-3.5 fill-current" aria-hidden="true" />
                )}
                <span>{isSimRunning ? 'Pause' : 'Run'}</span>
              </button>

              <button
                type="button"
                onClick={tickSimulation}
                disabled={isSimRunning}
                className="p-2 text-charcoal-600 hover:text-navy-800 hover:bg-navy-50 rounded-lg disabled:opacity-40 transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-navy-600"
                aria-label="Advance simulation by 1 hour"
                title="Advance 1 Hour"
              >
                <FastForward className="w-4 h-4" aria-hidden="true" />
              </button>

              {/* Speed Buttons */}
              <div className="flex items-center pl-1 border-l border-navy-100 text-xs font-semibold text-charcoal-500">
                {([1, 10, 60] as const).map((spd) => (
                  <button
                    key={spd}
                    type="button"
                    onClick={() => setSimSpeed(spd)}
                    aria-label={`Set speed to ${spd}x`}
                    className={`px-2 py-1 rounded-md transition-all focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-navy-600 ${
                      simSpeed === spd
                        ? 'bg-navy-700 text-white font-bold'
                        : 'hover:text-navy-800 hover:bg-navy-50'
                    }`}
                  >
                    {spd}x
                  </button>
                ))}
              </div>
            </div>

            {/* Reset Button (Opens confirmation dialog) */}
            <button
              type="button"
              onClick={openResetConfirm}
              className="p-2 text-charcoal-500 hover:text-navy-800 hover:bg-white rounded-xl border border-transparent hover:border-navy-200 transition-all focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-navy-600"
              aria-label="Reset demo to Day 1"
              title="Reset simulation state to Day 1"
            >
              <RotateCcw className="w-4 h-4" aria-hidden="true" />
            </button>

            {/* Guided Tour Trigger */}
            <Button
              variant="primary"
              size="sm"
              icon={<Sparkles className="w-3.5 h-3.5 text-amberGold-400" />}
              onClick={startGuidedTour}
              aria-label="Launch interactive guided tour"
            >
              Guided Tour
            </Button>
          </div>

          {/* Mobile Right: Simulation drawer toggle + Guided Tour icon */}
          <div className="flex md:hidden items-center gap-2">
            <button
              type="button"
              onClick={() => setIsSimPopoverOpen((prev) => !prev)}
              aria-expanded={isSimPopoverOpen}
              aria-label="Open simulation controls"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-navy-200 text-xs font-semibold text-navy-800 shadow-xs"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-navy-700" aria-hidden="true" />
              <span>Sim</span>
              <ChevronDown className="w-3.5 h-3.5 text-charcoal-400" aria-hidden="true" />
            </button>

            <Button
              variant="primary"
              size="sm"
              icon={<Sparkles className="w-3.5 h-3.5 text-amberGold-400" />}
              onClick={startGuidedTour}
              aria-label="Start guided tour"
            >
              Tour
            </Button>
          </div>

        </div>

        {/* Mobile Tier 2: Collapsible Simulation Popover / Tray (Section 2) */}
        {isSimPopoverOpen && (
          <div
            ref={simPopoverRef}
            className="md:hidden py-4 border-t border-navy-100 space-y-3 animate-in fade-in duration-150"
          >
            {/* Mode toggle */}
            <div className="flex items-center justify-between gap-2 p-1 bg-white rounded-xl border border-navy-200">
              <button
                type="button"
                onClick={() => setMode('baseline')}
                className={`flex-1 py-2 rounded-lg text-xs font-bold text-center ${
                  mode === 'baseline' ? 'bg-charcoal-700 text-white' : 'text-charcoal-600'
                }`}
              >
                Baseline (Fixed)
              </button>
              <button
                type="button"
                onClick={() => setMode('reloop')}
                className={`flex-1 py-2 rounded-lg text-xs font-bold text-center ${
                  mode === 'reloop' ? 'bg-navy-700 text-white' : 'text-charcoal-600'
                }`}
              >
                ReLoop (AI)
              </button>
            </div>

            {/* Sim actions */}
            <div className="flex items-center justify-between gap-2 bg-white p-2 rounded-xl border border-navy-200">
              <Button
                variant={isSimRunning ? 'secondary' : 'sage'}
                size="sm"
                icon={isSimRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                onClick={() => (isSimRunning ? pauseSimulation() : startSimulation())}
                className="flex-1"
              >
                {isSimRunning ? 'Pause' : 'Run Sim'}
              </Button>

              <Button
                variant="ghost"
                size="sm"
                icon={<FastForward className="w-4 h-4" />}
                onClick={tickSimulation}
                disabled={isSimRunning}
                aria-label="Step 1 hour"
              >
                +1h
              </Button>

              <div className="flex items-center border-l border-navy-100 pl-1">
                {([1, 10, 60] as const).map((spd) => (
                  <button
                    key={spd}
                    type="button"
                    onClick={() => setSimSpeed(spd)}
                    className={`px-2 py-1 rounded text-xs font-bold ${
                      simSpeed === spd ? 'bg-navy-700 text-white' : 'text-charcoal-600'
                    }`}
                  >
                    {spd}x
                  </button>
                ))}
              </div>

              <Button
                variant="ghost"
                size="sm"
                icon={<RotateCcw className="w-4 h-4 text-red-600" />}
                onClick={() => {
                  setIsSimPopoverOpen(false);
                  openResetConfirm();
                }}
                aria-label="Reset simulation"
              >
                Reset
              </Button>
            </div>

            <div className="text-center text-xs font-mono text-charcoal-500">
              {statusChipText}
            </div>
          </div>
        )}

      </div>
    </header>
  );
};
