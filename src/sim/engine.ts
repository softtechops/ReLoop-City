// ============================================================================
// RELOOP SIMULATION ENGINE
// Simulates hourly waste generation, baseline vs ReLoop collection,
// resource recovery mass balance, energy yields, and financial generation.
// ============================================================================

import { DEFAULT_CONFIG, ConfigState, PILOT_ZONES } from '../config/config';
import { SmartBin, StreamBreakdown, SimulationTimeStep } from '../types';
import { SeededPRNG } from './prng';
import { generateInitialBins } from './binsGenerator';

export interface SimulationState {
  currentHour: number; // 0 - 23
  currentDay: number; // 1 - 30
  currentDayOfWeekIndex: number; // 0 - 6 (0=Sun, 1=Mon, ..., 6=Sat)
  elapsedSimulationHours: number;
  bins: SmartBin[];
  history: SimulationTimeStep[];
  baselineCumulative: StreamBreakdown;
  reloopCumulative: StreamBreakdown;
  todayBaseline: StreamBreakdown;
  todayReloop: StreamBreakdown;
}

const DAYS_OF_WEEK = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export function createInitialSimulationState(config: ConfigState = DEFAULT_CONFIG, seed: number = 422026): SimulationState {
  const bins = generateInitialBins(seed);
  
  // Initial baseline cumulative state (simulating 14 days of prior operation)
  const baselineCumulative: StreamBreakdown = {
    collectedTonnes: 148.4,
    recycledTonnes: 16.2, // Low in baseline due to contamination & unsegregated pickup
    compostedTonnes: 14.5,
    energyRecoveredTonnes: 6.8,
    cdAggregateTonnes: 4.1,
    landfillAvoidedTonnes: 41.6,
    landfilledTonnes: 106.8, // High landfilling in baseline (72.0%)
    landfillDiversionRatePercent: 28.0,
    energyGeneratedMwh: 14.2,
    biogasProducedM3: 6760,
    revenueGeneratedInr: 1845000,
    co2AvoidedTonnes: 38.6,
    overflowEventsCount: 42,
  };

  // Initial ReLoop AI-optimized cumulative state (dramatic improvement)
  const reloopCumulative: StreamBreakdown = {
    collectedTonnes: 162.8,
    recycledTonnes: 49.6, // High pure sorting
    compostedTonnes: 54.2,
    energyRecoveredTonnes: 33.8,
    cdAggregateTonnes: 17.2,
    landfillAvoidedTonnes: 154.8,
    landfilledTonnes: 8.0, // Only 4.9% residual to landfill!
    landfillDiversionRatePercent: 95.1,
    energyGeneratedMwh: 71.0,
    biogasProducedM3: 33810,
    revenueGeneratedInr: 3420000,
    co2AvoidedTonnes: 146.5,
    overflowEventsCount: 1, // Almost zero overflows
  };

  const todayBaseline: StreamBreakdown = {
    collectedTonnes: 10.4,
    recycledTonnes: 1.1,
    compostedTonnes: 1.0,
    energyRecoveredTonnes: 0.5,
    cdAggregateTonnes: 0.3,
    landfillAvoidedTonnes: 2.9,
    landfilledTonnes: 7.5, // 72% landfilled
    landfillDiversionRatePercent: 28.0,
    energyGeneratedMwh: 1.0,
    biogasProducedM3: 476,
    revenueGeneratedInr: 128000,
    co2AvoidedTonnes: 2.7,
    overflowEventsCount: 3,
  };

  const todayReloop: StreamBreakdown = {
    collectedTonnes: 11.6,
    recycledTonnes: 3.5,
    compostedTonnes: 3.9,
    energyRecoveredTonnes: 2.4,
    cdAggregateTonnes: 1.2,
    landfillAvoidedTonnes: 11.0,
    landfilledTonnes: 0.6,
    landfillDiversionRatePercent: 94.8,
    energyGeneratedMwh: 5.1,
    biogasProducedM3: 2428,
    revenueGeneratedInr: 244500,
    co2AvoidedTonnes: 10.4,
    overflowEventsCount: 0,
  };

  // Generate initial 12 history points for charts
  const history: SimulationTimeStep[] = [];
  for (let i = 11; i >= 0; i--) {
    const hour = (14 - i + 24) % 24;
    history.push({
      hour,
      day: 1,
      dayOfWeek: DAYS_OF_WEEK[2],
      timestamp: `${String(hour).padStart(2, '0')}:00`,
      totalCityFillAverage: 54 + Math.round(Math.sin(i * 0.7) * 8),
      baseline: {
        ...todayBaseline,
        collectedTonnes: Number((todayBaseline.collectedTonnes * (1 - i * 0.04)).toFixed(2)),
        recycledTonnes: Number((todayBaseline.recycledTonnes * (1 - i * 0.04)).toFixed(2)),
        energyGeneratedMwh: Number((todayBaseline.energyGeneratedMwh * (1 - i * 0.04)).toFixed(2)),
        landfillAvoidedTonnes: Number((todayBaseline.landfillAvoidedTonnes * (1 - i * 0.04)).toFixed(2)),
      },
      reloop: {
        ...todayReloop,
        collectedTonnes: Number((todayReloop.collectedTonnes * (1 - i * 0.035)).toFixed(2)),
        recycledTonnes: Number((todayReloop.recycledTonnes * (1 - i * 0.035)).toFixed(2)),
        energyGeneratedMwh: Number((todayReloop.energyGeneratedMwh * (1 - i * 0.035)).toFixed(2)),
        landfillAvoidedTonnes: Number((todayReloop.landfillAvoidedTonnes * (1 - i * 0.035)).toFixed(2)),
      },
    });
  }

  return {
    currentHour: 14,
    currentDay: 1,
    currentDayOfWeekIndex: 2, // Tuesday
    elapsedSimulationHours: 14,
    bins,
    history,
    baselineCumulative,
    reloopCumulative,
    todayBaseline,
    todayReloop,
  };
}

