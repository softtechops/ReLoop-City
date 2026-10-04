import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { 
  TrendingUp, 
  Leaf, 
  Zap, 
  Coins, 
  ShieldCheck, 
  AlertCircle, 
  HelpCircle, 
  ArrowUpRight, 
  ArrowDownRight,
  Sparkles,
  Layers,
  Recycle,
  Trash2,
  Calendar,
  Factory
} from 'lucide-react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip as RechartsTooltip, 
  Legend, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid 
} from 'recharts';

export const Dashboard: React.FC = () => {
  const { simState, mode, setMode, config } = useStore();
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);

  // Active data based on mode toggle (Baseline vs ReLoop)
  const currentMetrics = mode === 'reloop' ? simState.reloopCumulative : simState.baselineCumulative;
  const baselineMetrics = simState.baselineCumulative;
  const reloopMetrics = simState.reloopCumulative;

  // Percentage comparison deltas
  const deltaLandfillAvoided = Math.round(
    ((reloopMetrics.landfillAvoidedTonnes - baselineMetrics.landfillAvoidedTonnes) / baselineMetrics.landfillAvoidedTonnes) * 100
  );
  const deltaRevenue = Math.round(
    ((reloopMetrics.revenueGeneratedInr - baselineMetrics.revenueGeneratedInr) / baselineMetrics.revenueGeneratedInr) * 100
  );
  const deltaEnergy = Math.round(
    ((reloopMetrics.energyGeneratedMwh - baselineMetrics.energyGeneratedMwh) / baselineMetrics.energyGeneratedMwh) * 100
  );
  const deltaCo2 = Math.round(
    ((reloopMetrics.co2AvoidedTonnes - baselineMetrics.co2AvoidedTonnes) / baselineMetrics.co2AvoidedTonnes) * 100
  );
  const deltaRecycled = Math.round(
    ((reloopMetrics.recycledTonnes - baselineMetrics.recycledTonnes) / baselineMetrics.recycledTonnes) * 100
  );

  // Donut chart composition data
  const donutData = [
    { name: 'Recycled', value: currentMetrics.recycledTonnes, color: '#12305C' }, // Navy
    { name: 'Composted', value: currentMetrics.compostedTonnes, color: '#7BA17D' }, // Sage Green
    { name: 'Energy-Recovered', value: currentMetrics.energyRecoveredTonnes, color: '#D9A441' }, // Amber Gold
    { name: 'C&D Aggregates', value: currentMetrics.cdAggregateTonnes, color: '#4D84BE' }, // Blue
    { name: 'Landfilled (Residual)', value: currentMetrics.landfilledTonnes, color: '#8E9296' }, // Muted Gray
  ];

  // Time-series trend data from recent simulation history
  const timeSeriesData = simState.history.map((step) => {
    const dataForMode = mode === 'reloop' ? step.reloop : step.baseline;
    return {
      timestamp: step.timestamp,
      wasteCollected: dataForMode.collectedTonnes,
      landfillAvoided: dataForMode.landfillAvoidedTonnes,
      recycled: dataForMode.recycledTonnes,
      energyMwh: Number((dataForMode.energyGeneratedMwh * 10).toFixed(1)), // scaled for visual readability on dual axis
    };
  });

  return (
    <div className="space-y-6 pb-12">
      
      {/* Top Banner & Mode Toggle Indicator */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white border border-navy-100 shadow-blueprint">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-navy-800 font-['Outfit']">
              Waste-to-Value Municipal Dashboard
            </h1>
            <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
              mode === 'reloop' 
                ? 'bg-navy-700 text-white shadow-xs' 
                : 'bg-residual-500 text-white'
            }`}>
              {mode === 'reloop' ? 'ReLoop Active (AI Optimized)' : 'Baseline Active (Fixed Schedule)'}
            </span>
          </div>
          <p className="text-xs text-charcoal-500 mt-1">
            Real-time material mass balance, resource recovery, clean power generation, and fiscal return for Pune Pilot.
          </p>
        </div>

        {/* Mode Switch Reminder */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="text-xs text-charcoal-400 font-medium hidden lg:inline">Compare Strategy:</span>
          <div className="inline-flex p-1 rounded-xl bg-navy-50 border border-navy-100 text-xs font-semibold">
            <button
              onClick={() => setMode('baseline')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                mode === 'baseline'
                  ? 'bg-residual-500 text-white shadow-xs'
                  : 'text-charcoal-600 hover:text-navy-800'
              }`}
            >
              Baseline
            </button>
            <button
              onClick={() => setMode('reloop')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                mode === 'reloop'
                  ? 'bg-navy-700 text-white shadow-xs'
                  : 'text-charcoal-600 hover:text-navy-800'
              }`}
            >
              ReLoop AI
            </button>
          </div>
        </div>
      </div>

      {/* 6 Key KPI Cards + CO2 Avoided Card (Slide 8) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* KPI 1: Waste Collected */}
        <div className="relative p-5 rounded-2xl bg-white border border-navy-100 shadow-blueprint space-y-2 hover:border-navy-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-charcoal-400">Waste Collected</span>
            <div className="relative">
              <button 
                onMouseEnter={() => setActiveTooltip('kpi-collected')}
                onMouseLeave={() => setActiveTooltip(null)}
                className="text-charcoal-400 hover:text-navy-700"
              >
                <HelpCircle className="w-3.5 h-3.5" />
              </button>
              {activeTooltip === 'kpi-collected' && (
                <div className="absolute right-0 top-5 z-20 w-56 p-2 rounded-lg bg-navy-800 text-white text-[11px] shadow-lg leading-tight">
                  Total gross tonnage aggregated across 100 pilot smart bins in Pune.
                </div>
              )}
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-navy-800 font-['Outfit']">
              {currentMetrics.collectedTonnes.toFixed(1)}
            </span>
            <span className="text-xs font-semibold text-charcoal-500">tonnes/day</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-charcoal-500 pt-1 border-t border-navy-50">
            <span className="text-[11px] text-charcoal-400">Pilot sector daily throughput</span>
          </div>
        </div>

        {/* KPI 2: Recycled Tonnes */}
        <div className="relative p-5 rounded-2xl bg-white border border-navy-100 shadow-blueprint space-y-2 hover:border-navy-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-charcoal-400">Recycled</span>
            <div className="relative">
              <button 
                onMouseEnter={() => setActiveTooltip('kpi-recycled')}
                onMouseLeave={() => setActiveTooltip(null)}
                className="text-charcoal-400 hover:text-navy-700"
              >
                <HelpCircle className="w-3.5 h-3.5" />
              </button>
              {activeTooltip === 'kpi-recycled' && (
                <div className="absolute right-0 top-5 z-20 w-56 p-2 rounded-lg bg-navy-800 text-white text-[11px] shadow-lg leading-tight">
                  High-purity polymers, OCC paper, metals, and glass sorted at MRF lines.
                </div>
              )}
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-navy-700 font-['Outfit']">
              {currentMetrics.recycledTonnes.toFixed(1)}
            </span>
            <span className="text-xs font-semibold text-charcoal-500">tonnes</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs pt-1 border-t border-navy-50">
            {mode === 'reloop' ? (
              <span className="inline-flex items-center text-sage-600 font-bold text-[11px]">
                <ArrowUpRight className="w-3.5 h-3.5" />
                +{deltaRecycled}% vs Baseline purity
              </span>
            ) : (
              <span className="text-charcoal-400 text-[11px]">Lower purity due to mixed bag collection</span>
            )}
          </div>
        </div>

        {/* KPI 3: Composted Tonnes */}
        <div className="relative p-5 rounded-2xl bg-white border border-navy-100 shadow-blueprint space-y-2 hover:border-navy-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-charcoal-400">Composted</span>
            <div className="relative">
              <button 
                onMouseEnter={() => setActiveTooltip('kpi-compost')}
                onMouseLeave={() => setActiveTooltip(null)}
                className="text-charcoal-400 hover:text-navy-700"
              >
                <HelpCircle className="w-3.5 h-3.5" />
              </button>
              {activeTooltip === 'kpi-compost' && (
                <div className="absolute right-0 top-5 z-20 w-56 p-2 rounded-lg bg-navy-800 text-white text-[11px] shadow-lg leading-tight">
                  Organic wet waste converted into nutrient-rich city compost (yield: ~0.35 t / t wet).
                </div>
              )}
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-sage-600 font-['Outfit']">
              {currentMetrics.compostedTonnes.toFixed(1)}
            </span>
            <span className="text-xs font-semibold text-charcoal-500">tonnes</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-charcoal-500 pt-1 border-t border-navy-50">
            <Leaf className="w-3 h-3 text-sage-500" />
            <span className="text-[11px]">City compost for peri-urban agriculture</span>
          </div>
        </div>

        {/* KPI 4: Energy Generated */}
        <div className="relative p-5 rounded-2xl bg-white border border-navy-100 shadow-blueprint space-y-2 hover:border-navy-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-charcoal-400">Energy Generated</span>
            <div className="relative">
              <button 
                onMouseEnter={() => setActiveTooltip('kpi-energy')}
                onMouseLeave={() => setActiveTooltip(null)}
                className="text-charcoal-400 hover:text-navy-700"
              >
                <HelpCircle className="w-3.5 h-3.5" />
              </button>
              {activeTooltip === 'kpi-energy' && (
                <div className="absolute right-0 top-5 z-20 w-56 p-2 rounded-lg bg-navy-800 text-white text-[11px] shadow-lg leading-tight">
                  Electricity generated via anaerobic digestion CHP engines (110 m³/t biogas, 2.1 kWh/m³).
                </div>
              )}
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-amberGold-600 font-['Outfit']">
              {currentMetrics.energyGeneratedMwh.toFixed(1)}
            </span>
            <span className="text-xs font-semibold text-charcoal-500">MWh</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs pt-1 border-t border-navy-50">
            {mode === 'reloop' ? (
              <span className="inline-flex items-center text-amberGold-600 font-bold text-[11px]">
                <ArrowUpRight className="w-3.5 h-3.5" />
                +{deltaEnergy}% clean power surplus
              </span>
            ) : (
              <span className="text-charcoal-400 text-[11px]">Limited biogas capture</span>
            )}
          </div>
        </div>

        {/* KPI 5: Landfill Avoided */}
        <div className="relative p-5 rounded-2xl bg-white border border-navy-100 shadow-blueprint space-y-2 hover:border-navy-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-charcoal-400">Landfill Avoided</span>
            <div className="relative">
              <button 
                onMouseEnter={() => setActiveTooltip('kpi-landfill')}
                onMouseLeave={() => setActiveTooltip(null)}
                className="text-charcoal-400 hover:text-navy-700"
              >
                <HelpCircle className="w-3.5 h-3.5" />
              </button>
              {activeTooltip === 'kpi-landfill' && (
                <div className="absolute right-0 top-5 z-20 w-56 p-2 rounded-lg bg-navy-800 text-white text-[11px] shadow-lg leading-tight">
                  Tonnage diverted from municipal dumpsites through recycling, bio-methane & RDF.
                </div>
              )}
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-sage-600 font-['Outfit']">
              {currentMetrics.landfillAvoidedTonnes.toFixed(1)}
            </span>
            <span className="text-xs font-semibold text-charcoal-500">tonnes</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs pt-1 border-t border-navy-50">
            {mode === 'reloop' ? (
              <span className="inline-flex items-center text-sage-600 font-bold text-[11px]">
                <ArrowUpRight className="w-3.5 h-3.5" />
                95.2% diversion (vs 61% baseline)
              </span>
            ) : (
              <span className="text-red-500 text-[11px] font-semibold">38.8% dumped in landfill</span>
            )}
          </div>
        </div>

        {/* KPI 6: Revenue Generated */}
        <div className="relative p-5 rounded-2xl bg-white border border-navy-100 shadow-blueprint space-y-2 hover:border-navy-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-charcoal-400">Revenue Generated</span>
            <div className="relative">
              <button 
                onMouseEnter={() => setActiveTooltip('kpi-revenue')}
                onMouseLeave={() => setActiveTooltip(null)}
                className="text-charcoal-400 hover:text-navy-700"
              >
                <HelpCircle className="w-3.5 h-3.5" />
              </button>
              {activeTooltip === 'kpi-revenue' && (
                <div className="absolute right-0 top-5 z-20 w-56 p-2 rounded-lg bg-navy-800 text-white text-[11px] shadow-lg leading-tight">
                  Commercial sales of clean recyclates, compost, electricity tariffs, and EPR credits.
                </div>
              )}
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-navy-800 font-['Outfit']">
              ₹{(currentMetrics.revenueGeneratedInr / 100000).toFixed(2)}
            </span>
            <span className="text-xs font-semibold text-charcoal-500">Lakh</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs pt-1 border-t border-navy-50">
            {mode === 'reloop' ? (
              <span className="inline-flex items-center text-navy-700 font-bold text-[11px]">
                <ArrowUpRight className="w-3.5 h-3.5" />
                +{deltaRevenue}% revenue gain
              </span>
            ) : (
              <span className="text-charcoal-400 text-[11px]">Sub-optimal recyclate value</span>
            )}
          </div>
        </div>

        {/* KPI 7: CO2 Emissions Avoided */}
        <div className="relative p-5 rounded-2xl bg-gradient-to-br from-sage-50 to-white border border-sage-200 shadow-blueprint space-y-2 hover:border-sage-400 transition-all sm:col-span-2 lg:col-span-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-sage-500"></span>
              <span className="text-xs font-bold uppercase tracking-wider text-sage-900">
                Climate Impact: CO₂e Avoided
              </span>
            </div>
            <div className="relative">
              <button 
                onMouseEnter={() => setActiveTooltip('kpi-co2')}
                onMouseLeave={() => setActiveTooltip(null)}
                className="text-charcoal-400 hover:text-navy-700"
              >
                <HelpCircle className="w-3.5 h-3.5" />
              </button>
              {activeTooltip === 'kpi-co2' && (
                <div className="absolute right-0 top-5 z-20 w-64 p-2.5 rounded-lg bg-navy-800 text-white text-[11px] shadow-lg leading-tight">
                  Avoided greenhouse gas emissions from: prevented landfill anaerobic methane + virgin material manufacturing offset + coal grid power replacement.
                </div>
              )}
            </div>
          </div>
          
          <div className="flex items-baseline justify-between pt-1">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-extrabold text-sage-700 font-['Outfit']">
                {currentMetrics.co2AvoidedTonnes.toFixed(1)}
              </span>
              <span className="text-sm font-semibold text-charcoal-600">tonnes CO₂e</span>
            </div>
            {mode === 'reloop' && (
              <span className="px-2.5 py-1 rounded-full bg-sage-100 text-sage-800 text-xs font-bold flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-sage-600" />
                +{deltaCo2}% vs Baseline
              </span>
            )}
          </div>

          <div className="pt-2 border-t border-sage-100 flex items-center justify-between text-xs text-charcoal-500">
            <span>Equivalent to planting <strong>{Math.round(currentMetrics.co2AvoidedTonnes * 45)}</strong> mature trees</span>
            <span className="font-mono text-sage-700 font-semibold">Net Carbon Negative</span>
          </div>
        </div>

      </div>

      {/* Main Visuals: Donut Chart + Time-Series Trend */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Stream Composition Donut Chart (Slide 8) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-navy-100 shadow-blueprint p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-base text-navy-800 font-['Outfit']">
                Waste Stream Composition
              </h3>
              <p className="text-xs text-charcoal-400">Material distribution by circular processing line</p>
            </div>
            <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-navy-50 text-navy-700">
              {mode === 'reloop' ? 'ReLoop Sort' : 'Baseline Sort'}
            </span>
          </div>

          <div className="h-64 relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={donutData}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={95}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {donutData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <RechartsTooltip 
                  formatter={(val: any) => [`${Number(val).toFixed(1)} tonnes`, 'Tonnage']}
                  contentStyle={{ borderRadius: '0.75rem', border: '1px solid #D9E4F2', fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
            
            {/* Center Summary Text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-[11px] font-bold uppercase tracking-wider text-charcoal-400">
                Diversion
              </span>
              <span className="text-2xl font-black text-navy-800 font-['Outfit']">
                {currentMetrics.landfillDiversionRatePercent.toFixed(1)}%
              </span>
              <span className="text-[10px] text-sage-600 font-semibold">
                {mode === 'reloop' ? 'Near Zero Landfill' : 'High Waste'}
              </span>
            </div>
          </div>

          {/* Stream Legend Breakdown */}
          <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-navy-50">
            {donutData.map((item) => (
              <div key={item.name} className="flex items-center gap-2 p-1.5 rounded-lg bg-navy-50/50">
                <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }}></span>
                <div className="truncate">
                  <span className="font-semibold text-charcoal-700 block truncate">{item.name}</span>
                  <span className="text-[11px] text-charcoal-400 font-mono">{item.value.toFixed(1)} t</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Time-Series Trend Line/Area Chart */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-navy-100 shadow-blueprint p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="font-bold text-base text-navy-800 font-['Outfit']">
                Real-Time Resource Recovery Trend
              </h3>
              <p className="text-xs text-charcoal-400">Cumulative throughput over recent simulation intervals</p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5 text-navy-700 font-semibold">
                <span className="w-3 h-1.5 rounded bg-navy-700"></span> Collected
              </span>
              <span className="flex items-center gap-1.5 text-sage-600 font-semibold">
                <span className="w-3 h-1.5 rounded bg-sage-500"></span> Diverted
              </span>
              <span className="flex items-center gap-1.5 text-amberGold-600 font-semibold">
                <span className="w-3 h-1.5 rounded bg-amberGold-500"></span> Power (x10)
              </span>
            </div>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={timeSeriesData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCollected" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#12305C" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="#12305C" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorDiverted" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7BA17D" stopOpacity={0.35}/>
                    <stop offset="95%" stopColor="#7BA17D" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F0F4FA" />
                <XAxis dataKey="timestamp" stroke="#757E81" fontSize={11} tickLine={false} />
                <YAxis stroke="#757E81" fontSize={11} tickLine={false} />
                <RechartsTooltip contentStyle={{ borderRadius: '0.75rem', border: '1px solid #D9E4F2', fontSize: '12px' }} />
                <Area type="monotone" dataKey="wasteCollected" name="Collected (t)" stroke="#12305C" strokeWidth={2} fillOpacity={1} fill="url(#colorCollected)" />
                <Area type="monotone" dataKey="landfillAvoided" name="Diverted (t)" stroke="#7BA17D" strokeWidth={2.5} fillOpacity={1} fill="url(#colorDiverted)" />
                <Area type="monotone" dataKey="energyMwh" name="Energy MWh (scaled)" stroke="#D9A441" strokeWidth={2} fillOpacity={0} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Quick Stats Footer */}
          <div className="grid grid-cols-3 gap-3 pt-3 border-t border-navy-50 text-center">
            <div className="p-2 rounded-xl bg-navy-50/50">
              <span className="text-[10px] text-charcoal-400 uppercase font-semibold">Overflow Incidents</span>
              <span className={`block font-bold text-sm ${currentMetrics.overflowEventsCount > 5 ? 'text-red-600' : 'text-sage-700'}`}>
                {currentMetrics.overflowEventsCount} events
              </span>
            </div>
            <div className="p-2 rounded-xl bg-navy-50/50">
              <span className="text-[10px] text-charcoal-400 uppercase font-semibold">Biogas Captured</span>
              <span className="block font-bold text-sm text-navy-800">
                {currentMetrics.biogasProducedM3.toLocaleString()} m³
              </span>
            </div>
            <div className="p-2 rounded-xl bg-navy-50/50">
              <span className="text-[10px] text-charcoal-400 uppercase font-semibold">Tipping Cost Avoided</span>
              <span className="block font-bold text-sm text-sage-700">
                ₹{Math.round((currentMetrics.landfillAvoidedTonnes * config.landfillTippingCostInrPerTonne)).toLocaleString()}
              </span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
