import React from 'react';
import { useStore } from '../store/useStore';
import { AllocationUnit } from '../types';
import { 
  GitFork, 
  Zap, 
  Flame, 
  Leaf, 
  Layers, 
  Factory, 
  Sparkles, 
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  TrendingUp,
  Coins,
  Gauge
} from 'lucide-react';

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
      outputYield: `${Math.round(todayMetrics.biogasProducedM3)} m³ Biogas • ${todayMetrics.energyGeneratedMwh.toFixed(1)} MWh`,
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

  // Energy equivalencies
  const homesPowered = Math.round(currentMetrics.energyGeneratedMwh * 1000 / 3.5); // avg urban home uses ~3.5 kWh/day
  const cngCylinderEquivalent = Math.round(currentMetrics.biogasProducedM3 * 0.45); // kg bio-CNG

  return (
    <div className="space-y-6 pb-12">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white border border-navy-100 shadow-blueprint">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-navy-800 font-['Outfit']">
              Resource Allocation & Energy Forecasting (Steps 5 & 6)
            </h1>
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-amberGold-100 text-amberGold-800 flex items-center gap-1">
              <Zap className="w-3 h-3 text-amberGold-600" />
              Dynamic Mass Balance Engine
            </span>
          </div>
          <p className="text-xs text-charcoal-500 mt-1">
            End-to-end material flow routing classified municipal streams directly to digestion, composting, and remanufacturing lines.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto text-xs font-semibold text-charcoal-600 bg-navy-50 px-3 py-1.5 rounded-xl border border-navy-100">
          <span>Diversion Rate:</span>
          <span className="text-sage-700 font-bold font-mono text-sm">
            {currentMetrics.landfillDiversionRatePercent.toFixed(1)}%
          </span>
        </div>
      </div>

      {/* Sankey-Style Material Mass Flow Diagram */}
      <div className="bg-white rounded-2xl border border-navy-100 shadow-blueprint p-6 space-y-4">
        <div>
          <h2 className="font-bold text-base text-navy-800 font-['Outfit']">
            Material Flow & Mass Balance Sankey Diagram
          </h2>
          <p className="text-xs text-charcoal-400">
            Visualizing mass flow from sorted municipal streams (left) into processing infrastructure (right)
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center pt-2">
          
          {/* Source Stream Inputs (Left Column) */}
          <div className="md:col-span-4 space-y-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-charcoal-400 block">
              1. Sorted Input Streams (Tonnes)
            </span>

            {[
              { label: 'Wet Organic & Mandi Waste', tonnes: todayMetrics.collectedTonnes * 0.48, color: 'bg-sage-600', badge: 'Organic' },
              { label: 'Dry High-Grade Recyclables', tonnes: todayMetrics.recycledTonnes, color: 'bg-navy-700', badge: 'Recyclables' },
              { label: 'C&D Concrete & Masonry', tonnes: todayMetrics.cdAggregateTonnes, color: 'bg-charcoal-500', badge: 'C&D Debris' },
              { label: 'Combustible Tailings & RDF', tonnes: todayMetrics.energyRecoveredTonnes * 0.35, color: 'bg-amberGold-600', badge: 'Calorific' },
              { label: 'Unavoidable Residual', tonnes: todayMetrics.landfilledTonnes, color: 'bg-residual-500', badge: 'Residual' },
            ].map((stream) => (
              <div key={stream.label} className="p-3 rounded-xl border border-navy-100 bg-[#F7F6F2]/50 space-y-1">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-navy-900">{stream.label}</span>
                  <span className="font-mono font-bold text-navy-800">{stream.tonnes.toFixed(1)} t/d</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-navy-100 overflow-hidden">
                  <div className={`h-full rounded-full ${stream.color}`} style={{ width: `${Math.min(100, (stream.tonnes / todayMetrics.collectedTonnes) * 100)}%` }}></div>
                </div>
              </div>
            ))}
          </div>

          {/* Animated Connecting Flow Vectors (Center Column) */}
          <div className="hidden md:flex md:col-span-1 flex-col items-center justify-center space-y-6 text-navy-300">
            <ArrowRight className="w-5 h-5 text-navy-400 animate-pulse" />
            <ArrowRight className="w-5 h-5 text-sage-500 animate-pulse" />
            <ArrowRight className="w-5 h-5 text-amberGold-400 animate-pulse" />
            <ArrowRight className="w-5 h-5 text-navy-400 animate-pulse" />
            <ArrowRight className="w-5 h-5 text-residual-400 animate-pulse" />
          </div>

          {/* Target Processing Facilities (Right Column) */}
          <div className="md:col-span-7 space-y-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-charcoal-400 block">
              2. Facility Capacity & Resource Output
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {allocationUnits.map((unit) => (
                <div key={unit.id} className="p-3.5 rounded-xl border border-navy-100 bg-white shadow-xs space-y-2 hover:border-navy-300 transition-all">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-xs text-navy-900 leading-snug">{unit.name}</h4>
                      <span className="text-[10px] text-charcoal-400 font-mono">Max: {unit.maxCapacityTonnesPerDay} t/d</span>
                    </div>
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-sage-100 text-sage-800">
                      {unit.utilizationPercent}% Load
                    </span>
                  </div>

                  {/* Capacity Bar */}
                  <div className="w-full h-2 rounded-full bg-navy-50 overflow-hidden border border-navy-100">
                    <div 
                      className={`h-full rounded-full ${
                        unit.utilizationPercent > 85 ? 'bg-amberGold-500' : 'bg-sage-500'
                      }`}
                      style={{ width: `${unit.utilizationPercent}%` }}
                    ></div>
                  </div>

                  <div className="pt-1 border-t border-navy-50 text-[11px]">
                    <span className="text-charcoal-500 block text-[10px]">Resource Yield:</span>
                    <span className="font-bold text-navy-800">{unit.outputYield}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Energy Generation & Clean Grid Forecast Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        {/* Card 1: Clean Electric Power */}
        <div className="p-5 rounded-2xl bg-white border border-navy-100 shadow-blueprint space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-charcoal-400">Electricity Generated</span>
            <div className="w-8 h-8 rounded-lg bg-amberGold-100 text-amberGold-700 flex items-center justify-center">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="text-3xl font-extrabold text-navy-800 font-['Outfit']">
              {currentMetrics.energyGeneratedMwh.toFixed(1)}
            </span>
            <span className="text-xs font-semibold text-charcoal-500 ml-1.5">MWh Cumulative</span>
          </div>
          <p className="text-xs text-charcoal-500 pt-1 border-t border-navy-50">
            Sufficient to power <strong>{homesPowered}</strong> Pune residential households for an entire day.
          </p>
        </div>

        {/* Card 2: Bio-CNG / Methane Yield */}
        <div className="p-5 rounded-2xl bg-white border border-navy-100 shadow-blueprint space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-charcoal-400">Bio-Methane Yield</span>
            <div className="w-8 h-8 rounded-lg bg-sage-100 text-sage-700 flex items-center justify-center">
              <Flame className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="text-3xl font-extrabold text-sage-700 font-['Outfit']">
              {currentMetrics.biogasProducedM3.toLocaleString()}
            </span>
            <span className="text-xs font-semibold text-charcoal-500 ml-1.5">m³ Raw Biogas</span>
          </div>
          <p className="text-xs text-charcoal-500 pt-1 border-t border-navy-50">
            Equivalent to <strong>{cngCylinderEquivalent.toLocaleString()} kg</strong> compressed Bio-CNG vehicle fuel.
          </p>
        </div>

        {/* Card 3: Grid Tariff Revenue */}
        <div className="p-5 rounded-2xl bg-white border border-navy-100 shadow-blueprint space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-charcoal-400">Grid Feed-in Tariff</span>
            <div className="w-8 h-8 rounded-lg bg-navy-100 text-navy-700 flex items-center justify-center">
              <Coins className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="text-3xl font-extrabold text-navy-800 font-['Outfit']">
              ₹{(currentMetrics.energyGeneratedMwh * 1000 * config.electricityTariffInrPerKwh / 100000).toFixed(2)}
            </span>
            <span className="text-xs font-semibold text-charcoal-500 ml-1.5">Lakh</span>
          </div>
          <p className="text-xs text-charcoal-500 pt-1 border-t border-navy-50">
            At municipal feed-in tariff of ₹{config.electricityTariffInrPerKwh}/kWh to MSEDCL grid.
          </p>
        </div>

      </div>

    </div>
  );
};
