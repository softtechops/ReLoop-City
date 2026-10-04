import React, { useEffect } from 'react';
import { useStore } from '../store/useStore';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  FastForward, 
  Sparkles, 
  HelpCircle,
  Clock,
  Radio,
  SlidersHorizontal,
  Layers
} from 'lucide-react';

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
    resetSimulation,
    setMode,
    startGuidedTour,
  } = useStore();

  // Auto-tick effect when simulation is running
  useEffect(() => {
    if (!isSimRunning) return;

    const intervalMs = simSpeed === 60 ? 100 : simSpeed === 10 ? 500 : 1500;
    const interval = setInterval(() => {
      tickSimulation();
    }, intervalMs);

    return () => clearInterval(interval);
  }, [isSimRunning, simSpeed, tickSimulation]);

  return (
    <header className="sticky top-0 z-30 bg-[#F7F6F2]/95 backdrop-blur-md border-b border-navy-100 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Left: Brand Identity & Simulated Data Badge */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-navy-700 flex items-center justify-center text-white font-bold shadow-md shadow-navy-700/20">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
                <path d="M3 3v5h5"/>
                <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/>
                <path d="M16 21h5v-5"/>
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl tracking-tight text-navy-800 font-['Outfit']">
                  ReLoop <span className="text-sage-600">City</span>
                </span>
                {/* Persistent Simulated Data Badge */}
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-wide bg-amberGold-100 text-amberGold-800 border border-amberGold-300 shadow-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-amberGold-500 animate-pulse"></span>
                  SIMULATED DATA
                </span>
              </div>
              <p className="text-[11px] text-charcoal-400 hidden sm:block font-medium">
                AI-Powered Waste-to-Resource Platform • PCCOE Pune Pilot
              </p>
            </div>
          </div>
        </div>

        {/* Center: Baseline vs ReLoop Mode Toggle */}
        <div className="flex items-center bg-white p-1 rounded-xl border border-navy-100 shadow-xs">
          <button
            id="toggle-baseline"
            onClick={() => setMode('baseline')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              mode === 'baseline'
                ? 'bg-residual-500 text-white shadow-xs'
                : 'text-charcoal-500 hover:text-charcoal-800 hover:bg-navy-50'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Baseline (Fixed)</span>
          </button>
          
          <button
            id="toggle-reloop"
            onClick={() => setMode('reloop')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              mode === 'reloop'
                ? 'bg-navy-700 text-white shadow-sm shadow-navy-700/30'
                : 'text-charcoal-500 hover:text-charcoal-800 hover:bg-navy-50'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amberGold-400" />
            <span>ReLoop (AI-Optimized)</span>
          </button>
        </div>

        {/* Right: Simulation Controls & Guided Tour */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Simulation Clock */}
          <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-navy-50/70 border border-navy-100 text-navy-800 text-xs font-medium font-mono">
            <Radio className={`w-3 h-3 ${isSimRunning ? 'text-sage-500 animate-ping' : 'text-charcoal-400'}`} />
            <span>Day {simState.currentDay}, {String(simState.currentHour).padStart(2, '0')}:00</span>
            <span className="text-charcoal-400">({simState.history[simState.history.length - 1]?.dayOfWeek.slice(0, 3)})</span>
          </div>

          {/* Play/Pause & Step Buttons */}
          <div className="flex items-center bg-white rounded-lg border border-navy-100 p-0.5 shadow-xs">
            <button
              id="sim-play-pause-btn"
              onClick={() => (isSimRunning ? pauseSimulation() : startSimulation())}
              className={`p-1.5 rounded-md text-xs font-semibold transition-colors flex items-center gap-1 ${
                isSimRunning 
                  ? 'bg-amberGold-100 text-amberGold-800 hover:bg-amberGold-200' 
                  : 'bg-sage-100 text-sage-800 hover:bg-sage-200'
              }`}
              title={isSimRunning ? 'Pause simulation' : 'Run simulation'}
            >
              {isSimRunning ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
              <span className="hidden md:inline pr-1">{isSimRunning ? 'Pause' : 'Run'}</span>
            </button>

            <button
              id="sim-step-btn"
              onClick={tickSimulation}
              disabled={isSimRunning}
              className="p-1.5 text-charcoal-600 hover:text-navy-700 hover:bg-navy-50 rounded-md disabled:opacity-40 transition-colors"
              title="Advance 1 Hour"
            >
              <FastForward className="w-4 h-4" />
            </button>

            {/* Speed Selector */}
            <div className="hidden sm:flex items-center pl-1 border-l border-navy-100 text-[11px] font-semibold text-charcoal-500">
              {([1, 10, 60] as const).map((spd) => (
                <button
                  key={spd}
                  onClick={() => setSimSpeed(spd)}
                  className={`px-1.5 py-0.5 rounded transition-all ${
                    simSpeed === spd
                      ? 'bg-navy-700 text-white font-bold'
                      : 'hover:text-navy-700'
                  }`}
                >
                  {spd}x
                </button>
              ))}
            </div>
          </div>

          {/* Reset Demo Button */}
          <button
            id="reset-demo-btn"
            onClick={resetSimulation}
            className="p-2 text-charcoal-500 hover:text-navy-800 hover:bg-white rounded-lg border border-transparent hover:border-navy-100 transition-all shadow-xs"
            title="Reset Simulation State to Initial"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Guided Tour Trigger Button */}
          <button
            id="guided-tour-btn"
            onClick={startGuidedTour}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-navy-700 hover:bg-navy-800 text-white text-xs font-semibold shadow-sm transition-all hover:shadow-navy-700/20 active:scale-95"
          >
            <Sparkles className="w-3.5 h-3.5 text-amberGold-400" />
            <span className="hidden sm:inline">Guided Tour</span>
          </button>
        </div>

      </div>
    </header>
  );
};
