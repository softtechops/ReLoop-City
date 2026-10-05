import React, { useEffect, useRef, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useUiPrefs } from '../store/useUiPrefs';
import { useTheme } from '../lib/useTheme';
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
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Sun,
  Moon,
  HelpCircle,
  X,
  Menu,
} from 'lucide-react';

interface StepperItem {
  path: string;
  stepNumber?: number;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string; 'aria-hidden'?: boolean | 'true' | 'false' }>;
}

export const Sidebar: React.FC = () => {
  const location = useLocation();
  const activePillRef = useRef<HTMLAnchorElement | null>(null);
  const flyoutTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const {
    sidebarMode,
    isFlyoutOpen,
    mobileDrawerOpen,
    presentationMode,
    setSidebarMode,
    toggleSidebar,
    setFlyoutOpen,
    setMobileDrawerOpen,
    togglePresentation,
    setHelpOpen,
  } = useUiPrefs();

  const { theme, toggle } = useTheme();

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
  const planViews: StepperItem[] = [
    { path: '/app/scenarios', label: 'Scenarios', description: 'Custom policy builder and operational thresholds', icon: FlaskConical },
    { path: '/app/report', label: 'Report', description: 'Print-ready municipal report and council export', icon: Printer },
  ];

  // More section items
  const moreViews: StepperItem[] = [
    { path: '/app/assumptions', label: 'Assumptions', description: 'Methodology and pilot model parameters', icon: Settings2 },
    { path: '/app/overview', label: 'Overview', description: 'High-level circular economy concept', icon: Compass },
  ];

  // Handle flyout mouse enter / leave with small debounce
  const handleRailMouseEnter = () => {
    if (sidebarMode === 'collapsed') {
      if (flyoutTimerRef.current) clearTimeout(flyoutTimerRef.current);
      flyoutTimerRef.current = setTimeout(() => {
        setFlyoutOpen(true);
      }, 120);
    }
  };

  const handleRailMouseLeave = () => {
    if (flyoutTimerRef.current) clearTimeout(flyoutTimerRef.current);
    if (isFlyoutOpen) {
      flyoutTimerRef.current = setTimeout(() => {
        setFlyoutOpen(false);
      }, 200);
    }
  };

  // Close flyout and mobile drawer on route navigation
  useEffect(() => {
    setFlyoutOpen(false);
    setMobileDrawerOpen(false);
  }, [location.pathname, setFlyoutOpen, setMobileDrawerOpen]);

  // Auto-scroll active mobile pill into view
  useEffect(() => {
    if (activePillRef.current) {
      activePillRef.current.scrollIntoView({
        behavior: 'smooth',
        inline: 'center',
        block: 'nearest',
      });
    }
  }, [location.pathname]);

  // Don't render rail at all if in presentation mode (Phase 3)
  if (presentationMode) {
    return null;
  }

  // Render full menu content (reused for Expanded, Flyout, and Mobile Drawer)
  const renderFullNavigationContent = (onItemClick?: () => void) => (
    <div className="flex flex-col h-full select-none">
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
        {/* Group 1: Dashboard */}
        <div>
          <div className="px-3 mb-1.5">
            <span className="text-xs font-semibold text-fg-subtle">
              Overview
            </span>
          </div>
          <nav aria-label="Overview navigation">
            <NavLink
              to="/app/dashboard"
              onClick={onItemClick}
              className={({ isActive }) =>
                `relative flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm transition-colors min-h-[40px] focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-emerald-600 ${
                  isActive
                    ? 'bg-emerald-50 text-emerald-900 dark:bg-emerald-500/15 dark:text-emerald-300 font-semibold before:absolute before:left-0 before:top-2 before:bottom-2 before:w-[3px] before:bg-emerald-600 before:rounded-r'
                    : 'text-fg-muted hover:text-fg hover:bg-surface-muted font-medium'
                }`
              }
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

        {/* Thin divider */}
        <div className="h-px bg-line mx-2" aria-hidden="true" />

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
                  onClick={onItemClick}
                  title={step.description}
                  className={`relative flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm transition-colors min-h-[40px] focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-emerald-600 ${
                    isActive
                      ? 'bg-emerald-50 text-emerald-900 dark:bg-emerald-500/15 dark:text-emerald-300 font-semibold before:absolute before:left-0 before:top-2 before:bottom-2 before:w-[3px] before:bg-emerald-600 before:rounded-r'
                      : 'text-fg-muted hover:text-fg hover:bg-surface-muted font-medium'
                  }`}
                >
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

        {/* Thin divider */}
        <div className="h-px bg-line mx-2" aria-hidden="true" />

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
                  onClick={onItemClick}
                  title={item.description}
                  className={`relative flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm transition-colors min-h-[40px] focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-emerald-600 ${
                    isActive
                      ? 'bg-emerald-50 text-emerald-900 dark:bg-emerald-500/15 dark:text-emerald-300 font-semibold before:absolute before:left-0 before:top-2 before:bottom-2 before:w-[3px] before:bg-emerald-600 before:rounded-r'
                      : 'text-fg-muted hover:text-fg hover:bg-surface-muted font-medium'
                  }`}
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

        {/* Thin divider */}
        <div className="h-px bg-line mx-2" aria-hidden="true" />

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
                  onClick={onItemClick}
                  title={item.description}
                  className={`relative flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm transition-colors min-h-[40px] focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-emerald-600 ${
                    isActive
                      ? 'bg-emerald-50 text-emerald-900 dark:bg-emerald-500/15 dark:text-emerald-300 font-semibold before:absolute before:left-0 before:top-2 before:bottom-2 before:w-[3px] before:bg-emerald-600 before:rounded-r'
                      : 'text-fg-muted hover:text-fg hover:bg-surface-muted font-medium'
                  }`}
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

      {/* Bottom Control Row */}
      <div className="p-3 border-t border-line bg-surface/80 flex items-center justify-between gap-1">
        {/* Theme button */}
        <button
          type="button"
          onClick={toggle}
          aria-label={`Switch theme (currently ${theme})`}
          title={`Theme: ${theme === 'dark' ? 'Night' : 'Day'} mode`}
          className="w-9 h-9 rounded-xl flex items-center justify-center text-fg-muted hover:text-fg hover:bg-surface-muted transition-colors cursor-pointer focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-emerald-600"
        >
          {theme === 'dark' ? (
            <Moon className="w-4 h-4 text-emerald-400" />
          ) : (
            <Sun className="w-4 h-4 text-amber-500" />
          )}
        </button>

        {/* Presentation / Focus mode */}
        <button
          type="button"
          onClick={togglePresentation}
          aria-label="Focus mode (F)"
          title="Presentation / Focus mode (F)"
          className="w-9 h-9 rounded-xl flex items-center justify-center text-fg-muted hover:text-fg hover:bg-surface-muted transition-colors cursor-pointer focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-emerald-600"
        >
          <Maximize2 className="w-4 h-4" />
        </button>

        {/* Collapse / Expand toggle */}
        <button
          type="button"
          onClick={toggleSidebar}
          aria-label={sidebarMode === 'expanded' ? 'Collapse sidebar ([)' : 'Expand sidebar ([)'}
          title={sidebarMode === 'expanded' ? 'Collapse sidebar ([)' : 'Expand sidebar ([)'}
          className="w-9 h-9 rounded-xl flex items-center justify-center text-fg-muted hover:text-fg hover:bg-surface-muted transition-colors cursor-pointer focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-emerald-600"
        >
          {sidebarMode === 'expanded' ? (
            <ChevronLeft className="w-4 h-4" />
          ) : (
            <ChevronRight className="w-4 h-4" />
          )}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* ========================================================================= */}
      {/* Desktop Left Sidebar: Either 240px Expanded OR 56px Collapsed Icon Rail */}
      {/* ========================================================================= */}
      <aside
        id="app-sidebar"
        aria-label="Main Navigation Rail"
        aria-expanded={sidebarMode === 'expanded'}
        onMouseEnter={handleRailMouseEnter}
        onMouseLeave={handleRailMouseLeave}
        className={`hidden md:flex flex-col bg-surface border-r border-line flex-shrink-0 h-[calc(100vh-4rem)] sticky top-16 select-none transition-[width] duration-200 ease-out z-20 ${
          sidebarMode === 'expanded' ? 'w-60' : 'w-14'
        }`}
      >
        {sidebarMode === 'expanded' ? (
          /* Expanded state: icon + label rows, 240px wide */
          renderFullNavigationContent()
        ) : (
          /* Collapsed state: 56px icon rail */
          <div className="flex flex-col h-full justify-between items-center py-3">
            <div className="w-full flex-1 overflow-y-auto overflow-x-hidden flex flex-col items-center gap-1.5 px-2">
              
              {/* Item: Dashboard */}
              <div className="relative group w-full flex justify-center">
                <NavLink
                  to="/app/dashboard"
                  aria-label="Dashboard"
                  className={({ isActive }) =>
                    `relative w-10 h-10 rounded-xl flex items-center justify-center transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-emerald-600 ${
                      isActive
                        ? 'bg-emerald-50 text-emerald-900 dark:bg-emerald-500/15 dark:text-emerald-300 before:absolute before:left-0 before:top-2 before:bottom-2 before:w-[3px] before:bg-emerald-600 before:rounded-r'
                        : 'text-fg-muted hover:text-fg hover:bg-surface-muted'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <LayoutDashboard
                      className={`w-4 h-4 ${isActive ? 'text-emerald-600 dark:text-emerald-400' : 'text-fg-subtle'}`}
                      aria-hidden="true"
                    />
                  )}
                </NavLink>

                {/* Collapsed Tooltip */}
                <div
                  role="tooltip"
                  className="absolute left-full ml-3 top-1/2 -translate-y-1/2 hidden group-hover:flex group-focus-within:flex items-center gap-2 px-3 py-1.5 bg-slate-900 dark:bg-slate-800 text-white text-xs font-semibold rounded-lg shadow-xl pointer-events-none z-50 whitespace-nowrap animate-in fade-in zoom-in-95 duration-100"
                >
                  <span>Dashboard</span>
                  <span className="text-[10px] text-slate-400">Overview</span>
                </div>
              </div>

              {/* Thin Divider */}
              <div className="w-6 h-px bg-line my-1.5" aria-hidden="true" />

              {/* 7 AI Steps Icons */}
              {aiLoopSteps.map((step) => {
                const Icon = step.icon;
                const isActive = location.pathname === step.path;

                return (
                  <div key={step.path} className="relative group w-full flex justify-center">
                    <NavLink
                      to={step.path}
                      aria-label={`Step ${step.stepNumber}: ${step.label}`}
                      className={`relative w-10 h-10 rounded-xl flex items-center justify-center transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-emerald-600 ${
                        isActive
                          ? 'bg-emerald-50 text-emerald-900 dark:bg-emerald-500/15 dark:text-emerald-300 before:absolute before:left-0 before:top-2 before:bottom-2 before:w-[3px] before:bg-emerald-600 before:rounded-r'
                          : 'text-fg-muted hover:text-fg hover:bg-surface-muted'
                      }`}
                    >
                      <Icon
                        className={`w-4 h-4 ${isActive ? 'text-emerald-600 dark:text-emerald-400' : 'text-fg-subtle'}`}
                        aria-hidden="true"
                      />
                    </NavLink>

                    {/* Tooltip on hover/focus showing full name & step number */}
                    <div
                      role="tooltip"
                      className="absolute left-full ml-3 top-1/2 -translate-y-1/2 hidden group-hover:flex group-focus-within:flex items-center gap-2 px-3 py-1.5 bg-slate-900 dark:bg-slate-800 text-white text-xs font-semibold rounded-lg shadow-xl pointer-events-none z-50 whitespace-nowrap animate-in fade-in zoom-in-95 duration-100"
                    >
                      <span className="w-4 h-4 rounded-full bg-emerald-600 text-white text-[10px] flex items-center justify-center font-bold">
                        {step.stepNumber}
                      </span>
                      <span>{step.label}</span>
                    </div>
                  </div>
                );
              })}

              {/* Thin Divider */}
              <div className="w-6 h-px bg-line my-1.5" aria-hidden="true" />

              {/* Plan Icons */}
              {planViews.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;

                return (
                  <div key={item.path} className="relative group w-full flex justify-center">
                    <NavLink
                      to={item.path}
                      aria-label={item.label}
                      className={`relative w-10 h-10 rounded-xl flex items-center justify-center transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-emerald-600 ${
                        isActive
                          ? 'bg-emerald-50 text-emerald-900 dark:bg-emerald-500/15 dark:text-emerald-300 before:absolute before:left-0 before:top-2 before:bottom-2 before:w-[3px] before:bg-emerald-600 before:rounded-r'
                          : 'text-fg-muted hover:text-fg hover:bg-surface-muted'
                      }`}
                    >
                      <Icon
                        className={`w-4 h-4 ${isActive ? 'text-emerald-600 dark:text-emerald-400' : 'text-fg-subtle'}`}
                        aria-hidden="true"
                      />
                    </NavLink>

                    <div
                      role="tooltip"
                      className="absolute left-full ml-3 top-1/2 -translate-y-1/2 hidden group-hover:flex group-focus-within:flex items-center gap-2 px-3 py-1.5 bg-slate-900 dark:bg-slate-800 text-white text-xs font-semibold rounded-lg shadow-xl pointer-events-none z-50 whitespace-nowrap animate-in fade-in zoom-in-95 duration-100"
                    >
                      <span>{item.label}</span>
                    </div>
                  </div>
                );
              })}

              {/* Thin Divider */}
              <div className="w-6 h-px bg-line my-1.5" aria-hidden="true" />

              {/* More Icons */}
              {moreViews.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;

                return (
                  <div key={item.path} className="relative group w-full flex justify-center">
                    <NavLink
                      to={item.path}
                      aria-label={item.label}
                      className={`relative w-10 h-10 rounded-xl flex items-center justify-center transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-emerald-600 ${
                        isActive
                          ? 'bg-emerald-50 text-emerald-900 dark:bg-emerald-500/15 dark:text-emerald-300 before:absolute before:left-0 before:top-2 before:bottom-2 before:w-[3px] before:bg-emerald-600 before:rounded-r'
                          : 'text-fg-muted hover:text-fg hover:bg-surface-muted'
                      }`}
                    >
                      <Icon
                        className={`w-4 h-4 ${isActive ? 'text-emerald-600 dark:text-emerald-400' : 'text-fg-subtle'}`}
                        aria-hidden="true"
                      />
                    </NavLink>

                    <div
                      role="tooltip"
                      className="absolute left-full ml-3 top-1/2 -translate-y-1/2 hidden group-hover:flex group-focus-within:flex items-center gap-2 px-3 py-1.5 bg-slate-900 dark:bg-slate-800 text-white text-xs font-semibold rounded-lg shadow-xl pointer-events-none z-50 whitespace-nowrap animate-in fade-in zoom-in-95 duration-100"
                    >
                      <span>{item.label}</span>
                    </div>
                  </div>
                );
              })}

            </div>

            {/* Bottom 3-icon Control Row inside 56px rail */}
            <div className="w-full pt-3 border-t border-line flex flex-col items-center gap-1 px-1">
              {/* Theme toggle */}
              <button
                type="button"
                onClick={toggle}
                aria-label={`Toggle theme (currently ${theme})`}
                title={`Theme: ${theme === 'dark' ? 'Night' : 'Day'} mode`}
                className="w-9 h-9 rounded-xl flex items-center justify-center text-fg-muted hover:text-fg hover:bg-surface-muted transition-colors cursor-pointer focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-emerald-600"
              >
                {theme === 'dark' ? (
                  <Moon className="w-4 h-4 text-emerald-400" />
                ) : (
                  <Sun className="w-4 h-4 text-amber-500" />
                )}
              </button>

              {/* Presentation mode */}
              <button
                type="button"
                onClick={togglePresentation}
                aria-label="Focus mode (F)"
                title="Presentation / Focus mode (F)"
                className="w-9 h-9 rounded-xl flex items-center justify-center text-fg-muted hover:text-fg hover:bg-surface-muted transition-colors cursor-pointer focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-emerald-600"
              >
                <Maximize2 className="w-4 h-4" />
              </button>

              {/* Expand sidebar */}
              <button
                type="button"
                onClick={toggleSidebar}
                aria-label="Expand sidebar ([)"
                title="Expand sidebar ([)"
                className="w-9 h-9 rounded-xl flex items-center justify-center text-fg-muted hover:text-fg hover:bg-surface-muted transition-colors cursor-pointer focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-emerald-600"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </aside>

      {/* ========================================================================= */}
      {/* Flyout Panel Overlay: Temporarily opens 240px overlay without layout jump */}
      {/* ========================================================================= */}
      {sidebarMode === 'collapsed' && isFlyoutOpen && (
        <div
          role="dialog"
          aria-label="Expanded Navigation Flyout"
          onMouseEnter={handleRailMouseEnter}
          onMouseLeave={handleRailMouseLeave}
          className="hidden md:block fixed left-14 top-16 bottom-0 w-60 bg-surface border-r border-line shadow-2xl z-40 animate-in fade-in slide-in-from-left-2 duration-150"
        >
          {renderFullNavigationContent(() => setFlyoutOpen(false))}
        </div>
      )}

      {/* ========================================================================= */}
      {/* Mobile Drawer Backdrop & Slide-out Menu (< 768px)                          */}
      {/* ========================================================================= */}
      {mobileDrawerOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Mobile Navigation Menu"
          className="md:hidden fixed inset-0 z-50 flex"
        >
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200"
            onClick={() => setMobileDrawerOpen(false)}
          />

          {/* Drawer content */}
          <div className="relative w-72 max-w-[85vw] bg-surface h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-left duration-200">
            <div className="p-4 border-b border-line flex items-center justify-between">
              <span className="font-semibold text-fg text-sm">Navigation</span>
              <button
                type="button"
                onClick={() => setMobileDrawerOpen(false)}
                className="p-1 rounded-lg text-fg-muted hover:text-fg hover:bg-surface-muted"
                aria-label="Close navigation drawer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              {renderFullNavigationContent(() => setMobileDrawerOpen(false))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* Mobile Bottom Horizontal Step Bar (Retained for quick touch access)        */}
      {/* ========================================================================= */}
      <nav
        aria-label="Mobile Step Navigation"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-surface/95 backdrop-blur-md border-t border-line px-2 py-2 safe-bottom-padding shadow-lg"
      >
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar scroll-smooth px-1">
          {/* Hamburger menu trigger */}
          <button
            type="button"
            onClick={() => setMobileDrawerOpen(true)}
            aria-label="Open full navigation drawer"
            className="flex items-center justify-center p-2 rounded-xl text-fg-muted bg-surface-muted border border-line min-h-[38px] min-w-[38px] flex-shrink-0"
          >
            <Menu className="w-4 h-4" />
          </button>

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
        </div>
      </nav>
    </>
  );
};
