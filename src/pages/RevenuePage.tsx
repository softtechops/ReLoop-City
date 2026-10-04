import React from 'react';
import { useStore } from '../store/useStore';
import { PageHeader } from '../components/ui/PageHeader';
import { LoopStepNav } from '../components/ui/LoopStepNav';
import { SectionCard } from '../components/ui/SectionCard';
import { Badge } from '../components/ui/Badge';
import { 
  Coins, 
  Building2, 
  Zap, 
  Leaf, 
  Recycle, 
  Factory, 
  Award,
  CheckCircle2
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

export const RevenuePage: React.FC = () => {
  const { mode } = useStore();
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
        title="7 · Results & Revenue: Circular Monetization Engine"
        subtitle="Transforming municipal waste from an expensive cost center into an economically self-financing city asset."
        stepNumber={7}
        totalSteps={7}
        stepName="Report"
        actions={
          <div className="flex items-center gap-2">
            <span className="text-xs text-charcoal-500 font-medium">Pilot Run-rate:</span>
            <span className="font-extrabold text-navy-900 text-sm font-['Outfit']">
              {formatCurrencyINR(totalMonthlyRevenueInr)}/month
            </span>
          </div>
        }
      />

      {/* Slide 9 Architecture: From Cost Center to City-Wide Impact */}
      <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-r from-navy-800 to-navy-900 text-white shadow-xl space-y-4">
        <span className="text-xs font-bold uppercase tracking-wider text-amberGold-300">
          The Macro-Economic Engine (Slide 9)
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-1">
          <div className="p-4 rounded-2xl bg-white/10 border border-white/15 space-y-1">
            <span className="text-xs text-navy-200">1. Construction & Infra</span>
            <h3 className="text-sm font-bold text-white">Recycled M-Sand & Aggregates</h3>
            <p className="text-xs text-navy-200">Supplying municipal road paving and affordable housing.</p>
          </div>
          <div className="p-4 rounded-2xl bg-white/10 border border-white/15 space-y-1">
            <span className="text-xs text-navy-200">2. Clean City Energy</span>
            <h3 className="text-sm font-bold text-amberGold-300">MWh Power & Bio-CNG</h3>
            <p className="text-xs text-navy-200">Electrifying municipal facilities, street lights, and bus fleets.</p>
          </div>
          <div className="p-4 rounded-2xl bg-white/10 border border-white/15 space-y-1">
            <span className="text-xs text-navy-200">3. Environmental Health</span>
            <h3 className="text-sm font-bold text-sage-300">95% Landfill Abatement</h3>
            <p className="text-xs text-navy-200">Eliminating air toxic leachate and ground water contamination.</p>
          </div>
          <div className="p-4 rounded-2xl bg-white/10 border border-white/15 space-y-1">
            <span className="text-xs text-navy-200">4. Local Economy</span>
            <h3 className="text-sm font-bold text-white">Green Formal Jobs</h3>
            <p className="text-xs text-navy-200">Decent tech-enabled jobs in automated sorting & bio-refining.</p>
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
                className="p-5 rounded-2xl bg-[#F7F6F2]/50 border border-navy-100 shadow-xs space-y-3 hover:border-navy-300 transition-all flex flex-col justify-between"
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
                    <h4 className="font-bold text-sm text-navy-900 leading-snug">{stream.title}</h4>
                    <span className="text-xs text-charcoal-500 font-medium">{stream.category}</span>
                  </div>

                  <p className="text-xs text-charcoal-600 leading-relaxed">
                    {stream.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-navy-100 flex items-baseline justify-between">
                  <div>
                    <span className="text-[10px] text-charcoal-400 block uppercase font-semibold">Monthly Rate</span>
                    <span className="font-bold text-sm text-navy-900 font-mono">
                      {formatCurrencyINR(stream.monthlyRevenueInr)}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-charcoal-400 block uppercase font-semibold">Annualized</span>
                    <span className="font-bold text-xs text-sage-800 font-mono">
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
            <span className="flex items-center gap-1.5 text-charcoal-600 font-semibold">
              <span className="w-3 h-2 rounded-sm bg-charcoal-500" aria-hidden="true" /> Baseline Fixed Mode
            </span>
            <span className="flex items-center gap-1.5 text-navy-800 font-semibold">
              <span className="w-3 h-2 rounded-sm bg-navy-700" aria-hidden="true" /> ReLoop AI Mode
            </span>
          </div>
        }
      >
        <div className="h-64" aria-label="Bar chart comparing baseline costs and reloop revenues in lakhs">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={financialWaterfallData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F0F4FA" />
              <XAxis dataKey="name" stroke="#757E81" fontSize={11} tickLine={false} />
              <YAxis stroke="#757E81" fontSize={11} tickLine={false} unit="L" />
              <RechartsTooltip 
                formatter={(val: any) => [`₹${val} Lakh`, 'Amount']}
                contentStyle={{ borderRadius: '0.75rem', border: '1px solid #D9E4F2', fontSize: '13px' }}
              />
              <Bar dataKey="baselineCost" name="Baseline (₹ Lakh)" fill="#8E9296" radius={[4, 4, 0, 0]} />
              <Bar dataKey="reloopCost" name="ReLoop AI (₹ Lakh)" fill="#12305C" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="p-3.5 rounded-xl bg-sage-50 border border-sage-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-sage-900 mt-4">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-sage-700 flex-shrink-0" aria-hidden="true" />
            <span className="font-semibold">
              Net Municipal Balance: ReLoop generates an estimated <strong>₹20.4 Lakh net surplus quarterly</strong> compared to a ₹2.9 Lakh deficit under baseline municipal operations.
            </span>
          </div>
          <span className="font-mono text-sage-800 font-bold whitespace-nowrap hidden sm:inline">
            ROI: ~14.2 Months Payback
          </span>
        </div>
      </SectionCard>

      {/* Loop Step Navigation */}
      <LoopStepNav
        currentStep={7}
        prevPath="/allocate"
        prevLabel="5–6 · Where Waste Goes & Energy"
      />

    </div>
  );
};
