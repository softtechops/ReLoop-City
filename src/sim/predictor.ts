// ============================================================================
// PREDICTIVE ENGINE (AI FORECASTING LAYER)
// Multi-Zone Time-Series Generation Model: Diurnal + Day-of-Week Seasonality + Noise
// ============================================================================

import { PILOT_ZONES } from '../config/config';
import { SmartBin } from '../types';

export interface ZoneForecastPoint {
  hourOffset: number; // 1 to 72
  futureHourOfDay: number;
  timeLabel: string;
  residential: number; // kg or tonnes
  commercial: number;
  market: number;
  construction: number;
  institutional: number;
  totalTonnes: number;
  isPeak: boolean;
}

export interface HotspotItem {
  binId: string;
  binName: string;
  zoneName: string;
  currentFill: number;
  predictedHoursToFull: number;
  riskLevel: 'CRITICAL' | 'HIGH' | 'MODERATE' | 'LOW';
  primaryStream: string;
  overflowRiskProbability: number; // 0 - 100%
}

// Diurnal hourly multiplier (0 = midnight, 12 = noon, 18 = 6 PM)
function getDiurnalMultiplier(zoneId: string, hourOfDay: number): number {
  const h = hourOfDay % 24;

  if (zoneId === 'market-zone') {
    // Mandi peaks early morning 05:00 - 11:00
    if (h >= 4 && h <= 10) return 2.1;
    if (h >= 11 && h <= 15) return 1.4;
    if (h >= 16 && h <= 20) return 1.0;
    return 0.3;
  }

  if (zoneId === 'commercial-zone') {
    // Commercial peaks afternoon & evening 12:00 - 21:00
    if (h >= 11 && h <= 20) return 1.9;
    if (h >= 8 && h < 11) return 1.1;
    return 0.2;
  }

  if (zoneId === 'construction-zone') {
    // Construction daytime only 08:00 - 17:00
    if (h >= 8 && h <= 17) return 1.8;
    return 0.15;
  }

  if (zoneId === 'institutional-zone') {
    // Campus daytime 09:00 - 17:00
    if (h >= 9 && h <= 16) return 1.7;
    if (h >= 17 && h <= 20) return 0.8;
    return 0.25;
  }

  // Residential: twin peaks (morning 07:00-09:30 and evening 18:30-21:30)
  if ((h >= 7 && h <= 10) || (h >= 18 && h <= 21)) return 1.85;
  if (h >= 11 && h <= 17) return 0.9;
  return 0.25;
}

// Day of week multiplier (0 = Sun, 1 = Mon, ..., 6 = Sat)
function getDayMultiplier(zoneId: string, dayOfWeekIndex: number): number {
  const isWeekend = dayOfWeekIndex === 0 || dayOfWeekIndex === 6;
  if (zoneId === 'market-zone' && isWeekend) return 1.35;
  if (zoneId === 'commercial-zone' && isWeekend) return 1.4;
  if (zoneId === 'residential-zone' && isWeekend) return 1.25;
  if (zoneId === 'institutional-zone' && isWeekend) return 0.3; // campus quiet on weekends
  if (zoneId === 'construction-zone' && isWeekend) return 0.5;
  return 1.0;
}

/**
 * Generate 24 to 72 hours per-zone volume forecasts
 */
export function generateZoneForecasts(
  currentHour: number = 8,
  currentDayOfWeek: number = 2, // Tuesday default
  forecastHorizonHours: number = 48
): ZoneForecastPoint[] {
  const points: ZoneForecastPoint[] = [];

  for (let offset = 1; offset <= forecastHorizonHours; offset++) {
    const futureTotalHour = currentHour + offset;
    const futureHourOfDay = futureTotalHour % 24;
    const daysForward = Math.floor(futureTotalHour / 24);
    const futureDayOfWeek = (currentDayOfWeek + daysForward) % 7;

    const daysName = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const timeLabel = `+${offset}h (${daysName[futureDayOfWeek]} ${String(futureHourOfDay).padStart(2, '0')}:00)`;

    const zoneTonnage: Record<string, number> = {};
    let totalKg = 0;

    for (const zone of PILOT_ZONES) {
      const diurnal = getDiurnalMultiplier(zone.id, futureHourOfDay);
      const dayFactor = getDayMultiplier(zone.id, futureDayOfWeek);
      // Deterministic pseudo-random variation based on offset and zone
      const pseudoNoise = 1.0 + 0.12 * Math.sin(offset * 1.3 + zone.binCount);

      // Hourly kg generated across this entire zone
      const hourlyKg = zone.binCount * zone.baseHourlyRateKg * diurnal * dayFactor * pseudoNoise;
      zoneTonnage[zone.id] = Number((hourlyKg / 1000).toFixed(2));
      totalKg += hourlyKg;
    }

    const isPeak = futureHourOfDay >= 8 && futureHourOfDay <= 11;

    points.push({
      hourOffset: offset,
      futureHourOfDay,
      timeLabel,
      residential: zoneTonnage['residential-zone'] || 0,
      commercial: zoneTonnage['commercial-zone'] || 0,
      market: zoneTonnage['market-zone'] || 0,
      construction: zoneTonnage['construction-zone'] || 0,
      institutional: zoneTonnage['institutional-zone'] || 0,
      totalTonnes: Number((totalKg / 1000).toFixed(2)),
      isPeak,
    });
  }

  return points;
}

/**
 * Generate Hotspots & "Predicted Full in X Hours" List
 */
export function calculateHotspots(bins: SmartBin[]): HotspotItem[] {
  const items: HotspotItem[] = bins.map((bin) => {
    let riskLevel: 'CRITICAL' | 'HIGH' | 'MODERATE' | 'LOW' = 'LOW';
    let overflowRiskProbability = 10;

    if (bin.fillPercent >= 85 || bin.predictedHoursToFull <= 3) {
      riskLevel = 'CRITICAL';
      overflowRiskProbability = Math.min(99, Math.round(bin.fillPercent * 1.05));
    } else if (bin.fillPercent >= 70 || bin.predictedHoursToFull <= 6) {
      riskLevel = 'HIGH';
      overflowRiskProbability = Math.min(85, Math.round(bin.fillPercent * 0.95));
    } else if (bin.fillPercent >= 50 || bin.predictedHoursToFull <= 12) {
      riskLevel = 'MODERATE';
      overflowRiskProbability = Math.min(55, Math.round(bin.fillPercent * 0.7));
    } else {
      overflowRiskProbability = Math.max(5, Math.round(bin.fillPercent * 0.4));
    }

    return {
      binId: bin.id,
      binName: bin.name,
      zoneName: bin.zoneName,
      currentFill: bin.fillPercent,
      predictedHoursToFull: bin.predictedHoursToFull,
      riskLevel,
      primaryStream: bin.primaryStream,
      overflowRiskProbability,
    };
  });

  // Sort by highest risk / shortest time to full
  return items.sort((a, b) => a.predictedHoursToFull - b.predictedHoursToFull);
}
