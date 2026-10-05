// ============================================================================
// RELOOP SCENARIO ENGINE & COMPARISON UTILITIES
// Computes operational, environmental, and financial outcomes for custom
// municipal scenario configurations without mutating the default config.
// ============================================================================

import { ConfigState, DEFAULT_CONFIG } from '../config/config';
import { SimulationState } from '../sim/engine';
import { PILOT_30DAY_SNAPSHOT, ScenarioMetrics, calculateDelta, DeltaMetric } from './metrics';

export interface ScenarioRowComparison {
  key: string;
  label: string;
  unit: string;
  higherIsBetter: boolean;
  baselineValue: number;
  baselineFormatted: string;
  defaultReloopValue: number;
  defaultReloopFormatted: string;
  myScenarioValue: number;
  myScenarioFormatted: string;
  deltaVsBaseline: DeltaMetric;
  deltaVsDefault: DeltaMetric;
  bestScenario: 'baseline' | 'default' | 'custom';
}

/**
 * Runs a deterministic simulation calculation for a candidate config state,
 * leveraging baseline snapshot and scaling parameters accurately.
 */
export function simulateScenarioMetrics(
  simState: SimulationState,
  configOverrides: Partial<ConfigState>
): ScenarioMetrics {
  const mergedConfig: ConfigState = { ...DEFAULT_CONFIG, ...configOverrides };

  // Base references from 30-day calibrated pilot
  const baseTonnage = PILOT_30DAY_SNAPSHOT.reloop.collectedTonnes; // 162.8 t
  const trucks = Math.max(2, Math.min(8, mergedConfig.numberOfTrucks || 4));
  const threshold = Math.max(0.5, Math.min(0.95, mergedConfig.dispatchFillThreshold || 0.75));
  const capacity = Math.max(2.5, Math.min(8.0, mergedConfig.truckCapacityTonnes || 4.5));
  const biogasYield = Math.max(60, Math.min(180, mergedConfig.biogasYieldPerTonneOrganic || 110));
  const tariff = Math.max(4.0, Math.min(12.0, mergedConfig.electricityTariffInrPerKwh || 6.8));

  // 1. Landfill Diversion Rate
  // Lower dispatch threshold catches more bins before overflow; more trucks provide higher coverage
  let diversion = 95.1;
  diversion += (0.75 - threshold) * 8.0; // threshold 0.70 -> +0.4 pts; threshold 0.85 -> -0.8 pts
  diversion += (trucks - 4) * 0.4;
  diversion = Math.max(88.0, Math.min(97.8, Number(diversion.toFixed(1))));

  const collectedTonnes = baseTonnage;
  const landfilledTonnes = Number((collectedTonnes * (1 - diversion / 100)).toFixed(1));
  const landfillAvoidedTonnes = Number((collectedTonnes - landfilledTonnes).toFixed(1));

  // 2. Fleet Distance (km)
  // Base default is 965.6 km for 4 trucks, 75% threshold, 4.5 t cap
  // Lower threshold = more dispatches = higher km
  // Higher truck capacity = fewer dumps = lower km
  // More trucks = more coverage = higher total fleet km
  const defaultKm = 965.6;
  const truckFactor = 1 + (trucks - 4) * 0.09;
  const thresholdFactor = 1 + (0.75 - threshold) * 0.6; // e.g. 70% threshold adds 3% km; 80% saves 3%
  const capacityFactor = Math.pow(4.5 / capacity, 0.4); // e.g. 6t capacity reduces km by ~10%
  const routeKm = Number((defaultKm * truckFactor * thresholdFactor * capacityFactor).toFixed(1));

  // 3. Fuel Cost (₹)
  const fuelLiters = routeKm / mergedConfig.truckFuelEfficiencyKmPerLiter;
  const fuelCostInr = Math.round(fuelLiters * mergedConfig.dieselPriceInrPerLiter);

  // 4. Clean Energy Generated (MWh)
  // Food waste / organic fraction is ~48% of collected tonnage = ~78.1 t
  const organicTonnes = collectedTonnes * 0.48;
  const biogasM3 = organicTonnes * biogasYield;
  const energyMwh = Number(((biogasM3 * mergedConfig.kwhPerCubicMeterBiogas) / 1000).toFixed(1));

  // 5. Circular Revenue (₹)
  // Material revenue (polymers, compost, scrap, EPR) ~ ₹29,37,200
  // Plus electricity: energyMwh * 1000 * tariff
  const electricityRevenue = Math.round(energyMwh * 1000 * tariff);
  const nonElectricityRevenue = 2937200;
  const revenueInr = nonElectricityRevenue + electricityRevenue;

  // 6. CO2 Avoided (t)
  // Recycling offset + Compost offset + Clean energy offset (0.820 t CO2/MWh)
  const baseMaterialCo2 = 88.3; // recycled and composted offset
  const energyCo2 = Number(((energyMwh * mergedConfig.kgCo2eAvoidedPerMwhCleanEnergy) / 1000).toFixed(1));
  const dieselSavedCo2 = Number((((1420 - routeKm) / 3.2 * 2.68) / 1000).toFixed(1));
  const co2AvoidedTonnes = Number((baseMaterialCo2 + energyCo2 + dieselSavedCo2).toFixed(1));

  // Overflow events
  let overflowEvents = 1;
  if (trucks < 3 || threshold > 0.85) overflowEvents = 5;
  if (trucks >= 5 && threshold <= 0.70) overflowEvents = 0;

  return {
    collectedTonnes,
    recycledTonnes: Number((collectedTonnes * 0.305).toFixed(1)),
    compostedTonnes: Number((collectedTonnes * 0.333).toFixed(1)),
    landfillAvoidedTonnes,
    landfilledTonnes,
    diversionRatePercent: diversion,
    energyMwh,
    revenueInr,
    co2AvoidedTonnes,
    routeKm,
    overflowEvents,
    fuelCostInr,
  };
}

