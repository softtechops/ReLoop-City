// ============================================================================
// RELOOP GLOBAL ZUSTAND STORE
// Unifies simulation engine, municipal config overrides, baseline toggle,
// navigation state, interactive guided tour workflow, operations manager
// decisions, and scenario builder planner.
// ============================================================================

import { create } from 'zustand';
import { DEFAULT_CONFIG, ConfigState } from '../config/config';
import { ActivePage, SmartBin, SavedScenario, AllocationStrategy, EnergyCommitment } from '../types';
import { SimulationState, createInitialSimulationState, stepSimulation } from '../sim/engine';
import { SeededPRNG } from '../sim/prng';
import { ScenarioMetrics } from '../lib/metrics';

const ROLE_DISMISSED_KEY = 'reloop_role_card_dismissed';
const SAVED_SCENARIOS_KEY = 'reloop_saved_scenarios';

function loadRoleCardDismissed(): boolean {
  try {
    return localStorage.getItem(ROLE_DISMISSED_KEY) === 'true';
  } catch {
    return false;
  }
}

function saveRoleCardDismissed(dismissed: boolean): void {
  try {
    localStorage.setItem(ROLE_DISMISSED_KEY, String(dismissed));
  } catch {}
}

function loadSavedScenarios(): SavedScenario[] {
  try {
    const raw = localStorage.getItem(SAVED_SCENARIOS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed.slice(0, 3);
    }
    return [];
  } catch {
    return [];
  }
}

function saveSavedScenarios(scenarios: SavedScenario[]): void {
  try {
    localStorage.setItem(SAVED_SCENARIOS_KEY, JSON.stringify(scenarios.slice(0, 3)));
  } catch {}
}

interface ToastData {
  message: string;
  type?: 'success' | 'info' | 'error' | 'reloop' | 'baseline';
}

interface StoreState {
  // Configuration & Assumptions
  config: ConfigState;
  updateConfig: (newValues: Partial<ConfigState>) => void;
  resetConfig: () => void;

  // Simulation State
  simState: SimulationState;
  isSimRunning: boolean;
  simSpeed: 1 | 10 | 60; // 1x, 10x, 60x speed
  mode: 'reloop' | 'baseline'; // Platform mode toggle
  selectedBin: SmartBin | null;

  // First-run Experience (In-Memory only, no localStorage)
  welcomeDismissed: boolean;
  dismissWelcome: () => void;

  // Feature 1: Operations Manager Role & Decisions
  roleCardDismissed: boolean;
  dismissRoleCard: () => void;
  resetRoleCard: () => void;
  
  // Flagged priority bins (Sense step -> surfaces on Dashboard)
  priorityBinIds: string[];
  togglePriorityBin: (binId: string) => void;
  clearPriorityBins: () => void;

  // Step 2 (Predict): Flagged high-risk zone for advance dispatch
  flaggedZoneId: string | null;
  setFlaggedZoneId: (zoneId: string | null) => void;

  // Step 4 (Classify): Optical sorting overrides
  classificationOverrides: Record<string, string>;
  setClassificationOverride: (itemId: string, destination: string) => void;

  // Step 5 (Allocate): Facility diversion strategy
  allocationStrategy: AllocationStrategy;
  setAllocationStrategy: (strategy: AllocationStrategy) => void;

  // Step 6 (Forecast): Clean energy off-take commitment
  energyOfftakeCommitment: EnergyCommitment;
  setEnergyOfftakeCommitment: (commitment: EnergyCommitment) => void;

  // Step 7 (Report): Council ledger approval status
  councilReportApproved: boolean;
  councilApprovalTimestamp: string | null;
  approveCouncilReport: (approved?: boolean) => void;

  // Feature 2: Scenario Builder State
  savedScenarios: SavedScenario[];
  activeScenarioId: string | null; // null = Default ReLoop
  saveScenario: (name: string, scenarioConfig: Partial<ConfigState>, metrics: ScenarioMetrics) => boolean;
  deleteScenario: (id: string) => void;
  renameScenario: (id: string, newName: string) => void;
  setActiveScenario: (id: string | null) => void;

