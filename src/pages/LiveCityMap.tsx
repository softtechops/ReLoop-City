import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { SmartBin, WasteStreamType } from '../types';
import { PILOT_ZONES } from '../config/config';
import { MapContainer, TileLayer, Marker, Popup, CircleMarker, useMap } from 'react-leaflet';
import L from 'leaflet';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  FastForward, 
  Radio, 
  Clock, 
  AlertTriangle, 
  Filter, 
  Sparkles, 
  Maximize2,
  Layers,
  MapPin,
  CheckCircle2,
  Flame,
  Truck
} from 'lucide-react';

// Custom icons using Leaflet DivIcon
const depotIcon = L.divIcon({
  className: 'custom-depot-pin',
  html: `<div style="background-color: #12305C; color: white; width: 34px; height: 34px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 2.5px solid white; box-shadow: 0 4px 12px rgba(18, 48, 92, 0.4); font-weight: bold; font-size: 14px;">🏢</div>`,
  iconSize: [34, 34],
  iconAnchor: [17, 17],
});

const mrfIcon = L.divIcon({
  className: 'custom-mrf-pin',
  html: `<div style="background-color: #7BA17D; color: white; width: 34px; height: 34px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 2.5px solid white; box-shadow: 0 4px 12px rgba(123, 161, 125, 0.4); font-weight: bold; font-size: 14px;">♻️</div>`,
  iconSize: [34, 34],
  iconAnchor: [17, 17],
});

// Helper component to center map on selection
function MapFlyTo({ center }: { center: [number, number] }) {
  const map = useMap();
  React.useEffect(() => {
    map.flyTo(center, 14, { duration: 0.8 });
  }, [center, map]);
  return null;
}

