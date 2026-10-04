import React, { useState, useMemo } from 'react';
import { useStore } from '../store/useStore';
import { SmartBin } from '../types';
import { PILOT_ZONES } from '../config/config';
import { MapContainer, TileLayer, Marker, Popup, CircleMarker, useMap } from 'react-leaflet';
import L from 'leaflet';
import { PageHeader } from '../components/ui/PageHeader';
import { LoopStepNav } from '../components/ui/LoopStepNav';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { SectionCard } from '../components/ui/SectionCard';
import { 
  Play, 
  Pause, 
  FastForward, 
  Radio, 
  Clock, 
  AlertTriangle, 
  Sparkles, 
  Layers, 
  MapPin, 
  CheckCircle2, 
  Flame, 
  LocateFixed,
  Filter,
  X
} from 'lucide-react';

const depotIcon = L.divIcon({
  className: 'custom-depot-pin',
  html: `<div style="background-color: #12305C; color: white; width: 34px; height: 34px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 2.5px solid white; box-shadow: 0 4px 12px rgba(18, 48, 92, 0.4); font-size: 14px;" title="Central Depot">🏢</div>`,
  iconSize: [34, 34],
  iconAnchor: [17, 17],
});

const mrfIcon = L.divIcon({
  className: 'custom-mrf-pin',
  html: `<div style="background-color: #7BA17D; color: white; width: 34px; height: 34px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 2.5px solid white; box-shadow: 0 4px 12px rgba(123, 161, 125, 0.4); font-size: 14px;" title="MRF Plant">♻️</div>`,
  iconSize: [34, 34],
  iconAnchor: [17, 17],
});

function MapFlyTo({ center }: { center: [number, number] }) {
  const map = useMap();
  React.useEffect(() => {
    map.flyTo(center, 15, { duration: 0.8 });
  }, [center, map]);
  return null;
}

