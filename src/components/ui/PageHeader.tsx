import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ChevronRight, HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { Badge } from './Badge';

export interface PageHeaderProps {
  title: string;
  subtitle?: string;
  decisionPrompt?: string;
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
  decisionPrompt,
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
    <div className="flex flex-col gap-3 pb-4 mb-6 border-b border-line">
      
      {/* Top breadcrumb & navigation strip */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-fg-muted">
          <Link
            to="/app/overview"
            className="hover:text-fg transition-colors font-medium focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-emerald-500 rounded px-1"
          >
            ReLoop City
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-fg-subtle" aria-hidden="true" />
          {showBackToDashboard && title !== 'Waste-to-Value Municipal Dashboard' && (
            <>
              <Link
                to="/app/dashboard"
                className="hover:text-fg transition-colors font-medium flex items-center gap-1 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-emerald-500 rounded px-1"
              >
                <ArrowLeft className="w-3 h-3" aria-hidden="true" />
                <span>Dashboard</span>
              </Link>
              <ChevronRight className="w-3.5 h-3.5 text-fg-subtle" aria-hidden="true" />
            </>
          )}
          <span className="font-semibold text-fg" aria-current="page">
            {title}
          </span>
        </nav>

        {stepNumber && (
          <Badge variant="navy" size="md">
            <span>Step {stepNumber} of {totalSteps}</span>
            {stepName && <span className="text-fg-muted">· {stepName}</span>}
          </Badge>
        )}
      </div>

      {/* Main Title and Action Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3">
          {icon && (
            <div className="w-10 h-10 rounded-xl bg-surface-muted text-fg border border-line flex items-center justify-center flex-shrink-0 shadow-2xs">
              {icon}
            </div>
          )}
          <div>
            <h1
              tabIndex={-1}
              className="text-3xl font-semibold text-fg tracking-tight focus:outline-hidden"
            >
              {title}
            </h1>
            {subtitle && (
              <p className="text-sm text-fg-muted mt-1 max-w-3xl leading-relaxed">
                {subtitle}
              </p>
            )}
            {decisionPrompt && (
              <div className="mt-2.5 flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-500/15 border border-emerald-200 dark:border-emerald-500/30 text-xs sm:text-sm font-medium text-fg w-fit">
                <span className="px-2 py-0.5 rounded-md bg-emerald-700 dark:bg-emerald-600 text-white text-[11px] font-semibold flex-shrink-0">
                  Your decision
                </span>
                <span className="text-emerald-950 dark:text-emerald-300 font-semibold">{decisionPrompt}</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto flex-wrap">
          {howItWorks && (
            <button
              type="button"
              onClick={() => setIsHowItWorksOpen(!isHowItWorksOpen)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-line hover:border-emerald-500 bg-surface hover:bg-surface-muted text-xs font-semibold text-fg transition-all shadow-2xs cursor-pointer"
            >
              <HelpCircle className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>How this works</span>
              {isHowItWorksOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          )}
          {actions}
        </div>
      </div>

      {/* Collapsible "How this works" Accordion */}
      {howItWorks && isHowItWorksOpen && (
        <div className="mt-2 p-4 rounded-2xl bg-surface border border-emerald-200 dark:border-emerald-500/30 shadow-sm text-xs text-fg-muted space-y-2 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 dark:text-emerald-300">
            <HelpCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Operational Architecture & Intelligence Guide</span>
          </div>
          <div className="leading-relaxed text-fg-muted">
            {howItWorks}
          </div>
        </div>
      )}

    </div>
  );
};
