import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
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
  BarChart3,
  CheckCircle2
} from 'lucide-react';
import { Button } from './ui/Button';

const TOUR_STEPS: (GuidedTourStep & { routePath: string })[] = [
  {
    stepNumber: 1,
    stepName: 'SENSE',
    pageTarget: 'map',
    routePath: '/app/map',
    title: '1 · Sense: Live Bin Map & Priority Flagging',
    description: '100 smart IoT bins across 5 pilot zones in Pune report fill percentage and weight in real time. As Operations Manager, decide which bins require immediate collection.',
    highlightAction: 'Click any bin on the map to open the telemetry drawer and use "Mark Bin for Priority Pickup" to flag it for your route.',
    takeaway: 'Your decision directly surfaces priority bins on the Dashboard and alerts panel.',
  },
  {
    stepNumber: 2,
    stepName: 'PREDICT',
    pageTarget: 'predict',
    routePath: '/app/predict',
    title: '2 · Predict: Advance Overflow Preemption',
    description: 'Our time-series model forecasts waste accumulation 24–72 hours ahead. Decide where overflow will happen and pre-allocate fleet capacity.',
    highlightAction: 'Click "Prioritize for Advance Dispatch" on any zone forecast card to schedule preemptive morning collection.',
    takeaway: 'Preempts bin overflow before citizen complaints occur.',
  },
  {
    stepNumber: 3,
    stepName: 'OPTIMIZE',
    pageTarget: 'optimize',
    routePath: '/app/optimize',
    title: '3 · Optimize: Smart CVRP Fleet Routing',
    description: 'Instead of blind fixed schedules, ReLoop solves a 2-Opt CVRP routing heuristic, only dispatching trucks to bins exceeding the 75% fill threshold.',
    highlightAction: 'Click "Recalculate Dynamic Routes" to solve tours and observe immediate fuel and kilometer savings.',
    takeaway: 'Cuts municipal compactor travel distance by 32% and saves ₹13,100+ quarterly fuel.',
  },
  {
    stepNumber: 4,
    stepName: 'CLASSIFY',
    pageTarget: 'classify',
    routePath: '/app/classify',
    title: '4 · Classify: Optical Vision Sorting',
    description: 'At the Material Recovery Facility, computer vision models sort incoming materials at 95%+ purity. Decide destination facilities for high-value fractions.',
    highlightAction: 'Click the facility destination chips (MRF Baling, Anaerobic Digestion, Composting, RDF) to override material routing.',
    takeaway: 'Unlocks high-purity recycled polymers and clean feedstock for municipal bio-refining.',
  },
  {
    stepNumber: 5,
    stepName: 'ALLOCATE',
    pageTarget: 'allocate',
    routePath: '/app/allocate',
    title: '5 · Allocate: Closed-Loop Diversion Strategy',
    description: 'Determine how today\'s municipal waste is partitioned across city processing facilities. Choose your operating strategy.',
    highlightAction: 'Switch between "Balanced Diversion", "Max Clean Energy", and "Max Material Recovery" to reshape mass flows.',
    takeaway: 'Directly diverts 95.1% of waste away from the Moshi dumpsite.',
  },
  {
    stepNumber: 6,
    stepName: 'FORECAST',
    pageTarget: 'forecast',
    routePath: '/app/forecast',
    title: '6 · Forecast: Clean Energy Off-Take Policy',
    description: 'Convert organic digestate into biomethane and electricity. Decide where to commit your municipal clean energy yield.',
    highlightAction: 'Select between "MSEDCL Grid Feed-in (₹6.80/kWh)" and "PMPML Transit Bus Depot Charging" to lock in clean utility contracts.',
    takeaway: 'Generates up to 71.0 MWh clean power, electrifying municipal services.',
  },
  {
    stepNumber: 7,
    stepName: 'REPORT',
    pageTarget: 'revenue',
    routePath: '/app/revenue',
    title: '7 · Report: Council Briefing & Certification',
    description: 'The executive command ledger transforms waste from a cost center into a self-financing ₹20.4 Lakh quarterly surplus.',
    highlightAction: 'Click "Sign & Approve for Council" to certify the ledger for the PCMC Standing Committee, or use "Export Report" for CSV & PDF decks.',
    takeaway: 'Provides verified, council-ready proof of municipal circular economics.',
  },
];

