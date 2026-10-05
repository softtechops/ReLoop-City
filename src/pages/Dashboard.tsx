import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { computeMetrics, PILOT_30DAY_SNAPSHOT, assertMetricsIntegrity } from '../lib/metrics';
import { safeFormatCurrencyINR, safeFormatTonnage, safeFormatMwh, formatTonnage } from '../lib/formatters';
import { PageHeader } from '../components/ui/PageHeader';
import { StatCard } from '../components/ui/StatCard';
import { SectionCard } from '../components/ui/SectionCard';
import { Skeleton } from '../components/ui/Skeleton';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import {
  Sparkles,
  Leaf,
  Zap,
  Coins,
  Recycle,
  Clock,
  Table as TableIcon,
  Play,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  Truck,
  Info,
  Radio,
  TrendingUp,
  Route as RouteIcon,
  ScanSearch,
  GitFork,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  FlaskConical,
  Star,
  SlidersHorizontal,
  Layers,
  X,
  FileCheck2,
} from 'lucide-react';
import { ExportReportMenu } from '../components/ExportReportMenu';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';

// ─── Loop step mini cards data ─────────────────────────────────────────────
const LOOP_STEPS = [
  {
    step: 1,
    name: 'Sense',
    path: '/app/map',
    icon: Radio,
    desc: 'Live fill telemetry from 100 smart bins across 5 pilot zones.',
  },
  {
    step: 2,
    name: 'Predict',
    path: '/app/predict',
    icon: TrendingUp,
    desc: 'LSTM model forecasts bin overflow 24 hours ahead by zone.',
  },
  {
    step: 3,
    name: 'Optimize',
    path: '/app/optimize',
    icon: RouteIcon,
    desc: 'CVRP routing dispatches trucks only when bins exceed 75% fill.',
  },
  {
    step: 4,
    name: 'Classify',
    path: '/app/classify',
    icon: ScanSearch,
    desc: 'Optical sorting separates polymers, metals, organics at 95%+ purity.',
  },
  {
    step: 5,
    name: 'Allocate',
    path: '/app/allocate',
    icon: GitFork,
    desc: 'Material streams routed to MRF, AD plant, or composting facility.',
  },
  {
    step: 6,
    name: 'Forecast',
    path: '/app/forecast',
    icon: Zap,
    desc: 'Biogas CHP converts organic digestate into grid electricity.',
  },
  {
    step: 7,
    name: 'Report',
    path: '/app/revenue',
    icon: Coins,
    desc: 'Revenue, CO₂ diversion and EPR credits settled transparently.',
  },
];

// ─── Methodology accordion items ───────────────────────────────────────────
const METHODOLOGY_ITEMS = [
  {
    title: 'Landfill diversion rate',
    body: 'Diversion rate = (collectedTonnes − landfilledTonnes) / collectedTonnes × 100. Baseline uses fixed daily schedules; ReLoop uses predictive dispatch with 75% dispatch threshold. Baseline calibrated at 28.0% from PCMC ward audit data.',
  },
  {
    title: 'Fleet distance & fuel saved',
    body: 'Route km = collectedTonnes × 9.57 km/t (empirical PCMC compactor factor). ReLoop applies CVRP 2-Opt routing, reducing km by 32%. Fuel cost = routeKm ÷ 3.2 km/L × ₹92.50/L.',
  },
  {
    title: 'Clean energy yield (MWh)',
    body: 'Biogas = organicTonnes × 110 m³/t. Electricity = biogas × 2.1 kWh/m³ (CHP efficiency ~38%). Conversion factors set in src/config/config.ts.',
  },
  {
    title: 'Circular revenue (₹)',
    body: 'Revenue = Σ(stream tonnage × market price). Streams: HDPE/PET flakes ₹42k/t, aluminium ₹68k/t, compost ₹3.2k/t, electricity ₹6.80/kWh, RDF ₹2.4k/t, EPR credits ₹3.5k/t. Prices are pilot tariff assumptions in config.ts.',
  },
];

// ─── Collapsible Accordion ──────────────────────────────────────────────────
const AccordionItem: React.FC<{
  title: string;
  body: string;
  open: boolean;
  onToggle: () => void;
  id: string;
}> = ({ title, body, open, onToggle, id }) => (
  <div className="border-b border-charcoal-100 last:border-0">
    <button
      type="button"
      id={`acc-btn-${id}`}
      aria-expanded={open}
      aria-controls={`acc-panel-${id}`}
      onClick={onToggle}
      className="w-full flex items-center justify-between py-3.5 text-left text-sm font-semibold text-navy-900 hover:text-emerald-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded-lg px-1 min-h-[44px]"
    >
      <span>{title}</span>
      {open ? (
        <ChevronUp className="w-4 h-4 flex-shrink-0 text-charcoal-400" aria-hidden="true" />
      ) : (
        <ChevronDown className="w-4 h-4 flex-shrink-0 text-charcoal-400" aria-hidden="true" />
      )}
    </button>
    {open && (
      <div
        id={`acc-panel-${id}`}
        role="region"
        aria-labelledby={`acc-btn-${id}`}
        className="pb-4 px-1 text-sm text-charcoal-600 leading-relaxed"
      >
        {body}{' '}
        <Link to="/app/assumptions" className="text-emerald-700 font-semibold hover:underline">
          View Assumptions →
        </Link>
      </div>
    )}
  </div>
);