/**
 * Step the simulation forward by 1 hour
 */
export function stepSimulation(
  state: SimulationState,
  config: ConfigState = DEFAULT_CONFIG,
  prng: SeededPRNG = new SeededPRNG()
): SimulationState {
  const nextHour = (state.currentHour + 1) % 24;
  const isNewDay = nextHour === 0;
  const nextDay = isNewDay ? state.currentDay + 1 : state.currentDay;
  const nextDayOfWeekIndex = isNewDay
    ? (state.currentDayOfWeekIndex + 1) % 7
    : state.currentDayOfWeekIndex;
  const elapsed = state.elapsedSimulationHours + 1;

  // Clone bins and advance fill rates
  const updatedBins: SmartBin[] = state.bins.map((bin) => {
    const zone = PILOT_ZONES.find((z) => z.id === bin.zoneId);
    const baseRate = zone ? zone.baseHourlyRateKg : 3.0;

    // Diurnal factor for this hour
    let diurnal = 1.0;
    if (nextHour >= 7 && nextHour <= 10) diurnal = 1.8;
    else if (nextHour >= 18 && nextHour <= 21) diurnal = 1.9;
    else if (nextHour >= 0 && nextHour <= 5) diurnal = 0.25;

    const addedKg = baseRate * diurnal * prng.nextRange(0.75, 1.3);
    let newCurrentKg = bin.currentKg + addedKg;
    let newFillPercent = Math.min(100, Math.round((newCurrentKg / bin.capacityKg) * 100));

    // Handle automated collection in ReLoop:
    // If bin is >= 78% full, a dynamic truck empties it down to ~4%
    let isCollectedThisHour = false;
    if (newFillPercent >= config.dispatchFillThreshold) {
      // 90% chance collected in ReLoop if scheduled
      if (prng.next() < 0.90) {
        newFillPercent = prng.nextInt(3, 7);
        newCurrentKg = Number(((newFillPercent / 100) * bin.capacityKg).toFixed(1));
        isCollectedThisHour = true;
      }
    }

    const isOverflowing = newFillPercent >= 98;
    const remainingKg = Math.max(0, bin.capacityKg - newCurrentKg);
    const predictedHoursToFull = Number((remainingKg / Math.max(0.4, baseRate * diurnal)).toFixed(1));

    const updatedHist = [...bin.history.slice(-11), newFillPercent];

    return {
      ...bin,
      fillPercent: newFillPercent,
      currentKg: Number(newCurrentKg.toFixed(1)),
      predictedHoursToFull,
      isOverflowing,
      isScheduledForPickup: newFillPercent >= config.dispatchFillThreshold,
      lastCollectedHour: isCollectedThisHour ? nextHour : bin.lastCollectedHour,
      history: updatedHist,
    };
  });

  // Calculate city-wide generation & recovery increments for this hour
  const hourlyCollectedTonnes = Number((prng.nextRange(0.45, 0.75)).toFixed(2));
  
  // ReLoop stream increments (AI sorting efficiency ~95%)
  const reloopOrganic = hourlyCollectedTonnes * 0.48;
  const reloopRecyclable = hourlyCollectedTonnes * 0.32;
  const reloopCd = hourlyCollectedTonnes * 0.11;
  const reloopEnergyTonnes = reloopOrganic * 0.55; // Biogas & RDF
  const reloopCompostTonnes = reloopOrganic * config.compostYieldFactor;
  const reloopLandfillTonnes = hourlyCollectedTonnes * 0.05; // Only 5% to landfill
  const reloopLandfillAvoided = hourlyCollectedTonnes - reloopLandfillTonnes;

  const reloopBiogasM3 = reloopOrganic * config.biogasYieldPerTonneOrganic;
  const reloopMwh = Number(((reloopBiogasM3 * config.kwhPerCubicMeterBiogas) / 1000).toFixed(3));
  
  const reloopRevenue = 
    (reloopMwh * 1000 * config.electricityTariffInrPerKwh) +
    (reloopCompostTonnes * config.compostPriceInrPerTonne) +
    (reloopRecyclable * 0.4 * config.plasticPelletPriceInrPerTonne) +
    (reloopRecyclable * 0.3 * config.paperPulpPriceInrPerTonne) +
    (reloopRecyclable * 0.15 * config.metalScrapPriceInrPerTonne) +
    (reloopCd * config.cdAggregatesPriceInrPerTonne) +
    (reloopRecyclable * config.eprCreditPriceInrPerTonne);

  const reloopCo2Avoided = 
    (reloopRecyclable * config.kgCo2eAvoidedPerTonneRecycled / 1000) +
    (reloopCompostTonnes * config.kgCo2eAvoidedPerTonneComposted / 1000) +
    (reloopMwh * config.kgCo2eAvoidedPerMwhCleanEnergy / 1000);

  // Baseline stream increments (Fixed unsegregated routes, lower recovery ~28%)
  const baselineCollected = hourlyCollectedTonnes * 0.92;
  const baselineRecyclable = baselineCollected * 0.11; // contaminated
  const baselineCompost = baselineCollected * 0.10;
  const baselineEnergy = baselineCollected * 0.04;
  const baselineCd = baselineCollected * 0.03;
  const baselineLandfill = baselineCollected * 0.72; // 72% dumped in landfill
  const baselineLandfillAvoided = baselineCollected - baselineLandfill; // 28%
  const baselineBiogasM3 = baselineCompost * config.biogasYieldPerTonneOrganic * 0.65;
  const baselineMwh = Number(((baselineBiogasM3 * config.kwhPerCubicMeterBiogas) / 1000).toFixed(3));
  const baselineRevenue = reloopRevenue * 0.48;
  const baselineCo2Avoided = reloopCo2Avoided * 0.30;

  const newReloopCum: StreamBreakdown = {
    collectedTonnes: Number((state.reloopCumulative.collectedTonnes + hourlyCollectedTonnes).toFixed(2)),
    recycledTonnes: Number((state.reloopCumulative.recycledTonnes + reloopRecyclable).toFixed(2)),
    compostedTonnes: Number((state.reloopCumulative.compostedTonnes + reloopCompostTonnes).toFixed(2)),
    energyRecoveredTonnes: Number((state.reloopCumulative.energyRecoveredTonnes + reloopEnergyTonnes).toFixed(2)),
    cdAggregateTonnes: Number((state.reloopCumulative.cdAggregateTonnes + reloopCd).toFixed(2)),
    landfillAvoidedTonnes: Number((state.reloopCumulative.landfillAvoidedTonnes + reloopLandfillAvoided).toFixed(2)),
    landfilledTonnes: Number((state.reloopCumulative.landfilledTonnes + reloopLandfillTonnes).toFixed(2)),
    landfillDiversionRatePercent: 95.2,
    energyGeneratedMwh: Number((state.reloopCumulative.energyGeneratedMwh + reloopMwh).toFixed(2)),
    biogasProducedM3: Math.round(state.reloopCumulative.biogasProducedM3 + reloopBiogasM3),
    revenueGeneratedInr: Math.round(state.reloopCumulative.revenueGeneratedInr + reloopRevenue),
    co2AvoidedTonnes: Number((state.reloopCumulative.co2AvoidedTonnes + reloopCo2Avoided).toFixed(2)),
    overflowEventsCount: state.reloopCumulative.overflowEventsCount + (updatedBins.filter(b => b.isOverflowing).length > 2 ? 1 : 0),
  };

  const newBaselineCum: StreamBreakdown = {
    collectedTonnes: Number((state.baselineCumulative.collectedTonnes + baselineCollected).toFixed(2)),
    recycledTonnes: Number((state.baselineCumulative.recycledTonnes + baselineRecyclable).toFixed(2)),
    compostedTonnes: Number((state.baselineCumulative.compostedTonnes + baselineCompost).toFixed(2)),
    energyRecoveredTonnes: Number((state.baselineCumulative.energyRecoveredTonnes + baselineEnergy).toFixed(2)),
    cdAggregateTonnes: Number((state.baselineCumulative.cdAggregateTonnes + baselineCd).toFixed(2)),
    landfillAvoidedTonnes: Number((state.baselineCumulative.landfillAvoidedTonnes + baselineLandfillAvoided).toFixed(2)),
    landfilledTonnes: Number((state.baselineCumulative.landfilledTonnes + baselineLandfill).toFixed(2)),
    landfillDiversionRatePercent: 28.0,
    energyGeneratedMwh: Number((state.baselineCumulative.energyGeneratedMwh + baselineMwh).toFixed(2)),
    biogasProducedM3: Math.round(state.baselineCumulative.biogasProducedM3 + baselineBiogasM3),
    revenueGeneratedInr: Math.round(state.baselineCumulative.revenueGeneratedInr + baselineRevenue),
    co2AvoidedTonnes: Number((state.baselineCumulative.co2AvoidedTonnes + baselineCo2Avoided).toFixed(2)),
    overflowEventsCount: state.baselineCumulative.overflowEventsCount + (nextHour % 4 === 0 ? 1 : 0),
  };

  // Update today's figures
  const newTodayReloop: StreamBreakdown = isNewDay
    ? { ...newReloopCum, collectedTonnes: 0, recycledTonnes: 0, compostedTonnes: 0, energyRecoveredTonnes: 0, cdAggregateTonnes: 0, landfillAvoidedTonnes: 0, landfilledTonnes: 0, energyGeneratedMwh: 0, biogasProducedM3: 0, revenueGeneratedInr: 0, co2AvoidedTonnes: 0, overflowEventsCount: 0 }
    : {
        ...state.todayReloop,
        collectedTonnes: Number((state.todayReloop.collectedTonnes + hourlyCollectedTonnes).toFixed(2)),
        recycledTonnes: Number((state.todayReloop.recycledTonnes + reloopRecyclable).toFixed(2)),
        compostedTonnes: Number((state.todayReloop.compostedTonnes + reloopCompostTonnes).toFixed(2)),
        energyRecoveredTonnes: Number((state.todayReloop.energyRecoveredTonnes + reloopEnergyTonnes).toFixed(2)),
        cdAggregateTonnes: Number((state.todayReloop.cdAggregateTonnes + reloopCd).toFixed(2)),
        landfillAvoidedTonnes: Number((state.todayReloop.landfillAvoidedTonnes + reloopLandfillAvoided).toFixed(2)),
        landfilledTonnes: Number((state.todayReloop.landfilledTonnes + reloopLandfillTonnes).toFixed(2)),
        energyGeneratedMwh: Number((state.todayReloop.energyGeneratedMwh + reloopMwh).toFixed(2)),
        biogasProducedM3: Math.round(state.todayReloop.biogasProducedM3 + reloopBiogasM3),
        revenueGeneratedInr: Math.round(state.todayReloop.revenueGeneratedInr + reloopRevenue),
        co2AvoidedTonnes: Number((state.todayReloop.co2AvoidedTonnes + reloopCo2Avoided).toFixed(2)),
      };

  const newTodayBaseline: StreamBreakdown = isNewDay
    ? { ...newBaselineCum, collectedTonnes: 0, recycledTonnes: 0, compostedTonnes: 0, energyRecoveredTonnes: 0, cdAggregateTonnes: 0, landfillAvoidedTonnes: 0, landfilledTonnes: 0, energyGeneratedMwh: 0, biogasProducedM3: 0, revenueGeneratedInr: 0, co2AvoidedTonnes: 0, overflowEventsCount: 0 }
    : {
        ...state.todayBaseline,
        collectedTonnes: Number((state.todayBaseline.collectedTonnes + baselineCollected).toFixed(2)),
        recycledTonnes: Number((state.todayBaseline.recycledTonnes + baselineRecyclable).toFixed(2)),
        compostedTonnes: Number((state.todayBaseline.compostedTonnes + baselineCompost).toFixed(2)),
        energyRecoveredTonnes: Number((state.todayBaseline.energyRecoveredTonnes + baselineEnergy).toFixed(2)),
        cdAggregateTonnes: Number((state.todayBaseline.cdAggregateTonnes + baselineCd).toFixed(2)),
        landfillAvoidedTonnes: Number((state.todayBaseline.landfillAvoidedTonnes + baselineLandfillAvoided).toFixed(2)),
        landfilledTonnes: Number((state.todayBaseline.landfilledTonnes + baselineLandfill).toFixed(2)),
        energyGeneratedMwh: Number((state.todayBaseline.energyGeneratedMwh + baselineMwh).toFixed(2)),
        biogasProducedM3: Math.round(state.todayBaseline.biogasProducedM3 + baselineBiogasM3),
        revenueGeneratedInr: Math.round(state.todayBaseline.revenueGeneratedInr + baselineRevenue),
        co2AvoidedTonnes: Number((state.todayBaseline.co2AvoidedTonnes + baselineCo2Avoided).toFixed(2)),
        overflowEventsCount: state.todayBaseline.overflowEventsCount + (nextHour % 5 === 0 ? 1 : 0),
      };

  const avgCityFill = Math.round(
    updatedBins.reduce((sum, b) => sum + b.fillPercent, 0) / updatedBins.length
  );

  const newHistoryPoint: SimulationTimeStep = {
    hour: nextHour,
    day: nextDay,
    dayOfWeek: DAYS_OF_WEEK[nextDayOfWeekIndex],
    timestamp: `${String(nextHour).padStart(2, '0')}:00`,
    totalCityFillAverage: avgCityFill,
    baseline: { ...newTodayBaseline },
    reloop: { ...newTodayReloop },
  };

  const newHistory = [...state.history.slice(-15), newHistoryPoint];

  return {
    currentHour: nextHour,
    currentDay: nextDay,
    currentDayOfWeekIndex: nextDayOfWeekIndex,
    elapsedSimulationHours: elapsed,
    bins: updatedBins,
    history: newHistory,
    baselineCumulative: newBaselineCum,
    reloopCumulative: newReloopCum,
    todayBaseline: newTodayBaseline,
    todayReloop: newTodayReloop,
  };
}
