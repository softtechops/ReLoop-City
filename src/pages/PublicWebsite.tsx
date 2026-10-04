import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PublicNavbar } from '../components/public/PublicNavbar';
import { PublicFooter } from '../components/public/PublicFooter';
import { IsometricCityLoop } from '../components/illustrations/IsometricCityLoop';
import {
  SmartBinIllustration,
  TruckRouteIllustration,
  VisionSortingIllustration,
} from '../components/illustrations/FeatureMiniIllustrations';
import { useStore } from '../store/useStore';
import { useCountUp } from '../lib/useCountUp';
import {
  Sparkles,
  ArrowRight,
  Play,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Radio,
  TrendingUp,
  Route as RouteIcon,
  ScanSearch,
  GitFork,
  Zap,
  Coins,
  ShieldCheck,
  HardHat,
  Leaf,
  Cpu,
  Layers,
  ChevronRight,
  ExternalLink,
  ChevronDown,
  Info
} from 'lucide-react';
import {
  AreaChart,
  Area,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip as RechartsTooltip,
} from 'recharts';

export const PublicWebsite: React.FC = () => {
  const navigate = useNavigate();
  const {
    simState,
    mode,
    setMode,
    isSimRunning,
    startSimulation,
    pauseSimulation,
    startGuidedTour,
  } = useStore();

  // Scroll Count-Up stats for Hero Strip
  const diversionStat = useCountUp({ end: 95.2, decimals: 1, suffix: '%' });
  const distanceStat = useCountUp({ end: 32, decimals: 0, prefix: '-', suffix: '%' });
  const energyStat = useCountUp({ end: 71, decimals: 0, suffix: ' MWh' });
  const revenueStat = useCountUp({ end: 34.2, decimals: 1, prefix: '₹', suffix: 'L' });

  // Active step in "How It Works" interactive loop
  const [activeLoopStep, setActiveLoopStep] = useState(0);

  // Active accordion in FAQ/Learn more
  const [activeAccordion, setActiveAccordion] = useState<number | null>(null);

  // Auto-play the mini dashboard preview simulation if not running
  useEffect(() => {
    if (!isSimRunning) {
      startSimulation();
    }
  }, [isSimRunning, startSimulation]);

  // 7 Steps in the loop
  const loopSteps = [
    {
      step: 1,
      name: 'Sense',
      headline: 'IoT Telemetry',
      desc: 'Real-time bin level, weight & fill velocity sensors across city wards.',
      icon: Radio,
      badge: 'Step 1',
    },
    {
      step: 2,
      name: 'Predict',
      headline: 'Waste Forecast',
      desc: 'Hyper-local tonnage prediction 24h ahead based on demographics and trends.',
      icon: TrendingUp,
      badge: 'Step 2',
    },
    {
      step: 3,
      name: 'Optimize',
      headline: 'Dynamic Dispatch',
      desc: 'Automated fuel-saving truck routing bypassing under-filled bins.',
      icon: RouteIcon,
      badge: 'Step 3',
    },
    {
      step: 4,
      name: 'Classify',
      headline: 'Computer Vision',
      desc: 'High-speed optical conveyor sorting for pure polymers and organics.',
      icon: ScanSearch,
      badge: 'Step 4',
    },
    {
      step: 5,
      name: 'Allocate',
      headline: 'Facility Balancing',
      desc: 'Directing materials to MRF recycling, composting, or energy plants.',
      icon: GitFork,
      badge: 'Step 5',
    },
    {
      step: 6,
      name: 'Forecast',
      headline: 'Biogas & Energy',
      desc: 'Converting organic digestate into grid power and compressed methane.',
      icon: Zap,
      badge: 'Step 6',
    },
    {
      step: 7,
      name: 'Report',
      headline: 'Circular Ledger',
      desc: 'Audited carbon diversion and revenue settlement for municipal authorities.',
      icon: Coins,
      badge: 'Step 7',
    },
  ];

  // Mini Chart data for preview
  const previewPieData = [
    { name: 'Organic Biogas', value: 45, color: '#059669' },
    { name: 'Recycled Polymers', value: 30, color: '#10B981' },
    { name: 'Compost Fertilizer', value: 20, color: '#D97706' },
    { name: 'Residual', value: mode === 'reloop' ? 5 : 45, color: '#94A3B8' },
  ];

  const forecastData = [
    { time: '06:00', actual: 4.2, predicted: 4.4 },
    { time: '09:00', actual: 12.8, predicted: 12.5 },
    { time: '12:00', actual: 18.5, predicted: 19.0 },
    { time: '15:00', actual: 24.1, predicted: 23.8 },
    { time: '18:00', actual: 31.4, predicted: 30.9 },
    { time: '21:00', actual: 38.0, predicted: 38.5 },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] font-sans selection:bg-emerald-100 selection:text-emerald-950">
      
      {/* 1. Public Top Navigation */}
      <PublicNavbar />

      {/* ========================================================================= */}
      {/* SECTION 1: HERO (100vh, Full-Bleed) */}
      {/* ========================================================================= */}
      <section
        id="hero"
        className="relative min-h-[calc(100vh-5rem)] flex flex-col justify-between blueprint-grid pt-10 sm:pt-14 pb-12 overflow-hidden"
      >
        {/* Subtle ambient gradients */}
        <div className="absolute top-1/4 -left-40 w-96 h-96 bg-sage-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-0 w-96 h-96 bg-amberGold-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-[1280px] w-full mx-auto px-4 sm:px-6 lg:px-8 my-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              
              {/* Pill Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-charcoal-200/80 shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-bold text-navy-900 tracking-wide uppercase font-mono">
                  Smart Cities & Circular Economy Pilot · Pune 2026
                </span>
              </div>

              {/* Huge Headline (Outfit 56-72px) */}
              <h1 className="website-hero-title text-navy-900">
                Cities are losing value in their own{' '}
                <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-amberGold-600 bg-clip-text text-transparent">
                  waste.
                </span>
              </h1>

              {/* Sub-line (max 20 words) */}
              <p className="website-body-lg text-charcoal-600 max-w-xl mx-auto lg:mx-0">
                Turn daily municipal waste streams into profitable clean energy, circular commodities, and automated zero-landfill operations.
              </p>

              {/* Two CTA Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5">
                <Link
                  to="/app/dashboard"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-2xl bg-navy-900 hover:bg-navy-950 text-white font-bold text-base shadow-xl shadow-navy-900/25 hover:shadow-2xl hover:shadow-navy-900/35 hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer ring-1 ring-white/20"
                >
                  <Sparkles className="w-5 h-5 text-emerald-400" />
                  <span>Launch Live Demo</span>
                  <ArrowRight className="w-5 h-5 text-white/80" />
                </Link>

                <button
                  type="button"
                  onClick={() => {
                    startGuidedTour();
                    navigate('/app/dashboard');
                  }}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-white hover:bg-charcoal-50 text-navy-900 font-bold text-base border border-charcoal-300 hover:border-navy-400 shadow-xs hover:shadow-md transition-all cursor-pointer"
                >
                  <Play className="w-4 h-4 text-emerald-600 fill-emerald-600" />
                  <span>Watch the 2-min tour</span>
                </button>
              </div>

              {/* Pilot Credential Trust line */}
              <p className="text-xs text-charcoal-500 font-medium pt-1">
                Calibrated to Pune Municipal Pilot Data · Zero backend required · Deterministic simulation
              </p>
            </div>

            {/* Right Column: Isometric City Loop Illustration */}
            <div className="lg:col-span-5 flex justify-center items-center">
              <IsometricCityLoop size={520} />
            </div>

          </div>
        </div>

        {/* Floating Stat Strip (Glassmorphism, count-up animation) */}
        <div className="max-w-[1200px] w-full mx-auto px-4 sm:px-6 lg:px-8 mt-10">
          <div
            ref={diversionStat.ref}
            className="w-full rounded-2xl bg-white/80 backdrop-blur-md border border-charcoal-200/80 shadow-blueprint-lg p-5 sm:p-6"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center divide-y md:divide-y-0 md:divide-x divide-charcoal-200/60">
              
              <div className="pt-2 md:pt-0">
                <span className="text-xs font-bold uppercase tracking-wider text-charcoal-500 block mb-1">
                  Landfill Diversion
                </span>
                <span className="text-3xl sm:text-4xl font-extrabold text-emerald-600 font-heading tracking-tight">
                  {diversionStat.formatted}
                </span>
                <span className="text-xs text-charcoal-500 block mt-1">vs 28% baseline</span>
              </div>

              <div className="pt-2 md:pt-0">
                <span className="text-xs font-bold uppercase tracking-wider text-charcoal-500 block mb-1">
                  Fleet Distance
                </span>
                <span className="text-3xl sm:text-4xl font-extrabold text-navy-900 font-heading tracking-tight">
                  {distanceStat.formatted}
                </span>
                <span className="text-xs text-charcoal-500 block mt-1">fuel & emissions cut</span>
              </div>

              <div className="pt-4 md:pt-0">
                <span className="text-xs font-bold uppercase tracking-wider text-charcoal-500 block mb-1">
                  Clean Energy Generated
                </span>
                <span className="text-3xl sm:text-4xl font-extrabold text-amberGold-600 font-heading tracking-tight">
                  {energyStat.formatted}
                </span>
                <span className="text-xs text-charcoal-500 block mt-1">renewable biomethane</span>
              </div>

              <div className="pt-4 md:pt-0">
                <span className="text-xs font-bold uppercase tracking-wider text-charcoal-500 block mb-1">
                  Circular Value Created
                </span>
                <span className="text-3xl sm:text-4xl font-extrabold text-navy-900 font-heading tracking-tight">
                  {revenueStat.formatted}
                </span>
                <span className="text-xs text-charcoal-500 block mt-1">recycled commodities</span>
              </div>

            </div>
          </div>
        </div>

      </section>

      {/* ========================================================================= */}
      {/* SECTION 2: PROBLEM (Dark Navy Section #0A1E35) */}
      {/* ========================================================================= */}
      <section
        id="problem"
        className="w-full bg-navy-950 text-white py-24 sm:py-32 blueprint-grid-dark relative overflow-hidden"
      >
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          
          {/* Section Header */}
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold tracking-wider uppercase text-amberGold-400 font-mono">
              The Urban Bottleneck
            </span>
            <h2 className="website-section-title text-white">
              The linear waste crisis is broken.
            </h2>
            <p className="text-charcoal-300 text-base max-w-xl mx-auto">
              Unsorted municipal streams bury municipal budgets and valuable materials in overflowing open dump yards.
            </p>
          </div>

          {/* 4 Connected Steps That Light Up */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            
            {/* Step 1 */}
            <div className="p-6 rounded-2xl bg-navy-900/90 border border-navy-700/80 shadow-lg space-y-4 hover:border-red-400/60 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-red-500/10 text-red-400 flex items-center justify-center font-bold text-lg font-mono">
                01
              </div>
              <h3 className="font-bold text-lg text-white group-hover:text-red-300 transition-colors">
                Mixed waste at source
              </h3>
              <p className="text-xs text-charcoal-300 leading-relaxed">
                Households and commercial units commingle recyclables with wet organic food tailings.
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-6 rounded-2xl bg-navy-900/90 border border-navy-700/80 shadow-lg space-y-4 hover:border-amberGold-400/60 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-amberGold-500/10 text-amberGold-400 flex items-center justify-center font-bold text-lg font-mono">
                02
              </div>
              <h3 className="font-bold text-lg text-white group-hover:text-amberGold-300 transition-colors">
                Zero sorting intelligence
              </h3>
              <p className="text-xs text-charcoal-300 leading-relaxed">
                Collection trucks run blind fixed schedules without IoT bin fullness telemetry.
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-6 rounded-2xl bg-navy-900/90 border border-navy-700/80 shadow-lg space-y-4 hover:border-amberGold-400/60 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-amberGold-500/10 text-amberGold-400 flex items-center justify-center font-bold text-lg font-mono">
                03
              </div>
              <h3 className="font-bold text-lg text-white group-hover:text-amberGold-300 transition-colors">
                Lost circular economic value
              </h3>
              <p className="text-xs text-charcoal-300 leading-relaxed">
                Valuable polymers, bio-fertilizer, and methane potential rot unmonetized in heaps.
              </p>
            </div>

            {/* Step 4 */}
            <div className="p-6 rounded-2xl bg-navy-900/90 border border-navy-700/80 shadow-lg space-y-4 hover:border-red-400/60 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-red-500/10 text-red-400 flex items-center justify-center font-bold text-lg font-mono">
                04
              </div>
              <h3 className="font-bold text-lg text-white group-hover:text-red-300 transition-colors">
                Catastrophic landfill overload
              </h3>
              <p className="text-xs text-charcoal-300 leading-relaxed">
                72% of total city waste ends dumped, causing fires, groundwater leaching, and emissions.
              </p>
            </div>

          </div>

          {/* Solution Conduit Pill */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-950 via-navy-900 to-teal-950 border border-emerald-800/80 text-center max-w-3xl mx-auto space-y-2">
            <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider block">
              ReLoop Municipal Breakthrough
            </span>
            <p className="text-base text-white font-medium">
              We replace linear disposal with a closed 7-step circular intelligence loop.
            </p>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 3: HOW IT WORKS (Sticky Loop Diagram with 7 Steps) */}
      {/* ========================================================================= */}
      <section id="how-it-works" className="py-24 sm:py-32 bg-white relative">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold tracking-wider uppercase text-sage-600 font-mono">
              The 7-Step Architecture
            </span>
            <h2 className="website-section-title text-navy-900">
              The closed-loop municipal engine.
            </h2>
            <p className="text-charcoal-600 text-base">
              Autonomous telemetry transforms collected waste into clean megawatts and sorted commodity revenue.
            </p>
          </div>

          {/* Big Sticky Loop Diagram: Input -> Intelligence Engine -> Output */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left: 7 Interactive Steps Selector */}
            <div className="lg:col-span-5 space-y-2">
              <span className="text-xs font-mono font-bold uppercase text-charcoal-500 block mb-2 px-1">
                Select Step to Inspect Telemetry:
              </span>
              
              <div className="space-y-2">
                {loopSteps.map((step, idx) => {
                  const Icon = step.icon;
                  const isActive = activeLoopStep === idx;
                  return (
                    <button
                      key={step.step}
                      type="button"
                      onClick={() => setActiveLoopStep(idx)}
                      className={`w-full text-left p-3.5 rounded-2xl border transition-all flex items-center justify-between cursor-pointer focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-emerald-600 ${
                        isActive
                          ? 'bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-400 shadow-sm ring-1 ring-emerald-400/30'
                          : 'bg-white border-charcoal-200 hover:border-charcoal-300 hover:bg-charcoal-50/60'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
                            isActive ? 'bg-emerald-600 text-white' : 'bg-charcoal-100 text-charcoal-700'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="text-xs font-mono font-bold text-charcoal-500 block">
                            STEP {step.step}
                          </span>
                          <span className="font-bold text-sm text-navy-900">
                            {step.name} · {step.headline}
                          </span>
                        </div>
                      </div>

                      <ChevronRight className={`w-4 h-4 transition-transform ${isActive ? 'text-emerald-600 rotate-90' : 'text-charcoal-400'}`} />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right: Dynamic Swapping Visual for Selected Step */}
            <div className="lg:col-span-7 sticky top-28 bg-[#F8FAFC] border border-charcoal-200 rounded-3xl p-6 sm:p-8 shadow-blueprint-lg space-y-6">
              
              <div className="flex items-center justify-between border-b border-charcoal-200 pb-4">
                <div>
                  <span className="text-xs font-mono font-bold text-emerald-600 uppercase">
                    Step {loopSteps[activeLoopStep].step} of 7
                  </span>
                  <h3 className="text-2xl font-extrabold text-navy-900 font-heading">
                    {loopSteps[activeLoopStep].name}: {loopSteps[activeLoopStep].headline}
                  </h3>
                </div>
                <Link
                  to="/app/dashboard"
                  className="text-xs font-bold text-navy-800 hover:text-emerald-600 flex items-center gap-1"
                >
                  <span>Open live in App</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <p className="text-charcoal-600 text-sm leading-relaxed">
                {loopSteps[activeLoopStep].desc}
              </p>

              {/* Mini visual container depending on step */}
              <div className="h-64 rounded-2xl bg-white border border-charcoal-200 p-4 flex items-center justify-center overflow-hidden relative">
                {activeLoopStep === 0 && (
                  <div className="w-full h-full flex items-center justify-center p-2">
                    <SmartBinIllustration className="max-h-56" />
                  </div>
                )}
                {activeLoopStep === 1 && (
                  <div className="w-full h-full p-2 flex flex-col justify-center">
                    <span className="text-xs font-mono text-charcoal-500 block mb-2 text-center">Ward Generation Forecast vs Actual (Tonnes)</span>
                    <ResponsiveContainer width="100%" height={170}>
                      <AreaChart data={forecastData}>
                        <Area type="monotone" dataKey="predicted" stroke="#10B981" fill="#D1FAE5" />
                        <Area type="monotone" dataKey="actual" stroke="#0F3E6D" fill="#E1EDF7" />
                        <RechartsTooltip />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                )}
                {activeLoopStep === 2 && (
                  <div className="w-full h-full flex items-center justify-center p-2">
                    <TruckRouteIllustration className="max-h-56" />
                  </div>
                )}
                {activeLoopStep === 3 && (
                  <div className="w-full h-full flex items-center justify-center p-2">
                    <VisionSortingIllustration className="max-h-56" />
                  </div>
                )}
                {activeLoopStep >= 4 && (
                  <div className="text-center space-y-3 p-4">
                    <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                      <Zap className="w-7 h-7" />
                    </div>
                    <div>
                      <h4 className="font-bold text-navy-900 text-sm">Dynamic Stream Allocation & Dispatch</h4>
                      <p className="text-xs text-charcoal-500 max-w-xs mx-auto mt-1">
                        Automated routing sends wet organic to biomethane digestion and clean polymers to MRF balers.
                      </p>
                    </div>
                    <span className="inline-block px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-mono text-xs font-bold">
                      100% Client-Side Simulated
                    </span>
                  </div>
                )}
              </div>

              {/* Loop Step Mini Navigation Bar */}
              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  disabled={activeLoopStep === 0}
                  onClick={() => setActiveLoopStep((prev) => Math.max(0, prev - 1))}
                  className="px-3.5 py-1.5 rounded-xl border border-charcoal-200 text-xs font-bold text-charcoal-700 disabled:opacity-40"
                >
                  ← Previous Step
                </button>
                <button
                  type="button"
                  disabled={activeLoopStep === 6}
                  onClick={() => setActiveLoopStep((prev) => Math.min(6, prev + 1))}
                  className="px-3.5 py-1.5 rounded-xl bg-navy-900 text-white text-xs font-bold disabled:opacity-40"
                >
                  Next Step →
                </button>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 4: LIVE PRODUCT PREVIEW (macOS Window Frame) */}
      {/* ========================================================================= */}
      <section id="preview" className="py-24 sm:py-32 bg-[#F8FAFC] border-t border-charcoal-200">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold tracking-wider uppercase text-emerald-600 font-mono">
              Live In-Browser Simulation
            </span>
            <h2 className="website-section-title text-navy-900">
              Interactive municipal dashboard.
            </h2>
            <p className="text-charcoal-600 text-base">
              A real simulation engine ticking right now. Toggle between baseline status-quo and ReLoop circular loop.
            </p>
          </div>

          {/* Browser Window Frame */}
          <div className="rounded-3xl bg-white border border-charcoal-300 shadow-2xl overflow-hidden ring-1 ring-charcoal-900/5">
            
            {/* macOS Window Chrome Header */}
            <div className="bg-charcoal-100 border-b border-charcoal-200 px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-400 inline-block" />
                <span className="w-3 h-3 rounded-full bg-amber-400 inline-block" />
                <span className="w-3 h-3 rounded-full bg-emerald-400 inline-block" />
                <span className="text-xs font-mono text-charcoal-500 ml-2 hidden sm:inline">
                  reloop.city/pilot/pune/dashboard
                </span>
              </div>

              {/* Baseline vs ReLoop Mode Toggle inside preview */}
              <div className="flex items-center gap-2 bg-white px-2 py-1 rounded-xl border border-charcoal-200 shadow-2xs">
                <span className="text-xs font-bold text-charcoal-600 hidden sm:inline">Mode:</span>
                <button
                  type="button"
                  onClick={() => setMode('baseline')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                    mode === 'baseline' ? 'bg-navy-900 text-white' : 'text-charcoal-600 hover:text-navy-900'
                  }`}
                >
                  Baseline
                </button>
                <button
                  type="button"
                  onClick={() => setMode('reloop')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                    mode === 'reloop' ? 'bg-emerald-600 text-white' : 'text-charcoal-600 hover:text-navy-900'
                  }`}
                >
                  ReLoop AI
                </button>
              </div>
            </div>

            {/* Inner Real Dashboard Surface */}
            <div className="p-6 sm:p-8 space-y-6 bg-white">
              
              {/* Top 3 Live Ticking KPIs */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                
                <div className="p-5 rounded-2xl bg-[#F8FAFC] border border-charcoal-200">
                  <span className="text-xs font-bold uppercase tracking-wider text-charcoal-500 block mb-1">
                    Landfill Diversion Rate
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-extrabold text-emerald-600 font-heading">
                      {mode === 'reloop' ? '95.2%' : '28.4%'}
                    </span>
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                      {mode === 'reloop' ? '+66.8% gain' : 'Standard'}
                    </span>
                  </div>
                  <span className="text-xs text-charcoal-400 mt-1 block">Live simulation ticker</span>
                </div>

                <div className="p-5 rounded-2xl bg-[#F8FAFC] border border-charcoal-200">
                  <span className="text-xs font-bold uppercase tracking-wider text-charcoal-500 block mb-1">
                    Clean Energy Yield
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-extrabold text-amberGold-600 font-heading">
                      {mode === 'reloop' ? `${simState.reloopCumulative.energyGeneratedMwh.toFixed(1)} MWh` : '0 MWh'}
                    </span>
                    <span className="text-xs font-bold text-amberGold-800 bg-amberGold-100 px-2 py-0.5 rounded">
                      Bio-CHP
                    </span>
                  </div>
                  <span className="text-xs text-charcoal-400 mt-1 block">From organic digestate</span>
                </div>

                <div className="p-5 rounded-2xl bg-[#F8FAFC] border border-charcoal-200">
                  <span className="text-xs font-bold uppercase tracking-wider text-charcoal-500 block mb-1">
                    Net Commodity Revenue
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-extrabold text-navy-900 font-heading">
                      {mode === 'reloop' ? `₹${(simState.reloopCumulative.revenueGeneratedInr / 100000).toFixed(1)}L` : '₹0'}
                    </span>
                    <span className="text-xs font-bold text-navy-800 bg-navy-100 px-2 py-0.5 rounded">
                      Daily settled
                    </span>
                  </div>
                  <span className="text-xs text-charcoal-400 mt-1 block">Polymers + Compost + Power</span>
                </div>

              </div>

              {/* Mini Chart Grid inside Window */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                
                {/* Donut Allocation */}
                <div className="p-5 rounded-2xl border border-charcoal-200 bg-[#F8FAFC] space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-sm text-navy-900">Material Stream Allocation</h4>
                    <span className="text-xs font-mono text-emerald-600 font-bold">Pune Pilot</span>
                  </div>
                  <div className="h-44 flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={previewPieData}
                          innerRadius={50}
                          outerRadius={75}
                          paddingAngle={3}
                          dataKey="value"
                        >
                          {previewPieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <RechartsTooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Live Controls & Prompt to open full dashboard */}
                <div className="p-6 rounded-2xl border border-charcoal-200 bg-gradient-to-br from-navy-900 to-navy-950 text-white flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                      Day {simState.currentDay} · Hour {String(simState.currentHour).padStart(2, '0')}:00
                    </div>
                    <h4 className="text-lg font-bold text-white font-heading">
                      Want to inspect all 9 operational screens?
                    </h4>
                    <p className="text-xs text-charcoal-300 leading-relaxed">
                      Access the full Leaflet IoT live bin map, dynamic truck dispatch solver, AI vision classifier, and technical assumptions.
                    </p>
                  </div>

                  <Link
                    to="/app/dashboard"
                    className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-md transition-all cursor-pointer"
                  >
                    <span>Open the Full Dashboard</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>

              </div>

            </div>

          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 5: AI IN ACTION (3 Alternating Feature Blocks) */}
      {/* ========================================================================= */}
      <section id="ai-in-action" className="py-24 sm:py-32 bg-white">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 space-y-24">
          
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold tracking-wider uppercase text-emerald-600 font-mono">
              Machine Learning Suite
            </span>
            <h2 className="website-section-title text-navy-900">
              Precision AI at municipal scale.
            </h2>
            <p className="text-charcoal-600 text-base">
              Three core neural engines working synchronously across waste collection and recovery.
            </p>
          </div>

          {/* Block 1: Smart Routes (Left Visual, Right Text) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-6 p-4 rounded-3xl bg-[#F8FAFC] border border-charcoal-200 shadow-md">
              <TruckRouteIllustration className="max-h-72" />
            </div>
            <div className="lg:col-span-6 space-y-4">
              <span className="text-xs font-mono font-bold uppercase text-emerald-600 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200">
                Engine 1 · Route Optimization
              </span>
              <h3 className="text-3xl font-extrabold text-navy-900 font-heading">
                Dynamic route dispatch.
              </h3>
              <p className="text-charcoal-600 text-sm leading-relaxed">
                Traditional trucks waste 30% of diesel driving to half-empty bins on rigid timetables. ReLoop's heuristic dynamic solver re-calculates optimal vehicle journeys every hour.
              </p>
              <ul className="space-y-2 text-xs font-semibold text-charcoal-700">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>32% reduction in fleet diesel distance</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Prioritizes overflowing bins before odor thresholds</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Block 2: AI Waste Sorting (Right Visual, Left Text) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-6 space-y-4 order-2 lg:order-1">
              <span className="text-xs font-mono font-bold uppercase text-emerald-600 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200">
                Engine 2 · Computer Vision
              </span>
              <h3 className="text-3xl font-extrabold text-navy-900 font-heading">
                Conveyor optical sorting.
              </h3>
              <p className="text-charcoal-600 text-sm leading-relaxed">
                Edge camera models classify incoming municipal stream items in 15 milliseconds, detecting polymer grades (PET, HDPE, PP) and triggering air-jet pneumatic separation.
              </p>
              <ul className="space-y-2 text-xs font-semibold text-charcoal-700">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>98.4% detection accuracy for clear polymers</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Replaces hazardous manual picking on MRF belts</span>
                </li>
              </ul>
            </div>
            <div className="lg:col-span-6 p-4 rounded-3xl bg-[#F8FAFC] border border-charcoal-200 shadow-md order-1 lg:order-2">
              <VisionSortingIllustration className="max-h-72" />
            </div>
          </div>

          {/* Block 3: Waste Forecast (Left Visual, Right Text) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-6 p-6 rounded-3xl bg-[#F8FAFC] border border-charcoal-200 shadow-md">
              <span className="text-xs font-mono text-charcoal-500 block mb-3 text-center">
                Temporal LSTM Tonnage Model (Hourly City Generation)
              </span>
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={forecastData}>
                  <Area type="monotone" dataKey="actual" stroke="#059669" fill="#10B981" fillOpacity={0.2} />
                  <Area type="monotone" dataKey="predicted" stroke="#0F3E6D" fill="#C2DCF0" fillOpacity={0.2} />
                  <RechartsTooltip />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="lg:col-span-6 space-y-4">
              <span className="text-xs font-mono font-bold uppercase text-emerald-600 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200">
                Engine 3 · Predictive Modeling
              </span>
              <h3 className="text-3xl font-extrabold text-navy-900 font-heading">
                Hyper-local waste forecasting.
              </h3>
              <p className="text-charcoal-600 text-sm leading-relaxed">
                Predicts generation surges 24 hours ahead by correlating festival calendars, vegetable market days, and population density across pilot city zones.
              </p>
              <ul className="space-y-2 text-xs font-semibold text-charcoal-700">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Accurate buffer allocation for digestion tanks</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Eliminates collection backlogs during weekend peaks</span>
                </li>
              </ul>
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 6: IMPACT (Bento Grid Across 5 Pillars) */}
      {/* ========================================================================= */}
      <section id="impact" className="py-24 sm:py-32 bg-[#F8FAFC] border-t border-charcoal-200">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold tracking-wider uppercase text-emerald-600 font-mono">
              Municipal Returns
            </span>
            <h2 className="website-section-title text-navy-900">
              Impact across five urban pillars.
            </h2>
            <p className="text-charcoal-600 text-base">
              Tangible economic, climate, and infrastructural benchmarks for smart cities.
            </p>
          </div>

          {/* Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-5">
            
            {/* Bento Card 1: Environment (Large 2-col) */}
            <div className="md:col-span-2 p-7 rounded-3xl bg-gradient-to-br from-emerald-900 to-navy-900 text-white shadow-xl flex flex-col justify-between space-y-6">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <Leaf className="w-6 h-6" />
                </div>
                <span className="text-xs font-mono font-bold uppercase text-emerald-300 bg-emerald-950/80 px-3 py-1 rounded-full border border-emerald-800">
                  Pillar 1 · Climate
                </span>
              </div>
              <div className="space-y-2">
                <span className="text-4xl sm:text-5xl font-extrabold font-heading text-emerald-300">
                  95.2%
                </span>
                <h4 className="text-xl font-bold text-white">Methane emissions eliminated at source.</h4>
                <p className="text-xs text-charcoal-300 max-w-md">
                  Diverting wet organic mass avoids uncontrolled anaerobic degradation in city landfills.
                </p>
              </div>
            </div>

            {/* Bento Card 2: Clean Energy */}
            <div className="p-7 rounded-3xl bg-white border border-charcoal-200 shadow-blueprint flex flex-col justify-between space-y-6">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-amberGold-100 text-amberGold-600 flex items-center justify-center">
                  <Zap className="w-6 h-6" />
                </div>
                <span className="text-xs font-mono font-bold text-charcoal-500">Pillar 2</span>
              </div>
              <div className="space-y-1">
                <span className="text-3xl sm:text-4xl font-extrabold font-heading text-amberGold-600">
                  71 MWh
                </span>
                <h4 className="font-bold text-navy-900 text-base">Renewable grid power.</h4>
                <p className="text-xs text-charcoal-500">Biomethane feeds municipal turbines.</p>
              </div>
            </div>

            {/* Bento Card 3: Construction Aggregates */}
            <div className="p-7 rounded-3xl bg-white border border-charcoal-200 shadow-blueprint flex flex-col justify-between space-y-6">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-charcoal-100 text-charcoal-700 flex items-center justify-center">
                  <HardHat className="w-6 h-6" />
                </div>
                <span className="text-xs font-mono font-bold text-charcoal-500">Pillar 3</span>
              </div>
              <div className="space-y-1">
                <span className="text-3xl sm:text-4xl font-extrabold font-heading text-navy-900">
                  1,250 t
                </span>
                <h4 className="font-bold text-navy-900 text-base">Recycled inert tailings.</h4>
                <p className="text-xs text-charcoal-500">Used for municipal road paver base.</p>
              </div>
            </div>

            {/* Bento Card 4: Smart Cities Telemetry */}
            <div className="p-7 rounded-3xl bg-white border border-charcoal-200 shadow-blueprint flex flex-col justify-between space-y-6">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-navy-100 text-navy-700 flex items-center justify-center">
                  <Cpu className="w-6 h-6" />
                </div>
                <span className="text-xs font-mono font-bold text-charcoal-500">Pillar 4</span>
              </div>
              <div className="space-y-1">
                <span className="text-3xl sm:text-4xl font-extrabold font-heading text-navy-900">
                  -32%
                </span>
                <h4 className="font-bold text-navy-900 text-base">Automated smart fleet.</h4>
                <p className="text-xs text-charcoal-500">Telemetry replaces static timetables.</p>
              </div>
            </div>

            {/* Bento Card 5: Local Economy (Wide 3-col) */}
            <div className="md:col-span-3 p-7 rounded-3xl bg-gradient-to-r from-navy-900 via-navy-800 to-navy-900 text-white shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div className="space-y-2 max-w-lg">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-xl bg-amberGold-400/20 text-amberGold-300 flex items-center justify-center">
                    <Coins className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-mono font-bold uppercase text-amberGold-400">
                    Pillar 5 · Local Economy
                  </span>
                </div>
                <h4 className="text-xl font-bold text-white">
                  High-grade commodities and bio-fertilizer sold directly.
                </h4>
                <p className="text-xs text-charcoal-300">
                  Creates formal circular economy employment and replaces synthetic chemical soil fertilizers.
                </p>
              </div>
              <div className="text-left sm:text-right flex-shrink-0">
                <span className="text-4xl sm:text-5xl font-extrabold font-heading text-amberGold-400 block">
                  ₹34.2L
                </span>
                <span className="text-xs text-charcoal-400 font-mono">Monthly circular revenue potential</span>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 7: REVENUE (Horizontal Flow + 6 Revenue Chips) */}
      {/* ========================================================================= */}
      <section id="revenue" className="py-24 sm:py-32 bg-white">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold tracking-wider uppercase text-emerald-600 font-mono">
              Economic Engine
            </span>
            <h2 className="website-section-title text-navy-900">
              Disposal liability into profitable revenue.
            </h2>
            <p className="text-charcoal-600 text-base">
              A transparent horizontal monetization chain transforming municipal waste budgets from cost centers into profit centers.
            </p>
          </div>

          {/* Horizontal Chain: Waste collected -> Processed -> Sold -> REVENUE */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 relative">
            <div className="p-6 rounded-2xl bg-[#F8FAFC] border border-charcoal-200 text-center space-y-2">
              <span className="text-xs font-mono font-bold text-charcoal-500">STAGE 1</span>
              <h4 className="font-bold text-base text-navy-900">Waste Collected</h4>
              <p className="text-xs text-charcoal-500">Smart bins & dynamic truck routes</p>
            </div>
            <div className="p-6 rounded-2xl bg-[#F8FAFC] border border-charcoal-200 text-center space-y-2">
              <span className="text-xs font-mono font-bold text-charcoal-500">STAGE 2</span>
              <h4 className="font-bold text-base text-navy-900">AI Processed</h4>
              <p className="text-xs text-charcoal-500">Vision sorting & anaerobic digestion</p>
            </div>
            <div className="p-6 rounded-2xl bg-[#F8FAFC] border border-charcoal-200 text-center space-y-2">
              <span className="text-xs font-mono font-bold text-charcoal-500">STAGE 3</span>
              <h4 className="font-bold text-base text-navy-900">Commodities Sold</h4>
              <p className="text-xs text-charcoal-500">Industrial contracts & power grid PPA</p>
            </div>
            <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-center space-y-2 shadow-lg">
              <span className="text-xs font-mono font-bold text-emerald-100">STAGE 4</span>
              <h4 className="font-bold text-base text-white">CIRCULAR REVENUE</h4>
              <p className="text-xs text-emerald-100">Settled to municipal treasury</p>
            </div>
          </div>

          {/* 6 Animated Revenue Chips */}
          <div className="space-y-4">
            <span className="text-xs font-mono font-bold uppercase text-charcoal-500 block text-center">
              Active Municipal Revenue Streams:
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {[
                { name: 'rPET / Polymers', rate: '₹38,000 / t', icon: '♻️' },
                { name: 'Grid Electricity', rate: '₹6.5 / kWh', icon: '⚡' },
                { name: 'City Compost', rate: '₹3,200 / t', icon: '🌱' },
                { name: 'EPR Plastic Credits', rate: '₹4,500 / t', icon: '📜' },
                { name: 'Bio-Methane (CBG)', rate: '₹46 / kg', icon: '🔥' },
                { name: 'Tailings (RDF)', rate: '₹1,800 / t', icon: '🏭' },
              ].map((chip) => (
                <div
                  key={chip.name}
                  className="p-3.5 rounded-xl border border-charcoal-200 bg-[#F8FAFC] hover:border-emerald-400 hover:bg-emerald-50/30 transition-all text-center space-y-1 shadow-2xs"
                >
                  <span className="text-xl block">{chip.icon}</span>
                  <span className="font-bold text-xs text-navy-900 block truncate">{chip.name}</span>
                  <span className="text-[11px] font-mono font-bold text-emerald-700 block">{chip.rate}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 8: ROADMAP (Horizontal Stepped Timeline) */}
      {/* ========================================================================= */}
      <section id="roadmap" className="py-24 sm:py-32 bg-[#F8FAFC] border-t border-charcoal-200">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold tracking-wider uppercase text-emerald-600 font-mono">
              Scale Architecture
            </span>
            <h2 className="website-section-title text-navy-900">
              From pilot facility to citywide network.
            </h2>
            <p className="text-charcoal-600 text-base">
              A 5-phase municipal scaling blueprint engineered for high-density metropolitan deployments.
            </p>
          </div>

          {/* Stepped Timeline */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
            {[
              {
                phase: 'Phase 1',
                title: 'Single MRF Pilot',
                status: 'Current Benchmark',
                desc: 'PCCOE PCMC Zone A. 60 Smart bins & initial sorting line.',
                active: true,
              },
              {
                phase: 'Phase 2',
                title: 'Multi-Facility Network',
                status: 'Q3 2026',
                desc: 'Zones A, B, C connected to central anaerobic digester.',
                active: false,
              },
              {
                phase: 'Phase 3',
                title: 'Waste-to-Energy Grid',
                status: 'Q1 2027',
                desc: 'Biomethane combined heat & power direct grid feed-in.',
                active: false,
              },
              {
                phase: 'Phase 4',
                title: 'Cross-City Exchange',
                status: 'Q4 2027',
                desc: 'B2B marketplace for recycled flakes and verified EPR credits.',
                active: false,
              },
              {
                phase: 'Phase 5',
                title: 'Pan-India Platform',
                status: '2028',
                desc: 'Standardized municipal circular operating system for tier 1-2 cities.',
                active: false,
              },
            ].map((step, idx) => (
              <div
                key={step.phase}
                className={`p-5 rounded-2xl border transition-all space-y-3 ${
                  step.active
                    ? 'bg-white border-emerald-500 shadow-md ring-2 ring-emerald-500/20'
                    : 'bg-white/60 border-charcoal-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-emerald-600">{step.phase}</span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      step.active ? 'bg-emerald-100 text-emerald-800' : 'bg-charcoal-100 text-charcoal-600'
                    }`}
                  >
                    {step.status}
                  </span>
                </div>
                <h4 className="font-bold text-sm text-navy-900">{step.title}</h4>
                <p className="text-xs text-charcoal-500 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 9: FINAL CTA (Full-Width Navy Band) */}
      {/* ========================================================================= */}
      <section className="w-full bg-gradient-to-r from-navy-950 via-navy-900 to-navy-950 text-white py-24 sm:py-32 relative overflow-hidden">
        
        {/* Subtle decorative loop watermark */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/3 w-[600px] h-[600px] opacity-10 pointer-events-none">
          <IsometricCityLoop size={600} />
        </div>

        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-8">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 text-emerald-300 border border-white/10 text-xs font-mono">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>Ready to Test in Your Browser</span>
          </div>

          <h2 className="website-section-title text-white max-w-3xl mx-auto leading-tight">
            We don't just collect waste.{' '}
            <span className="text-emerald-400">We complete the loop.</span>
          </h2>

          <p className="text-charcoal-300 text-base max-w-xl mx-auto">
            Experience the full client-side simulation calibrated for Pune's municipal pilot. No setup or login required.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/app/dashboard"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-navy-950 font-extrabold text-base shadow-xl shadow-emerald-500/25 hover:shadow-2xl hover:shadow-emerald-500/35 hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
            >
              <span>Launch Live Demo</span>
              <ArrowRight className="w-5 h-5" />
            </Link>

            <button
              type="button"
              onClick={() => {
                startGuidedTour();
                navigate('/app/dashboard');
              }}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-bold text-base border border-white/20 transition-all cursor-pointer"
            >
              <Play className="w-4 h-4 text-emerald-400 fill-emerald-400" />
              <span>Watch the 2-min tour</span>
            </button>
          </div>

        </div>
      </section>

      {/* Real Public Footer */}
      <PublicFooter />

    </div>
  );
};
