import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { generateZoneForecasts, calculateHotspots } from '../sim/predictor';
import { PILOT_ZONES } from '../config/config';
import { PageHeader } from '../components/ui/PageHeader';
import { LoopStepNav } from '../components/ui/LoopStepNav';
import { SectionCard } from '../components/ui/SectionCard';
import { Tabs } from '../components/ui/Tabs';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { 
  TrendingUp, 
  Flame, 
  Clock, 
  Sparkles, 
  ArrowUpRight, 
  MapPin 
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip 
} from 'recharts';
import { useChartTheme } from '../lib/chartTheme';

export const PredictPage: React.FC = () => {
  const { simState, setSelectedBin, flaggedZoneId, setFlaggedZoneId } = useStore();
  const navigate = useNavigate();
  const [horizon, setHorizon] = useState<24 | 48 | 72>(48);
  const chartTheme = useChartTheme();

  // Compute forecasts dynamically based on current simulation clock
  const forecastData = useMemo(() => {
    return generateZoneForecasts(
      simState.currentHour,
      simState.currentDayOfWeekIndex,
      horizon
    );
  }, [simState.currentHour, simState.currentDayOfWeekIndex, horizon]);

  // Calculate sorted hotspots and "Predicted full in X hours"
  const hotspots = useMemo(() => {
    return calculateHotspots(simState.bins);
  }, [simState.bins]);

  const urgentHotspots = hotspots.filter((h) => h.riskLevel === 'CRITICAL' || h.predictedHoursToFull <= 5);

  const handleInspectBin = (binId: string) => {
    const bin = simState.bins.find((b) => b.id === binId);
    if (bin) {
      setSelectedBin(bin);
      navigate('/app/map');
    }
  };

  return (
    <div className="space-y-6 pb-16">
      
      {/* Page Header */}
      <PageHeader
        title="Predict · Waste forecast"
        subtitle="Machine learning time-series model projecting generation surge curves across 5 Pune pilot zones for proactive resource pre-allocation."
        decisionPrompt="Where will overflow happen in the next 48 hours?"
        stepNumber={2}
        stepName="Predict"
        actions={
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-fg-muted">Forecast Horizon:</span>
            <Tabs
              tabs={[
                { id: '24' as const, label: '+24h' },
                { id: '48' as const, label: '+48h' },
                { id: '72' as const, label: '+72h' },
              ]}
              activeTab={String(horizon) as '24' | '48' | '72'}
              onChange={(val) => setHorizon(Number(val) as 24 | 48 | 72)}
              ariaLabel="Forecast time horizon"
            />
          </div>
        }
      />

      {/* One-Line Top Headline Result (Phase 4 requirement) */}
      <div className="p-4 sm:p-5 rounded-2xl bg-surface border border-line shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="p-2.5 rounded-xl bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 flex-shrink-0" aria-hidden="true">
            <TrendingUp className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          </span>
          <div>
            <div className="text-xs uppercase font-bold tracking-wider text-fg-subtle">
              Seasonality & Preemption Model
            </div>
            <p className="text-sm sm:text-base font-bold text-fg leading-snug">
              Time-series models project waste curves across 5 zones: {urgentHotspots.length} imminent bin surges preempted before overflow.
            </p>
          </div>
        </div>
        <Badge variant={urgentHotspots.length > 0 ? 'amber' : 'emerald'} size="md">
          {urgentHotspots.length} High-Risk Hotspots Preempted
        </Badge>
      </div>

      {/* Per-Zone Volume Forecast Multi-Area Chart */}
      <SectionCard
        title={`Projected Generation Curves (+${horizon} Hours)`}
        subtitle="Stacked hourly tonnage output by zone accounting for morning/evening human peak cycles"
        headerAction={
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="inline-flex items-center gap-1 font-semibold text-fg">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" aria-hidden="true" /> Residential
            </span>
            <span className="inline-flex items-center gap-1 font-semibold text-fg">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-500" aria-hidden="true" /> Commercial
            </span>
            <span className="inline-flex items-center gap-1 font-semibold text-fg">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" aria-hidden="true" /> Mandi Market
            </span>
            <span className="inline-flex items-center gap-1 font-semibold text-fg">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-400" aria-hidden="true" /> C&D Corridor
            </span>
            <span className="inline-flex items-center gap-1 font-semibold text-fg">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" aria-hidden="true" /> PCCOE Campus
            </span>
          </div>
        }
      >
        <div className="h-72" aria-label={`Stacked area chart forecasting waste tonnage over next ${horizon} hours`}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={forecastData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={chartTheme.gridColor} />
              <XAxis dataKey="timeLabel" stroke={chartTheme.axisColor} fontSize={11} tickLine={false} interval={Math.floor(horizon / 8)} />
              <YAxis stroke={chartTheme.axisColor} fontSize={11} tickLine={false} unit=" t" />
              <RechartsTooltip 
                formatter={(val: any) => [`${Number(val).toFixed(2)} tonnes/hr`, 'Rate']}
                contentStyle={chartTheme.tooltipStyle}
              />
              <Area type="monotone" dataKey="residential" name="Residential" stackId="1" stroke="#10B981" fill="#10B981" fillOpacity={0.6} />
              <Area type="monotone" dataKey="commercial" name="Commercial Hub" stackId="1" stroke="#0284C7" fill="#0284C7" fillOpacity={0.6} />
              <Area type="monotone" dataKey="market" name="Wholesale Mandi" stackId="1" stroke="#F59E0B" fill="#F59E0B" fillOpacity={0.6} />
              <Area type="monotone" dataKey="construction" name="C&D Corridor" stackId="1" stroke="#64748B" fill="#64748B" fillOpacity={0.6} />
              <Area type="monotone" dataKey="institutional" name="PCCOE Campus" stackId="1" stroke="#6366F1" fill="#6366F1" fillOpacity={0.6} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="p-3.5 rounded-xl bg-surface-muted border border-line flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs mt-4">
          <div className="flex items-center gap-2 text-fg">
            <Sparkles className="w-4 h-4 text-amber-500 flex-shrink-0" aria-hidden="true" />
            <span className="font-bold">AI Generation Peak Alert:</span>
            <span className="text-fg-muted">
              Mandi Wholesale Market peaks early morning 05:30 - 09:30 (+2.1x normal rate). Recommended compactor dispatch pre-scheduled.
            </span>
          </div>
          <span className="font-mono text-xs text-fg-muted whitespace-nowrap font-bold">
            Total Horizon Load: {forecastData.reduce((acc, f) => acc + f.totalTonnes, 0).toFixed(1)} t
          </span>
        </div>
      </SectionCard>

      {/* Hotspots Ranking & "Predicted Full in X Hours" List */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Hotspot Ranking by Zone */}
        <div className="lg:col-span-5">
          <SectionCard
            title="Zone Hotspot Severity"
            subtitle="Risk ranking by fill acceleration & density"
            headerAction={<Badge variant="red" size="sm">Risk Ranked</Badge>}
          >
            <div className="space-y-3">
              {PILOT_ZONES.map((zone, idx) => {
                const zoneBins = simState.bins.filter((b) => b.zoneId === zone.id);
                const avgFill = Math.round(
                  zoneBins.reduce((sum, b) => sum + b.fillPercent, 0) / zoneBins.length
                );
                const urgentInZone = zoneBins.filter((b) => b.fillPercent >= 80).length;

                return (
                  <div key={zone.id} className="p-3.5 rounded-xl border border-line bg-surface-muted hover:bg-emerald-500/10 transition-colors space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-md bg-emerald-600 text-white text-xs font-bold flex items-center justify-center font-mono">
                          #{idx + 1}
                        </span>
                        <span className="font-bold text-xs text-fg">{zone.name.split(':')[1] || zone.name}</span>
                      </div>
                      <span className={`text-xs font-black ${
                        avgFill >= 70 ? 'text-rose-600 dark:text-rose-400' : avgFill >= 50 ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'
                      }`}>
                        {avgFill}% Avg Fill
                      </span>
                    </div>

                    <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${
                          avgFill >= 70 ? 'bg-rose-600' : avgFill >= 50 ? 'bg-amber-500' : 'bg-emerald-500'
                        }`}
                        style={{ width: `${avgFill}%` }}
                      />
                    </div>

                    <div className="flex justify-between items-center text-xs text-fg-muted">
                      <span>{zone.binCount} Smart Bins monitored</span>
                      <span className={`font-semibold ${urgentInZone > 0 ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                        {urgentInZone} near overflow
                      </span>
                    </div>

                    <div className="pt-1 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => setFlaggedZoneId(flaggedZoneId === zone.id ? null : zone.id)}
                        className={`w-full py-1.5 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 min-h-[36px] cursor-pointer ${
                          flaggedZoneId === zone.id
                            ? 'bg-amber-500 text-white shadow-xs'
                            : 'bg-surface hover:bg-surface-muted text-fg border border-line'
                        }`}
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>
                          {flaggedZoneId === zone.id
                            ? '★ Advance Dispatch Prioritized'
                            : 'Prioritize for Advance Dispatch'}
                        </span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </SectionCard>
        </div>

        {/* "Predicted Full in X Hours" List Table */}
        <div className="lg:col-span-7">
          <SectionCard
            title="Predicted Full in X Hours"
            subtitle="Prioritized queue of smart bins nearing capacity within 8 hours"
            headerAction={
              <Badge variant="red" size="sm">
                <Flame className="w-3 h-3 text-rose-600 dark:text-rose-400" aria-hidden="true" />
                <span>{urgentHotspots.length} Priority Alerts</span>
              </Badge>
            }
          >
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <caption className="sr-only">List of bins predicted to be full soon</caption>
                <thead>
                  <tr className="border-b border-line text-fg-subtle text-xs uppercase tracking-wider">
                    <th scope="col" className="pb-2.5 font-bold">Bin ID & Zone</th>
                    <th scope="col" className="pb-2.5 font-bold">Current Fill</th>
                    <th scope="col" className="pb-2.5 font-bold">Time to Full</th>
                    <th scope="col" className="pb-2.5 font-bold">Risk Level</th>
                    <th scope="col" className="pb-2.5 font-bold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {hotspots.slice(0, 7).map((item) => (
                    <tr key={item.binId} className="hover:bg-surface-muted transition-colors">
                      <td className="py-2.5 font-medium text-fg">
                        <span className="font-bold block text-xs">{item.binId}</span>
                        <span className="text-xs text-fg-muted">{item.zoneName.split(':')[0]}</span>
                      </td>
                      <td className="py-2.5">
                        <span className={`font-black font-mono text-xs ${
                          item.currentFill >= 80 ? 'text-rose-600 dark:text-rose-400' : 'text-amber-600 dark:text-amber-400'
                        }`}>
                          {item.currentFill}%
                        </span>
                      </td>
                      <td className="py-2.5">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-bold bg-surface-muted border border-line text-fg">
                          <Clock className="w-3 h-3 text-fg-subtle" aria-hidden="true" />
                          {item.predictedHoursToFull}h
                        </span>
                      </td>
                      <td className="py-2.5">
                        <Badge
                          variant={item.riskLevel === 'CRITICAL' ? 'red' : item.riskLevel === 'HIGH' ? 'amber' : 'sage'}
                          size="sm"
                        >
                          {item.overflowRiskProbability}% {item.riskLevel}
                        </Badge>
                      </td>
                      <td className="py-2.5 text-right">
                        <Button
                          variant="secondary"
                          size="sm"
                          icon={<MapPin className="w-3 h-3" />}
                          onClick={() => handleInspectBin(item.binId)}
                        >
                          Locate
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="pt-3 mt-3 border-t border-line flex items-center justify-between text-xs text-fg-muted">
              <span>Dynamic routes incorporate these predictions automatically</span>
              <Button
                variant="ghost"
                size="sm"
                icon={<ArrowUpRight className="w-3.5 h-3.5" />}
                iconPosition="right"
                onClick={() => navigate('/app/optimize')}
                className="min-h-[44px] text-sm"
              >
                Solve Routes in Step 3
              </Button>
            </div>
          </SectionCard>
        </div>

      </div>

      {/* Loop Step Navigation */}
      <LoopStepNav
        currentStep={2}
        prevPath="/app/map"
        prevLabel="Sense · Live bin map"
        nextPath="/app/optimize"
        nextLabel="Optimize · Smart routes"
      />

    </div>
  );
};
