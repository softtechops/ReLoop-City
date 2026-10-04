// ============================================================================
// SMART BINS GENERATOR FOR PUNE PILOT REGION
// Generates 100 realistic geo-located smart IoT bins across 5 pilot zones
// ============================================================================

import { PILOT_ZONES, DEFAULT_CONFIG } from '../config/config';
import { SmartBin, WasteStreamType } from '../types';
import { SeededPRNG } from './prng';

export function generateInitialBins(seed: number = 422026): SmartBin[] {
  const prng = new SeededPRNG(seed);
  const bins: SmartBin[] = [];

  let globalIndex = 1;

  for (const zone of PILOT_ZONES) {
    for (let i = 0; i < zone.binCount; i++) {
      const id = `BIN-${zone.id.substring(0, 3).toUpperCase()}-${String(globalIndex).padStart(3, '0')}`;
      globalIndex++;

      // Scatter coordinates around zone center (jitter ~0.003 - 0.008 deg, approx 300-800m)
      const radiusKm = prng.nextRange(0.15, 0.75);
      const angle = prng.nextRange(0, Math.PI * 2);
      // 1 deg lat ~ 111 km, 1 deg lng ~ 105 km in Pune
      const latOffset = (radiusKm * Math.cos(angle)) / 111;
      const lngOffset = (radiusKm * Math.sin(angle)) / 105;

      const lat = Number((zone.center[0] + latOffset).toFixed(6));
      const lng = Number((zone.center[1] + lngOffset).toFixed(6));

      // Initial fill level distribution:
      // ~60% under 50% (green), ~25% 50-80% (amber), ~15% >80% (red/critical)
      const roll = prng.next();
      let fillPercent: number;
      if (roll < 0.55) {
        fillPercent = prng.nextInt(15, 48);
      } else if (roll < 0.82) {
        fillPercent = prng.nextInt(52, 78);
      } else {
        fillPercent = prng.nextInt(81, 96);
      }

      // Determine primary stream based on zone composition
      const comp = { ...zone.composition };
      // Add slight jitter to composition per bin
      const jitterOrganic = Math.max(5, comp.organic + prng.nextInt(-6, 6));
      const jitterRecyclable = Math.max(5, comp.recyclable + prng.nextInt(-5, 5));
      const jitterCd = Math.max(0, comp.cdWaste + prng.nextInt(-3, 3));
      const jitterEwaste = Math.max(0, comp.eWaste + prng.nextInt(-2, 2));
      const jitterResidual = Math.max(5, comp.residual + prng.nextInt(-3, 3));
      const totalComp = jitterOrganic + jitterRecyclable + jitterCd + jitterEwaste + jitterResidual;

      const normalizedComp = {
        organic: Math.round((jitterOrganic / totalComp) * 100),
        recyclable: Math.round((jitterRecyclable / totalComp) * 100),
        cdWaste: Math.round((jitterCd / totalComp) * 100),
        eWaste: Math.round((jitterEwaste / totalComp) * 100),
        residual: Math.round((jitterResidual / totalComp) * 100),
      };

      // Fix rounding sum
      const compSum = normalizedComp.organic + normalizedComp.recyclable + normalizedComp.cdWaste + normalizedComp.eWaste + normalizedComp.residual;
      normalizedComp.residual += (100 - compSum);

      // Primary stream is highest percentage
      let primaryStream: WasteStreamType = 'organic';
      let maxStreamVal = normalizedComp.organic;

      if (normalizedComp.recyclable > maxStreamVal) {
        primaryStream = 'recyclable';
        maxStreamVal = normalizedComp.recyclable;
      }
      if (normalizedComp.cdWaste > maxStreamVal) {
        primaryStream = 'cdWaste';
        maxStreamVal = normalizedComp.cdWaste;
      }
      if (normalizedComp.eWaste > maxStreamVal) {
        primaryStream = 'eWaste';
        maxStreamVal = normalizedComp.eWaste;
      }

      const capacityKg = DEFAULT_CONFIG.binCapacityKg;
      const currentKg = Number(((fillPercent / 100) * capacityKg).toFixed(1));

      // Calculate initial predicted hours to full based on average hourly rate
      const avgRateKgPerHour = zone.baseHourlyRateKg * prng.nextRange(0.8, 1.25);
      const remainingKg = Math.max(0, capacityKg - currentKg);
      const predictedHoursToFull = Number((remainingKg / Math.max(0.5, avgRateKgPerHour)).toFixed(1));

      // Simulated history: 8 previous readings
      const history: number[] = [];
      let histVal = Math.max(5, fillPercent - prng.nextInt(20, 35));
      for (let h = 0; h < 8; h++) {
        history.push(Math.round(histVal));
        histVal += (fillPercent - histVal) / (8 - h) + prng.nextRange(-2, 4);
        histVal = Math.max(5, Math.min(99, histVal));
      }
      history.push(fillPercent);

      bins.push({
        id,
        name: `${zone.name.split(':')[1]?.trim() || zone.name} Bin #${i + 1}`,
        zoneId: zone.id,
        zoneName: zone.name,
        lat,
        lng,
        fillPercent,
        capacityKg,
        currentKg,
        primaryStream,
        composition: normalizedComp,
        predictedHoursToFull,
        isOverflowing: fillPercent >= 98,
        isScheduledForPickup: fillPercent >= DEFAULT_CONFIG.dispatchFillThreshold,
        lastCollectedHour: 0,
        history,
      });
    }
  }

  return bins;
}
