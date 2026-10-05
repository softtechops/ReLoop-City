import React, { useState, useEffect, useRef } from 'react';
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
import { PILOT_30DAY_SNAPSHOT } from '../lib/metrics';
import {
  ArrowRight,
  Radio,
  TrendingUp,
  Route as RouteIcon,
  ScanSearch,
  GitFork,
  Zap,
  Coins,
  Leaf,
  ChevronRight,
  Plus,
  Minus,
  Recycle,
  Sparkles,
  Clock,
  ShieldCheck,
  Truck,
  AlertTriangle,
  MapPin,
  Calendar,
  Globe,
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
  YAxis,
} from 'recharts';

// ─── Snapshot from single source of truth ─────────────────────────────────
const snap = PILOT_30DAY_SNAPSHOT.reloop;
const snapBase = PILOT_30DAY_SNAPSHOT.baseline;

// ─── 7-step loop data ─────────────────────────────────────────────────────
const LOOP_STEPS = [
  {
    step: 1, name: 'Sense', headline: 'IoT Telemetry', path: '/app/map', icon: Radio,
    desc: 'Ultrasonic smart bins across city wards broadcast fill level, weight and fill-velocity every 15 minutes. No manual rounds; the city tells you when it needs collection.',
  },
  {
    step: 2, name: 'Predict', headline: 'Waste Forecast', path: '/app/predict', icon: TrendingUp,
    desc: 'An LSTM model trained on zone demographics and seasonal patterns predicts bin overflow 24 hours ahead, enabling pre-emptive dispatch that prevents overflow incidents.',
  },
  {
    step: 3, name: 'Optimize', headline: 'Dynamic Dispatch', path: '/app/optimize', icon: RouteIcon,
    desc: 'A CVRP 2-Opt heuristic runs hourly. Trucks skip bins below 75% fill, cutting total route distance by 32% and diesel consumption accordingly.',
  },
  {
    step: 4, name: 'Classify', headline: 'Computer Vision', path: '/app/classify', icon: ScanSearch,
    desc: 'High-speed conveyor cameras classify polymer grades (PET, HDPE, PP), metals and organic waste in milliseconds, producing pure commodity streams worth more on secondary markets.',
  },
  {
    step: 5, name: 'Allocate', headline: 'Facility Balancing', path: '/app/allocate', icon: GitFork,
    desc: 'Material tonnage is allocated in real-time to the MRF for baling, the anaerobic-digestion plant for biogas, or the composting facility — whichever maximises recovery yield and minimises transport.',
  },
  {
    step: 6, name: 'Forecast', headline: 'Biogas & Energy', path: '/app/forecast', icon: Zap,
    desc: 'Organic digestate feeds a CHP plant generating clean grid electricity at ~2.1 kWh per m³ biogas. The energy ledger updates in real-time as organic tonnes accumulate.',
  },
  {
    step: 7, name: 'Report', headline: 'Circular Ledger', path: '/app/revenue', icon: Coins,
    desc: 'All commodity revenues — polymer flakes, grid power, EPR credits, compost — settle transparently in a daily ledger visible to city authorities.',
  },
];

// ─── Roadmap phases ───────────────────────────────────────────────────────
const ROADMAP_PHASES = [
  {
    phase: 1, label: 'Phase 1 · Active',
    title: 'Pune PCMC Pilot',
    desc: 'Live 7-step loop across 100 smart bins in 5 zones: Nigdi (Residential), Chinchwad (Commercial), Pimpri Mandi (Market), Moshi C&D Corridor, PCCOE Campus.',
    status: 'active',
  },
  {
    phase: 2, label: 'Phase 2 · 2027',
    title: 'Multi-Zone Expansion',
    desc: 'Scale to 500 bins and 20+ municipal wards across PCMC, integrate real IoT gateways and live MSEDCL grid feed-in metering.',
    status: 'planned',
  },
  {
    phase: 3, label: 'Phase 3 · 2027–28',
    title: 'Maharashtra Network',
    desc: 'Extend the model to 5 Maharashtra cities (Nashik, Aurangabad, Nagpur, Kolhapur, Solapur), with cross-city mass-balance benchmarking.',
    status: 'planned',
  },
  {
    phase: 4, label: 'Phase 4 · 2028',
    title: 'Citizen-Facing App',
    desc: 'A resident app for household waste pickup booking, drop-point navigation, personal impact tracking, and EPR credit wallet — built on the same 7-step backend.',
    status: 'planned',
  },
  {
    phase: 5, label: 'Phase 5 · 2029+',
    title: 'Pan-India Platform',
    desc: 'API-first platform offered to Urban Local Bodies as a managed SaaS, with white-label dashboards, open data exports and certified carbon diversion reporting.',
    status: 'planned',
  },
];

