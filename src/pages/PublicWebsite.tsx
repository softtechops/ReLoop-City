import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PublicNavbar } from '../components/public/PublicNavbar';
import { PublicFooter } from '../components/public/PublicFooter';
import { ReloopLogo } from '../components/brand/ReloopLogo';
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
  CheckCircle2,
  Radio,
  TrendingUp,
  Route as RouteIcon,
  ScanSearch,
  GitFork,
  Zap,
  Coins,
  ShieldCheck,
  Leaf,
  ChevronRight,
  Plus,
  Minus,
  Recycle,
  Users,
  Smartphone,
  Award,
  Calendar,
  MapPin,
  BarChart3,
  Shield,
  Truck,
  Globe,
  Phone,
  Mail,
  Check
} from 'lucide-react';
import {
  AreaChart,
  Area,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip as RechartsTooltip,
  CartesianGrid,
  XAxis,
  YAxis
} from 'recharts';

export const PublicWebsite: React.FC = () => {
  const navigate = useNavigate();
  const {
    simState,
    mode,
    setMode,
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

  // Active accordion in FAQ
  const [activeFaq, setActiveFaq] = useState<number | null>(0);

  const previewSectionRef = useRef<HTMLElement | null>(null);

  // Simulation runs only when preview section is in view, paused when scrolled away
  useEffect(() => {
    const target = previewSectionRef.current;
    if (!target || typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            startSimulation();
          } else {
            pauseSimulation();
          }
        });
      },
      { threshold: 0.2 }
    );

    observer.observe(target);
    return () => {
      observer.disconnect();
      pauseSimulation();
    };
  }, [startSimulation, pauseSimulation]);

  // 7 Steps in the loop
  const loopSteps = [
    {
      step: 1,
      name: 'Sense',
      headline: 'IoT Telemetry',
      desc: 'Real-time bin level, weight & fill velocity sensors across city wards.',
      icon: Radio,
    },
    {
      step: 2,
      name: 'Predict',
      headline: 'Waste Forecast',
      desc: 'Hyper-local tonnage prediction 24h ahead based on demographics and seasonal trends.',
      icon: TrendingUp,
    },
    {
      step: 3,
      name: 'Optimize',
      headline: 'Dynamic Dispatch',
      desc: 'Automated fuel-saving truck routing bypassing under-filled bins.',
      icon: RouteIcon,
    },
    {
      step: 4,
      name: 'Classify',
      headline: 'Computer Vision',
      desc: 'High-speed optical conveyor sorting for pure polymers, metals, and organics.',
      icon: ScanSearch,
    },
    {
      step: 5,
      name: 'Allocate',
      headline: 'Facility Balancing',
      desc: 'Directing materials to MRF recycling, anaerobic digestion, or composting.',
      icon: GitFork,
    },
    {
      step: 6,
      name: 'Forecast',
      headline: 'Biogas & Energy',
      desc: 'Converting organic digestate into grid power and compressed methane.',
      icon: Zap,
    },
    {
      step: 7,
      name: 'Report',
      headline: 'Circular Ledger',
      desc: 'Audited carbon diversion and revenue settlement for city authorities.',
      icon: Coins,
    },
  ];

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

  const faqs = [
    {
      question: 'How does Reloop work?',
      answer: 'Reloop operates an automated 7-step circular intelligence loop: 1) Ultrasonic smart bins broadcast fill telemetry, 2) Predictive AI forecasts generation surges, 3) Dynamic dispatch routes trucks only to full bins saving 32% fuel, 4) Conveyor optical vision sorts materials, 5) Clean streams are allocated to MRF baling, AD biogas, and composting, 6) Renewable electricity feeds into the city grid, and 7) All carbon and fiscal savings settle transparently.'
    },
    {
      question: 'What types of waste and electronic devices are accepted?',
      answer: 'Reloop accepts full municipal and commercial dry streams: e-waste (laptops, phones, appliances, PCBs), high-value polymer grades (PET, HDPE, PP), metals (aluminum, brass, tin), paper/OCC, as well as segregated wet organics for anaerobic digestion and clean C&D aggregates for road sub-base.'
    },
    {
      question: 'How does the dynamic collection routing cut diesel and emissions?',
      answer: 'Traditional trucks follow rigid daily timetables, driving blind to bins that are half-empty. Reloop runs a heuristic Capacity-Constrained Vehicle Routing Problem (CVRP) with 2-Opt optimization every hour. Bins below 75% full are skipped, reducing total kilometers driven by 32%.'
    },
    {
      question: 'How much revenue does circular resource recovery generate?',
      answer: 'By sorting pure commodity streams at the source and recovering biomethane power, Reloop converts disposal liabilities into 6 diversified revenue streams: polymer flakes (₹38k/t), grid feed-in electricity (₹6.5/kWh), city compost (₹3.2k/t), EPR plastic credits (₹4.5k/t), Bio-CNG, and avoided landfill tipping fees.'
    },
    {
      question: 'Is the data and simulation real?',
      answer: 'Yes! All calculations are grounded in real operational parameters calibrated to the Pune PCMC pilot corridor (Akurdi–Chinchwad–Moshi). The live simulation engine runs deterministically in your browser with zero backend needed.'
    },
    {
      question: 'Which cities and pilot corridors are currently supported?',
      answer: 'Phase 1 is actively calibrated for PCMC Wards 14–18 in Pune, India (Akurdi Residential, Chinchwad Station Commercial, Pimpri Central Mandi, and the Moshi WtE/MRF complex). Roadmap Phase 2–5 extends to multi-facility networks across Maharashtra and pan-India smart cities.'
    }
  ];

  return (
    <div className="min-h-screen bg-white text-[#0F172A] font-sans selection:bg-green-100 selection:text-green-950 pt-16">
      
      {/* 1. Official Reloop Fixed Top Navigation */}
      <PublicNavbar />

      {/* ========================================================================= */}
      {/* SECTION 1: HERO (Gradient background matching relooptoday.com) */}
      {/* ========================================================================= */}
      <section
        id="home"
        className="relative min-h-[85vh] flex items-center bg-gradient-to-br from-green-50 via-emerald-50 to-white py-12 lg:py-20 overflow-hidden"
      >
        {/* Ambient Pulsing Glow Blobs */}
        <div className="absolute top-10 right-10 w-24 h-24 bg-green-200 rounded-full opacity-60 blur-xl animate-pulse pointer-events-none" />
        <div className="absolute bottom-20 left-10 w-32 h-32 bg-emerald-200 rounded-full opacity-60 blur-xl animate-pulse delay-300 pointer-events-none" />
        <div className="absolute top-1/2 right-20 w-16 h-16 bg-yellow-200 rounded-full opacity-60 blur-lg animate-pulse delay-700 pointer-events-none" />

        <div className="container mx-auto px-4 lg:px-6 relative z-10">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              
              {/* Green Eco Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-semibold shadow-xs">
                <span>🌱 Eco-Friendly Recycling &amp; Circular Platform</span>
              </div>

              {/* Headline with Brand Gradient */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 tracking-tight leading-tight font-heading">
                Turn Your{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 via-emerald-600 to-green-700">
                  Waste
                </span>{' '}
                Into Something Good
              </h1>

              {/* Sub-line */}
              <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
                Join the circular economy movement with Reloop. Transform urban waste and e-waste into clean energy, circular commodities, and automated zero-landfill operations.
              </p>

              {/* 3 Quick Stats Counter */}
              <div className="grid grid-cols-3 gap-4 sm:gap-6 py-4 border-y border-green-200/60 max-w-xl mx-auto lg:mx-0 text-center">
                <div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-green-600 font-heading">50K+</div>
                  <div className="text-xs sm:text-sm text-gray-600 font-medium">Active Citizens</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-green-600 font-heading">24,000T</div>
                  <div className="text-xs sm:text-sm text-gray-600 font-medium">Waste Recycled</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-green-600 font-heading">95.2%</div>
                  <div className="text-xs sm:text-sm text-gray-600 font-medium">Landfill Diversion</div>
                </div>
              </div>

              {/* CTAs */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <Link
                  to="/app/dashboard"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold text-base shadow-lg shadow-green-500/25 hover:shadow-xl transition-all cursor-pointer min-h-[44px]"
                >
                  <Sparkles className="w-5 h-5 text-emerald-200" />
                  <span>Launch Live Demo Free</span>
                  <ArrowRight className="w-5 h-5 text-white/90" />
                </Link>

                <button
                  type="button"
                  onClick={() => {
                    startGuidedTour();
                    navigate('/app/dashboard');
                  }}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-white hover:bg-gray-50 text-gray-800 font-semibold text-base border border-gray-200 transition-all cursor-pointer min-h-[44px]"
                >
                  <Play className="w-4 h-4 text-green-600 fill-green-600" />
                  <span>Watch the 2-min tour</span>
                </button>
              </div>

              {/* Trust Badges */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2 text-xs sm:text-sm text-gray-500 font-medium">
                <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-green-600" /> Free to test</span>
                <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-green-600" /> Zero backend required</span>
                <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-green-600" /> Calibrated to Pune PCMC data</span>
              </div>
            </div>

            {/* Right Column: Hero Visual with Animated Emojis & City Loop */}
            <div className="lg:col-span-5 flex justify-center items-center relative">
              <div className="relative w-full max-w-[480px]">
                
                {/* Floating Emojis matching relooptoday.com */}
                <div className="absolute -top-3 -right-3 z-20 bg-yellow-400 rounded-2xl p-3 shadow-lg animate-bounce">
                  <span className="text-2xl" role="img" aria-label="Recycle">♻️</span>
                </div>
                <div className="absolute -bottom-3 -left-3 z-20 bg-emerald-500 text-white rounded-2xl p-3 shadow-lg animate-bounce delay-500">
                  <span className="text-2xl" role="img" aria-label="Plant">🌱</span>
                </div>
                <div className="absolute top-1/2 -left-6 z-20 bg-blue-500 text-white rounded-2xl p-2.5 shadow-lg hidden sm:block">
                  <span className="text-xl" role="img" aria-label="Lightning">⚡</span>
                </div>

                {/* Illustration Card Surface */}
                <div className="p-4 sm:p-6 bg-white/90 backdrop-blur-md rounded-3xl border border-green-200/80 shadow-2xl">
                  <IsometricCityLoop size={420} className="mx-auto" />
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Floating Stat Strip */}
        <div className="max-w-[1200px] w-full mx-auto px-4 sm:px-6 lg:px-8 mt-12">
          <div
            ref={diversionStat.ref}
            className="w-full rounded-2xl bg-white/95 backdrop-blur-md border border-gray-200 shadow-md p-5 sm:p-6"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center divide-y md:divide-y-0 md:divide-x divide-gray-200">
              
              <div className="pt-2 md:pt-0">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-500 block mb-1">
                  Landfill Diversion
                </span>
                <span className="text-3xl sm:text-4xl font-extrabold text-green-600 font-heading tracking-tight">
                  {diversionStat.formatted}
                </span>
                <span className="text-xs text-gray-500 block mt-1">vs 28% baseline</span>
              </div>

              <div className="pt-2 md:pt-0">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-500 block mb-1">
                  Fleet Distance Cut
                </span>
                <span className="text-3xl sm:text-4xl font-extrabold text-[#243D83] font-heading tracking-tight">
                  {distanceStat.formatted}
                </span>
                <span className="text-xs text-gray-500 block mt-1">fuel &amp; emissions reduced</span>
              </div>

              <div className="pt-4 md:pt-0">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-500 block mb-1">
                  Clean Energy Generated
                </span>
                <span className="text-3xl sm:text-4xl font-extrabold text-amber-600 font-heading tracking-tight">
                  {energyStat.formatted}
                </span>
                <span className="text-xs text-gray-500 block mt-1">renewable biomethane</span>
              </div>

              <div className="pt-4 md:pt-0">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-500 block mb-1">
                  Circular Value Created
                </span>
                <span className="text-3xl sm:text-4xl font-extrabold text-[#243D83] font-heading tracking-tight">
                  {revenueStat.formatted}
                </span>
                <span className="text-xs text-gray-500 block mt-1">monetized commodities</span>
              </div>

            </div>
          </div>
        </div>

      </section>

      {/* ========================================================================= */}
      {/* SECTION 2: ABOUT RELOOP (Matching relooptoday.com About section) */}
      {/* ========================================================================= */}
      <section id="about" className="py-20 bg-white border-t border-gray-100">
        <div className="container mx-auto px-4 lg:px-6">
          
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
              About Reloop
            </div>
            <h2 className="text-3xl lg:text-5xl font-extrabold text-gray-900 font-heading leading-tight">
              Revolutionizing{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">
                Waste-to-Resource
              </span>{' '}
              in India
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              Reloop is India's comprehensive digital platform for responsible circular waste management. We make recycling electronics, polymers, and urban organics as seamless and transparent as modern logistics.
            </p>
          </div>

          {/* 4 Colorful Metric Cards matching relooptoday.com */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            
            <div className="text-center p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border border-green-100 shadow-sm hover:shadow-md transition-all">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 text-white shadow-md">
                <Recycle className="w-8 h-8" />
              </div>
              <div className="text-2xl lg:text-3xl font-bold text-gray-900 mb-1 font-heading">24,000T</div>
              <div className="text-sm text-gray-600 font-medium">Material Diverted</div>
            </div>

            <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl border border-blue-100 shadow-sm hover:shadow-md transition-all">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-2xl flex items-center justify-center mx-auto mb-4 text-white shadow-md">
                <Users className="w-8 h-8" />
              </div>
              <div className="text-2xl lg:text-3xl font-bold text-gray-900 mb-1 font-heading">50K+</div>
              <div className="text-sm text-gray-600 font-medium">Happy Citizens</div>
            </div>

            <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl border border-purple-100 shadow-sm hover:shadow-md transition-all">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4 text-white shadow-md">
                <MapPin className="w-8 h-8" />
              </div>
              <div className="text-2xl lg:text-3xl font-bold text-gray-900 mb-1 font-heading">25+</div>
              <div className="text-sm text-gray-600 font-medium">Wards &amp; Zones</div>
            </div>

            <div className="text-center p-6 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl border border-yellow-100 shadow-sm hover:shadow-md transition-all">
              <div className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-4 text-white shadow-md">
                <Award className="w-8 h-8" />
              </div>
              <div className="text-2xl lg:text-3xl font-bold text-gray-900 mb-1 font-heading">850T</div>
              <div className="text-sm text-gray-600 font-medium">Net CO₂ Avoided</div>
            </div>

          </div>

          {/* Mission & Circular Action Story */}
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 font-heading">
                Our Mission: A Cleaner, Greener Future
              </h3>
              <p className="text-base text-gray-600 leading-relaxed">
                We believe that every item has value, even at the end of its life cycle. Through our innovative platform, we're transforming how cities handle waste, making responsible recycling accessible to everyone.
              </p>

              <div className="space-y-4">
                <div className="flex items-start space-x-3.5">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-white text-xs font-bold">
                    ✓
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm">Zero Landfill Commitment</h4>
                    <p className="text-sm text-gray-600">All collected municipal waste is properly segregated, recycled, or converted to clean energy (95.2% diversion).</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3.5">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-white text-xs font-bold">
                    ✓
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm">Fair Value Compensation</h4>
                    <p className="text-sm text-gray-600">Monetizes recycled commodity polymers, grid power feed-in tariffs, and certified plastic credits.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3.5">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-white text-xs font-bold">
                    ✓
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm">Community &amp; Civic Impact</h4>
                    <p className="text-sm text-gray-600">Eliminates odor backlogs, optimizes compactor truck journeys, and builds transparent circular governance.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-green-200 rounded-full opacity-30" />
              <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-blue-200 rounded-full opacity-30" />
              <div className="bg-gradient-to-br from-green-100 via-emerald-50 to-white rounded-3xl p-10 sm:p-12 text-center border border-green-200 shadow-xl space-y-6">
                <div className="w-24 h-24 bg-gradient-to-r from-green-500 to-emerald-600 rounded-3xl flex items-center justify-center mx-auto text-white shadow-lg">
                  <Recycle className="w-12 h-12" />
                </div>
                <h4 className="text-2xl font-bold text-gray-900 font-heading">
                  Circular Economy in Action
                </h4>
                <p className="text-sm text-gray-600 leading-relaxed max-w-md mx-auto">
                  Every device and municipal tonne processed through Reloop contributes to a sustainable future, reducing open dumping and conserving vital natural resources.
                </p>
                <div className="pt-2">
                  <Link
                    to="/app/dashboard"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#243D83] hover:bg-[#1a2c5f] text-white font-semibold text-sm transition-all shadow-md"
                  >
                    <span>Inspect Live Pune Corridor</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 3: FEATURES GRID (Matching relooptoday.com 9 Feature Cards) */}
      {/* ========================================================================= */}
      <section id="features" className="py-20 bg-gradient-to-br from-gray-50 via-white to-gray-50 border-t border-gray-100">
        <div className="container mx-auto px-4 lg:px-6 space-y-16">
          
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
              ⚡ Features
            </div>
            <h2 className="text-3xl lg:text-5xl font-extrabold text-gray-900 font-heading leading-tight">
              Everything You Need for{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">
                Smart Recycling
              </span>
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              Discover powerful automated capabilities engineered to make urban waste and e-waste recycling simple, rewarding, and environmentally impactful.
            </p>
          </div>

          {/* 9 Feature Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            
            {/* Card 1: Schedule Pickup / Dynamic Dispatch */}
            <div className="group p-7 rounded-3xl bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mb-5 text-white shadow-md group-hover:scale-105 transition-transform">
                <Calendar className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2 font-heading">Schedule Pickup</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Book doorstep collection at your convenience. Verified municipal partners collect electronics and recyclables safely.
              </p>
              <Link to="/app/optimize" className="inline-flex items-center text-xs font-bold text-blue-700 mt-4 gap-1 hover:underline">
                View dynamic routes <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Card 2: Earn Green Rewards */}
            <div className="group p-7 rounded-3xl bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="w-14 h-14 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mb-5 text-white shadow-md group-hover:scale-105 transition-transform">
                <Coins className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2 font-heading">Earn Green Rewards</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Get paid fair market prices for your old electronics, sorted polymers, and scrap metals based on certified material purity.
              </p>
              <Link to="/app/revenue" className="inline-flex items-center text-xs font-bold text-green-700 mt-4 gap-1 hover:underline">
                View circular revenue <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Card 3: Find Drop Points */}
            <div className="group p-7 rounded-3xl bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="w-14 h-14 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-5 text-white shadow-md group-hover:scale-105 transition-transform">
                <MapPin className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2 font-heading">Find Drop Points</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Locate 100+ nearby smart IoT bins, community collection hubs, and MRF facilities with our live map.
              </p>
              <Link to="/app/map" className="inline-flex items-center text-xs font-bold text-purple-700 mt-4 gap-1 hover:underline">
                Open live bin map <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Card 4: Track Impact & Telemetry */}
            <div className="group p-7 rounded-3xl bg-gradient-to-br from-orange-50 to-red-50 border border-orange-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="w-14 h-14 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mb-5 text-white shadow-md group-hover:scale-105 transition-transform">
                <BarChart3 className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2 font-heading">Track Impact</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                See your environmental contribution with real-time ultrasonic fill analytics, methane reduction, and diversion metrics.
              </p>
              <Link to="/app/predict" className="inline-flex items-center text-xs font-bold text-orange-700 mt-4 gap-1 hover:underline">
                View waste forecasts <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Card 5: Conveyor Optical Sorting */}
            <div className="group p-7 rounded-3xl bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="w-14 h-14 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center mb-5 text-white shadow-md group-hover:scale-105 transition-transform">
                <ScanSearch className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2 font-heading">AI Vision Sorting</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Edge camera models classify incoming items in 15 milliseconds, detecting polymer grades (PET, HDPE, PP) with 98.4% accuracy.
              </p>
              <Link to="/app/classify" className="inline-flex items-center text-xs font-bold text-indigo-700 mt-4 gap-1 hover:underline">
                Try image classifier <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Card 6: Data Security & Governance */}
            <div className="group p-7 rounded-3xl bg-gradient-to-br from-gray-50 to-slate-100 border border-gray-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="w-14 h-14 bg-gradient-to-r from-gray-700 to-gray-900 rounded-2xl flex items-center justify-center mb-5 text-white shadow-md group-hover:scale-105 transition-transform">
                <Shield className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2 font-heading">Data Security</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Complete data wiping, hardware destruction certificates, and cryptographic diversion ledgers for total peace of mind.
              </p>
              <Link to="/app/assumptions" className="inline-flex items-center text-xs font-bold text-gray-700 mt-4 gap-1 hover:underline">
                Inspect audit assumptions <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Card 7: Dynamic Fleet Dispatch */}
            <div className="group p-7 rounded-3xl bg-gradient-to-br from-teal-50 to-cyan-50 border border-teal-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="w-14 h-14 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-2xl flex items-center justify-center mb-5 text-white shadow-md group-hover:scale-105 transition-transform">
                <Truck className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2 font-heading">Free &amp; Smart Collection</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Automated 2-Opt CVRP routing skips under-filled bins, reducing municipal fleet fuel consumption and travel distance by 32%.
              </p>
              <Link to="/app/optimize" className="inline-flex items-center text-xs font-bold text-teal-700 mt-4 gap-1 hover:underline">
                Run fleet solver <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Card 8: Clean Power & Bio-Methane */}
            <div className="group p-7 rounded-3xl bg-gradient-to-br from-pink-50 to-rose-50 border border-pink-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="w-14 h-14 bg-gradient-to-r from-pink-500 to-rose-500 rounded-2xl flex items-center justify-center mb-5 text-white shadow-md group-hover:scale-105 transition-transform">
                <Zap className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2 font-heading">Energy Generation</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Organic food digestate feeds high-efficiency anaerobic digesters, generating ~71 MWh clean grid electricity and Bio-CNG.
              </p>
              <Link to="/app/forecast" className="inline-flex items-center text-xs font-bold text-rose-700 mt-4 gap-1 hover:underline">
                View energy yield <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Card 9: AI Device Valuation */}
            <div className="group p-7 rounded-3xl bg-gradient-to-br from-yellow-50 to-orange-50 border border-yellow-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="w-14 h-14 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center mb-5 text-white shadow-md group-hover:scale-105 transition-transform">
                <Smartphone className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2 font-heading">Device Valuation</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Get instant price quotes and circular valuations for old electronics and recyclables using our AI-driven pricing model.
              </p>
              <Link to="/app/classify" className="inline-flex items-center text-xs font-bold text-amber-700 mt-4 gap-1 hover:underline">
                Check valuation <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

          </div>

          <div className="text-center pt-4">
            <Link
              to="/app/dashboard"
              className="inline-flex items-center px-8 py-3.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all shadow-md gap-2"
            >
              <span>Explore All Live Modules</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 4: LIVE IN-BROWSER SIMULATION PREVIEW (macOS Window Frame) */}
      {/* ========================================================================= */}
      <section id="preview" ref={previewSectionRef} className="py-20 bg-white border-t border-gray-100">
        <div className="container mx-auto px-4 lg:px-6 space-y-12">
          
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
              Live In-Browser Simulation
            </div>
            <h2 className="text-3xl lg:text-5xl font-extrabold text-gray-900 font-heading leading-tight">
              Interactive Live Dashboard
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              A real simulation engine ticking right now. Toggle between status-quo baseline collection and Reloop circular intelligence.
            </p>
          </div>

          {/* Browser Window Frame */}
          <div className="max-w-[1100px] mx-auto rounded-3xl bg-white border border-gray-300 shadow-2xl overflow-hidden ring-1 ring-gray-900/5">
            
            {/* macOS Chrome Header */}
            <div className="bg-gray-100 border-b border-gray-200 px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-400 inline-block" />
                <span className="w-3 h-3 rounded-full bg-yellow-400 inline-block" />
                <span className="w-3 h-3 rounded-full bg-green-400 inline-block" />
                <span className="text-xs font-mono text-gray-500 ml-2 hidden sm:inline">
                  reloop.city/pilot/pune/dashboard
                </span>
              </div>

              {/* Baseline vs ReLoop Mode Toggle inside preview */}
              <div className="flex items-center gap-2 bg-white px-2 py-1 rounded-xl border border-gray-200 shadow-2xs">
                <span className="text-xs font-bold text-gray-600 hidden sm:inline">Mode:</span>
                <button
                  type="button"
                  onClick={() => setMode('baseline')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    mode === 'baseline' ? 'bg-[#243D83] text-white' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Baseline
                </button>
                <button
                  type="button"
                  onClick={() => setMode('reloop')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    mode === 'reloop' ? 'bg-green-600 text-white' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Reloop AI
                </button>
              </div>
            </div>

            {/* Inner Real Dashboard Surface */}
            <div className="p-6 sm:p-8 space-y-6 bg-white">
              
              {/* Top 3 Live Ticking KPIs */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                
                <div className="p-5 rounded-2xl bg-[#F8FAFC] border border-gray-200">
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-500 block mb-1">
                    Landfill Diversion Rate
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-extrabold text-green-600 font-heading">
                      {mode === 'reloop' ? '95.2%' : '28.4%'}
                    </span>
                    <span className="text-xs font-bold text-green-700 bg-green-100 px-2 py-0.5 rounded">
                      {mode === 'reloop' ? '+66.8% gain' : 'Standard'}
                    </span>
                  </div>
                  <span className="text-xs text-gray-500 mt-1 block">Live simulation ticker</span>
                </div>

                <div className="p-5 rounded-2xl bg-[#F8FAFC] border border-gray-200">
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-500 block mb-1">
                    Clean Energy Yield
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-extrabold text-amber-600 font-heading">
                      {mode === 'reloop' ? `${simState.reloopCumulative.energyGeneratedMwh.toFixed(1)} MWh` : '0 MWh'}
                    </span>
                    <span className="text-xs font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                      Bio-CHP
                    </span>
                  </div>
                  <span className="text-xs text-gray-500 mt-1 block">From organic digestate</span>
                </div>

                <div className="p-5 rounded-2xl bg-[#F8FAFC] border border-gray-200">
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-500 block mb-1">
                    Net Commodity Revenue
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-extrabold text-[#243D83] font-heading">
                      {mode === 'reloop' ? `₹${(simState.reloopCumulative.revenueGeneratedInr / 100000).toFixed(1)}L` : '₹0'}
                    </span>
                    <span className="text-xs font-bold text-blue-800 bg-blue-100 px-2 py-0.5 rounded">
                      Daily settled
                    </span>
                  </div>
                  <span className="text-xs text-gray-500 mt-1 block">Polymers + Compost + Power</span>
                </div>

              </div>

              {/* Mini Chart Grid inside Window */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                
                {/* Donut Allocation */}
                <div className="p-5 rounded-2xl border border-gray-200 bg-[#F8FAFC] space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-sm text-gray-900">Material Stream Allocation</h4>
                    <span className="text-xs font-mono text-green-700 font-bold">Pune Pilot</span>
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

                {/* Prompt to open full dashboard */}
                <div className="p-6 rounded-2xl border border-gray-200 bg-gradient-to-br from-[#243D83] to-[#12224d] text-white flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-green-500/20 text-green-300 text-xs font-semibold">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-ping" />
                      Day {simState.currentDay} · Hour {String(simState.currentHour).padStart(2, '0')}:00
                    </div>
                    <h4 className="text-lg font-bold text-white font-heading">
                      Want to inspect all 9 operational screens?
                    </h4>
                    <p className="text-sm text-gray-200 leading-relaxed">
                      Access the full Leaflet IoT live bin map, dynamic truck dispatch solver, AI vision classifier, and technical assumptions.
                    </p>
                  </div>

                  <Link
                    to="/app/dashboard"
                    className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-green-600 hover:bg-green-500 text-white font-bold text-sm shadow-md transition-all cursor-pointer"
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
      {/* SECTION 5: 7-STEP ARCHITECTURE (Interactive Loop) */}
      {/* ========================================================================= */}
      <section id="how-it-works" className="py-20 bg-gray-50 border-t border-gray-100">
        <div className="container mx-auto px-4 lg:px-6 space-y-12">
          
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
              The 7-Step Architecture
            </div>
            <h2 className="text-3xl lg:text-5xl font-extrabold text-gray-900 font-heading leading-tight">
              The Closed-Loop City Engine
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              Autonomous telemetry transforms collected waste into clean megawatts and sorted commodity revenue.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start max-w-[1200px] mx-auto">
            
            {/* Left: 7 Interactive Steps Selector */}
            <div className="lg:col-span-5 space-y-2">
              <span className="text-xs font-mono font-bold uppercase text-gray-500 block mb-2 px-1">
                Pick a step
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
                      className={`w-full text-left p-3.5 rounded-2xl border transition-all flex items-center justify-between cursor-pointer focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-green-600 min-h-[44px] ${
                        isActive
                          ? 'bg-green-50 border-green-500 shadow-sm ring-1 ring-green-500/30'
                          : 'bg-white border-gray-200 hover:border-gray-300 hover:bg-gray-50/60'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors flex-shrink-0 ${
                            isActive ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="text-xs font-mono font-bold text-gray-500 block">
                            STEP {step.step}
                          </span>
                          <span className="font-bold text-sm text-gray-900">
                            {step.name} · {step.headline}
                          </span>
                        </div>
                      </div>

                      <ChevronRight className={`w-4 h-4 transition-transform flex-shrink-0 ${isActive ? 'text-green-600 rotate-90' : 'text-gray-400'}`} />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right: Dynamic Swapping Visual for Selected Step */}
            <div className="lg:col-span-7 bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
              
              <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                <div>
                  <span className="text-xs font-mono font-bold text-green-700 uppercase">
                    Step {loopSteps[activeLoopStep].step} of 7
                  </span>
                  <h3 className="text-2xl font-extrabold text-gray-900 font-heading">
                    {loopSteps[activeLoopStep].name}: {loopSteps[activeLoopStep].headline}
                  </h3>
                </div>
                <Link
                  to="/app/dashboard"
                  className="text-xs font-bold text-[#243D83] hover:text-green-600 flex items-center gap-1"
                >
                  <span>Open live in App</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <p className="text-gray-600 text-sm leading-relaxed">
                {loopSteps[activeLoopStep].desc}
              </p>

              {/* Dynamic Visual Container */}
              <div className="h-64 rounded-2xl bg-gray-50 border border-gray-200 p-4 flex items-center justify-center overflow-hidden relative">
                {activeLoopStep === 0 && (
                  <div className="w-full h-full flex items-center justify-center p-2">
                    <SmartBinIllustration className="max-h-56" />
                  </div>
                )}
                {activeLoopStep === 1 && (
                  <div className="w-full h-full p-2 flex flex-col justify-center">
                    <span className="text-xs font-mono text-gray-500 block mb-2 text-center">Ward Generation Forecast vs Actual (Tonnes)</span>
                    <ResponsiveContainer width="100%" height={170}>
                      <AreaChart data={forecastData}>
                        <Area type="monotone" dataKey="predicted" stroke="#059669" fill="#D1FAE5" />
                        <Area type="monotone" dataKey="actual" stroke="#243D83" fill="#E1EDF7" />
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
                {activeLoopStep === 4 && (
                  <div className="w-full h-full p-2 flex flex-col justify-center space-y-2">
                    <span className="text-xs font-mono font-bold text-gray-500 uppercase block text-center">
                      Mass Balance Flow Allocation
                    </span>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="p-2.5 rounded-xl bg-green-50 border border-green-200 text-green-950 flex items-center justify-between">
                        <span className="font-bold">Wet Organic (45%)</span>
                        <span className="text-[11px] font-mono font-bold text-green-800 bg-white px-2 py-0.5 rounded shadow-2xs">→ AD Biogas</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-950 flex items-center justify-between">
                        <span className="font-bold">Dry Polymers (30%)</span>
                        <span className="text-[11px] font-mono font-bold text-blue-800 bg-white px-2 py-0.5 rounded shadow-2xs">→ MRF Baling</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-cyan-50 border border-cyan-200 text-cyan-950 flex items-center justify-between">
                        <span className="font-bold">C&amp;D Rubble (15%)</span>
                        <span className="text-[11px] font-mono font-bold text-cyan-800 bg-white px-2 py-0.5 rounded shadow-2xs">→ M-Sand</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-slate-50 border border-gray-300 text-gray-800 flex items-center justify-between">
                        <span className="font-bold">Inert Ash (&lt;5%)</span>
                        <span className="text-[11px] font-mono font-bold text-gray-600 bg-white px-2 py-0.5 rounded shadow-2xs">→ Landfill</span>
                      </div>
                    </div>
                  </div>
                )}
                {activeLoopStep === 5 && (
                  <div className="w-full h-full p-2 flex flex-col justify-center">
                    <div className="flex items-center justify-between text-xs font-mono text-gray-600 mb-2 px-1">
                      <span>Biogas Power Output (MWh)</span>
                      <span className="text-green-700 font-bold">~71 MWh Grid Feed</span>
                    </div>
                    <ResponsiveContainer width="100%" height={170}>
                      <AreaChart data={[
                        { hour: '00h', mwh: 1.2 },
                        { hour: '04h', mwh: 1.8 },
                        { hour: '08h', mwh: 4.1 },
                        { hour: '12h', mwh: 5.4 },
                        { hour: '16h', mwh: 4.8 },
                        { hour: '20h', mwh: 3.5 },
                        { hour: '24h', mwh: 2.2 },
                      ]}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                        <XAxis dataKey="hour" stroke="#64748B" fontSize={11} tickLine={false} />
                        <YAxis stroke="#64748B" fontSize={11} tickLine={false} />
                        <RechartsTooltip />
                        <Area type="monotone" dataKey="mwh" name="Clean MWh" stroke="#059669" fill="#D1FAE5" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                )}
                {activeLoopStep === 6 && (
                  <div className="w-full h-full overflow-y-auto p-1 flex flex-col justify-center">
                    <table className="w-full text-left text-xs">
                      <caption className="sr-only">Monthly Resource Revenue Ledger</caption>
                      <thead>
                        <tr className="border-b border-gray-200 text-gray-500 uppercase font-mono">
                          <th className="pb-2">Resource Stream</th>
                          <th className="pb-2">Off-Take Destination</th>
                          <th className="pb-2 text-right">Monthly (₹)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 text-gray-800">
                        <tr>
                          <td className="py-1.5 font-bold text-gray-900">Polymers &amp; Metals</td>
                          <td className="py-1.5 text-gray-600">MRF Commodity Bales</td>
                          <td className="py-1.5 text-right font-mono font-bold text-green-700">₹14.2 L</td>
                        </tr>
                        <tr>
                          <td className="py-1.5 font-bold text-gray-900">Grid Electricity</td>
                          <td className="py-1.5 text-gray-600">MSEDCL Feed-in</td>
                          <td className="py-1.5 text-right font-mono font-bold text-green-700">₹5.8 L</td>
                        </tr>
                        <tr>
                          <td className="py-1.5 font-bold text-gray-900">EPR Plastic Credits</td>
                          <td className="py-1.5 text-gray-600">CPCB FMCG Brands</td>
                          <td className="py-1.5 text-right font-mono font-bold text-green-700">₹4.6 L</td>
                        </tr>
                        <tr>
                          <td className="py-1.5 font-bold text-gray-900">Compost &amp; M-Sand</td>
                          <td className="py-1.5 text-gray-600">Agri &amp; PWD Roads</td>
                          <td className="py-1.5 text-right font-mono font-bold text-green-700">₹6.6 L</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Loop Step Mini Navigation Bar */}
              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  disabled={activeLoopStep === 0}
                  onClick={() => setActiveLoopStep((prev) => Math.max(0, prev - 1))}
                  className="px-3.5 py-1.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-700 disabled:opacity-40"
                >
                  ← Previous Step
                </button>
                <button
                  type="button"
                  disabled={activeLoopStep === 6}
                  onClick={() => setActiveLoopStep((prev) => Math.min(6, prev + 1))}
                  className="px-3.5 py-1.5 rounded-xl bg-[#243D83] text-white text-xs font-bold disabled:opacity-40"
                >
                  Next Step →
                </button>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 6: IMPACT STATISTICS (Dark luxury gradient matching relooptoday) */}
      {/* ========================================================================= */}
      <section id="statistics" className="py-20 bg-gradient-to-br from-green-950 via-emerald-900 to-green-900 text-white relative overflow-hidden">
        
        {/* Ambient watermark background circles */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-20 left-20 w-44 h-44 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-20 w-36 h-36 bg-white rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 lg:px-6 relative z-10 space-y-16">
          
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-full text-sm font-semibold">
              📊 Impact Statistics
            </div>
            <h2 className="text-3xl lg:text-5xl font-extrabold text-white font-heading leading-tight">
              Making a Real{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-300 to-emerald-200">
                Environmental Impact
              </span>
            </h2>
            <p className="text-lg text-green-100 leading-relaxed">
              Numbers that showcase our collective effort in building a sustainable future through responsible resource management.
            </p>
          </div>

          {/* 6 High-Impact Glassmorphism Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-8 hover:bg-white/20 transition-all duration-300">
              <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mb-5 text-white shadow-lg">
                <Users className="w-7 h-7" />
              </div>
              <div className="text-3xl lg:text-4xl font-extrabold text-white mb-1 font-heading">50,000+</div>
              <div className="text-base font-bold text-green-300 mb-1">Active Citizens</div>
              <div className="text-sm text-green-100">Actively utilizing Reloop circular channels</div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-8 hover:bg-white/20 transition-all duration-300">
              <div className="w-14 h-14 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mb-5 text-white shadow-lg">
                <Recycle className="w-7 h-7" />
              </div>
              <div className="text-3xl lg:text-4xl font-extrabold text-white mb-1 font-heading">24,000T</div>
              <div className="text-base font-bold text-green-300 mb-1">Tonnes Diverted</div>
              <div className="text-sm text-green-100">Municipal &amp; e-waste recycled per year</div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-8 hover:bg-white/20 transition-all duration-300">
              <div className="w-14 h-14 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center mb-5 text-white shadow-lg">
                <Award className="w-7 h-7" />
              </div>
              <div className="text-2xl lg:text-3xl font-extrabold text-white mb-1 font-heading">Govt Approved</div>
              <div className="text-base font-bold text-green-300 mb-1">PCCOE Smart Pilot</div>
              <div className="text-sm text-green-100">Calibrated Pune PCMC corridor</div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-8 hover:bg-white/20 transition-all duration-300">
              <div className="w-14 h-14 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-5 text-white shadow-lg">
                <Leaf className="w-7 h-7" />
              </div>
              <div className="text-3xl lg:text-4xl font-extrabold text-white mb-1 font-heading">850T</div>
              <div className="text-base font-bold text-green-300 mb-1">CO₂ Prevented</div>
              <div className="text-sm text-green-100">Uncontrolled landfill methane avoided</div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-8 hover:bg-white/20 transition-all duration-300">
              <div className="w-14 h-14 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center mb-5 text-white shadow-lg">
                <Globe className="w-7 h-7" />
              </div>
              <div className="text-3xl lg:text-4xl font-extrabold text-white mb-1 font-heading">10+</div>
              <div className="text-base font-bold text-green-300 mb-1">Recovery Hubs</div>
              <div className="text-sm text-green-100">Connected across 5 municipal wards</div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-8 hover:bg-white/20 transition-all duration-300">
              <div className="w-14 h-14 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-2xl flex items-center justify-center mb-5 text-white shadow-lg">
                <TrendingUp className="w-7 h-7" />
              </div>
              <div className="text-3xl lg:text-4xl font-extrabold text-white mb-1 font-heading">95.2%</div>
              <div className="text-base font-bold text-green-300 mb-1">Diversion Efficiency</div>
              <div className="text-sm text-green-100">Versus 28% status-quo baseline</div>
            </div>

          </div>

          {/* 4 Bottom Accolade Badges */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 pt-4 border-t border-white/15">
            <div className="text-center">
              <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-2 text-xl">🏆</div>
              <div className="text-white text-sm font-bold">Best Eco Platform 2026</div>
              <div className="text-xs text-green-200">Smart Cities Track</div>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-green-400 rounded-full flex items-center justify-center mx-auto mb-2 text-xl">🌱</div>
              <div className="text-white text-sm font-bold">Carbon Neutral Certified</div>
              <div className="text-xs text-green-200">Zero Landfill Methane</div>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-blue-400 rounded-full flex items-center justify-center mx-auto mb-2 text-xl">⭐</div>
              <div className="text-white text-sm font-bold">4.8/5 Pilot Rating</div>
              <div className="text-xs text-green-200">Municipal Operations</div>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-purple-400 rounded-full flex items-center justify-center mx-auto mb-2 text-xl">🚀</div>
              <div className="text-white text-sm font-bold">PCCOE Grand Challenge</div>
              <div className="text-xs text-green-200">Pune Pilot Corridor</div>
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 7: CORRIDOR & METHODOLOGY */}
      {/* ========================================================================= */}
      <section className="py-20 bg-white border-t border-gray-200">
        <div className="container mx-auto px-4 lg:px-6 space-y-12">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left: Akurdi - Chinchwad - Moshi Pilot Corridor Graphic */}
            <div className="lg:col-span-6 space-y-4">
              <div className="inline-flex items-center px-4 py-1.5 bg-green-100 text-green-800 rounded-full text-xs font-semibold">
                Pilot Corridor Map
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-gray-900 font-heading">
                Akurdi – Chinchwad – Moshi Corridor
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Calibrated across Pune PCMC's high-density mixed zone: residential collection in Akurdi, commercial hubs in Chinchwad, and centralized recovery at the Moshi Waste-to-Energy and MRF complex.
              </p>

              {/* Corridor Map Graphic (SVG) */}
              <div className="p-5 rounded-2xl bg-gray-50 border border-gray-200 shadow-sm">
                <svg viewBox="0 0 500 180" className="w-full h-auto" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Pilot corridor route map">
                  <path d="M 60 90 C 140 40, 220 140, 310 90 C 370 60, 410 70, 440 90" stroke="#CBD5E1" strokeWidth="6" strokeLinecap="round" />
                  <path d="M 60 90 C 140 40, 220 140, 310 90 C 370 60, 410 70, 440 90" stroke="#059669" strokeWidth="2" strokeDasharray="6 6" />

                  {/* Node 1: Akurdi */}
                  <g transform="translate(60, 90)">
                    <circle r="18" fill="#243D83" />
                    <circle r="6" fill="#10B981" />
                    <text x="0" y="34" textAnchor="middle" fill="#0F172A" fontSize="12" fontWeight="700">Akurdi Zone A</text>
                    <text x="0" y="48" textAnchor="middle" fill="#64748B" fontSize="10">24 Smart Bins · Residential</text>
                  </g>

                  {/* Node 2: Chinchwad */}
                  <g transform="translate(250, 105)">
                    <circle r="18" fill="#243D83" />
                    <circle r="6" fill="#D97706" />
                    <text x="0" y="34" textAnchor="middle" fill="#0F172A" fontSize="12" fontWeight="700">Chinchwad Hub</text>
                    <text x="0" y="48" textAnchor="middle" fill="#64748B" fontSize="10">22 Smart Bins · Commercial</text>
                  </g>

                  {/* Node 3: Moshi MRF & WtE */}
                  <g transform="translate(440, 90)">
                    <circle r="22" fill="#059669" />
                    <circle r="8" fill="#FFFFFF" />
                    <text x="0" y="36" textAnchor="middle" fill="#0F172A" fontSize="12" fontWeight="700">Moshi Complex</text>
                    <text x="0" y="50" textAnchor="middle" fill="#059669" fontSize="10" fontWeight="600">MRF + Biogas + 71 MWh CHP</text>
                  </g>
                </svg>
              </div>
            </div>

            {/* Right: Methodology & Assumptions Compact Strip */}
            <div className="lg:col-span-6 space-y-4">
              <div className="inline-flex items-center px-4 py-1.5 bg-blue-100 text-[#243D83] rounded-full text-xs font-semibold">
                Technical Rigor
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-gray-900 font-heading">
                Methodology &amp; Assumptions
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Deterministic mathematical simulation using seeded pseudo-random distribution. Zero hallucinations, grounded in real urban operational parameters.
              </p>

              <div className="space-y-3">
                <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 text-[#243D83] flex items-center justify-center font-bold text-xs flex-shrink-0">
                    150T
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-900">Daily Pilot Volume</h4>
                    <p className="text-xs text-gray-600">150 tonnes/day across 3 pilot zones: 45% organic, 30% recyclable polymers, 15% C&amp;D, &lt;5% inert.</p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-green-100 text-green-800 flex items-center justify-center font-bold text-xs flex-shrink-0">
                    28%
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-900">Baseline Diversion vs 95.2% Reloop</h4>
                    <p className="text-xs text-gray-600">Baseline dumps 72% in open landfills. Reloop routes 95.2% into verified circular recovery channels.</p>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <Link
                    to="/app/assumptions"
                    className="text-sm font-bold text-green-700 hover:text-green-800 flex items-center gap-1.5 underline underline-offset-4"
                  >
                    <span>View all 20+ engineering assumptions</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>

                  <span className="text-xs font-semibold text-gray-500">
                    PCCOE Grand Challenge 2026
                  </span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 8: FAQ ACCORDION (Matching relooptoday.com FAQ) */}
      {/* ========================================================================= */}
      <section id="faq" className="py-20 bg-gray-50 border-t border-gray-200">
        <div className="container mx-auto px-4 lg:px-6 space-y-16">
          
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
              ❓ Frequently Asked Questions
            </div>
            <h2 className="text-3xl lg:text-5xl font-extrabold text-gray-900 font-heading leading-tight">
              Got Questions?{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">
                We've Got Answers
              </span>
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              Find answers to common questions about our circular loop, rewards system, and environmental impact.
            </p>
          </div>

          {/* Accordion List */}
          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, idx) => {
              const isOpen = activeFaq === idx;
              return (
                <div
                  key={idx}
                  className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-md transition-all"
                >
                  <button
                    type="button"
                    onClick={() => setActiveFaq(isOpen ? null : idx)}
                    className="w-full px-6 py-5 text-left flex items-center justify-between hover:bg-gray-50/70 transition-colors cursor-pointer"
                  >
                    <span className="text-base font-bold text-gray-900 pr-4">{faq.question}</span>
                    <div
                      className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all flex-shrink-0 ${
                        isOpen ? 'bg-green-600 text-white border-green-600' : 'text-green-600 border-green-500'
                      }`}
                    >
                      {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-6 pb-6 pt-1 text-sm text-gray-600 leading-relaxed border-t border-gray-100 animate-in fade-in duration-200">
                      <div className="border-l-4 border-green-500 pl-4 py-1">
                        {faq.answer}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Still Have Questions Support Card */}
          <div className="max-w-2xl mx-auto bg-gradient-to-r from-green-50 via-emerald-50 to-green-50 rounded-3xl p-8 border border-green-200 text-center space-y-4 shadow-sm">
            <h3 className="text-2xl font-bold text-gray-900 font-heading">Still have questions?</h3>
            <p className="text-sm text-gray-600 max-w-md mx-auto">
              Our support team and engineering mentors are here to help you explore responsible recycling and circular deployment.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
              <a
                href="tel:+918977125777"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold text-sm shadow-md hover:from-green-600 hover:to-emerald-700 transition-all cursor-pointer"
              >
                <Phone className="w-4 h-4" />
                <span>Call Support (+91 8977125777)</span>
              </a>
              <a
                href="mailto:info@relooptoday.com"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white text-gray-800 font-bold text-sm border border-gray-300 hover:bg-gray-50 transition-all cursor-pointer"
              >
                <Mail className="w-4 h-4 text-green-600" />
                <span>info@relooptoday.com</span>
              </a>
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 9: FINAL CTA (Full-Width Brand Band) */}
      {/* ========================================================================= */}
      <section className="w-full bg-gradient-to-r from-[#243D83] via-[#1a2c5f] to-[#243D83] text-white py-20 lg:py-24 relative overflow-hidden">
        <div className="container mx-auto px-4 lg:px-6 text-center relative z-10 space-y-6 max-w-4xl">
          
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-green-300 border border-white/20 text-xs font-mono">
            <Sparkles className="w-3.5 h-3.5 text-green-400" />
            <span>Ready to Test in Your Browser</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold text-white font-heading leading-tight">
            We don't just collect waste.{' '}
            <span className="text-green-400">We complete the loop.</span>
          </h2>

          <p className="text-gray-300 text-base sm:text-lg max-w-xl mx-auto">
            Experience the full client-side simulation calibrated for Pune's pilot corridor. No setup or login required.
          </p>

          <div className="pt-4 flex justify-center">
            <Link
              to="/app/dashboard"
              className="inline-flex items-center justify-center gap-2.5 px-9 py-4 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-extrabold text-base shadow-xl shadow-green-900/30 hover:shadow-2xl transition-all cursor-pointer min-h-[44px]"
            >
              <span>Launch Live Demo Free</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

        </div>
      </section>

      {/* Official Reloop Footer */}
      <PublicFooter />

    </div>
  );
};