/**
 * Computes plain-language takeaway sentence based on comparison to default ReLoop.
 */
export function generateScenarioTakeaway(
  customConfig: Partial<ConfigState>,
  customMetrics: ScenarioMetrics,
  defaultMetrics: ScenarioMetrics = PILOT_30DAY_SNAPSHOT.reloop
): string {
  const trucks = customConfig.numberOfTrucks ?? DEFAULT_CONFIG.numberOfTrucks;
  const thresholdPct = Math.round((customConfig.dispatchFillThreshold ?? DEFAULT_CONFIG.dispatchFillThreshold) * 100);

  const diversionDiff = customMetrics.diversionRatePercent - defaultMetrics.diversionRatePercent;
  const fuelCostPct = Math.round(((customMetrics.fuelCostInr - defaultMetrics.fuelCostInr) / defaultMetrics.fuelCostInr) * 100);
  const energyDiff = customMetrics.energyMwh - defaultMetrics.energyMwh;
  const revenueDiff = customMetrics.revenueInr - defaultMetrics.revenueInr;

  const diversionPart = diversionDiff >= 0.1
    ? `diversion rises to ${customMetrics.diversionRatePercent.toFixed(1)}% (+${diversionDiff.toFixed(1)} pts)`
    : diversionDiff <= -0.1
    ? `diversion shifts to ${customMetrics.diversionRatePercent.toFixed(1)}% (${diversionDiff.toFixed(1)} pts)`
    : `diversion holds steady at ${customMetrics.diversionRatePercent.toFixed(1)}%`;

  let tradeOffPart = '';
  if (fuelCostPct > 0) {
    tradeOffPart = `fuel cost increases by ${fuelCostPct}%`;
  } else if (fuelCostPct < 0) {
    tradeOffPart = `fuel cost decreases by ${Math.abs(fuelCostPct)}%`;
  } else {
    tradeOffPart = `fleet cost remains identical`;
  }

  let secondaryPart = '';
  if (energyDiff > 3) {
    secondaryPart = `, yielding +${energyDiff.toFixed(0)} MWh clean electricity`;
  } else if (revenueDiff > 50000) {
    secondaryPart = `, lifting circular revenue by ₹${(revenueDiff / 100000).toFixed(1)} Lakh`;
  }

  return `With ${trucks} trucks and a ${thresholdPct}% dispatch threshold, ${diversionPart} while ${tradeOffPart}${secondaryPart}.`;
}

/**
 * Builds the 6-row side-by-side comparison data between Baseline, Default ReLoop, and Custom Scenario.
 */
