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
  const { simState, config, mode } = useStore();

  const currentMetrics = mode === 'reloop' ? simState.reloopCumulative : simState.baselineCumulative;
  const todayMetrics = mode === 'reloop' ? simState.todayReloop : simState.todayBaseline;

  // Processing units capacity & utilization
  const allocationUnits: AllocationUnit[] = [
    {
      id: 'unit-ad',
      name: 'Thermophilic Anaerobic Digestion Plant',
      category: 'Energy',
      currentInputTonnesPerDay: Number((todayMetrics.energyRecoveredTonnes * 0.65).toFixed(1)),
      maxCapacityTonnesPerDay: 25.0,
      utilizationPercent: Math.min(100, Math.round(((todayMetrics.energyRecoveredTonnes * 0.65) / 25.0) * 100)),
      outputProduct: 'Raw Bio-Methane (CH₄ ~62%) & Clean Electricity',
      outputYield: `${Math.round(todayMetrics.biogasProducedM3)} m³ Biogas · ${todayMetrics.energyGeneratedMwh.toFixed(1)} MWh`,
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
      currentInputTonnesPerDay: todayMetrics.recycledTonnes,
      maxCapacityTonnesPerDay: 20.0,
      utilizationPercent: Math.min(100, Math.round((todayMetrics.recycledTonnes / 20.0) * 100)),
      outputProduct: 'rPET Flakes, HDPE Pellets, Aluminum Ingots',
      outputYield: `${todayMetrics.recycledTonnes.toFixed(1)} Tonnes Commodity Recyclates`,
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

      {/* One-Line Top Headline Result (Phase 4 requirement) */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white border border-charcoal-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="p-2.5 rounded-xl bg-emerald-100 text-emerald-800 flex-shrink-0" aria-hidden="true">
            <GitFork className="w-5 h-5 text-emerald-700" />
          </span>
          <div>
            <div className="text-xs uppercase font-bold tracking-wider text-charcoal-500">
              Mass Balance Allocation
            </div>
            <p className="text-sm sm:text-base font-bold text-navy-900 leading-snug">
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
            <span className="text-xs font-bold uppercase tracking-wider text-charcoal-500 block mb-1">
              Sorted Inflows (Daily)
            </span>
            {[
              { label: 'Wet Organic Stream', tonnes: todayMetrics.compostedTonnes / config.compostYieldFactor + todayMetrics.energyRecoveredTonnes * 0.65, color: 'bg-sage-600' },
              { label: 'Dry Recyclables & Polymers', tonnes: todayMetrics.recycledTonnes, color: 'bg-navy-700' },
              { label: 'C&D Debris & Aggregates', tonnes: todayMetrics.cdAggregateTonnes, color: 'bg-blue-600' },
              { label: 'Combustible Tailings & RDF', tonnes: todayMetrics.energyRecoveredTonnes * 0.35, color: 'bg-amberGold-600' },
              { label: 'Unavoidable Residual', tonnes: todayMetrics.landfilledTonnes, color: 'bg-residual-500' },
            ].map((stream) => (
              <div key={stream.label} className="p-3.5 rounded-xl border border-charcoal-200 bg-[#F8FAFC] space-y-1.5">
                <div className="flex justify-between items-center text-sm">
                  <span className="font-bold text-navy-900">{stream.label}</span>
                  <span className="font-mono font-bold text-navy-800">{stream.tonnes.toFixed(1)} t/d</span>
                </div>
                <div className="w-full h-2 rounded-full bg-charcoal-200 overflow-hidden">
                  <div className={`h-full rounded-full ${stream.color}`} style={{ width: `${Math.min(100, Math.round((stream.tonnes / Math.max(1, todayMetrics.collectedTonnes)) * 100))}%` }} />
                </div>
              </div>
            ))}
          </div>

          {/* Allocation Routing Conduits (Center) */}
          <div className="lg:col-span-2 hidden lg:flex flex-col items-center justify-center space-y-8 text-charcoal-400">
            <div className="p-2 rounded-full bg-navy-50 text-navy-700 border border-navy-200 shadow-2xs">
              <ArrowRight className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-mono text-center uppercase tracking-wider font-semibold text-charcoal-500">
              AI Dynamic Dispatch
            </span>
            <div className="p-2 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-2xs">
              <ArrowRight className="w-5 h-5" />
            </div>
          </div>

          {/* Processing Facilities List & Utilization (Right Side) */}
          <div className="lg:col-span-6 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-charcoal-500 block mb-1">
              Receiving Processing Facilities & Daily Load
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {allocationUnits.map((unit) => (
                <div 
                  key={unit.id}
                  className="p-3.5 rounded-xl border border-charcoal-200 bg-white shadow-2xs space-y-2 hover:border-emerald-300 transition-all"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-xs text-navy-900 leading-snug">{unit.name}</h4>
                      <span className="text-xs text-charcoal-500 font-mono">Max: {unit.maxCapacityTonnesPerDay} t/d</span>
                    </div>
                    <Badge variant={unit.utilizationPercent > 85 ? 'amber' : 'sage'} size="sm">
                      {unit.utilizationPercent}% Load
                    </Badge>
                  </div>

                  <div className="w-full h-2 rounded-full bg-charcoal-100 overflow-hidden border border-charcoal-200">
                    <div 
                      className={`h-full rounded-full ${
                        unit.utilizationPercent > 85 ? 'bg-amberGold-500' : 'bg-sage-500'
                      }`}
                      style={{ width: `${unit.utilizationPercent}%` }}
                    />
                  </div>

                  <div className="pt-1.5 border-t border-charcoal-100 text-xs">
                    <span className="text-charcoal-500 block text-[10px]">Resource Yield:</span>
                    <span className="font-bold text-navy-900 truncate block">{unit.outputYield}</span>
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
