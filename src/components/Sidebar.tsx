import React, { useEffect, useRef } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Radio,
  TrendingUp,
  Route,
  ScanSearch,
  GitFork,
  Sparkles,
  Coins,
  Settings2,
  Compass,
  FlaskConical,
  Printer,
} from 'lucide-react';

interface StepperItem {
  path: string;
  stepNumber: number;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string; 'aria-hidden'?: boolean | 'true' | 'false' }>;
}

export const Sidebar: React.FC = () => {
  const location = useLocation();
  const activePillRef = useRef<HTMLAnchorElement | null>(null);

  // The 7 AI Loop steps with short names
  const aiLoopSteps: StepperItem[] = [
    { path: '/app/map', stepNumber: 1, label: 'Sense', description: 'Live fill telemetry from 100 smart bins across 5 pilot zones', icon: Radio },
    { path: '/app/predict', stepNumber: 2, label: 'Predict', description: 'LSTM model forecasts bin overflow 24 hours ahead', icon: TrendingUp },
    { path: '/app/optimize', stepNumber: 3, label: 'Optimize', description: 'CVRP routing dispatches trucks when bins exceed 75%', icon: Route },
    { path: '/app/classify', stepNumber: 4, label: 'Classify', description: 'Optical sorting separates polymers, metals, organics', icon: ScanSearch },
    { path: '/app/allocate', stepNumber: 5, label: 'Allocate', description: 'Material streams routed to MRF, AD plant, or compost', icon: GitFork },
    { path: '/app/forecast', stepNumber: 6, label: 'Forecast', description: 'Biogas CHP converts organic digestate to clean power', icon: Sparkles },
    { path: '/app/revenue', stepNumber: 7, label: 'Report', description: 'Revenue, CO₂ diversion and EPR credits settled', icon: Coins },
  ];

  // Plan section items
  const planViews = [
    { path: '/app/scenarios', label: 'Scenarios', description: 'Custom policy builder and operational thresholds', icon: FlaskConical },
    { path: '/app/report', label: 'Report', description: 'Print-ready municipal report and council export', icon: Printer },
  ];

  // More section items
  const moreViews = [
    { path: '/app/assumptions', label: 'Assumptions', description: 'Methodology and pilot model parameters', icon: Settings2 },
    { path: '/app/overview', label: 'Overview', description: 'High-level circular economy concept', icon: Compass },
  ];

  // Auto-scroll the active mobile pill into view when route changes
  useEffect(() => {
    if (activePillRef.current) {
      activePillRef.current.scrollIntoView({
        behavior: 'smooth',
        inline: 'center',
        block: 'nearest',
      });
    }
  }, [location.pathname]);

  const navLinkClasses = (isActive: boolean) =>
    `relative flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm transition-colors min-h-[40px] focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-emerald-600 ${
      isActive
        ? 'bg-emerald-50 text-emerald-900 dark:bg-emerald-500/15 dark:text-emerald-300 font-semibold before:absolute before:left-0 before:top-1.5 before:bottom-1.5 before:w-[3px] before:bg-emerald-600 before:rounded-r'
        : 'text-fg-muted hover:text-fg hover:bg-surface-muted font-medium'
    }`;

  return (
    <>
      {/* Desktop Left Rail Sidebar: Themed surface, 264px wide */}
      <aside
        aria-label="Main Navigation"
        className="hidden md:flex flex-col w-[264px] bg-surface border-r border-line flex-shrink-0 h-[calc(100vh-4rem)] sticky top-16 select-none"
      >
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          
          {/* Group 1: Overview */}
          <div>
            <div className="px-3 mb-1.5">
              <span className="text-xs font-semibold text-fg-subtle">
                Overview
              </span>
            </div>
            <nav aria-label="Overview navigation">
              <NavLink
                to="/app/dashboard"
                className={({ isActive }) => navLinkClasses(isActive)}
                title="Municipal operations dashboard and primary KPIs"
              >
                {({ isActive }) => (
                  <>
                    <LayoutDashboard
                      className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-emerald-600 dark:text-emerald-400' : 'text-fg-subtle'}`}
                      aria-hidden="true"
                    />
                    <span>Dashboard</span>
                  </>
                )}
              </NavLink>
            </nav>
          </div>

          {/* Group 2: Circular loop (7 Steps) */}
          <div>
            <div className="px-3 mb-1.5 flex items-center justify-between">
              <span className="text-xs font-semibold text-fg-subtle">
                Circular loop
              </span>
              <span className="text-[11px] font-medium text-fg-subtle">
                7 steps
              </span>
            </div>

            {/* Stepper with quiet connecting line */}
            <nav aria-label="7-Step Circular Loop" className="relative space-y-0.5">
              <div
                className="absolute left-[21px] top-3 bottom-3 w-px bg-line"
                aria-hidden="true"
              />

              {aiLoopSteps.map((step) => {
                const Icon = step.icon;
                const isActive = location.pathname === step.path;

                return (
                  <NavLink
                    key={step.path}
                    to={step.path}
                    title={step.description}
                    className={navLinkClasses(isActive)}
                  >
                    {/* Consistent numbered circle */}
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 text-[11px] transition-colors relative z-10 ${
                        isActive
                          ? 'bg-emerald-600 text-white font-bold'
                          : 'bg-surface text-fg-muted border border-line'
                      }`}
                      aria-hidden="true"
                    >
                      {step.stepNumber}
                    </div>

                    <Icon
                      className={`w-4 h-4 flex-shrink-0 relative z-10 ${
                        isActive ? 'text-emerald-600 dark:text-emerald-400' : 'text-fg-subtle'
                      }`}
                      aria-hidden="true"
                    />

                    <span className="truncate text-sm relative z-10">
                      {step.label}
                    </span>
                  </NavLink>
                );
              })}
            </nav>
          </div>

          {/* Group 3: Plan */}
          <div>
            <div className="px-3 mb-1.5">
              <span className="text-xs font-semibold text-fg-subtle">
                Plan
              </span>
            </div>
            <nav aria-label="Planning navigation" className="space-y-0.5">
              {planViews.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    title={item.description}
                    className={navLinkClasses(isActive)}
                  >
                    <Icon
                      className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-emerald-600 dark:text-emerald-400' : 'text-fg-subtle'}`}
                      aria-hidden="true"
                    />
                    <span>{item.label}</span>
                  </NavLink>
                );
              })}
            </nav>
          </div>

          {/* Group 4: More */}
          <div>
            <div className="px-3 mb-1.5">
              <span className="text-xs font-semibold text-fg-subtle">
                More
              </span>
            </div>
            <nav aria-label="Additional pages navigation" className="space-y-0.5">
              {moreViews.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    title={item.description}
                    className={navLinkClasses(isActive)}
                  >
                    <Icon
                      className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-emerald-600 dark:text-emerald-400' : 'text-fg-subtle'}`}
                      aria-hidden="true"
                    />
                    <span>{item.label}</span>
                  </NavLink>
                );
              })}
            </nav>
          </div>

        </div>
      </aside>

      {/* Mobile Horizontal Scrollable Step Bar */}
      <nav
        aria-label="Mobile Step Navigation"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-surface/95 backdrop-blur-md border-t border-line px-2 py-2 safe-bottom-padding shadow-lg"
      >
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar scroll-smooth px-1">
          {/* Dashboard pill */}
          {(() => {
            const isDashActive = location.pathname === '/app/dashboard' || location.pathname === '/app';
            return (
              <NavLink
                to="/app/dashboard"
                ref={isDashActive ? activePillRef : null}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap min-h-[38px] transition-all flex-shrink-0 ${
                  isDashActive
                    ? 'bg-emerald-50 text-emerald-900 border border-emerald-300 dark:bg-emerald-500/15 dark:text-emerald-300 dark:border-emerald-500/30 shadow-2xs'
                    : 'text-fg-muted bg-surface-muted hover:bg-slate-200 dark:hover:bg-slate-800 border border-line'
                }`}
              >
                <LayoutDashboard className={`w-3.5 h-3.5 ${isDashActive ? 'text-emerald-600 dark:text-emerald-400' : 'text-fg-subtle'}`} aria-hidden="true" />
                <span>Dashboard</span>
              </NavLink>
            );
          })()}

          {/* 7 AI Steps pills */}
          {aiLoopSteps.map((step) => {
            const Icon = step.icon;
            const isActive = location.pathname === step.path;

            return (
              <NavLink
                key={step.path}
                to={step.path}
                ref={isActive ? activePillRef : null}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap min-h-[38px] transition-all flex-shrink-0 ${
                  isActive
                    ? 'bg-emerald-50 text-emerald-900 border border-emerald-300 dark:bg-emerald-500/15 dark:text-emerald-300 dark:border-emerald-500/30 shadow-2xs'
                    : 'text-fg-muted bg-surface-muted hover:bg-slate-200 dark:hover:bg-slate-800 border border-line'
                }`}
              >
                <span
                  className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${
                    isActive ? 'bg-emerald-600 text-white' : 'bg-surface text-fg-muted border border-line'
                  }`}
                  aria-hidden="true"
                >
                  {step.stepNumber}
                </span>
                <Icon className={`w-3 h-3 ${isActive ? 'text-emerald-600 dark:text-emerald-400' : 'text-fg-subtle'}`} aria-hidden="true" />
                <span>{step.label}</span>
              </NavLink>
            );
          })}

          {/* Plan pills */}
          {planViews.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                ref={isActive ? activePillRef : null}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap min-h-[38px] transition-all flex-shrink-0 ${
                  isActive
                    ? 'bg-emerald-50 text-emerald-900 border border-emerald-300 dark:bg-emerald-500/15 dark:text-emerald-300 dark:border-emerald-500/30 font-semibold shadow-2xs'
                    : 'text-fg-muted bg-surface hover:bg-surface-muted border border-line'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-600 dark:text-emerald-400' : 'text-fg-subtle'}`} aria-hidden="true" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}

          {/* More pills */}
          {moreViews.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                ref={isActive ? activePillRef : null}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap min-h-[38px] transition-all flex-shrink-0 ${
                  isActive
                    ? 'bg-emerald-50 text-emerald-900 border border-emerald-300 dark:bg-emerald-500/15 dark:text-emerald-300 dark:border-emerald-500/30 font-semibold shadow-2xs'
                    : 'text-fg-muted bg-surface hover:bg-surface-muted border border-line'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-600 dark:text-emerald-400' : 'text-fg-subtle'}`} aria-hidden="true" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </div>
      </nav>
    </>
  );
};
