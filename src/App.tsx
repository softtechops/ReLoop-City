import React, { Suspense, lazy } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { RouteManager } from './components/RouteManager';
import { Skeleton } from './components/ui/Skeleton';

// Public Product Website (full-width public marketing landing experience)
const PublicWebsite = lazy(() => import('./pages/PublicWebsite').then(m => ({ default: m.PublicWebsite })));

// Authentication Experience (Login / Signup)
const AuthPage = lazy(() => import('./pages/AuthPage').then(m => ({ default: m.AuthPage })));

// Application Shell (header with simulation controls + sidebar + 9 pages)
const AppShell = lazy(() => import('./components/AppShell').then(m => ({ default: m.AppShell })));

// Lazy-loaded App pages for performance optimization
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
  <div className="min-h-screen p-8 max-w-7xl mx-auto space-y-6" role="status" aria-label="Loading page...">
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
      <Suspense fallback={<PageFallback />}>
        <Routes>
          {/* Authentication Experience */}
          <Route path="/login" element={<AuthPage defaultMode="login" />} />
          <Route path="/signup" element={<AuthPage defaultMode="signup" />} />
          <Route path="/auth" element={<AuthPage defaultMode="login" />} />

          {/* Public Website Experience at "/" */}
          <Route path="/" element={<PublicWebsite />} />

          {/* App Experience at "/app/*" with Sidebar + Municipal Header */}
          <Route path="/app" element={<AppShell />}>
            <Route index element={<Navigate to="/app/dashboard" replace />} />
            <Route path="overview" element={<LandingOverview />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="map" element={<LiveCityMap />} />
            <Route path="predict" element={<PredictPage />} />
            <Route path="optimize" element={<OptimizePage />} />
            <Route path="classify" element={<ClassifyPage />} />
            <Route path="allocate" element={<AllocatePage />} />
            <Route path="revenue" element={<RevenuePage />} />
            <Route path="assumptions" element={<AssumptionsRoadmap />} />
            <Route path="*" element={<Navigate to="/app/dashboard" replace />} />
          </Route>

          {/* Legacy Deep Link Backwards-Compatibility Redirects */}
          <Route path="/overview" element={<Navigate to="/app/overview" replace />} />
          <Route path="/dashboard" element={<Navigate to="/app/dashboard" replace />} />
          <Route path="/map" element={<Navigate to="/app/map" replace />} />
          <Route path="/predict" element={<Navigate to="/app/predict" replace />} />
          <Route path="/optimize" element={<Navigate to="/app/optimize" replace />} />
          <Route path="/classify" element={<Navigate to="/app/classify" replace />} />
          <Route path="/allocate" element={<Navigate to="/app/allocate" replace />} />
          <Route path="/revenue" element={<Navigate to="/app/revenue" replace />} />
          <Route path="/assumptions" element={<Navigate to="/app/assumptions" replace />} />

          {/* Global Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </HashRouter>
  );
}

export default App;
