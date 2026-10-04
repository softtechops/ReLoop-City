import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ChevronRight, Sparkles } from 'lucide-react';
import { Badge } from './Badge';

export interface PageHeaderProps {
  title: string;
  subtitle?: string;
  stepNumber?: number;
  totalSteps?: number;
  stepName?: string;
  actions?: React.ReactNode;
  showBackToDashboard?: boolean;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  stepNumber,
  totalSteps = 7,
  stepName,
  actions,
  showBackToDashboard = true,
}) => {
  return (
    <div className="flex flex-col gap-3 pb-4 mb-6 border-b border-navy-100/70">
      
      {/* Top breadcrumb & navigation strip */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-charcoal-500">
          <Link
            to="/overview"
            className="hover:text-navy-800 transition-colors font-medium focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-navy-600 rounded px-1"
          >
            ReLoop City
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-navy-300" aria-hidden="true" />
          {showBackToDashboard && title !== 'Waste-to-Value Municipal Dashboard' && (
            <>
              <Link
                to="/dashboard"
                className="hover:text-navy-800 transition-colors font-medium flex items-center gap-1 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-navy-600 rounded px-1"
              >
                <ArrowLeft className="w-3 h-3" aria-hidden="true" />
                <span>Dashboard</span>
              </Link>
              <ChevronRight className="w-3.5 h-3.5 text-navy-300" aria-hidden="true" />
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
        <div>
          <h1
            tabIndex={-1}
            className="text-2xl sm:text-3xl font-extrabold text-navy-900 tracking-tight font-['Outfit'] focus:outline-hidden"
          >
            {title}
          </h1>
          {subtitle && (
            <p className="text-sm text-charcoal-600 mt-1 max-w-3xl leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>

        {actions && (
          <div className="flex items-center gap-2.5 self-start sm:self-auto flex-wrap">
            {actions}
          </div>
        )}
      </div>

    </div>
  );
};
