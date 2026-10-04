import React, { useState, useMemo } from 'react';
import { useStore } from '../store/useStore';
import { generateZoneForecasts, calculateHotspots } from '../sim/predictor';
import { PILOT_ZONES } from '../config/config';
import { 
  TrendingUp, 
  AlertTriangle, 
  Flame, 
  Clock, 
  Filter, 
  Sparkles, 
  CheckCircle2, 
  ArrowUpRight,
  Layers,
  BarChart2,
  Calendar
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  Legend 
} from 'recharts';

export const PredictPage: React.FC = () => {
  const { simState, setSelectedBin, setActivePage } = useStore();
  const [horizon, setHorizon] = useState<24 | 48 | 72>(48);
  const [selectedZoneTab, setSelectedZoneTab] = useState<string>('all');

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

  // Critical bins filter
  const urgentHotspots = hotspots.filter((h) => h.riskLevel === 'CRITICAL' || h.predictedHoursToFull <= 5);

  const handleInspectBin = (binId: string) => {
    const bin = simState.bins.find((b) => b.id === binId);
    if (bin) {
      setSelectedBin(bin);
      setActivePage('map');
    }
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white border border-navy-100 shadow-blueprint">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-navy-800 font-['Outfit']">
              Predictive Generation Forecasting (Step 2: Predict)
            </h1>
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-amberGold-100 text-amberGold-800 flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-amberGold-600" />
              Diurnal + Seasonality AI Model
            </span>
          </div>
          <p className="text-xs text-charcoal-500 mt-1">
            Machine learning forecast projecting generation surge curves across 5 Pune pilot zones for proactive resource pre-allocation.
          </p>
        </div>

        {/* Horizon Selector */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="text-xs text-charcoal-400 font-semibold">Forecast Horizon:</span>
          <div className="inline-flex p-1 rounded-xl bg-navy-50 border border-navy-100 text-xs font-bold">
            {([24, 48, 72] as const).map((h) => (
              <button
                key={h}
                onClick={() => setHorizon(h)}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  horizon === h
                    ? 'bg-navy-700 text-white shadow-xs'
                    : 'text-charcoal-600 hover:text-navy-800'
                }`}
              >
                +{h}h
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Per-Zone Volume Forecast Multi-Area Chart */}
      <div className="p-6 rounded-2xl bg-white border border-navy-100 shadow-blueprint space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="font-bold text-base text-navy-800 font-['Outfit']">
              Projected Generation Curves (+{horizon} Hours)
            </h2>
            <p className="text-xs text-charcoal-400">
              Stacked hourly tonnage output by zone accounting for morning/evening human peak cycles
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-sage-700">
              <span className="w-2.5 h-2.5 rounded-full bg-sage-500"></span> Residential
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-navy-700">
              <span className="w-2.5 h-2.5 rounded-full bg-navy-700"></span> Commercial
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amberGold-600">
              <span className="w-2.5 h-2.5 rounded-full bg-amberGold-500"></span> Mandi Market
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-charcoal-600">
              <span className="w-2.5 h-2.5 rounded-full bg-residual-500"></span> C&D Corridor
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span> PCCOE Campus
            </span>
          </div>
        </div>

        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={forecastData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F0F4FA" />
              <XAxis dataKey="timeLabel" stroke="#757E81" fontSize={10} tickLine={false} interval={Math.floor(horizon / 8)} />
              <YAxis stroke="#757E81" fontSize={10} tickLine={false} unit=" t" />
              <RechartsTooltip 
                formatter={(val: any) => [`${Number(val).toFixed(2)} tonnes/hr`, 'Rate']}
                contentStyle={{ borderRadius: '0.75rem', border: '1px solid #D9E4F2', fontSize: '11px' }}
              />
              <Area type="monotone" dataKey="residential" name="Residential" stackId="1" stroke="#7BA17D" fill="#7BA17D" fillOpacity={0.6} />
              <Area type="monotone" dataKey="commercial" name="Commercial Hub" stackId="1" stroke="#12305C" fill="#12305C" fillOpacity={0.6} />
              <Area type="monotone" dataKey="market" name="Wholesale Mandi" stackId="1" stroke="#D9A441" fill="#D9A441" fillOpacity={0.6} />
              <Area type="monotone" dataKey="construction" name="C&D Corridor" stackId="1" stroke="#8E9296" fill="#8E9296" fillOpacity={0.6} />
              <Area type="monotone" dataKey="institutional" name="PCCOE Campus" stackId="1" stroke="#4D84BE" fill="#4D84BE" fillOpacity={0.6} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="p-3 rounded-xl bg-navy-50/70 border border-navy-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-navy-800">
            <Sparkles className="w-4 h-4 text-amberGold-500" />
            <span className="font-semibold">AI Generation Peak Alert:</span>
            <span className="text-charcoal-600">
              Mandi Wholesale Market peaks tomorrow 05:30 - 09:30 (+2.1x normal rate). Recommended compactor dispatch pre-scheduled.
            </span>
          </div>
          <span className="font-mono text-[11px] text-charcoal-500 whitespace-nowrap font-bold">
            Total Horizon Load: {forecastData.reduce((acc, f) => acc + f.totalTonnes, 0).toFixed(1)} t
          </span>
        </div>
      </div>

      {/* Hotspots Heatmap / Ranking & "Predicted Full in X Hours" List */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Hotspot Ranking by Zone */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-navy-100 shadow-blueprint p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-bold text-base text-navy-800 font-['Outfit']">
                Zone Hotspot Severity
              </h2>
              <p className="text-xs text-charcoal-400">Risk ranking by fill acceleration & density</p>
            </div>
            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-red-100 text-red-700">
              Risk Ranked
            </span>
          </div>

          <div className="space-y-3">
            {PILOT_ZONES.map((zone, idx) => {
              const zoneBins = simState.bins.filter((b) => b.zoneId === zone.id);
              const avgFill = Math.round(
                zoneBins.reduce((sum, b) => sum + b.fillPercent, 0) / zoneBins.length
              );
              const urgentInZone = zoneBins.filter((b) => b.fillPercent >= 80).length;

              return (
                <div key={zone.id} className="p-3.5 rounded-xl border border-navy-100 bg-[#F7F6F2]/40 hover:bg-navy-50/40 transition-colors space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-md bg-navy-700 text-white text-[10px] font-bold flex items-center justify-center font-mono">
                        #{idx + 1}
                      </span>
                      <span className="font-bold text-xs text-navy-900">{zone.name.split(':')[1] || zone.name}</span>
                    </div>
                    <span className={`text-xs font-black ${
                      avgFill >= 70 ? 'text-red-600' : avgFill >= 50 ? 'text-amberGold-600' : 'text-sage-600'
                    }`}>
                      {avgFill}% Avg Fill
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full h-2 rounded-full bg-navy-100 overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${
                        avgFill >= 70 ? 'bg-red-500' : avgFill >= 50 ? 'bg-amberGold-500' : 'bg-sage-500'
                      }`}
                      style={{ width: `${avgFill}%` }}
                    ></div>
                  </div>

                  <div className="flex justify-between items-center text-[11px] text-charcoal-500">
                    <span>{zone.binCount} Smart Bins monitored</span>
                    <span className={`font-semibold ${urgentInZone > 0 ? 'text-red-600' : 'text-sage-600'}`}>
                      {urgentInZone} near overflow
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* "Predicted Full in X Hours" List Table */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-navy-100 shadow-blueprint p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-bold text-base text-navy-800 font-['Outfit']">
                Predicted Full in X Hours (Critical Alert Queue)
              </h2>
              <p className="text-xs text-charcoal-400">
                Prioritized queue of smart bins nearing capacity within the next 8 hours
              </p>
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-800 flex items-center gap-1">
              <Flame className="w-3 h-3 text-red-600" />
              {urgentHotspots.length} Priority Alerts
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-navy-100 text-charcoal-400 text-[11px] uppercase tracking-wider">
                  <th className="pb-2.5 font-bold">Bin ID & Zone</th>
                  <th className="pb-2.5 font-bold">Current Fill</th>
                  <th className="pb-2.5 font-bold">Time to Full</th>
                  <th className="pb-2.5 font-bold">Overflow Risk</th>
                  <th className="pb-2.5 font-bold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-50">
                {hotspots.slice(0, 7).map((item) => (
                  <tr key={item.binId} className="hover:bg-navy-50/50 transition-colors">
                    <td className="py-2.5 font-medium text-navy-800">
                      <span className="font-bold block text-xs">{item.binId}</span>
                      <span className="text-[10px] text-charcoal-400">{item.zoneName.split(':')[0]}</span>
                    </td>
                    <td className="py-2.5">
                      <span className={`font-black font-mono text-xs ${
                        item.currentFill >= 80 ? 'text-red-500' : 'text-amberGold-600'
                      }`}>
                        {item.currentFill}%
                      </span>
                    </td>
                    <td className="py-2.5">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold bg-navy-50 text-navy-800">
                        <Clock className="w-3 h-3 text-navy-600" />
                        {item.predictedHoursToFull}h
                      </span>
                    </td>
                    <td className="py-2.5">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        item.riskLevel === 'CRITICAL' 
                          ? 'bg-red-100 text-red-800' 
                          : item.riskLevel === 'HIGH' 
                          ? 'bg-amberGold-100 text-amberGold-800' 
                          : 'bg-sage-100 text-sage-800'
                      }`}>
                        {item.overflowRiskProbability}% {item.riskLevel}
                      </span>
                    </td>
                    <td className="py-2.5 text-right">
                      <button
                        onClick={() => handleInspectBin(item.binId)}
                        className="px-2.5 py-1 rounded-lg bg-navy-50 hover:bg-navy-700 hover:text-white text-navy-700 text-[11px] font-semibold transition-colors"
                      >
                        Locate Pin
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="pt-2 border-t border-navy-50 flex items-center justify-between text-xs text-charcoal-500">
            <span>Dynamic routes incorporate these predictions automatically</span>
            <button
              onClick={() => setActivePage('optimize')}
              className="text-navy-700 hover:underline font-bold flex items-center gap-1"
            >
              <span>Solve Routes in Step 3</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
