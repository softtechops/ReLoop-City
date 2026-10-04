// ============================================================================
// RELOOP CITY DOMAIN TYPES
// ============================================================================

export type WasteStreamType = 'organic' | 'recyclable' | 'cdWaste' | 'eWaste' | 'residual';

export interface BinComposition {
  organic: number; // percentage (0 - 100)
  recyclable: number;
  cdWaste: number;
  eWaste: number;
  residual: number;
}

export interface SmartBin {
  id: string;
  name: string;
  zoneId: string;
  zoneName: string;
  lat: number;
  lng: number;
  fillPercent: number; // 0 - 100
  capacityKg: number;
  currentKg: number;
  primaryStream: WasteStreamType;
  composition: BinComposition;
  predictedHoursToFull: number;
  isOverflowing: boolean;
  isScheduledForPickup: boolean;
  assignedTruckId?: string;
  lastCollectedHour: number;
  history: number[]; // recent fill percentage history
}

export interface TruckRoute {
  truckId: string;
  truckName: string;
  color: string;
  binIds: string[];
  totalDistanceKm: number;
  collectedKg: number;
  utilizationPercent: number;
  pathCoordinates: [number, number][]; // coordinates for Leaflet polyline
  estimatedHours: number;
  fuelLiters: number;
  dieselCostInr: number;
  co2EmittedKg: number;
}

export interface RoutingComparison {
  baseline: {
    totalDistanceKm: number;
    binsVisited: number;
    unnecessaryEmptyVisits: number; // bins <50% visited anyway in baseline
    overflowMissedBins: number; // critical bins missed due to fixed schedule
    trips: number;
    fuelLiters: number;
    dieselCostInr: number;
    co2EmittedKg: number;
    totalCollectedTonnes: number;
  };
  reloop: {
    totalDistanceKm: number;
    binsVisited: number;
    unnecessaryEmptyVisits: number;
    overflowMissedBins: number;
    trips: number;
    fuelLiters: number;
    dieselCostInr: number;
    co2EmittedKg: number;
    totalCollectedTonnes: number;
  };
  savings: {
    distanceReductionPercent: number;
    fuelSavedLiters: number;
    fuelCostSavedInr: number;
    co2SavedKg: number;
    overflowPreventionPercent: number;
  };
}

export interface StreamBreakdown {
  collectedTonnes: number;
  recycledTonnes: number;
  compostedTonnes: number;
  energyRecoveredTonnes: number; // Anaerobic digestion + RDF
  cdAggregateTonnes: number;
  landfillAvoidedTonnes: number;
  landfilledTonnes: number; // unavoidable residual
  landfillDiversionRatePercent: number;
  energyGeneratedMwh: number;
  biogasProducedM3: number;
  revenueGeneratedInr: number;
  co2AvoidedTonnes: number;
  overflowEventsCount: number;
}

export interface SimulationTimeStep {
  hour: number;
  day: number;
  dayOfWeek: string;
  timestamp: string;
  totalCityFillAverage: number;
  baseline: StreamBreakdown;
  reloop: StreamBreakdown;
}

export interface ImageClassificationResult {
  id: string;
  name: string;
  imageUrl: string;
  detectedLabel: string;
  confidence: number; // 0 - 1
  materialStream: WasteStreamType;
  streamBadgeColor: string;
  targetProcessingUnit: string;
  targetUnitId: string;
  estimatedValuePerKgInr: number;
  carbonAvoidanceKgPerKg: number;
  sortingInstructions: string;
}

export interface AllocationUnit {
  id: string;
  name: string;
  category: 'Recycling' | 'Organic' | 'Energy' | 'Aggregates' | 'Residual';
  currentInputTonnesPerDay: number;
  maxCapacityTonnesPerDay: number;
  utilizationPercent: number;
  outputProduct: string;
  outputYield: string;
  operationalStatus: 'Optimal' | 'High Load' | 'Near Capacity';
}

export interface RevenueStreamItem {
  id: string;
  title: string;
  sourceCategory: string;
  monthlyRevenueInr: number;
  annualizedInr: number;
  percentageOfTotal: number;
  description: string;
  iconName: string;
}

export type ActivePage = 
  | 'overview'
  | 'dashboard'
  | 'map'
  | 'predict'
  | 'optimize'
  | 'classify'
  | 'allocate'
  | 'revenue'
  | 'assumptions';

export interface GuidedTourStep {
  stepNumber: number;
  stepName: string; // Sense, Predict, Optimize, Classify, Allocate, Forecast, Report
  pageTarget: ActivePage;
  title: string;
  description: string;
  highlightAction: string;
  takeaway: string;
}
