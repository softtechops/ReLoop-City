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
  Zap, 
  Flame, 
  Leaf, 
  Factory, 
  Coins, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { formatCurrencyINR, formatTonnage } from '../lib/formatters';

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

  const homesPowered = Math.round((currentMetrics.energyGeneratedMwh * 1000) / 3.5);
  const cngCylinderEquivalent = Math.round(currentMetrics.biogasProducedM3 * 0.45);

  return (
    <div className="space-y-6 pb-16">
      
      {/* Page Header */}
      <PageHeader
        title="5–6 · Where Waste Goes & Clean Energy Forecasting"
        subtitle="End-to-end mass balance routing classified municipal streams directly to anaerobic digestion, composting, and remanufacturing lines."
        stepNumber={5}
        totalSteps={7}
        stepName="Allocate & Forecast"
        actions={
          <Badge variant="sage" size="md">
            <span>{currentMetrics.landfillDiversionRatePercent.toFixed(1)}% Diversion Rate</span>
          </Badge>
        }
      />

      {/* Sankey-Style Material Mass Flow Diagram */}
      <SectionCard
        title="Material Flow & Mass Balance Sankey Diagram"
        subtitle="Visualizing mass flow from sorted municipal streams (left) into processing infrastructure (right)"
      >
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center pt-2">
          
          {/* Source Stream Inputs (Left Column) */}
          <div className="md:col-span-4 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-charcoal-400 block">
              1. Sorted Input Streams (Tonnes/Day)
            </span>

            {[
              { label: 'Wet Organic & Mandi Waste', tonnes: todayMetrics.collectedTonnes * 0.48, color: 'bg-sage-600' },
              { label: 'Dry High-Grade Recyclables', tonnes: todayMetrics.recycledTonnes, color: 'bg-navy-700' },
              { label: 'C&D Concrete & Masonry', tonnes: todayMetrics.cdAggregateTonnes, color: 'bg-charcoal-500' },
              { label: 'Combustible Tailings & RDF', tonnes: todayMetrics.energyRecoveredTonnes * 0.35, color: 'bg-amberGold-600' },
              { label: 'Unavoidable Residual', tonnes: todayMetrics.landfilledTonnes, color: 'bg-residual-500' },
            ].map((stream) => (
              <div key={stream.label} className="p-3.5 rounded-xl border border-navy-100 bg-[#F7F6F2]/50 space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-navy-900">{stream.label}</span>
                  <span className="font-mono font-bold text-navy-800">{stream.tonnes.toFixed(1)} t/d</span>
                </div>
                <div className="w-full h-2 rounded-full bg-navy-100 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${stream.color}`}
                    style={{ width: `${Math.min(100, (stream.tonnes / todayMetrics.collectedTonnes) * 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Animated Connecting Flow Vectors (Center Column) */}
          <div className="hidden md:flex md:col-span-1 flex-col items-center justify-center space-y-6 text-navy-300" aria-hidden="true">
            <ArrowRight className="w-5 h-5 text-navy-400 animate-pulse" />
            <ArrowRight className="w-5 h-5 text-sage-500 animate-pulse" />
            <ArrowRight className="w-5 h-5 text-amberGold-400 animate-pulse" />
            <ArrowRight className="w-5 h-5 text-navy-400 animate-pulse" />
            <ArrowRight className="w-5 h-5 text-residual-400 animate-pulse" />
          </div>

          {/* Target Processing Facilities (Right Column) */}
          <div className="md:col-span-7 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-charcoal-400 block">
              2. Facility Capacity & Resource Output
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {allocationUnits.map((unit) => (
                <div key={unit.id} className="p-4 rounded-xl border border-navy-100 bg-white shadow-xs space-y-2 hover:border-navy-300 transition-all">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-xs text-navy-900 leading-snug">{unit.name}</h4>
                      <span className="text-xs text-charcoal-500 font-mono">Max: {unit.maxCapacityTonnesPerDay} t/d</span>
                    </div>
                    <Badge variant={unit.utilizationPercent > 85 ? 'amber' : 'sage'} size="sm">
                      {unit.utilizationPercent}% Load
                    </Badge>
                  </div>

                  <div className="w-full h-2 rounded-full bg-navy-50 overflow-hidden border border-navy-100">
                    <div 
                      className={`h-full rounded-full ${
                        unit.utilizationPercent > 85 ? 'bg-amberGold-500' : 'bg-sage-500'
                      }`}
                      style={{ width: `${unit.utilizationPercent}%` }}
                    />
                  </div>

                  <div className="pt-1.5 border-t border-navy-50 text-xs">
                    <span className="text-charcoal-500 block text-[10px]">Resource Yield:</span>
                    <span className="font-bold text-navy-900">{unit.outputYield}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </SectionCard>

      {/* Energy Generation & Clean Grid Forecast Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <StatCard
          title="Clean Electricity"
          value={currentMetrics.energyGeneratedMwh.toFixed(1)}
          unit="MWh Cumulative"
          calculationInfo="Power produced through biogas CHP generators feeding into MSEDCL municipal grid."
          subtitle={`Sufficient to power ${homesPowered} Pune residential homes for a full day.`}
          accentColor="amber"
          icon={<Zap className="w-5 h-5" />}
        />

        <StatCard
          title="Bio-Methane Captured"
          value={currentMetrics.biogasProducedM3.toLocaleString()}
          unit="m³ Raw Biogas"
          calculationInfo="Anaerobic digestion methane potential (~62% CH4) preventing atmospheric greenhouse leaks."
          subtitle={`Equivalent to ${cngCylinderEquivalent.toLocaleString()} kg compressed Bio-CNG bus fuel.`}
          accentColor="sage"
          icon={<Flame className="w-5 h-5" />}
        />

        <StatCard
          title="Grid Tariff Value"
          value={formatCurrencyINR(currentMetrics.energyGeneratedMwh * 1000 * config.electricityTariffInrPerKwh)}
          unit="Feed-in Tariff"
          calculationInfo={`Calculated at Maharashtra feed-in tariff of ₹${config.electricityTariffInrPerKwh}/kWh.`}
          subtitle={`Tariff rate: ₹${config.electricityTariffInrPerKwh}/kWh municipal feed-in.`}
          accentColor="navy"
          icon={<Coins className="w-5 h-5" />}
        />
      </div>

      {/* Loop Step Navigation */}
      <LoopStepNav
        currentStep={5}
        prevPath="/classify"
        prevLabel="4 · Waste Sorting (AI Vision)"
        nextPath="/revenue"
        nextLabel="7 · Results & Revenue"
      />

    </div>
  );
};
