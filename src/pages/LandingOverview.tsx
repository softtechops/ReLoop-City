import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { 
  ArrowRight, 
  Sparkles, 
  Leaf, 
  Zap, 
  TrendingUp, 
  ShieldCheck, 
  Radio, 
  Route, 
  ScanSearch, 
  GitFork, 
  Coins, 
  Boxes, 
  Cpu, 
  Factory,
  CheckCircle2,
  Compass,
  LayoutDashboard
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { SectionCard } from '../components/ui/SectionCard';

export const LandingOverview: React.FC = () => {
  const { welcomeDismissed, dismissWelcome, startGuidedTour, setMode } = useStore();
  const navigate = useNavigate();

  const handleStartTour = () => {
    dismissWelcome();
    startGuidedTour();
  };

  const handleJumpToDashboard = () => {
    dismissWelcome();
    setMode('reloop');
    navigate('/app/dashboard');
  };

  const handleExploreAlone = () => {
    dismissWelcome();
  };

  const aiSteps = [
    { num: '01', name: 'Sense', route: '/app/map', icon: Radio, desc: 'IoT fill-levels & ultrasonic composition telemetry across city bins' },
    { num: '02', name: 'Predict', route: '/app/predict', icon: TrendingUp, desc: 'Time-series volume forecasting & generation hotspot detection' },
    { num: '03', name: 'Optimize', route: '/app/optimize', icon: Route, desc: 'Capacity-constrained dynamic routing (CVRP) saving 32%+ fuel' },
    { num: '04', name: 'Classify', route: '/app/classify', icon: ScanSearch, desc: 'Computer vision sorting at MRF recovering high-purity commodities' },
    { num: '05', name: 'Allocate', route: '/app/allocate', icon: GitFork, desc: 'Dynamic mass allocation to Anaerobic Digestion, Composting & Recycling' },
    { num: '06', name: 'Forecast', route: '/app/forecast', icon: Zap, desc: 'Bio-methane & clean electricity generation forecasting for the grid' },
    { num: '07', name: 'Report', route: '/app/revenue', icon: Coins, desc: 'Waste-to-Value Dashboard for transparent circular governance' },
  ];

  return (
    <div className="space-y-10 pb-16">
      
      {/* First-Run Welcome Card (Section 3: In-Memory Only) */}
      {!welcomeDismissed && (
        <div
          role="region"
          aria-label="Welcome and Quick Start"
          className="p-6 sm:p-7 rounded-3xl bg-gradient-to-r from-navy-900 via-navy-800 to-navy-900 text-white shadow-xl border border-navy-700/60 relative overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300"
        >
          <div className="absolute right-0 top-0 w-80 h-80 bg-sage-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="flex items-center gap-2">
              <Badge variant="amber" size="md">
                <Sparkles className="w-3.5 h-3.5 text-amberGold-700" aria-hidden="true" />
                <span>Welcome to ReLoop City Prototype</span>
              </Badge>
              <span className="text-xs text-navy-300 hidden sm:inline">
                PCCOE Pune International Grand Challenge 2026
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold font-['Outfit'] text-white">
              How would you like to experience the municipal circular platform?
            </h2>

            <p className="text-sm text-navy-100 leading-relaxed">
              Explore how Pune pilot sectors replace fixed garbage routes with predictive sensing, 2-Opt fleet optimization, automated MRF classification, and renewable energy conversion.
            </p>

            {/* 3 Big Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <button
                type="button"
                onClick={handleStartTour}
                className="flex flex-col items-start p-4 rounded-2xl bg-sage-600 hover:bg-sage-500 text-white font-semibold text-left shadow-md transition-all active:scale-[0.98] focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-white"
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <Sparkles className="w-5 h-5 text-amberGold-300" aria-hidden="true" />
                  <span className="text-xs opacity-80 font-mono">2 mins</span>
                </div>
                <span className="font-bold text-sm">Guided Tour</span>
                <span className="text-xs text-sage-100 font-normal mt-0.5">
                  Step-by-step interactive 7-step loop walkthrough
                </span>
              </button>

              <button
                type="button"
                onClick={handleJumpToDashboard}
                className="flex flex-col items-start p-4 rounded-2xl bg-white hover:bg-navy-50 text-navy-900 font-semibold text-left shadow-md transition-all active:scale-[0.98] focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-white"
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <LayoutDashboard className="w-5 h-5 text-navy-700" aria-hidden="true" />
                  <span className="text-xs text-charcoal-400 font-mono">Live KPIs</span>
                </div>
                <span className="font-bold text-sm">Live Dashboard</span>
                <span className="text-xs text-charcoal-600 font-normal mt-0.5">
                  Real-time mass balance, power, & fiscal returns
                </span>
              </button>

              <button
                type="button"
                onClick={handleExploreAlone}
                className="flex flex-col items-start p-4 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-semibold text-left border border-white/20 transition-all active:scale-[0.98] focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-white"
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <Compass className="w-5 h-5 text-amberGold-300" aria-hidden="true" />
                  <span className="text-xs opacity-70 font-mono">Freely</span>
                </div>
                <span className="font-bold text-sm">Explore on My Own</span>
                <span className="text-xs text-navy-200 font-normal mt-0.5">
                  Browse pages, inspect bins, and test routes
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section: Polished, focused on 1 core value prop + primary CTA + secondary CTA (Section 6) */}
      <section className="relative overflow-hidden rounded-3xl bg-navy-700 text-white p-8 sm:p-12 lg:p-14 shadow-2xl">
        <div className="absolute inset-0 blueprint-grid opacity-15 pointer-events-none" />
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-sage-500/20 blur-3xl pointer-events-none" />

        <div className="relative max-w-4xl space-y-6">
          <Badge variant="amber" size="md" className="bg-amberGold-500/20 text-amberGold-200 border-amberGold-400/40">
            <Sparkles className="w-3.5 h-3.5 text-amberGold-300" aria-hidden="true" />
            <span>PCCOE International Grand Challenge 2026 · Pune, India</span>
          </Badge>

          <h1
            tabIndex={-1}
            className="text-3xl sm:text-5xl lg:text-5xl font-extrabold tracking-tight leading-tight font-['Outfit'] focus:outline-hidden"
          >
            AI-Powered Waste-to-Resource <br />
            <span className="text-sage-400">Circular City Platform</span>
          </h1>

          <p className="text-base sm:text-lg text-navy-100 font-normal max-w-2xl leading-relaxed">
            <strong className="text-white font-semibold">Cities are losing value in their own waste.</strong> ReLoop City redesigns the municipal waste stream as an autonomous resource-and-energy loop instead of an endless landfill disposal problem.
          </p>

          {/* Primary + Secondary CTAs (Section 6) */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Button
              variant="sage"
              size="lg"
              icon={<ArrowRight className="w-5 h-5" />}
              iconPosition="right"
              onClick={handleJumpToDashboard}
            >
              Launch Live Prototype
            </Button>

            <Button
              variant="secondary"
              size="lg"
              icon={<Sparkles className="w-4 h-4 text-amberGold-600" />}
              onClick={handleStartTour}
              className="bg-white/10 text-white hover:bg-white/20 border-white/25 backdrop-blur-xs"
            >
              2-Minute Guided Tour
            </Button>
          </div>

          {/* 4 Highlight Outcomes */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-white/15 text-xs text-navy-200">
            <div>
              <span className="block font-bold text-2xl text-white font-['Outfit']">95.2%</span>
              <span className="text-xs">Landfill Diversion Rate</span>
            </div>
            <div>
              <span className="block font-bold text-2xl text-amberGold-400 font-['Outfit']">-32%</span>
              <span className="text-xs">Fleet Route Distance (km)</span>
            </div>
            <div>
              <span className="block font-bold text-2xl text-sage-400 font-['Outfit']">71.0 MWh</span>
              <span className="text-xs">Clean Power Generated</span>
            </div>
            <div>
              <span className="block font-bold text-2xl text-white font-['Outfit']">₹34.2 Lakh</span>
              <span className="text-xs">Quarterly Resource Value</span>
            </div>
          </div>
        </div>
      </section>

      {/* The Paradigm Shift: Linear Reality vs Circular Future (Slide 3) */}
      <section className="space-y-4">
        <div className="text-center max-w-2xl mx-auto space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-navy-700">The Paradigm Shift</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-navy-900 font-['Outfit']">
            Minimizing Landfill Dependency
          </h2>
          <p className="text-sm text-charcoal-600">
            Transforming municipal waste from an uncontrollable cost center into an economically self-sustaining loop.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-navy-100 shadow-blueprint overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-navy-100">
            
            {/* Linear Reality */}
            <div className="p-6 sm:p-7 space-y-4 bg-red-50/20">
              <div className="flex items-center justify-between pb-3 border-b border-red-100">
                <div>
                  <h3 className="text-base font-bold text-charcoal-800 flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500" aria-hidden="true" />
                    Linear Reality (Waste to Landfill)
                  </h3>
                  <span className="text-xs text-charcoal-500">Current status quo across global municipalities</span>
                </div>
                <Badge variant="red" size="sm">Unsustainable</Badge>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-white border border-red-100 shadow-xs">
                  <div className="w-6 h-6 rounded-full bg-red-100 text-red-700 flex items-center justify-center font-bold text-xs flex-shrink-0" aria-hidden="true">✕</div>
                  <div>
                    <h4 className="font-bold text-charcoal-800 text-sm">Resource Inefficient</h4>
                    <p className="text-charcoal-600 text-xs mt-0.5">High-grade recyclable plastic, paper, and glass lost in mixed dumpsites.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-white border border-red-100 shadow-xs">
                  <div className="w-6 h-6 rounded-full bg-red-100 text-red-700 flex items-center justify-center font-bold text-xs flex-shrink-0" aria-hidden="true">✕</div>
                  <div>
                    <h4 className="font-bold text-charcoal-800 text-sm">Heavy Landfill Overload</h4>
                    <p className="text-charcoal-600 text-xs mt-0.5">Rapidly shrinking landfill airspace and severe subterranean methane leaks.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-white border border-red-100 shadow-xs">
                  <div className="w-6 h-6 rounded-full bg-red-100 text-red-700 flex items-center justify-center font-bold text-xs flex-shrink-0" aria-hidden="true">✕</div>
                  <div>
                    <h4 className="font-bold text-charcoal-800 text-sm">Perpetual Cost Center</h4>
                    <p className="text-charcoal-600 text-xs mt-0.5">Taxpayer funds burn on fuel for fixed routes visiting half-empty bins.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Circular Future */}
            <div className="p-6 sm:p-7 space-y-4 bg-sage-50/30">
              <div className="flex items-center justify-between pb-3 border-b border-sage-200">
                <div>
                  <h3 className="text-base font-bold text-navy-900 flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-sage-500" aria-hidden="true" />
                    Circular Future (Waste to Resource & Energy)
                  </h3>
                  <span className="text-xs text-charcoal-500">ReLoop AI-Driven Closed-Loop Architecture</span>
                </div>
                <Badge variant="sage" size="sm">Closed Loop</Badge>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-white border border-sage-200 shadow-xs">
                  <div className="w-6 h-6 rounded-full bg-sage-100 text-sage-800 flex items-center justify-center font-bold text-xs flex-shrink-0" aria-hidden="true">✓</div>
                  <div>
                    <h4 className="font-bold text-charcoal-800 text-sm">Resource-Efficient Recovery</h4>
                    <p className="text-charcoal-600 text-xs mt-0.5">Automated MRF computer vision sorts clean streams for remanufacturing.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-white border border-sage-200 shadow-xs">
                  <div className="w-6 h-6 rounded-full bg-sage-100 text-sage-800 flex items-center justify-center font-bold text-xs flex-shrink-0" aria-hidden="true">✓</div>
                  <div>
                    <h4 className="font-bold text-charcoal-800 text-sm">95%+ Landfill Diversion</h4>
                    <p className="text-charcoal-600 text-xs mt-0.5">Only non-combustible unavoidable inert residuals reach sanitary landfills.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-white border border-sage-200 shadow-xs">
                  <div className="w-6 h-6 rounded-full bg-sage-100 text-sage-800 flex items-center justify-center font-bold text-xs flex-shrink-0" aria-hidden="true">✓</div>
                  <div>
                    <h4 className="font-bold text-charcoal-800 text-sm">Economically Self-Sustaining</h4>
                    <p className="text-charcoal-600 text-xs mt-0.5">6 diversified revenue streams (recycled pellets, power, compost, EPR credits).</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* The 7 AI Steps Horizontal Stepper (Slide 7) */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-navy-700">The 7 AI Steps</span>
            <h2 className="text-2xl font-bold text-navy-900 font-['Outfit']">
              Where AI Adds Intelligence
            </h2>
          </div>
          <Button
            variant="secondary"
            size="sm"
            icon={<Sparkles className="w-4 h-4 text-amberGold-600" />}
            onClick={handleStartTour}
          >
            Launch Step-by-Step Walkthrough
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-3">
          {aiSteps.map((step) => {
            const Icon = step.icon;
            return (
              <Link
                key={step.num}
                to={step.route}
                className="group p-4 rounded-2xl bg-white border border-navy-100 shadow-blueprint hover:border-navy-400 hover:shadow-blueprint-lg transition-all flex flex-col justify-between focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-navy-600"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-mono text-xs font-bold text-charcoal-500 group-hover:text-navy-700">
                      {step.num}
                    </span>
                    <div className="w-8 h-8 rounded-lg bg-navy-50 group-hover:bg-navy-700 group-hover:text-white text-navy-700 flex items-center justify-center transition-colors" aria-hidden="true">
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>
                  <h3 className="font-bold text-sm text-navy-900 mb-1">
                    {step.name}
                  </h3>
                  <p className="text-xs text-charcoal-600 leading-snug">
                    {step.desc}
                  </p>
                </div>
                <div className="pt-3 mt-3 border-t border-navy-50 flex items-center text-xs font-bold text-navy-700 group-hover:text-navy-900">
                  <span>Explore step</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* CTA Box */}
      <section className="rounded-3xl bg-gradient-to-r from-navy-700 to-navy-800 text-white p-8 text-center space-y-4 shadow-xl">
        <h3 className="text-xl sm:text-2xl font-bold font-['Outfit'] text-white">
          Ready to experience ReLoop City in action?
        </h3>
        <p className="text-sm text-navy-200 max-w-xl mx-auto leading-relaxed">
          Observe live IoT bin fill telemetry in Pune, test CVRP dynamic collection routes, classify waste items via computer vision, and explore circular revenue streams.
        </p>
        <div className="flex justify-center gap-3 pt-2">
          <Button
            variant="sage"
            size="lg"
            onClick={handleJumpToDashboard}
          >
            Open Waste-to-Value Dashboard
          </Button>
        </div>
      </section>

    </div>
  );
};
