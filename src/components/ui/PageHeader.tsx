import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ChevronRight, HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { Badge } from './Badge';

export interface PageHeaderProps {
  title: string;
  subtitle?: string;
  stepNumber?: number;
  totalSteps?: number;
  stepName?: string;
  icon?: React.ReactNode;
  howItWorks?: React.ReactNode;
  actions?: React.ReactNode;
  showBackToDashboard?: boolean;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  stepNumber,
  totalSteps = 7,
  stepName,
  icon,
  howItWorks,
  actions,
  showBackToDashboard = true,
}) => {
  const [isHowItWorksOpen, setIsHowItWorksOpen] = useState(false);

  return (
    <div className="flex flex-col gap-3 pb-4 mb-6 border-b border-charcoal-200">
      
      {/* Top breadcrumb & navigation strip */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-charcoal-500">
          <Link
            to="/app/overview"
            className="hover:text-navy-900 transition-colors font-medium focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-navy-600 rounded px-1"
          >
            ReLoop City
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-charcoal-300" aria-hidden="true" />
          {showBackToDashboard && title !== 'Waste-to-Value Municipal Dashboard' && (
            <>
              <Link
                to="/app/dashboard"
                className="hover:text-navy-900 transition-colors font-medium flex items-center gap-1 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-navy-600 rounded px-1"
              >
                <ArrowLeft className="w-3 h-3" aria-hidden="true" />
                <span>Dashboard</span>
              </Link>
              <ChevronRight className="w-3.5 h-3.5 text-charcoal-300" aria-hidden="true" />
            </>
          )}
          <span className="font-semibold text-navy-900" aria-current="page">
            {title}
          </span>
        </nav>

        {stepNumber && (
          <Badge variant="navy" size="md">
            <span className="font-mono">Step {stepNumber} of {totalSteps}</span>
            {stepName && <span className="text-navy-600">· {stepName}</span>}
          </Badge>
        )}
      </div>

      {/* Main Title and Action Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3">
          {icon && (
            <div className="w-10 h-10 rounded-xl bg-navy-50 text-navy-800 border border-navy-100 flex items-center justify-center flex-shrink-0 shadow-2xs">
              {icon}
            </div>
          )}
          <div>
            <h1
              tabIndex={-1}
              className="text-2xl sm:text-3xl font-extrabold text-navy-900 tracking-tight font-heading focus:outline-hidden"
            >
              {title}
            </h1>
            {subtitle && (
              <p className="text-sm text-charcoal-600 mt-0.5 max-w-3xl leading-relaxed">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto flex-wrap">
          {howItWorks && (
            <button
              type="button"
              onClick={() => setIsHowItWorksOpen(!isHowItWorksOpen)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-charcoal-200 hover:border-emerald-400 bg-white hover:bg-emerald-50/40 text-xs font-bold text-navy-900 transition-all shadow-2xs"
            >
              <HelpCircle className="w-3.5 h-3.5 text-emerald-600" />
              <span>How this works</span>
              {isHowItWorksOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          )}
          {actions}
        </div>
      </div>

      {/* Collapsible "How this works" Accordion */}
      {howItWorks && isHowItWorksOpen && (
        <div className="mt-2 p-4 rounded-2xl bg-white border border-emerald-200 shadow-sm text-xs text-charcoal-700 space-y-2 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-800">
            <HelpCircle className="w-4 h-4 text-emerald-600" />
            <span>Operational Architecture & Intelligence Guide</span>
          </div>
          <div className="leading-relaxed text-charcoal-600">
            {howItWorks}
          </div>
        </div>
      )}

    </div>
  );
};
