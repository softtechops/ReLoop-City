// ============================================================================
// RELOOP GLOBAL ZUSTAND STORE
// Unifies simulation engine, municipal config overrides, baseline toggle,
// navigation state, and interactive guided tour workflow.
// ============================================================================

import { create } from 'zustand';
import { DEFAULT_CONFIG, ConfigState } from '../config/config';
import { ActivePage, SmartBin } from '../types';
import { SimulationState, createInitialSimulationState, stepSimulation } from '../sim/engine';
import { SeededPRNG } from '../sim/prng';

export interface UserProfile {
  name: string;
  email: string;
  role: string;
  organization: string;
}

interface StoreState {
  // Configuration & Assumptions
  config: ConfigState;
  updateConfig: (newValues: Partial<ConfigState>) => void;
  resetConfig: () => void;

  // Authentication State
  currentUser: UserProfile | null;
  isAuthenticated: boolean;
  login: (user?: Partial<UserProfile>) => void;
  signup: (user: UserProfile) => void;
  logout: () => void;

  // Simulation State
  simState: SimulationState;
  isSimRunning: boolean;
  simSpeed: 1 | 10 | 60; // 1x, 10x, 60x speed
  mode: 'reloop' | 'baseline'; // Platform mode toggle
  selectedBin: SmartBin | null;

  // First-run Experience (In-Memory only, no localStorage)
  welcomeDismissed: boolean;
  dismissWelcome: () => void;

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
    set({ config: { ...DEFAULT_CONFIG } });
  },

  // Auth State & Methods
  currentUser: null,
  isAuthenticated: false,
  login: (user) => {
    set({
      isAuthenticated: true,
      currentUser: {
        name: user?.name || 'Dr. Sneha Patil',
        email: user?.email || 's.patil@pcmcindia.gov.in',
        role: user?.role || 'Municipal Commissioner / Evaluator',
        organization: user?.organization || 'Pimpri Chinchwad Municipal Corporation (PCMC)',
      },
    });
  },
  signup: (user) => {
    set({
      isAuthenticated: true,
      currentUser: user,
    });
  },
  logout: () => {
    set({
      isAuthenticated: false,
      currentUser: null,
    });
  },

  simState: createInitialSimulationState(DEFAULT_CONFIG, 422026),
  isSimRunning: false,
  simSpeed: 1,
  mode: 'reloop',
  selectedBin: null,

  welcomeDismissed: false,
  dismissWelcome: () => set({ welcomeDismissed: true }),

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
      // Don't deselect all trucks
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
    
    // Also update selectedBin if one is currently opened
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

  // Left Sidebar 7-Step AI Loop Visibility Toggle
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
      const pages: ActivePage[] = ['map', 'predict', 'optimize', 'classify', 'allocate', 'allocate', 'dashboard'];
      set({ currentTourStep: next, activePage: pages[next], isLoopStepsExpanded: true });
    } else {
      set({ isGuidedTourOpen: false });
    }
  },
  prevTourStep: () => {
    const prev = Math.max(0, get().currentTourStep - 1);
    const pages: ActivePage[] = ['map', 'predict', 'optimize', 'classify', 'allocate', 'allocate', 'dashboard'];
    set({ currentTourStep: prev, activePage: pages[prev], isLoopStepsExpanded: true });
  },
  closeGuidedTour: () => set({ isGuidedTourOpen: false }),
}));