export const LiveCityMap: React.FC = () => {
  const { 
    simState, 
    isSimRunning, 
    simSpeed, 
    startSimulation, 
    pauseSimulation, 
    setSimSpeed, 
    tickSimulation, 
    resetSimulation,
    selectedBin,
    setSelectedBin,
    config
  } = useStore();

  const [zoneFilter, setZoneFilter] = useState<string>('all');
  const [streamFilter, setStreamFilter] = useState<string>('all');

  const bins = simState.bins;

  // Filter bins
  const filteredBins = bins.filter((bin) => {
    if (zoneFilter !== 'all' && bin.zoneId !== zoneFilter) return false;
    if (streamFilter !== 'all' && bin.primaryStream !== streamFilter) return false;
    return true;
  });

  // Bin fill counts
  const criticalCount = bins.filter((b) => b.fillPercent >= 80).length;
  const mediumCount = bins.filter((b) => b.fillPercent >= 50 && b.fillPercent < 80).length;
  const normalCount = bins.filter((b) => b.fillPercent < 50).length;

  return (
    <div className="space-y-4 pb-12">
      
      {/* Top Controller Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-4 rounded-2xl bg-white border border-navy-100 shadow-blueprint">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-navy-800 font-['Outfit']">
              Live City Sensor Map (Step 1: Sense)
            </h1>
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-sage-100 text-sage-800 flex items-center gap-1">
              <Radio className="w-3 h-3 text-sage-600 animate-pulse" />
              100 IoT Telemetry Streams
            </span>
          </div>
          <p className="text-xs text-charcoal-500 mt-0.5">
            Real-time ultrasonic fill level and optical composition sensors in Pune PCMC corridor.
          </p>
        </div>

        {/* Live Filter & Controls */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {/* Zone Selector */}
          <select
            value={zoneFilter}
            onChange={(e) => setZoneFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded-xl border border-navy-100 text-xs font-semibold text-charcoal-700 bg-navy-50/50 hover:bg-navy-50 transition-colors"
          >
            <option value="all">All Pilot Zones (5)</option>
            {PILOT_ZONES.map((z) => (
              <option key={z.id} value={z.id}>{z.name}</option>
            ))}
          </select>

          {/* Stream Selector */}
          <select
            value={streamFilter}
            onChange={(e) => setStreamFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded-xl border border-navy-100 text-xs font-semibold text-charcoal-700 bg-navy-50/50 hover:bg-navy-50 transition-colors"
          >
            <option value="all">All Waste Streams</option>
            <option value="organic">Organic Wet Waste</option>
            <option value="recyclable">Dry Recyclables</option>
            <option value="cdWaste">C&D Debris</option>
            <option value="eWaste">E-Waste</option>
            <option value="residual">Residual Non-Recyclable</option>
          </select>

          {/* Map Simulation Quick Toggle */}
          <div className="flex items-center bg-navy-50 rounded-xl p-1 border border-navy-100">
            <button
              onClick={() => (isSimRunning ? pauseSimulation() : startSimulation())}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                isSimRunning ? 'bg-amberGold-400 text-navy-900 shadow-xs' : 'bg-navy-700 text-white shadow-xs'
              }`}
            >
              {isSimRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{isSimRunning ? 'Pause' : 'Simulate'}</span>
            </button>
            <button
              onClick={tickSimulation}
              disabled={isSimRunning}
              className="p-1.5 text-charcoal-600 hover:text-navy-800 disabled:opacity-40"
              title="Step +1 Hour"
            >
              <FastForward className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Map View & Detail Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* Left Map View */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-navy-100 shadow-blueprint overflow-hidden flex flex-col h-[580px] relative">
          
          {/* Map Top Status Strip */}
          <div className="px-4 py-2.5 bg-navy-50/90 border-b border-navy-100 flex items-center justify-between text-xs z-10">
            <div className="flex items-center gap-3">
              <span className="font-semibold text-charcoal-700">Fill Status:</span>
              <span className="flex items-center gap-1 text-[11px] font-bold text-red-600">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping"></span>
                Critical &gt;80% ({criticalCount})
              </span>
              <span className="flex items-center gap-1 text-[11px] font-bold text-amberGold-600">
                <span className="w-2.5 h-2.5 rounded-full bg-amberGold-500"></span>
                Moderate 50-80% ({mediumCount})
              </span>
              <span className="flex items-center gap-1 text-[11px] font-bold text-sage-600">
                <span className="w-2.5 h-2.5 rounded-full bg-sage-500"></span>
                Low &lt;50% ({normalCount})
              </span>
            </div>
            <span className="text-[11px] text-charcoal-400 font-mono hidden sm:inline">
              Showing {filteredBins.length} / {bins.length} Smart Bins
            </span>
          </div>

          {/* Leaflet Map Container */}
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

              {/* Fly to selected bin if any */}
              {selectedBin && <MapFlyTo center={[selectedBin.lat, selectedBin.lng]} />}

              {/* Central Municipal Depot Marker */}
              <Marker position={config.depotCoordinates} icon={depotIcon}>
                <Popup>
                  <div className="p-1 text-xs">
                    <span className="font-bold text-navy-800 block">Central Municipal Depot</span>
                    <span className="text-charcoal-500">Fleet HQ & Maintenance Depot (Akurdi)</span>
                  </div>
                </Popup>
              </Marker>

              {/* Material Recovery Facility Marker */}
              <Marker position={config.mrfCoordinates} icon={mrfIcon}>
                <Popup>
                  <div className="p-1 text-xs">
                    <span className="font-bold text-sage-800 block">Material Recovery Facility (MRF)</span>
                    <span className="text-charcoal-500">Automated optical sorting & baling hub</span>
                  </div>
                </Popup>
              </Marker>

              {/* Smart Bins as interactive CircleMarkers */}
              {filteredBins.map((bin) => {
                const isCritical = bin.fillPercent >= 80;
                const isMedium = bin.fillPercent >= 50 && bin.fillPercent < 80;
                const fillColor = isCritical ? '#EF4444' : isMedium ? '#D9A441' : '#7BA17D';
                const radius = isCritical ? 9 : 7;
                const isSelected = selectedBin?.id === bin.id;

                return (
                  <CircleMarker
                    key={bin.id}
                    center={[bin.lat, bin.lng]}
                    radius={radius}
                    pathOptions={{
                      color: isSelected ? '#12305C' : '#FFFFFF',
                      weight: isSelected ? 3 : 1.5,
                      fillColor,
                      fillOpacity: 0.9,
                    }}
                    eventHandlers={{
                      click: () => {
                        setSelectedBin(bin);
                      },
                    }}
                  >
                    <Popup>
                      <div className="p-1 text-xs space-y-1">
                        <div className="flex items-center justify-between gap-2 border-b pb-1">
                          <span className="font-bold text-navy-800">{bin.id}</span>
                          <span className="font-bold" style={{ color: fillColor }}>{bin.fillPercent}% Full</span>
                        </div>
                        <p className="text-charcoal-600 font-medium">{bin.name}</p>
                        <p className="text-[11px] text-charcoal-400">Stream: {bin.primaryStream.toUpperCase()}</p>
                        <p className="text-[11px] text-charcoal-500">
                          Est. Time to Full: <strong>{bin.predictedHoursToFull}h</strong>
                        </p>
                      </div>
                    </Popup>
                  </CircleMarker>
                );
              })}
            </MapContainer>
          </div>

          {/* Quick Floating Map Legend */}
          <div className="absolute bottom-3 left-3 z-[1000] bg-white/95 backdrop-blur-md p-2.5 rounded-xl border border-navy-100 shadow-md text-xs space-y-1">
            <span className="font-bold text-navy-800 block text-[11px]">Map Legend:</span>
            <div className="flex items-center gap-2 text-[10px]">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
              <span>&gt;80% Critical</span>
            </div>
            <div className="flex items-center gap-2 text-[10px]">
              <span className="w-2.5 h-2.5 rounded-full bg-amberGold-500"></span>
              <span>50-80% Moderate</span>
            </div>
            <div className="flex items-center gap-2 text-[10px]">
              <span className="w-2.5 h-2.5 rounded-full bg-sage-500"></span>
              <span>&lt;50% Normal</span>
            </div>
            <div className="flex items-center gap-2 text-[10px] pt-1 border-t">
              <span>🏢 Central Depot</span>
              <span className="ml-1">♻️ MRF Plant</span>
            </div>
          </div>

        </div>

        {/* Right Side: Selected Bin Deep Inspection Card */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-navy-100 shadow-blueprint p-5 flex flex-col justify-between h-[580px] overflow-y-auto">
          {selectedBin ? (
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b border-navy-100">
                <div>
                  <span className="font-mono text-xs font-bold text-navy-600">{selectedBin.id}</span>
                  <h3 className="font-bold text-base text-navy-800">{selectedBin.name}</h3>
                  <span className="text-[11px] text-charcoal-400">{selectedBin.zoneName}</span>
                </div>
                <div className="text-right">
                  <span className={`text-2xl font-black font-['Outfit'] ${
                    selectedBin.fillPercent >= 80 ? 'text-red-500' : selectedBin.fillPercent >= 50 ? 'text-amberGold-600' : 'text-sage-600'
                  }`}>
                    {selectedBin.fillPercent}%
                  </span>
                  <span className="block text-[10px] text-charcoal-400 uppercase font-semibold">Fill Level</span>
                </div>
              </div>

              {/* Telemetry Progress Bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-semibold text-charcoal-600">
                  <span>Capacity: {selectedBin.capacityKg} kg</span>
                  <span>Current: {selectedBin.currentKg} kg</span>
                </div>
                <div className="w-full h-3 rounded-full bg-navy-50 overflow-hidden border border-navy-100">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${
                      selectedBin.fillPercent >= 80 ? 'bg-red-500' : selectedBin.fillPercent >= 50 ? 'bg-amberGold-500' : 'bg-sage-500'
                    }`}
                    style={{ width: `${selectedBin.fillPercent}%` }}
                  ></div>
                </div>
              </div>

              {/* Predicted Time-to-Full Callout */}
              <div className={`p-3.5 rounded-xl border text-xs flex items-start gap-2.5 ${
                selectedBin.predictedHoursToFull <= 4 
                  ? 'bg-red-50 border-red-200 text-red-900' 
                  : 'bg-navy-50 border-navy-100 text-navy-900'
              }`}>
                <Clock className={`w-4 h-4 flex-shrink-0 mt-0.5 ${
                  selectedBin.predictedHoursToFull <= 4 ? 'text-red-600' : 'text-navy-600'
                }`} />
                <div>
                  <span className="font-bold block">
                    Predicted Full in: {selectedBin.predictedHoursToFull} Hours
                  </span>
                  <span className="text-[11px] opacity-80">
                    {selectedBin.fillPercent >= 75
                      ? 'Queued for immediate ReLoop dynamic compactor truck pickup.'
                      : 'Generation rate within standard diurnal tolerance.'}
                  </span>
                </div>
              </div>

              {/* Composition Breakdown (Slide 5) */}
              <div className="space-y-2 pt-2 border-t border-navy-50">
                <span className="text-xs font-bold uppercase tracking-wider text-charcoal-500 block">
                  Sensor Stream Composition:
                </span>
                
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-1.5 text-sage-700 font-medium">
                      <span className="w-2 h-2 rounded-full bg-sage-500"></span> Organic Food & Kitchen
                    </span>
                    <span className="font-mono font-bold text-charcoal-700">{selectedBin.composition.organic}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-1.5 text-navy-700 font-medium">
                      <span className="w-2 h-2 rounded-full bg-navy-700"></span> Recyclables (Plastic/OCC/Metal)
                    </span>
                    <span className="font-mono font-bold text-charcoal-700">{selectedBin.composition.recyclable}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-1.5 text-charcoal-600 font-medium">
                      <span className="w-2 h-2 rounded-full bg-charcoal-400"></span> C&D Aggregate Waste
                    </span>
                    <span className="font-mono font-bold text-charcoal-700">{selectedBin.composition.cdWaste}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-1.5 text-blue-700 font-medium">
                      <span className="w-2 h-2 rounded-full bg-blue-500"></span> E-Waste (Discarded Electronics)
                    </span>
                    <span className="font-mono font-bold text-charcoal-700">{selectedBin.composition.eWaste}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-1.5 text-residual-500 font-medium">
                      <span className="w-2 h-2 rounded-full bg-residual-500"></span> Residual (Non-Recyclable)
                    </span>
                    <span className="font-mono font-bold text-charcoal-700">{selectedBin.composition.residual}%</span>
                  </div>
                </div>
              </div>

              {/* Recent Fill History Sparkline */}
              <div className="pt-2 border-t border-navy-50">
                <span className="text-[11px] font-bold text-charcoal-400 uppercase tracking-wide block mb-1.5">
                  Recent 8-Hour Fill Progression:
                </span>
                <div className="flex items-end gap-1 h-12 bg-navy-50/50 p-1.5 rounded-lg border border-navy-100">
                  {selectedBin.history.map((val, idx) => (
                    <div 
                      key={idx} 
                      className={`flex-1 rounded-xs transition-all ${
                        val >= 80 ? 'bg-red-500' : val >= 50 ? 'bg-amberGold-400' : 'bg-sage-400'
                      }`}
                      style={{ height: `${val}%` }}
                      title={`t-${selectedBin.history.length - idx}h: ${val}%`}
                    ></div>
                  ))}
                </div>
              </div>

            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3 text-charcoal-400">
              <div className="w-12 h-12 rounded-2xl bg-navy-50 flex items-center justify-center text-navy-600">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-navy-800">No Smart Bin Selected</h4>
                <p className="text-xs text-charcoal-500 mt-1">
                  Click on any smart bin pin on the map to inspect live IoT telemetry, composition breakdown, and overflow predictions.
                </p>
              </div>
              <button
                onClick={() => setSelectedBin(filteredBins[0])}
                className="px-3 py-1.5 rounded-lg bg-navy-700 text-white text-xs font-semibold shadow-xs hover:bg-navy-800"
              >
                Inspect First Bin
              </button>
            </div>
          )}

          {/* Bottom GPS Coordinates */}
          {selectedBin && (
            <div className="pt-3 border-t border-navy-100 flex items-center justify-between text-[10px] text-charcoal-400 font-mono">
              <span>LAT: {selectedBin.lat}</span>
              <span>LNG: {selectedBin.lng}</span>
              <button 
                onClick={() => setSelectedBin(null)}
                className="text-navy-700 hover:underline font-sans font-semibold"
              >
                Close
              </button>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
