// ============================================================================
// RELOOP EXECUTIVE PRINT REPORT (/app/report)
// Print-optimized and PDF-exportable municipal briefing report.
// Features clean typography, fixed-width charts, executive summary,
// 4 primary KPIs, scenario comparison table, assumptions list, and official footer.
// ============================================================================

import React, { useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { DEFAULT_CONFIG } from '../config/config';
import { computeMetrics, PILOT_30DAY_SNAPSHOT } from '../lib/metrics';
import { safeFormatCurrencyINR, safeFormatTonnage, safeFormatMwh } from '../lib/formatters';
import { downloadReportCsv } from '../utils/exportCsv';
import { simulateScenarioMetrics, buildScenarioComparisonRows } from '../lib/scenarioEngine';
import {
  Printer,
  Download,
  ArrowLeft,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  MapPin,
  Building,
} from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';

export const ExecutiveReportPage: React.FC = () => {
  const {
    mode,
    config,
    simState,
    savedScenarios,
    activeScenarioId,
    councilReportApproved,
    councilApprovalTimestamp,
    showToast,
  } = useStore();

  // Active scenario details
  const activeScenario = useMemo(() => {
    if (!activeScenarioId) return null;
    return savedScenarios.find((s) => s.id === activeScenarioId) || null;
  }, [savedScenarios, activeScenarioId]);

  // Compute live metrics
  const metrics = useMemo(() => {
    return computeMetrics(simState, config, mode);
  }, [simState, config, mode]);

  const snap = PILOT_30DAY_SNAPSHOT;
  const displayActive = metrics.active.collectedTonnes > 0 ? metrics.active : (mode === 'reloop' ? snap.reloop : snap.baseline);
  const displayBaseline = metrics.baseline.collectedTonnes > 0 ? metrics.baseline : snap.baseline;
  const displayReloop = metrics.reloop.collectedTonnes > 0 ? metrics.reloop : snap.reloop;
  const deltas = metrics.active.collectedTonnes > 0 ? metrics.deltas : snap.deltas;

  // Candidate custom scenario metrics
  const activeScenarioMetrics = useMemo(() => {
    if (activeScenario) {
      return simulateScenarioMetrics(simState, activeScenario.config);
    }
    return displayActive;
  }, [activeScenario, simState, displayActive]);

  // Comparison rows for 3-way table
  const comparisonRows = useMemo(() => {
    return buildScenarioComparisonRows(activeScenarioMetrics, displayBaseline, displayReloop);
  }, [activeScenarioMetrics, displayBaseline, displayReloop]);

  // Current formatted date
  const reportDate = useMemo(() => {
    return new Date().toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  }, []);

  // Auto-trigger print if requested via query param
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('autoPrint') === 'true') {
      const timer = setTimeout(() => {
        window.print();
      }, 700);
      return () => clearTimeout(timer);
    }
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadCsv = () => {
    try {
      const ok = downloadReportCsv(metrics, config, mode, activeScenario);
      if (ok) {
        showToast('Municipal report CSV downloaded successfully', 'success');
      } else {
        showToast('Failed to export CSV report', 'error');
      }
    } catch {
      showToast('Failed to export CSV report', 'error');
    }
  };

  // Donut chart data
  const donutData = useMemo(() => [
    { name: 'Recycled Polymers & Metals', value: displayActive.recycledTonnes, color: '#12305C' },
    { name: 'Organic City Compost', value: displayActive.compostedTonnes, color: '#059669' },
    { name: 'Clean Energy (Organic Eq)', value: Number(((displayActive.energyMwh / 0.231) * 0.1).toFixed(1)), color: '#D97706' },
    { name: 'Residual Landfill (Inert)', value: displayActive.landfilledTonnes, color: '#64748B' },
  ], [displayActive]);

  interface PrintTimeStep {
    timestamp: string;
    collected: number;
    diverted: number;
  }

  // Time-series history for print
  const timeSeriesData: PrintTimeStep[] = useMemo(() => {
    if (simState.history && simState.history.length >= 6) {
      return simState.history.slice(-12).map((s) => ({
        timestamp: s.timestamp,
        collected: mode === 'reloop' ? s.reloop.collectedTonnes : s.baseline.collectedTonnes,
        diverted: mode === 'reloop' ? s.reloop.landfillAvoidedTonnes : s.baseline.landfillAvoidedTonnes,
      }));
    }
    return [
      { timestamp: 'Day 1', collected: 18.2, diverted: 17.3 },
      { timestamp: 'Day 5', collected: 42.5, diverted: 40.4 },
      { timestamp: 'Day 10', collected: 72.8, diverted: 69.2 },
      { timestamp: 'Day 15', collected: 101.4, diverted: 96.4 },
      { timestamp: 'Day 20', collected: 128.6, diverted: 122.3 },
      { timestamp: 'Day 25', collected: 149.0, diverted: 141.7 },
      { timestamp: 'Day 30', collected: 162.8, diverted: 154.8 },
    ];
  }, [simState.history, mode]);

  return (
    <div className="min-h-screen bg-slate-100 py-8 px-4 sm:px-6 lg:px-8 print:bg-white print:p-0 print:m-0 text-slate-900 forced-light">
      <style>{`
        @media print {
          @page {
            margin: 1.2cm;
            size: A4 portrait;
          }
          body {
            background-color: white !important;
            color: #0f172a !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .no-print, header, aside, nav, #header-toast {
            display: none !important;
          }
          .print-card {
            box-shadow: none !important;
            border: 1px solid #cbd5e1 !important;
            page-break-inside: avoid !important;
            break-inside: avoid !important;
          }
          .print-break-after {
            page-break-after: always !important;
            break-after: always !important;
          }
        }
      `}</style>

      {/* ── Screen-only Action Toolbar (Hidden in Print) ────────────────── */}
      <div className="no-print max-w-5xl mx-auto mb-6 flex flex-wrap items-center justify-between gap-3 p-4 bg-white rounded-2xl border border-charcoal-200 shadow-sm">
        <div className="flex items-center gap-3">
          <Link
            to="/app/dashboard"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-charcoal-700 hover:text-navy-900 hover:bg-charcoal-100 transition-colors min-h-[36px]"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
          <span className="text-charcoal-300">|</span>
          <span className="text-xs font-semibold text-charcoal-600">
            Print Preview Mode · Pune PCMC Corridor
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleDownloadCsv}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-navy-800 bg-navy-50 hover:bg-navy-100 border border-navy-200 transition-colors cursor-pointer min-h-[40px]"
          >
            <Download className="w-4 h-4 text-navy-700" />
            Download CSV
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-xs transition-colors cursor-pointer min-h-[40px]"
          >
            <Printer className="w-4 h-4" />
            Print / Save as PDF
          </button>
        </div>
      </div>

      {/* ── Document Container ──────────────────────────────────────────── */}
      <article className="max-w-5xl mx-auto bg-white p-6 sm:p-10 rounded-3xl shadow-sm border border-charcoal-200 print:border-none print:shadow-none print:p-0 print:max-w-none space-y-6">

        {/* 1. Header Area with Title & Date */}
        <header className="border-b-2 border-navy-900 pb-5 space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-semibold text-charcoal-500 uppercase tracking-wider">
            <div className="flex items-center gap-2">
              <Building className="w-4 h-4 text-navy-800" />
              <span>Pimpri-Chinchwad Municipal Corporation (PCMC)</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-navy-800" />
              <span>Report Date: {reportDate}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pt-1">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-950 font-['Outfit']">
                ReLoop City · Executive Operational Report
              </h1>
              <p className="text-sm text-charcoal-600 font-medium flex items-center gap-1.5 mt-1">
                <MapPin className="w-4 h-4 text-emerald-600" />
                Akurdi–Chinchwad–Moshi Pilot Corridor · 100 Smart IoT Bins
              </p>
            </div>

            <div className="text-left sm:text-right text-xs space-y-0.5">
              <span className="font-mono text-charcoal-400 block uppercase">Mode & Policy</span>
              <span className="font-bold text-navy-900 text-sm">
                {mode === 'reloop' ? 'ReLoop AI-Optimized' : 'Baseline Fixed Schedule'}
              </span>
              {activeScenario && (
                <span className="text-emerald-800 font-bold block">
                  Scenario: {activeScenario.name}
                </span>
              )}
            </div>
          </div>

          {councilReportApproved && (
            <div className="mt-2 py-1.5 px-3 rounded-lg bg-emerald-50 border border-emerald-300 text-xs font-semibold text-emerald-950 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                Officially Certified by Operations Manager for City Council Standing Committee
              </span>
              <span className="font-mono text-[11px] text-emerald-800">
                Sealed: {councilApprovalTimestamp}
              </span>
            </div>
          )}
        </header>

        {/* 2. Plain-language Executive Summary */}
        <section aria-label="Executive summary" className="print-card p-5 rounded-2xl bg-navy-50/50 border border-navy-100 space-y-2">
          <h2 className="text-xs font-bold uppercase tracking-wider text-navy-900">
            Executive Summary
          </h2>
          <p className="text-sm text-charcoal-800 leading-relaxed font-medium">
            Over the simulated 30-day operating cycle in the Akurdi–Chinchwad–Moshi corridor, the ReLoop platform diverted{' '}
            <strong className="text-navy-950">{displayActive.diversionRatePercent.toFixed(1)}% ({displayActive.landfillAvoidedTonnes.toFixed(1)} tonnes)</strong> of municipal solid waste away from the Moshi dumpsite. Dynamic CVRP 2-Opt fleet routing capped total distance to{' '}
            <strong className="text-navy-950">{displayActive.routeKm.toFixed(0)} km</strong>, saving{' '}
            <strong className="text-navy-950">{deltas.fuelCostInr.formattedDelta}</strong> in diesel expenses versus baseline fixed routing. Anaerobic digestion delivered{' '}
            <strong className="text-navy-950">{displayActive.energyMwh.toFixed(1)} MWh</strong> of clean power, driving gross circular revenues to{' '}
            <strong className="text-navy-950">{safeFormatCurrencyINR(displayActive.revenueInr)}</strong> and eliminating{' '}
            <strong className="text-navy-950">{displayActive.co2AvoidedTonnes.toFixed(1)} t CO₂e</strong> greenhouse gas emissions.
          </p>
        </section>

        {/* 3. The 4 Headline KPIs */}
        <section aria-label="Primary headline KPIs" className="space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-charcoal-500">
            Headline Performance Indicators
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {/* KPI 1 */}
            <div className="print-card p-4 rounded-xl border border-charcoal-200 bg-white space-y-1">
              <span className="text-xs text-charcoal-500 font-semibold block">Landfill Diversion</span>
              <p className="text-2xl font-extrabold text-navy-950 font-['Outfit']">
                {displayActive.diversionRatePercent.toFixed(1)}%
              </p>
              <p className="text-xs font-bold text-emerald-800">
                {displayActive.landfillAvoidedTonnes.toFixed(1)} t diverted ({deltas.diversionRate.formattedDelta})
              </p>
            </div>

            {/* KPI 2 */}
            <div className="print-card p-4 rounded-xl border border-charcoal-200 bg-white space-y-1">
              <span className="text-xs text-charcoal-500 font-semibold block">Fleet Distance</span>
              <p className="text-2xl font-extrabold text-navy-950 font-['Outfit']">
                {displayActive.routeKm.toFixed(0)} km
              </p>
              <p className="text-xs font-bold text-emerald-800">
                {deltas.routeKm.formattedDelta} km vs baseline
              </p>
            </div>

            {/* KPI 3 */}
            <div className="print-card p-4 rounded-xl border border-charcoal-200 bg-white space-y-1">
              <span className="text-xs text-charcoal-500 font-semibold block">Clean Energy Yield</span>
              <p className="text-2xl font-extrabold text-navy-950 font-['Outfit']">
                {safeFormatMwh(displayActive.energyMwh)}
              </p>
              <p className="text-xs font-bold text-amber-800">
                {deltas.energyMwh.formattedDelta} clean electricity
              </p>
            </div>

            {/* KPI 4 */}
            <div className="print-card p-4 rounded-xl border border-charcoal-200 bg-white space-y-1">
              <span className="text-xs text-charcoal-500 font-semibold block">Circular Gross Revenue</span>
              <p className="text-2xl font-extrabold text-navy-950 font-['Outfit']">
                {safeFormatCurrencyINR(displayActive.revenueInr)}
              </p>
              <p className="text-xs font-bold text-emerald-800">
                {deltas.revenueInr.formattedDelta} vs status quo
              </p>
            </div>
          </div>
        </section>

        {/* 4. Scenario Comparison Table */}
        <section aria-label="Scenario comparison table" className="print-card p-5 rounded-2xl border border-charcoal-200 bg-white space-y-3">
          <div className="flex items-center justify-between border-b border-charcoal-100 pb-2">
            <h2 className="text-xs font-bold uppercase tracking-wider text-navy-900">
              Scenario Benchmark Table (30-Day Simulation Interval)
            </h2>
            <span className="text-[11px] text-charcoal-500 font-medium">
              Modeled across 100 IoT Smart Bins
            </span>
          </div>

          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-charcoal-200 bg-charcoal-50 text-charcoal-600 font-bold uppercase">
                <th scope="col" className="py-2.5 px-3">Metric</th>
                <th scope="col" className="py-2.5 px-3">1. Baseline (Status Quo)</th>
                <th scope="col" className="py-2.5 px-3">2. Default ReLoop AI</th>
                <th scope="col" className="py-2.5 px-3">3. Active Policy Scenario</th>
                <th scope="col" className="py-2.5 px-3 text-right">Delta vs Baseline</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-charcoal-100 font-mono">
              {comparisonRows.map((r) => (
                <tr key={r.key}>
                  <td className="py-2 px-3 font-sans font-semibold text-navy-900">{r.label}</td>
                  <td className="py-2 px-3 text-charcoal-600">{r.baselineFormatted}</td>
                  <td className="py-2 px-3 text-navy-800 font-medium">{r.defaultReloopFormatted}</td>
                  <td className="py-2 px-3 font-bold text-emerald-950">{r.myScenarioFormatted}</td>
                  <td className="py-2 px-3 text-right font-bold text-emerald-800">{r.deltaVsBaseline.formattedDelta}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* 5. Key Charts (Donut + Time Series at Fixed Print Width) */}
        <section aria-label="Performance charts" className="print-card p-5 rounded-2xl border border-charcoal-200 bg-white space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-navy-900 border-b border-charcoal-100 pb-2">
            Material Mass Balance & Cumulative Recovery Progression
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            {/* Donut Chart with fixed dimensions */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-navy-900 block text-center">
                Material Stream Partitioning (tonnes)
              </span>
              <div className="w-[320px] h-[200px] mx-auto">
                <PieChart width={320} height={200}>
                  <Pie
                    data={donutData}
                    cx={160}
                    cy={100}
                    innerRadius={45}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {donutData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </div>
              <div className="grid grid-cols-2 gap-1 text-[11px] text-charcoal-700 max-w-xs mx-auto">
                {donutData.map((d) => (
                  <div key={d.name} className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: d.color }} />
                    <span className="truncate">{d.name}: {d.value} t</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Area Time Series with fixed dimensions */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-navy-900 block text-center">
                Cumulative Waste Collected vs Landfill Diverted (t)
              </span>
              <div className="w-[380px] h-[200px] mx-auto">
                <AreaChart width={380} height={200} data={timeSeriesData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="timestamp" stroke="#64748b" fontSize={10} tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={10} tickLine={false} />
                  <Area type="monotone" dataKey="collected" stroke="#12305c" fill="#12305c" fillOpacity={0.15} />
                  <Area type="monotone" dataKey="diverted" stroke="#059669" fill="#059669" fillOpacity={0.25} />
                </AreaChart>
              </div>
              <div className="flex items-center justify-center gap-4 text-[11px] text-charcoal-700">
                <span className="flex items-center gap-1">
                  <span className="w-3 h-1.5 rounded-sm bg-[#12305c]" /> Total Collected
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-3 h-1.5 rounded-sm bg-[#059669]" /> Landfill Diverted
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* 6. Short Assumptions List */}
        <section aria-label="Configured assumptions" className="print-card p-5 rounded-2xl border border-charcoal-200 bg-white space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-navy-900 border-b border-charcoal-100 pb-2">
            Pilot Engineering & Tariff Assumptions (Pune Corridor)
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5 text-xs">
            <div className="p-2 rounded-lg bg-charcoal-50 border border-charcoal-100">
              <span className="text-charcoal-500 block text-[10px]">Fleet Compactor Trucks</span>
              <span className="font-bold text-navy-900 font-mono">{config.numberOfTrucks} trucks ({config.truckCapacityTonnes} t payload)</span>
            </div>
            <div className="p-2 rounded-lg bg-charcoal-50 border border-charcoal-100">
              <span className="text-charcoal-500 block text-[10px]">Dispatch Fill Threshold</span>
              <span className="font-bold text-navy-900 font-mono">{(config.dispatchFillThreshold * 100).toFixed(0)}% fill trigger</span>
            </div>
            <div className="p-2 rounded-lg bg-charcoal-50 border border-charcoal-100">
              <span className="text-charcoal-500 block text-[10px]">Biogas Recovery Factor</span>
              <span className="font-bold text-navy-900 font-mono">{config.biogasYieldPerTonneOrganic} m³/t organic</span>
            </div>
            <div className="p-2 rounded-lg bg-charcoal-50 border border-charcoal-100">
              <span className="text-charcoal-500 block text-[10px]">Electricity Feed-in Tariff</span>
              <span className="font-bold text-navy-900 font-mono">₹{config.electricityTariffInrPerKwh.toFixed(2)}/kWh (MSEDCL rate)</span>
            </div>
            <div className="p-2 rounded-lg bg-charcoal-50 border border-charcoal-100">
              <span className="text-charcoal-500 block text-[10px]">Plastic Polymer Flakes</span>
              <span className="font-bold text-navy-900 font-mono">₹{config.plasticPelletPriceInrPerTonne.toLocaleString('en-IN')}/t (HDPE/PET)</span>
            </div>
            <div className="p-2 rounded-lg bg-charcoal-50 border border-charcoal-100">
              <span className="text-charcoal-500 block text-[10px]">Avoided Landfill Tipping</span>
              <span className="font-bold text-navy-900 font-mono">₹{config.landfillTippingCostInrPerTonne.toLocaleString('en-IN')}/t fee</span>
            </div>
          </div>
        </section>

        {/* 7. Official Document Footer (Prompt requirement) */}
        <footer className="pt-4 border-t-2 border-charcoal-300 text-center text-xs text-charcoal-500 space-y-1">
          <p className="font-semibold text-charcoal-700">
            Simulated pilot data, PCCOE International Grand Challenge 2026
          </p>
          <p className="text-[11px] text-charcoal-400">
            ReLoop City Municipal Circular Intelligence Platform · Akurdi–Chinchwad–Moshi Smart Pilot Corridor · Confidential City Report
          </p>
        </footer>

      </article>
    </div>
  );
};
