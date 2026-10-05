import React from 'react';
import { useStore } from '../store/useStore';
import { PageHeader } from '../components/ui/PageHeader';
import { LoopStepNav } from '../components/ui/LoopStepNav';
import { SectionCard } from '../components/ui/SectionCard';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { ExportReportMenu } from '../components/ExportReportMenu';
import { 
  Coins, 
  Building2, 
  Zap, 
  Leaf, 
  Recycle, 
  Factory, 
  Award,
  CheckCircle2,
  ShieldCheck,
  FileCheck2,
  Sparkles
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  ResponsiveContainer 
} from 'recharts';
import { formatCurrencyINR } from '../lib/formatters';
import { useChartTheme } from '../lib/chartTheme';

export const RevenuePage: React.FC = () => {
  const { mode, councilReportApproved, councilApprovalTimestamp, approveCouncilReport } = useStore();
  const chartTheme = useChartTheme();
  const isReloop = mode === 'reloop';

  // 6 Circular Revenue Streams breakdown
  const revenueStreams = [
    {
      id: 'rev-recycled',
      title: 'Commodity Recycled Materials',
      category: 'Polymers, Metals, Paper',
      monthlyRevenueInr: isReloop ? 1420000 : 480000,
      annualizedLakh: isReloop ? 170.4 : 57.6,
      percentage: isReloop ? 41.5 : 26.0,
      description: 'Clean optical-sorted rPET flakes, HDPE granules, aluminum ingots, and OCC pulp sold directly to brand manufacturers.',
      icon: Recycle,
      color: '#12305C',
    },
    {
      id: 'rev-energy',
      title: 'Biogas & Electricity Grid Feed-in',
      category: 'Clean Energy & Bio-CNG',
      monthlyRevenueInr: isReloop ? 580000 : 260000,
      annualizedLakh: isReloop ? 69.6 : 31.2,
      percentage: isReloop ? 17.0 : 14.1,
      description: 'Electricity sold to MSEDCL grid under Maharashtra net-metering feed-in tariff plus compressed Bio-CNG for city transit buses.',
      icon: Zap,
      color: '#D9A441',
    },
    {
      id: 'rev-compost',
      title: 'Enriched City Compost Sales',
      category: 'Bio-Fertilizer',
      monthlyRevenueInr: isReloop ? 320000 : 150000,
      annualizedLakh: isReloop ? 38.4 : 18.0,
      percentage: isReloop ? 9.4 : 8.1,
      description: 'FCO-compliant nutrient organic fertilizer distributed to peri-urban agricultural cooperatives across Pune district.',
      icon: Leaf,
      color: '#7BA17D',
    },
    {
      id: 'rev-epr',
      title: 'EPR & Plastic Carbon Credits',
      category: 'Regulatory Compliance',
      monthlyRevenueInr: isReloop ? 460000 : 120000,
      annualizedLakh: isReloop ? 55.2 : 14.4,
      percentage: isReloop ? 13.5 : 6.5,
      description: 'CPCB-registered Extended Producer Responsibility certificate trading with FMCG multinational brand owners.',
      icon: Award,
      color: '#4D84BE',
    },
    {
      id: 'rev-partnerships',
      title: 'Circular Industrial Partnerships',
      category: 'Cement Kilns & Construction',
      monthlyRevenueInr: isReloop ? 340000 : 110000,
      annualizedLakh: isReloop ? 40.8 : 13.2,
      percentage: isReloop ? 9.9 : 6.0,
      description: 'Off-take agreements for high-calorific RDF with cement plants and recycled M-Sand supply for public smart city roads.',
      icon: Factory,
      color: '#8E9296',
    },
    {
      id: 'rev-savings',
      title: 'Avoided Landfill Tipping & Diesel Savings',
      category: 'Municipal Operational Savings',
      monthlyRevenueInr: isReloop ? 300000 : 725000,
      annualizedLakh: isReloop ? 36.0 : 87.0,
      percentage: isReloop ? 8.7 : 39.3,
      description: 'Direct municipal budget savings from avoided landfill tipping fees (₹1,200/t) and 32% reduced compactor fuel consumption.',
      icon: Building2,
      color: '#2F3437',
    },
  ];

  const totalMonthlyRevenueInr = revenueStreams.reduce((acc, r) => acc + r.monthlyRevenueInr, 0);

  const financialWaterfallData = [
    { name: 'Collection Logistics', baselineCost: 8.5, reloopCost: 5.8 },
    { name: 'MRF / Plant O&M', baselineCost: 6.2, reloopCost: 7.1 },
    { name: 'Landfill Disposal Fee', baselineCost: 6.8, reloopCost: 0.9 },
    { name: 'Gross Revenue Earned', baselineCost: 18.4, reloopCost: 34.2 },
  ];

  return (
    <div className="space-y-6 pb-16">
      
      {/* Page Header */}
      <PageHeader
        title="Report · Results & revenue"
        subtitle="Transforming municipal waste from an expensive cost center into an economically self-financing city asset."
        stepNumber={7}
        totalSteps={7}
        stepName="Report"
        decisionPrompt="What should we tell the city council?"
        actions={
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-surface-muted border border-line">
              <span className="text-xs text-fg-muted font-medium">Pilot Run-rate:</span>
              <span className="font-extrabold text-fg text-sm font-['Outfit']">
                {formatCurrencyINR(totalMonthlyRevenueInr)}/month
              </span>
            </div>
            <ExportReportMenu />
          </div>
        }
      />

      {/* One-Line Top Headline Result (Phase 4 requirement) */}
      <div className="p-4 sm:p-5 rounded-2xl bg-surface border border-line shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="p-2.5 rounded-xl bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 flex-shrink-0" aria-hidden="true">
            <Coins className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          </span>
          <div>
            <div className="text-xs uppercase font-bold tracking-wider text-fg-muted">
              Macro-Economic Ledger
            </div>
            <p className="text-sm sm:text-base font-bold text-fg leading-snug">
              ReLoop circular monetization generates {formatCurrencyINR(totalMonthlyRevenueInr)}/month across 6 resource streams, generating ₹20.4 Lakh net quarterly surplus.
            </p>
          </div>
        </div>
        <Badge variant={isReloop ? 'emerald' : 'amber'} size="md">
          {isReloop ? 'Self-Financing Active' : 'Cost-Center Baseline'}
        </Badge>
      </div>

      {/* Decision Card: Council Briefing Approval */}
      <div className={`p-5 rounded-2xl border transition-all ${
        councilReportApproved
          ? 'bg-emerald-500/10 border-emerald-500/30 shadow-xs'
          : 'bg-surface border-line shadow-xs'
      }`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className={`p-2.5 rounded-xl flex-shrink-0 ${
              councilReportApproved ? 'bg-emerald-500 text-white' : 'bg-surface-muted text-fg'
            }`}>
              {councilReportApproved ? (
                <ShieldCheck className="w-5 h-5" />
              ) : (
                <FileCheck2 className="w-5 h-5" />
              )}
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-fg-muted">
                  Municipal Decision Action
                </span>
                {councilReportApproved ? (
                  <Badge variant="emerald" size="sm">
                    Certified for PCMC Standing Committee
                  </Badge>
                ) : (
                  <Badge variant="amber" size="sm">
                    Draft Pending Operations Manager Sign-off
                  </Badge>
                )}
              </div>
              <h3 className="text-base font-bold text-fg">
                {councilReportApproved
                  ? 'Circular Economic Ledger Certified for Municipal Submission'
                  : 'Approve Corridor Results for PCMC City Council Review'}
              </h3>
              <p className="text-xs text-fg-muted max-w-2xl leading-relaxed">
                {councilReportApproved
                  ? `Sealed by City Waste Operations Manager on ${councilApprovalTimestamp}. Verified 95.8% diversion, net quarterly surplus of ₹20.4 Lakh, and 31.2 t CO₂ abatement under simulated pilot corridor standards.`
                  : 'Sign off on current simulation outcomes, diversion metrics, and facility economics to release the formal briefing pack to the PCMC Municipal Commissioner.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start md:self-center flex-shrink-0">
            {councilReportApproved ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => approveCouncilReport(false)}
                className="text-xs text-fg-muted hover:text-rose-600 hover:border-rose-300 dark:hover:text-rose-400"
              >
                Revert to Draft
              </Button>
            ) : (
              <Button
                variant="primary"
                size="md"
                onClick={() => approveCouncilReport(true)}
                className="gap-2 text-xs font-bold shadow-xs bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                <CheckCircle2 className="w-4 h-4" />
                Sign & Approve for Council
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Slide 9 Architecture: From Cost Center to City-Wide Impact */}
      <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-r from-navy-900 via-navy-800 to-navy-900 border border-white/10 text-white shadow-xl space-y-4">
        <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
          The Macro-Economic Engine (Slide 9)
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-1">
          <div className="p-4 rounded-2xl bg-white/10 border border-white/15 space-y-1">
            <span className="text-xs text-slate-300">1. Construction & Infra</span>
            <h3 className="text-sm font-bold text-white">Recycled M-Sand & Aggregates</h3>
            <p className="text-xs text-slate-300">Supplying municipal road paving and affordable housing.</p>
          </div>
          <div className="p-4 rounded-2xl bg-white/10 border border-white/15 space-y-1">
            <span className="text-xs text-slate-300">2. Clean City Energy</span>
            <h3 className="text-sm font-bold text-amber-300">MWh Power & Bio-CNG</h3>
            <p className="text-xs text-slate-300">Electrifying municipal facilities, street lights, and bus fleets.</p>
          </div>
          <div className="p-4 rounded-2xl bg-white/10 border border-white/15 space-y-1">
            <span className="text-xs text-slate-300">3. Environmental Health</span>
            <h3 className="text-sm font-bold text-emerald-300">95% Landfill Abatement</h3>
            <p className="text-xs text-slate-300">Eliminating air toxic leachate and ground water contamination.</p>
          </div>
          <div className="p-4 rounded-2xl bg-white/10 border border-white/15 space-y-1">
            <span className="text-xs text-slate-300">4. Local Economy</span>
            <h3 className="text-sm font-bold text-white">Green Formal Jobs</h3>
            <p className="text-xs text-slate-300">Decent tech-enabled jobs in automated sorting & bio-refining.</p>
          </div>
        </div>
      </div>

      {/* The 6 Revenue Streams Grid */}
      <SectionCard
        title="Breakdown of the 6 Municipal Revenue Streams"
        subtitle="Revenue generated per category based on active market tariffs"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {revenueStreams.map((stream) => {
            const Icon = stream.icon;
            return (
              <div
                key={stream.id}
                className="p-5 rounded-2xl bg-surface-muted border border-line shadow-xs space-y-3 hover:border-emerald-500/50 transition-all flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center text-white"
                      style={{ backgroundColor: stream.color }}
                      aria-hidden="true"
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <Badge variant="navy" size="sm">
                      {stream.percentage}% of total
                    </Badge>
                  </div>

                  <div>
                    <h4 className="font-bold text-sm text-fg leading-snug">{stream.title}</h4>
                    <span className="text-xs text-fg-muted font-medium">{stream.category}</span>
                  </div>

                  <p className="text-xs text-fg-muted leading-relaxed">
                    {stream.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-line flex items-baseline justify-between">
                  <div>
                    <span className="text-[10px] text-fg-subtle block uppercase font-semibold">Monthly Rate</span>
                    <span className="font-bold text-sm text-fg font-mono">
                      {formatCurrencyINR(stream.monthlyRevenueInr)}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-fg-subtle block uppercase font-semibold">Annualized</span>
                    <span className="font-bold text-xs text-emerald-600 dark:text-emerald-400 font-mono">
                      ₹{stream.annualizedLakh.toFixed(1)} Lakh/yr
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </SectionCard>

      {/* Cost Center vs Net Positive Revenue Waterfall Chart */}
      <SectionCard
        title="Municipal Cost vs Revenue Comparison (₹ Lakh / Quarter)"
        subtitle="Showing how ReLoop transforms operations from a net fiscal drain to a self-financing platform"
        headerAction={
          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1.5 text-fg-muted font-semibold">
              <span className="w-3 h-2 rounded-sm bg-slate-400 dark:bg-slate-500" aria-hidden="true" /> Baseline Fixed Mode
            </span>
            <span className="flex items-center gap-1.5 text-fg font-semibold">
              <span className="w-3 h-2 rounded-sm bg-emerald-600" aria-hidden="true" /> ReLoop AI Mode
            </span>
          </div>
        }
      >
        <div className="h-64" aria-label="Bar chart comparing baseline costs and reloop revenues in lakhs">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={financialWaterfallData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={chartTheme.gridColor} />
              <XAxis dataKey="name" stroke={chartTheme.axisColor} fontSize={11} tickLine={false} />
              <YAxis stroke={chartTheme.axisColor} fontSize={11} tickLine={false} unit="L" />
              <RechartsTooltip 
                formatter={(val: any) => [`₹${val} Lakh`, 'Amount']}
                contentStyle={chartTheme.tooltipStyle}
              />
              <Bar dataKey="baselineCost" name="Baseline (₹ Lakh)" fill={chartTheme.colors.landfill} radius={[4, 4, 0, 0]} />
              <Bar dataKey="reloopCost" name="ReLoop AI (₹ Lakh)" fill={chartTheme.colors.recycled} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-sm text-fg mt-4">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" aria-hidden="true" />
            <span className="font-semibold">
              Net Municipal Balance: ReLoop generates an estimated <strong>₹20.4 Lakh net surplus quarterly</strong> compared to a ₹2.9 Lakh deficit under baseline municipal operations.
            </span>
          </div>
          <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold whitespace-nowrap hidden sm:inline">
            ROI: ~14.2 Months Payback
          </span>
        </div>
      </SectionCard>

      {/* Loop Step Navigation */}
      <LoopStepNav
        currentStep={7}
        prevPath="/app/forecast"
        prevLabel="Forecast · Clean energy"
        nextPath="/app/dashboard"
        nextLabel="Dashboard (Complete Loop)"
      />

    </div>
  );
};
