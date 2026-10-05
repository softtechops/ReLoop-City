import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
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
  SlidersHorizontal,
  X,
  RotateCcw,
  Layers,
  Activity,
  HeartHandshake,
  HelpCircle,
  Trees,
  Home,
  Check,
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
import { useChartTheme } from '../lib/chartTheme';

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
    body: 'Open the Scenario Builder to adjust truck count, minimum pickup thresholds, and stream split allocations to test council policy decisions.',
  },
];

type DashboardTab = 'overview' | 'decisions' | 'operations' | 'impact' | 'faq';

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
  const chartTheme = useChartTheme();

  // Tab navigation persisted in URL query (?tab=...)
  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = searchParams.get('tab') as DashboardTab | null;
  const activeTab: DashboardTab =
    tabParam && ['overview', 'decisions', 'operations', 'impact', 'faq'].includes(tabParam)
      ? tabParam
      : 'overview';

  const handleTabChange = (tab: DashboardTab) => {
    setSearchParams({ tab }, { replace: true });
  };

  const activeScenario = useMemo(() => {
    if (!activeScenarioId) return null;
    return savedScenarios.find((s) => s.id === activeScenarioId) || null;
  }, [savedScenarios, activeScenarioId]);

  const [showDataTableFallback, setShowDataTableFallback] = useState(false);
  const [openAccordionIndex, setOpenAccordionIndex] = useState<number | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [isControlsOpen, setIsControlsOpen] = useState(false);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [showAllAlerts, setShowAllAlerts] = useState(false);

  const controlsRef = useRef<HTMLDivElement>(null);

  // Close controls popover on outside click or escape
  useEffect(() => {
    if (!isControlsOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (controlsRef.current && !controlsRef.current.contains(e.target as Node)) {
        setIsControlsOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsControlsOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isControlsOpen]);

  // Auto-start simulation on first dashboard mount if not already running
  useEffect(() => {
    const hasAutoStarted = sessionStorage.getItem('reloop_sim_auto_started');
    if (!hasAutoStarted) {
      sessionStorage.setItem('reloop_sim_auto_started', 'true');
      if (!isSimRunning) {
        startSimulation();
      }
    }
    const t = setTimeout(() => setIsReady(true), 150);
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
    { name: 'Recycled Polymers & Metals', value: displayActive.recycledTonnes, color: chartTheme.resolvedTheme === 'dark' ? '#38BDF8' : '#12305C' },
    { name: 'Organic City Compost', value: displayActive.compostedTonnes, color: '#059669' },
    { name: 'Clean Bio-Energy', value: Number(((displayActive.energyMwh / 0.231) * 0.1).toFixed(1)), color: '#D97706' },
    { name: 'Residual Landfill (inert)', value: displayActive.landfilledTonnes, color: chartTheme.resolvedTheme === 'dark' ? '#94A3B8' : '#64748B' },
  ], [displayActive, chartTheme.resolvedTheme]);

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

  // Bins above 80% — live alerts
  const alertBins = useMemo(() => {
    return simState.bins
      .filter((b) => b.fillPercent >= 80)
      .sort((a, b) => b.fillPercent - a.fillPercent);
  }, [simState.bins]);

  const displayedAlertBins = showAllAlerts ? alertBins : alertBins.slice(0, 5);

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
      <div className="max-w-6xl mx-auto px-6 sm:px-10 py-10 space-y-12" role="status" aria-label="Loading dashboard...">
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
        <Skeleton className="h-64 rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 sm:px-10 py-10 space-y-12 select-none">
      
      {/* ========================================================================= */}
      {/* ── 1. Above the fold: Breadcrumb + Title + Controls Popover + Export ──── */}
      {/* ========================================================================= */}
      <section aria-label="Page identity" className="space-y-3">
        {/* Tiny muted breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-fg-muted">
          <Link to="/app/overview" className="hover:text-fg transition-colors">
            ReLoop City
          </Link>
          <span className="text-fg-subtle">/</span>
          <span className="font-semibold text-fg" aria-current="page">
            Dashboard
          </span>
        </nav>

        {/* Title row with Controls popover + Export menu */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-3xl sm:text-4xl font-semibold text-fg tracking-tight">
                Dashboard
              </h1>
              {/* Info popover tooltip replaces banner */}
              <div className="relative group">
                <span
                  tabIndex={0}
                  role="note"
                  aria-label="Simulated pilot data: Calibrated to Pune PCMC corridor"
                  className="inline-flex items-center justify-center w-6 h-6 rounded-full text-fg-subtle hover:text-fg hover:bg-surface-muted cursor-help transition-colors"
                >
                  <Info className="w-4 h-4" />
                </span>
                <div
                  role="tooltip"
                  className="absolute left-0 sm:left-1/2 -translate-x-4 sm:-translate-x-1/2 top-full mt-2 w-72 p-3 bg-slate-900 dark:bg-slate-800 text-white text-xs rounded-xl shadow-xl z-50 hidden group-hover:block group-focus-within:block pointer-events-none animate-in fade-in duration-100 leading-relaxed"
                >
                  <p className="font-semibold mb-1">Simulated Pilot Data</p>
                  <p className="text-slate-300">
                    Calibrated directly to Pune PCMC empirical waste audits in Akurdi, Chinchwad, and Moshi across 100 smart IoT bins.
                  </p>
                </div>
              </div>
            </div>
            <p className="text-base text-fg-muted mt-1 leading-relaxed">
              Circular mass balance, fleet efficiency and fiscal returns for the Pune PCMC corridor.
            </p>
          </div>

          {/* Action Row: Unified "⋯ Controls" popover + Export Menu */}
          <div className="flex items-center gap-2.5 self-start sm:self-auto flex-wrap">
            {/* Unified Controls Popover */}
            <div className="relative" ref={controlsRef}>
              <button
                type="button"
                onClick={() => setIsControlsOpen((prev) => !prev)}
                aria-haspopup="dialog"
                aria-expanded={isControlsOpen}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-surface border border-line hover:border-slate-300 dark:hover:border-slate-600 text-xs font-semibold text-fg transition-all shadow-2xs cursor-pointer focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-emerald-600"
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Controls</span>
                <ChevronDown className="w-3.5 h-3.5 text-fg-subtle" />
              </button>

              {isControlsOpen && (
                <div
                  role="dialog"
                  aria-label="Simulation and Policy Controls"
                  className="absolute right-0 top-full mt-2 z-50 w-72 rounded-2xl bg-surface border border-line shadow-2xl p-3 space-y-3 animate-in fade-in zoom-in-95 duration-100 text-fg"
                >
                  {/* Scenario status */}
                  <div className="space-y-1 pb-2 border-b border-line">
                    <span className="text-xs font-semibold text-fg-subtle block">
                      Active Policy Scenario
                    </span>
                    <div className="flex items-center justify-between text-xs pt-1">
                      <span className="font-semibold text-fg truncate">
                        {activeScenario ? activeScenario.name : 'Default ReLoop Plan'}
                      </span>
                      <Badge variant={activeScenario ? 'emerald' : 'gray'} size="sm">
                        {activeScenario ? 'Custom' : 'Default'}
                      </Badge>
                    </div>
                    <Link
                      to="/app/scenarios"
                      onClick={() => setIsControlsOpen(false)}
                      className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline font-semibold block pt-1"
                    >
                      Manage in Scenario Builder →
                    </Link>
                  </div>

                  {/* Simulation Speed */}
                  <div className="space-y-1 pb-2 border-b border-line">
                    <span className="text-xs font-semibold text-fg-subtle block mb-1">
                      Simulation Speed
                    </span>
                    <div className="grid grid-cols-3 gap-1">
                      {([1, 10, 60] as const).map((spd) => (
                        <button
                          key={spd}
                          type="button"
                          onClick={() => setSimSpeed(spd)}
                          className={`min-h-[32px] text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                            simSpeed === spd
                              ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-2xs'
                              : 'bg-surface-muted text-fg-muted hover:text-fg hover:bg-slate-200 dark:hover:bg-slate-700'
                          }`}
                        >
                          {spd}x
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Reset Simulation */}
                  <button
                    type="button"
                    onClick={() => {
                      setIsControlsOpen(false);
                      openResetConfirm();
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset Simulation to Day 1</span>
                  </button>
                </div>
              )}
            </div>

            <ExportReportMenu />
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* ── 2. Headline Result: ONE row with prominent sentence ────────────────── */}
      {/* ========================================================================= */}
      <section aria-label="Executive outcome summary" className="pt-1">
        <p className="text-3xl sm:text-4xl font-semibold text-fg tracking-tight leading-snug">
          {mode === 'reloop' ? (
            <>
              ReLoop diverts{' '}
              <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                {displayActive.diversionRatePercent.toFixed(1)}%
              </span>{' '}
              of waste from landfill, up from {displayBaseline.diversionRatePercent.toFixed(1)}% at baseline.
            </>
          ) : (
            <>
              Baseline fixed routes send{' '}
              <span className="text-amber-600 dark:text-amber-400 font-bold">
                {(100 - displayBaseline.diversionRatePercent).toFixed(1)}%
              </span>{' '}
              of collected waste to landfill — {displayDeltas.diversionRate.formattedDelta} less diversion than ReLoop AI.
            </>
          )}
        </p>
        <p className="text-sm text-fg-muted mt-2">
          Municipal pilot across Akurdi, Chinchwad, and Moshi · {simState.bins.length} IoT monitored smart bins.
        </p>
      </section>

      {/* ========================================================================= */}
      {/* ── 3. Primary KPI Cards: Exactly 4 uniform, spacious cards (p-8, text-4xl) */}
      {/* ========================================================================= */}
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
            icon={<Leaf className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />}
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
            icon={<Truck className="w-4 h-4 text-fg-muted" />}
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
            icon={<Coins className="w-4 h-4 text-fg-muted" />}
          />
        </div>
      </section>

      {/* ========================================================================= */}
      {/* ── 4. Progressive Disclosure Tabs: Overview | Decisions | Operations | Impact | FAQ */}
      {/* ========================================================================= */}
      <section aria-label="Detailed analytics and operations views" className="space-y-8">
        
        {/* Tab Bar / Segmented Control */}
        <div className="border-b border-line">
          <nav
            role="tablist"
            aria-label="Dashboard sections"
            className="flex items-center gap-1 sm:gap-6 -mb-px overflow-x-auto no-scrollbar scroll-smooth"
          >
            {[
              { id: 'overview', label: 'Overview', icon: Activity },
              { id: 'decisions', label: 'Decisions', icon: SlidersHorizontal },
              { id: 'operations', label: 'Operations', icon: Layers, badge: alertBins.length > 0 ? alertBins.length : undefined },
              { id: 'impact', label: 'Impact', icon: HeartHandshake },
              { id: 'faq', label: 'FAQ', icon: HelpCircle },
            ].map(({ id, label, icon: Icon, badge }) => {
              const isActive = activeTab === id;
              return (
                <button
                  key={id}
                  role="tab"
                  id={`tab-${id}`}
                  aria-selected={isActive}
                  aria-controls={`panel-${id}`}
                  onClick={() => handleTabChange(id as DashboardTab)}
                  className={`flex items-center gap-2 px-3 sm:px-4 py-3 border-b-2 text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'border-emerald-600 text-emerald-600 dark:border-emerald-400 dark:text-emerald-400'
                      : 'border-transparent text-fg-muted hover:text-fg hover:border-slate-300 dark:hover:border-slate-600'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{label}</span>
                  {badge !== undefined && (
                    <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30">
                      {badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* ── TAB PANEL 1: OVERVIEW (The two charts with takeaway titles) ─────── */}
        {activeTab === 'overview' && (
          <div
            id="panel-overview"
            role="tabpanel"
            aria-labelledby="tab-overview"
            className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in fade-in duration-150"
          >
            {/* Chart 1: Donut chart */}
            <div className="rounded-2xl bg-surface border border-line shadow-xs p-6 sm:p-8 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-2 mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-fg">
                      {displayActive.diversionRatePercent.toFixed(1)}% Diverted to circular streams
                    </h3>
                    <p className="text-sm text-fg-muted mt-0.5">
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
                        contentStyle={chartTheme.tooltipStyle}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-xs font-medium text-fg-subtle">Diversion</span>
                    <span className="text-2xl font-semibold text-fg tabular-nums">
                      {displayActive.diversionRatePercent.toFixed(1)}%
                    </span>
                    <span className={`text-xs font-semibold ${mode === 'reloop' ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}`}>
                      {mode === 'reloop' ? 'Circular' : 'Linear'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Donut Legend */}
              <div className="grid grid-cols-2 gap-2 pt-4 border-t border-line text-xs">
                {donutData.map((item) => (
                  <div key={item.name} className="flex items-center gap-2 p-2 rounded-xl bg-surface-muted border border-line">
                    <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} aria-hidden="true" />
                    <div className="truncate">
                      <span className="font-medium text-fg block truncate">{item.name}</span>
                      <span className="text-fg-muted font-mono">{item.value.toFixed(1)} t</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Chart 2: Cumulative Area chart */}
            <div className="rounded-2xl bg-surface border border-line shadow-xs p-6 sm:p-8 flex flex-col justify-between">
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-fg">
                      Collection peaks at {collectionPeakHour}
                    </h3>
                    <p className="text-sm text-fg-muted mt-0.5">
                      Cumulative collected and diverted waste over time
                    </p>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
                    <div className="flex items-center bg-surface-muted p-0.5 rounded-lg border border-line">
                      {(['today', '7days', 'all'] as const).map((rng) => (
                        <button
                          key={rng}
                          type="button"
                          onClick={() => setDashboardTimeRange(rng)}
                          className={`px-2 py-0.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                            dashboardTimeRange === rng
                              ? 'bg-surface text-fg shadow-2xs'
                              : 'text-fg-muted hover:text-fg'
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
                      className="min-h-[30px] text-xs px-2"
                    >
                      {showDataTableFallback ? 'Chart' : 'Table'}
                    </Button>
                  </div>
                </div>

                {timeSeriesData.length === 0 ? (
                  <div className="h-56 flex items-center justify-center text-sm text-fg-subtle">
                    No data yet — simulation accumulates on each tick.
                  </div>
                ) : showDataTableFallback ? (
                  <div className="h-56 overflow-y-auto">
                    <table className="w-full text-left text-xs">
                      <caption className="sr-only">Hourly Resource Recovery Data</caption>
                      <thead>
                        <tr className="border-b border-line text-fg-muted font-semibold">
                          <th scope="col" className="pb-2">Time</th>
                          <th scope="col" className="pb-2">Collected (t)</th>
                          <th scope="col" className="pb-2">Diverted (t)</th>
                          <th scope="col" className="pb-2">Recycled (t)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-line font-mono">
                        {timeSeriesData.map((d, idx) => (
                          <tr key={idx}>
                            <td className="py-1 text-fg-muted">{d.timestamp}</td>
                            <td className="py-1 text-fg">{d.wasteCollected} t</td>
                            <td className="py-1 font-semibold text-emerald-600 dark:text-emerald-400">{d.landfillAvoided} t</td>
                            <td className="py-1 text-fg">{d.recycled} t</td>
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
                            <stop offset="5%" stopColor={chartTheme.resolvedTheme === 'dark' ? '#38BDF8' : '#12305C'} stopOpacity={chartTheme.resolvedTheme === 'dark' ? 0.35 : 0.2} />
                            <stop offset="95%" stopColor={chartTheme.resolvedTheme === 'dark' ? '#38BDF8' : '#12305C'} stopOpacity={0} />
                          </linearGradient>
                          <linearGradient id="colorDivertedDash" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={chartTheme.resolvedTheme === 'dark' ? '#34D399' : '#059669'} stopOpacity={chartTheme.resolvedTheme === 'dark' ? 0.4 : 0.25} />
                            <stop offset="95%" stopColor={chartTheme.resolvedTheme === 'dark' ? '#34D399' : '#059669'} stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke={chartTheme.gridColor} />
                        <XAxis dataKey="timestamp" stroke={chartTheme.axisColor} fontSize={12} tickLine={false} />
                        <YAxis stroke={chartTheme.axisColor} fontSize={12} tickLine={false} />
                        <RechartsTooltip contentStyle={chartTheme.tooltipStyle} />
                        <Area type="monotone" dataKey="wasteCollected" name="Collected (t)" stroke={chartTheme.resolvedTheme === 'dark' ? '#38BDF8' : '#12305C'} strokeWidth={2} fillOpacity={1} fill="url(#colorCollectedDash)" />
                        <Area type="monotone" dataKey="landfillAvoided" name="Diverted (t)" stroke={chartTheme.resolvedTheme === 'dark' ? '#34D399' : '#059669'} strokeWidth={2} fillOpacity={1} fill="url(#colorDivertedDash)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </div>

              {/* Area Chart Legend */}
              <div className="flex items-center gap-5 pt-4 border-t border-line text-xs">
                <span className="flex items-center gap-1.5 font-medium text-fg">
                  <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: chartTheme.resolvedTheme === 'dark' ? '#38BDF8' : '#12305C' }} aria-hidden="true" />
                  Waste Collected
                </span>
                <span className="flex items-center gap-1.5 font-medium text-emerald-600 dark:text-emerald-400">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#059669] flex-shrink-0" aria-hidden="true" />
                  Landfill Diverted
                </span>
                <span className="ml-auto text-fg-subtle font-mono hidden sm:inline">
                  {simState.history.length} ticks recorded
                </span>
              </div>
            </div>
          </div>
        )}

        {/* ── TAB PANEL 2: DECISIONS (Role card, 4 decision cards, priority bins) */}
        {activeTab === 'decisions' && (
          <div
            id="panel-decisions"
            role="tabpanel"
            aria-labelledby="tab-decisions"
            className="space-y-6 animate-in fade-in duration-150"
          >
            {/* Collapsed light Role Card with "Learn more" modal */}
            {!roleCardDismissed ? (
              <div className="rounded-xl bg-emerald-50 border border-emerald-200/60 dark:bg-emerald-500/10 dark:border-emerald-500/25 px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-sm text-emerald-950 dark:text-emerald-200">
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                  <span>
                    <strong>Operations Manager:</strong> Raise landfill diversion and cut fleet cost across Pune PCMC.
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsRoleModalOpen(true)}
                    className="font-semibold text-emerald-700 dark:text-emerald-300 underline hover:text-emerald-900 cursor-pointer ml-1"
                  >
                    Learn more
                  </button>
                </div>
                <button
                  type="button"
                  onClick={dismissRoleCard}
                  className="text-xs font-medium text-emerald-700 dark:text-emerald-400 hover:underline self-start sm:self-auto cursor-pointer"
                >
                  Dismiss
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between px-3 py-1.5 rounded-lg bg-surface-muted border border-line text-xs text-fg-muted">
                <span className="flex items-center gap-1.5 font-medium text-fg">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  Operations Manager mode active · Akurdi–Chinchwad–Moshi Corridor
                </span>
                <button
                  type="button"
                  onClick={resetRoleCard}
                  className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline font-semibold cursor-pointer"
                >
                  Show role banner
                </button>
              </div>
            )}

            {/* 4 Decision Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Decision 1: Active scenario */}
              <div className="rounded-2xl bg-surface border border-line shadow-xs p-6 hover:-translate-y-0.5 hover:border-emerald-500/50 transition-all duration-200 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-fg-muted flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0" />
                      Active scenario
                    </span>
                    <Badge variant={activeScenario ? 'emerald' : 'navy'} size="sm">
                      {activeScenario ? 'Custom' : 'Default'}
                    </Badge>
                  </div>
                  <p className="text-base font-semibold text-fg truncate">
                    {activeScenario ? activeScenario.name : 'Default ReLoop Plan'}
                  </p>
                  <p className="text-xs text-fg-muted leading-relaxed">
                    {activeScenario
                      ? `${activeScenario.config.numberOfTrucks || 4} trucks · ${Math.round((activeScenario.config.dispatchFillThreshold ?? 0.75) * 100)}% threshold`
                      : '4 trucks · 75% fill threshold · 4.5 t cap'}
                  </p>
                </div>
                <div className="pt-3 mt-4 border-t border-line">
                  <Link to="/app/scenarios" className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline">
                    Configure policy →
                  </Link>
                </div>
              </div>

              {/* Decision 2: Priority bins */}
              <div className="rounded-2xl bg-surface border border-line shadow-xs p-6 hover:-translate-y-0.5 hover:border-emerald-500/50 transition-all duration-200 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-fg-muted flex items-center gap-2">
                      <span
                        className={`w-2 h-2 rounded-full flex-shrink-0 ${
                          priorityBinIds.length > 0 ? 'bg-amber-500' : 'bg-slate-300 dark:bg-slate-600'
                        }`}
                      />
                      Priority bins
                    </span>
                    <Badge variant={priorityBinIds.length > 0 ? 'amber' : 'gray'} size="sm">
                      {priorityBinIds.length} flagged
                    </Badge>
                  </div>
                  <p className="text-base font-semibold text-fg">
                    {priorityBinIds.length > 0 ? `${priorityBinIds.length} flagged for pickup` : 'No bins flagged'}
                  </p>
                  <p className="text-xs text-fg-muted leading-relaxed">
                    {priorityBinIds.length > 0
                      ? `Pins: ${priorityBinIds.slice(0, 3).join(', ')}${priorityBinIds.length > 3 ? '...' : ''}`
                      : 'Mark high-priority locations on the Sense map.'}
                  </p>
                </div>
                <div className="pt-3 mt-4 border-t border-line flex items-center justify-between text-xs">
                  <Link to="/app/map" className="font-semibold text-emerald-600 dark:text-emerald-400 hover:underline">
                    View on map →
                  </Link>
                  {priorityBinIds.length > 0 && (
                    <button
                      type="button"
                      onClick={clearPriorityBins}
                      className="text-fg-subtle hover:text-rose-500 underline cursor-pointer"
                    >
                      Clear all
                    </button>
                  )}
                </div>
              </div>

              {/* Decision 3: Material & energy */}
              <div className="rounded-2xl bg-surface border border-line shadow-xs p-6 hover:-translate-y-0.5 hover:border-emerald-500/50 transition-all duration-200 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-fg-muted flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0" />
                      Material & energy
                    </span>
                    <Badge variant="emerald" size="sm">
                      Optimized
                    </Badge>
                  </div>
                  <p className="text-base font-semibold text-fg">
                    {allocationStrategy === 'balanced'
                      ? 'Balanced Diversion'
                      : allocationStrategy === 'max_energy'
                      ? 'Max Bio-Energy'
                      : 'Max Material Recovery'}
                  </p>
                  <p className="text-xs text-fg-muted leading-relaxed truncate">
                    Offtake: {energyOfftakeCommitment === 'grid' ? 'MSEDCL Grid (₹6.80)' : 'PMPML EV Depot (₹7.20)'}
                  </p>
                </div>
                <div className="pt-3 mt-4 border-t border-line">
                  <Link to="/app/allocate" className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline">
                    Change stream split →
                  </Link>
                </div>
              </div>

              {/* Decision 4: Council submission */}
              <div className="rounded-2xl bg-surface border border-line shadow-xs p-6 hover:-translate-y-0.5 hover:border-emerald-500/50 transition-all duration-200 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-fg-muted flex items-center gap-2">
                      <span
                        className={`w-2 h-2 rounded-full flex-shrink-0 ${
                          councilReportApproved ? 'bg-emerald-500' : 'bg-amber-500'
                        }`}
                      />
                      Council submission
                    </span>
                    <Badge variant={councilReportApproved ? 'emerald' : 'amber'} size="sm">
                      {councilReportApproved ? 'Certified' : 'Draft'}
                    </Badge>
                  </div>
                  <p className="text-base font-semibold text-fg">
                    {councilReportApproved ? 'Approved by Operations' : 'Sign-off pending'}
                  </p>
                  <p className="text-xs text-fg-muted leading-relaxed">
                    {councilReportApproved ? 'Ready for standing committee.' : 'Review 6 circular revenue streams.'}
                  </p>
                </div>
                <div className="pt-3 mt-4 border-t border-line">
                  <Link to="/app/revenue" className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline">
                    Open council report →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── TAB PANEL 3: OPERATIONS (Alerts list + 7-Step Modules grid) ────── */}
        {activeTab === 'operations' && (
          <div
            id="panel-operations"
            role="tabpanel"
            aria-labelledby="tab-operations"
            className="space-y-8 animate-in fade-in duration-150"
          >
            {/* Live Alerts List */}
            <div className="rounded-2xl bg-surface border border-line shadow-xs p-6 sm:p-8 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-fg">Live Alerts</h3>
                  <p className="text-sm text-fg-muted mt-0.5">
                    Smart bins exceeding 80% capacity or projected overflow risk
                  </p>
                </div>
                <Badge variant={alertBins.length > 0 ? 'red' : 'emerald'} size="sm">
                  {alertBins.length > 0 ? `${alertBins.length} alert${alertBins.length > 1 ? 's' : ''}` : 'All clear'}
                </Badge>
              </div>

              {alertBins.length === 0 ? (
                <div className="flex items-center gap-3 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-800 dark:text-emerald-300 text-sm">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                  <span>All {simState.bins.length} smart bins are operating below 80% capacity. No immediate overflow risk.</span>
                </div>
              ) : (
                <div className="divide-y divide-line">
                  {displayedAlertBins.map((bin) => {
                    const isCritical = bin.fillPercent >= 95;
                    return (
                      <div key={bin.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${
                              isCritical ? 'bg-rose-500/15 text-rose-600 dark:text-rose-400' : 'bg-amber-500/15 text-amber-600 dark:text-amber-400'
                            }`}
                          >
                            <AlertTriangle className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-sm text-fg">{bin.id}</span>
                              <span className="text-xs text-fg-muted">· {bin.zoneName}</span>
                            </div>
                            {bin.predictedHoursToFull > 0 && bin.predictedHoursToFull <= 6 && (
                              <span className="text-xs text-rose-600 dark:text-rose-400 font-medium">
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
                            className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
                          >
                            Inspect on map →
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Show more pattern */}
              <div className="pt-2 border-t border-line flex items-center justify-between text-xs">
                {alertBins.length > 5 && (
                  <button
                    type="button"
                    onClick={() => setShowAllAlerts((prev) => !prev)}
                    className="font-semibold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
                  >
                    {showAllAlerts ? 'Show less (5 items)' : `Show all (${alertBins.length} alerts)`}
                  </button>
                )}
                <Link to="/app/map" className="font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 ml-auto">
                  View all {simState.bins.length} bins <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* 7-Step Circular Loop modules grid */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-fg">7-Step Circular Loop</h3>
                  <p className="text-sm text-fg-muted mt-0.5">End-to-end circular waste intelligence pipeline</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {LOOP_STEPS.map(({ step, name, path, icon: Icon, desc }) => (
                  <div
                    key={step}
                    className="rounded-2xl bg-surface border border-line shadow-xs p-6 hover:-translate-y-0.5 hover:border-emerald-500/50 hover:shadow-sm transition-all duration-200 flex flex-col justify-between h-full"
                  >
                    <div>
                      <div className="flex items-center gap-2.5 mb-3">
                        <div className="w-7 h-7 rounded-lg bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 flex items-center justify-center text-xs font-bold flex-shrink-0">
                          {step}
                        </div>
                        <Icon className="w-4 h-4 text-fg-muted flex-shrink-0" aria-hidden="true" />
                        <span className="text-base font-semibold text-fg">{name}</span>
                      </div>
                      <p className="text-sm text-fg-muted leading-relaxed">
                        {desc}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-line flex items-center justify-between text-xs">
                      <span className="font-semibold text-emerald-600 dark:text-emerald-400 truncate pr-2">
                        {stepLiveMetrics[step]}
                      </span>
                      <Link
                        to={path}
                        className="font-semibold text-fg hover:text-emerald-600 dark:hover:text-emerald-400 flex items-center gap-1 whitespace-nowrap focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-emerald-500 rounded"
                        aria-label={`Open step ${step}: ${name}`}
                      >
                        Open <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── TAB PANEL 4: IMPACT (Equivalents row + baseline vs reloop comparison) */}
        {activeTab === 'impact' && (
          <div
            id="panel-impact"
            role="tabpanel"
            aria-labelledby="tab-impact"
            className="space-y-8 animate-in fade-in duration-150"
          >
            {/* Clean row of 4 large numbers with labels */}
            <div>
              <div className="mb-4">
                <h3 className="text-xl font-semibold text-fg">Environmental Equivalents</h3>
                <p className="text-sm text-fg-muted mt-0.5">
                  Real-world carbon offset and municipal savings calibrated to the pilot corridor
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Equivalent 1: CO2 Avoided */}
                <div className="rounded-2xl bg-surface border border-line p-6 sm:p-7 shadow-xs">
                  <div className="flex items-center gap-2 mb-2 text-emerald-600 dark:text-emerald-400">
                    <Leaf className="w-4 h-4" />
                    <span className="text-xs font-semibold uppercase tracking-wider">CO₂e Avoided</span>
                  </div>
                  <div className="text-4xl font-semibold text-fg tabular-nums mb-1">
                    {displayActive.co2AvoidedTonnes.toFixed(1)} <span className="text-xl font-normal text-fg-muted">tonnes</span>
                  </div>
                  <p className="text-xs text-fg-muted">
                    ≈ {carKmOffset.toLocaleString('en-IN')} car km offset
                  </p>
                </div>

                {/* Equivalent 2: Truckloads saved */}
                <div className="rounded-2xl bg-surface border border-line p-6 sm:p-7 shadow-xs">
                  <div className="flex items-center gap-2 mb-2 text-fg-muted">
                    <Truck className="w-4 h-4" />
                    <span className="text-xs font-semibold uppercase tracking-wider">Compactors Saved</span>
                  </div>
                  <div className="text-4xl font-semibold text-fg tabular-nums mb-1">
                    {landfillTrucks} <span className="text-xl font-normal text-fg-muted">trips</span>
                  </div>
                  <p className="text-xs text-fg-muted">
                    4.5 t compactor truckloads avoided
                  </p>
                </div>

                {/* Equivalent 3: Homes powered */}
                <div className="rounded-2xl bg-surface border border-line p-6 sm:p-7 shadow-xs">
                  <div className="flex items-center gap-2 mb-2 text-amber-500">
                    <Home className="w-4 h-4" />
                    <span className="text-xs font-semibold uppercase tracking-wider">Homes Powered</span>
                  </div>
                  <div className="text-4xl font-semibold text-fg tabular-nums mb-1">
                    {homesMonthly.toLocaleString('en-IN')} <span className="text-xl font-normal text-fg-muted">homes</span>
                  </div>
                  <p className="text-xs text-fg-muted">
                    Monthly domestic clean power
                  </p>
                </div>

                {/* Equivalent 4: Trees equivalent */}
                <div className="rounded-2xl bg-surface border border-line p-6 sm:p-7 shadow-xs">
                  <div className="flex items-center gap-2 mb-2 text-emerald-600 dark:text-emerald-400">
                    <Trees className="w-4 h-4" />
                    <span className="text-xs font-semibold uppercase tracking-wider">Trees Preserved</span>
                  </div>
                  <div className="text-4xl font-semibold text-fg tabular-nums mb-1">
                    {treesEquivalent.toLocaleString('en-IN')} <span className="text-xl font-normal text-fg-muted">years</span>
                  </div>
                  <p className="text-xs text-fg-muted">
                    Urban tree carbon absorption
                  </p>
                </div>
              </div>
            </div>

            {/* Baseline vs ReLoop Side-by-Side Comparison */}
            <div className="rounded-2xl bg-surface border border-line shadow-xs p-6 sm:p-8">
              <div className="mb-4">
                <h3 className="text-xl font-semibold text-fg">Baseline vs ReLoop Side-by-Side</h3>
                <p className="text-sm text-fg-muted mt-0.5">
                  Identical municipal waste input calibrated to Pune PCMC corridor
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                {[
                  {
                    label: 'Landfill diversion rate',
                    icon: <Leaf className="w-4 h-4 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />,
                    baseVal: `${displayBaseline.diversionRatePercent.toFixed(1)}%`,
                    reloopVal: `${displayReloop.diversionRatePercent.toFixed(1)}%`,
                    baseWidth: displayBaseline.diversionRatePercent,
                    reloopWidth: displayReloop.diversionRatePercent,
                    delta: displayDeltas.diversionRate.formattedDelta,
                  },
                  {
                    label: 'Fleet distance',
                    icon: <Truck className="w-4 h-4 text-fg-muted" aria-hidden="true" />,
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
                  <div key={label} className="space-y-2 p-4 rounded-xl bg-surface-muted border border-line">
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-1.5 font-semibold text-fg">
                        {icon}
                        {label}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
                        {delta}
                      </span>
                    </div>
                    <div className="space-y-1.5 pt-2">
                      <div>
                        <div className="flex justify-between text-xs text-fg-muted mb-1">
                          <span>Baseline (Fixed)</span>
                          <span className="font-mono font-medium">{baseVal}</span>
                        </div>
                        <div className="h-2 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                          <div className="h-full bg-amber-500 rounded-full" style={{ width: `${Math.min(100, Math.max(2, baseWidth))}%` }} />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-xs text-fg font-semibold mb-1">
                          <span>ReLoop (AI)</span>
                          <span className="font-mono text-emerald-600 dark:text-emerald-400">{reloopVal}</span>
                        </div>
                        <div className="h-2.5 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-600 dark:bg-emerald-500 rounded-full" style={{ width: `${Math.min(100, Math.max(2, reloopWidth))}%` }} />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── TAB PANEL 5: FAQ (Methodology accordion) ───────────────────────── */}
        {activeTab === 'faq' && (
          <div
            id="panel-faq"
            role="tabpanel"
            aria-labelledby="tab-faq"
            className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-150"
          >
            <div className="text-center space-y-2">
              <h3 className="text-2xl font-semibold text-fg">About these numbers</h3>
              <p className="text-sm text-fg-muted leading-relaxed">
                All operational metrics are deterministically computed based on calibrated empirical data from the Pune Pimpri-Chinchwad Municipal Corporation (PCMC) pilot corridor.
              </p>
            </div>

            <div className="rounded-2xl bg-surface border border-line shadow-xs divide-y divide-line px-6 py-2">
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
                      className="w-full flex items-center justify-between text-left text-sm font-semibold text-fg hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors cursor-pointer"
                    >
                      <span>{item.title}</span>
                      {isOpen ? (
                        <ChevronUp className="w-4 h-4 text-fg-subtle flex-shrink-0" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-fg-subtle flex-shrink-0" />
                      )}
                    </button>

                    {isOpen && (
                      <div
                        id={`faq-panel-${idx}`}
                        role="region"
                        aria-labelledby={`faq-btn-${idx}`}
                        className="pt-2 text-sm text-fg-muted leading-relaxed animate-in fade-in duration-150"
                      >
                        <p>{item.body}</p>
                        <Link
                          to="/app/assumptions"
                          className="inline-block mt-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
                        >
                          View mathematical assumptions →
                        </Link>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </section>

      {/* ========================================================================= */}
      {/* ── 5. Role Card Explanation Modal ─────────────────────────────────────── */}
      {/* ========================================================================= */}
      {isRoleModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Operations Manager Role Guide"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200"
        >
          <div className="relative w-full max-w-lg bg-surface border border-line rounded-2xl shadow-2xl p-6 sm:p-8 space-y-4 animate-in zoom-in-95 duration-150 text-fg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <h3 className="text-lg font-semibold text-fg">Operations Manager Role</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsRoleModalOpen(false)}
                className="p-1 rounded-lg text-fg-subtle hover:text-fg hover:bg-surface-muted transition-colors cursor-pointer"
                aria-label="Close dialog"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-sm text-fg-muted leading-relaxed">
              <p>
                As the Municipal Operations Manager for the Pune PCMC pilot corridor (Akurdi, Chinchwad, Moshi), your primary mandate is to:
              </p>
              <ul className="space-y-2 list-disc pl-5">
                <li><strong className="text-fg">Maximize Landfill Diversion:</strong> Route organic and recyclable fractions away from the Moshi open dumpsite.</li>
                <li><strong className="text-fg">Minimize Fleet Costs & Fuel:</strong> Use CVRP dynamic dispatch to prevent empty truck runs.</li>
                <li><strong className="text-fg">Verify Circular Revenue:</strong> Ensure transparent settlement across EPR certificates, clean electricity feed-in tariffs, and certified compost.</li>
              </ul>
              <p className="pt-2 text-xs text-fg-subtle">
                You can fine-tune truck capacities, thresholds, and stream splits at any time in the Scenario Builder.
              </p>
            </div>

            <div className="pt-4 border-t border-line flex justify-end">
              <Button
                variant="primary"
                onClick={() => setIsRoleModalOpen(false)}
              >
                Got it
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ── 6. Slim Municipal Footer ───────────────────────────────────────────── */}
      {/* ========================================================================= */}
      <footer className="pt-8 border-t border-line text-xs text-fg-muted flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
          <span>
            PCCOE Pune Pilot Corridor · Akurdi–Chinchwad–Moshi · Calibrated empirical simulation model
          </span>
        </div>

        <div className="flex items-center gap-4 text-fg-muted">
          <Link to="/app/assumptions" className="hover:text-emerald-600 dark:hover:text-emerald-400 hover:underline">
            Assumptions
          </Link>
          <span className="text-fg-subtle">·</span>
          <Link to="/app/report" className="hover:text-emerald-600 dark:hover:text-emerald-400 hover:underline">
            Report
          </Link>
          <span className="text-fg-subtle">·</span>
          <Link to="/app/overview" className="hover:text-emerald-600 dark:hover:text-emerald-400 hover:underline">
            Overview
          </Link>
        </div>
      </footer>

    </div>
  );
};
