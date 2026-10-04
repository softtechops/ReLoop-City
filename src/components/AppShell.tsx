import React, { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { GuidedTourModal } from './GuidedTourModal';
import { ResetConfirmDialog } from './ResetConfirmDialog';
import { Toast } from './ui/Toast';
import { Skeleton } from './ui/Skeleton';

// Accessible loading fallback skeleton
const PageFallback: React.FC = () => (
  <div className="space-y-6 py-6" role="status" aria-label="Loading page...">
    <Skeleton className="h-10 w-2/5" />
    <Skeleton className="h-6 w-3/5" />
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 pt-4">
      <Skeleton className="h-32 rounded-2xl" />
      <Skeleton className="h-32 rounded-2xl" />
      <Skeleton className="h-32 rounded-2xl" />
    </div>
    <Skeleton className="h-80 rounded-2xl" />
  </div>
);

export const AppShell: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col text-[#0F172A] font-sans selection:bg-emerald-100 selection:text-emerald-900">
      
      {/* Sticky Municipal Header with simulation controls + Back to website */}
      <Header />

      {/* Main Content Layout Container */}
      <div className="flex-1 flex max-w-[1600px] w-full mx-auto">
        
        {/* Accessible Left Rail Sidebar + Mobile Navigation */}
        <Sidebar />

        {/* Main Content Landmark */}
        <main
          id="main-content"
          className="flex-1 px-4 sm:px-6 lg:px-8 py-6 max-w-7xl mx-auto w-full overflow-x-hidden pb-24 md:pb-8"
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