  // Toast Notification System
  toastNotification: ToastData | null;
  showToast: (message: string, type?: 'success' | 'info' | 'error' | 'reloop' | 'baseline') => void;
  clearToast: () => void;

  // Reset Confirmation Modal
  isResetConfirmOpen: boolean;
  openResetConfirm: () => void;
  closeResetConfirm: () => void;

  // Mobile Simulation Controls Sheet
  isMobileSimDrawerOpen: boolean;
  setMobileSimDrawerOpen: (open: boolean) => void;

  // Dashboard Preferences
  dashboardTimeRange: 'today' | '7days' | 'all';
  setDashboardTimeRange: (range: 'today' | '7days' | 'all') => void;
  dashboardViewMode: 'overview' | 'compare';
  setDashboardViewMode: (mode: 'overview' | 'compare') => void;

  // Route Truck Toggles
  activeTruckFilters: string[];
  toggleTruckFilter: (truckId: string) => void;
  setAllTruckFilters: (truckIds: string[]) => void;

  // Navigation & Workflow
  activePage: ActivePage;
  setActivePage: (page: ActivePage) => void;
  setSelectedBin: (bin: SmartBin | null) => void;
  setMode: (mode: 'reloop' | 'baseline') => void;

  // Simulation Controls
  startSimulation: () => void;
  pauseSimulation: () => void;
  setSimSpeed: (speed: 1 | 10 | 60) => void;
  tickSimulation: () => void;
  resetSimulation: () => void;

  // Left Sidebar 7-Step AI Loop Visibility Toggle
  isLoopStepsExpanded: boolean;
  toggleLoopSteps: () => void;
  setLoopStepsExpanded: (expanded: boolean) => void;

  // Guided 7-Step AI Tour
  isGuidedTourOpen: boolean;
  currentTourStep: number;
  startGuidedTour: () => void;
  nextTourStep: () => void;
  prevTourStep: () => void;
  closeGuidedTour: () => void;
}

const simPRNG = new SeededPRNG(422026);
const ALL_TRUCK_IDS = ['TRUCK-01', 'TRUCK-02', 'TRUCK-03', 'TRUCK-04'];