// ─── FAQ data (original copy only) ──────────────────────────────────────
const FAQS = [
  {
    q: 'How does the 7-step loop work?',
    a: 'IoT bins broadcast fill telemetry → an LSTM model predicts overflow 24 h ahead → a CVRP router dispatches trucks only to bins above 75% fill → conveyor optics sort collected waste → material is allocated to the MRF, AD plant or composting facility → organic digestate generates grid electricity via CHP → all revenues and carbon credits settle in a daily municipal ledger.',
  },
  {
    q: 'Is the data real or simulated?',
    a: 'The simulation is deterministic and runs entirely in your browser — no backend, no live sensors yet. All parameters (bin capacity, biogas yield, commodity prices, diesel rate) are calibrated to real Pune PCMC operational data and are visible in src/config/config.ts. The model is a pilot proof-of-concept, not a live production system.',
  },
  {
    q: 'How are collection routes optimised?',
    a: 'ReLoop runs a Capacity-Constrained Vehicle Routing Problem (CVRP) with 2-Opt local search every simulated hour. Bins below 75% fill are skipped, reducing total km driven and diesel burned by approximately 32% versus the fixed daily-schedule baseline.',
  },
  {
    q: 'What happens to each waste stream?',
    a: 'Organic waste (45–72% by zone) goes to anaerobic digestion for biogas and then electricity. Dry recyclables (polymers, metals, paper) go to the MRF for commodity baling and resale. C&D rubble becomes recycled aggregate. E-waste is routed to certified dismantlers. Residual inert ash (<5%) is the only fraction that reaches landfill.',
  },
  {
    q: 'How is circular revenue estimated?',
    a: 'Revenue = Σ(stream tonnage × market tariff). Tariffs used: HDPE/PET flakes ₹42k/t, aluminium scrap ₹68k/t, grid electricity ₹6.80/kWh, city compost ₹3.2k/t, RDF ₹2.4k/t, EPR plastic credits ₹3.5k/t. All tariffs are pilot assumptions listed in config.ts and linked from the Assumptions page.',
  },
  {
    q: 'Can ReLoop connect to real IoT sensors?',
    a: 'Yes — the simulation layer in src/sim/ is designed to be swapped for a live WebSocket or MQTT feed from real ultrasonic bin sensors. The store model, metric pipeline and UI components remain identical. A sensor SDK adapter is on the Phase 2 roadmap.',
  },
  {
    q: 'What does a pilot deployment need?',
    a: 'Minimum viable pilot: 20–30 smart bins with cellular fill sensors, one compact compactor truck fitted with GPS, access to an existing MRF, and a municipality data-sharing agreement. The ReLoop platform then runs on a single server (or even a laptop) and generates real-time operational dashboards from day one.',
  },
  {
    q: 'How is the baseline diversion figure set?',
    a: 'The 28.0% baseline diversion rate is calibrated from PCMC ward audit data: in the status-quo fixed-schedule regime, only ~28% of collected waste is formally recycled or composted; the remainder (~72%) goes to the Moshi open dumpsite. This figure is the same across the landing page, dashboard, README and guided tour.',
  },
];

// ─── Forecast chart data (illustrative, from config-derived assumptions) ──
const FORECAST_DATA = [
  { time: '06:00', actual: 4.2, predicted: 4.4 },
  { time: '09:00', actual: 12.8, predicted: 12.5 },
  { time: '12:00', actual: 18.5, predicted: 19.0 },
  { time: '15:00', actual: 24.1, predicted: 23.8 },
  { time: '18:00', actual: 31.4, predicted: 30.9 },
  { time: '21:00', actual: 38.0, predicted: 38.5 },
];

const ENERGY_DATA = [
  { hour: '00h', mwh: 1.2 }, { hour: '04h', mwh: 1.8 },
  { hour: '08h', mwh: 4.1 }, { hour: '12h', mwh: 5.4 },
  { hour: '16h', mwh: 4.8 }, { hour: '20h', mwh: 3.5 },
  { hour: '24h', mwh: 2.2 },
];

