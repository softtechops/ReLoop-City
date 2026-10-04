import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useStore } from '../store/useStore';
import {
  Compass,
  LayoutDashboard,
  Radio,
  TrendingUp,
  Route,
  ScanSearch,
  GitFork,
  Coins,
  Settings2,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  MoreHorizontal,
  X,
  Sparkles,
  Layers,
  Eye,
  EyeOff
} from 'lucide-react';

interface NavItem {
  path: string;
  label: string;
  stepNumber?: string;
  icon: React.ComponentType<{ className?: string; 'aria-hidden'?: boolean | 'true' | 'false' }>;
  badge?: string;
}

export const Sidebar: React.FC = () => {
  const location = useLocation();
  const { isLoopStepsExpanded, toggleLoopSteps } = useStore();
  const [isMoreSheetOpen, setIsMoreSheetOpen] = useState(false);

  const mainNavItems: NavItem[] = [
    { path: '/overview', label: 'Overview & Concept', icon: Compass },
    { path: '/dashboard', label: 'Waste-to-Value Dashboard', icon: LayoutDashboard, badge: 'Main' },
  ];

  // The 7 AI Loop steps in plain language (Sense, Predict, Optimize, Classify, Allocate, Forecast, Report)
  const aiLoopSteps: NavItem[] = [
    { path: '/map', label: '1 · Live Bin Map (Sense)', stepNumber: '1', icon: Radio },
    { path: '/predict', label: '2 · Waste Forecast (Predict)', stepNumber: '2', icon: TrendingUp },
    { path: '/optimize', label: '3 · Smart Routes (Optimize)', stepNumber: '3', icon: Route },
    { path: '/classify', label: '4 · AI Sorting Vision (Classify)', stepNumber: '4', icon: ScanSearch },
    { path: '/allocate', label: '5 · Facility Balancing (Allocate)', stepNumber: '5', icon: GitFork },
    { path: '/allocate', label: '6 · Energy & Biogas (Forecast)', stepNumber: '6', icon: Sparkles },
    { path: '/revenue', label: '7 · Results & Ledger (Report)', stepNumber: '7', icon: Coins },
  ];

  const systemNavItems: NavItem[] = [
    { path: '/assumptions', label: 'Assumptions & Roadmap', icon: Settings2 },
  ];

  // 4 Primary Mobile Tabs + More Sheet
  const mobilePrimaryTabs = [
    { path: '/overview', label: 'Overview', icon: Compass },
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/map', label: 'Map', icon: Radio },
    { path: '/optimize', label: 'Routes', icon: Route },
  ];

  const moreSheetItems = [
    { path: '/predict', label: '2 · Waste Forecast', icon: TrendingUp },
    { path: '/classify', label: '4 · AI Sorting Vision', icon: ScanSearch },
    { path: '/allocate', label: '5 · Facility Balancing', icon: GitFork },
    { path: '/allocate', label: '6 · Energy & Biogas', icon: Sparkles },
    { path: '/revenue', label: '7 · Results & Ledger', icon: Coins },
    { path: '/assumptions', label: 'Assumptions & Roadmap', icon: Settings2 },
  ];

  return (
    <>
      {/* Desktop Left Rail Sidebar */}
      <aside
        aria-label="Main Navigation"
        className="hidden md:flex flex-col w-64 bg-white border-r border-charcoal-200 flex-shrink-0 h-[calc(100vh-4rem)] sticky top-16 select-none"
      >
        <div className="flex-1 overflow-y-auto px-3.5 py-4 space-y-6">
          
          {/* Main Views */}
          <div>
            <div className="px-3 mb-2 text-xs font-bold uppercase tracking-wider text-charcoal-500">
              Overview
            </div>
            <nav className="space-y-1">
              {mainNavItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) =>
                      `w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all min-h-[42px] focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-navy-600 ${
                        isActive
                          ? 'bg-navy-900 text-white shadow-sm shadow-navy-900/20'
                          : 'text-charcoal-700 hover:text-navy-900 hover:bg-navy-50/70'
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <div className="flex items-center gap-2.5">
                          <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-navy-700'}`} aria-hidden="true" />
                          <span>{item.label}</span>
                        </div>
                        {item.badge && (
                          <span
                            className={`px-1.5 py-0.5 rounded text-xs font-bold ${
                              isActive ? 'bg-white/20 text-white' : 'bg-navy-100 text-navy-800'
                            }`}
                          >
                            {item.badge}
                          </span>
                        )}
                      </>
                    )}
                  </NavLink>
                );
              })}
            </nav>
          </div>

          {/* ========================================================================= */}
          {/* THE 7-STEP AI LOOP WITH DEDICATED TOGGLE BUTTON (User Request) */}
          {/* "on the left side create a button so when button press all the 7 steps shows else it does not show" */}
          {/* ========================================================================= */}
          <div>
            <div className="px-1 mb-2">
              <button
                type="button"
                id="btn-toggle-7-ai-steps"
                onClick={toggleLoopSteps}
                aria-expanded={isLoopStepsExpanded}
                aria-controls="sidebar-7-steps-list"
                className={`w-full flex items-center justify-between p-3 rounded-2xl border text-xs font-bold transition-all min-h-[48px] group focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-emerald-500 cursor-pointer ${
                  isLoopStepsExpanded
                    ? 'bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-950 border-emerald-300 shadow-xs'
                    : 'bg-white text-charcoal-800 border-charcoal-200 hover:border-emerald-400 hover:bg-emerald-50/40 shadow-xs'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-7 h-7 rounded-xl flex items-center justify-center transition-all ${
                      isLoopStepsExpanded
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-emerald-100 text-emerald-800 group-hover:bg-emerald-600 group-hover:text-white'
                    }`}
                    aria-hidden="true"
                  >
                    <Layers className="w-4 h-4" />
                  </div>
                  <div className="text-left leading-tight">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-xs tracking-tight">The 7 AI Steps</span>
                    </div>
                    <span className="text-[10px] font-medium text-charcoal-500 block mt-0.5">
                      {isLoopStepsExpanded ? 'Click to hide steps' : 'Click to show all 7'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold tracking-wider ${
                      isLoopStepsExpanded
                        ? 'bg-emerald-200/80 text-emerald-900 ring-1 ring-emerald-300'
                        : 'bg-charcoal-100 text-charcoal-600 group-hover:bg-emerald-100 group-hover:text-emerald-800'
                    }`}
                  >
                    {isLoopStepsExpanded ? 'EXPANDED' : '7 STEPS'}
                  </span>
                  {isLoopStepsExpanded ? (
                    <ChevronUp className="w-4 h-4 text-emerald-700" aria-hidden="true" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-charcoal-400 group-hover:text-emerald-700 transition-colors" aria-hidden="true" />
                  )}
                </div>
              </button>
            </div>

            {/* Collapsible 7 Steps List */}
            {isLoopStepsExpanded ? (
              <nav
                id="sidebar-7-steps-list"
                aria-label="7-Step AI Loop Steps"
                className="space-y-1 pl-1 pt-1 animate-in fade-in slide-in-from-top-2 duration-200"
              >
                {aiLoopSteps.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={`${item.path}-${item.stepNumber}`}
                      to={item.path}
                      className={({ isActive }) =>
                        `w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all min-h-[40px] focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-emerald-600 ${
                          isActive
                            ? 'bg-emerald-800 text-white shadow-sm shadow-emerald-900/20'
                            : 'text-charcoal-700 hover:text-emerald-900 hover:bg-emerald-50/70'
                        }`
                      }
                    >
                      {({ isActive }) => (
                        <>
                          <div className="flex items-center gap-2.5 truncate">
                            <Icon
                              className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-amberGold-300' : 'text-charcoal-500'}`}
                              aria-hidden="true"
                            />
                            <span className="truncate">{item.label}</span>
                          </div>
                          {isActive ? (
                            <ChevronRight className="w-3.5 h-3.5 text-white/80" aria-hidden="true" />
                          ) : (
                            <span className="text-[10px] font-mono px-1 py-0.5 rounded bg-charcoal-100 text-charcoal-600">S{item.stepNumber}</span>
                          )}
                        </>
                      )}
                    </NavLink>
                  );
                })}
              </nav>
            ) : (
              <div className="px-2 pt-1">
                <span className="text-[11px] text-charcoal-400 font-medium italic block text-center py-1 bg-charcoal-50/60 rounded-lg border border-dashed border-charcoal-200">
                  (7 AI loop steps hidden · Click button above)
                </span>
              </div>
            )}
          </div>

          {/* Systems & Scale */}
          <div>
            <div className="px-3 mb-2 text-xs font-bold uppercase tracking-wider text-charcoal-500">
              System & Scaling
            </div>
            <nav className="space-y-1">
              {systemNavItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) =>
                      `w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all min-h-[42px] focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-navy-600 ${
                        isActive
                          ? 'bg-navy-900 text-white shadow-sm shadow-navy-900/20'
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
          </div>

        </div>

        {/* Municipal Pilot Status Box */}
        <div className="p-3.5 border-t border-charcoal-200 bg-[#F8FAFC]">
          <div className="p-3 rounded-xl bg-white border border-charcoal-200 shadow-xs space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-navy-900 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-sage-600" aria-hidden="true" />
                PCCOE Pune Pilot
              </span>
              <span className="text-xs px-2 py-0.5 rounded bg-sage-100 text-sage-800 font-bold font-mono">
                ONLINE
              </span>
            </div>
            <p className="text-xs text-charcoal-500 leading-normal">
              100 Smart Bins connected across 5 pilot zones in PCMC.
            </p>
          </div>
        </div>
      </aside>

      {/* Mobile Bottom Tab Bar (4 primary tabs + More sheet) */}
      <nav
        aria-label="Mobile Navigation"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-charcoal-200 px-2 pt-1 safe-bottom-padding shadow-lg"
      >
        <div className="flex items-center justify-around">
          {mobilePrimaryTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = location.pathname === tab.path;
            return (
              <NavLink
                key={tab.path}
                to={tab.path}
                className={`flex flex-col items-center justify-center min-w-[56px] min-h-[48px] py-1 px-1 rounded-xl text-xs font-semibold transition-all ${
                  isActive ? 'text-navy-900 font-bold' : 'text-charcoal-500 hover:text-navy-800'
                }`}
              >
                <Icon className={`w-5 h-5 mb-0.5 ${isActive ? 'text-navy-900' : 'text-charcoal-400'}`} aria-hidden="true" />
                <span>{tab.label}</span>
              </NavLink>
            );
          })}

          {/* "More" Sheet Trigger */}
          <button
            type="button"
            onClick={() => setIsMoreSheetOpen(true)}
            aria-expanded={isMoreSheetOpen}
            aria-label="Open more navigation options"
            className="flex flex-col items-center justify-center min-w-[56px] min-h-[48px] py-1 px-1 rounded-xl text-xs font-semibold text-charcoal-500 hover:text-navy-800"
          >
            <MoreHorizontal className="w-5 h-5 mb-0.5 text-charcoal-400" aria-hidden="true" />
            <span>More</span>
          </button>
        </div>
      </nav>

      {/* Mobile "More" Navigation Sheet */}
      {isMoreSheetOpen && (
        <div
          className="md:hidden fixed inset-0 z-50 bg-navy-950/60 backdrop-blur-xs flex flex-col justify-end animate-in fade-in"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsMoreSheetOpen(false);
          }}
        >
          <div className="bg-white rounded-t-3xl border-t border-charcoal-200 p-6 space-y-4 shadow-2xl safe-bottom-padding animate-in slide-in-from-bottom duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-charcoal-200">
              <div>
                <h3 className="text-base font-bold text-navy-900 font-['Outfit']">
                  All ReLoop City Pages
                </h3>
                <span className="text-xs text-charcoal-500">The complete 7-step AI municipal loop</span>
              </div>
              <button
                type="button"
                onClick={() => setIsMoreSheetOpen(false)}
                className="p-2 text-charcoal-400 hover:text-navy-900 rounded-lg hover:bg-navy-50"
                aria-label="Close more navigation menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-1.5 py-1">
              {moreSheetItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMoreSheetOpen(false)}
                    className={`flex items-center justify-between p-3 rounded-xl text-sm font-semibold transition-all min-h-[44px] ${
                      isActive
                        ? 'bg-navy-900 text-white'
                        : 'text-charcoal-700 hover:bg-navy-50 hover:text-navy-900'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-5 h-5 ${isActive ? 'text-amberGold-400' : 'text-navy-700'}`} aria-hidden="true" />
                      <span>{item.label}</span>
                    </div>
                    <ChevronRight className="w-4 h-4 opacity-70" aria-hidden="true" />
                  </NavLink>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
