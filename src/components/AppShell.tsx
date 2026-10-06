import React, { Suspense, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { GuidedTourModal } from './GuidedTourModal';
import { ResetConfirmDialog } from './ResetConfirmDialog';
import { Toast } from './ui/Toast';
import { Skeleton } from './ui/Skeleton';
import { useUiPrefs } from '../store/useUiPrefs';
import { Minimize2 } from 'lucide-react';
import { CommandHud } from './cinematic/CommandHud';

// Accessible loading fallback skeleton matching catalog card layout
const PageFallback: React.FC = () => (
  <div className="space-y-8 py-4" role="status" aria-label="Loading page...">
    <div className="space-y-2">
      <Skeleton className="h-8 w-48 rounded-xl" />
      <Skeleton className="h-4 w-96 rounded-lg" />
    </div>
    <Skeleton className="h-14 rounded-xl" />
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <Skeleton className="h-36 rounded-2xl" />
      <Skeleton className="h-36 rounded-2xl" />
      <Skeleton className="h-36 rounded-2xl" />
      <Skeleton className="h-36 rounded-2xl" />
    </div>
    <Skeleton className="h-80 rounded-2xl" />
  </div>
);

export const AppShell: React.FC = () => {
  const {
    sidebarMode,
    isFlyoutOpen,
    setFlyoutOpen,
    setMobileDrawerOpen,
    toggleSidebar,
    presentationMode,
    togglePresentation,
  } = useUiPrefs();

  // Keyboard shortcuts: `[` toggles sidebar, `Esc` closes flyout, `F` toggles focus mode
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const isInput =
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.tagName === 'SELECT' ||
          target.isContentEditable);

      if (isInput) return;

      // `[` toggles sidebar collapse/expand
      if (e.key === '[') {
        e.preventDefault();
        toggleSidebar();
      }

      // `Esc` closes flyout overlay or mobile drawer
      if (e.key === 'Escape') {
        if (isFlyoutOpen) setFlyoutOpen(false);
        setMobileDrawerOpen(false);
      }

      // `F` or `f` toggles presentation/focus mode (without meta/ctrl/alt)
      if ((e.key === 'f' || e.key === 'F') && !e.ctrlKey && !e.metaKey && !e.altKey) {
        e.preventDefault();
        togglePresentation();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleSidebar, isFlyoutOpen, setFlyoutOpen, setMobileDrawerOpen, togglePresentation]);

  // Dispatch window resize after sidebar width transition completes so recharts & leaflet adapt seamlessly
  useEffect(() => {
    const timer = setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 220);
    return () => clearTimeout(timer);
  }, [sidebarMode, presentationMode]);

  return (
    <div
      className={`min-h-screen bg-page text-fg flex flex-col font-sans selection:bg-emerald-200 selection:text-emerald-950 dark:selection:bg-emerald-900 dark:selection:text-emerald-100 ${
        presentationMode ? 'text-[15.5px]' : ''
      }`}
    >
      {/* Slim municipal header with centered mode toggle & theme toggle */}
      <Header />

      {/* Main Content Layout Container */}
      <div
        className={`flex-1 flex w-full mx-auto transition-all duration-200 ${
          presentationMode ? 'max-w-7xl justify-center' : 'max-w-[1600px]'
        }`}
      >
        {/* Left Rail Sidebar + Mobile Navigation (Hidden in focus mode) */}
        {!presentationMode && <Sidebar />}

        {/* Main Content Landmark */}
        <main
          id="main-content"
          className={`flex-1 px-4 sm:px-6 lg:px-8 py-8 w-full overflow-x-hidden pb-24 md:pb-12 transition-all duration-200 ${
            presentationMode ? 'max-w-7xl mx-auto px-8 py-10' : 'max-w-6xl mx-auto'
          }`}
        >
          <Suspense fallback={<PageFallback />}>
            <Outlet />
          </Suspense>
        </main>
      </div>

      {/* Floating Exit Focus Mode Pill (Only rendered in Focus Mode) */}
      {presentationMode && (
        <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <button
            type="button"
            onClick={togglePresentation}
            className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-2xl hover:scale-105 active:scale-95 transition-all text-xs font-semibold cursor-pointer border border-slate-700 dark:border-slate-300"
            title="Exit Focus Mode (or press F)"
          >
            <Minimize2 className="w-4 h-4" />
            <span>Exit focus</span>
            <kbd className="ml-1 px-1.5 py-0.5 rounded bg-slate-800 dark:bg-slate-200 text-[10px] text-slate-300 dark:text-slate-700 font-mono">
              F
            </kbd>
          </button>
        </div>
      )}

      {/* Modals & Dialogs & Notifications */}
      <GuidedTourModal />
      <ResetConfirmDialog />
      <Toast />
      <CommandHud />
    </div>
  );
};