// ─── Main Dashboard component ───────────────────────────────────────────────
export const Dashboard: React.FC = () => {
  const {
    simState,
    mode,
    setMode,
    config,
    isSimRunning,
    simSpeed,
    startSimulation,
    dashboardTimeRange,
    setDashboardTimeRange,
    roleCardDismissed,
    dismissRoleCard,
    resetRoleCard,
    priorityBinIds,
    clearPriorityBins,
    savedScenarios,
    activeScenarioId,
    flaggedZoneId,
    allocationStrategy,
    energyOfftakeCommitment,
    councilReportApproved,
  } = useStore();

  const activeScenario = useMemo(() => {
    if (!activeScenarioId) return null;
    return savedScenarios.find((s) => s.id === activeScenarioId) || null;
  }, [savedScenarios, activeScenarioId]);

  const [showDataTableFallback, setShowDataTableFallback] = useState(false);
  const [openAccordionIndex, setOpenAccordionIndex] = useState<number | null>(null);
  const [isReady, setIsReady] = useState(false);

  // Auto-start simulation on first dashboard mount if not already running
  useEffect(() => {
    const hasAutoStarted = sessionStorage.getItem('reloop_sim_auto_started');
    if (!hasAutoStarted) {
      sessionStorage.setItem('reloop_sim_auto_started', 'true');
      if (!isSimRunning) {
        startSimulation();
      }
    }
    // Brief delay so initial metrics appear non-zero before display
    const t = setTimeout(() => setIsReady(true), 300);
    return () => clearTimeout(t);
  }, [isSimRunning, startSimulation]);

  // Compute unified metrics from single source of truth
  const metrics = useMemo(() => {
    const comp = computeMetrics(simState, config, mode);
    assertMetricsIntegrity(comp);
    return comp;
  }, [simState, config, mode]);

  const activeMetrics = metrics.active;
  const baselineMetrics = metrics.baseline;
  const reloopMetrics = metrics.reloop;
  const deltas = metrics.deltas;

  // Use PILOT_30DAY_SNAPSHOT as fallback when sim hasn't accumulated data yet
  const snap = PILOT_30DAY_SNAPSHOT;
  const displayActive = activeMetrics.collectedTonnes > 0 ? activeMetrics : (mode === 'reloop' ? snap.reloop : snap.baseline);
  const displayBaseline = baselineMetrics.collectedTonnes > 0 ? baselineMetrics : snap.baseline;
  const displayReloop = reloopMetrics.collectedTonnes > 0 ? reloopMetrics : snap.reloop;
  const displayDeltas = activeMetrics.collectedTonnes > 0 ? deltas : snap.deltas;

  // Real-world impact comparisons derived from config assumptions
  const homesMonthly = Math.round((displayActive.energyMwh * 1000) / config.kwhPerHomePerMonth);
  const carKmOffset = Math.round((displayActive.co2AvoidedTonnes * 1000) / config.kgCo2ePerCarKm);
  const treesEquivalent = Math.round((displayActive.co2AvoidedTonnes * 1000) / config.kgCo2ePerTreePerYear);
  const landfillTrucks = Math.round(displayActive.landfillAvoidedTonnes / config.truckCapacityTonnes);

  // Donut chart data
  const donutData = useMemo(() => [
    { name: 'Recycled Polymers & Metals', value: displayActive.recycledTonnes, color: '#12305C' },
    { name: 'Organic City Compost', value: displayActive.compostedTonnes, color: '#059669' },
    { name: 'Clean Energy (organic equiv.)', value: Number(((displayActive.energyMwh / 0.231) * 0.1).toFixed(1)), color: '#D97706' },
    { name: 'Residual Landfill (inert)', value: displayActive.landfilledTonnes, color: '#64748B' },
  ], [displayActive]);

  // Time series chart
  const timeSeriesData = useMemo(() => {
    let sliced = simState.history;
    if (dashboardTimeRange === 'today') sliced = simState.history.slice(-8);
    else if (dashboardTimeRange === '7days') sliced = simState.history.slice(-14);
    return sliced.map((step) => {
      const dataForMode = mode === 'reloop' ? step.reloop : step.baseline;
      return {
        timestamp: step.timestamp,
        wasteCollected: dataForMode.collectedTonnes,
        landfillAvoided: dataForMode.landfillAvoidedTonnes,
        recycled: dataForMode.recycledTonnes,
      };
    });
  }, [simState.history, dashboardTimeRange, mode]);

  // Priority bins flagged by operations manager
  const priorityBins = useMemo(() => {
    return simState.bins.filter((b) => priorityBinIds.includes(b.id));
  }, [simState.bins, priorityBinIds]);

  // Bins above 80% — live alerts
  const alertBins = useMemo(() => {
    return simState.bins
      .filter((b) => b.fillPercent >= 80)
      .slice(0, 5)
      .sort((a, b) => b.fillPercent - a.fillPercent);
  }, [simState.bins]);

  // Live metric for each loop step (cheap to compute)
  const stepLiveMetrics: Record<number, string> = useMemo(() => ({
    1: `${alertBins.length} bin${alertBins.length !== 1 ? 's' : ''} above 80%`,
    2: `${simState.bins.filter(b => b.predictedHoursToFull > 0 && b.predictedHoursToFull <= 6).length} overflow risk in 6 h`,
    3: deltas.routeKm.formattedDelta + ' distance vs baseline',
    4: `${simState.bins.filter(b => b.isScheduledForPickup).length} bins scheduled for pickup`,
    5: `${safeFormatTonnage(displayActive.compostedTonnes)} composted`,
    6: `${safeFormatMwh(displayActive.energyMwh)} generated`,
    7: safeFormatCurrencyINR(displayActive.revenueInr) + ' circular value',
  }), [alertBins, simState.bins, deltas, displayActive]);

  // Headline copy
  const headlineCopy = mode === 'reloop'
    ? `ReLoop diverts ${displayActive.diversionRatePercent.toFixed(1)}% of waste from landfill, up from ${displayBaseline.diversionRatePercent.toFixed(1)}% at baseline.`
    : `Baseline fixed routes send ${(100 - displayBaseline.diversionRatePercent).toFixed(1)}% of collected waste to landfill — ${displayDeltas.diversionRate.formattedDelta} less diversion than ReLoop AI.`;

  // Collection peak from history
  const collectionPeakHour = useMemo(() => {
    if (!simState.history.length) return '08:00–10:00';
    const peak = simState.history.reduce((best, cur) =>
      (cur.reloop.collectedTonnes > best.reloop.collectedTonnes ? cur : best),
      simState.history[0]
    );
    return peak.timestamp;
  }, [simState.history]);

  if (!isReady) {
    return (
      <div className="space-y-6 pb-12" role="status" aria-label="Loading dashboard...">
        <Skeleton className="h-10 w-1/3" />
        <Skeleton className="h-28 rounded-2xl" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-40 rounded-2xl" />)}
        </div>
        <Skeleton className="h-20 rounded-2xl" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-72 rounded-2xl" />
          <Skeleton className="h-72 rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">

      {/* ── Page Header with Scenario Chip & Export ──────────────────────── */}
      <PageHeader
        title="Dashboard"
        subtitle="Circular mass balance, fleet efficiency and fiscal returns for the Pune PCMC pilot corridor."
        showBackToDashboard={false}
        actions={
          <div className="flex flex-wrap items-center gap-3">
            {activeScenario ? (
              <Link
                to="/app/scenarios"
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-300 text-xs font-bold text-emerald-800 hover:bg-emerald-100 transition-colors shadow-xs"
                title="Click to view or edit this custom scenario"
              >
                <FlaskConical className="w-3.5 h-3.5 text-emerald-600" />
                <span>Active: {activeScenario.name}</span>
              </Link>
            ) : (
              <Link
                to="/app/scenarios"
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-navy-50 border border-navy-200 text-xs font-bold text-navy-800 hover:bg-navy-100 transition-colors"
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-navy-600" />
                <span>Default ReLoop Scenario</span>
              </Link>
            )}
            <ExportReportMenu />
          </div>
        }
      />

      {/* ── Role Card (Feature 1: Dismissible, remembered via localStorage) ── */}
      {!roleCardDismissed ? (
        <section
          aria-label="Manager role and mission"
          className="relative p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-navy-900 via-navy-800 to-navy-950 text-white shadow-sm border border-navy-700/60"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="p-3 rounded-xl bg-white/10 text-amberGold-300 border border-white/15 flex-shrink-0">
                <ShieldCheck className="w-6 h-6 text-amberGold-300" />
              </div>
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-bold tracking-wider uppercase text-amberGold-300">
                    Operations Manager Role
                  </span>
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-white/15 text-navy-100 font-mono">
                    Akurdi–Chinchwad–Moshi Pilot
                  </span>
                </div>
                <h2 className="text-base sm:text-lg font-bold text-white leading-snug">
                  You are the City Waste Operations Manager for the Akurdi–Chinchwad–Moshi pilot.
                </h2>
                <p className="text-sm text-navy-100 leading-relaxed max-w-3xl">
                  <strong className="text-white">Your goal:</strong> raise landfill diversion and cut fleet cost.{' '}
                  <strong className="text-white">Decisions you can make:</strong> which bins to collect, how many trucks to run, where each waste stream goes.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 self-end md:self-center flex-shrink-0">
              <button
                type="button"
                onClick={dismissRoleCard}
                className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/20 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 min-h-[44px] cursor-pointer"
                aria-label="Dismiss operations manager role card"
              >
                Dismiss
              </button>
            </div>
          </div>
        </section>
      ) : (
        <div className="flex items-center justify-between px-3.5 py-2 rounded-xl bg-navy-50/70 border border-navy-100 text-xs text-charcoal-600">
          <span className="flex items-center gap-1.5 font-medium text-navy-900">
            <ShieldCheck className="w-3.5 h-3.5 text-navy-700" />
            Operations Manager Mode Active · Akurdi–Chinchwad–Moshi Corridor
          </span>
          <button
            type="button"
            onClick={resetRoleCard}
            className="text-xs text-navy-700 hover:text-emerald-700 font-semibold underline cursor-pointer min-h-[36px] flex items-center"
          >
            Show role card
          </button>
        </div>
      )}

      {/* ── 1. Headline result + Baseline / ReLoop toggle ──────────────── */}
      <section
        aria-label="Executive summary and mode control"
        className="p-5 sm:p-6 rounded-2xl bg-white border border-charcoal-200 shadow-sm"
      >
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-5">
          {/* Headline */}
          <div className="space-y-1.5 flex-1 min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wider text-charcoal-500">
              Live model outcome · Akurdi–Chinchwad–Moshi corridor
            </p>
            <p
              key={mode}
              className="text-lg sm:text-xl font-semibold text-navy-900 leading-snug motion-safe:animate-in motion-safe:fade-in duration-300"
            >
              {headlineCopy}
            </p>
          </div>

          {/* Mode switch + status */}
          <div className="flex flex-wrap items-center gap-3 flex-shrink-0">
            {/* Status chip */}
            <div
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-mono font-semibold ${
                isSimRunning
                  ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
                  : 'bg-charcoal-50 text-charcoal-700 border-charcoal-200'
              }`}
              aria-label={isSimRunning ? 'Simulation running' : 'Simulation paused'}
            >
              <span
                className={`w-2 h-2 rounded-full flex-shrink-0 ${isSimRunning ? 'bg-emerald-600' : 'bg-charcoal-400'}`}
                aria-hidden="true"
              />
              <span>{isSimRunning ? 'RUN' : 'PAUSED'}</span>
              <span className="text-charcoal-400" aria-hidden="true">·</span>
              <span>Day {simState.currentDay} · {simSpeed}×</span>
            </div>

            {/* Baseline ↔ ReLoop toggle */}
            <div
              role="radiogroup"
              aria-label="Simulation operational mode"
              className="flex items-center bg-charcoal-100 p-1 rounded-2xl border border-charcoal-200 shadow-inner"
            >
              <button
                type="button"
                role="radio"
                aria-checked={mode === 'baseline'}
                onClick={() => setMode('baseline')}
                className={`flex items-center gap-1.5 px-4 py-2 min-h-[44px] rounded-xl text-sm font-bold transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 ${
                  mode === 'baseline'
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'text-charcoal-700 hover:text-navy-900 hover:bg-white/60'
                }`}
              >
                <Clock className="w-4 h-4" aria-hidden="true" />
                <span>Baseline</span>
                <span className="hidden md:inline font-normal text-xs opacity-80">(Fixed)</span>
              </button>
              <button
                type="button"
                role="radio"
                aria-checked={mode === 'reloop'}
                onClick={() => setMode('reloop')}
                className={`flex items-center gap-1.5 px-4 py-2 min-h-[44px] rounded-xl text-sm font-bold transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 ${
                  mode === 'reloop'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-charcoal-700 hover:text-navy-900 hover:bg-white/60'
                }`}
              >
                <Sparkles className="w-4 h-4" aria-hidden="true" />
                <span>ReLoop</span>
                <span className="hidden md:inline font-normal text-xs opacity-80">(AI)</span>
              </button>
            </div>
          </div>
        </div>

        {/* Paused nudge */}
        {!isSimRunning && (
          <div className="mt-4 pt-3 border-t border-charcoal-100 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs text-amber-700">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
              <span>Simulation paused. Press Run in the header to stream live bin updates.</span>
            </div>
            <button
              type="button"
              onClick={startSimulation}
              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer min-h-[36px]"
            >
              <Play className="w-3.5 h-3.5 fill-current" aria-hidden="true" />
              Resume
            </button>
          </div>
        )}
      </section>

      {/* ── Feature 1: "Your decisions" Panel ──────────────────────────── */}
      <section
        aria-label="Current operational decisions"
        className="p-5 sm:p-6 rounded-2xl bg-white border border-navy-100 shadow-sm"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-charcoal-100">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-navy-900 flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-emerald-600" />
              Your Decisions & Active Scenario
            </h2>
            <p className="text-xs text-charcoal-600 mt-0.5">
              Live operational controls set across the 7 loop steps affecting model outcomes.
            </p>
          </div>
          <Link
            to="/app/scenarios"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-navy-50 hover:bg-navy-100 text-xs font-bold text-navy-800 transition-colors self-start sm:self-auto min-h-[36px]"
          >
            <span>Scenario Builder</span>
            <ArrowRight className="w-3.5 h-3.5 text-navy-600" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
          {/* Decision 1: Active Scenario */}
          <div className="p-3.5 rounded-xl bg-navy-50/50 border border-navy-100 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-charcoal-500">
                Active Scenario
              </span>
              <Badge variant={activeScenario ? 'emerald' : 'navy'} size="sm">
                {activeScenario ? 'Custom' : 'Default'}
              </Badge>
            </div>
            <p className="text-sm font-bold text-navy-900 truncate">
              {activeScenario ? activeScenario.name : 'Default ReLoop Plan'}
            </p>
            <p className="text-xs text-charcoal-600">
              {activeScenario
                ? `${activeScenario.config.numberOfTrucks || 4} trucks · ${Math.round((activeScenario.config.dispatchFillThreshold ?? 0.75) * 100)}% threshold`
                : '4 trucks · 75% fill threshold · 4.5 t cap'}
            </p>
          </div>

          {/* Decision 2: Priority Flagged Bins */}
          <div className="p-3.5 rounded-xl bg-amber-50/50 border border-amber-200/70 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800 flex items-center gap-1">
                <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                Priority Bins
              </span>
              <span className="text-xs font-mono font-bold text-amber-900">
                {priorityBinIds.length} flagged
              </span>
            </div>
            {priorityBinIds.length > 0 ? (
              <div className="space-y-1.5">
                <div className="flex flex-wrap gap-1 max-h-12 overflow-y-auto">
                  {priorityBinIds.map((id) => (
                    <span
                      key={id}
                      className="inline-flex items-center px-1.5 py-0.5 rounded text-[11px] font-mono font-bold bg-amber-200/70 text-amber-900"
                    >
                      {id}
                    </span>
                  ))}
                </div>
                <div className="flex items-center justify-between text-[11px] pt-1">
                  <Link to="/app/map" className="text-emerald-700 font-bold hover:underline">
                    View on Map →
                  </Link>
                  <button
                    type="button"
                    onClick={clearPriorityBins}
                    className="text-charcoal-500 hover:text-red-700 underline cursor-pointer"
                  >
                    Clear all
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-1">
                <p className="text-xs text-charcoal-600">No bins currently flagged.</p>
                <Link to="/app/map" className="text-xs text-emerald-700 font-semibold hover:underline block">
                  Flag bins on Sense map →
                </Link>
              </div>
            )}
          </div>

          {/* Decision 3: Stream Allocation & Clean Energy */}
          <div className="p-3.5 rounded-xl bg-emerald-50/50 border border-emerald-200/70 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">
                Material & Energy
              </span>
              <Badge variant="emerald" size="sm">
                Optimized
              </Badge>
            </div>
            <p className="text-xs font-bold text-navy-900">
              Strategy: {allocationStrategy === 'balanced' ? 'Balanced Diversion' : allocationStrategy === 'max_energy' ? 'Max Bio-Energy' : 'Max Material Recovery'}
            </p>
            <p className="text-xs text-charcoal-600 truncate">
              Offtake: {energyOfftakeCommitment === 'grid' ? 'MSEDCL Grid Feed-in (₹6.80)' : 'PMPML EV Bus Depot (₹7.20)'}
            </p>
            <Link to="/app/allocate" className="text-[11px] text-emerald-700 font-bold hover:underline block pt-0.5">
              Change stream split →
            </Link>
          </div>

          {/* Decision 4: Council Ledger Status */}
          <div className="p-3.5 rounded-xl bg-navy-50/50 border border-navy-100 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-charcoal-500">
                Council Submission
              </span>
              <Badge variant={councilReportApproved ? 'emerald' : 'amber'} size="sm">
                {councilReportApproved ? 'Certified' : 'Draft'}
              </Badge>
            </div>
            <p className="text-xs font-bold text-navy-900">
              {councilReportApproved ? 'Approved by Operations Mgr' : 'Sign-off Pending'}
            </p>
            <p className="text-xs text-charcoal-600">
              {councilReportApproved
                ? 'Ready for PCMC Standing Committee review.'
                : 'Review 6 circular revenue streams.'}
            </p>
            <Link to="/app/revenue" className="text-[11px] text-navy-700 font-bold hover:underline block pt-0.5">
              Open council report →
            </Link>
          </div>
        </div>
      </section>

      {/* ── 2. Four large KPI cards ──────────────────────────────────────── */}
      <section aria-label="Key performance indicators">
        <h2 className="text-xs font-bold uppercase tracking-wider text-charcoal-500 px-1 mb-3">
          Primary KPIs
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {/* KPI 1: Landfill Diverted */}
          <StatCard
            isHero
            title="Landfill Diverted"
            value={safeFormatTonnage(displayActive.landfillAvoidedTonnes)}
            unit={`${displayActive.diversionRatePercent.toFixed(1)}% diversion`}
            calculationInfo="Gross municipal tonnage diverted from Moshi dumpsite via recycling, anaerobic digestion, composting and RDF recovery."
            delta={mode === 'reloop' ? {
              percentStr: displayDeltas.diversionRate.formattedDelta,
              isPositive: true,
              isNeutral: false,
              isImprovement: true,
              ariaLabel: `${displayDeltas.diversionRate.formattedDelta} higher diversion than baseline`,
            } : undefined}
            deltaLabel="vs Baseline"
            accentColor="emerald"
            icon={<Leaf className="w-5 h-5 text-emerald-600" />}
          />

          {/* KPI 2: Fleet Distance Saved */}
          <StatCard
            isHero
            title="Fleet Distance"
            value={`${displayActive.routeKm.toFixed(0)} km`}
            unit={mode === 'reloop' ? 'AI-optimised route' : 'fixed route'}
            calculationInfo="Total km driven by 4-truck fleet. ReLoop CVRP 2-Opt routing skips bins below 75% fill, saving 32% distance vs baseline."
            delta={mode === 'reloop' ? {
              percentStr: displayDeltas.routeKm.formattedDelta,
              isPositive: false,
              isNeutral: false,
              isImprovement: true,
              ariaLabel: `${displayDeltas.routeKm.formattedDelta} fewer km than baseline`,
            } : undefined}
            deltaLabel="vs Baseline"
            accentColor="navy"
            icon={<Truck className="w-5 h-5 text-navy-600" />}
          />

          {/* KPI 3: Energy Generated */}
          <StatCard
            isHero
            title="Energy Generated"
            value={safeFormatMwh(displayActive.energyMwh)}
            unit="clean power"
            calculationInfo="Biomethane CHP: organicTonnes × 110 m³/t × 2.1 kWh/m³. Factors in config.ts."
            delta={mode === 'reloop' ? {
              percentStr: displayDeltas.energyMwh.formattedDelta,
              isPositive: true,
              isNeutral: false,
              isImprovement: true,
              ariaLabel: `${displayDeltas.energyMwh.formattedDelta} more clean energy than baseline`,
            } : undefined}
            deltaLabel="vs Baseline"
            accentColor="amber"
            icon={<Zap className="w-5 h-5 text-amber-600" />}
          />

          {/* KPI 4: Circular Revenue */}
          <StatCard
            isHero
            title="Circular Revenue"
            value={safeFormatCurrencyINR(displayActive.revenueInr)}
            unit="gross value"
            calculationInfo="Revenue from sorted polymer flakes, aluminium scrap, electricity feed-in, city compost, RDF and EPR credits. Tariffs in config.ts."
            delta={mode === 'reloop' ? {
              percentStr: displayDeltas.revenueInr.formattedDelta,
              isPositive: true,
              isNeutral: false,
              isImprovement: true,
              ariaLabel: `${displayDeltas.revenueInr.formattedDelta} more revenue than baseline`,
            } : undefined}
            deltaLabel="vs Baseline"
            accentColor="navy"
            icon={<Coins className="w-5 h-5 text-navy-600" />}
          />
        </div>
      </section>

      {/* ── 3. Impact band ──────────────────────────────────────────────── */}
      <section
        aria-label="Real-world impact comparisons"
        className="rounded-2xl bg-navy-950 text-white p-5 sm:p-6"
      >
        <div className="flex items-center gap-2 mb-4">
          <ShieldCheck className="w-4 h-4 text-emerald-400" aria-hidden="true" />
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
            Real-world impact (simulated pilot data, see assumptions)
          </span>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Stat 1: CO₂ avoided */}
          <div className="space-y-1">
            <p className="text-2xl sm:text-3xl font-bold tabular-nums font-heading text-white">
              {displayActive.co2AvoidedTonnes.toFixed(1)} t
            </p>
            <p className="text-sm font-semibold text-emerald-300">CO₂e Avoided</p>
            <p className="text-xs text-charcoal-400 leading-snug">
              ≈ {carKmOffset.toLocaleString('en-IN')} car km offset
              <br />
              <span className="text-charcoal-500">(0.192 kg CO₂e/km, IPCC 2021)</span>
            </p>
          </div>

          {/* Stat 2: Landfill avoided in tonnes */}
          <div className="space-y-1">
            <p className="text-2xl sm:text-3xl font-bold tabular-nums font-heading text-white">
              {displayActive.landfillAvoidedTonnes.toFixed(1)} t
            </p>
            <p className="text-sm font-semibold text-emerald-300">Landfill Avoided</p>
            <p className="text-xs text-charcoal-400 leading-snug">
              ≈ {landfillTrucks} truckloads not dumped
              <br />
              <span className="text-charcoal-500">(4.5 t payload per truck)</span>
            </p>
          </div>

          {/* Stat 3: Waste collected */}
          <div className="space-y-1">
            <p className="text-2xl sm:text-3xl font-bold tabular-nums font-heading text-white">
              {displayActive.collectedTonnes.toFixed(1)} t
            </p>
            <p className="text-sm font-semibold text-charcoal-300">Waste Collected</p>
            <p className="text-xs text-charcoal-400 leading-snug">
              Across {simState.bins.length} smart bins
              <br />
              <span className="text-charcoal-500">5 pilot zones, PCMC corridor</span>
            </p>
          </div>

          {/* Stat 4: Trees equivalent */}
          <div className="space-y-1">
            <p className="text-2xl sm:text-3xl font-bold tabular-nums font-heading text-white">
              {treesEquivalent.toLocaleString('en-IN')}
            </p>
            <p className="text-sm font-semibold text-emerald-300">Tree-Years Equivalent</p>
            <p className="text-xs text-charcoal-400 leading-snug">
              {homesMonthly.toLocaleString('en-IN')} homes powered 1 mo
              <br />
              <span className="text-charcoal-500">(90 kWh/home/mo, MNRE 2023)</span>
            </p>
          </div>
        </div>
      </section>

      {/* ── 4. Modules grid (7 loop steps) ──────────────────────────────── */}
      <section aria-label="7-step AI loop modules">
        <h2 className="text-xs font-bold uppercase tracking-wider text-charcoal-500 px-1 mb-3">
          7-Step Circular Loop
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {LOOP_STEPS.map(({ step, name, path, icon: Icon, desc }) => (
            <div
              key={step}
              className="group rounded-2xl bg-white border border-charcoal-200 shadow-sm hover:shadow-md hover:border-emerald-300 transition-all p-4 flex flex-col gap-2"
            >
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-emerald-100 flex items-center justify-center text-xs font-bold text-emerald-800 flex-shrink-0">
                  {step}
                </div>
                <Icon className="w-4 h-4 text-charcoal-500 flex-shrink-0" aria-hidden="true" />
                <span className="text-sm font-bold text-navy-900">{name}</span>
              </div>
              <p className="text-sm text-charcoal-600 leading-snug flex-1">{desc}</p>
              <div className="flex items-center justify-between pt-1 border-t border-charcoal-100">
                <span className="text-xs font-mono text-emerald-700 font-semibold truncate pr-2">
                  {stepLiveMetrics[step]}
                </span>
                <Link
                  to={path}
                  className="text-xs font-bold text-navy-700 hover:text-emerald-700 flex items-center gap-1 whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded"
                  aria-label={`Open step ${step}: ${name}`}
                >
                  Open <ArrowRight className="w-3 h-3" aria-hidden="true" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 5. Live alerts panel + Charts ──────────────────────────────── */}
      <section aria-label="Live alerts and charts" className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Alerts panel (lg:col-span-4) */}
        <div className="lg:col-span-4">
          <SectionCard
            title="Live Alerts"
            subtitle="Bins above 80% fill or at overflow risk"
            headerAction={
              <Badge variant={alertBins.length > 0 ? 'red' : 'emerald'} size="sm">
                {alertBins.length > 0 ? `${alertBins.length} alert${alertBins.length > 1 ? 's' : ''}` : 'All clear'}
              </Badge>
            }
          >
            {priorityBins.length > 0 && (
              <div className="mb-3 p-3 rounded-xl bg-amber-50/80 border border-amber-200 space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold text-amber-900">
                  <span className="flex items-center gap-1.5">
                    <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                    Manager Priority Pickups ({priorityBins.length})
                  </span>
                  <Link to="/app/map" className="text-emerald-700 hover:underline">
                    Map →
                  </Link>
                </div>
                <div className="space-y-1">
                  {priorityBins.map((bin) => (
                    <div key={bin.id} className="flex items-center justify-between text-xs py-0.5">
                      <span className="font-mono font-bold text-navy-900">{bin.id} · {bin.zoneName}</span>
                      <span className="font-bold text-amber-800 tabular-nums">{bin.fillPercent.toFixed(0)}% fill</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {alertBins.length === 0 && priorityBins.length === 0 ? (
              <div className="flex flex-col items-center gap-2 py-6 text-center">
                <CheckCircle2 className="w-8 h-8 text-emerald-500" aria-hidden="true" />
                <p className="text-sm font-semibold text-emerald-700">No alerts</p>
                <p className="text-xs text-charcoal-500">All {simState.bins.length} bins within limits.</p>
              </div>
            ) : alertBins.length === 0 ? null : (
              <ul className="space-y-2" aria-label="Critical bins list">
                {alertBins.map((bin) => (
                  <li key={bin.id} className="flex items-start gap-2.5 p-2.5 rounded-xl bg-charcoal-50 border border-charcoal-200">
                    <span
                      className={`mt-0.5 w-2 h-2 rounded-full flex-shrink-0 ${
                        bin.fillPercent >= 95 ? 'bg-red-500' : 'bg-amber-500'
                      }`}
                      aria-hidden="true"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-sm font-semibold text-navy-900 truncate">{bin.id}</span>
                        <span
                          className={`text-xs font-bold tabular-nums ${
                            bin.fillPercent >= 95 ? 'text-red-600' : 'text-amber-700'
                          }`}
                        >
                          {bin.fillPercent.toFixed(0)}%
                        </span>
                      </div>
                      <p className="text-xs text-charcoal-500 truncate">{bin.zoneName}</p>
                      {bin.predictedHoursToFull > 0 && bin.predictedHoursToFull <= 6 && (
                        <p className="text-xs font-semibold text-red-600 mt-0.5">
                          ⚠ Overflow in ~{bin.predictedHoursToFull.toFixed(0)} h
                        </p>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
            <div className="mt-3 pt-3 border-t border-charcoal-100">
              <Link
                to="/app/map"
                className="text-xs font-bold text-emerald-700 hover:underline flex items-center gap-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded"
              >
                View all bins on map <ArrowRight className="w-3 h-3" aria-hidden="true" />
              </Link>
            </div>
          </SectionCard>
        </div>

        {/* Area chart (lg:col-span-8) */}
        <div className="lg:col-span-8">
          <SectionCard
            title={`Collection peaks at ${collectionPeakHour}`}
            subtitle="Cumulative waste collected and landfill diverted over simulation intervals"
            headerAction={
              <div className="flex items-center gap-2">
                <div className="flex items-center bg-charcoal-100 p-0.5 rounded-xl border border-charcoal-200">
                  {(['today', '7days', 'all'] as const).map((rng) => (
                    <button
                      key={rng}
                      type="button"
                      onClick={() => setDashboardTimeRange(rng)}
                      className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                        dashboardTimeRange === rng
                          ? 'bg-white text-navy-900 shadow-sm'
                          : 'text-charcoal-600 hover:text-navy-900'
                      }`}
                    >
                      {rng === 'today' ? 'Today' : rng === '7days' ? '7 Days' : 'All'}
                    </button>
                  ))}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  icon={<TableIcon className="w-4 h-4" />}
                  onClick={() => setShowDataTableFallback((prev) => !prev)}
                  aria-label={showDataTableFallback ? 'Switch to chart' : 'Switch to accessible data table'}
                  className="min-h-[36px] text-xs"
                >
                  {showDataTableFallback ? 'Chart' : 'Table'}
                </Button>
              </div>
            }
          >
            {timeSeriesData.length === 0 ? (
              <div className="h-60 flex items-center justify-center text-sm text-charcoal-400">
                No data yet — simulation accumulates on each tick.
              </div>
            ) : showDataTableFallback ? (
              <div className="h-60 overflow-y-auto">
                <table className="w-full text-left text-sm">
                  <caption className="sr-only">Hourly Resource Recovery Data</caption>
                  <thead>
                    <tr className="border-b border-charcoal-200 text-charcoal-600 text-xs uppercase">
                      <th scope="col" className="pb-2">Time</th>
                      <th scope="col" className="pb-2">Collected (t)</th>
                      <th scope="col" className="pb-2">Diverted (t)</th>
                      <th scope="col" className="pb-2">Recycled (t)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-charcoal-100">
                    {timeSeriesData.map((d, idx) => (
                      <tr key={idx}>
                        <td className="py-1.5 font-mono text-sm">{d.timestamp}</td>
                        <td className="py-1.5 font-mono text-sm">{d.wasteCollected} t</td>
                        <td className="py-1.5 font-mono text-sm font-bold text-emerald-700">{d.landfillAvoided} t</td>
                        <td className="py-1.5 font-mono text-sm text-navy-800">{d.recycled} t</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="h-60" aria-label="Area chart showing collected and diverted waste over time">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={timeSeriesData} margin={{ top: 8, right: 8, left: -22, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorCollected2" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#12305C" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="#12305C" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorDiverted2" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#059669" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#059669" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                    <XAxis dataKey="timestamp" stroke="#94A3B8" fontSize={11} tickLine={false} />
                    <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} />
                    <RechartsTooltip
                      contentStyle={{ borderRadius: '12px', border: '1px solid #CBD5E1', fontSize: '13px' }}
                    />
                    <Area type="monotone" dataKey="wasteCollected" name="Collected (t)" stroke="#12305C" strokeWidth={2} fillOpacity={1} fill="url(#colorCollected2)" />
                    <Area type="monotone" dataKey="landfillAvoided" name="Diverted (t)" stroke="#059669" strokeWidth={2.5} fillOpacity={1} fill="url(#colorDiverted2)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Legend */}
            <div className="flex items-center gap-5 pt-3 border-t border-charcoal-100 text-sm">
              <span className="flex items-center gap-1.5 font-semibold text-navy-900">
                <span className="w-3 h-1.5 rounded-full bg-navy-700 flex-shrink-0" aria-hidden="true" />
                Waste Collected
              </span>
              <span className="flex items-center gap-1.5 font-semibold text-emerald-800">
                <span className="w-3 h-1.5 rounded-full bg-emerald-600 flex-shrink-0" aria-hidden="true" />
                Landfill Diverted
              </span>
              <span className="ml-auto text-xs font-mono text-charcoal-400 hidden sm:inline">
                {simState.history.length} data points
              </span>
            </div>
          </SectionCard>
        </div>
      </section>

      {/* ── 6. Donut chart ───────────────────────────────────────────────── */}
      <section aria-label="Waste stream composition" className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SectionCard
          title="Waste stream breakdown"
          subtitle={`Material destination by stream — ${mode === 'reloop' ? 'ReLoop AI sort' : 'Baseline sort'}`}
          headerAction={
            <Badge variant={mode === 'reloop' ? 'emerald' : 'amber'} size="sm">
              {mode === 'reloop' ? 'AI-optimised' : 'Fixed schedule'}
            </Badge>
          }
        >
          <div className="h-56 relative flex items-center justify-center" aria-label="Donut chart of waste stream composition">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={donutData}
                  cx="50%"
                  cy="50%"
                  innerRadius={64}
                  outerRadius={88}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {donutData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <RechartsTooltip
                  formatter={(val: unknown) => [`${Number(val).toFixed(1)} tonnes`, 'Tonnage']}
                  contentStyle={{ borderRadius: '12px', border: '1px solid #CBD5E1', fontSize: '13px' }}
                />
              </PieChart>
            </ResponsiveContainer>
            {/* Centre label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-xs font-bold uppercase tracking-wider text-charcoal-500">Diversion</span>
              <span className="text-2xl font-black text-navy-900 font-heading">
                {displayActive.diversionRatePercent.toFixed(1)}%
              </span>
              <span className={`text-xs font-bold ${mode === 'reloop' ? 'text-emerald-700' : 'text-amber-700'}`}>
                {mode === 'reloop' ? 'Circular' : 'Linear'}
              </span>
            </div>
          </div>

          {/* Legend */}
          <div className="grid grid-cols-2 gap-2 pt-3 border-t border-charcoal-100">
            {donutData.map((item) => (
              <div key={item.name} className="flex items-center gap-2 p-2 rounded-xl bg-charcoal-50 border border-charcoal-200">
                <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} aria-hidden="true" />
                <div className="truncate">
                  <span className="font-semibold text-charcoal-800 block truncate text-xs">{item.name}</span>
                  <span className="text-xs text-charcoal-500 font-mono">{item.value.toFixed(1)} t</span>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>

        {/* Comparison bar panel */}
        <SectionCard
          title="Baseline vs ReLoop side-by-side"
          subtitle="Identical municipal waste input, same pilot zones"
        >
          <div className="space-y-4">
            {[
              {
                label: 'Landfill diversion rate',
                icon: <Leaf className="w-4 h-4 text-emerald-600" aria-hidden="true" />,
                baseVal: `${displayBaseline.diversionRatePercent.toFixed(1)}%`,
                reloopVal: `${displayReloop.diversionRatePercent.toFixed(1)}%`,
                baseWidth: displayBaseline.diversionRatePercent,
                reloopWidth: displayReloop.diversionRatePercent,
                delta: displayDeltas.diversionRate.formattedDelta,
              },
              {
                label: 'Fleet distance (km)',
                icon: <Truck className="w-4 h-4 text-navy-600" aria-hidden="true" />,
                baseVal: `${displayBaseline.routeKm.toFixed(0)} km`,
                reloopVal: `${displayReloop.routeKm.toFixed(0)} km`,
                baseWidth: 100,
                reloopWidth: Math.round((displayReloop.routeKm / (displayBaseline.routeKm || 1)) * 100),
                delta: displayDeltas.routeKm.formattedDelta,
              },
              {
                label: 'Overflow incidents',
                icon: <AlertTriangle className="w-4 h-4 text-amber-600" aria-hidden="true" />,
                baseVal: `${displayBaseline.overflowEvents} events`,
                reloopVal: `${displayReloop.overflowEvents} events`,
                baseWidth: 100,
                reloopWidth: Math.max(4, Math.round((displayReloop.overflowEvents / (displayBaseline.overflowEvents || 1)) * 100)),
                delta: displayDeltas.overflowEvents.formattedDelta,
              },
            ].map(({ label, icon, baseVal, reloopVal, baseWidth, reloopWidth, delta }) => (
              <div key={label} className="space-y-1.5">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-1.5 font-bold text-navy-900">{icon}{label}</span>
                  <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">{delta}</span>
                </div>
                <div className="space-y-1">
                  <div>
                    <div className="flex justify-between text-xs text-charcoal-600 mb-1">
                      <span>Baseline (Fixed)</span>
                      <span className="font-mono font-bold">{baseVal}</span>
                    </div>
                    <div className="h-2.5 w-full bg-charcoal-200 rounded-full overflow-hidden">
                      <div className="h-full bg-amber-500 rounded-full transition-all duration-500" style={{ width: `${Math.min(100, Math.max(2, baseWidth))}%` }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs text-emerald-900 font-bold mb-1">
                      <span>ReLoop (AI)</span>
                      <span className="font-mono">{reloopVal}</span>
                    </div>
                    <div className="h-3 w-full bg-charcoal-200 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-600 rounded-full transition-all duration-500" style={{ width: `${Math.min(100, Math.max(2, reloopWidth))}%` }} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      </section>

      {/* ── 7. Methodology accordion ────────────────────────────────────── */}
      <section aria-label="How these numbers are calculated">
        <SectionCard
          title="How these numbers are calculated"
          subtitle="Plain-language formulas and data sources"
          headerAction={
            <span className="flex items-center gap-1 text-xs text-charcoal-500 font-medium">
              <FlaskConical className="w-3.5 h-3.5" aria-hidden="true" />
              Assumptions
            </span>
          }
        >
          <div role="list" aria-label="Methodology details">
            {METHODOLOGY_ITEMS.map((item, idx) => (
              <AccordionItem
                key={idx}
                id={String(idx)}
                title={item.title}
                body={item.body}
                open={openAccordionIndex === idx}
                onToggle={() => setOpenAccordionIndex(openAccordionIndex === idx ? null : idx)}
              />
            ))}
          </div>
        </SectionCard>
      </section>

    </div>
  );
};
