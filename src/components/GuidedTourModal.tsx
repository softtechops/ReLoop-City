import React from 'react';
import { useStore } from '../store/useStore';
import { GuidedTourStep } from '../types';
import { 
  X, 
  ChevronRight, 
  ChevronLeft, 
  Sparkles, 
  ArrowRight,
  Radio,
  TrendingUp,
  Route,
  ScanSearch,
  GitFork,
  Zap,
  BarChart3
} from 'lucide-react';

const TOUR_STEPS: GuidedTourStep[] = [
  {
    stepNumber: 1,
    stepName: 'SENSE',
    pageTarget: 'map',
    title: '1. Sense: Smart Bins & IoT Telemetry',
    description: '100 smart bins across 5 pilot zones in Pune continuously report fill percentage, primary waste stream, and compaction weight. Ultrasonic sensors prevent manual visual checks.',
    highlightAction: 'Click on any green, amber, or red bin on the map to inspect its real-time telemetry, waste breakdown, and predicted time to full.',
    takeaway: 'Replaces blind fixed garbage schedules with real-time municipal transparency.',
  },
  {
    stepNumber: 2,
    stepName: 'PREDICT',
    pageTarget: 'predict',
    title: '2. Predict: Generation Hotspots & Seasonality',
    description: 'Our time-series model accounts for diurnal human rhythms and weekday/weekend seasonality to forecast waste generation curves 24-72 hours into the future.',
    highlightAction: 'View the 48-hour volume forecast chart and review the "Predicted Full in X Hours" critical alert table.',
    takeaway: 'Cities move from reactive fire-fighting of overflowing bins to predictive preemption.',
  },
  {
    stepNumber: 3,
    stepName: 'OPTIMIZE',
    pageTarget: 'optimize',
    title: '3. Optimize: Dynamic Capacity-Constrained Routing',
    description: 'Instead of trucks visiting every bin daily (wasting 40%+ fuel on half-empty bins), ReLoop runs a Nearest-Neighbor + 2-Opt CVRP algorithm only visiting bins predicted ≥ 75% full.',
    highlightAction: 'Click "Recalculate Dynamic Routes" to view the 4 truck tours color-coded on the map and see the 32% distance reduction table.',
    takeaway: 'Saves thousands of liters of municipal diesel and prevents greenhouse gas emissions.',
  },
  {
    stepNumber: 4,
    stepName: 'CLASSIFY',
    pageTarget: 'classify',
    title: '4. Classify: Automated MRF Material Sorting',
    description: 'At the Material Recovery Facility, high-speed vision AI models inspect incoming streams, categorizing items into pure recyclables, wet organics, C&D debris, e-waste, and residual.',
    highlightAction: 'Click any sample waste item or upload an image to trigger instant computer vision inference, confidence scoring, and routing advice.',
    takeaway: 'Unlocks high-purity commodity grade plastics and metals worth up to 10x mixed waste.',
  },
  {
    stepNumber: 5,
    stepName: 'ALLOCATE',
    pageTarget: 'allocate',
    title: '5. Allocate: Closed-Loop Processing Streams',
    description: 'Materials are automatically routed to their optimal circular destination: wet organics to Anaerobic Digesters, dry recyclables to baling lines, and rubble to aggregate crushers.',
    highlightAction: 'Explore the live mass flow diagram and facility capacity bars to see how 95% of incoming waste is diverted from landfills.',
    takeaway: 'Minimizes landfill dependency while feeding secondary manufacturing industries.',
  },
  {
    stepNumber: 6,
    stepName: 'FORECAST',
    pageTarget: 'allocate',
    title: '6. Forecast: Renewable Energy & Clean Bio-Methane',
    description: 'ReLoop calculates bio-methanation conversion yields, generating clean electricity (MWh) and Bio-CNG for municipal vehicle fleets or city grid feed-in.',
    highlightAction: 'Check the Energy Yield Forecast card to see MWh power produced and equivalent homes electrified.',
    takeaway: 'Transforms municipal waste management from an expensive cost center into an energy-generating asset.',
  },
  {
    stepNumber: 7,
    stepName: 'REPORT',
    pageTarget: 'dashboard',
    title: '7. Report: The Municipal Waste-to-Value Dashboard',
    description: 'The executive command center for city commissioners, displaying real-time resource recovery, revenue earned, CO₂ avoided, and a live toggle against Baseline fixed schedules.',
    highlightAction: 'Toggle between "Baseline" and "ReLoop" at the top to watch the KPI delta badges update dynamically.',
    takeaway: 'Provides data-driven proof of circular economics and municipal climate impact.',
  },
];