export const useStore = create<StoreState>((set, get) => ({
  config: { ...DEFAULT_CONFIG },
  updateConfig: (newValues) => {
    set((state) => ({
      config: { ...state.config, ...newValues },
    }));
  },
  resetConfig: () => {
    set({ config: { ...DEFAULT_CONFIG }, activeScenarioId: null });
  },

  simState: createInitialSimulationState(DEFAULT_CONFIG, 422026),
  isSimRunning: false,
  simSpeed: 1,
  mode: 'reloop',
  selectedBin: null,

  welcomeDismissed: false,
  dismissWelcome: () => set({ welcomeDismissed: true }),

  // Feature 1: Operations Manager Role & Decisions
  roleCardDismissed: loadRoleCardDismissed(),
  dismissRoleCard: () => {
    saveRoleCardDismissed(true);
    set({ roleCardDismissed: true });
  },
  resetRoleCard: () => {
    saveRoleCardDismissed(false);
    set({ roleCardDismissed: false });
  },

  priorityBinIds: ['BIN-014', 'BIN-042'], // Default initial priority bins for realism
  togglePriorityBin: (binId: string) => {
    const current = get().priorityBinIds;
    const exists = current.includes(binId);
    const updated = exists ? current.filter((id) => id !== binId) : [...current, binId];
    set({ priorityBinIds: updated });
    get().showToast(
      exists ? `Removed priority flag from ${binId}` : `Flagged ${binId} for priority dispatch`,
      'success'
    );
  },
  clearPriorityBins: () => set({ priorityBinIds: [] }),

  flaggedZoneId: 'market-zone', // Pimpri Mandi flagged by default
  setFlaggedZoneId: (zoneId: string | null) => {
    set({ flaggedZoneId: zoneId });
    if (zoneId) {
      get().showToast(`Zone flagged for advance collection dispatch`, 'info');
    }
  },

  classificationOverrides: {},
  setClassificationOverride: (itemId: string, destination: string) => {
    set((state) => ({
      classificationOverrides: { ...state.classificationOverrides, [itemId]: destination },
    }));
    get().showToast(`Routed ${itemId} to ${destination}`, 'success');
  },

  allocationStrategy: 'balanced',
  setAllocationStrategy: (strategy) => {
    set({ allocationStrategy: strategy });
    get().showToast(
      strategy === 'max_energy'
        ? 'Strategy set: Maximize Biogas & Electricity Yield'
        : strategy === 'max_recovery'
        ? 'Strategy set: Maximize Material Recovery & Commodity Sales'
        : 'Strategy set: Balanced Multi-Stream Allocation',
      'info'
    );
  },

  energyOfftakeCommitment: 'grid',
  setEnergyOfftakeCommitment: (commitment) => {
    set({ energyOfftakeCommitment: commitment });
    get().showToast(
      commitment === 'grid'
        ? 'Energy committed: MSEDCL Municipal Grid Feed-in (₹6.80/kWh)'
        : 'Energy committed: PMPML Electric Bus Depot Charging (₹7.20/kWh eq)',
      'success'
    );
  },

  councilReportApproved: false,
  councilApprovalTimestamp: null,
  approveCouncilReport: (approved = true) => {
    if (!approved) {
      set({ councilReportApproved: false, councilApprovalTimestamp: null });
      get().showToast('Reverted council presentation ledger to draft status', 'info');
      return;
    }
    const now = new Date().toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
    set({ councilReportApproved: true, councilApprovalTimestamp: now });
    get().showToast('Municipal ledger officially certified for City Council presentation', 'success');
  },

  // Feature 2: Scenario Builder State
  savedScenarios: loadSavedScenarios(),
  activeScenarioId: null,
  saveScenario: (name, scenarioConfig, metrics) => {
    const current = get().savedScenarios;
    if (current.length >= 3) {
      get().showToast('Maximum of 3 scenarios reached. Delete one to save a new scenario.', 'error');
      return false;
    }
    const newScenario: SavedScenario = {
      id: `scen-${Date.now()}`,
      name: name.trim() || `Scenario ${current.length + 1}`,
      createdAt: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
      config: scenarioConfig,
      metrics,
    };
    const updated = [...current, newScenario];
    saveSavedScenarios(updated);
    set({ savedScenarios: updated });
    get().showToast(`Saved scenario: "${newScenario.name}"`, 'success');
    return true;
  },
  deleteScenario: (id) => {
    const current = get().savedScenarios;
    const target = current.find((s) => s.id === id);
    const updated = current.filter((s) => s.id !== id);
    saveSavedScenarios(updated);
    // If active scenario was deleted, revert to default
    if (get().activeScenarioId === id) {
      set({ savedScenarios: updated, activeScenarioId: null, config: { ...DEFAULT_CONFIG } });
    } else {
      set({ savedScenarios: updated });
    }
    get().showToast(`Deleted scenario: "${target?.name || id}"`, 'info');
  },
  renameScenario: (id, newName) => {
    const updated = get().savedScenarios.map((s) => (s.id === id ? { ...s, name: newName.trim() } : s));
    saveSavedScenarios(updated);
    set({ savedScenarios: updated });
    get().showToast(`Renamed scenario to "${newName}"`, 'success');
  },
  setActiveScenario: (id) => {
    if (!id) {
      set({ activeScenarioId: null, config: { ...DEFAULT_CONFIG } });
      get().showToast('Reverted to Default ReLoop scenario', 'info');
      return;
    }
    const match = get().savedScenarios.find((s) => s.id === id);
    if (match) {
      set((state) => ({
        activeScenarioId: id,
        config: { ...DEFAULT_CONFIG, ...match.config },
      }));
      get().showToast(`Activated scenario: "${match.name}"`, 'success');
    }
  },

  // Toast System
  toastNotification: null,
  showToast: (message, type = 'info') => {
    set({ toastNotification: { message, type } });
  },
  clearToast: () => set({ toastNotification: null }),

  isResetConfirmOpen: false,
  openResetConfirm: () => set({ isResetConfirmOpen: true }),
  closeResetConfirm: () => set({ isResetConfirmOpen: false }),

  isMobileSimDrawerOpen: false,
  setMobileSimDrawerOpen: (open) => set({ isMobileSimDrawerOpen: open }),

  dashboardTimeRange: '7days',
  setDashboardTimeRange: (range) => set({ dashboardTimeRange: range }),
  dashboardViewMode: 'overview',
  setDashboardViewMode: (mode) => set({ dashboardViewMode: mode }),

  activeTruckFilters: [...ALL_TRUCK_IDS],
  toggleTruckFilter: (truckId: string) => {
    const current = get().activeTruckFilters;
    if (current.includes(truckId)) {
      if (current.length === 1) return;
      set({ activeTruckFilters: current.filter((id) => id !== truckId) });
    } else {
      set({ activeTruckFilters: [...current, truckId] });
    }
  },
  setAllTruckFilters: (truckIds: string[]) => set({ activeTruckFilters: truckIds }),

  activePage: 'overview',
  setActivePage: (page) => set({ activePage: page }),
  setSelectedBin: (bin) => set({ selectedBin: bin }),
  setMode: (mode) => set({ mode }),

  startSimulation: () => set({ isSimRunning: true }),
  pauseSimulation: () => set({ isSimRunning: false }),
  setSimSpeed: (speed) => set({ simSpeed: speed }),

  tickSimulation: () => {
    const { simState, config } = get();
    const updated = stepSimulation(simState, config, simPRNG);
    
    let updatedSelectedBin = get().selectedBin;
    if (updatedSelectedBin) {
      const match = updated.bins.find((b) => b.id === updatedSelectedBin?.id);
      if (match) updatedSelectedBin = match;
    }

    set({
      simState: updated,
      selectedBin: updatedSelectedBin,
    });
  },

  resetSimulation: () => {
    simPRNG.reset(422026);
    const freshState = createInitialSimulationState(get().config, 422026);
    set({
      simState: freshState,
      isSimRunning: false,
      selectedBin: null,
      isResetConfirmOpen: false,
    });
  },

  isLoopStepsExpanded: false,
  toggleLoopSteps: () => set((state) => ({ isLoopStepsExpanded: !state.isLoopStepsExpanded })),
  setLoopStepsExpanded: (expanded: boolean) => set({ isLoopStepsExpanded: expanded }),

  // Guided Tour
  isGuidedTourOpen: false,
  currentTourStep: 0,
  startGuidedTour: () => set({ isGuidedTourOpen: true, currentTourStep: 0, activePage: 'map', isLoopStepsExpanded: true }),
  nextTourStep: () => {
    const next = get().currentTourStep + 1;
    if (next <= 6) {
      const pages: ActivePage[] = ['map', 'predict', 'optimize', 'classify', 'allocate', 'forecast', 'revenue'];
      set({ currentTourStep: next, activePage: pages[next], isLoopStepsExpanded: true });
    } else {
      set({ isGuidedTourOpen: false });
    }
  },
  prevTourStep: () => {
    const prev = Math.max(0, get().currentTourStep - 1);
    const pages: ActivePage[] = ['map', 'predict', 'optimize', 'classify', 'allocate', 'forecast', 'revenue'];
    set({ currentTourStep: prev, activePage: pages[prev], isLoopStepsExpanded: true });
  },
  closeGuidedTour: () => set({ isGuidedTourOpen: false }),
}));