export const LiveCityMap: React.FC = () => {
  const { 
    simState, 
    isSimRunning, 
    startSimulation, 
    pauseSimulation, 
    tickSimulation, 
    selectedBin, 
    setSelectedBin, 
    config 
  } = useStore();

  const [activeFilter, setActiveFilter] = useState<'all' | 'critical' | 'moderate' | 'low'>('all');
  const [zoneFilter, setZoneFilter] = useState<string>('all');
  const [streamFilter, setStreamFilter] = useState<string>('all');

  const bins = simState.bins;

  // Filter bins
  const filteredBins = useMemo(() => {
    return bins.filter((bin) => {
      if (activeFilter === 'critical' && bin.fillPercent < 80) return false;
      if (activeFilter === 'moderate' && (bin.fillPercent < 50 || bin.fillPercent >= 80)) return false;
      if (activeFilter === 'low' && bin.fillPercent >= 50) return false;
      if (zoneFilter !== 'all' && bin.zoneId !== zoneFilter) return false;
      if (streamFilter !== 'all' && bin.primaryStream !== streamFilter) return false;
      return true;
    });
  }, [bins, activeFilter, zoneFilter, streamFilter]);

  // Find nearest critical bin (Section 5)
  const handleFindNearestCritical = () => {
    const criticalBins = bins.filter((b) => b.fillPercent >= 80);
    if (criticalBins.length > 0) {
      // Pick highest fill bin
      const highest = [...criticalBins].sort((a, b) => b.fillPercent - a.fillPercent)[0];
      setSelectedBin(highest);
    }
  };

  const criticalCount = bins.filter((b) => b.fillPercent >= 80).length;
  const moderateCount = bins.filter((b) => b.fillPercent >= 50 && b.fillPercent < 80).length;
  const normalCount = bins.filter((b) => b.fillPercent < 50).length;

  return (
    <div className="space-y-6 pb-16">
      
      {/* Page Header */}
      <PageHeader
        title="Sense · Live bin map"
        subtitle="Real-time ultrasonic fill level and waste stream sensors across 100 smart receptacles in Pune PCMC corridor."
        stepNumber={1}
        stepName="Sense"
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant={isSimRunning ? 'secondary' : 'primary'}
              size="sm"
              icon={isSimRunning ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
              onClick={() => (isSimRunning ? pauseSimulation() : startSimulation())}
              className="min-h-[44px] text-sm"
            >
              {isSimRunning ? 'Pause Stream' : 'Live Stream'}
            </Button>
            <Button
              variant="secondary"
              size="sm"
              icon={<LocateFixed className="w-4 h-4 text-red-600" />}
              onClick={handleFindNearestCritical}
              disabled={criticalCount === 0}
              aria-label="Find and zoom to nearest critical bin"
              className="min-h-[44px] text-sm"
            >
              Zoom Critical ({criticalCount})
            </Button>
          </div>
        }
      />

      {/* One-Line Top Headline Result (Phase 4 requirement) */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white border border-charcoal-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="p-2.5 rounded-xl bg-emerald-100 text-emerald-800 flex-shrink-0" aria-hidden="true">
            <Radio className="w-5 h-5 text-emerald-700" />
          </span>
          <div>
            <div className="text-xs uppercase font-bold tracking-wider text-charcoal-500">
              Corridor Telemetry Status
            </div>
            <p className="text-sm sm:text-base font-bold text-navy-900 leading-snug">
              100 smart IoT bins online across 5 Pune zones: {criticalCount} critical bins (≥80%) prioritized for dynamic pickup.
            </p>
          </div>
        </div>
        <Badge variant={criticalCount > 0 ? 'amber' : 'emerald'} size="md">
          {criticalCount > 0 ? `${criticalCount} bins need pickup` : 'All bins below threshold'}
        </Badge>
      </div>

      {/* Filter Chips Bar (Section 5) */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-white border border-navy-100 shadow-blueprint">
        
        {/* Fill Severity Filter Chips with Color + Text Labels for Color-Blind Accessibility */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="text-xs font-bold text-charcoal-500 mr-1">Filter Fill:</span>
          
          <button
            type="button"
            onClick={() => setActiveFilter('all')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all min-h-[36px] ${
              activeFilter === 'all'
                ? 'bg-navy-700 text-white shadow-xs'
                : 'bg-navy-50 text-charcoal-700 hover:bg-navy-100'
            }`}
          >
            All Bins ({bins.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveFilter('critical')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition-all min-h-[36px] ${
              activeFilter === 'critical'
                ? 'bg-red-600 text-white shadow-xs'
                : 'bg-red-50 text-red-800 hover:bg-red-100'
            }`}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" aria-hidden="true" />
            <span>Critical &gt;80% ({criticalCount})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveFilter('moderate')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition-all min-h-[36px] ${
              activeFilter === 'moderate'
                ? 'bg-amberGold-600 text-white shadow-xs'
                : 'bg-amberGold-100 text-amberGold-900 hover:bg-amberGold-200'
            }`}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-amberGold-500" aria-hidden="true" />
            <span>Moderate 50-80% ({moderateCount})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveFilter('low')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition-all min-h-[36px] ${
              activeFilter === 'low'
                ? 'bg-sage-600 text-white shadow-xs'
                : 'bg-sage-100 text-sage-900 hover:bg-sage-200'
            }`}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-sage-500" aria-hidden="true" />
            <span>Normal &lt;50% ({normalCount})</span>
          </button>
        </div>

        {/* Zone Dropdown Filter */}
        <div className="flex items-center gap-2">
          <label htmlFor="map-zone-filter" className="sr-only">Filter by Zone</label>
          <select
            id="map-zone-filter"
            value={zoneFilter}
            onChange={(e) => setZoneFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-navy-200 text-xs font-semibold text-charcoal-700 bg-navy-50/60 hover:bg-navy-50 min-h-[38px] focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-navy-600"
          >
            <option value="all">All Pilot Zones (5)</option>
            {PILOT_ZONES.map((z) => (
              <option key={z.id} value={z.id}>{z.name}</option>
            ))}
          </select>
        </div>

      </div>

      {/* Main Map + Inspector Layout (Responsive: Stacked / Bottom sheet on mobile, Section 5) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Left Map View with responsive height */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-navy-100 shadow-blueprint overflow-hidden flex flex-col min-h-[420px] h-[55vh] lg:h-[620px] relative">
          
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

              {/* Fly to selected bin */}
              {selectedBin && <MapFlyTo center={[selectedBin.lat, selectedBin.lng]} />}

              {/* Central Municipal Depot Marker */}
              <Marker position={config.depotCoordinates} icon={depotIcon}>
                <Popup>
                  <div className="p-1 text-xs">
                    <span className="font-bold text-navy-900 block">Central Municipal Depot</span>
                    <span className="text-charcoal-600">Akurdi Fleet Maintenance & Dispatch</span>
                  </div>
                </Popup>
              </Marker>

              {/* Material Recovery Facility Marker */}
              <Marker position={config.mrfCoordinates} icon={mrfIcon}>
                <Popup>
                  <div className="p-1 text-xs">
                    <span className="font-bold text-sage-900 block">Material Recovery Facility (MRF)</span>
                    <span className="text-charcoal-600">Optical sorting, baling & bio-refinery</span>
                  </div>
                </Popup>
              </Marker>

              {/* Smart Bins CircleMarkers */}
              {filteredBins.map((bin) => {
                const isCritical = bin.fillPercent >= 80;
                const isMedium = bin.fillPercent >= 50 && bin.fillPercent < 80;
                const fillColor = isCritical ? '#DC2626' : isMedium ? '#D9A441' : '#7BA17D';
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
                          <span className="font-bold text-navy-900">{bin.id}</span>
                          <span className="font-bold" style={{ color: fillColor }}>
                            {bin.fillPercent}% Full
                          </span>
                        </div>
                        <p className="font-medium text-charcoal-800">{bin.name}</p>
                        <p className="text-charcoal-600">Primary: {bin.primaryStream.toUpperCase()}</p>
                        <p className="text-charcoal-700">
                          Est. Time to Full: <strong>{bin.predictedHoursToFull}h</strong>
                        </p>
                      </div>
                    </Popup>
                  </CircleMarker>
                );
              })}
            </MapContainer>
          </div>

          {/* Always-Visible Map Legend (Section 5) */}
          <div
            role="region"
            aria-label="Map status legend"
            className="absolute bottom-3 left-3 z-[1000] bg-white/95 backdrop-blur-md p-3.5 rounded-2xl border border-charcoal-200 shadow-md text-xs space-y-2"
          >
            <span className="font-bold text-navy-900 block text-xs uppercase tracking-wider">IoT Sensor Legend:</span>
            <div className="flex items-center gap-2 text-xs">
              <span className="w-3 h-3 rounded-full bg-red-600 flex-shrink-0" aria-hidden="true" />
              <AlertTriangle className="w-3.5 h-3.5 text-red-600 flex-shrink-0" aria-hidden="true" />
              <span className="font-semibold text-charcoal-800">&gt;80% Critical Fill</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="w-3 h-3 rounded-full bg-amber-500 flex-shrink-0" aria-hidden="true" />
              <Clock className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" aria-hidden="true" />
              <span className="font-semibold text-charcoal-800">50-80% Moderate Fill</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="w-3 h-3 rounded-full bg-emerald-600 flex-shrink-0" aria-hidden="true" />
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" aria-hidden="true" />
              <span className="font-semibold text-charcoal-800">&lt;50% Normal Level</span>
            </div>
            <div className="flex items-center gap-3 text-xs pt-1.5 border-t border-charcoal-200 text-charcoal-700">
              <span className="font-medium">🏢 Central Depot</span>
              <span className="font-medium">♻️ MRF Plant</span>
            </div>
          </div>

        </div>

        {/* Right Side: Selected Bin Deep Inspection Card / Bottom Sheet on Mobile */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-navy-100 shadow-blueprint p-5 sm:p-6 flex flex-col justify-between min-h-[380px] lg:h-[620px] overflow-y-auto">
          {selectedBin ? (
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b border-navy-100">
                <div>
                  <span className="font-mono text-xs font-bold text-navy-600">{selectedBin.id}</span>
                  <h3 className="font-bold text-base text-navy-900">{selectedBin.name}</h3>
                  <span className="text-xs text-charcoal-500">{selectedBin.zoneName}</span>
                </div>
                <div className="text-right">
                  <span
                    className={`text-3xl font-black font-['Outfit'] ${
                      selectedBin.fillPercent >= 80
                        ? 'text-red-600'
                        : selectedBin.fillPercent >= 50
                        ? 'text-amberGold-700'
                        : 'text-sage-700'
                    }`}
                  >
                    {selectedBin.fillPercent}%
                  </span>
                  <span className="block text-xs text-charcoal-500 uppercase font-semibold">Fill Level</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold text-charcoal-700">
                  <span>Capacity: {selectedBin.capacityKg} kg</span>
                  <span>Current: {selectedBin.currentKg} kg</span>
                </div>
                <div className="w-full h-3 rounded-full bg-navy-50 overflow-hidden border border-navy-100">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${
                      selectedBin.fillPercent >= 80
                        ? 'bg-red-600'
                        : selectedBin.fillPercent >= 50
                        ? 'bg-amberGold-500'
                        : 'bg-sage-500'
                    }`}
                    style={{ width: `${selectedBin.fillPercent}%` }}
                  />
                </div>
              </div>

              {/* Time to Full Alert */}
              <div
                className={`p-3.5 rounded-xl border text-xs flex items-start gap-2.5 ${
                  selectedBin.predictedHoursToFull <= 4
                    ? 'bg-red-50 border-red-200 text-red-900'
                    : 'bg-navy-50 border-navy-100 text-navy-950'
                }`}
              >
                <Clock
                  className={`w-4 h-4 flex-shrink-0 mt-0.5 ${
                    selectedBin.predictedHoursToFull <= 4 ? 'text-red-600' : 'text-navy-700'
                  }`}
                  aria-hidden="true"
                />
                <div>
                  <span className="font-bold block text-sm">
                    Predicted Full in: {selectedBin.predictedHoursToFull} Hours
                  </span>
                  <span className="text-xs opacity-85 mt-0.5 block leading-relaxed">
                    {selectedBin.fillPercent >= 75
                      ? 'Queued for immediate ReLoop dynamic compactor truck pickup.'
                      : 'Generation rate is within standard diurnal tolerance.'}
                  </span>
                </div>
              </div>

              {/* Composition Breakdown */}
              <div className="space-y-2 pt-2 border-t border-navy-50">
                <span className="text-xs font-bold uppercase tracking-wider text-charcoal-500 block">
                  Sensor Stream Composition:
                </span>
                
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-1.5 text-sage-800 font-medium">
                      <span className="w-2.5 h-2.5 rounded-full bg-sage-500" aria-hidden="true" />
                      Organic Food & Kitchen
                    </span>
                    <span className="font-mono font-bold text-charcoal-800">{selectedBin.composition.organic}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-1.5 text-navy-800 font-medium">
                      <span className="w-2.5 h-2.5 rounded-full bg-navy-700" aria-hidden="true" />
                      Recyclables (Plastic/OCC/Metal)
                    </span>
                    <span className="font-mono font-bold text-charcoal-800">{selectedBin.composition.recyclable}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-1.5 text-charcoal-700 font-medium">
                      <span className="w-2.5 h-2.5 rounded-full bg-charcoal-400" aria-hidden="true" />
                      C&D Aggregate Debris
                    </span>
                    <span className="font-mono font-bold text-charcoal-800">{selectedBin.composition.cdWaste}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-1.5 text-blue-800 font-medium">
                      <span className="w-2.5 h-2.5 rounded-full bg-blue-500" aria-hidden="true" />
                      E-Waste (Discarded IT)
                    </span>
                    <span className="font-mono font-bold text-charcoal-800">{selectedBin.composition.eWaste}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-1.5 text-charcoal-600 font-medium">
                      <span className="w-2.5 h-2.5 rounded-full bg-residual-500" aria-hidden="true" />
                      Residual (Non-Recyclable)
                    </span>
                    <span className="font-mono font-bold text-charcoal-800">{selectedBin.composition.residual}%</span>
                  </div>
                </div>
              </div>

              {/* 8-Hour Fill Progression */}
              <div className="pt-2 border-t border-navy-50">
                <span className="text-xs font-bold text-charcoal-500 uppercase tracking-wide block mb-1.5">
                  Recent Fill Progression:
                </span>
                <div className="flex items-end gap-1.5 h-12 bg-navy-50/60 p-2 rounded-xl border border-navy-100">
                  {selectedBin.history.map((val, idx) => (
                    <div 
                      key={idx} 
                      className={`flex-1 rounded-sm transition-all ${
                        val >= 80 ? 'bg-red-600' : val >= 50 ? 'bg-amberGold-500' : 'bg-sage-500'
                      }`}
                      style={{ height: `${val}%` }}
                      title={`t-${selectedBin.history.length - idx}h: ${val}%`}
                    />
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3 text-charcoal-500">
              <div className="w-12 h-12 rounded-2xl bg-navy-50 flex items-center justify-center text-navy-700" aria-hidden="true">
                <MapPin className="w-6 h-6" />
              </div>
              <div className="max-w-xs">
                <h4 className="font-bold text-base text-navy-900 font-['Outfit']">
                  No Smart Bin Selected
                </h4>
                <p className="text-xs text-charcoal-600 mt-1 leading-relaxed">
                  Click on any smart bin pin on the map or click below to inspect live IoT telemetry, composition breakdown, and overflow predictions.
                </p>
              </div>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setSelectedBin(filteredBins[0])}
              >
                Inspect First Bin
              </Button>
            </div>
          )}

          {/* Bottom GPS Coordinates */}
          {selectedBin && (
            <div className="pt-3 border-t border-navy-100 flex items-center justify-between text-xs text-charcoal-500 font-mono">
              <span>LAT: {selectedBin.lat} · LNG: {selectedBin.lng}</span>
              <button 
                type="button"
                onClick={() => setSelectedBin(null)}
                className="text-navy-700 hover:underline font-sans font-bold"
              >
                Close Inspector
              </button>
            </div>
          )}
        </div>

      </div>

      {/* Loop Step Navigation */}
      <LoopStepNav
        currentStep={1}
        prevPath="/app/dashboard"
        prevLabel="Dashboard"
        nextPath="/app/predict"
        nextLabel="Predict · Waste forecast"
      />

    </div>
  );
};
