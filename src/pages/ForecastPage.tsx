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

export const ForecastPage: React.FC = () => {
  const { simState, config, mode } = useStore();

  const currentMetrics = mode === 'reloop' ? simState.reloopCumulative : simState.baselineCumulative;
  const homesPowered = Math.round((currentMetrics.energyGeneratedMwh * 1000) / 3.5);
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

      {/* One-Line Top Headline Result (Phase 4 requirement) */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white border border-charcoal-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="p-2.5 rounded-xl bg-emerald-100 text-emerald-800 flex-shrink-0" aria-hidden="true">
            <Zap className="w-5 h-5 text-emerald-700" />
          </span>
          <div>
            <div className="text-xs uppercase font-bold tracking-wider text-charcoal-500">
              Clean Energy Forecast
            </div>
            <p className="text-sm sm:text-base font-bold text-navy-900 leading-snug">
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
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="timestamp" stroke="#64748B" fontSize={12} tickLine={false} />
              <YAxis stroke="#64748B" fontSize={12} tickLine={false} unit=" MWh" />
              <RechartsTooltip />
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
              <div key={item.label} className="p-3.5 rounded-xl bg-charcoal-50 border border-charcoal-200 space-y-1">
                <div className="flex justify-between items-center text-sm">
                  <span className="font-bold text-navy-900">{item.label}</span>
                  <span className="font-mono font-bold text-amber-700">{item.share}</span>
                </div>
                <p className="text-xs text-charcoal-600">{item.detail}</p>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard
          title="Fugitive Methane Mitigation"
          subtitle="Direct atmospheric greenhouse gas avoidance metrics"
        >
          <div className="space-y-3 pt-2">
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 space-y-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                Greenhouse Gas Mitigation Impact
              </span>
              <span className="text-2xl font-black font-heading text-emerald-700 block">
                {currentMetrics.co2AvoidedTonnes.toFixed(1)} Tonnes CO₂e Avoided
              </span>
              <p className="text-xs text-charcoal-600 leading-relaxed">
                Methane has 28x higher global warming potential than carbon dioxide. Capturing raw digestate inside sealed AD tanks completely halts uncontrolled open-air landfill emissions.
              </p>
            </div>
            
            <div className="flex items-center gap-2 p-3 rounded-xl bg-charcoal-50 border border-charcoal-200 text-xs text-charcoal-700">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
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
