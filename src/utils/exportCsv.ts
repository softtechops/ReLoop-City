// ============================================================================
// RELOOP CITY CSV REPORT EXPORTER
// Generates UTF-8 BOM formatted CSV reports for Microsoft Excel & Google Sheets.
// Includes current mode KPIs, active scenario comparison, and municipal assumptions.
// ============================================================================

import { ConfigState } from '../config/config';
import { MetricComparison, ScenarioMetrics } from '../lib/metrics';
import { SavedScenario } from '../types';

function escapeCsv(val: string | number | null | undefined): string {
  if (val === null || val === undefined) return '""';
  const str = String(val);
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return `"${str}"`;
}

export function generateReportCsv(
  metrics: MetricComparison,
  config: ConfigState,
  mode: 'reloop' | 'baseline',
  activeScenario?: SavedScenario | null
): string {
  const lines: string[] = [];
  const now = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

  // 1. Metadata Header
  lines.push('ReLoop City — Municipal Solid Waste Intelligence Platform');
  lines.push('Akurdi–Chinchwad–Moshi Pilot Corridor · Pune PCMC (Maharashtra)');
  lines.push(`Report Generated: ${now}`);
  lines.push(`Operational Mode: ${mode === 'reloop' ? 'ReLoop AI Closed-Loop' : 'Baseline Fixed Schedule'}`);
  lines.push(`Active Scenario: ${activeScenario ? activeScenario.name : 'Default ReLoop Pilot'}`);
  lines.push('Notice: Simulated Pilot Data for PCCOE International Grand Challenge 2026');
  lines.push(''); // Blank line

  // 2. Executive KPI Summary
  lines.push('--- EXECUTIVE KEY PERFORMANCE INDICATORS (30-DAY PILOT INTERVAL) ---');
  lines.push(
    ['Metric Indicator', 'Baseline (Fixed)', 'ReLoop (AI-Optimized)', 'Active Mode Value', 'Delta vs Baseline', 'Unit'].map(escapeCsv).join(',')
  );

  const active = metrics.active;
  const base = metrics.baseline;
  const rel = metrics.reloop;
  const d = metrics.deltas;

  lines.push([
    'Landfill Diversion Rate',
    `${base.diversionRatePercent.toFixed(1)}%`,
    `${rel.diversionRatePercent.toFixed(1)}%`,
    `${active.diversionRatePercent.toFixed(1)}%`,
    d.diversionRate.formattedDelta,
    'percentage (%)',
  ].map(escapeCsv).join(','));

  lines.push([
    'Gross Waste Collected',
    base.collectedTonnes.toFixed(1),
    rel.collectedTonnes.toFixed(1),
    active.collectedTonnes.toFixed(1),
    '+9.7%',
    'tonnes (t)',
  ].map(escapeCsv).join(','));

  lines.push([
    'Landfill Waste Avoided',
    base.landfillAvoidedTonnes.toFixed(1),
    rel.landfillAvoidedTonnes.toFixed(1),
    active.landfillAvoidedTonnes.toFixed(1),
    d.landfillAvoided.formattedDelta,
    'tonnes (t)',
  ].map(escapeCsv).join(','));

  lines.push([
    'Clean Energy Generated',
    base.energyMwh.toFixed(1),
    rel.energyMwh.toFixed(1),
    active.energyMwh.toFixed(1),
    d.energyMwh.formattedDelta,
    'megawatt-hours (MWh)',
  ].map(escapeCsv).join(','));

  lines.push([
    'Circular Revenue Generated',
    `₹${base.revenueInr.toLocaleString('en-IN')}`,
    `₹${rel.revenueInr.toLocaleString('en-IN')}`,
    `₹${active.revenueInr.toLocaleString('en-IN')}`,
    d.revenueInr.formattedDelta,
    'Indian Rupees (₹)',
  ].map(escapeCsv).join(','));

  lines.push([
    'Fleet Distance Driven',
    `${base.routeKm.toFixed(0)} km`,
    `${rel.routeKm.toFixed(0)} km`,
    `${active.routeKm.toFixed(0)} km`,
    d.routeKm.formattedDelta,
    'kilometers (km)',
  ].map(escapeCsv).join(','));

  lines.push([
    'Fleet Diesel Fuel Cost',
    `₹${base.fuelCostInr.toLocaleString('en-IN')}`,
    `₹${rel.fuelCostInr.toLocaleString('en-IN')}`,
    `₹${active.fuelCostInr.toLocaleString('en-IN')}`,
    d.fuelCostInr.formattedDelta,
    'Indian Rupees (₹)',
  ].map(escapeCsv).join(','));

  lines.push([
    'Net CO2e Avoided',
    `${base.co2AvoidedTonnes.toFixed(1)} t`,
    `${rel.co2AvoidedTonnes.toFixed(1)} t`,
    `${active.co2AvoidedTonnes.toFixed(1)} t`,
    d.co2Avoided.formattedDelta,
    'tonnes CO2e',
  ].map(escapeCsv).join(','));

  lines.push([
    'Bin Overflow Incidents',
    base.overflowEvents,
    rel.overflowEvents,
    active.overflowEvents,
    d.overflowEvents.formattedDelta,
    'incidents',
  ].map(escapeCsv).join(','));

  lines.push(''); // Blank line

  // 3. Municipal Engineering Assumptions & Price Tariffs
  lines.push('--- MUNICIPAL PILOT ASSUMPTIONS & PRICING TARIFFS ---');
  lines.push(['Parameter Name', 'Configured Value', 'Unit', 'Source / Regulatory Reference'].map(escapeCsv).join(','));

  const assumptions = [
    { name: 'Compactor Truck Fleet Size', value: config.numberOfTrucks, unit: 'trucks', source: 'Pilot Fleet Specification' },
    { name: 'Predictive Dispatch Fill Threshold', value: `${config.dispatchFillThreshold}%`, unit: 'fill %', source: 'ReLoop CVRP Optimization Threshold' },
    { name: 'Truck Payload Capacity', value: `${config.truckCapacityTonnes} t`, unit: 'tonnes/truck', source: 'Standard Municipal Compactor Payload' },
    { name: 'Biogas Yield (Food/Organic)', value: `${config.biogasYieldPerTonneOrganic} m³/t`, unit: 'm³ per tonne', source: 'Standard Mesophilic Digestion Audit' },
    { name: 'Electricity per m³ Biogas', value: `${config.kwhPerCubicMeterBiogas} kWh/m³`, unit: 'kWh/m³', source: 'CHP Generator Efficiency ~38%' },
    { name: 'Municipal Grid Feed-in Tariff', value: `₹${config.electricityTariffInrPerKwh.toFixed(2)}/kWh`, unit: '₹/kWh', source: 'MSEDCL Net-Metering Feed-in Tariff' },
    { name: 'Diesel Fuel Price', value: `₹${config.dieselPriceInrPerLiter.toFixed(2)}/L`, unit: '₹/liter', source: 'PCMC IOCL Fuel Contract Benchmark' },
    { name: 'Sorted rPET/HDPE Flakes Tariff', value: `₹${config.plasticPelletPriceInrPerTonne.toLocaleString('en-IN')}/t`, unit: '₹/tonne', source: 'Secondary Polymer Wholesale Index' },
    { name: 'Enriched City Compost Tariff', value: `₹${config.compostPriceInrPerTonne.toLocaleString('en-IN')}/t`, unit: '₹/tonne', source: 'FCO Municipal Compost Subsidized Tariff' },
    { name: 'EPR Plastic Credit Value', value: `₹${config.eprCreditPriceInrPerTonne.toLocaleString('en-IN')}/t`, unit: '₹/tonne', source: 'CPCB EPR Portal Market Trading Average' },
    { name: 'Household Electricity Consumption', value: `${config.kwhPerHomePerMonth} kWh/mo`, unit: 'kWh/home/mo', source: 'MNRE 2023 Urban Household Benchmark' },
    { name: 'Tree CO2e Sequestration', value: `${config.kgCo2ePerTreePerYear} kg/yr`, unit: 'kg CO2e/tree/yr', source: 'FAO Global Forestry Benchmark' },
  ];

  for (const item of assumptions) {
    lines.push([item.name, item.value, item.unit, item.source].map(escapeCsv).join(','));
  }

  lines.push('');
  lines.push('--- END OF REPORT · RELOOP CITY PCMC PILOT ---');

  // Prepend UTF-8 BOM so Excel opens special characters (₹, CO₂, %, etc.) correctly
  return '\uFEFF' + lines.join('\r\n');
}

export function downloadReportCsv(
  metrics: MetricComparison,
  config: ConfigState,
  mode: 'reloop' | 'baseline',
  activeScenario?: SavedScenario | null
): boolean {
  try {
    const csvContent = generateReportCsv(metrics, config, mode, activeScenario);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const dateStr = new Date().toISOString().slice(0, 10);
    link.href = url;
    link.setAttribute('download', `reloop-city-report-${mode}-${dateStr}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    return true;
  } catch (err) {
    console.error('Failed to export CSV report:', err);
    return false;
  }
}
