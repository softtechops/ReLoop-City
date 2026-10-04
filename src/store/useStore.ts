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

  // Guided 7-Step AI Tour
  isGuidedTourOpen: boolean;
  currentTourStep: number;
  startGuidedTour: () => void;
  nextTourStep: () => void;
  prevTourStep: () => void;
  closeGuidedTour: () => void;
}

const simPRNG = new SeededPRNG(422026);

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

  simState: createInitialSimulationState(DEFAULT_CONFIG, 422026),
  isSimRunning: false,
  simSpeed: 1,
  mode: 'reloop',
  selectedBin: null,

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
    });
  },

  // Guided Tour
  isGuidedTourOpen: false,
  currentTourStep: 0,
  startGuidedTour: () => set({ isGuidedTourOpen: true, currentTourStep: 0, activePage: 'map' }),
  nextTourStep: () => {
    const next = get().currentTourStep + 1;
    if (next <= 6) {
      const pages: ActivePage[] = ['map', 'predict', 'optimize', 'classify', 'allocate', 'allocate', 'dashboard'];
      set({ currentTourStep: next, activePage: pages[next] });
    } else {
      set({ isGuidedTourOpen: false });
    }
  },
  prevTourStep: () => {
    const prev = Math.max(0, get().currentTourStep - 1);
    const pages: ActivePage[] = ['map', 'predict', 'optimize', 'classify', 'allocate', 'allocate', 'dashboard'];
    set({ currentTourStep: prev, activePage: pages[prev] });
  },
  closeGuidedTour: () => set({ isGuidedTourOpen: false }),
}));
