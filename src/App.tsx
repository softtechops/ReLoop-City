import React from 'react';
import { useStore } from './store/useStore';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { GuidedTourModal } from './components/GuidedTourModal';

// Pages
import { LandingOverview } from './pages/LandingOverview';
import { Dashboard } from './pages/Dashboard';
import { LiveCityMap } from './pages/LiveCityMap';
import { PredictPage } from './pages/PredictPage';
import { OptimizePage } from './pages/OptimizePage';
import { ClassifyPage } from './pages/ClassifyPage';
import { AllocatePage } from './pages/AllocatePage';
import { RevenuePage } from './pages/RevenuePage';
import { AssumptionsRoadmap } from './pages/AssumptionsRoadmap';

export function App() {
  const { activePage } = useStore();

  const renderActivePage = () => {
    switch (activePage) {
      case 'overview':
        return <LandingOverview />;
      case 'dashboard':
        return <Dashboard />;
      case 'map':
        return <LiveCityMap />;
      case 'predict':
        return <PredictPage />;
      case 'optimize':
        return <OptimizePage />;
      case 'classify':
        return <ClassifyPage />;
      case 'allocate':
        return <AllocatePage />;
      case 'revenue':
        return <RevenuePage />;
      case 'assumptions':
        return <AssumptionsRoadmap />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F6F2] flex flex-col text-[#2F3437] font-sans selection:bg-navy-100 selection:text-navy-900">
      
      {/* Municipal Sticky Header */}
      <Header />

      {/* Main Layout Container */}
      <div className="flex-1 flex max-w-[1600px] w-full mx-auto">
        
        {/* Left Sidebar */}
        <Sidebar />

        {/* Content Area */}
        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 max-w-7xl mx-auto w-full overflow-x-hidden">
          {renderActivePage()}

          {/* Footer Note */}
          <footer className="pt-8 pb-16 md:pb-6 border-t border-navy-100 text-center text-xs text-charcoal-400 space-y-1">
            <p className="font-semibold text-navy-800">
              ReLoop City • AI-Powered Waste-to-Resource Circular Platform
            </p>
            <p>
              PCCOE International Grand Challenge: 2026 Pune, India • Theme: AI for Climate Change (Smart Cities Track)
            </p>
            <p className="text-[11px] text-charcoal-400 font-mono">
              All data client-side deterministic simulation with seeded PRNG • No backend required
            </p>
          </footer>
        </main>
      </div>

      {/* 7-Step Guided Tour Modal */}
      <GuidedTourModal />

    </div>
  );
}

export default App;
