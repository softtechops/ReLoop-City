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
    config,
    priorityBinIds,
    togglePriorityBin,
  } = useStore();

  const [activeFilter, setActiveFilter] = useState<'all' | 'critical' | 'moderate' | 'low' | 'priority'>('all');
  const [zoneFilter, setZoneFilter] = useState<string>('all');
  const [streamFilter, setStreamFilter] = useState<string>('all');

  const bins = simState.bins;

  // Filter bins
  const filteredBins = useMemo(() => {
    return bins.filter((bin) => {
      if (activeFilter === 'priority' && !priorityBinIds.includes(bin.id)) return false;
      if (activeFilter === 'critical' && bin.fillPercent < 80) return false;
      if (activeFilter === 'moderate' && (bin.fillPercent < 50 || bin.fillPercent >= 80)) return false;
      if (activeFilter === 'low' && bin.fillPercent >= 50) return false;
      if (zoneFilter !== 'all' && bin.zoneId !== zoneFilter) return false;
      if (streamFilter !== 'all' && bin.primaryStream !== streamFilter) return false;
      return true;
    });
  }, [bins, activeFilter, zoneFilter, streamFilter, priorityBinIds]);

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
        decisionPrompt="Which bins need attention right now?"
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
      <div className="p-4 sm:p-5 rounded-2xl bg-surface border border-line shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="p-2.5 rounded-xl bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 flex-shrink-0" aria-hidden="true">
            <Radio className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          </span>
          <div>
            <div className="text-xs uppercase font-bold tracking-wider text-fg-muted">
              Corridor Telemetry Status
            </div>
            <p className="text-sm sm:text-base font-bold text-fg leading-snug">
              100 smart IoT bins online across 5 Pune zones: {criticalCount} critical bins (≥80%) prioritized for dynamic pickup.
            </p>
          </div>
        </div>
        <Badge variant={criticalCount > 0 ? 'amber' : 'emerald'} size="md">
          {criticalCount > 0 ? `${criticalCount} bins need pickup` : 'All bins below threshold'}
        </Badge>
      </div>

      {/* Filter Chips Bar (Section 5) */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-surface border border-line shadow-xs">
        
        {/* Fill Severity Filter Chips with Color + Text Labels for Color-Blind Accessibility */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="text-xs font-bold text-fg-muted mr-1">Filter Fill:</span>
          
          <button
            type="button"
            onClick={() => setActiveFilter('all')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all min-h-[36px] ${
              activeFilter === 'all'
                ? 'bg-slate-800 dark:bg-slate-700 text-white shadow-xs'
                : 'bg-surface-muted text-fg hover:bg-line'
            }`}
          >
            All Bins ({bins.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveFilter('critical')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition-all min-h-[36px] ${
              activeFilter === 'critical'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'bg-rose-50 text-rose-800 border border-rose-200 dark:bg-rose-500/15 dark:text-rose-300 dark:border-rose-500/30'
            }`}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" aria-hidden="true" />
            <span>Critical &gt;80% ({criticalCount})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveFilter('moderate')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition-all min-h-[36px] ${
              activeFilter === 'moderate'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-amber-50 text-amber-800 border border-amber-200 dark:bg-amber-400/15 dark:text-amber-300 dark:border-amber-400/30'
            }`}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" aria-hidden="true" />
            <span>Moderate 50-80% ({moderateCount})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveFilter('low')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition-all min-h-[36px] ${
              activeFilter === 'low'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-emerald-50 text-emerald-800 border border-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-300 dark:border-emerald-500/30'
            }`}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" aria-hidden="true" />
            <span>Normal &lt;50% ({normalCount})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveFilter('priority')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition-all min-h-[36px] ${
              activeFilter === 'priority'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-amber-50 text-amber-800 border border-amber-200 dark:bg-amber-400/15 dark:text-amber-300 dark:border-amber-400/30'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" aria-hidden="true" />
            <span>Priority ({priorityBinIds.length})</span>
          </button>
        </div>

        {/* Zone Dropdown Filter */}
        <div className="flex items-center gap-2">
          <label htmlFor="map-zone-filter" className="sr-only">Filter by Zone</label>
          <select
            id="map-zone-filter"
            value={zoneFilter}
            onChange={(e) => setZoneFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-line text-xs font-semibold text-fg bg-surface hover:bg-surface-muted min-h-[38px] focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-emerald-500"
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
        <div className="lg:col-span-8 bg-surface rounded-2xl border border-line shadow-sm overflow-hidden flex flex-col min-h-[420px] h-[55vh] lg:h-[620px] relative">
          
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
                    <span className="font-bold text-fg block">Central Municipal Depot</span>
                    <span className="text-fg-muted">Akurdi Fleet Maintenance & Dispatch</span>
                  </div>
                </Popup>
              </Marker>

              {/* Material Recovery Facility Marker */}
              <Marker position={config.mrfCoordinates} icon={mrfIcon}>
                <Popup>
                  <div className="p-1 text-xs">
                    <span className="font-bold text-fg block">Material Recovery Facility (MRF)</span>
                    <span className="text-fg-muted">Optical sorting, baling & bio-refinery</span>
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
                        <div className="flex items-center justify-between gap-2 border-b border-line pb-1">
                          <span className="font-bold text-fg">{bin.id}</span>
                          <span className="font-bold" style={{ color: fillColor }}>
                            {bin.fillPercent}% Full
                          </span>
                        </div>
                        <p className="font-medium text-fg">{bin.name}</p>
                        <p className="text-fg-muted">Primary: {bin.primaryStream.toUpperCase()}</p>
                        <p className="text-fg-muted">
                          Est. Time to Full: <strong className="text-fg">{bin.predictedHoursToFull}h</strong>
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
            className="absolute bottom-3 left-3 z-[1000] bg-surface/90 dark:bg-surface/85 backdrop-blur-md p-3.5 rounded-2xl border border-line shadow-md text-xs space-y-2 text-fg"
          >
            <span className="font-bold text-fg block text-xs uppercase tracking-wider">IoT Sensor Legend:</span>
            <div className="flex items-center gap-2 text-xs">
              <span className="w-3 h-3 rounded-full bg-rose-600 flex-shrink-0" aria-hidden="true" />
              <AlertTriangle className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400 flex-shrink-0" aria-hidden="true" />
              <span className="font-semibold text-fg-muted">&gt;80% Critical Fill</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="w-3 h-3 rounded-full bg-amber-500 flex-shrink-0" aria-hidden="true" />
              <Clock className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 flex-shrink-0" aria-hidden="true" />
              <span className="font-semibold text-fg-muted">50-80% Moderate Fill</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="w-3 h-3 rounded-full bg-emerald-600 flex-shrink-0" aria-hidden="true" />
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" aria-hidden="true" />
              <span className="font-semibold text-fg-muted">&lt;50% Normal Level</span>
            </div>
            <div className="flex items-center gap-3 text-xs pt-1.5 border-t border-line text-fg-muted">
              <span className="font-medium">🏢 Central Depot</span>
              <span className="font-medium">♻️ MRF Plant</span>
            </div>
          </div>

        </div>

        {/* Right Side: Selected Bin Deep Inspection Card / Bottom Sheet on Mobile */}
        <div className="lg:col-span-4 bg-surface rounded-2xl border border-line shadow-sm p-5 sm:p-6 flex flex-col justify-between min-h-[380px] lg:h-[620px] overflow-y-auto">
          {selectedBin ? (
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b border-line">
                <div>
                  <span className="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400">{selectedBin.id}</span>
                  <h3 className="font-bold text-base text-fg">{selectedBin.name}</h3>
                  <span className="text-xs text-fg-muted block">{selectedBin.zoneName}</span>
                  {priorityBinIds.includes(selectedBin.id) && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 text-amber-900 dark:bg-amber-400/15 dark:text-amber-300 border border-amber-300 dark:border-amber-400/30 text-[11px] font-bold mt-1">
                      <Sparkles className="w-3 h-3 text-amber-600 dark:text-amber-400 fill-current" />
                      Priority Pickup Flagged
                    </span>
                  )}
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
                  <span className="block text-xs text-fg-subtle uppercase font-semibold">Fill Level</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold text-fg-muted">
                  <span>Capacity: {selectedBin.capacityKg} kg</span>
                  <span>Current: {selectedBin.currentKg} kg</span>
                </div>
                <div className="w-full h-3 rounded-full bg-surface-muted overflow-hidden border border-line">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${
                      selectedBin.fillPercent >= 80
                        ? 'bg-rose-600'
                        : selectedBin.fillPercent >= 50
                        ? 'bg-amber-500'
                        : 'bg-emerald-500'
                    }`}
                    style={{ width: `${selectedBin.fillPercent}%` }}
                  />
                </div>
              </div>

              {/* Time to Full Alert */}
              <div
                className={`p-3.5 rounded-xl border text-xs flex items-start gap-2.5 ${
                  selectedBin.predictedHoursToFull <= 4
                    ? 'bg-rose-50 dark:bg-rose-500/15 border-rose-200 dark:border-rose-500/30 text-rose-900 dark:text-rose-200'
                    : 'bg-surface-muted border-line text-fg'
                }`}
              >
                <Clock
                  className={`w-4 h-4 flex-shrink-0 mt-0.5 ${
                    selectedBin.predictedHoursToFull <= 4 ? 'text-rose-600 dark:text-rose-400' : 'text-fg-subtle'
                  }`}
                  aria-hidden="true"
                />
                <div>
                  <span className="font-bold block text-sm">
                    Predicted Full in: {selectedBin.predictedHoursToFull} Hours
                  </span>
                  <span className="text-xs opacity-85 mt-0.5 block leading-relaxed text-fg-muted">
                    {selectedBin.fillPercent >= 75
                      ? 'Queued for immediate ReLoop dynamic compactor truck pickup.'
                      : 'Generation rate is within standard diurnal tolerance.'}
                  </span>
                </div>
              </div>

              {/* Manager Decision Action: Priority Pickup Toggle */}
              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => togglePriorityBin(selectedBin.id)}
                  className={`w-full py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 min-h-[44px] cursor-pointer shadow-xs ${
                    priorityBinIds.includes(selectedBin.id)
                      ? 'bg-amber-100 hover:bg-amber-200 dark:bg-amber-400/20 dark:hover:bg-amber-400/30 text-amber-950 dark:text-amber-200 border border-amber-300 dark:border-amber-400/30'
                      : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                  }`}
                >
                  <Sparkles className="w-4 h-4 fill-current" aria-hidden="true" />
                  <span>
                    {priorityBinIds.includes(selectedBin.id)
                      ? '★ Priority Flagged (Click to Remove)'
                      : 'Mark Bin for Priority Pickup'}
                  </span>
                </button>
              </div>

              {/* Composition Breakdown */}
              <div className="space-y-2 pt-2 border-t border-line">
                <span className="text-xs font-bold uppercase tracking-wider text-fg-subtle block">
                  Sensor Stream Composition:
                </span>
                
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-1.5 text-fg font-medium">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" aria-hidden="true" />
                      Organic Food & Kitchen
                    </span>
                    <span className="font-mono font-bold text-fg">{selectedBin.composition.organic}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-1.5 text-fg font-medium">
                      <span className="w-2.5 h-2.5 rounded-full bg-blue-500" aria-hidden="true" />
                      Recyclables (Plastic/OCC/Metal)
                    </span>
                    <span className="font-mono font-bold text-fg">{selectedBin.composition.recyclable}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-1.5 text-fg font-medium">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500" aria-hidden="true" />
                      C&D Aggregate Debris
                    </span>
                    <span className="font-mono font-bold text-fg">{selectedBin.composition.cdWaste}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-1.5 text-fg font-medium">
                      <span className="w-2.5 h-2.5 rounded-full bg-cyan-500" aria-hidden="true" />
                      E-Waste (Discarded IT)
                    </span>
                    <span className="font-mono font-bold text-fg">{selectedBin.composition.eWaste}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-1.5 text-fg-muted font-medium">
                      <span className="w-2.5 h-2.5 rounded-full bg-slate-400" aria-hidden="true" />
                      Residual (Non-Recyclable)
                    </span>
                    <span className="font-mono font-bold text-fg">{selectedBin.composition.residual}%</span>
                  </div>
                </div>
              </div>

              {/* 8-Hour Fill Progression */}
              <div className="pt-2 border-t border-line">
                <span className="text-xs font-bold text-fg-subtle uppercase tracking-wide block mb-1.5">
                  Recent Fill Progression:
                </span>
                <div className="flex items-end gap-1.5 h-12 bg-surface-muted p-2 rounded-xl border border-line">
                  {selectedBin.history.map((val, idx) => (
                    <div 
                      key={idx} 
                      className={`flex-1 rounded-sm transition-all ${
                        val >= 80 ? 'bg-rose-600' : val >= 50 ? 'bg-amber-500' : 'bg-emerald-500'
                      }`}
                      style={{ height: `${val}%` }}
                      title={`t-${selectedBin.history.length - idx}h: ${val}%`}
                    />
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3 text-fg-muted">
              <div className="w-12 h-12 rounded-2xl bg-surface-muted flex items-center justify-center text-fg" aria-hidden="true">
                <MapPin className="w-6 h-6" />
              </div>
              <div className="max-w-xs">
                <h4 className="font-bold text-base text-fg font-['Outfit']">
                  No Smart Bin Selected
                </h4>
                <p className="text-xs text-fg-muted mt-1 leading-relaxed">
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
            <div className="pt-3 border-t border-line flex items-center justify-between text-xs text-fg-subtle font-mono">
              <span>LAT: {selectedBin.lat} · LNG: {selectedBin.lng}</span>
              <button 
                type="button"
                onClick={() => setSelectedBin(null)}
                className="text-emerald-600 dark:text-emerald-400 hover:underline font-sans font-bold"
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
