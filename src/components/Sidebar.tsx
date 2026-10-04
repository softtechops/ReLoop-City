import React, { useState, useEffect, useRef } from 'react';
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
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

interface StepperItem {
  path: string;
  stepNumber: number;
  label: string;
  shortLabel: string;
  icon: React.ComponentType<{ className?: string; 'aria-hidden'?: boolean | 'true' | 'false' }>;
}

export const Sidebar: React.FC = () => {
  const location = useLocation();
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const activePillRef = useRef<HTMLAnchorElement | null>(null);

  // The 7 AI Loop steps with unified naming convention: "<Action> · <Description>"
  const aiLoopSteps: StepperItem[] = [
    { path: '/app/map', stepNumber: 1, label: 'Sense · Live bin map', shortLabel: '1 · Sense', icon: Radio },
    { path: '/app/predict', stepNumber: 2, label: 'Predict · Waste forecast', shortLabel: '2 · Predict', icon: TrendingUp },
    { path: '/app/optimize', stepNumber: 3, label: 'Optimize · Smart routes', shortLabel: '3 · Optimize', icon: Route },
    { path: '/app/classify', stepNumber: 4, label: 'Classify · Waste sorting', shortLabel: '4 · Classify', icon: ScanSearch },
    { path: '/app/allocate', stepNumber: 5, label: 'Allocate · Waste streams', shortLabel: '5 · Allocate', icon: GitFork },
    { path: '/app/forecast', stepNumber: 6, label: 'Forecast · Clean energy', shortLabel: '6 · Forecast', icon: Sparkles },
    { path: '/app/revenue', stepNumber: 7, label: 'Report · Results & revenue', shortLabel: '7 · Report', icon: Coins },
  ];

  // Secondary views kept in collapsible "More"
  const moreViews = [
    { path: '/app/overview', label: 'Overview & Concept', shortLabel: 'Overview', icon: Compass },
    { path: '/app/assumptions', label: 'Assumptions & Roadmap', shortLabel: 'Roadmap', icon: Settings2 },
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

  return (
    <>
      {/* Desktop Left Rail Sidebar */}
      <aside
        aria-label="Main Navigation"
        className="hidden md:flex flex-col w-64 bg-white border-r border-charcoal-200 flex-shrink-0 h-[calc(100vh-4rem)] sticky top-16 select-none"
      >
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
          
          {/* Primary View: Dashboard */}
          <div>
            <NavLink
              to="/app/dashboard"
              className={({ isActive }) =>
                `w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold transition-all min-h-[44px] focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-navy-600 ${
                  isActive
                    ? 'bg-navy-900 text-white shadow-sm shadow-navy-900/20'
                    : 'text-charcoal-700 hover:text-navy-900 hover:bg-navy-50/70'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className="flex items-center gap-3">
                    <LayoutDashboard className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-navy-700'}`} aria-hidden="true" />
                    <span>Dashboard</span>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded text-xs font-bold ${
                      isActive ? 'bg-white/20 text-white' : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    Live
                  </span>
                </>
              )}
            </NavLink>
          </div>

          {/* Continuous Circular Loop: 7-Step Vertical Stepper (Always Visible) */}
          <div className="pt-1">
            <div className="px-3 mb-2 flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-charcoal-600">
                Circular Loop (7 Steps)
              </span>
              <span className="text-[11px] font-mono font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                AI Active
              </span>
            </div>

            {/* Stepper with continuous connecting line */}
            <nav aria-label="7-Step AI Circular Loop" className="relative pl-1 pr-1 space-y-1">
              {/* Connecting line */}
              <div
                className="absolute left-[23px] top-3.5 bottom-3.5 w-0.5 bg-charcoal-200"
                aria-hidden="true"
              />

              {aiLoopSteps.map((step) => {
                const Icon = step.icon;
                const isActive = location.pathname === step.path;

                return (
                  <NavLink
                    key={step.path}
                    to={step.path}
                    className={`relative z-10 flex items-center gap-2.5 px-2.5 py-2 rounded-xl min-h-[44px] text-sm transition-all focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-navy-600 ${
                      isActive
                        ? 'bg-navy-900 text-white font-semibold shadow-xs'
                        : 'text-charcoal-700 hover:text-navy-900 hover:bg-navy-50/70 font-medium'
                    }`}
                  >
                    {/* Stepper circle indicator */}
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold transition-all ${
                        isActive
                          ? 'bg-emerald-500 text-navy-950 ring-2 ring-emerald-300 font-extrabold'
                          : 'bg-white text-charcoal-700 border border-charcoal-300 group-hover:border-navy-400'
                      }`}
                      aria-hidden="true"
                    >
                      {step.stepNumber}
                    </div>

                    <Icon
                      className={`w-4 h-4 flex-shrink-0 ${
                        isActive ? 'text-emerald-400' : 'text-charcoal-500'
                      }`}
                      aria-hidden="true"
                    />

                    <span className="truncate leading-tight text-sm">
                      {step.label}
                    </span>

                    {isActive && (
                      <span className="ml-auto w-2 h-2 rounded-full bg-emerald-400 flex-shrink-0" aria-hidden="true" />
                    )}
                  </NavLink>
                );
              })}
            </nav>
          </div>

          {/* Collapsible "More" Group (Overview, Assumptions & Roadmap) */}
          <div className="pt-2 border-t border-charcoal-200">
            <button
              type="button"
              onClick={() => setIsMoreOpen(!isMoreOpen)}
              aria-expanded={isMoreOpen}
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm font-semibold text-charcoal-600 hover:text-navy-900 hover:bg-charcoal-100 transition-colors min-h-[44px]"
            >
              <span className="text-xs font-bold uppercase tracking-wider text-charcoal-500">
                More Pages
              </span>
              {isMoreOpen ? (
                <ChevronUp className="w-4 h-4 text-charcoal-500" aria-hidden="true" />
              ) : (
                <ChevronDown className="w-4 h-4 text-charcoal-500" aria-hidden="true" />
              )}
            </button>

            {isMoreOpen && (
              <nav aria-label="Secondary navigation" className="space-y-1 mt-1 pl-1 pr-1">
                {moreViews.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      className={({ isActive }) =>
                        `w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium transition-all min-h-[44px] focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-navy-600 ${
                          isActive
                            ? 'bg-navy-900 text-white font-semibold'
                            : 'text-charcoal-700 hover:text-navy-900 hover:bg-navy-50/70'
                        }`
                      }
                    >
                      {({ isActive }) => (
                        <div className="flex items-center gap-2.5">
                          <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-charcoal-500'}`} aria-hidden="true" />
                          <span>{item.label}</span>
                        </div>
                      )}
                    </NavLink>
                  );
                })}
              </nav>
            )}
          </div>

        </div>

        {/* Municipal Pilot Status Box */}
        <div className="p-3 border-t border-charcoal-200 bg-[#F8FAFC]">
          <div className="p-3 rounded-2xl bg-white border border-charcoal-200 shadow-xs space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-navy-900 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" aria-hidden="true" />
                PCCOE Pune Pilot
              </span>
              <span className="text-xs px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-bold font-mono">
                ONLINE
              </span>
            </div>
            <p className="text-xs text-charcoal-600 leading-normal">
              100 smart bins across 5 pilot zones in PCMC.
            </p>
          </div>
        </div>
      </aside>

      {/* Mobile Horizontal Scrollable Step Bar (All 7 Steps + Dashboard + Overview) */}
      <nav
        aria-label="Mobile Step Navigation"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-charcoal-200 px-2 py-2 safe-bottom-padding shadow-lg"
      >
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar scroll-smooth px-1">
          {/* Dashboard pill */}
          {(() => {
            const isDashActive = location.pathname === '/app/dashboard' || location.pathname === '/app';
            return (
              <NavLink
                to="/app/dashboard"
                ref={isDashActive ? activePillRef : null}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold whitespace-nowrap min-h-[44px] transition-all flex-shrink-0 ${
                  isDashActive
                    ? 'bg-navy-900 text-white shadow-xs'
                    : 'text-charcoal-700 bg-charcoal-100 hover:bg-charcoal-200'
                }`}
              >
                <LayoutDashboard className={`w-4 h-4 ${isDashActive ? 'text-emerald-400' : 'text-charcoal-600'}`} aria-hidden="true" />
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
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium whitespace-nowrap min-h-[44px] transition-all flex-shrink-0 ${
                  isActive
                    ? 'bg-navy-900 text-white font-bold shadow-xs'
                    : 'text-charcoal-700 bg-charcoal-100 hover:bg-charcoal-200'
                }`}
              >
                <span
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                    isActive ? 'bg-emerald-500 text-navy-950 font-extrabold' : 'bg-white text-charcoal-700 border border-charcoal-300'
                  }`}
                  aria-hidden="true"
                >
                  {step.stepNumber}
                </span>
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-400' : 'text-charcoal-600'}`} aria-hidden="true" />
                <span>{step.shortLabel}</span>
              </NavLink>
            );
          })}

          {/* More options pills so nothing is hidden */}
          {moreViews.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                ref={isActive ? activePillRef : null}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium whitespace-nowrap min-h-[44px] transition-all flex-shrink-0 ${
                  isActive
                    ? 'bg-navy-900 text-white font-bold shadow-xs'
                    : 'text-charcoal-600 bg-charcoal-50 hover:bg-charcoal-100 border border-charcoal-200'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-400' : 'text-charcoal-500'}`} aria-hidden="true" />
                <span>{item.shortLabel}</span>
              </NavLink>
            );
          })}
        </div>
      </nav>
    </>
  );
};
