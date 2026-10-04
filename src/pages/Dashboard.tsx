import React, { useState, useMemo, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { computeMetrics, PILOT_30DAY_SNAPSHOT, assertMetricsIntegrity } from '../lib/metrics';
import { formatCurrencyINR, formatTonnage } from '../lib/formatters';
import { PageHeader } from '../components/ui/PageHeader';
import { StatCard } from '../components/ui/StatCard';
import { SectionCard } from '../components/ui/SectionCard';
import { InfoPopover } from '../components/ui/InfoPopover';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { LoopStepNav } from '../components/ui/LoopStepNav';
import { 
  Sparkles, 
  Leaf, 
  Zap, 
  Coins, 
  Recycle, 
  Clock, 
  TrendingUp,
  Table as TableIcon,
  Play,
  Pause,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Truck,
  Flame,
  Info
} from 'lucide-react';
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
  CartesianGrid 
} from 'recharts';

export const Dashboard: React.FC = () => {
  const { 
    simState, 
    mode, 
    setMode, 
    config,
    isSimRunning,
    simSpeed,
    startSimulation,
    pauseSimulation,
    dashboardTimeRange,
    setDashboardTimeRange,
  } = useStore();

  const [showDataTableFallback, setShowDataTableFallback] = useState(false);

  // Auto-start simulation on first dashboard mount if not already running
  useEffect(() => {
    const hasAutoStarted = sessionStorage.getItem('reloop_sim_auto_started');
    if (!hasAutoStarted) {
      sessionStorage.setItem('reloop_sim_auto_started', 'true');
      if (!isSimRunning) {
        startSimulation();
      }
    }
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

  // Donut chart composition data with fixed semantic color roles:
  // sage/emerald = recovered/recycled/compost, amber = energy, navy = money/primary, slate = landfill
  const donutData = useMemo(() => [
    { name: 'Recycled Polymers & Metals', value: activeMetrics.recycledTonnes, color: '#12305C' }, // Navy (primary recovered)
    { name: 'Organic City Compost', value: activeMetrics.compostedTonnes, color: '#059669' }, // Emerald (organic soil)
    { name: 'Clean Bio-Energy Recovery', value: Number(((activeMetrics.energyMwh / 0.21) * 0.1).toFixed(1)), color: '#D97706' }, // Amber (energy)
    { name: 'C&D Aggregates / M-Sand', value: Number((activeMetrics.recycledTonnes * 0.35).toFixed(1)), color: '#2563EB' }, // Blue
    { name: 'Residual Landfill (Inert)', value: activeMetrics.landfilledTonnes, color: '#64748B' }, // Slate gray (landfill)
  ], [activeMetrics]);

  // Filter trend data by time range (Today / 7 days / All)
  const timeSeriesData = useMemo(() => {
    let sliced = simState.history;
    if (dashboardTimeRange === 'today') {
      sliced = simState.history.slice(-8);
    } else if (dashboardTimeRange === '7days') {
      sliced = simState.history.slice(-14);
    }

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

  // Headline dynamic copy generated purely from metrics
  const headlineCopy = mode === 'reloop'
    ? `ReLoop AI diverts ${activeMetrics.diversionRatePercent.toFixed(1)}% of municipal waste and generated ${formatCurrencyINR(activeMetrics.revenueInr)} in circular value this pilot.`
    : `Baseline static routes dump ${((baselineMetrics.landfilledTonnes / (baselineMetrics.collectedTonnes || 1)) * 100).toFixed(1)}% of municipal waste into Moshi dumpsite with 32% extra diesel burned.`;

  return (
    <div className="space-y-6 pb-12">
      
      {/* 1. Page Header */}
      <PageHeader
        title="Dashboard"
        subtitle="Real-time circular mass balance, clean energy generation, and fiscal return for Pune pilot corridor."
        showBackToDashboard={false}
      />

      {/* 2. Top Headline Answer with Mode Switch & Status Chip (Phase 4 requirement 1) */}
      <section 
        aria-label="Executive summary and mode control"
        className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-navy-900 via-navy-900 to-navy-950 text-white shadow-lg border border-navy-800"
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          {/* Headline Text */}
          <div className="space-y-1.5 flex-1">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                <Sparkles className="w-3.5 h-3.5" />
                Live Model Outcome
              </span>
              <span className="text-xs text-charcoal-400 font-mono hidden sm:inline">
                Akurdi–Chinchwad–Moshi Pilot
              </span>
            </div>
            <p 
              key={mode} 
              className="text-lg sm:text-xl md:text-2xl font-black font-heading tracking-tight text-white leading-snug animate-in fade-in duration-300"
            >
              {headlineCopy}
            </p>
          </div>

          {/* Mode Switch + Status Chip */}
          <div className="flex flex-wrap items-center gap-3 self-start lg:self-center">
            {/* Status Chip */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/10 border border-white/15 text-xs font-mono text-white/90">
              <span 
                className={`w-2 h-2 rounded-full ${isSimRunning ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} 
                aria-hidden="true" 
              />
              <span className="font-semibold">
                {isSimRunning ? 'Running' : 'Paused'} · Day {simState.currentDay} · {simSpeed}x
              </span>
            </div>

            {/* Clear Mode Switch (Baseline | ReLoop) */}
            <div 
              role="radiogroup" 
              aria-label="Simulation Operational Mode" 
              className="flex items-center bg-navy-950/80 p-1 rounded-2xl border border-navy-700 shadow-inner"
            >
              <button
                type="button"
                role="radio"
                aria-checked={mode === 'baseline'}
                onClick={() => setMode('baseline')}
                className={`px-4 py-2 min-h-[44px] rounded-xl text-sm font-bold transition-all cursor-pointer flex items-center gap-1.5 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-amber-400 ${
                  mode === 'baseline'
                    ? 'bg-amber-600 text-white shadow-md'
                    : 'text-charcoal-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <Clock className="w-4 h-4" aria-hidden="true" />
                <span>Baseline</span>
              </button>
              <button
                type="button"
                role="radio"
                aria-checked={mode === 'reloop'}
                onClick={() => setMode('reloop')}
                className={`px-4 py-2 min-h-[44px] rounded-xl text-sm font-bold transition-all cursor-pointer flex items-center gap-1.5 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-emerald-400 ${
                  mode === 'reloop'
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'text-charcoal-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <Sparkles className="w-4 h-4 text-emerald-200" aria-hidden="true" />
                <span>ReLoop</span>
              </button>
            </div>
          </div>
        </div>

        {/* Paused state friendly banner if paused */}
        {!isSimRunning && (
          <div className="mt-4 pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs text-amber-200">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />
              <span>Simulation is currently paused. Press Run to stream real-time IoT bin fill updates.</span>
            </div>
            <button
              type="button"
              onClick={startSimulation}
              className="px-3 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-navy-950 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Resume Stream</span>
            </button>
          </div>
        )}
      </section>

      {/* 3. Three Hero KPIs (Phase 4 requirement 2: 40-48px numbers, sparkline inside, delta badge) */}
      <section aria-label="Hero key performance indicators">
        <h2 className="text-xs font-bold uppercase tracking-wider text-charcoal-500 px-1 mb-3">
          Primary Impact Outcomes (3 Core KPIs)
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Hero 1: Landfill Avoided */}
          <StatCard
            isHero
            title="Landfill Diversion"
            value={formatTonnage(activeMetrics.landfillAvoidedTonnes)}
            unit={`(${activeMetrics.diversionRatePercent.toFixed(1)}%)`}
            calculationInfo="Gross municipal tonnage diverted from dumpsites through optical recycling, anaerobic digestion, composting, and RDF fuel recovery."
            delta={mode === 'reloop' ? {
              percentStr: deltas.diversionRate.formattedDelta,
              isPositive: true,
              isNeutral: false,
              isImprovement: true,
              ariaLabel: `${deltas.diversionRate.formattedDelta} higher diversion than baseline`,
            } : undefined}
            deltaLabel="vs Baseline"
            accentColor="emerald"
            icon={<Leaf className="w-5 h-5 text-emerald-600" />}
          />

          {/* Hero 2: Clean Energy Generated */}
          <StatCard
            isHero
            title="Clean Energy Generated"
            value={activeMetrics.energyMwh.toFixed(1)}
            unit="MWh Clean Power"
            calculationInfo="Calculated based on bio-methanation yield (~110 m³ biogas / t organic) and CHP conversion (~2.1 kWh / m³ biogas) supplied to the Pune grid."
            delta={mode === 'reloop' ? {
              percentStr: deltas.energyMwh.formattedDelta,
              isPositive: true,
              isNeutral: false,
              isImprovement: true,
              ariaLabel: `${deltas.energyMwh.formattedDelta} clean energy than baseline`,
            } : undefined}
            deltaLabel="vs Baseline"
            accentColor="amber"
            icon={<Zap className="w-5 h-5 text-amber-600" />}
          />

          {/* Hero 3: Circular Revenue */}
          <StatCard
            isHero
            title="Resource Value Created"
            value={formatCurrencyINR(activeMetrics.revenueInr)}
            unit="Gross Revenue"
            calculationInfo="Combined revenue from sorted polymer flakes, aluminum scrap, electricity feed-in tariffs, city compost, and EPR certificate sales."
            delta={mode === 'reloop' ? {
              percentStr: deltas.revenueInr.formattedDelta,
              isPositive: true,
              isNeutral: false,
              isImprovement: true,
              ariaLabel: `${deltas.revenueInr.formattedDelta} revenue than baseline`,
            } : undefined}
            deltaLabel="vs Baseline"
            accentColor="navy"
            icon={<Coins className="w-5 h-5 text-navy-600" />}
          />
        </div>
      </section>

      {/* 4. Comparison Panel (Phase 4 requirement 3: The "Aha" Baseline vs ReLoop side by side) */}
      <section 
        aria-label="Direct strategy comparison"
        className="p-6 sm:p-7 rounded-3xl bg-white border border-charcoal-200 shadow-sm space-y-6"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-charcoal-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" aria-hidden="true" />
              <h2 className="text-lg font-bold text-navy-900 font-heading">
                Side-by-Side Comparison: Baseline vs ReLoop AI
              </h2>
            </div>
            <p className="text-sm text-charcoal-600 mt-0.5">
              Direct paired benchmarking: Unoptimized fixed schedules vs AI dynamic closed loop on identical municipal waste.
            </p>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-4 text-xs font-semibold">
            <span className="flex items-center gap-1.5 text-charcoal-600">
              <span className="w-3 h-3 rounded-md bg-amber-500" aria-hidden="true" />
              Baseline (Fixed Schedule)
            </span>
            <span className="flex items-center gap-1.5 text-emerald-800">
              <span className="w-3 h-3 rounded-md bg-emerald-600" aria-hidden="true" />
              ReLoop (AI-Optimized)
            </span>
          </div>
        </div>

        {/* 4 Paired Comparison Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Comparison 1: Diversion Rate */}
          <div className="p-4 rounded-2xl bg-charcoal-50/70 border border-charcoal-200/80 space-y-2.5">
            <div className="flex items-center justify-between text-sm">
              <span className="font-bold text-navy-900 flex items-center gap-1.5">
                <Leaf className="w-4 h-4 text-emerald-600" />
                Landfill Diversion Rate
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                {deltas.diversionRate.formattedDelta} diversion
              </span>
            </div>

            {/* Paired Bars */}
            <div className="space-y-1.5 pt-1">
              <div>
                <div className="flex justify-between text-xs text-charcoal-600 mb-1">
                  <span>Baseline</span>
                  <span className="font-mono font-bold">{baselineMetrics.diversionRatePercent.toFixed(1)}%</span>
                </div>
                <div className="h-3 w-full bg-charcoal-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-amber-500 rounded-full transition-all duration-500 ease-out" 
                    style={{ width: `${Math.min(100, Math.max(5, baselineMetrics.diversionRatePercent))}%` }} 
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs text-emerald-900 font-bold mb-1">
                  <span>ReLoop AI</span>
                  <span className="font-mono">{reloopMetrics.diversionRatePercent.toFixed(1)}%</span>
                </div>
                <div className="h-3.5 w-full bg-charcoal-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-emerald-600 rounded-full transition-all duration-500 ease-out" 
                    style={{ width: `${Math.min(100, Math.max(5, reloopMetrics.diversionRatePercent))}%` }} 
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Comparison 2: Route Km & Diesel */}
          <div className="p-4 rounded-2xl bg-charcoal-50/70 border border-charcoal-200/80 space-y-2.5">
            <div className="flex items-center justify-between text-sm">
              <span className="font-bold text-navy-900 flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-navy-700" />
                Fleet Distance & Fuel
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                {deltas.routeKm.formattedDelta} distance
              </span>
            </div>

            {/* Paired Bars */}
            <div className="space-y-1.5 pt-1">
              <div>
                <div className="flex justify-between text-xs text-charcoal-600 mb-1">
                  <span>Baseline (Static Route)</span>
                  <span className="font-mono font-bold">{baselineMetrics.routeKm.toFixed(0)} km</span>
                </div>
                <div className="h-3 w-full bg-charcoal-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-amber-500 rounded-full transition-all duration-500 ease-out" 
                    style={{ width: '100%' }} 
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs text-emerald-900 font-bold mb-1">
                  <span>ReLoop (CVRP AI Routing)</span>
                  <span className="font-mono">{reloopMetrics.routeKm.toFixed(0)} km</span>
                </div>
                <div className="h-3.5 w-full bg-charcoal-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-emerald-600 rounded-full transition-all duration-500 ease-out" 
                    style={{ width: `${Math.round((reloopMetrics.routeKm / (baselineMetrics.routeKm || 1)) * 100)}%` }} 
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Comparison 3: Overflow Incidents */}
          <div className="p-4 rounded-2xl bg-charcoal-50/70 border border-charcoal-200/80 space-y-2.5">
            <div className="flex items-center justify-between text-sm">
              <span className="font-bold text-navy-900 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                Overflow Bin Incidents
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                {deltas.overflowEvents.formattedDelta} overflows
              </span>
            </div>

            {/* Paired Bars */}
            <div className="space-y-1.5 pt-1">
              <div>
                <div className="flex justify-between text-xs text-charcoal-600 mb-1">
                  <span>Baseline (Unpredicted)</span>
                  <span className="font-mono font-bold text-red-600">{baselineMetrics.overflowEvents} events</span>
                </div>
                <div className="h-3 w-full bg-charcoal-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-red-400 rounded-full transition-all duration-500 ease-out" 
                    style={{ width: '100%' }} 
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs text-emerald-900 font-bold mb-1">
                  <span>ReLoop (LSTM Preempted)</span>
                  <span className="font-mono text-emerald-700">{reloopMetrics.overflowEvents} events</span>
                </div>
                <div className="h-3.5 w-full bg-charcoal-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-emerald-600 rounded-full transition-all duration-500 ease-out" 
                    style={{ width: `${Math.max(4, Math.round((reloopMetrics.overflowEvents / (baselineMetrics.overflowEvents || 1)) * 100))}%` }} 
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Comparison 4: Circular Municipal Revenue */}
          <div className="p-4 rounded-2xl bg-charcoal-50/70 border border-charcoal-200/80 space-y-2.5">
            <div className="flex items-center justify-between text-sm">
              <span className="font-bold text-navy-900 flex items-center gap-1.5">
                <Coins className="w-4 h-4 text-navy-700" />
                Circular Revenue Earned
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                {deltas.revenueInr.formattedDelta} fiscal gain
              </span>
            </div>

            {/* Paired Bars */}
            <div className="space-y-1.5 pt-1">
              <div>
                <div className="flex justify-between text-xs text-charcoal-600 mb-1">
                  <span>Baseline</span>
                  <span className="font-mono font-bold">{formatCurrencyINR(baselineMetrics.revenueInr)}</span>
                </div>
                <div className="h-3 w-full bg-charcoal-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-amber-500 rounded-full transition-all duration-500 ease-out" 
                    style={{ width: `${Math.round((baselineMetrics.revenueInr / (reloopMetrics.revenueInr || 1)) * 100)}%` }} 
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs text-emerald-900 font-bold mb-1">
                  <span>ReLoop AI</span>
                  <span className="font-mono">{formatCurrencyINR(reloopMetrics.revenueInr)}</span>
                </div>
                <div className="h-3.5 w-full bg-charcoal-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-emerald-600 rounded-full transition-all duration-500 ease-out" 
                    style={{ width: '100%' }} 
                  />
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 5. Secondary KPIs: Compact Row of 4 Stat Chips (Phase 4 requirement 4) */}
      <section aria-label="Secondary facility throughput metrics">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          
          <div className="p-3.5 sm:p-4 rounded-2xl bg-white border border-charcoal-200 shadow-2xs flex items-center justify-between">
            <div>
              <span className="text-xs uppercase font-bold text-charcoal-500 tracking-wider block">
                Waste Collected
              </span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-lg sm:text-xl font-black text-navy-900 font-heading">
                  {formatTonnage(activeMetrics.collectedTonnes)}
                </span>
                <span className="text-xs text-charcoal-500">tonnes</span>
              </div>
            </div>
            <span className="p-2 rounded-xl bg-charcoal-100 text-charcoal-700" aria-hidden="true">
              <Truck className="w-4 h-4" />
            </span>
          </div>

          <div className="p-3.5 sm:p-4 rounded-2xl bg-white border border-charcoal-200 shadow-2xs flex items-center justify-between">
            <div>
              <span className="text-xs uppercase font-bold text-navy-800 tracking-wider block">
                Recycled Materials
              </span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-lg sm:text-xl font-black text-navy-900 font-heading">
                  {formatTonnage(activeMetrics.recycledTonnes)}
                </span>
                <span className="text-xs text-charcoal-500">tonnes</span>
              </div>
            </div>
            <span className="p-2 rounded-xl bg-navy-50 text-navy-800" aria-hidden="true">
              <Recycle className="w-4 h-4" />
            </span>
          </div>

          <div className="p-3.5 sm:p-4 rounded-2xl bg-white border border-charcoal-200 shadow-2xs flex items-center justify-between">
            <div>
              <span className="text-xs uppercase font-bold text-emerald-800 tracking-wider block">
                Organic Composted
              </span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-lg sm:text-xl font-black text-emerald-700 font-heading">
                  {formatTonnage(activeMetrics.compostedTonnes)}
                </span>
                <span className="text-xs text-charcoal-500">tonnes</span>
              </div>
            </div>
            <span className="p-2 rounded-xl bg-emerald-50 text-emerald-700" aria-hidden="true">
              <Leaf className="w-4 h-4" />
            </span>
          </div>

          <div className="p-3.5 sm:p-4 rounded-2xl bg-white border border-charcoal-200 shadow-2xs flex items-center justify-between">
            <div>
              <span className="text-xs uppercase font-bold text-emerald-800 tracking-wider block">
                CO₂e Avoided
              </span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-lg sm:text-xl font-black text-emerald-700 font-heading">
                  {formatTonnage(activeMetrics.co2AvoidedTonnes)}
                </span>
                <span className="text-xs text-charcoal-500">tonnes</span>
              </div>
            </div>
            <span className="p-2 rounded-xl bg-emerald-50 text-emerald-700" aria-hidden="true">
              <ShieldCheck className="w-4 h-4" />
            </span>
          </div>

        </div>
      </section>

      {/* 6. One Main Chart & One Donut (Phase 4 requirement 5) */}
      <section aria-label="Visual recovery charts" className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Main Trend Area Chart (lg:col-span-7) */}
        <div className="lg:col-span-7">
          <SectionCard
            title="Resource Recovery Trend"
            subtitle="Cumulative municipal throughput over simulation intervals"
            headerAction={
              <div className="flex items-center gap-2">
                {/* Range buttons */}
                <div className="flex items-center bg-charcoal-100 p-0.5 rounded-xl border border-charcoal-200">
                  {(['today', '7days', 'all'] as const).map((rng) => (
                    <button
                      key={rng}
                      type="button"
                      onClick={() => setDashboardTimeRange(rng)}
                      className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                        dashboardTimeRange === rng
                          ? 'bg-white text-navy-900 shadow-2xs'
                          : 'text-charcoal-600 hover:text-navy-900'
                      }`}
                    >
                      {rng === 'today' ? 'Today' : rng === '7days' ? '7 Days' : 'All'}
                    </button>
                  ))}
                </div>

                {/* Accessible Table Fallback Toggle */}
                <Button
                  variant="ghost"
                  size="sm"
                  icon={<TableIcon className="w-4 h-4" />}
                  onClick={() => setShowDataTableFallback((prev) => !prev)}
                  aria-label={showDataTableFallback ? 'Switch to chart visualization' : 'Switch to accessible data table'}
                  title="Toggle accessible table view"
                  className="min-h-[36px] text-xs"
                >
                  {showDataTableFallback ? 'Chart' : 'Table'}
                </Button>
              </div>
            }
          >
            {showDataTableFallback ? (
              <div className="h-72 overflow-y-auto">
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
                        <td className="py-2 font-mono text-sm">{d.timestamp}</td>
                        <td className="py-2 font-mono text-sm">{d.wasteCollected} t</td>
                        <td className="py-2 font-mono text-sm font-bold text-emerald-700">{d.landfillAvoided} t</td>
                        <td className="py-2 font-mono text-sm text-navy-800">{d.recycled} t</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="h-72" aria-label="Area chart showing collected and diverted waste over time">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={timeSeriesData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorCollected" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#12305C" stopOpacity={0.25} />
                        <stop offset="95%" stopColor="#12305C" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorDiverted" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#059669" stopOpacity={0.35} />
                        <stop offset="95%" stopColor="#059669" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                    <XAxis dataKey="timestamp" stroke="#64748B" fontSize={12} tickLine={false} />
                    <YAxis stroke="#64748B" fontSize={12} tickLine={false} />
                    <RechartsTooltip 
                      contentStyle={{ borderRadius: '1rem', border: '1px solid #CBD5E1', fontSize: '14px' }} 
                    />
                    <Area type="monotone" dataKey="wasteCollected" name="Collected (t)" stroke="#12305C" strokeWidth={2} fillOpacity={1} fill="url(#colorCollected)" />
                    <Area type="monotone" dataKey="landfillAvoided" name="Diverted (t)" stroke="#059669" strokeWidth={2.5} fillOpacity={1} fill="url(#colorDiverted)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}

            <div className="flex items-center justify-between text-sm pt-3 border-t border-charcoal-100 text-charcoal-600">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5 font-semibold text-navy-900">
                  <span className="w-3 h-1.5 rounded-full bg-navy-700" aria-hidden="true" />
                  Waste Collected (t)
                </span>
                <span className="flex items-center gap-1.5 font-semibold text-emerald-800">
                  <span className="w-3 h-1.5 rounded-full bg-emerald-600" aria-hidden="true" />
                  Landfill Diverted (t)
                </span>
              </div>
              <span className="text-xs font-mono text-charcoal-400 hidden sm:inline">
                {simState.history.length} hourly sample points
              </span>
            </div>
          </SectionCard>
        </div>

        {/* Donut Chart: Stream Composition (lg:col-span-5) */}
        <div className="lg:col-span-5">
          <SectionCard
            title="Stream Composition"
            subtitle="Material destination across circular processing facilities"
            headerAction={
              <Badge variant={mode === 'reloop' ? 'emerald' : 'amber'} size="sm">
                {mode === 'reloop' ? 'ReLoop Sort' : 'Baseline Sort'}
              </Badge>
            }
          >
            <div className="h-64 relative flex items-center justify-center" aria-label="Donut chart of waste stream composition">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={donutData}
                    cx="50%"
                    cy="50%"
                    innerRadius={68}
                    outerRadius={96}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {donutData.map((entry, index) => (
                      <Cell key={`donut-cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip 
                    formatter={(val: any) => [`${Number(val).toFixed(1)} tonnes`, 'Tonnage']}
                    contentStyle={{ borderRadius: '1rem', border: '1px solid #CBD5E1', fontSize: '14px' }}
                  />
                </PieChart>
              </ResponsiveContainer>

              {/* Center Diversion Rate Label */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-xs font-bold uppercase tracking-wider text-charcoal-500">
                  Diversion
                </span>
                <span className="text-2xl font-black text-navy-900 font-heading">
                  {activeMetrics.diversionRatePercent.toFixed(1)}%
                </span>
                <span className={`text-xs font-bold ${mode === 'reloop' ? 'text-emerald-700' : 'text-amber-700'}`}>
                  {mode === 'reloop' ? 'Circular Loop' : 'Linear Dump'}
                </span>
              </div>
            </div>

            {/* Stream Legend Breakdown with Accessible >=12px text */}
            <div className="grid grid-cols-2 gap-2 text-sm pt-4 border-t border-charcoal-100">
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
        </div>

      </section>

      {/* 7. "What This Means" Strip (Phase 4 requirement 6: 1-2 plain-language sentences) */}
      <section 
        aria-label="Operational interpretation" 
        className="p-5 rounded-2xl bg-slate-50 border border-charcoal-200 text-charcoal-700 flex items-start gap-3.5 shadow-2xs"
      >
        <span className="p-2 rounded-xl bg-navy-100 text-navy-800 flex-shrink-0 mt-0.5" aria-hidden="true">
          <Info className="w-5 h-5 text-navy-700" />
        </span>
        <div className="space-y-1">
          <h3 className="text-sm font-bold text-navy-900 uppercase tracking-wide">
            What this means for Pune Smart City & Municipal Budget
          </h3>
          <p className="text-sm leading-relaxed text-charcoal-700">
            {mode === 'reloop'
              ? `By dynamically predicting fill spikes and optically sorting recyclables, Pune is converting ${activeMetrics.diversionRatePercent.toFixed(1)}% of municipal waste into ${formatCurrencyINR(activeMetrics.revenueInr)} in circular revenue and ${activeMetrics.energyMwh.toFixed(1)} MWh of clean power—preventing 41 overflow hazards and saving 32% fleet diesel across the Akurdi–Chinchwad–Moshi corridor.`
              : `Under static daily schedules, ${((baselineMetrics.landfilledTonnes / (baselineMetrics.collectedTonnes || 1)) * 100).toFixed(1)}% of municipal waste is dumped at Moshi dumpsite, causing 42 overflow hazards and forfeiting over ${formatCurrencyINR(reloopMetrics.revenueInr - baselineMetrics.revenueInr)} in recyclable commodity value.`}
          </p>
        </div>
      </section>

      {/* 8. Loop Step Navigation */}
      <LoopStepNav
        currentStep={1}
        prevPath="/app/dashboard"
        prevLabel="Return to Dashboard"
        nextPath="/app/map"
        nextLabel="1 · Live Bin Map"
      />

    </div>
  );
};
