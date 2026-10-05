// ============================================================================
// RELOOP SCENARIO BUILDER (Feature 2)
// Interactive planning tool for municipal waste operations managers.
// Test policies, adjust fleet and recovery assumptions, and compare
// side-by-side against Baseline and Default ReLoop before operational rollout.
// ============================================================================

import React, { useState, useMemo } from 'react';
import { useStore } from '../store/useStore';
import { DEFAULT_CONFIG, ConfigState } from '../config/config';
import { PageHeader } from '../components/ui/PageHeader';
import { SectionCard } from '../components/ui/SectionCard';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { ExportReportMenu } from '../components/ExportReportMenu';
import {
  simulateScenarioMetrics,
  generateScenarioTakeaway,
  buildScenarioComparisonRows,
  ScenarioRowComparison,
} from '../lib/scenarioEngine';
import {
  SlidersHorizontal,
  Play,
  RotateCcw,
  Save,
  CheckCircle2,
  Trash2,
  Edit2,
  Award,
  Sparkles,
  Truck,
  Zap,
  Leaf,
  Coins,
  ArrowRight,
  Info,
  ShieldCheck,
  Check,
  X,
  AlertCircle,
  FlaskConical,
} from 'lucide-react';

export const ScenarioBuilder: React.FC = () => {
  const {
    simState,
    savedScenarios,
    activeScenarioId,
    saveScenario,
    deleteScenario,
    renameScenario,
    setActiveScenario,
    showToast,
  } = useStore();

  // Local scenario slider state (does NOT mutate default until activated)
  const [truckCount, setTruckCount] = useState<number>(4);
  const [dispatchThreshold, setDispatchThreshold] = useState<number>(75); // %
  const [truckCapacity, setTruckCapacity] = useState<number>(4.5); // tonnes
  const [biogasYield, setBiogasYield] = useState<number>(110); // m3/t
  const [tariffInr, setTariffInr] = useState<number>(6.8); // ₹/kWh

  // Simulation execution state
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [lastRunTimestamp, setLastRunTimestamp] = useState<string>('Just now');
  const [scenarioNameInput, setScenarioNameInput] = useState<string>('');
  const [showSaveModal, setShowSaveModal] = useState<boolean>(false);
  const [editingScenarioId, setEditingScenarioId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState<string>('');

  // Overridden config bundle
  const currentScenarioConfig: Partial<ConfigState> = useMemo(
    () => ({
      numberOfTrucks: truckCount,
      dispatchFillThreshold: dispatchThreshold / 100,
      truckCapacityTonnes: truckCapacity,
      biogasYieldPerTonneOrganic: biogasYield,
      electricityTariffInrPerKwh: tariffInr,
    }),
    [truckCount, dispatchThreshold, truckCapacity, biogasYield, tariffInr]
  );

  // Computed metrics for current scenario sliders
  const currentMetrics = useMemo(() => {
    return simulateScenarioMetrics(simState, currentScenarioConfig);
  }, [simState, currentScenarioConfig]);

  // Plain-language takeaway sentence
  const takeaway = useMemo(() => {
    return generateScenarioTakeaway(currentScenarioConfig, currentMetrics);
  }, [currentScenarioConfig, currentMetrics]);

  // 3-Way Comparison rows
  const comparisonRows: ScenarioRowComparison[] = useMemo(() => {
    return buildScenarioComparisonRows(currentMetrics);
  }, [currentMetrics]);

  // Run simulation action with loading feedback
  const handleRunScenario = () => {
    setIsRunning(true);
    setTimeout(() => {
      setIsRunning(false);
      const timeStr = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      setLastRunTimestamp(timeStr);
      showToast('Scenario simulation executed successfully', 'success');
    }, 450);
  };

  // Reset sliders to default values
  const handleResetToDefaults = () => {
    setTruckCount(DEFAULT_CONFIG.numberOfTrucks);
    setDispatchThreshold(Math.round(DEFAULT_CONFIG.dispatchFillThreshold * 100));
    setTruckCapacity(DEFAULT_CONFIG.truckCapacityTonnes);
    setBiogasYield(DEFAULT_CONFIG.biogasYieldPerTonneOrganic);
    setTariffInr(DEFAULT_CONFIG.electricityTariffInrPerKwh);
    showToast('Sliders reset to default pilot parameters', 'info');
  };

  // Load a saved scenario's parameters into sliders
  const handleLoadSavedScenario = (scenarioId: string) => {
    const found = savedScenarios.find((s) => s.id === scenarioId);
    if (!found) return;
    if (found.config.numberOfTrucks !== undefined) setTruckCount(found.config.numberOfTrucks);
    if (found.config.dispatchFillThreshold !== undefined) setDispatchThreshold(Math.round(found.config.dispatchFillThreshold * 100));
    if (found.config.truckCapacityTonnes !== undefined) setTruckCapacity(found.config.truckCapacityTonnes);
    if (found.config.biogasYieldPerTonneOrganic !== undefined) setBiogasYield(found.config.biogasYieldPerTonneOrganic);
    if (found.config.electricityTariffInrPerKwh !== undefined) setTariffInr(found.config.electricityTariffInrPerKwh);
    showToast(`Loaded parameters for "${found.name}" into builder`, 'info');
  };

  // Save named scenario
  const handleSaveScenarioConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!scenarioNameInput.trim()) return;
    const ok = saveScenario(scenarioNameInput.trim(), currentScenarioConfig, currentMetrics);
    if (ok) {
      setScenarioNameInput('');
      setShowSaveModal(false);
    }
  };

  // Rename scenario
  const handleSaveRename = (id: string) => {
    if (!editingName.trim()) return;
    renameScenario(id, editingName.trim());
    setEditingScenarioId(null);
    setEditingName('');
  };

  return (
    <div className="space-y-6 pb-16">
      {/* ── Page Header ─────────────────────────────────────────────────── */}
      <PageHeader
        title="Scenario Builder & Policy Planner"
        subtitle="Model municipal waste policy options, test fleet capacity and off-take tariffs, and compare outcomes side-by-side before operational deployment."
        showBackToDashboard={true}
        decisionPrompt="Which operational policy delivers optimal diversion and cost efficiency for the corridor?"
        actions={
          <div className="flex flex-wrap items-center gap-3">
            <Button
              variant="secondary"
              size="sm"
              icon={<RotateCcw className="w-3.5 h-3.5" />}
              onClick={handleResetToDefaults}
              aria-label="Reset sliders to default parameters"
            >
              Reset to Defaults
            </Button>
            <ExportReportMenu />
          </div>
        }
      />

      {/* ── Active Scenario Indicator Banner ────────────────────────────── */}
      <div className="p-4 sm:p-5 rounded-2xl bg-surface border border-line shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-surface-muted text-fg flex-shrink-0">
            <FlaskConical className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-bold tracking-wider text-fg-muted">
                Active Operational Scenario
              </span>
              <Badge variant={activeScenarioId ? 'emerald' : 'navy'} size="sm">
                {activeScenarioId ? 'Custom Plan Active' : 'Default ReLoop (4 Trucks / 75%)'}
              </Badge>
            </div>
            <p className="text-sm font-bold text-fg mt-0.5">
              {activeScenarioId
                ? `Active in Dashboard & Loop Steps: "${savedScenarios.find((s) => s.id === activeScenarioId)?.name || 'Custom Scenario'}"`
                : 'Default ReLoop AI scenario is currently active on the Dashboard and pilot loop.'}
            </p>
          </div>
        </div>

        {activeScenarioId && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setActiveScenario(null)}
            className="text-xs text-fg-muted hover:text-fg self-start sm:self-auto"
          >
            Revert to Default
          </Button>
        )}
      </div>

      {/* ── Top Grid: Policy Controls & Saved Scenarios ───────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Scenario Controls Panel (lg:col-span-8) */}
        <div className="lg:col-span-8">
          <SectionCard
            title="Operational & Economic Parameters"
            subtitle="Adjust levers below to model alternative municipal collection schedules, fleet payloads, and energy yields."
            headerAction={
              <Button
                variant="primary"
                size="md"
                icon={isRunning ? undefined : <Play className="w-4 h-4 fill-current" />}
                onClick={handleRunScenario}
                disabled={isRunning}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs gap-2"
                aria-label="Run scenario simulation"
              >
                {isRunning ? (
                  <span className="flex items-center gap-2">
                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Simulating...
                  </span>
                ) : (
                  'Run Scenario'
                )}
              </Button>
            }
          >
            <div className="space-y-6 pt-2">
              {/* Slider 1: Number of Compactor Trucks */}
              <div className="space-y-2 p-4 rounded-xl bg-surface-muted border border-line">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-fg" />
                    <label htmlFor="slider-trucks" className="font-bold text-fg">
                      Fleet Size (Compactor Trucks):
                    </label>
                  </div>
                  <span className="font-mono font-extrabold text-sm text-fg px-2.5 py-0.5 rounded-lg bg-surface border border-line">
                    {truckCount} trucks
                  </span>
                </div>
                <input
                  id="slider-trucks"
                  type="range"
                  min={2}
                  max={8}
                  step={1}
                  value={truckCount}
                  onChange={(e) => setTruckCount(Number(e.target.value))}
                  className="w-full h-2.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                />
                <div className="flex justify-between text-[11px] text-fg-subtle">
                  <span>2 trucks (lean)</span>
                  <span>4 trucks (pilot default)</span>
                  <span>8 trucks (high frequency)</span>
                </div>
                <p className="text-xs text-fg-muted mt-1">
                  Higher fleet sizes reduce bin wait times, but increase total fuel burn and driver labor costs.
                </p>
              </div>

              {/* Slider 2: Dispatch Fill Threshold */}
              <div className="space-y-2 p-4 rounded-xl bg-surface-muted border border-line">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <SlidersHorizontal className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <label htmlFor="slider-threshold" className="font-bold text-fg">
                      Dispatch Fill Threshold (% Fill):
                    </label>
                  </div>
                  <span className="font-mono font-extrabold text-sm text-fg px-2.5 py-0.5 rounded-lg bg-surface border border-line">
                    {dispatchThreshold}%
                  </span>
                </div>
                <input
                  id="slider-threshold"
                  type="range"
                  min={50}
                  max={95}
                  step={5}
                  value={dispatchThreshold}
                  onChange={(e) => setDispatchThreshold(Number(e.target.value))}
                  className="w-full h-2.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                />
                <div className="flex justify-between text-[11px] text-fg-subtle">
                  <span>50% (frequent pickups)</span>
                  <span>75% (optimal default)</span>
                  <span>95% (overflow risk)</span>
                </div>
                <p className="text-xs text-fg-muted mt-1">
                  Bins trigger dynamic CVRP routing when fill level hits this threshold. Lower values prevent overflow; higher values optimize route payload.
                </p>
              </div>

              {/* Slider 3: Truck Capacity */}
              <div className="space-y-2 p-4 rounded-xl bg-surface-muted border border-line">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-fg" />
                    <label htmlFor="slider-capacity" className="font-bold text-fg">
                      Truck Payload Capacity:
                    </label>
                  </div>
                  <span className="font-mono font-extrabold text-sm text-fg px-2.5 py-0.5 rounded-lg bg-surface border border-line">
                    {truckCapacity.toFixed(1)} tonnes
                  </span>
                </div>
                <input
                  id="slider-capacity"
                  type="range"
                  min={2.5}
                  max={8.0}
                  step={0.5}
                  value={truckCapacity}
                  onChange={(e) => setTruckCapacity(Number(e.target.value))}
                  className="w-full h-2.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                />
                <div className="flex justify-between text-[11px] text-fg-subtle">
                  <span>2.5 t (mini compactor)</span>
                  <span>4.5 t (standard pilot)</span>
                  <span>8.0 t (heavy hydraulic)</span>
                </div>
                <p className="text-xs text-fg-muted mt-1">
                  Larger payload capacities allow trucks to visit more smart bins before returning to the MRF or depot to dump.
                </p>
              </div>

              {/* 2-Column Mini Sliders: Biogas Yield & Tariff */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Biogas Yield */}
                <div className="space-y-2 p-4 rounded-xl bg-surface-muted border border-line">
                  <div className="flex items-center justify-between text-sm">
                    <label htmlFor="slider-biogas" className="font-bold text-fg">
                      Biogas Yield (m³/t organic):
                    </label>
                    <span className="font-mono font-bold text-xs text-fg px-2 py-0.5 rounded bg-surface border border-line">
                      {biogasYield} m³/t
                    </span>
                  </div>
                  <input
                    id="slider-biogas"
                    type="range"
                    min={70}
                    max={160}
                    step={5}
                    value={biogasYield}
                    onChange={(e) => setBiogasYield(Number(e.target.value))}
                    className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                  />
                  <div className="flex justify-between text-[10px] text-fg-subtle">
                    <span>70 m³ (low)</span>
                    <span>110 m³ (default)</span>
                    <span>160 m³ (pure organic)</span>
                  </div>
                </div>

                {/* Electricity Tariff */}
                <div className="space-y-2 p-4 rounded-xl bg-surface-muted border border-line">
                  <div className="flex items-center justify-between text-sm">
                    <label htmlFor="slider-tariff" className="font-bold text-fg">
                      Grid Feed-in Tariff:
                    </label>
                    <span className="font-mono font-bold text-xs text-fg px-2 py-0.5 rounded bg-surface border border-line">
                      ₹{tariffInr.toFixed(2)}/kWh
                    </span>
                  </div>
                  <input
                    id="slider-tariff"
                    type="range"
                    min={4.0}
                    max={10.0}
                    step={0.2}
                    value={tariffInr}
                    onChange={(e) => setTariffInr(Number(e.target.value))}
                    className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                  />
                  <div className="flex justify-between text-[10px] text-fg-subtle">
                    <span>₹4.00</span>
                    <span>₹6.80 (MERC default)</span>
                    <span>₹10.00 (peak)</span>
                  </div>
                </div>
              </div>

              {/* Action Bar */}
              <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-line">
                <span className="text-xs text-fg-muted">
                  Last simulated: <span className="font-mono font-semibold text-fg">{lastRunTimestamp}</span>
                </span>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    icon={<Save className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />}
                    onClick={() => setShowSaveModal(true)}
                    className="text-xs font-bold text-emerald-700 dark:text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/10"
                  >
                    Save as Named Scenario
                  </Button>
                </div>
              </div>
            </div>
          </SectionCard>
        </div>

        {/* Saved Scenarios Manager Panel (lg:col-span-4) */}
        <div className="lg:col-span-4">
          <SectionCard
            title="Saved Scenarios"
            subtitle="Store up to 3 custom policies in browser storage"
            headerAction={
              <Badge variant="navy" size="sm">
                {savedScenarios.length} / 3 slots
              </Badge>
            }
          >
            <div className="space-y-3">
              {savedScenarios.length === 0 ? (
                <div className="p-6 rounded-xl border border-dashed border-line text-center space-y-2">
                  <FlaskConical className="w-8 h-8 text-fg-subtle mx-auto" />
                  <p className="text-sm font-semibold text-fg">No saved scenarios yet</p>
                  <p className="text-xs text-fg-muted leading-relaxed">
                    Tune the levers on the left and click "Save as Named Scenario" to benchmark your policies.
                  </p>
                </div>
              ) : (
                savedScenarios.map((scen) => {
                  const isActive = activeScenarioId === scen.id;
                  const isEditing = editingScenarioId === scen.id;

                  return (
                    <div
                      key={scen.id}
                      className={`p-4 rounded-xl border transition-all space-y-3 ${
                        isActive
                          ? 'bg-emerald-500/10 border-emerald-500/30 shadow-xs ring-1 ring-emerald-500/40'
                          : 'bg-surface border-line hover:border-emerald-500/30'
                      }`}
                    >
                      {/* Scenario Title / Rename */}
                      <div className="flex items-start justify-between gap-2">
                        {isEditing ? (
                          <div className="flex items-center gap-1.5 flex-1">
                            <input
                              type="text"
                              value={editingName}
                              onChange={(e) => setEditingName(e.target.value)}
                              className="text-xs font-bold px-2 py-1 border border-line rounded w-full bg-surface text-fg focus:outline-none focus:ring-1 focus:ring-emerald-500"
                              placeholder="New scenario name"
                              autoFocus
                            />
                            <button
                              type="button"
                              onClick={() => handleSaveRename(scen.id)}
                              className="p-1 rounded text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10"
                              aria-label="Confirm rename"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditingScenarioId(null)}
                              className="p-1 rounded text-fg-subtle hover:bg-surface-muted"
                              aria-label="Cancel rename"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <h3 className="text-sm font-bold text-fg truncate">{scen.name}</h3>
                              {isActive && (
                                <Badge variant="emerald" size="sm">
                                  Active
                                </Badge>
                              )}
                            </div>
                            <span className="text-[11px] text-fg-subtle">Created {scen.createdAt}</span>
                          </div>
                        )}

                        {!isEditing && (
                          <div className="flex items-center gap-1 flex-shrink-0">
                            <button
                              type="button"
                              onClick={() => {
                                setEditingScenarioId(scen.id);
                                setEditingName(scen.name);
                              }}
                              className="p-1.5 rounded-lg text-fg-subtle hover:text-fg hover:bg-surface-muted min-h-[32px]"
                              title="Rename scenario"
                              aria-label={`Rename ${scen.name}`}
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => deleteScenario(scen.id)}
                              className="p-1.5 rounded-lg text-fg-subtle hover:text-rose-600 hover:bg-rose-500/10 min-h-[32px]"
                              title="Delete scenario"
                              aria-label={`Delete ${scen.name}`}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Summary Specs */}
                      <div className="grid grid-cols-2 gap-2 text-xs font-mono text-fg-muted bg-surface-muted p-2 rounded-lg">
                        <div>
                          <span className="text-fg-subtle block text-[10px]">Fleet / Cap</span>
                          <span>{scen.config.numberOfTrucks || 4}t · {scen.config.truckCapacityTonnes || 4.5}t</span>
                        </div>
                        <div>
                          <span className="text-fg-subtle block text-[10px]">Diversion</span>
                          <span className="font-bold text-emerald-600 dark:text-emerald-400">{scen.metrics.diversionRatePercent.toFixed(1)}%</span>
                        </div>
                      </div>

                      {/* Scenario Action Buttons */}
                      <div className="flex items-center gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => handleLoadSavedScenario(scen.id)}
                          className="flex-1 py-1.5 px-2.5 rounded-lg text-xs font-semibold bg-surface-muted hover:bg-line text-fg transition-colors text-center min-h-[36px]"
                        >
                          Load Levers
                        </button>
                        <button
                          type="button"
                          onClick={() => setActiveScenario(isActive ? null : scen.id)}
                          className={`flex-1 py-1.5 px-2.5 rounded-lg text-xs font-bold transition-colors text-center min-h-[36px] ${
                            isActive
                              ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                              : 'bg-slate-800 dark:bg-slate-700 text-white hover:bg-slate-700 dark:hover:bg-slate-600'
                          }`}
                        >
                          {isActive ? 'Active on City' : 'Set as Active'}
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </SectionCard>
        </div>
      </div>

      {/* ── Save Scenario Modal Dialog ──────────────────────────────────── */}
      {showSaveModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-save-title"
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
        >
          <div className="bg-surface rounded-2xl max-w-md w-full p-6 shadow-xl space-y-4 border border-line text-fg">
            <div className="flex items-center justify-between">
              <h3 id="modal-save-title" className="text-base font-bold text-fg flex items-center gap-2">
                <FlaskConical className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                Save Custom Scenario
              </h3>
              <button
                type="button"
                onClick={() => setShowSaveModal(false)}
                className="text-fg-subtle hover:text-fg p-1 rounded-lg min-h-[44px]"
                aria-label="Close dialog"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-sm text-fg-muted">
              Save your current levers ({truckCount} trucks, {dispatchThreshold}% threshold, {truckCapacity} t capacity) as a named operational scenario.
            </p>

            <form onSubmit={handleSaveScenarioConfirm} className="space-y-4">
              <div>
                <label htmlFor="input-scenario-name" className="text-xs font-bold uppercase tracking-wider text-fg-muted block mb-1">
                  Scenario Name:
                </label>
                <input
                  id="input-scenario-name"
                  type="text"
                  required
                  placeholder="e.g. 6 Trucks Lean Corridor"
                  value={scenarioNameInput}
                  onChange={(e) => setScenarioNameInput(e.target.value)}
                  className="w-full text-sm font-semibold px-3 py-2 border border-line bg-surface text-fg rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  autoFocus
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="md"
                  onClick={() => setShowSaveModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                >
                  Save Scenario
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Plain-Language Takeaway Banner (Feature 2 Requirement) ──────── */}
      <div className="p-4 sm:p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 shadow-xs flex items-start gap-3.5">
        <div className="p-2 rounded-xl bg-emerald-600 text-white flex-shrink-0 mt-0.5">
          <Sparkles className="w-5 h-5" />
        </div>
        <div className="space-y-0.5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-300">
            Model Takeaway & Trade-off Assessment
          </span>
          <p className="text-sm sm:text-base font-bold text-fg leading-snug">
            {takeaway}
          </p>
        </div>
      </div>

      {/* ── 3-Way Side-by-Side Comparison Table ─────────────────────────── */}
      <SectionCard
        title="3-Way Scenario Benchmark"
        subtitle="Side-by-side comparison of municipal baseline status quo, default ReLoop AI, and your configured scenario"
        headerAction={
          <div className="flex items-center gap-2 text-xs text-fg-muted">
            <span className="flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400">
              <Award className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              Highlighted with icon + badge
            </span>
          </div>
        }
      >
        <div className="overflow-x-auto -mx-4 sm:mx-0">
          <table className="w-full text-left text-sm border-collapse min-w-[640px]">
            <caption className="sr-only">Operational and Fiscal Comparison of Waste Scenarios</caption>
            <thead>
              <tr className="border-b border-line bg-surface-muted text-xs text-fg-muted uppercase font-semibold">
                <th scope="col" className="py-3 px-4">Municipal Metric</th>
                <th scope="col" className="py-3 px-4">1. Baseline (Status Quo)</th>
                <th scope="col" className="py-3 px-4">2. Default ReLoop AI</th>
                <th scope="col" className="py-3 px-4">3. My Scenario</th>
                <th scope="col" className="py-3 px-4 text-right">Delta vs Default</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {comparisonRows.map((row) => {
                const isCustomBest = row.bestScenario === 'custom';
                const isDefaultBest = row.bestScenario === 'default';
                const isBaselineBest = row.bestScenario === 'baseline';

                return (
                  <tr key={row.key} className="hover:bg-surface-muted/50 transition-colors">
                    {/* Metric Label */}
                    <td className="py-3.5 px-4 font-semibold text-fg">
                      {row.label}
                    </td>

                    {/* Column 1: Baseline */}
                    <td className="py-3.5 px-4 font-mono text-fg-muted">
                      <div className="flex items-center gap-1.5">
                        <span>{row.baselineFormatted}</span>
                        {isBaselineBest && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-700 dark:text-amber-300">
                            <Award className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                            Best
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Column 2: Default ReLoop */}
                    <td className="py-3.5 px-4 font-mono text-fg font-medium">
                      <div className="flex items-center gap-1.5">
                        <span>{row.defaultReloopFormatted}</span>
                        {isDefaultBest && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-700 dark:text-emerald-300">
                            <Award className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                            Best
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Column 3: My Scenario */}
                    <td className={`py-3.5 px-4 font-mono font-bold ${
                      isCustomBest ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300' : 'text-fg'
                    }`}>
                      <div className="flex items-center gap-1.5">
                        <span>{row.myScenarioFormatted}</span>
                        {isCustomBest && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-1.5 py-0.5 rounded bg-emerald-600 text-white shadow-2xs">
                            <Award className="w-3 h-3 text-white" />
                            Best
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Delta Badge Column */}
                    <td className="py-3.5 px-4 text-right font-mono text-xs">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-md font-bold ${
                          (row.higherIsBetter && row.deltaVsDefault.value > 0) ||
                          (!row.higherIsBetter && row.deltaVsDefault.value < 0)
                            ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300'
                            : (row.higherIsBetter && row.deltaVsDefault.value < 0) ||
                              (!row.higherIsBetter && row.deltaVsDefault.value > 0)
                            ? 'bg-amber-500/15 text-amber-700 dark:text-amber-300'
                            : 'bg-surface-muted text-fg-muted'
                        }`}
                      >
                        {row.deltaVsDefault.formattedDelta}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footnote */}
        <div className="pt-4 border-t border-line flex flex-wrap items-center justify-between text-xs text-fg-muted gap-2">
          <span>
            Simulated pilot corridor data · Calibrated against Pune PCMC ward telemetry.
          </span>
          <span className="font-medium text-fg">
            Green badges highlight superior operational performance.
          </span>
        </div>
      </SectionCard>
    </div>
  );
};
