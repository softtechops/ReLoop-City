import React from 'react';
import { useStore } from '../store/useStore';
import { AllocationUnit } from '../types';
import { PageHeader } from '../components/ui/PageHeader';
import { LoopStepNav } from '../components/ui/LoopStepNav';
import { SectionCard } from '../components/ui/SectionCard';
import { StatCard } from '../components/ui/StatCard';
import { Badge } from '../components/ui/Badge';
import { 
  GitFork, 
  Leaf, 
  Factory, 
  Coins, 
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Boxes
} from 'lucide-react';
import { formatTonnage } from '../lib/formatters';

export const AllocatePage: React.FC = () => {
  const { simState, config, mode, allocationStrategy, setAllocationStrategy } = useStore();

  const currentMetrics = mode === 'reloop' ? simState.reloopCumulative : simState.baselineCumulative;
  const todayMetrics = mode === 'reloop' ? simState.todayReloop : simState.todayBaseline;

  // Processing units capacity & utilization
  const allocationUnits: AllocationUnit[] = [
    {
      id: 'unit-ad',
      name: 'Thermophilic Anaerobic Digestion Plant',
      category: 'Energy',
      currentInputTonnesPerDay: Number((todayMetrics.energyRecoveredTonnes * (allocationStrategy === 'max_energy' ? 0.8 : 0.65)).toFixed(1)),
      maxCapacityTonnesPerDay: 25.0,
      utilizationPercent: Math.min(100, Math.round(((todayMetrics.energyRecoveredTonnes * (allocationStrategy === 'max_energy' ? 0.8 : 0.65)) / 25.0) * 100)),
      outputProduct: 'Raw Bio-Methane (CH₄ ~62%) & Clean Electricity',
      outputYield: `${Math.round(todayMetrics.biogasProducedM3 * (allocationStrategy === 'max_energy' ? 1.15 : 1))} m³ Biogas · ${(todayMetrics.energyGeneratedMwh * (allocationStrategy === 'max_energy' ? 1.15 : 1)).toFixed(1)} MWh`,
      operationalStatus: 'Optimal',
    },
    {
      id: 'unit-compost',
      name: 'Aerated Static Pile Composting Facility',
      category: 'Organic',
      currentInputTonnesPerDay: Number((todayMetrics.compostedTonnes / config.compostYieldFactor).toFixed(1)),
      maxCapacityTonnesPerDay: 30.0,
      utilizationPercent: Math.min(100, Math.round(((todayMetrics.compostedTonnes / config.compostYieldFactor) / 30.0) * 100)),
      outputProduct: 'Enriched Humus Compost & Bio-Fertilizer',
      outputYield: `${todayMetrics.compostedTonnes.toFixed(1)} Tonnes Packaged Compost`,
      operationalStatus: 'Optimal',
    },
    {
      id: 'unit-mrf-recycling',
      name: 'MRF Polymer & Metal Sorting Lines',
      category: 'Recycling',
      currentInputTonnesPerDay: Number((todayMetrics.recycledTonnes * (allocationStrategy === 'max_recovery' ? 1.15 : 1.0)).toFixed(1)),
      maxCapacityTonnesPerDay: 20.0,
      utilizationPercent: Math.min(100, Math.round(((todayMetrics.recycledTonnes * (allocationStrategy === 'max_recovery' ? 1.15 : 1.0)) / 20.0) * 100)),
      outputProduct: 'rPET Flakes, HDPE Pellets, Aluminum Ingots',
      outputYield: `${(todayMetrics.recycledTonnes * (allocationStrategy === 'max_recovery' ? 1.15 : 1.0)).toFixed(1)} Tonnes Commodity Recyclates`,
      operationalStatus: 'Optimal',
    },
    {
      id: 'unit-cd-agg',
      name: 'Moshi C&D Aggregate Crusher Plant',
      category: 'Aggregates',
      currentInputTonnesPerDay: todayMetrics.cdAggregateTonnes,
      maxCapacityTonnesPerDay: 40.0,
      utilizationPercent: Math.min(100, Math.round((todayMetrics.cdAggregateTonnes / 40.0) * 100)),
      outputProduct: '10mm/20mm Recycled Gravel & M-Sand',
      outputYield: `${todayMetrics.cdAggregateTonnes.toFixed(1)} Tonnes Manufactured Aggregates`,
      operationalStatus: 'Optimal',
    },
    {
      id: 'unit-rdf',
      name: 'Refuse Derived Fuel (RDF) Densifier',
      category: 'Energy',
      currentInputTonnesPerDay: Number((todayMetrics.energyRecoveredTonnes * 0.35).toFixed(1)),
      maxCapacityTonnesPerDay: 15.0,
      utilizationPercent: Math.min(100, Math.round(((todayMetrics.energyRecoveredTonnes * 0.35) / 15.0) * 100)),
      outputProduct: 'Calorific Fuel Fluffs for Cement Kilns',
      outputYield: `${(todayMetrics.energyRecoveredTonnes * 0.35 * config.rdfYieldFactor).toFixed(1)} Tonnes High-Calorific RDF`,
      operationalStatus: 'Optimal',
    },
    {
      id: 'unit-landfill',
      name: 'PCMC Sanitary Landfill (Residuals Only)',
      category: 'Residual',
      currentInputTonnesPerDay: todayMetrics.landfilledTonnes,
      maxCapacityTonnesPerDay: 50.0,
      utilizationPercent: Math.min(100, Math.round((todayMetrics.landfilledTonnes / 50.0) * 100)),
      outputProduct: 'Inert Ash & Non-Combustible Residual Disposal',
      outputYield: `${todayMetrics.landfilledTonnes.toFixed(1)} Tonnes Residual (Strictly Controlled)`,
      operationalStatus: mode === 'reloop' ? 'Optimal' : 'High Load',
    },
  ];

  const headlineResult = `${currentMetrics.landfillDiversionRatePercent.toFixed(1)}% of municipal waste diverted across 5 dedicated circular recovery facilities`;

  return (
    <div className="space-y-6 pb-16">
      {/* Page Header */}
      <PageHeader
        title="Allocate · Waste streams"
        subtitle="End-to-end mass balance routing classified municipal streams directly into digestion, composting, and remanufacturing lines."
        decisionPrompt="How should today's waste be split across facilities?"
        stepNumber={5}
        totalSteps={7}
        stepName="Allocate"
        howItWorks={
          <div className="space-y-2">
            <p>
              ReLoop allocates daily collected tonnage across 5 specialized municipal processing facilities based on current operating load and stream purity.
            </p>
            <p>
              Wet organics flow to anaerobic digesters and composting heaps; dry commodities flow to MRF polymer balers; inert rubble is converted to manufactured sand. Only true non-recyclable residual reaches the sanitary landfill.
            </p>
          </div>
        }
      />

      {/* Manager Decision: Facility Diversion Policy Selector */}
      <div className="p-4 sm:p-5 rounded-2xl bg-surface border border-line shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-fg-subtle block">
              Operational Mass Allocation Strategy
            </span>
            <p className="text-sm font-bold text-fg">
              Select target prioritization for incoming organic &amp; dry municipal streams:
            </p>
          </div>
          <span className="text-xs font-mono text-fg-muted">
            Active: <strong className="text-fg uppercase">{allocationStrategy.replace('_', ' ')}</strong>
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            {
              id: 'balanced' as const,
              title: 'Balanced Allocation',
              desc: 'Standard multi-stream split between MRF, composting & biogas CHP.',
            },
            {
              id: 'max_energy' as const,
              title: 'Max Biogas & Energy',
              desc: 'Routes maximum organic digestate to thermophilic AD for power generation.',
            },
            {
              id: 'max_recovery' as const,
              title: 'Max Commodity Recovery',
              desc: 'Maximizes high-grade polymer baling & secondary market packaging sales.',
            },
          ].map((strat) => {
            const isSelected = allocationStrategy === strat.id;
            return (
              <button
                key={strat.id}
                type="button"
                onClick={() => setAllocationStrategy(strat.id)}
                className={`p-3.5 rounded-xl border text-left transition-all min-h-[44px] cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm ring-2 ring-emerald-400'
                    : 'bg-surface-muted hover:bg-surface text-fg border-line'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs sm:text-sm">{strat.title}</span>
                  {isSelected && <CheckCircle2 className="w-4 h-4 text-white flex-shrink-0" />}
                </div>
                <p className={`text-xs mt-1 leading-snug ${isSelected ? 'text-emerald-100' : 'text-fg-muted'}`}>
                  {strat.desc}
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
            <GitFork className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          </span>
          <div>
            <div className="text-xs uppercase font-bold tracking-wider text-fg-subtle">
              Mass Balance Allocation
            </div>
            <p className="text-sm sm:text-base font-bold text-fg leading-snug">
              {headlineResult}
            </p>
          </div>
        </div>
        <Badge variant={mode === 'reloop' ? 'emerald' : 'amber'} size="md">
          {mode === 'reloop' ? 'Zero-Landfill Target' : 'Legacy High Landfill'}
        </Badge>
      </div>

      {/* Sankey-Style Material Mass Flow Diagram */}
      <SectionCard
        title="Material Flow & Mass Balance Allocation"
        subtitle="Visualizing mass flow from sorted municipal streams (left) into processing infrastructure (right)"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 py-3 items-center">
          
          {/* Stream Inflows (Left Side) */}
          <div className="lg:col-span-4 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-fg-subtle block mb-1">
              Sorted Inflows (Daily)
            </span>
            {[
              { label: 'Wet Organic Stream', tonnes: todayMetrics.compostedTonnes / config.compostYieldFactor + todayMetrics.energyRecoveredTonnes * 0.65, color: 'bg-emerald-600' },
              { label: 'Dry Recyclables & Polymers', tonnes: todayMetrics.recycledTonnes, color: 'bg-sky-600' },
              { label: 'C&D Debris & Aggregates', tonnes: todayMetrics.cdAggregateTonnes, color: 'bg-indigo-600' },
              { label: 'Combustible Tailings & RDF', tonnes: todayMetrics.energyRecoveredTonnes * 0.35, color: 'bg-amber-500' },
              { label: 'Unavoidable Residual', tonnes: todayMetrics.landfilledTonnes, color: 'bg-slate-400' },
            ].map((stream) => (
              <div key={stream.label} className="p-3.5 rounded-xl border border-line bg-surface-muted space-y-1.5">
                <div className="flex justify-between items-center text-sm">
                  <span className="font-bold text-fg">{stream.label}</span>
                  <span className="font-mono font-bold text-fg">{stream.tonnes.toFixed(1)} t/d</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                  <div className={`h-full rounded-full ${stream.color}`} style={{ width: `${Math.min(100, Math.round((stream.tonnes / Math.max(1, todayMetrics.collectedTonnes)) * 100))}%` }} />
                </div>
              </div>
            ))}
          </div>

          {/* Allocation Routing Conduits (Center) */}
          <div className="lg:col-span-2 hidden lg:flex flex-col items-center justify-center space-y-8 text-fg-subtle">
            <div className="p-2 rounded-full bg-surface-muted text-fg border border-line shadow-2xs">
              <ArrowRight className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-mono text-center uppercase tracking-wider font-semibold text-fg-muted">
              AI Dynamic Dispatch
            </span>
            <div className="p-2 rounded-full bg-surface-muted text-emerald-600 dark:text-emerald-400 border border-line shadow-2xs">
              <ArrowRight className="w-5 h-5" />
            </div>
          </div>

          {/* Processing Facilities List & Utilization (Right Side) */}
          <div className="lg:col-span-6 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-fg-subtle block mb-1">
              Receiving Processing Facilities & Daily Load
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {allocationUnits.map((unit) => (
                <div 
                  key={unit.id}
                  className="p-3.5 rounded-xl border border-line bg-surface shadow-sm space-y-2 hover:border-emerald-500/50 transition-all"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-xs text-fg leading-snug">{unit.name}</h4>
                      <span className="text-xs text-fg-muted font-mono">Max: {unit.maxCapacityTonnesPerDay} t/d</span>
                    </div>
                    <Badge variant={unit.utilizationPercent > 85 ? 'amber' : 'sage'} size="sm">
                      {unit.utilizationPercent}% Load
                    </Badge>
                  </div>

                  <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${
                        unit.utilizationPercent > 85 ? 'bg-amber-500' : 'bg-emerald-600 dark:bg-emerald-500'
                      }`}
                      style={{ width: `${unit.utilizationPercent}%` }}
                    />
                  </div>

                  <div className="pt-1.5 border-t border-line text-xs">
                    <span className="text-fg-subtle block text-[10px]">Resource Yield:</span>
                    <span className="font-bold text-fg truncate block">{unit.outputYield}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </SectionCard>

      {/* Loop Step Navigation */}
      <LoopStepNav
        currentStep={5}
        prevPath="/app/classify"
        prevLabel="Classify · Waste sorting"
        nextPath="/app/forecast"
        nextLabel="Forecast · Clean energy"
      />

    </div>
  );
};
