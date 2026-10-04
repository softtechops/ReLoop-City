import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
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
  ShieldCheck,
  MoreHorizontal,
  X
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
  const [isMoreSheetOpen, setIsMoreSheetOpen] = useState(false);

  const mainNavItems: NavItem[] = [
    { path: '/overview', label: 'Overview & Concept', icon: Compass },
    { path: '/dashboard', label: 'Waste-to-Value Dashboard', icon: LayoutDashboard, badge: 'Main' },
  ];

  // Plain-language step naming as specified in prompt section 1
  const aiLoopSteps: NavItem[] = [
    { path: '/map', label: '1 · Live Bin Map', stepNumber: '1', icon: Radio },
    { path: '/predict', label: '2 · Waste Forecast', stepNumber: '2', icon: TrendingUp },
    { path: '/optimize', label: '3 · Smart Routes', stepNumber: '3', icon: Route },
    { path: '/classify', label: '4 · Waste Sorting (AI Vision)', stepNumber: '4', icon: ScanSearch },
    { path: '/allocate', label: '5–6 · Where Waste Goes & Energy', stepNumber: '5-6', icon: GitFork },
    { path: '/revenue', label: '7 · Results & Revenue', stepNumber: '7', icon: Coins },
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
    { path: '/classify', label: '4 · Waste Sorting (AI Vision)', icon: ScanSearch },
    { path: '/allocate', label: '5–6 · Where Waste Goes & Energy', icon: GitFork },
    { path: '/revenue', label: '7 · Results & Revenue', icon: Coins },
    { path: '/assumptions', label: 'Assumptions & Roadmap', icon: Settings2 },
  ];

  return (
    <>
      {/* Desktop Left Rail Sidebar */}
      <aside
        aria-label="Main Navigation"
        className="hidden md:flex flex-col w-64 bg-white border-r border-navy-100 flex-shrink-0 h-[calc(100vh-4rem)] sticky top-16 select-none"
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
                      `w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all min-h-[44px] focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-navy-600 ${
                        isActive
                          ? 'bg-navy-700 text-white shadow-sm shadow-navy-750/30'
                          : 'text-charcoal-600 hover:text-navy-900 hover:bg-navy-50/70'
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <div className="flex items-center gap-2.5">
                          <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-navy-600'}`} aria-hidden="true" />
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

          {/* 7-Step AI Loop */}
          <div>
            <div className="flex items-center justify-between px-3 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-navy-800 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-sage-500" aria-hidden="true" />
                The 7-Step AI Loop
              </span>
              <span className="text-xs text-charcoal-500 font-mono">Loop 1.0</span>
            </div>
            <nav className="space-y-1">
              {aiLoopSteps.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) =>
                      `w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all min-h-[44px] focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-navy-600 ${
                        isActive
                          ? 'bg-navy-700 text-white shadow-sm shadow-navy-700/30'
                          : 'text-charcoal-600 hover:text-navy-900 hover:bg-navy-50/70'
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <div className="flex items-center gap-2.5 truncate">
                          <Icon
                            className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-amberGold-400' : 'text-charcoal-500'}`}
                            aria-hidden="true"
                          />
                          <span className="truncate">{item.label}</span>
                        </div>
                        {isActive ? (
                          <ChevronRight className="w-3.5 h-3.5 text-white/80" aria-hidden="true" />
                        ) : (
                          <span className="text-xs font-mono text-charcoal-500">S{item.stepNumber}</span>
                        )}
                      </>
                    )}
                  </NavLink>
                );
              })}
            </nav>
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
                      `w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all min-h-[44px] focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-navy-600 ${
                        isActive
                          ? 'bg-navy-700 text-white shadow-sm shadow-navy-700/30'
                          : 'text-charcoal-600 hover:text-navy-900 hover:bg-navy-50/70'
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <div className="flex items-center gap-2.5">
                        <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-charcoal-500'}`} aria-hidden="true" />
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
        <div className="p-3.5 border-t border-navy-100 bg-[#F7F6F2]/70">
          <div className="p-3 rounded-xl bg-white border border-navy-100 shadow-xs space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-navy-800 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-sage-600" aria-hidden="true" />
                PCCOE Pune Pilot
              </span>
              <span className="text-xs px-2 py-0.5 rounded bg-sage-100 text-sage-800 font-semibold font-mono">
                ONLINE
              </span>
            </div>
            <p className="text-xs text-charcoal-500 leading-normal">
              100 Smart Bins connected across 5 pilot zones in PCMC.
            </p>
          </div>
        </div>
      </aside>

      {/* Mobile Bottom Tab Bar (Section 1: 4 primary tabs + More sheet) */}
      <nav
        aria-label="Mobile Navigation"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-navy-100 px-2 pt-1 safe-bottom-padding shadow-lg"
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
                <Icon className={`w-5 h-5 mb-0.5 ${isActive ? 'text-navy-800' : 'text-charcoal-400'}`} aria-hidden="true" />
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
          <div className="bg-white rounded-t-3xl border-t border-navy-200 p-6 space-y-4 shadow-2xl safe-bottom-padding animate-in slide-in-from-bottom duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-navy-100">
              <div>
                <h3 className="text-base font-bold text-navy-800 font-['Outfit']">
                  All ReLoop City Pages
                </h3>
                <span className="text-xs text-charcoal-500">The complete 7-step AI municipal loop</span>
              </div>
              <button
                type="button"
                onClick={() => setIsMoreSheetOpen(false)}
                className="p-2 text-charcoal-400 hover:text-navy-800 rounded-lg hover:bg-navy-50"
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
                        ? 'bg-navy-700 text-white'
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
