import React, { Suspense, lazy } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { GuidedTourModal } from './components/GuidedTourModal';
import { ResetConfirmDialog } from './components/ResetConfirmDialog';
import { RouteManager } from './components/RouteManager';
import { Skeleton } from './components/ui/Skeleton';

// Lazy-loaded pages for performance optimization (Section 8)
const LandingOverview = lazy(() => import('./pages/LandingOverview').then(m => ({ default: m.LandingOverview })));
const Dashboard = lazy(() => import('./pages/Dashboard').then(m => ({ default: m.Dashboard })));
const LiveCityMap = lazy(() => import('./pages/LiveCityMap').then(m => ({ default: m.LiveCityMap })));
const PredictPage = lazy(() => import('./pages/PredictPage').then(m => ({ default: m.PredictPage })));
const OptimizePage = lazy(() => import('./pages/OptimizePage').then(m => ({ default: m.OptimizePage })));
const ClassifyPage = lazy(() => import('./pages/ClassifyPage').then(m => ({ default: m.ClassifyPage })));
const AllocatePage = lazy(() => import('./pages/AllocatePage').then(m => ({ default: m.AllocatePage })));
const RevenuePage = lazy(() => import('./pages/RevenuePage').then(m => ({ default: m.RevenuePage })));
const AssumptionsRoadmap = lazy(() => import('./pages/AssumptionsRoadmap').then(m => ({ default: m.AssumptionsRoadmap })));

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

export function App() {
  return (
    <HashRouter>
      <RouteManager />
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col text-[#0F172A] font-sans selection:bg-emerald-100 selection:text-emerald-900">
        
        {/* Sticky Municipal Header */}
        <Header />

        {/* Main Content Layout Container */}
        <div className="flex-1 flex max-w-[1600px] w-full mx-auto">
          
          {/* Accessible Desktop Navigation Sidebar + Mobile Bottom Tab Bar */}
          <Sidebar />

          {/* Main Content Landmark */}
          <main
            id="main-content"
            className="flex-1 px-4 sm:px-6 lg:px-8 py-6 max-w-7xl mx-auto w-full overflow-x-hidden safe-bottom-padding"
          >
            <Suspense fallback={<PageFallback />}>
              <Routes>
                <Route path="/" element={<Navigate to="/overview" replace />} />
                <Route path="/overview" element={<LandingOverview />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/map" element={<LiveCityMap />} />
                <Route path="/predict" element={<PredictPage />} />
                <Route path="/optimize" element={<OptimizePage />} />
                <Route path="/classify" element={<ClassifyPage />} />
                <Route path="/allocate" element={<AllocatePage />} />
                <Route path="/revenue" element={<RevenuePage />} />
                <Route path="/assumptions" element={<AssumptionsRoadmap />} />
                <Route path="*" element={<Navigate to="/overview" replace />} />
              </Routes>
            </Suspense>

            {/* Footer */}
            <footer className="pt-10 pb-20 md:pb-8 border-t border-navy-100 text-center text-xs text-charcoal-500 space-y-1">
              <p className="font-bold text-navy-900 text-sm">
                ReLoop City · AI-Powered Waste-to-Resource Circular City Platform
              </p>
              <p className="text-charcoal-600">
                PCCOE International Grand Challenge: 2026 Pune, India · Theme: AI for Climate Change (Smart Cities Track)
              </p>
              <p className="text-xs text-charcoal-400 font-mono">
                Deterministic Client-Side Simulation · Calibrated to Pune Municipal Pilot Data · No Backend Required
              </p>
            </footer>
          </main>
        </div>

        {/* Modals & Dialogs */}
        <GuidedTourModal />
        <ResetConfirmDialog />

      </div>
    </HashRouter>
  );
}

export default App;
