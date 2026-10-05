import React, { useMemo } from 'react';
import { useStore } from '../../store/useStore';
import { PILOT_30DAY_SNAPSHOT } from '../../lib/metrics';

export const LiveTicker: React.FC = () => {
  const bins = useStore((s) => s.simState.bins);
  const truckCount = useStore((s) => s.config.numberOfTrucks);
  const today = useStore((s) => s.simState.todayReloop);
  const snap = PILOT_30DAY_SNAPSHOT.reloop;

  const items = useMemo(() => {
    const over80 = bins.filter((b) => b.fillPercent >= 80).length;
    const scheduled = bins.filter((b) => b.isScheduledForPickup).length;
    const enRoute = scheduled > 0 ? Math.max(1, Math.min(truckCount, Math.ceil(scheduled / 8))) : truckCount;
    const kwh = today.energyGeneratedMwh > 0 ? today.energyGeneratedMwh * 1000 : snap.energyMwh * 33;
    const revenue = today.revenueGeneratedInr > 0 ? today.revenueGeneratedInr : snap.revenueInr / 30;
    const row = [
      `${over80} bins above 80% fill`,
      `${enRoute} trucks en route`,
      `${kwh.toFixed(0)} kWh generated today`,
      `₹${Math.round(revenue).toLocaleString('en-IN')} revenue today`,
    ];
    return [...row, ...row, ...row, ...row];
  }, [bins, truckCount, today, snap]);

  return (
    <div className="relative border-y border-white/10 bg-[#060B14] overflow-hidden" aria-label="Live simulation ticker">
      <div className="flex items-center gap-3 px-4 py-2.5">
        <span className="live-dot flex-shrink-0" aria-hidden="true" />
        <span className="text-[11px] font-mono uppercase tracking-widest text-emerald-300 flex-shrink-0">Live</span>
        <div className="overflow-hidden flex-1">
          <div className="flex gap-10 whitespace-nowrap animate-[ticker_28s_linear_infinite] w-max">
            {items.map((item, i) => (
              <span key={`${item}-${i}`} className="text-sm text-slate-200 font-medium tabular-nums">
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
