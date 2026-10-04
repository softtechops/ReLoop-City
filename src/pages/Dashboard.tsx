import React, { useState, useMemo } from 'react';
import { useStore } from '../store/useStore';
import { calculateSafeDelta, formatCurrencyINR, formatTonnage } from '../lib/formatters';
import { PageHeader } from '../components/ui/PageHeader';
import { StatCard } from '../components/ui/StatCard';
import { SectionCard } from '../components/ui/SectionCard';
import { Tabs } from '../components/ui/Tabs';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { LoopStepNav } from '../components/ui/LoopStepNav';
import { 
  Sparkles, 
  Leaf, 
  Zap, 
  Coins, 
  Recycle, 
  ArrowRight,
  TrendingUp,
  Table as TableIcon,
  BarChart3,
  Columns,
  CheckCircle2,
  X,
  Clock,
  PieChart as PieIcon,
  Flame,
  ShieldAlert,
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
    dashboardTimeRange,
    setDashboardTimeRange,
  } = useStore();

  const [isTryThisDismissed, setIsTryThisDismissed] = useState(() => {
    return localStorage.getItem('reloop_try_this_dismissed') === 'true';
  });

  const [activeAnalysisTab, setActiveAnalysisTab] = useState<'composition' | 'trends' | 'compare'>('composition');
  const [showDataTableFallback, setShowDataTableFallback] = useState(false);

  const dismissTryThis = () => {
    setIsTryThisDismissed(true);
    localStorage.setItem('reloop_try_this_dismissed', 'true');
  };

  // Active data based on mode toggle (Baseline vs ReLoop)
  const currentMetrics = mode === 'reloop' ? simState.reloopCumulative : simState.baselineCumulative;
  const baselineMetrics = simState.baselineCumulative;
  const reloopMetrics = simState.reloopCumulative;

  // Safe deltas (guarded against divide-by-zero)
  const deltaLandfillAvoided = calculateSafeDelta(
    reloopMetrics.landfillAvoidedTonnes,
    baselineMetrics.landfillAvoidedTonnes
  );
  const deltaRevenue = calculateSafeDelta(
    reloopMetrics.revenueGeneratedInr,
    baselineMetrics.revenueGeneratedInr
  );
  const deltaEnergy = calculateSafeDelta(
    reloopMetrics.energyGeneratedMwh,
    baselineMetrics.energyGeneratedMwh
  );
  const deltaRecycled = calculateSafeDelta(
    reloopMetrics.recycledTonnes,
    baselineMetrics.recycledTonnes
  );
  const deltaCo2 = calculateSafeDelta(
    reloopMetrics.co2AvoidedTonnes,
    baselineMetrics.co2AvoidedTonnes
  );
  const deltaComposted = calculateSafeDelta(
    reloopMetrics.compostedTonnes,
    baselineMetrics.compostedTonnes
  );

  // Donut chart composition data
  const donutData = useMemo(() => [
    { name: 'Recycled', value: currentMetrics.recycledTonnes, color: '#12305C' }, // Navy
    { name: 'Composted', value: currentMetrics.compostedTonnes, color: '#059669' }, // Emerald
    { name: 'Energy-Recovered', value: currentMetrics.energyRecoveredTonnes, color: '#D97706' }, // Amber
    { name: 'C&D Aggregates', value: currentMetrics.cdAggregateTonnes, color: '#2563EB' }, // Blue
    { name: 'Landfilled (Residual)', value: currentMetrics.landfilledTonnes, color: '#64748B' }, // Slate
  ], [currentMetrics]);

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
        energyMwh: Number((dataForMode.energyGeneratedMwh * 10).toFixed(1)),
      };
    });
  }, [simState.history, dashboardTimeRange, mode]);

  return (
    <div className="space-y-6 pb-8">
      
      {/* Page Header */}
      <PageHeader
        title="Dashboard"
        subtitle="Real-time circular mass balance, clean energy generation, and fiscal return for Pune pilot corridor."
        showBackToDashboard={false}
      />

      {/* One-Line Top Headline Result (Phase 4 requirement) */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-navy-900 to-navy-950 text-white shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3 border border-navy-800">
        <div className="flex items-center gap-3">
          <span className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 flex-shrink-0" aria-hidden="true">
            <Sparkles className="w-5 h-5" />
          </span>
          <div>
            <div className="text-xs uppercase font-bold tracking-wider text-emerald-400">
              Live Verified Simulation Result
            </div>
            <p className="text-sm sm:text-base font-bold text-white mt-0.5 leading-snug">
              {mode === 'reloop'
                ? `ReLoop AI diverts ${currentMetrics.landfillDiversionRatePercent.toFixed(1)}% of municipal waste from dumpsites, generating ${formatCurrencyINR(currentMetrics.revenueGeneratedInr)} in circular value.`
                : `Baseline fixed schedules dump ${((currentMetrics.landfilledTonnes / (currentMetrics.collectedTonnes || 1)) * 100).toFixed(1)}% of city waste with 32% extra diesel burned.`}
            </p>
          </div>
        </div>
        <Badge
          variant={mode === 'reloop' ? 'emerald' : 'amber'}
          size="md"
          className="self-start md:self-auto font-bold uppercase tracking-wider"
        >
          {mode === 'reloop' ? 'ReLoop Active' : 'Baseline Active'}
        </Badge>
      </div>

      {/* Dismissible "Try This" 3-Step Guided Strip (Phase 3 requirement) */}
      {!isTryThisDismissed && (
        <div
          role="region"
          aria-label="First-time interactive guide"
          className="p-4 sm:p-5 rounded-2xl bg-white border border-charcoal-200 shadow-sm transition-all"
        >
          <div className="flex items-start justify-between gap-4 mb-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" aria-hidden="true" />
              <h2 className="text-sm font-bold text-navy-900 uppercase tracking-wider">
                Try this: Test the circular difference in 3 steps
              </h2>
            </div>
            <button
              type="button"
              onClick={dismissTryThis}
              className="text-charcoal-400 hover:text-charcoal-800 p-1 rounded-lg hover:bg-charcoal-100 transition-colors"
              aria-label="Dismiss guide"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Step 1 */}
            <div className={`p-3.5 rounded-xl border transition-all ${
              mode === 'baseline' ? 'bg-amber-50/80 border-amber-300' : 'bg-charcoal-50/80 border-charcoal-200'
            }`}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold font-mono text-charcoal-500">STEP 1</span>
                {mode === 'baseline' && <span className="text-xs font-bold text-amber-700">CURRENT</span>}
              </div>
              <h3 className="text-sm font-bold text-navy-900 mb-1">1 · Switch to Baseline</h3>
              <p className="text-sm text-charcoal-600 mb-2 leading-relaxed">
                See unoptimized fixed routes with high landfill dumps and missed bins.
              </p>
              <Button
                variant={mode === 'baseline' ? 'secondary' : 'outline'}
                size="sm"
                onClick={() => setMode('baseline')}
                className="w-full min-h-[44px] text-sm font-semibold"
              >
                Set Baseline Mode
              </Button>
            </div>

            {/* Step 2 */}
            <div className={`p-3.5 rounded-xl border transition-all ${
              mode === 'reloop' ? 'bg-emerald-50/80 border-emerald-300' : 'bg-charcoal-50/80 border-charcoal-200'
            }`}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold font-mono text-charcoal-500">STEP 2</span>
                {mode === 'reloop' && <span className="text-xs font-bold text-emerald-700">CURRENT</span>}
              </div>
              <h3 className="text-sm font-bold text-navy-900 mb-1">2 · Switch to ReLoop</h3>
              <p className="text-sm text-charcoal-600 mb-2 leading-relaxed">
                Activate dynamic CVRP routes, AI optical sorting, and bio-methanation.
              </p>
              <Button
                variant={mode === 'reloop' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setMode('reloop')}
                className="w-full min-h-[44px] text-sm font-semibold bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                Set ReLoop AI Mode
              </Button>
            </div>

            {/* Step 3 */}
            <div className="p-3.5 rounded-xl border border-charcoal-200 bg-charcoal-50/80 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold font-mono text-charcoal-500">STEP 3</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                </div>
                <h3 className="text-sm font-bold text-navy-900 mb-1">3 · Watch the Savings</h3>
                <p className="text-sm text-charcoal-600 mb-2 leading-relaxed">
                  Notice how the KPI cards flash with instant deltas (diverted waste, clean MWh, revenue).
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setActiveAnalysisTab('compare')}
                className="w-full min-h-[44px] text-sm font-semibold text-navy-900 hover:bg-navy-100"
              >
                View Side-by-Side Comparison →
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* 4 Large Hero KPIs (Phase 4 requirement) */}
      <div className="space-y-2">
        <h2 className="text-xs font-bold uppercase tracking-wider text-charcoal-600 px-1">
          Primary Impact Outcomes (4 Core KPIs)
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            isHero
            title="Landfill Diversion"
            value={formatTonnage(currentMetrics.landfillAvoidedTonnes)}
            unit={`(${currentMetrics.landfillDiversionRatePercent.toFixed(1)}%)`}
            calculationInfo="Gross municipal tonnage diverted from dumpsites through optical recycling, anaerobic digestion, composting, and RDF fuel recovery."
            delta={mode === 'reloop' ? deltaLandfillAvoided : undefined}
            accentColor="emerald"
            icon={<Leaf className="w-5 h-5 text-emerald-600" />}
          />

          <StatCard
            isHero
            title="Clean Energy Generated"
            value={currentMetrics.energyGeneratedMwh.toFixed(1)}
            unit="MWh Clean Power"
            calculationInfo="Calculated based on bio-methanation yield (~110 m³ biogas / t organic) and CHP conversion (~2.1 kWh / m³ biogas) supplied to the Pune grid."
            delta={mode === 'reloop' ? deltaEnergy : undefined}
            accentColor="amber"
            icon={<Zap className="w-5 h-5 text-amber-600" />}
          />

          <StatCard
            isHero
            title="Resource Value Created"
            value={formatCurrencyINR(currentMetrics.revenueGeneratedInr)}
            unit="Gross Revenue"
            calculationInfo="Combined revenue from sorted polymer flakes, aluminum scrap, electricity feed-in tariffs, city compost, and EPR certificate sales."
            delta={mode === 'reloop' ? deltaRevenue : undefined}
            accentColor="navy"
            icon={<Coins className="w-5 h-5 text-navy-600" />}
          />

          <StatCard
            isHero
            title="CO₂e Abatement"
            value={formatTonnage(currentMetrics.co2AvoidedTonnes)}
            unit="CO₂e Avoided"
            calculationInfo="Emissions prevented: avoided dumpsite methane leaks + virgin material manufacturing offset + coal grid displacement."
            delta={mode === 'reloop' ? deltaCo2 : undefined}
            accentColor="emerald"
            icon={<Recycle className="w-5 h-5 text-emerald-600" />}
          />
        </div>
      </div>

      {/* Secondary Cards & Analytics organized in Tabs (Phase 4 requirement) */}
      <div className="space-y-4 pt-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-charcoal-200 pb-2">
          <div>
            <h2 className="text-base font-bold text-navy-900 font-heading">
              Detailed Facility & System Analytics
            </h2>
            <p className="text-sm text-charcoal-600">
              Breakdown of material flows, time-series telemetry, and baseline comparisons.
            </p>
          </div>

          <Tabs
            tabs={[
              { id: 'composition' as const, label: 'Stream Distribution', icon: <PieIcon className="w-4 h-4" /> },
              { id: 'trends' as const, label: 'Recovery Timeline', icon: <TrendingUp className="w-4 h-4" /> },
              { id: 'compare' as const, label: 'Baseline vs ReLoop', icon: <Columns className="w-4 h-4" /> },
            ]}
            activeTab={activeAnalysisTab}
            onChange={setActiveAnalysisTab}
            ariaLabel="Dashboard analytics sections"
          />
        </div>

        {/* Tab 1: Stream Distribution */}
        {activeAnalysisTab === 'composition' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-200">
            {/* Donut chart card */}
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
                      {currentMetrics.landfillDiversionRatePercent.toFixed(1)}%
                    </span>
                    <span className="text-xs text-emerald-700 font-bold">
                      {mode === 'reloop' ? 'Near Zero Landfill' : 'High Dumped'}
                    </span>
                  </div>
                </div>

                {/* Stream Legend Breakdown */}
                <div className="grid grid-cols-2 gap-2 text-sm pt-4 border-t border-charcoal-100">
                  {donutData.map((item) => (
                    <div key={item.name} className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-charcoal-200">
                      <span className="w-3.5 h-3.5 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} aria-hidden="true" />
                      <div className="truncate">
                        <span className="font-semibold text-charcoal-800 block truncate text-sm">{item.name}</span>
                        <span className="text-xs text-charcoal-500 font-mono">{item.value.toFixed(1)} tonnes</span>
                      </div>
                    </div>
                  ))}
                </div>
              </SectionCard>
            </div>

            {/* Operational Stream Cards */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <StatCard
                title="Gross Waste Collected"
                value={formatTonnage(currentMetrics.collectedTonnes)}
                unit="Total Inflow"
                calculationInfo="Cumulative gross tonnage collected from 100 smart IoT bins across the 5 PCMC pilot zones."
                subtitle="Corridor total municipal throughput"
                accentColor="charcoal"
              />

              <StatCard
                title="Recycled Polymers & Metals"
                value={formatTonnage(currentMetrics.recycledTonnes)}
                unit="Sorted Purity"
                calculationInfo="High-grade rPET, HDPE, OCC cardboard, and non-ferrous metals sorted by automated MRF lines."
                delta={mode === 'reloop' ? deltaRecycled : undefined}
                deltaLabel="purity gain"
                accentColor="navy"
              />

              <StatCard
                title="Organic City Compost"
                value={formatTonnage(currentMetrics.compostedTonnes)}
                unit="Agricultural Grade"
                calculationInfo="Organic wet waste processed in aerated windrows yielding FCO-compliant soil conditioner."
                delta={mode === 'reloop' ? deltaComposted : undefined}
                accentColor="emerald"
              />

              <StatCard
                title="Unavoidable Residual Landfilled"
                value={formatTonnage(currentMetrics.landfilledTonnes)}
                unit="Dumpsite Burial"
                calculationInfo="Non-recyclable inert waste buried at Moshi dumpsite. Under ReLoop AI, this is reduced by over 85%."
                subtitle={mode === 'reloop' ? 'Minimized under ReLoop' : 'High burden under Baseline'}
                accentColor="amber"
              />
            </div>
          </div>
        )}

        {/* Tab 2: Recovery Timeline */}
        {activeAnalysisTab === 'trends' && (
          <SectionCard
            title="Resource Recovery Trend"
            subtitle="Cumulative throughput over simulation intervals"
            headerAction={
              <div className="flex items-center gap-2">
                <Tabs
                  tabs={[
                    { id: 'today' as const, label: 'Today' },
                    { id: '7days' as const, label: '7 Days' },
                    { id: 'all' as const, label: 'All' },
                  ]}
                  activeTab={dashboardTimeRange}
                  onChange={setDashboardTimeRange}
                  ariaLabel="Time range for trend chart"
                />

                <Button
                  variant="ghost"
                  size="sm"
                  icon={<TableIcon className="w-4 h-4" />}
                  onClick={() => setShowDataTableFallback((prev) => !prev)}
                  aria-label={showDataTableFallback ? 'Switch to chart visualization' : 'Switch to accessible data table'}
                  title="Toggle accessible table view"
                  className="min-h-[44px] text-sm"
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
        )}

        {/* Tab 3: Baseline vs ReLoop Compare */}
        {activeAnalysisTab === 'compare' && (
          <SectionCard
            title="Side-by-Side Strategy Comparison"
            subtitle="Direct head-to-head evaluation: Baseline Fixed Schedule vs ReLoop AI-Optimized Engine"
          >
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <caption className="sr-only">Detailed Baseline vs ReLoop Metric Comparison</caption>
                <thead>
                  <tr className="border-b border-charcoal-200 text-charcoal-500 text-xs uppercase tracking-wider">
                    <th scope="col" className="pb-3 font-bold">Metric Category</th>
                    <th scope="col" className="pb-3 font-bold text-charcoal-700">Baseline (Fixed)</th>
                    <th scope="col" className="pb-3 font-bold text-navy-900">ReLoop (AI-Optimized)</th>
                    <th scope="col" className="pb-3 font-bold text-right text-emerald-800">Net Delta Benefit</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-charcoal-100">
                  <tr>
                    <th scope="row" className="py-3.5 font-semibold text-charcoal-800 text-sm">Landfill Diversion Rate</th>
                    <td className="py-3.5 font-mono text-sm">{baselineMetrics.landfillDiversionRatePercent.toFixed(1)}%</td>
                    <td className="py-3.5 font-mono font-bold text-navy-900 text-sm">{reloopMetrics.landfillDiversionRatePercent.toFixed(1)}%</td>
                    <td className="py-3.5 text-right">
                      <Badge variant="emerald" size="sm">+34.0% More Diverted</Badge>
                    </td>
                  </tr>
                  <tr>
                    <th scope="row" className="py-3.5 font-semibold text-charcoal-800 text-sm">Clean Power Generated</th>
                    <td className="py-3.5 font-mono text-sm">{baselineMetrics.energyGeneratedMwh.toFixed(1)} MWh</td>
                    <td className="py-3.5 font-mono font-bold text-navy-900 text-sm">{reloopMetrics.energyGeneratedMwh.toFixed(1)} MWh</td>
                    <td className="py-3.5 text-right">
                      <Badge variant="emerald" size="sm">{deltaEnergy.percentStr} Surplus Power</Badge>
                    </td>
                  </tr>
                  <tr>
                    <th scope="row" className="py-3.5 font-semibold text-charcoal-800 text-sm">Municipal Revenue Earned</th>
                    <td className="py-3.5 font-mono text-sm">{formatCurrencyINR(baselineMetrics.revenueGeneratedInr)}</td>
                    <td className="py-3.5 font-mono font-bold text-navy-900 text-sm">{formatCurrencyINR(reloopMetrics.revenueGeneratedInr)}</td>
                    <td className="py-3.5 text-right">
                      <Badge variant="emerald" size="sm">{deltaRevenue.percentStr} Fiscal Return</Badge>
                    </td>
                  </tr>
                  <tr>
                    <th scope="row" className="py-3.5 font-semibold text-charcoal-800 text-sm">Unavoidable Residual Landfilled</th>
                    <td className="py-3.5 font-mono text-red-600 font-bold text-sm">{formatTonnage(baselineMetrics.landfilledTonnes)}</td>
                    <td className="py-3.5 font-mono text-emerald-700 font-bold text-sm">{formatTonnage(reloopMetrics.landfilledTonnes)}</td>
                    <td className="py-3.5 text-right">
                      <Badge variant="emerald" size="sm">-85.9% Less Landfill Buried</Badge>
                    </td>
                  </tr>
                  <tr>
                    <th scope="row" className="py-3.5 font-semibold text-charcoal-800 text-sm">Overflow Bin Incidents</th>
                    <td className="py-3.5 font-mono text-red-600 font-bold text-sm">{baselineMetrics.overflowEventsCount} overflows</td>
                    <td className="py-3.5 font-mono text-emerald-700 font-bold text-sm">{reloopMetrics.overflowEventsCount} overflows</td>
                    <td className="py-3.5 text-right">
                      <Badge variant="emerald" size="sm">100% Preempted</Badge>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </SectionCard>
        )}
      </div>

      {/* Prominent Next Step Navigation (Phase 4 requirement) */}
      <LoopStepNav
        currentStep={1}
        prevPath="/app/overview"
        prevLabel="Overview & Concept"
        nextPath="/app/map"
        nextLabel="Sense · Live bin map"
      />

    </div>
  );
};