export const GuidedTourModal: React.FC = () => {
  const { isGuidedTourOpen, currentTourStep, nextTourStep, prevTourStep, closeGuidedTour } = useStore();
  const navigate = useNavigate();
  const modalRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  const step = TOUR_STEPS[currentTourStep] || TOUR_STEPS[0];
  const stepIcons = [Radio, TrendingUp, Route, ScanSearch, GitFork, Zap, BarChart3];
  const StepIcon = stepIcons[currentTourStep] || Sparkles;

  // Sync route on step change
  useEffect(() => {
    if (isGuidedTourOpen && step) {
      navigate(step.routePath);
    }
  }, [isGuidedTourOpen, currentTourStep, step, navigate]);

  // Keyboard navigation: Escape to close, Arrow keys to navigate, focus trap (Section 3 & 7)
  useEffect(() => {
    if (!isGuidedTourOpen) return;

    previousActiveElement.current = document.activeElement as HTMLElement;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeGuidedTour();
        return;
      }
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        nextTourStep();
        return;
      }
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        prevTourStep();
        return;
      }

      // Trap focus
      if (e.key === 'Tab' && modalRef.current) {
        const focusable = modalRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    // Auto-focus next button
    setTimeout(() => {
      modalRef.current?.focus();
    }, 50);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
      previousActiveElement.current?.focus();
    };
  }, [isGuidedTourOpen, closeGuidedTour, nextTourStep, prevTourStep]);

  if (!isGuidedTourOpen) return null;

  const handleStepJump = (idx: number) => {
    useStore.setState({ currentTourStep: idx });
    navigate(TOUR_STEPS[idx].routePath);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/60 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget) closeGuidedTour();
      }}
    >
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="tour-dialog-title"
        aria-describedby="tour-dialog-desc"
        tabIndex={-1}
        className="bg-white rounded-2xl max-w-2xl w-full border border-navy-100 shadow-2xl overflow-hidden flex flex-col focus:outline-hidden animate-in zoom-in-95 duration-150"
      >
        {/* Header */}
        <div className="bg-navy-700 text-white p-5 sm:p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-amberGold-400" aria-hidden="true">
              <StepIcon className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-amberGold-300">
                  Step {step.stepNumber} of 7 · {step.stepName}
                </span>
                <span className="px-2 py-0.5 rounded text-xs bg-white/15 text-white font-mono">
                  Guided Walkthrough
                </span>
              </div>
              <h2 id="tour-dialog-title" className="text-lg sm:text-xl font-bold text-white font-['Outfit'] mt-0.5">
                {step.title}
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={closeGuidedTour}
            className="p-2 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-white"
            aria-label="Close guided tour (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Progress Dots */}
        <div className="bg-navy-50/80 px-4 sm:px-6 py-2.5 border-b border-navy-100 flex items-center justify-between overflow-x-auto">
          <div className="flex items-center gap-1.5 sm:gap-2">
            {TOUR_STEPS.map((s, idx) => (
              <button
                key={s.stepNumber}
                type="button"
                onClick={() => handleStepJump(idx)}
                aria-label={`Jump to step ${s.stepNumber}: ${s.stepName}`}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all min-h-[36px] ${
                  idx === currentTourStep
                    ? 'bg-navy-700 text-white shadow-xs'
                    : idx < currentTourStep
                    ? 'bg-sage-100 text-sage-900 hover:bg-sage-200'
                    : 'bg-white text-charcoal-600 hover:bg-navy-100/60'
                }`}
              >
                <span>{s.stepNumber}. {s.stepName}</span>
              </button>
            ))}
          </div>
          <span className="text-xs font-mono text-charcoal-500 hidden sm:inline ml-2 whitespace-nowrap">
            (Use ← → arrow keys)
          </span>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-4 text-charcoal-700">
          <p id="tour-dialog-desc" className="text-sm leading-relaxed text-charcoal-600">
            {step.description}
          </p>

          <div className="p-3.5 rounded-xl bg-amberGold-50/80 border border-amberGold-200 text-amberGold-900 text-xs flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 text-amberGold-700 flex-shrink-0 mt-0.5" aria-hidden="true" />
            <div>
              <span className="font-bold block mb-0.5">Try this in the UI:</span>
              <span>{step.highlightAction}</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-sage-50/80 border border-sage-200 text-sage-900 text-xs flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-sage-700 flex-shrink-0 mt-0.5" aria-hidden="true" />
            <div>
              <span className="font-bold block mb-0.5">Circular Impact:</span>
              <span>{step.takeaway}</span>
            </div>
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="p-4 sm:p-5 bg-navy-50/50 border-t border-navy-100 flex items-center justify-between gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={prevTourStep}
            disabled={currentTourStep === 0}
            icon={<ChevronLeft className="w-4 h-4" />}
            iconPosition="left"
            aria-label="Previous step"
          >
            Previous
          </Button>

          <span className="text-xs font-mono text-charcoal-500">
            {currentTourStep + 1} / {TOUR_STEPS.length}
          </span>

          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={closeGuidedTour}
            >
              Exit Tour
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={nextTourStep}
              icon={<ChevronRight className="w-4 h-4" />}
              iconPosition="right"
            >
              {currentTourStep === TOUR_STEPS.length - 1 ? 'Finish & Explore' : 'Next Step'}
            </Button>
          </div>
        </div>

      </div>
    </div>
  );
};