export function buildScenarioComparisonRows(
  customMetrics: ScenarioMetrics,
  baselineMetrics: ScenarioMetrics = PILOT_30DAY_SNAPSHOT.baseline,
  defaultMetrics: ScenarioMetrics = PILOT_30DAY_SNAPSHOT.reloop
): ScenarioRowComparison[] {
  const rows: {
    key: string;
    label: string;
    unit: string;
    higherIsBetter: boolean;
    format: (v: number) => string;
    baseline: number;
    defaultVal: number;
    custom: number;
    isPts?: boolean;
  }[] = [
    {
      key: 'diversion',
      label: 'Landfill Diversion Rate',
      unit: '%',
      higherIsBetter: true,
      format: (v) => `${v.toFixed(1)}%`,
      baseline: baselineMetrics.diversionRatePercent,
      defaultVal: defaultMetrics.diversionRatePercent,
      custom: customMetrics.diversionRatePercent,
      isPts: true,
    },
    {
      key: 'distance',
      label: 'Fleet Route Distance',
      unit: 'km',
      higherIsBetter: false,
      format: (v) => `${v.toLocaleString('en-IN')} km`,
      baseline: baselineMetrics.routeKm,
      defaultVal: defaultMetrics.routeKm,
      custom: customMetrics.routeKm,
    },
    {
      key: 'fuelCost',
      label: 'Fleet Fuel Cost',
      unit: '₹',
      higherIsBetter: false,
      format: (v) => `₹${v.toLocaleString('en-IN')}`,
      baseline: baselineMetrics.fuelCostInr,
      defaultVal: defaultMetrics.fuelCostInr,
      custom: customMetrics.fuelCostInr,
    },
    {
      key: 'energy',
      label: 'Clean Energy Generated',
      unit: 'MWh',
      higherIsBetter: true,
      format: (v) => `${v.toFixed(1)} MWh`,
      baseline: baselineMetrics.energyMwh,
      defaultVal: defaultMetrics.energyMwh,
      custom: customMetrics.energyMwh,
    },
    {
      key: 'revenue',
      label: 'Gross Circular Revenue',
      unit: '₹',
      higherIsBetter: true,
      format: (v) => `₹${(v / 100000).toFixed(1)} Lakh`,
      baseline: baselineMetrics.revenueInr,
      defaultVal: defaultMetrics.revenueInr,
      custom: customMetrics.revenueInr,
    },
    {
      key: 'co2',
      label: 'CO₂ Avoided',
      unit: 't',
      higherIsBetter: true,
      format: (v) => `${v.toFixed(1)} t`,
      baseline: baselineMetrics.co2AvoidedTonnes,
      defaultVal: defaultMetrics.co2AvoidedTonnes,
      custom: customMetrics.co2AvoidedTonnes,
    },
  ];

  return rows.map((r) => {
    // Determine which scenario has the best value
    let bestScenario: 'baseline' | 'default' | 'custom' = 'default';
    if (r.higherIsBetter) {
      if (r.custom >= r.defaultVal && r.custom >= r.baseline) {
        bestScenario = 'custom';
      } else if (r.defaultVal >= r.custom && r.defaultVal >= r.baseline) {
        bestScenario = 'default';
      } else {
        bestScenario = 'baseline';
      }
    } else {
      if (r.custom <= r.defaultVal && r.custom <= r.baseline) {
        bestScenario = 'custom';
      } else if (r.defaultVal <= r.custom && r.defaultVal <= r.baseline) {
        bestScenario = 'default';
      } else {
        bestScenario = 'baseline';
      }
    }

    return {
      key: r.key,
      label: r.label,
      unit: r.unit,
      higherIsBetter: r.higherIsBetter,
      baselineValue: r.baseline,
      baselineFormatted: r.format(r.baseline),
      defaultReloopValue: r.defaultVal,
      defaultReloopFormatted: r.format(r.defaultVal),
      myScenarioValue: r.custom,
      myScenarioFormatted: r.format(r.custom),
      deltaVsBaseline: calculateDelta(r.custom, r.baseline, !!r.isPts),
      deltaVsDefault: calculateDelta(r.custom, r.defaultVal, !!r.isPts),
      bestScenario,
    };
  });
}
