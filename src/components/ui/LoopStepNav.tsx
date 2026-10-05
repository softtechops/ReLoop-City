import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Button } from './Button';

export interface LoopStepNavProps {
  currentStep: number;
  prevPath?: string;
  prevLabel?: string;
  nextPath?: string;
  nextLabel?: string;
}

const STEP_NAMES = [
  'Sense · Live bin map',
  'Predict · Waste forecast',
  'Optimize · Smart routes',
  'Classify · Waste sorting',
  'Allocate · Waste streams',
  'Forecast · Clean energy',
  'Report · Results & revenue',
];

export const LoopStepNav: React.FC<LoopStepNavProps> = ({
  currentStep,
  prevPath,
  prevLabel,
  nextPath,
  nextLabel,
}) => {
  const resolvedPrevPath = prevPath ? (prevPath.startsWith('/app') ? prevPath : `/app${prevPath}`) : undefined;
  const resolvedNextPath = nextPath ? (nextPath.startsWith('/app') ? nextPath : `/app${nextPath}`) : undefined;

  return (
    <nav
      aria-label="7-Step AI Loop navigation"
      className="mt-12 pt-6 border-t border-line flex flex-col sm:flex-row items-center justify-between gap-4"
    >
      <div className="w-full sm:w-auto">
        {resolvedPrevPath ? (
          <Link to={resolvedPrevPath} className="block w-full sm:w-auto">
            <Button
              variant="secondary"
              size="md"
              icon={<ArrowLeft className="w-4 h-4" />}
              iconPosition="left"
              className="w-full sm:w-auto min-h-[44px] text-sm"
            >
              Previous: {prevLabel || 'Previous Step'}
            </Button>
          </Link>
        ) : (
          <Link to="/app/overview" className="block w-full sm:w-auto">
            <Button variant="ghost" size="md" icon={<ArrowLeft className="w-4 h-4" />} iconPosition="left" className="min-h-[44px] text-sm">
              Overview
            </Button>
          </Link>
        )}
      </div>

      <div className="flex flex-col items-center text-center py-1">
        <span className="text-xs font-bold uppercase tracking-wider text-fg-muted">
          The 7-Step AI Loop · Step {currentStep} of 7
        </span>
        <span className="text-sm font-semibold text-fg">
          {STEP_NAMES[currentStep - 1] || 'Loop Step'}
        </span>
      </div>

      <div className="w-full sm:w-auto">
        {resolvedNextPath ? (
          <Link to={resolvedNextPath} className="block w-full sm:w-auto">
            <Button
              variant="primary"
              size="md"
              icon={<ArrowRight className="w-4 h-4" />}
              iconPosition="right"
              className="w-full sm:w-auto min-h-[44px] text-sm bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-md shadow-emerald-900/10 px-5"
            >
              Next: {nextLabel || 'Next Step'}
            </Button>
          </Link>
        ) : (
          <Link to="/app/dashboard" className="block w-full sm:w-auto">
            <Button
              variant="primary"
              size="md"
              icon={<CheckCircle2 className="w-4 h-4" />}
              iconPosition="right"
              className="w-full sm:w-auto min-h-[44px] text-sm bg-navy-900 hover:bg-navy-800 text-white font-bold px-5"
            >
              Complete Loop: Dashboard
            </Button>
          </Link>
        )}
      </div>
    </nav>
  );
};
