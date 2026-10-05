import React, { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { GuidedTourModal } from './GuidedTourModal';
import { ResetConfirmDialog } from './ResetConfirmDialog';
import { Toast } from './ui/Toast';
import { Skeleton } from './ui/Skeleton';

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
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900 font-sans selection:bg-emerald-100 selection:text-emerald-900">
      
      {/* Slim municipal header with centered mode toggle */}
      <Header />

      {/* Main Content Layout Container */}
      <div className="flex-1 flex max-w-[1600px] w-full mx-auto">
        
        {/* Left Rail Sidebar + Mobile Navigation */}
        <Sidebar />

        {/* Main Content Landmark */}
        <main
          id="main-content"
          className="flex-1 px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto w-full overflow-x-hidden pb-24 md:pb-12"
        >
          <Suspense fallback={<PageFallback />}>
            <Outlet />
          </Suspense>
        </main>
      </div>

      {/* Modals & Dialogs & Notifications */}
      <GuidedTourModal />
      <ResetConfirmDialog />
      <Toast />

    </div>
  );
};
