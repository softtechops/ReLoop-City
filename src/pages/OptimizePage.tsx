import React, { useState, useMemo } from 'react';
import { useStore } from '../store/useStore';
import { generateReLoopRoutes } from '../sim/routing';
import { MapContainer, TileLayer, Marker, Popup, Polyline, CircleMarker } from 'react-leaflet';
import L from 'leaflet';
import confetti from 'canvas-confetti';
import { 
  Route as RouteIcon, 
  Sparkles, 
  Truck, 
  Fuel, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight,
  TrendingDown,
  Layers,
  Clock,
  Gauge,
  Calendar,
  Zap
} from 'lucide-react';

const depotIcon = L.divIcon({
  className: 'custom-depot-pin',
  html: `<div style="background-color: #12305C; color: white; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 2px solid white; box-shadow: 0 4px 10px rgba(18, 48, 92, 0.4); font-size: 13px;">🏢</div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 16],
});

export const OptimizePage: React.FC = () => {
  const { simState, config, setSelectedBin, setActivePage } = useStore();
  const [isSolving, setIsSolving] = useState(false);
  const [activeTruckFilter, setActiveTruckFilter] = useState<string>('all');
  const [solveCount, setSolveCount] = useState(0);

  // Compute routes dynamically using CVRP heuristic (Nearest-Neighbor + 2-Opt)
  const { routes, comparison } = useMemo(() => {
    return generateReLoopRoutes(simState.bins, config);
  }, [simState.bins, config, solveCount]);

  const handleGenerateRoutes = () => {
    setIsSolving(true);
    setTimeout(() => {
      setSolveCount((c) => c + 1);
      setIsSolving(false);
      try {
        confetti({
          particleCount: 45,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#12305C', '#7BA17D', '#D9A441'],
        });
      } catch (e) {
        // ignore in non-browser env
      }
    }, 450);
  };

  const displayedRoutes = activeTruckFilter === 'all' 
    ? routes 
    : routes.filter((r) => r.truckId === activeTruckFilter);

  return (
    <div className="space-y-6 pb-12">
      
      {/* Top Controller Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white border border-navy-100 shadow-blueprint">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-navy-800 font-['Outfit']">
              Dynamic CVRP Route Optimization (Step 3: Optimize)
            </h1>
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-navy-100 text-navy-800 flex items-center gap-1">
              <RouteIcon className="w-3 h-3 text-navy-700" />
              Nearest-Neighbor + 2-Opt Heuristic
            </span>
          </div>
          <p className="text-xs text-charcoal-500 mt-1">
            Capacity-constrained vehicle routing collecting only bins predicted ≥75% full, eliminating wasted empty trips.
          </p>
        </div>

        {/* Generate Routes Button */}
        <button
          id="btn-generate-routes"
          onClick={handleGenerateRoutes}
          disabled={isSolving}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-navy-700 hover:bg-navy-800 text-white font-bold text-xs sm:text-sm shadow-md shadow-navy-700/20 transition-all hover:scale-102 active:scale-98 disabled:opacity-50"
        >
          <Sparkles className={`w-4 h-4 text-amberGold-400 ${isSolving ? 'animate-spin' : ''}`} />
          <span>{isSolving ? 'Solving 2-Opt TSP...' : 'Recalculate Dynamic Routes'}</span>
        </button>
      </div>

      {/* Comparison Table: Baseline vs ReLoop */}
      <div className="bg-white rounded-2xl border border-navy-100 shadow-blueprint p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="font-bold text-base text-navy-800 font-['Outfit']">
              Routing Fleet Efficiency Comparison
            </h2>
            <p className="text-xs text-charcoal-400">
              Direct benchmark: Baseline static daily routes vs ReLoop predictive dynamic routes
            </p>
          </div>
          <span className="px-3 py-1 rounded-full bg-sage-100 text-sage-800 font-bold text-xs">
            -{comparison.savings.distanceReductionPercent}% Distance Reduction
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-navy-100 text-charcoal-400 uppercase tracking-wider text-[11px]">
                <th className="pb-3 font-bold">Logistics Metric</th>
                <th className="pb-3 font-bold text-residual-600">Baseline (Fixed Grid)</th>
                <th className="pb-3 font-bold text-navy-700">ReLoop (AI-Optimized)</th>
                <th className="pb-3 font-bold text-right text-sage-700">Net Municipal Benefit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-50">
              <tr>
                <td className="py-3 font-semibold text-charcoal-700">Total Route Distance (km)</td>
                <td className="py-3 font-mono font-medium text-charcoal-600">{comparison.baseline.totalDistanceKm} km</td>
                <td className="py-3 font-mono font-bold text-navy-800">{comparison.reloop.totalDistanceKm} km</td>
                <td className="py-3 text-right">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-sage-100 text-sage-800 font-bold text-[11px]">
                    <TrendingDown className="w-3 h-3" />
                    -{comparison.savings.distanceReductionPercent}% Saved
                  </span>
                </td>
              </tr>
              <tr>
                <td className="py-3 font-semibold text-charcoal-700">Smart Bins Visited</td>
                <td className="py-3 text-charcoal-600">
                  {comparison.baseline.binsVisited} bins <span className="text-[10px] text-red-500">({comparison.baseline.unnecessaryEmptyVisits} &lt;50% full)</span>
                </td>
                <td className="py-3 font-bold text-navy-800">
                  {comparison.reloop.binsVisited} priority bins <span className="text-[10px] text-sage-600">(≥75% full only)</span>
                </td>
                <td className="py-3 text-right text-sage-700 font-bold">
                  Zero wasted trips to empty bins
                </td>
              </tr>
              <tr>
                <td className="py-3 font-semibold text-charcoal-700">Missed Overflow Incidents</td>
                <td className="py-3 text-red-600 font-semibold">{comparison.baseline.overflowMissedBins} bin spills</td>
                <td className="py-3 text-sage-700 font-bold">0 spills (Preempted)</td>
                <td className="py-3 text-right text-sage-700 font-bold">
                  100% overflow preemption
                </td>
              </tr>
              <tr>
                <td className="py-3 font-semibold text-charcoal-700">Fleet Diesel Consumed (L)</td>
                <td className="py-3 font-mono text-charcoal-600">{comparison.baseline.fuelLiters} L</td>
                <td className="py-3 font-mono font-bold text-navy-800">{comparison.reloop.fuelLiters} L</td>
                <td className="py-3 text-right text-sage-700 font-bold">
                  -{comparison.savings.fuelSavedLiters} L diesel saved
                </td>
              </tr>
              <tr>
                <td className="py-3 font-semibold text-charcoal-700">Fleet Fuel Cost (₹)</td>
                <td className="py-3 font-mono text-charcoal-600">₹{comparison.baseline.dieselCostInr.toLocaleString()}</td>
                <td className="py-3 font-mono font-bold text-navy-800">₹{comparison.reloop.dieselCostInr.toLocaleString()}</td>
                <td className="py-3 text-right text-sage-700 font-bold">
                  ₹{comparison.savings.fuelCostSavedInr.toLocaleString()} saved / day
                </td>
              </tr>
              <tr>
                <td className="py-3 font-semibold text-charcoal-700">Vehicle Tailpipe CO₂ (kg)</td>
                <td className="py-3 font-mono text-charcoal-600">{comparison.baseline.co2EmittedKg} kg CO₂</td>
                <td className="py-3 font-mono font-bold text-navy-800">{comparison.reloop.co2EmittedKg} kg CO₂</td>
                <td className="py-3 text-right text-sage-700 font-bold">
                  -{comparison.savings.co2SavedKg} kg CO₂ avoided
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Map with Color-Coded Polylines & Truck Manifest */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Map View */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-navy-100 shadow-blueprint overflow-hidden flex flex-col h-[520px] relative">
          
          <div className="px-4 py-2.5 bg-navy-50/90 border-b border-navy-100 flex items-center justify-between text-xs z-10">
            <div className="flex items-center gap-2">
              <span className="font-bold text-navy-800">Active Truck Routes:</span>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setActiveTruckFilter('all')}
                  className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                    activeTruckFilter === 'all' ? 'bg-navy-700 text-white' : 'bg-white text-charcoal-600'
                  }`}
                >
                  All 4 Trucks
                </button>
                {routes.map((r) => (
                  <button
                    key={r.truckId}
                    onClick={() => setActiveTruckFilter(r.truckId)}
                    className={`px-2 py-0.5 rounded text-[11px] font-bold flex items-center gap-1 ${
                      activeTruckFilter === r.truckId ? 'bg-navy-700 text-white' : 'bg-white text-charcoal-600'
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: r.color }}></span>
                    <span>{r.truckId}</span>
                  </button>
                ))}
              </div>
            </div>
            <span className="text-[11px] text-charcoal-400 font-mono">
              Total {comparison.reloop.totalDistanceKm} km
            </span>
          </div>

          <div className="flex-1 w-full h-full relative">
            <MapContainer
              center={[18.648, 73.785]}
              zoom={13}
              scrollWheelZoom={true}
              style={{ width: '100%', height: '100%' }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              {/* Central Municipal Depot Marker */}
              <Marker position={config.depotCoordinates} icon={depotIcon}>
                <Popup>
                  <div className="text-xs p-1">
                    <span className="font-bold">Central Municipal Depot</span>
                    <p className="text-charcoal-500">Fleet Starting & Ending Station</p>
                  </div>
                </Popup>
              </Marker>

              {/* Draw Truck Polylines */}
              {displayedRoutes.map((route) => {
                if (route.pathCoordinates.length <= 1) return null;
                return (
                  <Polyline
                    key={route.truckId}
                    positions={route.pathCoordinates}
                    pathOptions={{
                      color: route.color,
                      weight: 4,
                      opacity: 0.85,
                      dashArray: route.truckId === 'TRUCK-02' ? '6 6' : undefined,
                    }}
                  >
                    <Popup>
                      <div className="text-xs p-1 space-y-1">
                        <span className="font-bold" style={{ color: route.color }}>{route.truckName}</span>
                        <p>{route.binIds.length} stops • {route.totalDistanceKm} km</p>
                        <p>Load: {route.collectedKg} kg ({route.utilizationPercent}%)</p>
                      </div>
                    </Popup>
                  </Polyline>
                );
              })}

              {/* Draw Visited Bins */}
              {simState.bins.map((bin) => {
                const assignedRoute = routes.find((r) => r.binIds.includes(bin.id));
                const isAssigned = !!assignedRoute;
                if (!isAssigned && activeTruckFilter !== 'all') return null;

                return (
                  <CircleMarker
                    key={bin.id}
                    center={[bin.lat, bin.lng]}
                    radius={isAssigned ? 7 : 4}
                    pathOptions={{
                      color: isAssigned ? assignedRoute.color : '#CBD5E1',
                      weight: isAssigned ? 2.5 : 1,
                      fillColor: isAssigned ? assignedRoute.color : '#FFFFFF',
                      fillOpacity: isAssigned ? 0.9 : 0.4,
                    }}
                    eventHandlers={{
                      click: () => setSelectedBin(bin),
                    }}
                  >
                    <Popup>
                      <div className="text-xs p-1">
                        <span className="font-bold">{bin.id}</span>
                        <p className="text-charcoal-500">{bin.fillPercent}% full</p>
                        {isAssigned && (
                          <p className="font-semibold" style={{ color: assignedRoute.color }}>
                            Picked by {assignedRoute.truckName}
                          </p>
                        )}
                      </div>
                    </Popup>
                  </CircleMarker>
                );
              })}
            </MapContainer>
          </div>

        </div>

        {/* Right: Truck Manifest Cards */}
        <div className="lg:col-span-4 space-y-3 h-[520px] overflow-y-auto pr-1">
          <div className="flex items-center justify-between pb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-charcoal-400">
              Fleet Manifest (4 Compactor Trucks)
            </span>
          </div>

          {routes.map((route) => (
            <div
              key={route.truckId}
              className="p-4 rounded-xl bg-white border border-navy-100 shadow-blueprint space-y-2 hover:border-navy-300 transition-all"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: route.color }}
                  ></span>
                  <div>
                    <h3 className="font-bold text-xs text-navy-900">{route.truckName}</h3>
                    <span className="text-[10px] text-charcoal-400 font-mono">{route.truckId}</span>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-navy-50 text-navy-800">
                  {route.binIds.length} Bins
                </span>
              </div>

              {/* Progress Payload */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] text-charcoal-600">
                  <span>Payload: {(route.collectedKg / 1000).toFixed(2)} t</span>
                  <span className="font-bold">{route.utilizationPercent}% capacity</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-navy-100 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${route.utilizationPercent}%`, backgroundColor: route.color }}
                  ></div>
                </div>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-navy-50 text-center text-[11px]">
                <div className="p-1 rounded bg-navy-50/50">
                  <span className="text-charcoal-400 block text-[10px]">Distance</span>
                  <span className="font-bold text-navy-800">{route.totalDistanceKm} km</span>
                </div>
                <div className="p-1 rounded bg-navy-50/50">
                  <span className="text-charcoal-400 block text-[10px]">Fuel</span>
                  <span className="font-bold text-navy-800">{route.fuelLiters} L</span>
                </div>
                <div className="p-1 rounded bg-navy-50/50">
                  <span className="text-charcoal-400 block text-[10px]">Time</span>
                  <span className="font-bold text-navy-800">{route.estimatedHours}h</span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

    </div>
  );
};