export const PublicWebsite: React.FC = () => {
  const navigate = useNavigate();
  const { simState, mode, setMode, startSimulation, pauseSimulation, startGuidedTour } = useStore();

  const [activeLoopStep, setActiveLoopStep] = useState(0);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  // Ref for live preview section — sim starts only when this scrolls into view
  const previewSectionRef = useRef<HTMLElement | null>(null);

  // IntersectionObserver: start sim when preview enters viewport, pause when it leaves
  // Does NOT call startSimulation on mount
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
      { threshold: 0.15 }
    );

    observer.observe(target);
    return () => {
      observer.disconnect();
      pauseSimulation();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Safe live values with PILOT_30DAY_SNAPSHOT fallback
  const liveReloopDiv = simState.reloopCumulative.landfillDiversionRatePercent || snap.diversionRatePercent;
  const liveEnergy = simState.reloopCumulative.energyGeneratedMwh > 0
    ? simState.reloopCumulative.energyGeneratedMwh
    : snap.energyMwh;
  const liveRevenue = simState.reloopCumulative.revenueGeneratedInr > 0
    ? simState.reloopCumulative.revenueGeneratedInr
    : snap.revenueInr;

  return (
    <div className="min-h-screen bg-page text-fg font-sans selection:bg-emerald-500/20 selection:text-emerald-300 pt-16">

      {/* Skip link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-20 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-slate-900 focus:text-white focus:rounded-xl focus:shadow-lg"
      >
        Skip to main content
      </a>

      <PublicNavbar />

      <main id="main-content">

        {/* ================================================================
            SECTION 1 · HERO
        ================================================================ */}
        <section
          id="home"
          aria-label="Hero: ReLoop City overview"
          className="py-20 lg:py-28 border-b border-line bg-page"
        >
          <div className="mx-auto max-w-7xl px-6 lg:px-8">

            {/* 12-column grid */}
            <div className="grid lg:grid-cols-12 gap-12 items-center">

              {/* Left copy — 6 cols */}
              <div className="lg:col-span-6 space-y-7 text-center lg:text-left">

                {/* Eyebrow (used at most 3× site-wide) */}
                <p className="text-sm font-medium text-fg-subtle tracking-wide uppercase">
                  AI for circular cities · Pune pilot
                </p>

                <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-semibold text-fg tracking-tight leading-[1.07] font-heading">
                  Turn city waste into{' '}
                  <span className="text-emerald-600 dark:text-emerald-400">energy, materials</span>{' '}
                  and revenue.
                </h1>

                <p className="text-lg text-fg-muted max-w-xl leading-relaxed mx-auto lg:mx-0">
                  ReLoop City is a 7-step AI platform for municipal solid-waste management — calibrated
                  to the Pune PCMC pilot corridor. It senses bin levels, predicts overflow, optimises
                  truck routes, classifies materials and settles circular revenue in a single closed loop.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                  <Link
                    to="/app/dashboard"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-base transition-colors cursor-pointer min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900 shadow-sm"
                  >
                    <span>Launch live demo</span>
                    <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </Link>

                  <button
                    type="button"
                    onClick={() => { startGuidedTour(); navigate('/app/dashboard'); }}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 text-fg font-medium text-base hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors cursor-pointer min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded-lg px-3"
                  >
                    <span>Take the 2-min tour</span>
                    <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </button>
                </div>
              </div>

              {/* Right visual panel — 6 cols */}
              <div className="lg:col-span-6 flex items-center justify-center">
                <div
                  className="relative w-full rounded-3xl border border-line bg-gradient-to-b from-surface to-surface-muted aspect-[4/3] flex items-center justify-center overflow-hidden shadow-sm"
                  role="img"
                  aria-label="Isometric illustration of a smart city circular waste loop"
                >
                  {/* Subtle dot pattern */}
                  <svg aria-hidden="true" className="absolute inset-0 w-full h-full opacity-[0.06] pointer-events-none">
                    <defs>
                      <pattern id="hero-dots" width="20" height="20" patternUnits="userSpaceOnUse">
                        <circle cx="1" cy="1" r="1" fill="currentColor" className="text-fg" />
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#hero-dots)" />
                  </svg>

                  <IsometricCityLoop size={380} className="relative z-10 mx-auto" />

                  {/* Two quiet chips */}
                  <div className="absolute top-4 left-4 z-20 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-surface border border-line shadow-sm text-xs font-medium text-fg">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" aria-hidden="true" />
                    IoT Sensors
                  </div>
                  <div className="absolute bottom-4 right-4 z-20 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-surface border border-line shadow-sm text-xs font-medium text-fg">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500" aria-hidden="true" />
                    Biogas CHP
                  </div>
                </div>
              </div>
            </div>

            {/* Hero stats strip — all from PILOT_30DAY_SNAPSHOT */}
            <div className="mt-14 grid grid-cols-2 lg:grid-cols-4 divide-y lg:divide-y-0 lg:divide-x divide-line border border-line rounded-2xl bg-surface shadow-sm overflow-hidden">

              <div className="px-6 py-6 text-center">
                <span className="text-xs font-semibold uppercase tracking-wider text-fg-subtle block mb-1">
                  Landfill Diversion
                </span>
                <span className="text-3xl font-semibold text-fg tabular-nums block font-heading">
                  {snap.diversionRatePercent.toFixed(1)}%
                </span>
                <span className="text-sm text-fg-muted mt-1 block">
                  vs {snapBase.diversionRatePercent.toFixed(0)}% fixed-schedule baseline
                </span>
              </div>

              <div className="px-6 py-6 text-center">
                <span className="text-xs font-semibold uppercase tracking-wider text-fg-subtle block mb-1">
                  Fleet Distance Cut
                </span>
                <span className="text-3xl font-semibold text-emerald-600 dark:text-emerald-400 tabular-nums block font-heading">
                  −32%
                </span>
                <span className="text-sm text-fg-muted mt-1 block">
                  diesel &amp; km vs static baseline
                </span>
              </div>

              <div className="px-6 py-6 text-center border-t lg:border-t-0">
                <span className="text-xs font-semibold uppercase tracking-wider text-fg-subtle block mb-1">
                  Clean Energy Generated
                </span>
                <span className="text-3xl font-semibold text-fg tabular-nums block font-heading">
                  {snap.energyMwh.toFixed(0)} MWh
                </span>
                <span className="text-sm text-fg-muted mt-1 block">
                  biomethane CHP, 30-day pilot
                </span>
              </div>

              <div className="px-6 py-6 text-center border-t lg:border-t-0">
                <span className="text-xs font-semibold uppercase tracking-wider text-fg-subtle block mb-1">
                  Circular Value Created
                </span>
                <span className="text-3xl font-semibold text-fg tabular-nums block font-heading">
                  ₹{(snap.revenueInr / 100000).toFixed(1)}L
                </span>
                <span className="text-sm text-fg-muted mt-1 block">
                  commodities monetised, 30-day
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ================================================================
            SECTION 2 · THE PROBLEM
        ================================================================ */}
        <section
          id="problem"
          aria-label="The waste management problem"
          className="py-20 lg:py-24 bg-surface-muted border-t border-line"
        >
          <div className="mx-auto max-w-7xl px-6 lg:px-8">

            {/* Left-aligned layout */}
            <div className="grid lg:grid-cols-2 gap-16 items-start">

              <div className="space-y-6">
                <h2 className="text-4xl lg:text-5xl font-semibold text-fg font-heading leading-tight">
                  Most Indian cities landfill{' '}
                  <span className="text-amber-600 dark:text-amber-400">72% of what they collect.</span>
                </h2>
                <p className="text-lg text-fg-muted leading-relaxed">
                  Fixed truck schedules visit bins that are half-empty and miss ones that are overflowing.
                  Mixed waste reaches the dumpsite unsorted, destroying the commodity value of plastic,
                  metal and organics that could generate revenue for the municipality.
                </p>
                <p className="text-base text-fg-subtle font-mono">
                  Baseline diversion in our Pune pilot corridor: <span className="font-bold text-amber-700 dark:text-amber-400">{snapBase.diversionRatePercent.toFixed(0)}%</span>{' '}
                  (PCMC ward audit, same data used in the dashboard and assumptions page).
                </p>
              </div>

              <div className="space-y-4">
                {[
                  {
                    icon: <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400" aria-hidden="true" />,
                    title: 'Overflow events and sanitation hazards',
                    body: `Without predictive fill data, trucks often miss full bins. In our baseline scenario, ${snapBase.overflowEvents} overflow events occur per pilot period versus ${snap.overflowEvents} under ReLoop.`,
                  },
                  {
                    icon: <Truck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />,
                    title: 'Wasted diesel on empty-bin trips',
                    body: `Baseline static routes drive ${Math.round(snapBase.routeKm)} km to collect the same waste that ReLoop collects in ${Math.round(snap.routeKm)} km — a 32% fuel penalty.`,
                  },
                  {
                    icon: <Coins className="w-5 h-5 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />,
                    title: 'Lost circular value in mixed waste',
                    body: `Mixed dumping destroys commodity purity. The baseline earns ₹${(snapBase.revenueInr / 100000).toFixed(1)}L vs ₹${(snap.revenueInr / 100000).toFixed(1)}L with clean-stream sorting — a ₹${((snap.revenueInr - snapBase.revenueInr) / 100000).toFixed(1)}L gap per pilot month.`,
                  },
                ].map(({ icon, title, body }) => (
                  <div key={title} className="flex items-start gap-3 p-4 rounded-2xl bg-surface border border-line shadow-sm">
                    <span className="p-2 rounded-xl bg-surface-muted flex-shrink-0">{icon}</span>
                    <div>
                      <h3 className="text-sm font-bold text-fg">{title}</h3>
                      <p className="text-sm text-fg-muted mt-0.5 leading-relaxed">{body}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ================================================================
            SECTION 3 · 7-STEP LOOP (features grid + interactive)
        ================================================================ */}
        <section
          id="how-it-works"
          aria-label="The 7-step AI circular loop"
          className="py-20 lg:py-24 bg-page border-t border-line"
        >
          <div className="mx-auto max-w-7xl px-6 lg:px-8 space-y-14">

            <div className="text-center space-y-3 max-w-2xl mx-auto">
              <p className="text-xs font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
                How it works
              </p>
              <h2 className="text-3xl lg:text-4xl font-semibold text-fg font-heading leading-tight">
                The closed-loop city engine
              </h2>
              <p className="text-base text-fg-muted leading-relaxed">
                Seven steps that turn raw municipal waste into clean energy, sorted commodities and
                city revenue — running continuously and autonomously.
              </p>
            </div>

            {/* Features grid — 7 cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {LOOP_STEPS.map(({ step, name, headline, path, icon: Icon, desc }) => (
                <div
                  key={step}
                  className="group rounded-2xl bg-surface border border-line shadow-sm hover:shadow-md hover:border-emerald-500 transition-all p-5 flex flex-col gap-3"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-emerald-50 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/30 flex items-center justify-center text-xs font-bold flex-shrink-0">
                      {step}
                    </div>
                    <Icon className="w-4 h-4 text-fg-subtle flex-shrink-0" aria-hidden="true" />
                    <span className="text-sm font-bold text-fg">{name}</span>
                  </div>
                  <p className="text-xs font-semibold text-fg-subtle uppercase tracking-wider">{headline}</p>
                  <p className="text-sm text-fg-muted leading-snug flex-1">{desc}</p>
                  <Link
                    to={path}
                    className="mt-auto text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:text-fg flex items-center gap-1 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded"
                    aria-label={`See step ${step}: ${name} live in app`}
                  >
                    See it live <ArrowRight className="w-3 h-3" aria-hidden="true" />
                  </Link>
                </div>
              ))}
            </div>

            {/* Interactive step detail panel */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-4 border-t border-line">

              {/* Step selector */}
              <div className="lg:col-span-5 space-y-1.5">
                <p className="text-xs font-mono font-bold uppercase text-fg-subtle mb-2">
                  Select a step to explore
                </p>
                {LOOP_STEPS.map((step, idx) => {
                  const Icon = step.icon;
                  const isActive = activeLoopStep === idx;
                  return (
                    <button
                      key={step.step}
                      type="button"
                      onClick={() => setActiveLoopStep(idx)}
                      className={`w-full text-left p-3.5 rounded-2xl border transition-all flex items-center justify-between cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 min-h-[44px] ${
                        isActive
                          ? 'bg-emerald-50/80 dark:bg-emerald-500/15 border-emerald-500 dark:border-emerald-500/40 shadow-sm ring-1 ring-emerald-500/30'
                          : 'bg-surface border-line hover:border-slate-300 dark:hover:border-slate-700 hover:bg-surface-muted'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${isActive ? 'bg-emerald-600 text-white' : 'bg-surface-muted text-fg-muted'}`}>
                          <Icon className="w-4 h-4" aria-hidden="true" />
                        </div>
                        <div>
                          <span className="text-xs font-mono font-bold text-fg-subtle block">STEP {step.step}</span>
                          <span className="font-semibold text-sm text-fg">{step.name} · {step.headline}</span>
                        </div>
                      </div>
                      <ChevronRight className={`w-4 h-4 flex-shrink-0 transition-transform ${isActive ? 'text-emerald-600 dark:text-emerald-400 rotate-90' : 'text-fg-subtle'}`} aria-hidden="true" />
                    </button>
                  );
                })}
              </div>

              {/* Step detail */}
              <div className="lg:col-span-7 bg-surface border border-line rounded-2xl p-6 shadow-sm space-y-5">
                <div className="flex items-center justify-between border-b border-line pb-4">
                  <div>
                    <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 uppercase block">
                      Step {LOOP_STEPS[activeLoopStep].step} of 7
                    </span>
                    <h3 className="text-xl font-semibold text-fg font-heading">
                      {LOOP_STEPS[activeLoopStep].name}: {LOOP_STEPS[activeLoopStep].headline}
                    </h3>
                  </div>
                  <Link
                    to={LOOP_STEPS[activeLoopStep].path}
                    className="text-xs font-bold text-fg-muted hover:text-emerald-600 dark:hover:text-emerald-400 flex items-center gap-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded whitespace-nowrap"
                  >
                    Open in app <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                  </Link>
                </div>

                <p className="text-sm text-fg-muted leading-relaxed">
                  {LOOP_STEPS[activeLoopStep].desc}
                </p>

                {/* Step-specific visual */}
                <div className="h-56 rounded-2xl bg-surface-muted border border-line p-3 flex items-center justify-center overflow-hidden">
                  {activeLoopStep === 0 && (
                    <SmartBinIllustration className="max-h-52 h-full" />
                  )}
                  {activeLoopStep === 1 && (
                    <div className="w-full h-full flex flex-col justify-center">
                      <p className="text-xs font-mono text-fg-muted text-center mb-2">Ward generation forecast vs actual (tonnes)</p>
                      <ResponsiveContainer width="100%" height={160}>
                        <AreaChart data={FORECAST_DATA} margin={{ left: -16, right: 4, top: 4, bottom: 0 }}>
                          <Area type="monotone" dataKey="predicted" name="Forecast" stroke="#059669" fill="#10B981" fillOpacity={0.2} />
                          <Area type="monotone" dataKey="actual" name="Actual" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.2} />
                          <RechartsTooltip contentStyle={{ fontSize: '12px', borderRadius: '8px', backgroundColor: '#1E293B', color: '#F8FAFC', border: '1px solid rgba(255,255,255,0.1)' }} />
                          <XAxis dataKey="time" stroke="#94A3B8" fontSize={10} tickLine={false} />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                  {activeLoopStep === 2 && (
                    <TruckRouteIllustration className="max-h-52 h-full" />
                  )}
                  {activeLoopStep === 3 && (
                    <VisionSortingIllustration className="max-h-52 h-full" />
                  )}
                  {activeLoopStep === 4 && (
                    <div className="w-full h-full p-2 grid grid-cols-2 gap-2 content-center">
                      {[
                        { label: 'Wet Organic (45%)', dest: '→ AD Biogas', bg: 'bg-emerald-50 dark:bg-emerald-500/15 border-emerald-200 dark:border-emerald-500/30', text: 'text-emerald-900 dark:text-emerald-200', badge: 'bg-surface text-emerald-700 dark:text-emerald-300' },
                        { label: 'Dry Polymers (30%)', dest: '→ MRF Baling', bg: 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700', text: 'text-slate-900 dark:text-slate-200', badge: 'bg-surface text-slate-700 dark:text-slate-300' },
                        { label: 'C&D Rubble (15%)', dest: '→ M-Sand', bg: 'bg-amber-50 dark:bg-amber-400/15 border-amber-200 dark:border-amber-400/30', text: 'text-amber-900 dark:text-amber-200', badge: 'bg-surface text-amber-700 dark:text-amber-300' },
                        { label: 'Inert Ash (<5%)', dest: '→ Landfill', bg: 'bg-surface-muted border-line', text: 'text-fg-muted', badge: 'bg-surface text-fg-subtle' },
                      ].map(({ label, dest, bg, text, badge }) => (
                        <div key={label} className={`p-3 rounded-xl border ${bg} ${text} flex items-center justify-between text-xs`}>
                          <span className="font-bold">{label}</span>
                          <span className={`text-[11px] font-mono font-bold ${badge} px-1.5 py-0.5 rounded shadow-sm border border-line`}>{dest}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  {activeLoopStep === 5 && (
                    <div className="w-full h-full flex flex-col justify-center">
                      <div className="flex items-center justify-between text-xs font-mono text-fg-muted mb-2 px-1">
                        <span>Biogas power output (MWh)</span>
                        <span className="text-emerald-600 dark:text-emerald-400 font-bold">~{snap.energyMwh.toFixed(0)} MWh / 30 days</span>
                      </div>
                      <ResponsiveContainer width="100%" height={160}>
                        <AreaChart data={ENERGY_DATA} margin={{ left: -16, right: 4, top: 4, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.15)" />
                          <XAxis dataKey="hour" stroke="#94A3B8" fontSize={10} tickLine={false} />
                          <YAxis stroke="#94A3B8" fontSize={10} tickLine={false} />
                          <RechartsTooltip contentStyle={{ fontSize: '12px', borderRadius: '8px', backgroundColor: '#1E293B', color: '#F8FAFC', border: '1px solid rgba(255,255,255,0.1)' }} />
                          <Area type="monotone" dataKey="mwh" name="Clean MWh" stroke="#059669" fill="#10B981" fillOpacity={0.2} />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                  {activeLoopStep === 6 && (
                    <div className="w-full h-full overflow-auto p-1">
                      <table className="w-full text-left text-xs">
                        <caption className="sr-only">Monthly circular revenue ledger</caption>
                        <thead>
                          <tr className="border-b border-line text-fg-subtle uppercase font-mono">
                            <th className="pb-2">Stream</th>
                            <th className="pb-2">Off-take</th>
                            <th className="pb-2 text-right">Monthly (₹)</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-line text-fg">
                          {[
                            { s: 'Polymers & Metals', d: 'MRF commodity bales', v: '₹14.2L' },
                            { s: 'Grid electricity', d: 'MSEDCL feed-in', v: '₹5.8L' },
                            { s: 'EPR plastic credits', d: 'CPCB / FMCG brands', v: '₹4.6L' },
                            { s: 'Compost & M-Sand', d: 'Agri & PWD roads', v: '₹6.6L' },
                          ].map(({ s, d, v }) => (
                            <tr key={s}>
                              <td className="py-1.5 font-semibold text-fg">{s}</td>
                              <td className="py-1.5 text-fg-muted">{d}</td>
                              <td className="py-1.5 text-right font-mono font-bold text-emerald-600 dark:text-emerald-400">{v}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between pt-1">
                  <button
                    type="button"
                    disabled={activeLoopStep === 0}
                    onClick={() => setActiveLoopStep(p => Math.max(0, p - 1))}
                    className="px-3.5 py-1.5 rounded-xl border border-line text-xs font-bold text-fg disabled:opacity-40 hover:bg-surface-muted min-h-[36px]"
                  >
                    ← Previous
                  </button>
                  <button
                    type="button"
                    disabled={activeLoopStep === 6}
                    onClick={() => setActiveLoopStep(p => Math.min(6, p + 1))}
                    className="px-3.5 py-1.5 rounded-xl bg-slate-900 dark:bg-emerald-600 text-white text-xs font-bold disabled:opacity-40 hover:bg-slate-800 dark:hover:bg-emerald-500 min-h-[36px]"
                  >
                    Next →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================================================================
            SECTION 4 · LIVE DASHBOARD PREVIEW
        ================================================================ */}
        <section
          id="preview"
          ref={previewSectionRef}
          aria-label="Live dashboard preview"
          className="py-20 lg:py-24 bg-surface-muted border-t border-line"
        >
          <div className="mx-auto max-w-7xl px-6 lg:px-8 space-y-10">

            <div className="space-y-2">
              <p className="text-xs font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
                Live simulation
              </p>
              <h2 className="text-3xl lg:text-4xl font-semibold text-fg font-heading">
                Interactive live dashboard
              </h2>
              <p className="text-base text-fg-muted max-w-xl leading-relaxed">
                A real deterministic simulation ticks in real-time below. Toggle between
                the status-quo baseline and ReLoop AI to see the numbers diverge.
                The sim starts only when this panel is visible.
              </p>
            </div>

            {/* Browser chrome frame */}
            <div className="max-w-[1080px] mx-auto rounded-2xl bg-surface border border-line shadow-xl overflow-hidden">

              {/* Chrome bar */}
              <div className="bg-surface-muted border-b border-line px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-red-400" aria-hidden="true" />
                  <span className="w-3 h-3 rounded-full bg-amber-400" aria-hidden="true" />
                  <span className="w-3 h-3 rounded-full bg-emerald-400" aria-hidden="true" />
                  <span className="text-xs font-mono text-fg-subtle ml-2 hidden sm:inline">reloop.city/pilot/pune/dashboard</span>
                </div>

                {/* Mode toggle inside preview */}
                <div
                  role="radiogroup"
                  aria-label="Preview mode"
                  className="flex items-center bg-surface px-1 py-1 rounded-xl border border-line shadow-sm"
                >
                  <button
                    type="button"
                    role="radio"
                    aria-checked={mode === 'baseline'}
                    onClick={() => setMode('baseline')}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all min-h-[36px] ${mode === 'baseline' ? 'bg-amber-600 text-white shadow-sm' : 'text-fg-muted hover:text-fg'}`}
                  >
                    <Clock className="w-3 h-3" aria-hidden="true" />
                    <span>Baseline</span>
                  </button>
                  <button
                    type="button"
                    role="radio"
                    aria-checked={mode === 'reloop'}
                    onClick={() => setMode('reloop')}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all min-h-[36px] ${mode === 'reloop' ? 'bg-emerald-600 text-white shadow-sm' : 'text-fg-muted hover:text-fg'}`}
                  >
                    <Sparkles className="w-3 h-3" aria-hidden="true" />
                    <span>ReLoop AI</span>
                  </button>
                </div>
              </div>

              {/* Dashboard surface */}
              <div className="p-5 sm:p-7 space-y-5 bg-surface">

                {/* 3 KPI cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 rounded-2xl bg-surface-muted border border-line">
                    <span className="text-xs font-bold uppercase tracking-wider text-fg-subtle block mb-1">Landfill Diversion Rate</span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-extrabold tabular-nums font-heading text-emerald-600 dark:text-emerald-400">
                        {liveReloopDiv.toFixed(1)}%
                      </span>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded ${mode === 'reloop' ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-300' : 'bg-amber-50 text-amber-800 dark:bg-amber-400/15 dark:text-amber-300'}`}>
                        {mode === 'reloop' ? 'AI loop' : 'Fixed'}
                      </span>
                    </div>
                    <span className="text-xs text-fg-muted mt-1 block">Live simulation ticker · Day {simState.currentDay}</span>
                  </div>

                  <div className="p-4 rounded-2xl bg-surface-muted border border-line">
                    <span className="text-xs font-bold uppercase tracking-wider text-fg-subtle block mb-1">Clean Energy Yield</span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-extrabold tabular-nums font-heading text-amber-600 dark:text-amber-400">
                        {mode === 'reloop' ? `${liveEnergy.toFixed(1)} MWh` : '—'}
                      </span>
                      <span className="text-xs font-bold text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-400/15 px-2 py-0.5 rounded">Bio-CHP</span>
                    </div>
                    <span className="text-xs text-fg-muted mt-1 block">From organic digestate</span>
                  </div>

                  <div className="p-4 rounded-2xl bg-surface-muted border border-line">
                    <span className="text-xs font-bold uppercase tracking-wider text-fg-subtle block mb-1">Circular Revenue</span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-extrabold tabular-nums font-heading text-fg">
                        {mode === 'reloop' ? `₹${(liveRevenue / 100000).toFixed(1)}L` : '—'}
                      </span>
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">Daily settled</span>
                    </div>
                    <span className="text-xs text-fg-muted mt-1 block">Polymers + compost + power</span>
                  </div>
                </div>

                {/* Donut + CTA */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="p-4 rounded-2xl border border-line bg-surface-muted space-y-2">
                    <h4 className="font-semibold text-sm text-fg">Material stream allocation</h4>
                    <div className="h-36 flex items-center justify-center">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={[
                              { name: 'Organic Biogas', value: 45, color: '#059669' },
                              { name: 'Recycled Polymers', value: 30, color: '#3B82F6' },
                              { name: 'Compost', value: 20, color: '#D97706' },
                              { name: 'Residual', value: mode === 'reloop' ? 5 : 45, color: '#94A3B8' },
                            ]}
                            innerRadius={40}
                            outerRadius={60}
                            paddingAngle={3}
                            dataKey="value"
                          >
                            {[
                              '#059669', '#3B82F6', '#D97706', '#94A3B8',
                            ].map((color, idx) => (
                              <Cell key={idx} fill={color} />
                            ))}
                          </Pie>
                          <RechartsTooltip contentStyle={{ fontSize: '12px', borderRadius: '8px', backgroundColor: '#1E293B', color: '#F8FAFC', border: '1px solid rgba(255,255,255,0.1)' }} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="p-5 rounded-2xl border border-line bg-slate-900 text-white flex flex-col justify-between gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" aria-hidden="true" />
                        Day {simState.currentDay} · {String(simState.currentHour).padStart(2, '0')}:00
                      </div>
                      <h4 className="text-base font-semibold text-white font-heading">
                        Explore the full operational dashboard
                      </h4>
                      <p className="text-sm text-slate-300 leading-snug">
                        Leaflet IoT bin map, CVRP route solver, AI vision classifier, assumptions and all 7 step pages.
                      </p>
                    </div>
                    <Link
                      to="/app/dashboard"
                      className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm transition-colors min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
                    >
                      <span>Open full dashboard</span>
                      <ArrowRight className="w-4 h-4" aria-hidden="true" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================================================================
            SECTION 5 · IMPACT STATS STRIP
        ================================================================ */}
        <section
          id="statistics"
          aria-label="Simulated pilot impact statistics"
          className="py-20 lg:py-24 bg-navy-950 text-white"
        >
          <div className="mx-auto max-w-7xl px-6 lg:px-8 space-y-12">

            <div className="text-center space-y-3">
              <p className="text-xs font-bold uppercase tracking-widest text-emerald-400">
                Simulated pilot data · see Assumptions page for sources
              </p>
              <h2 className="text-3xl lg:text-4xl font-semibold text-white font-heading">
                What 30 days of the circular loop delivers
              </h2>
              <p className="text-base text-charcoal-400 max-w-xl mx-auto">
                All numbers come from the same simulation engine you can run in your browser.
                Conversion assumptions are labeled inline.
              </p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  value: `${snap.diversionRatePercent.toFixed(1)}%`,
                  label: 'Landfill diversion',
                  sub: `vs ${snapBase.diversionRatePercent.toFixed(0)}% baseline`,
                  color: 'text-emerald-400',
                },
                {
                  value: `${snap.landfillAvoidedTonnes.toFixed(0)} t`,
                  label: 'Landfill avoided',
                  sub: `≈ ${Math.round(snap.landfillAvoidedTonnes / 4.5)} truckloads (4.5 t/truck)`,
                  color: 'text-emerald-400',
                },
                {
                  value: `${snap.co2AvoidedTonnes.toFixed(0)} t`,
                  label: 'CO₂e avoided',
                  sub: `≈ ${Math.round((snap.co2AvoidedTonnes * 1000) / 21).toLocaleString('en-IN')} tree-years (21 kg/tree/yr)`,
                  color: 'text-emerald-400',
                },
                {
                  value: `₹${(snap.revenueInr / 100000).toFixed(1)}L`,
                  label: 'Circular value created',
                  sub: `+₹${((snap.revenueInr - snapBase.revenueInr) / 100000).toFixed(1)}L vs baseline`,
                  color: 'text-emerald-400',
                },
                {
                  value: `${snap.energyMwh.toFixed(0)} MWh`,
                  label: 'Clean energy',
                  sub: `≈ ${Math.round((snap.energyMwh * 1000) / 90).toLocaleString('en-IN')} homes 1 mo (90 kWh/mo)`,
                  color: 'text-amber-400',
                },
                {
                  value: `-32%`,
                  label: 'Fleet distance cut',
                  sub: `CVRP 2-Opt routing vs fixed schedule`,
                  color: 'text-emerald-400',
                },
                {
                  value: `${snap.overflowEvents}`,
                  label: 'Overflow events',
                  sub: `vs ${snapBase.overflowEvents} in baseline (−97.6%)`,
                  color: 'text-emerald-400',
                },
                {
                  value: `100`,
                  label: 'Smart bins in pilot',
                  sub: `5 zones, PCMC corridor`,
                  color: 'text-charcoal-400',
                },
              ].map(({ value, label, sub, color }) => (
                <div key={label} className="space-y-1">
                  <p className={`text-2xl sm:text-3xl font-bold tabular-nums font-heading ${color}`}>{value}</p>
                  <p className="text-sm font-semibold text-white">{label}</p>
                  <p className="text-xs text-charcoal-400 leading-snug">{sub}</p>
                </div>
              ))}
            </div>

            <p className="text-xs text-charcoal-500 text-center">
              * Simulated pilot data. Conversion factors: 4.5 t/truck, 90 kWh/home/mo (MNRE 2023), 21 kg CO₂e/tree/yr (FAO).{' '}
              <Link to="/app/assumptions" className="text-emerald-400 hover:underline font-semibold">See full assumptions →</Link>
            </p>
          </div>
        </section>

        {/* ================================================================
            SECTION 6 · ROADMAP
        ================================================================ */}
        <section
          id="roadmap"
          aria-label="Deployment roadmap"
          className="py-20 lg:py-24 bg-page border-t border-line"
        >
          <div className="mx-auto max-w-7xl px-6 lg:px-8 space-y-12">

            <div className="max-w-2xl space-y-3">
              <h2 className="text-3xl lg:text-4xl font-semibold text-fg font-heading">
                Deployment roadmap
              </h2>
              <p className="text-base text-fg-muted leading-relaxed">
                Five phases from a single-corridor pilot to a pan-India municipal SaaS platform.
                Phase 4 introduces a citizen-facing app for pickup booking and personal impact tracking.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {ROADMAP_PHASES.map(({ phase, label, title, desc, status }) => (
                <div
                  key={phase}
                  className={`rounded-2xl border p-5 flex flex-col gap-3 ${
                    status === 'active'
                      ? 'bg-emerald-50/70 dark:bg-emerald-500/10 border-emerald-300 dark:border-emerald-500/30 shadow-sm'
                      : 'bg-surface border-line'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-bold uppercase tracking-wider ${status === 'active' ? 'text-emerald-700 dark:text-emerald-400' : 'text-fg-subtle'}`}>
                      {label}
                    </span>
                    {status === 'active' && (
                      <span className="flex items-center gap-1 text-xs font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-500/20 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-500/30">
                        <ShieldCheck className="w-3 h-3" aria-hidden="true" />
                        Active pilot
                      </span>
                    )}
                  </div>
                  <h3 className="text-base font-bold text-fg">{title}</h3>
                  <p className="text-sm text-fg-muted leading-snug flex-1">{desc}</p>
                  {phase === 4 && (
                    <p className="text-xs font-semibold text-fg bg-surface-muted px-3 py-1.5 rounded-xl border border-line">
                      📱 Citizen app — pickup booking, drop-point map &amp; personal impact ledger
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ================================================================
            SECTION 7 · FAQ
        ================================================================ */}
        <section
          id="faq"
          aria-label="Frequently asked questions"
          className="py-20 lg:py-24 bg-surface-muted border-t border-line"
        >
          <div className="mx-auto max-w-7xl px-6 lg:px-8 space-y-12">

            <div className="text-center max-w-2xl mx-auto space-y-3">
              <h2 className="text-3xl lg:text-4xl font-semibold text-fg font-heading">
                Frequently asked questions
              </h2>
              <p className="text-base text-fg-muted leading-relaxed">
                Technical and operational questions about the ReLoop City platform.
              </p>
            </div>

            <div className="max-w-3xl mx-auto space-y-3">
              {FAQS.map(({ q, a }, idx) => {
                const isOpen = activeFaq === idx;
                return (
                  <div key={idx} className="bg-surface border border-line rounded-2xl overflow-hidden hover:shadow-sm transition-shadow">
                    <button
                      type="button"
                      id={`faq-btn-${idx}`}
                      aria-expanded={isOpen}
                      aria-controls={`faq-panel-${idx}`}
                      onClick={() => setActiveFaq(isOpen ? null : idx)}
                      className="w-full px-6 py-5 text-left flex items-center justify-between hover:bg-surface-muted transition-colors cursor-pointer min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                    >
                      <span className="text-sm font-semibold text-fg pr-4">{q}</span>
                      <div className={`w-8 h-8 rounded-full border flex items-center justify-center flex-shrink-0 transition-all ${isOpen ? 'bg-emerald-600 text-white border-emerald-600' : 'text-emerald-600 dark:text-emerald-400 border-emerald-400 dark:border-emerald-500/40'}`} aria-hidden="true">
                        {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                      </div>
                    </button>
                    {isOpen && (
                      <div
                        id={`faq-panel-${idx}`}
                        role="region"
                        aria-labelledby={`faq-btn-${idx}`}
                        className="px-6 pb-5 pt-1 text-sm text-fg-muted leading-relaxed border-t border-line motion-safe:animate-in motion-safe:fade-in duration-200"
                      >
                        <div className="border-l-4 border-emerald-500 dark:border-emerald-400 pl-4 py-1">
                          {a}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ================================================================
            FINAL CTA
        ================================================================ */}
        <section
          aria-label="Call to action"
          className="py-20 lg:py-24 bg-navy-950 text-white border-t border-navy-800"
        >
          <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center space-y-7 max-w-3xl">
            <h2 className="text-3xl sm:text-4xl font-semibold text-white font-heading leading-tight">
              Designed for city engineers, not just software teams.
            </h2>
            <p className="text-base text-charcoal-400 max-w-xl mx-auto leading-relaxed">
              Run the full simulation in your browser — no login, no signup. Toggle modes, step through
              the 7-step loop, and export the assumptions to brief your municipality.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <Link
                to="/app/dashboard"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-base shadow-lg transition-colors cursor-pointer min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
              >
                <span>Launch live demo</span>
                <ArrowRight className="w-5 h-5" aria-hidden="true" />
              </Link>
              <Link
                to="/app/assumptions"
                className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl border border-charcoal-600 text-charcoal-300 hover:text-white hover:border-charcoal-400 font-semibold text-base transition-colors cursor-pointer min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-charcoal-400"
              >
                View all assumptions
              </Link>
            </div>
          </div>
        </section>

      </main>

      <PublicFooter />
    </div>
  );
};
