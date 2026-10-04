import React from 'react';
import { useStore } from '../store/useStore';
import { ActivePage } from '../types';
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
  CheckCircle2
} from 'lucide-react';

interface NavItem {
  id: ActivePage;
  label: string;
  stepNumber?: number;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

export const Sidebar: React.FC = () => {
  const { activePage, setActivePage } = useStore();

  const mainNavItems: NavItem[] = [
    { id: 'overview', label: 'Landing & Concept', icon: Compass },
    { id: 'dashboard', label: 'Waste-to-Value Dashboard', icon: LayoutDashboard, badge: 'Main' },
  ];

  const aiLoopSteps: NavItem[] = [
    { id: 'map', label: '1. Sense (Smart IoT Bins)', stepNumber: 1, icon: Radio },
    { id: 'predict', label: '2. Predict (Generation)', stepNumber: 2, icon: TrendingUp },
    { id: 'optimize', label: '3. Optimize (CVRP Routes)', stepNumber: 3, icon: Route },
    { id: 'classify', label: '4. Classify (MRF Vision)', stepNumber: 4, icon: ScanSearch },
    { id: 'allocate', label: '5-6. Allocate & Forecast', stepNumber: 5, icon: GitFork },
    { id: 'revenue', label: '7. Report & Revenue', stepNumber: 7, icon: Coins },
  ];

  const systemNavItems: NavItem[] = [
    { id: 'assumptions', label: 'Assumptions & Scaling', icon: Settings2 },
  ];

  return (
    <>
      {/* Desktop Sidebar (Left) */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-navy-100 flex-shrink-0 h-[calc(100vh-4rem)] sticky top-16 select-none">
        
        {/* Navigation Section */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          
          {/* Main Views */}
          <div>
            <div className="px-3 mb-2 text-[11px] font-bold uppercase tracking-wider text-charcoal-400">
              Overview
            </div>
            <nav className="space-y-1">
              {mainNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = activePage === item.id;
                return (
                  <button
                    key={item.id}
                    id={`nav-${item.id}`}
                    onClick={() => setActivePage(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-navy-700 text-white shadow-sm shadow-navy-750/30'
                        : 'text-charcoal-600 hover:text-navy-800 hover:bg-navy-50/70'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-navy-500'}`} />
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                        isActive ? 'bg-white/20 text-white' : 'bg-navy-100 text-navy-800'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* 7-Step AI Loop */}
          <div>
            <div className="flex items-center justify-between px-3 mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-navy-700 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-sage-500"></span>
                The 7-Step AI Loop
              </span>
              <span className="text-[10px] text-charcoal-400 font-mono">Loop 1.0</span>
            </div>
            <nav className="space-y-1">
              {aiLoopSteps.map((item) => {
                const Icon = item.icon;
                const isActive = activePage === item.id;
                return (
                  <button
                    key={item.id}
                    id={`nav-${item.id}`}
                    onClick={() => setActivePage(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-navy-700 text-white shadow-sm shadow-navy-700/30'
                        : 'text-charcoal-600 hover:text-navy-800 hover:bg-navy-50/70'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-amberGold-400' : 'text-charcoal-500'}`} />
                      <span className="truncate">{item.label}</span>
                    </div>
                    {isActive ? (
                      <ChevronRight className="w-3.5 h-3.5 text-white/70" />
                    ) : (
                      <span className="text-[10px] font-mono text-charcoal-400 opacity-60">S{item.stepNumber}</span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Systems & Scale */}
          <div>
            <div className="px-3 mb-2 text-[11px] font-bold uppercase tracking-wider text-charcoal-400">
              System & Scaling
            </div>
            <nav className="space-y-1">
              {systemNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = activePage === item.id;
                return (
                  <button
                    key={item.id}
                    id={`nav-${item.id}`}
                    onClick={() => setActivePage(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-navy-700 text-white shadow-sm shadow-navy-700/30'
                        : 'text-charcoal-600 hover:text-navy-800 hover:bg-navy-50/70'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-charcoal-500'}`} />
                      <span>{item.label}</span>
                    </div>
                  </button>
                );
              })}
            </nav>
          </div>

        </div>

        {/* Municipal Pilot Status Box */}
        <div className="p-3 border-t border-navy-100 bg-[#F7F6F2]/70">
          <div className="p-2.5 rounded-xl bg-white border border-navy-100 shadow-xs space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-navy-800 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-sage-600" />
                PCCOE Pilot Pune
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-sage-100 text-sage-800 font-semibold font-mono">
                ONLINE
              </span>
            </div>
            <p className="text-[10px] text-charcoal-500 leading-tight">
              100 Smart Bins connected across 5 pilot zones in PCMC / Pune.
            </p>
          </div>
        </div>

      </aside>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-navy-100 px-2 py-1.5 flex items-center justify-around shadow-lg">
        {[
          { id: 'overview' as ActivePage, label: 'Overview', icon: Compass },
          { id: 'dashboard' as ActivePage, label: 'Dashboard', icon: LayoutDashboard },
          { id: 'map' as ActivePage, label: 'Map', icon: Radio },
          { id: 'optimize' as ActivePage, label: 'Routes', icon: Route },
          { id: 'classify' as ActivePage, label: 'Sort', icon: ScanSearch },
          { id: 'revenue' as ActivePage, label: 'Revenue', icon: Coins },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activePage === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActivePage(tab.id)}
              className={`flex flex-col items-center py-1 px-2 rounded-lg text-[10px] font-semibold transition-all ${
                isActive ? 'text-navy-700 scale-105' : 'text-charcoal-400 hover:text-charcoal-700'
              }`}
            >
              <Icon className={`w-4 h-4 mb-0.5 ${isActive ? 'text-navy-700' : 'text-charcoal-400'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
};
