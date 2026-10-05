import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { computeMetrics, PILOT_30DAY_SNAPSHOT, assertMetricsIntegrity } from '../lib/metrics';
import { safeFormatCurrencyINR, safeFormatTonnage, safeFormatMwh } from '../lib/formatters';
import { StatCard } from '../components/ui/StatCard';
import { Skeleton } from '../components/ui/Skeleton';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import {
  Leaf,
  Zap,
  Coins,
  Table as TableIcon,
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
  X,
  RotateCcw,
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
    desc: 'CVRP routing dispatches trucks when bins exceed 75% fill.',
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

// ─── Methodology & FAQ accordion items ──────────────────────────────────────
const FAQ_ITEMS = [
  {
    title: 'Landfill diversion rate',
    body: 'Diversion rate = (collectedTonnes − landfilledTonnes) / collectedTonnes × 100. Baseline uses fixed daily schedules (28.0% diversion); ReLoop uses dynamic predictive dispatch at 75% fill threshold.',
  },
  {
    title: 'Fleet distance & fuel saved',
    body: 'Route distance = collectedTonnes × 9.57 km/t (empirical PCMC compactor factor). ReLoop applies CVRP 2-Opt routing to skip unfilled bins, cutting fleet distance by ~32%.',
  },
  {
    title: 'Clean energy yield (MWh)',
    body: 'Biogas yield = organicTonnes × 110 m³/t. Combined Heat & Power (CHP) generates electricity at 2.1 kWh/m³ at ~38% electrical efficiency.',
  },
  {
    title: 'Circular revenue (₹)',
    body: 'Gross revenue sums 6 sorted material and recovery streams: polymers, aluminium, city compost, clean power feed-in tariffs, RDF, and EPR credits.',
  },
  {
    title: 'Municipal pilot data source',
    body: 'Simulation parameters and baseline waste streams are calibrated directly against empirical PCMC ward waste characterization audits in Akurdi, Chinchwad, and Moshi.',
  },
  {
    title: 'How to test policy scenarios',
    body: 'Open the Scenario Builder in the toolbar to adjust truck count, minimum pickup thresholds, and stream split allocations to test council policy decisions.',
  },
];

export const Dashboard: React.FC = () => {
  const {
    simState,
    mode,
    config,
    isSimRunning,
    simSpeed,
    setSimSpeed,
    startSimulation,
    openResetConfirm,
    dashboardTimeRange,
    setDashboardTimeRange,
    roleCardDismissed,
    dismissRoleCard,
    resetRoleCard,
    priorityBinIds,
    clearPriorityBins,
    savedScenarios,
    activeScenarioId,
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

  // Dismissible inline simulated data note, remembered in localStorage (try/catch)
  const [isSimNoteDismissed, setIsSimNoteDismissed] = useState<boolean>(() => {
    try {
      return localStorage.getItem('reloop_sim_note_dismissed') === 'true';
    } catch {
      return false;
    }
  });

  const handleDismissSimNote = () => {
    setIsSimNoteDismissed(true);
    try {
      localStorage.setItem('reloop_sim_note_dismissed', 'true');
    } catch {
      // LocalStorage might be disabled or full
    }
  };

  // Auto-start simulation on first dashboard mount if not already running
  useEffect(() => {
    const hasAutoStarted = sessionStorage.getItem('reloop_sim_auto_started');
    if (!hasAutoStarted) {
      sessionStorage.setItem('reloop_sim_auto_started', 'true');
      if (!isSimRunning) {
        startSimulation();
      }
    }
    const t = setTimeout(() => setIsReady(true), 250);
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
    { name: 'Clean Bio-Energy', value: Number(((displayActive.energyMwh / 0.231) * 0.1).toFixed(1)), color: '#D97706' },
    { name: 'Residual Landfill (inert)', value: displayActive.landfilledTonnes, color: '#64748B' },
  ], [displayActive]);

  // Time series chart data
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

  // Bins above 80% — live alerts (max 5)
  const alertBins = useMemo(() => {
    return simState.bins
      .filter((b) => b.fillPercent >= 80)
      .slice(0, 5)
      .sort((a, b) => b.fillPercent - a.fillPercent);
  }, [simState.bins]);

  // Live metric for each loop step
  const stepLiveMetrics: Record<number, string> = useMemo(() => ({
    1: `${alertBins.length} bin${alertBins.length !== 1 ? 's' : ''} ≥ 80%`,
    2: `${simState.bins.filter((b) => b.predictedHoursToFull > 0 && b.predictedHoursToFull <= 6).length} overflow risk in 6 h`,
    3: `${deltas.routeKm.formattedDelta} fleet distance`,
    4: `${simState.bins.filter((b) => b.isScheduledForPickup).length} bins scheduled`,
    5: `${safeFormatTonnage(displayActive.compostedTonnes)} composted`,
    6: `${safeFormatMwh(displayActive.energyMwh)} generated`,
    7: `${safeFormatCurrencyINR(displayActive.revenueInr)} value`,
  }), [alertBins, simState.bins, deltas, displayActive]);

  // Collection peak from history
  const collectionPeakHour = useMemo(() => {
    if (!simState.history.length) return '08:00–10:00';
    const peak = simState.history.reduce(
      (best, cur) => (cur.reloop.collectedTonnes > best.reloop.collectedTonnes ? cur : best),
      simState.history[0]
    );
    return peak.timestamp;
  }, [simState.history]);

  if (!isReady) {
    return (
      <div className="space-y-8 py-2" role="status" aria-label="Loading dashboard...">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48 rounded-xl" />
          <Skeleton className="h-4 w-96 rounded-lg" />
        </div>
        <Skeleton className="h-14 rounded-xl" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-36 rounded-2xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-72 rounded-2xl" />
          <Skeleton className="h-72 rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12 select-none">
      
      {/* ── 1. Breadcrumb + Title Row + Inline Simulated Note ────────────── */}
      <section aria-label="Page identity" className="space-y-3">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-slate-500">
          <Link to="/app/overview" className="hover:text-slate-900 transition-colors">
            ReLoop City
          </Link>
          <span className="text-slate-300">/</span>
          <span className="font-semibold text-slate-900" aria-current="page">
            Dashboard
          </span>
        </nav>

        {/* Title row with only two actions on the right */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold text-slate-900 tracking-tight">
              Dashboard
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Circular mass balance, fleet efficiency and fiscal returns for the Pune PCMC pilot corridor.
            </p>
          </div>

          <div className="flex items-center gap-3 self-start sm:self-auto flex-wrap">
            {activeScenario ? (
              <Link
                to="/app/scenarios"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800 hover:bg-emerald-100 transition-colors shadow-2xs"
                title="Active operational policy scenario - click to manage"
              >
                <FlaskConical className="w-3.5 h-3.5 text-emerald-600" />
                <span>Active: {activeScenario.name}</span>
              </Link>
            ) : (
              <Link
                to="/app/scenarios"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-200 transition-colors"
                title="Default scenario active - click to build new"
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-slate-500" />
                <span>Default ReLoop Scenario</span>
              </Link>
            )}

            <ExportReportMenu />
          </div>
        </div>

        {/* Small, quiet inline note: dismissible, remembered in localStorage */}
        {!isSimNoteDismissed && (
          <div
            role="status"
            className="flex items-center justify-between gap-2 py-1.5 px-3 rounded-xl bg-slate-100/70 border border-slate-200 text-sm text-slate-500 transition-all"
          >
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4 text-slate-400 flex-shrink-0" aria-hidden="true" />
              <span>Simulated pilot data · calibrated to Pune PCMC municipal corridor</span>
            </div>
            <button
              type="button"
              onClick={handleDismissSimNote}
              className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 rounded-lg transition-colors cursor-pointer"
              aria-label="Dismiss simulated data note"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </section>

      {/* ── 2. Toolbar row (Catalog filter/sort bar style) ────────────────── */}
      <section
        aria-label="Simulation toolbar"
        className="rounded-xl bg-white border border-slate-200 px-4 py-3 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3"
      >
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <span className="font-semibold text-slate-900">
            Showing: {mode === 'reloop' ? 'ReLoop (AI Mode)' : 'Baseline (Fixed Schedule)'}
          </span>
          <span className="text-slate-300">·</span>
          <span className="text-slate-500 truncate">
            {activeScenario ? activeScenario.name : 'Default Scenario'}
          </span>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
          {/* Simulation speed control */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200">
            {([1, 10, 60] as const).map((spd) => (
              <button
                key={spd}
                type="button"
                onClick={() => setSimSpeed(spd)}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                  simSpeed === spd
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title={`Run simulation at ${spd}x speed`}
              >
                {spd}x
              </button>
            ))}
          </div>

          {/* Reset button */}
          <button
            type="button"
            onClick={openResetConfirm}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:text-red-700 hover:bg-red-50 hover:border-red-200 transition-colors cursor-pointer"
            title="Reset simulation back to Day 1"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
            <span>Reset</span>
          </button>

          {/* Edit scenario */}
          <Link
            to="/app/scenarios"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700 hover:text-slate-900 transition-colors"
            title="Open scenario builder"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
            <span>Edit scenario</span>
          </Link>
        </div>
      </section>

      {/* ── 3. Headline result (Plain large sentence, no card, no 2nd toggle) */}
      <section aria-label="Executive outcome summary" className="py-1">
        <p className="text-2xl font-semibold text-slate-900 leading-snug">
          {mode === 'reloop' ? (
            <>
              ReLoop diverts{' '}
              <span className="text-emerald-600 font-bold">
                {displayActive.diversionRatePercent.toFixed(1)}%
              </span>{' '}
              of waste from landfill, up from {displayBaseline.diversionRatePercent.toFixed(1)}% at baseline.
            </>
          ) : (
            <>
              Baseline fixed routes send{' '}
              <span className="text-amber-600 font-bold">
                {(100 - displayBaseline.diversionRatePercent).toFixed(1)}%
              </span>{' '}
              of collected waste to landfill — {displayDeltas.diversionRate.formattedDelta} less diversion than ReLoop AI.
            </>
          )}
        </p>
        <p className="text-sm text-slate-500 mt-1">
          Municipal pilot across Akurdi, Chinchwad, and Moshi · {simState.bins.length} IoT monitored smart bins.
        </p>
      </section>

      {/* ── 4. Primary KPI grid: Exactly 4 identical uniform cards ─────────── */}
      <section aria-label="Primary Key Performance Indicators">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1: Landfill diversion */}
          <StatCard
            title="Landfill diversion"
            value={`${displayActive.diversionRatePercent.toFixed(1)}%`}
            unit={`${safeFormatTonnage(displayActive.landfillAvoidedTonnes)} diverted`}
            calculationInfo="Gross municipal solid waste diverted from Moshi dumpsite via recycling, composting, AD clean power and RDF recovery."
            delta={
              mode === 'reloop'
                ? {
                    percentStr: displayDeltas.diversionRate.formattedDelta,
                    isPositive: true,
                    isNeutral: false,
                    isImprovement: true,
                    ariaLabel: `${displayDeltas.diversionRate.formattedDelta} higher diversion than baseline`,
                  }
                : undefined
            }
            deltaLabel="vs Baseline"
            accentColor="emerald"
            icon={<Leaf className="w-4 h-4 text-emerald-600" />}
          />

          {/* Card 2: Waste collected */}
          <StatCard
            title="Waste collected"
            value={safeFormatTonnage(displayActive.collectedTonnes)}
            unit={`across ${simState.bins.length} bins`}
            calculationInfo="Total municipal solid waste collected from 100 smart IoT bins in 5 pilot wards."
            delta={
              mode === 'reloop'
                ? {
                    percentStr: displayDeltas.routeKm.formattedDelta,
                    isPositive: false,
                    isNeutral: false,
                    isImprovement: true,
                    ariaLabel: `${displayDeltas.routeKm.formattedDelta} fewer km than baseline`,
                  }
                : undefined
            }
            deltaLabel="fleet km"
            accentColor="emerald"
            icon={<Truck className="w-4 h-4 text-slate-600" />}
          />

          {/* Card 3: Clean energy */}
          <StatCard
            title="Clean energy"
            value={safeFormatMwh(displayActive.energyMwh)}
            unit="biogas power"
            calculationInfo="Biomethane CHP conversion: organicTonnes × 110 m³/t × 2.1 kWh/m³ at ~38% electrical efficiency."
            delta={
              mode === 'reloop'
                ? {
                    percentStr: displayDeltas.energyMwh.formattedDelta,
                    isPositive: true,
                    isNeutral: false,
                    isImprovement: true,
                    ariaLabel: `${displayDeltas.energyMwh.formattedDelta} more energy than baseline`,
                  }
                : undefined
            }
            deltaLabel="vs Baseline"
            accentColor="amber"
            icon={<Zap className="w-4 h-4 text-amber-500" />}
          />

          {/* Card 4: Circular value */}
          <StatCard
            title="Circular value"
            value={safeFormatCurrencyINR(displayActive.revenueInr)}
            unit="gross revenue"
            calculationInfo="Gross settlement value across 6 recovery streams: polymers, aluminium, compost, electricity feed-in, and EPR credits."
            delta={
              mode === 'reloop'
                ? {
                    percentStr: displayDeltas.revenueInr.formattedDelta,
                    isPositive: true,
                    isNeutral: false,
                    isImprovement: true,
                    ariaLabel: `${displayDeltas.revenueInr.formattedDelta} more revenue than baseline`,
                  }
                : undefined
            }
            deltaLabel="vs Baseline"
            accentColor="emerald"
            icon={<Coins className="w-4 h-4 text-slate-600" />}
          />
        </div>

        {/* Quiet secondary impact strip (Environmental equivalents, no dark gradient) */}
        <div className="mt-4 rounded-xl bg-slate-50 border border-slate-200 px-4 py-3 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-600">
          <div className="flex items-center gap-1.5 font-medium text-slate-900">
            <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>Environmental equivalents:</span>
          </div>
          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            <span>
              <strong className="text-slate-900 font-semibold">{displayActive.co2AvoidedTonnes.toFixed(1)} t</strong> CO₂e avoided
              <span className="text-slate-400 ml-1">(≈ {carKmOffset.toLocaleString('en-IN')} car km)</span>
            </span>
            <span>
              <strong className="text-slate-900 font-semibold">{landfillTrucks}</strong> truckloads saved
            </span>
            <span>
              <strong className="text-slate-900 font-semibold">{homesMonthly.toLocaleString('en-IN')}</strong> homes powered
            </span>
            <span>
              <strong className="text-slate-900 font-semibold">{treesEquivalent.toLocaleString('en-IN')}</strong> tree-years
            </span>
          </div>
        </div>
      </section>

      {/* ── 5. Role card → Compact, light, dismissible (No dark gradients) ── */}
      <section aria-label="Operations Manager role note">
        {!roleCardDismissed ? (
          <div className="rounded-xl bg-emerald-50 border border-emerald-100 px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-sm text-emerald-950">
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-5 h-5 text-emerald-600 flex-shrink-0" aria-hidden="true" />
              <p>
                <strong className="font-semibold text-emerald-950">Operations Manager Role:</strong>{' '}
                Raise landfill diversion and cut fleet cost across the Akurdi–Chinchwad–Moshi pilot.
              </p>
            </div>
            <button
              type="button"
              onClick={dismissRoleCard}
              className="text-xs font-semibold text-emerald-700 hover:text-emerald-950 underline self-start sm:self-auto cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-between px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-500">
            <span className="flex items-center gap-1.5 font-medium text-slate-700">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              Operations Manager mode active · Akurdi–Chinchwad–Moshi Corridor
            </span>
            <button
              type="button"
              onClick={resetRoleCard}
              className="text-xs text-emerald-700 hover:underline font-semibold cursor-pointer"
            >
              Show role card
            </button>
          </div>
        )}
      </section>

      {/* ── 6. Your decisions & active scenario (Uniform white cards) ──────── */}
      <section aria-label="Operational decisions and scenario state" className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-slate-900">
            Your decisions & active scenario
          </h2>
          <Link
            to="/app/scenarios"
            className="text-xs font-semibold text-emerald-700 hover:underline flex items-center gap-1"
          >
            Scenario builder <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Decision 1: Active scenario */}
          <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-6 hover:-translate-y-0.5 hover:border-slate-300 transition-all duration-200 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-500 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0" aria-hidden="true" />
                  Active scenario
                </span>
                <Badge variant={activeScenario ? 'emerald' : 'navy'} size="sm">
                  {activeScenario ? 'Custom' : 'Default'}
                </Badge>
              </div>
              <p className="text-base font-semibold text-slate-900 truncate">
                {activeScenario ? activeScenario.name : 'Default ReLoop Plan'}
              </p>
              <p className="text-xs text-slate-500 leading-relaxed">
                {activeScenario
                  ? `${activeScenario.config.numberOfTrucks || 4} trucks · ${Math.round((activeScenario.config.dispatchFillThreshold ?? 0.75) * 100)}% threshold`
                  : '4 trucks · 75% fill threshold · 4.5 t cap'}
              </p>
            </div>
            <div className="pt-3 mt-4 border-t border-slate-100">
              <Link to="/app/scenarios" className="text-xs font-semibold text-emerald-700 hover:underline">
                Configure policy →
              </Link>
            </div>
          </div>

          {/* Decision 2: Priority bins */}
          <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-6 hover:-translate-y-0.5 hover:border-slate-300 transition-all duration-200 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-500 flex items-center gap-2">
                  <span
                    className={`w-2 h-2 rounded-full flex-shrink-0 ${
                      priorityBinIds.length > 0 ? 'bg-amber-500' : 'bg-slate-300'
                    }`}
                    aria-hidden="true"
                  />
                  Priority bins
                </span>
                <Badge variant={priorityBinIds.length > 0 ? 'amber' : 'gray'} size="sm">
                  {priorityBinIds.length} flagged
                </Badge>
              </div>
              <p className="text-base font-semibold text-slate-900">
                {priorityBinIds.length > 0 ? `${priorityBinIds.length} flagged for pickup` : 'No bins flagged'}
              </p>
              <p className="text-xs text-slate-500 leading-relaxed">
                {priorityBinIds.length > 0
                  ? `Pins: ${priorityBinIds.slice(0, 3).join(', ')}${priorityBinIds.length > 3 ? '...' : ''}`
                  : 'Mark high-priority locations on the Sense map.'}
              </p>
            </div>
            <div className="pt-3 mt-4 border-t border-slate-100 flex items-center justify-between text-xs">
              <Link to="/app/map" className="font-semibold text-emerald-700 hover:underline">
                View on map →
              </Link>
              {priorityBinIds.length > 0 && (
                <button
                  type="button"
                  onClick={clearPriorityBins}
                  className="text-slate-400 hover:text-red-700 underline cursor-pointer"
                >
                  Clear all
                </button>
              )}
            </div>
          </div>

          {/* Decision 3: Material & energy */}
          <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-6 hover:-translate-y-0.5 hover:border-slate-300 transition-all duration-200 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-500 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0" aria-hidden="true" />
                  Material & energy
                </span>
                <Badge variant="emerald" size="sm">
                  Optimized
                </Badge>
              </div>
              <p className="text-base font-semibold text-slate-900">
                {allocationStrategy === 'balanced'
                  ? 'Balanced Diversion'
                  : allocationStrategy === 'max_energy'
                  ? 'Max Bio-Energy'
                  : 'Max Material Recovery'}
              </p>
              <p className="text-xs text-slate-500 leading-relaxed truncate">
                Offtake: {energyOfftakeCommitment === 'grid' ? 'MSEDCL Grid Feed-in (₹6.80)' : 'PMPML EV Bus Depot (₹7.20)'}
              </p>
            </div>
            <div className="pt-3 mt-4 border-t border-slate-100">
              <Link to="/app/allocate" className="text-xs font-semibold text-emerald-700 hover:underline">
                Change stream split →
              </Link>
            </div>
          </div>

          {/* Decision 4: Council submission */}
          <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-6 hover:-translate-y-0.5 hover:border-slate-300 transition-all duration-200 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-500 flex items-center gap-2">
                  <span
                    className={`w-2 h-2 rounded-full flex-shrink-0 ${
                      councilReportApproved ? 'bg-emerald-500' : 'bg-amber-500'
                    }`}
                    aria-hidden="true"
                  />
                  Council submission
                </span>
                <Badge variant={councilReportApproved ? 'emerald' : 'amber'} size="sm">
                  {councilReportApproved ? 'Certified' : 'Draft'}
                </Badge>
              </div>
              <p className="text-base font-semibold text-slate-900">
                {councilReportApproved ? 'Approved by Operations' : 'Sign-off pending'}
              </p>
              <p className="text-xs text-slate-500 leading-relaxed">
                {councilReportApproved ? 'Ready for standing committee.' : 'Review 6 circular revenue streams.'}
              </p>
            </div>
            <div className="pt-3 mt-4 border-t border-slate-100">
              <Link to="/app/revenue" className="text-xs font-semibold text-emerald-700 hover:underline">
                Open council report →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── 7. Modules grid: 7 uniform cards (Catalog product card layout) ── */}
      <section aria-label="Circular loop modules" className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-slate-900">
            7-Step Circular Loop
          </h2>
          <span className="text-xs text-slate-500 font-medium">
            Step-by-step intelligence modules
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {LOOP_STEPS.map(({ step, name, path, icon: Icon, desc }) => (
            <div
              key={step}
              className="rounded-2xl bg-white border border-slate-200 shadow-sm p-6 hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-md transition-all duration-200 flex flex-col justify-between h-full"
            >
              <div>
                <div className="flex items-center gap-2.5 mb-3">
                  <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center text-xs font-bold flex-shrink-0">
                    {step}
                  </div>
                  <Icon className="w-4 h-4 text-slate-500 flex-shrink-0" aria-hidden="true" />
                  <span className="text-base font-semibold text-slate-900">{name}</span>
                </div>
                <p className="text-sm text-slate-500 leading-relaxed">
                  {desc}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="font-semibold text-emerald-700 truncate pr-2">
                  {stepLiveMetrics[step]}
                </span>
                <Link
                  to={path}
                  className="font-semibold text-slate-900 hover:text-emerald-700 flex items-center gap-1 whitespace-nowrap focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-emerald-500 rounded"
                  aria-label={`Open step ${step}: ${name}`}
                >
                  Open <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 8. Charts section: Two charts side-by-side in identical cards ──── */}
      <section aria-label="Visualizations and data trends" className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Donut chart */}
        <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-2 mb-4">
              <div>
                <h3 className="text-xl font-semibold text-slate-900">
                  {displayActive.diversionRatePercent.toFixed(1)}% Diverted to circular streams
                </h3>
                <p className="text-sm text-slate-500 mt-0.5">
                  Material recovery distribution across 4 municipal pathways
                </p>
              </div>
              <Badge variant={mode === 'reloop' ? 'emerald' : 'amber'} size="sm">
                {mode === 'reloop' ? 'AI-sorted' : 'Fixed sort'}
              </Badge>
            </div>

            <div className="h-56 relative flex items-center justify-center my-2" aria-label="Donut chart of waste stream composition">
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
                    contentStyle={{ borderRadius: '12px', border: '1px solid #E2E8F0', fontSize: '13px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-xs font-medium text-slate-400">Diversion</span>
                <span className="text-2xl font-semibold text-slate-900 tabular-nums">
                  {displayActive.diversionRatePercent.toFixed(1)}%
                </span>
                <span className={`text-xs font-semibold ${mode === 'reloop' ? 'text-emerald-700' : 'text-amber-700'}`}>
                  {mode === 'reloop' ? 'Circular' : 'Linear'}
                </span>
              </div>
            </div>
          </div>

          {/* Donut Legend */}
          <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-100 text-xs">
            {donutData.map((item) => (
              <div key={item.name} className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 border border-slate-100">
                <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} aria-hidden="true" />
                <div className="truncate">
                  <span className="font-medium text-slate-700 block truncate">{item.name}</span>
                  <span className="text-slate-500 font-mono">{item.value.toFixed(1)} t</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chart 2: Cumulative Area chart */}
        <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-6 flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
              <div>
                <h3 className="text-xl font-semibold text-slate-900">
                  Collection peaks at {collectionPeakHour}
                </h3>
                <p className="text-sm text-slate-500 mt-0.5">
                  Cumulative collected and diverted waste over time
                </p>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
                <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200">
                  {(['today', '7days', 'all'] as const).map((rng) => (
                    <button
                      key={rng}
                      type="button"
                      onClick={() => setDashboardTimeRange(rng)}
                      className={`px-2 py-0.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                        dashboardTimeRange === rng
                          ? 'bg-white text-slate-900 shadow-2xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {rng === 'today' ? 'Today' : rng === '7days' ? '7 Days' : 'All'}
                    </button>
                  ))}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  icon={<TableIcon className="w-3.5 h-3.5" />}
                  onClick={() => setShowDataTableFallback((prev) => !prev)}
                  aria-label={showDataTableFallback ? 'Switch to chart' : 'Switch to table'}
                  className="min-h-[32px] text-xs px-2"
                >
                  {showDataTableFallback ? 'Chart' : 'Table'}
                </Button>
              </div>
            </div>

            {timeSeriesData.length === 0 ? (
              <div className="h-56 flex items-center justify-center text-sm text-slate-400">
                No data yet — simulation accumulates on each tick.
              </div>
            ) : showDataTableFallback ? (
              <div className="h-56 overflow-y-auto">
                <table className="w-full text-left text-xs">
                  <caption className="sr-only">Hourly Resource Recovery Data</caption>
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500 font-semibold">
                      <th scope="col" className="pb-2">Time</th>
                      <th scope="col" className="pb-2">Collected (t)</th>
                      <th scope="col" className="pb-2">Diverted (t)</th>
                      <th scope="col" className="pb-2">Recycled (t)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-mono">
                    {timeSeriesData.map((d, idx) => (
                      <tr key={idx}>
                        <td className="py-1 text-slate-600">{d.timestamp}</td>
                        <td className="py-1 text-slate-700">{d.wasteCollected} t</td>
                        <td className="py-1 font-semibold text-emerald-700">{d.landfillAvoided} t</td>
                        <td className="py-1 text-slate-700">{d.recycled} t</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="h-56 my-2" aria-label="Area chart showing collected and diverted waste over time">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={timeSeriesData} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorCollectedDash" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#12305C" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="#12305C" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorDivertedDash" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#059669" stopOpacity={0.25} />
                        <stop offset="95%" stopColor="#059669" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                    <XAxis dataKey="timestamp" stroke="#94A3B8" fontSize={12} tickLine={false} />
                    <YAxis stroke="#94A3B8" fontSize={12} tickLine={false} />
                    <RechartsTooltip
                      contentStyle={{ borderRadius: '12px', border: '1px solid #CBD5E1', fontSize: '13px' }}
                    />
                    <Area type="monotone" dataKey="wasteCollected" name="Collected (t)" stroke="#12305C" strokeWidth={2} fillOpacity={1} fill="url(#colorCollectedDash)" />
                    <Area type="monotone" dataKey="landfillAvoided" name="Diverted (t)" stroke="#059669" strokeWidth={2} fillOpacity={1} fill="url(#colorDivertedDash)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          {/* Area Chart Legend */}
          <div className="flex items-center gap-5 pt-3 border-t border-slate-100 text-xs">
            <span className="flex items-center gap-1.5 font-medium text-slate-800">
              <span className="w-2.5 h-2.5 rounded-full bg-[#12305C] flex-shrink-0" aria-hidden="true" />
              Waste Collected
            </span>
            <span className="flex items-center gap-1.5 font-medium text-emerald-800">
              <span className="w-2.5 h-2.5 rounded-full bg-[#059669] flex-shrink-0" aria-hidden="true" />
              Landfill Diverted
            </span>
            <span className="ml-auto text-slate-400 font-mono hidden sm:inline">
              {simState.history.length} ticks recorded
            </span>
          </div>
        </div>
      </section>

      {/* ── 8b. Baseline vs ReLoop Side-by-Side Comparison ─────────────────── */}
      <section aria-label="Baseline and ReLoop comparison">
        <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-6">
          <div className="mb-4">
            <h3 className="text-xl font-semibold text-slate-900">
              Baseline vs ReLoop side-by-side
            </h3>
            <p className="text-sm text-slate-500 mt-0.5">
              Identical municipal waste input calibrated to Pune PCMC corridor
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
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
                label: 'Fleet distance',
                icon: <Truck className="w-4 h-4 text-slate-600" aria-hidden="true" />,
                baseVal: `${displayBaseline.routeKm.toFixed(0)} km`,
                reloopVal: `${displayReloop.routeKm.toFixed(0)} km`,
                baseWidth: 100,
                reloopWidth: Math.round((displayReloop.routeKm / (displayBaseline.routeKm || 1)) * 100),
                delta: displayDeltas.routeKm.formattedDelta,
              },
              {
                label: 'Overflow incidents',
                icon: <AlertTriangle className="w-4 h-4 text-amber-500" aria-hidden="true" />,
                baseVal: `${displayBaseline.overflowEvents} events`,
                reloopVal: `${displayReloop.overflowEvents} events`,
                baseWidth: 100,
                reloopWidth: Math.max(4, Math.round((displayReloop.overflowEvents / (displayBaseline.overflowEvents || 1)) * 100)),
                delta: displayDeltas.overflowEvents.formattedDelta,
              },
            ].map(({ label, icon, baseVal, reloopVal, baseWidth, reloopWidth, delta }) => (
              <div key={label} className="space-y-2 p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-1.5 font-semibold text-slate-900">
                    {icon}
                    {label}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                    {delta}
                  </span>
                </div>
                <div className="space-y-1.5 pt-1">
                  <div>
                    <div className="flex justify-between text-xs text-slate-500 mb-1">
                      <span>Baseline (Fixed)</span>
                      <span className="font-mono font-medium">{baseVal}</span>
                    </div>
                    <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                      <div className="h-full bg-amber-500 rounded-full" style={{ width: `${Math.min(100, Math.max(2, baseWidth))}%` }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs text-slate-800 font-semibold mb-1">
                      <span>ReLoop (AI)</span>
                      <span className="font-mono text-emerald-700">{reloopVal}</span>
                    </div>
                    <div className="h-2.5 w-full bg-slate-200 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-600 rounded-full" style={{ width: `${Math.min(100, Math.max(2, reloopWidth))}%` }} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 9. Live Alerts: Clean table/list card (Max 5 rows, icon + text) ── */}
      <section aria-label="System alerts">
        <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">
                Live alerts
              </h2>
              <p className="text-sm text-slate-500 mt-0.5">
                Bins above 80% capacity or projected overflow risk
              </p>
            </div>
            <Badge variant={alertBins.length > 0 ? 'red' : 'emerald'} size="sm">
              {alertBins.length > 0 ? `${alertBins.length} alert${alertBins.length > 1 ? 's' : ''}` : 'All clear'}
            </Badge>
          </div>

          {alertBins.length === 0 ? (
            <div className="flex items-center gap-3 p-4 rounded-xl bg-emerald-50/60 border border-emerald-100 text-emerald-900 text-sm">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              <span>All {simState.bins.length} smart bins are operating below 80% capacity. No immediate overflow risk.</span>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {alertBins.map((bin) => {
                const isCritical = bin.fillPercent >= 95;
                return (
                  <div key={bin.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${
                          isCritical ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-600'
                        }`}
                      >
                        <AlertTriangle className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm text-slate-900">{bin.id}</span>
                          <span className="text-xs text-slate-500">· {bin.zoneName}</span>
                        </div>
                        {bin.predictedHoursToFull > 0 && bin.predictedHoursToFull <= 6 && (
                          <span className="text-xs text-red-600 font-medium">
                            Projected overflow in ~{bin.predictedHoursToFull.toFixed(0)} hours
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-3 self-end sm:self-center">
                      <Badge variant={isCritical ? 'red' : 'amber'} size="sm">
                        {isCritical ? 'Critical' : 'Warning'}: {bin.fillPercent.toFixed(0)}% fill
                      </Badge>
                      <Link
                        to="/app/map"
                        className="text-xs font-semibold text-emerald-700 hover:underline"
                      >
                        Inspect on map →
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500">Showing top 5 highest fill telemetry points</span>
            <Link to="/app/map" className="font-semibold text-emerald-700 hover:underline flex items-center gap-1">
              View all {simState.bins.length} bins <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── 10. "About these numbers" + FAQ accordion (Centered max-w-3xl) ─── */}
      <section aria-label="Methodology and FAQ" className="max-w-3xl mx-auto space-y-6 pt-4">
        <div className="text-center space-y-2">
          <h2 className="text-xl font-semibold text-slate-900">
            About these numbers
          </h2>
          <p className="text-sm text-slate-500 leading-relaxed">
            All operational metrics are deterministically computed based on calibrated empirical data from the Pune Pimpri-Chinchwad Municipal Corporation (PCMC) pilot corridor. Simulation models evaluate IoT sensor feeds, 2-Opt CVRP dispatch logic, and facility processing yields.
          </p>
        </div>

        <div className="rounded-2xl bg-white border border-slate-200 shadow-sm divide-y divide-slate-100 px-6 py-2">
          {FAQ_ITEMS.map((item, idx) => {
            const isOpen = openAccordionIndex === idx;
            return (
              <div key={idx} className="py-4">
                <button
                  type="button"
                  id={`faq-btn-${idx}`}
                  aria-expanded={isOpen}
                  aria-controls={`faq-panel-${idx}`}
                  onClick={() => setOpenAccordionIndex(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between text-left text-sm font-semibold text-slate-900 hover:text-emerald-700 transition-colors cursor-pointer"
                >
                  <span>{item.title}</span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  )}
                </button>

                {isOpen && (
                  <div
                    id={`faq-panel-${idx}`}
                    role="region"
                    aria-labelledby={`faq-btn-${idx}`}
                    className="pt-2 text-sm text-slate-600 leading-relaxed animate-in fade-in duration-150"
                  >
                    <p>{item.body}</p>
                    <Link
                      to="/app/assumptions"
                      className="inline-block mt-1 text-xs font-semibold text-emerald-700 hover:underline"
                    >
                      View mathematical assumptions →
                    </Link>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ── 11. Slim footer: PCCOE corridor, simulated note, links ─────────── */}
      <footer className="pt-8 border-t border-slate-200 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>
            PCCOE Pune Pilot Corridor · Akurdi–Chinchwad–Moshi · Deterministic simulation model
          </span>
        </div>

        <div className="flex items-center gap-4 text-slate-600">
          <Link to="/app/assumptions" className="hover:text-emerald-700 hover:underline">
            Assumptions & Roadmap
          </Link>
          <span className="text-slate-300">·</span>
          <Link to="/app/report" className="hover:text-emerald-700 hover:underline">
            Executive Report
          </Link>
          <span className="text-slate-300">·</span>
          <Link to="/app/overview" className="hover:text-emerald-700 hover:underline">
            Concept Overview
          </Link>
        </div>
      </footer>

    </div>
  );
};
