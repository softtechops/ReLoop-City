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
  'Live Bin Map',
  'Waste Forecast',
  'Smart Routes',
  'Waste Sorting (AI Vision)',
  'Where Waste Goes & Energy',
  'Where Waste Goes & Energy',
  'Results & Revenue',
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
      className="mt-12 pt-6 border-t border-navy-100 flex flex-col sm:flex-row items-center justify-between gap-4"
    >
      <div>
        {resolvedPrevPath ? (
          <Link to={resolvedPrevPath} className="w-full sm:w-auto">
            <Button
              variant="secondary"
              size="sm"
              icon={<ArrowLeft className="w-4 h-4" />}
              iconPosition="left"
              className="w-full sm:w-auto"
            >
              Previous: {prevLabel || 'Previous Step'}
            </Button>
          </Link>
        ) : (
          <Link to="/app/overview" className="w-full sm:w-auto">
            <Button variant="ghost" size="sm" icon={<ArrowLeft className="w-4 h-4" />} iconPosition="left">
              Overview
            </Button>
          </Link>
        )}
      </div>

      <div className="flex flex-col items-center text-center">
        <span className="text-xs font-bold uppercase tracking-wider text-navy-700">
          The 7-Step AI Loop · Step {currentStep} of 7
        </span>
        <span className="text-xs text-charcoal-500 font-medium">
          {STEP_NAMES[currentStep - 1] || 'Loop Step'}
        </span>
      </div>

      <div>
        {resolvedNextPath ? (
          <Link to={resolvedNextPath} className="w-full sm:w-auto">
            <Button
              variant="primary"
              size="sm"
              icon={<ArrowRight className="w-4 h-4" />}
              iconPosition="right"
              className="w-full sm:w-auto"
            >
              Next: {nextLabel || 'Next Step'}
            </Button>
          </Link>
        ) : (
          <Link to="/app/dashboard" className="w-full sm:w-auto">
            <Button
              variant="sage"
              size="sm"
              icon={<CheckCircle2 className="w-4 h-4" />}
              iconPosition="right"
              className="w-full sm:w-auto"
            >
              Complete Loop: Dashboard
            </Button>
          </Link>
        )}
      </div>
    </nav>
  );
};
