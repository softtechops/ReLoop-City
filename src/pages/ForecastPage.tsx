import React from 'react';
import { useStore } from '../store/useStore';
import { PageHeader } from '../components/ui/PageHeader';
import { LoopStepNav } from '../components/ui/LoopStepNav';
import { SectionCard } from '../components/ui/SectionCard';
import { StatCard } from '../components/ui/StatCard';
import { Badge } from '../components/ui/Badge';
import { 
  Zap, 
  Flame, 
  Leaf, 
  Coins, 
  TrendingUp,
  Cpu,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { formatCurrencyINR } from '../lib/formatters';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer
} from 'recharts';
import { useChartTheme } from '../lib/chartTheme';

export const ForecastPage: React.FC = () => {
  const { simState, config, mode, energyOfftakeCommitment, setEnergyOfftakeCommitment } = useStore();
  const chartTheme = useChartTheme();

  const currentMetrics = mode === 'reloop' ? simState.reloopCumulative : simState.baselineCumulative;
  const homesPowered = Math.round((currentMetrics.energyGeneratedMwh * 1000) / 90); // 90 kWh/month/home
  const cngCylinderEquivalent = Math.round(currentMetrics.biogasProducedM3 * 0.45);
  const headlineSaving = `${currentMetrics.energyGeneratedMwh.toFixed(1)} MWh clean energy generated, powering ~${homesPowered} Pune homes`;

  // Energy generation time series
  const energyTimeSeries = simState.history.slice(-12).map((step) => {
    const data = mode === 'reloop' ? step.reloop : step.baseline;
    return {
      timestamp: step.timestamp,
      mwh: Number(data.energyGeneratedMwh.toFixed(2)),
      biogasM3: Math.round(data.biogasProducedM3),
    };
  });

  return (
    <div className="space-y-6 pb-16">
      
      {/* Page Header */}
      <PageHeader
        title="Forecast · Clean energy"
        subtitle="Forecasting anaerobic digestion bio-methane conversion and combined heat-and-power (CHP) grid electricity."
        decisionPrompt="How much energy and biogas can we plan on?"
        stepNumber={6}
        totalSteps={7}
        stepName="Forecast"
        howItWorks={
          <div className="space-y-2">
            <p>
              ReLoop correlates classified organic waste tonnages with mesophilic thermophilic digestion rates ({config.biogasYieldPerTonneOrganic} m³/tonne).
            </p>
            <p>
              The captured bio-methane (62% CH₄) feeds a CHP generator at {config.kwhPerCubicMeterBiogas} kWh/m³, delivering renewable power into the local MSEDCL grid at ₹{config.electricityTariffInrPerKwh}/kWh feed-in tariff.
            </p>
          </div>
        }
      />

      {/* Manager Decision: Energy Off-Take Commitment */}
      <div className="p-4 sm:p-5 rounded-2xl bg-surface border border-line shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-fg-subtle block">
              Municipal Energy Off-take Policy
            </span>
            <p className="text-sm font-bold text-fg">
              Commit generated renewable electricity and biomethane to a municipal off-taker:
            </p>
          </div>
          <span className="text-xs font-mono text-fg-muted">
            Committed to: <strong className="text-fg">{energyOfftakeCommitment === 'grid' ? 'MSEDCL Grid Feed-in' : 'PMPML Bus Charging'}</strong>
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            {
              id: 'grid' as const,
              title: 'MSEDCL Municipal Grid Feed-in',
              rate: `₹${config.electricityTariffInrPerKwh.toFixed(2)}/kWh tariff`,
              desc: 'Feeds clean energy directly into the Pune state utility grid for guaranteed baseline cashflow.',
            },
            {
              id: 'bus_depot' as const,
              title: 'PMPML EV Transit Bus Depot',
              rate: '₹7.20/kWh equivalent saving',
              desc: 'Displaces municipal diesel bus costs by charging electric public transit buses overnight at Nigdi depot.',
            },
          ].map((opt) => {
            const isSelected = energyOfftakeCommitment === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => setEnergyOfftakeCommitment(opt.id)}
                className={`p-3.5 rounded-xl border text-left transition-all min-h-[44px] cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm ring-2 ring-emerald-400'
                    : 'bg-surface-muted hover:bg-surface text-fg border-line'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs sm:text-sm">{opt.title}</span>
                  {isSelected ? (
                    <CheckCircle2 className="w-4 h-4 text-white flex-shrink-0" />
                  ) : (
                    <span className="text-xs font-mono text-fg-muted">{opt.rate}</span>
                  )}
                </div>
                <p className={`text-xs mt-1 leading-snug ${isSelected ? 'text-emerald-100' : 'text-fg-muted'}`}>
                  {opt.desc}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* One-Line Top Headline Result (Phase 4 requirement) */}
      <div className="p-4 sm:p-5 rounded-2xl bg-surface border border-line shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="p-2.5 rounded-xl bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 flex-shrink-0" aria-hidden="true">
            <Zap className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          </span>
          <div>
            <div className="text-xs uppercase font-bold tracking-wider text-fg-subtle">
              Clean Energy Forecast
            </div>
            <p className="text-sm sm:text-base font-bold text-fg leading-snug">
              {headlineSaving}
            </p>
          </div>
        </div>
        <Badge variant={mode === 'reloop' ? 'emerald' : 'amber'} size="md">
          {mode === 'reloop' ? 'Biomethane Active' : 'Baseline Methane Lost'}
        </Badge>
      </div>

      {/* Primary KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <StatCard
          isHero
          title="Clean Electricity"
          value={currentMetrics.energyGeneratedMwh.toFixed(1)}
          unit="MWh Total"
          calculationInfo="Renewable electricity generated from captured biomethane via municipal CHP generators."
          subtitle={`Powers ~${homesPowered} Pune residential homes for 24 hours.`}
          accentColor="amber"
          icon={<Zap className="w-5 h-5" />}
        />

        <StatCard
          isHero
          title="Bio-Methane Captured"
          value={Math.round(currentMetrics.biogasProducedM3).toLocaleString()}
          unit="m³ Raw Biogas"
          calculationInfo="Methane gas captured from anaerobic digestion, avoiding fugitive landfill greenhouse gas leaks."
          subtitle={`Equivalent to ${cngCylinderEquivalent.toLocaleString()} kg of clean Bio-CNG fuel.`}
          accentColor="sage"
          icon={<Flame className="w-5 h-5" />}
        />

        <StatCard
          isHero
          title="Grid Feed-in Tariff Value"
          value={formatCurrencyINR(currentMetrics.energyGeneratedMwh * 1000 * config.electricityTariffInrPerKwh)}
          unit="Feed-in Settlement"
          calculationInfo={`Direct grid revenue earned at Maharashtra MERC feed-in rate of ₹${config.electricityTariffInrPerKwh}/kWh.`}
          subtitle={`MERC tariff rate: ₹${config.electricityTariffInrPerKwh} / kWh.`}
          accentColor="navy"
          icon={<Coins className="w-5 h-5" />}
        />
      </div>

      {/* Full-Width Forecast Trend Chart */}
      <SectionCard
        title="Biomethane & Clean Power Generation Trend"
        subtitle="Simulated generation rate (MWh) across consecutive hourly operational windows"
      >
        <div className="h-72 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={energyTimeSeries} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="energyGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#D97706" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#D97706" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={chartTheme.gridColor} />
              <XAxis dataKey="timestamp" stroke={chartTheme.axisColor} fontSize={12} tickLine={false} />
              <YAxis stroke={chartTheme.axisColor} fontSize={12} tickLine={false} unit=" MWh" />
              <RechartsTooltip contentStyle={chartTheme.tooltipStyle} />
              <Area
                type="monotone"
                dataKey="mwh"
                name="Electricity (MWh)"
                stroke="#D97706"
                strokeWidth={3}
                fill="url(#energyGrad)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </SectionCard>

      {/* Grid Allocation & Offset Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <SectionCard
          title="Power Grid Offtake & Distribution"
          subtitle="How generated clean power is distributed across municipal assets"
        >
          <div className="space-y-3 pt-2">
            {[
              { label: 'Pilot Ward Streetlighting & EV Bin Fleet', share: '35%', detail: 'Powers 60 smart bin sensors and depot EV charging stations' },
              { label: 'MRF Facility Mechanical Operations', share: '25%', detail: 'Supplies optical vision sorters and conveyor motors' },
              { label: 'MSEDCL Municipal Grid Export', share: '40%', detail: 'Fed into Maharashtra grid at feed-in tariff' },
            ].map((item) => (
              <div key={item.label} className="p-3.5 rounded-xl bg-surface-muted border border-line space-y-1">
                <div className="flex justify-between items-center text-sm">
                  <span className="font-bold text-fg">{item.label}</span>
                  <span className="font-mono font-bold text-amber-600 dark:text-amber-400">{item.share}</span>
                </div>
                <p className="text-xs text-fg-muted">{item.detail}</p>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard
          title="Fugitive Methane Mitigation"
          subtitle="Direct atmospheric greenhouse gas avoidance metrics"
        >
          <div className="space-y-3 pt-2">
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 dark:bg-emerald-500/15 dark:border-emerald-500/30 space-y-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
                Greenhouse Gas Mitigation Impact
              </span>
              <span className="text-2xl font-black font-heading text-emerald-700 dark:text-emerald-400 block">
                {currentMetrics.co2AvoidedTonnes.toFixed(1)} Tonnes CO₂e Avoided
              </span>
              <p className="text-xs text-fg-muted leading-relaxed">
                Methane has 28x higher global warming potential than carbon dioxide. Capturing raw digestate inside sealed AD tanks completely halts uncontrolled open-air landfill emissions.
              </p>
            </div>
            
            <div className="flex items-center gap-2 p-3 rounded-xl bg-surface-muted border border-line text-xs text-fg-muted">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
              <span>Calibrated to CPCB and Maharashtra State Energy Regulatory Guidelines.</span>
            </div>
          </div>
        </SectionCard>
      </div>

      {/* Loop Step Navigation */}
      <LoopStepNav
        currentStep={6}
        prevPath="/app/allocate"
        prevLabel="Allocate · Waste streams"
        nextPath="/app/revenue"
        nextLabel="Report · Results & revenue"
      />

    </div>
  );
};