export const GuidedTourModal: React.FC = () => {
  const { isGuidedTourOpen, currentTourStep, nextTourStep, prevTourStep, closeGuidedTour, setActivePage } = useStore();

  if (!isGuidedTourOpen) return null;

  const step = TOUR_STEPS[currentTourStep] || TOUR_STEPS[0];
  const stepIcons = [Radio, TrendingUp, Route, ScanSearch, GitFork, Zap, BarChart3];
  const StepIcon = stepIcons[currentTourStep] || Sparkles;

  const handleStepClick = (index: number) => {
    useStore.setState({ currentTourStep: index, activePage: TOUR_STEPS[index].pageTarget });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-2xl w-full border border-navy-100 shadow-2xl overflow-hidden flex flex-col">
        
        {/* Top Header */}
        <div className="bg-navy-700 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-amberGold-400">
              <StepIcon className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-amberGold-300">
                  Step {step.stepNumber} of 7 • {step.stepName}
                </span>
                <span className="px-1.5 py-0.5 rounded text-[10px] bg-white/15 text-white font-mono">
                  Guided Tour
                </span>
              </div>
              <h3 className="text-lg font-bold text-white font-['Outfit']">
                {step.title}
              </h3>
            </div>
          </div>
          
          <button
            onClick={closeGuidedTour}
            className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Progress Dots */}
        <div className="bg-navy-50/80 px-6 py-2.5 border-b border-navy-100 flex items-center justify-between">
          <div className="flex items-center gap-1.5 sm:gap-2">
            {TOUR_STEPS.map((s, idx) => (
              <button
                key={s.stepNumber}
                onClick={() => handleStepClick(idx)}
                className={`group flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-semibold transition-all ${
                  idx === currentTourStep
                    ? 'bg-navy-700 text-white shadow-xs'
                    : idx < currentTourStep
                    ? 'bg-sage-100 text-sage-800 hover:bg-sage-200'
                    : 'bg-white text-charcoal-500 hover:bg-navy-100/60'
                }`}
              >
                <span>{s.stepNumber}. {s.stepName}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-4 text-charcoal-700">
          <p className="text-sm leading-relaxed text-charcoal-600">
            {step.description}
          </p>

          <div className="p-3.5 rounded-xl bg-amberGold-50/80 border border-amberGold-200 text-amberGold-900 text-xs flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 text-amberGold-600 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block mb-0.5">Try this in the UI:</span>
              <span>{step.highlightAction}</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-sage-50/80 border border-sage-200 text-sage-900 text-xs flex items-start gap-2.5">
            <div className="w-2 h-2 rounded-full bg-sage-600 flex-shrink-0 mt-1.5"></div>
            <div>
              <span className="font-bold block mb-0.5">Circular Impact:</span>
              <span>{step.takeaway}</span>
            </div>
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="p-4 bg-navy-50/50 border-t border-navy-100 flex items-center justify-between">
          <button
            onClick={prevTourStep}
            disabled={currentTourStep === 0}
            className="flex items-center gap-1 px-3 py-2 rounded-lg text-xs font-semibold text-charcoal-600 hover:text-navy-800 disabled:opacity-40 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          <span className="text-xs font-mono text-charcoal-400">
            {currentTourStep + 1} / {TOUR_STEPS.length}
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={closeGuidedTour}
              className="px-3 py-2 rounded-lg text-xs font-semibold text-charcoal-500 hover:text-charcoal-800 transition-colors"
            >
              Exit Tour
            </button>
            <button
              onClick={nextTourStep}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-navy-700 hover:bg-navy-800 text-white text-xs font-bold shadow-md shadow-navy-700/20 transition-all"
            >
              <span>{currentTourStep === TOUR_STEPS.length - 1 ? 'Finish & Explore' : 'Next Step'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
