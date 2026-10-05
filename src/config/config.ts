// ============================================================================
// RELOOP CITY CONFIGURATION & ASSUMPTIONS
// All values below are labeled municipal pilot assumptions for Pune, India pilot.
// Changing these values reactively updates simulation calculations.
// ============================================================================

export interface ConfigState {
  // Operational Geography: Pune Pilot Zone (Pimpri-Chinchwad / Shivajinagar corridor)
  pilotCity: string;
  depotCoordinates: [number, number]; // [lat, lng]
  mrfCoordinates: [number, number]; // Material Recovery Facility
  adPlantCoordinates: [number, number]; // Anaerobic Digestion Plant
  
  // Waste generation & density assumptions
  binCapacityKg: number; // Assumption: Standard smart underground/street bin holds ~120 kg
  criticalFillThreshold: number; // 80% considered critical / near overflow
  dispatchFillThreshold: number; // 75% triggers ReLoop predictive pickup

  // Energy & Resource Recovery Factors (Assumptions)
  biogasYieldPerTonneOrganic: number; // Assumption: ~110 m³ biogas per tonne food/organic waste
  kwhPerCubicMeterBiogas: number; // Assumption: ~2.1 kWh electricity generated per m³ raw biogas (CHP efficiency ~38%)
  compostYieldFactor: number; // Assumption: ~0.35 tonne compost produced per tonne organic waste
  rdfYieldFactor: number; // Assumption: ~0.40 tonne Refuse Derived Fuel per tonne non-recyclable combustible residual
  
  // Financial Market Tariffs (in Indian Rupees ₹)
  electricityTariffInrPerKwh: number; // Assumption: ₹6.80 per kWh feed-in municipal tariff
  compostPriceInrPerTonne: number; // Assumption: ₹3,200 per tonne packaged organic city compost
  plasticPelletPriceInrPerTonne: number; // Assumption: ₹42,000 per tonne sorted high-grade HDPE/PET flakes
  paperPulpPriceInrPerTonne: number; // Assumption: ₹14,500 per tonne sorted OCC/kraft paper
  metalScrapPriceInrPerTonne: number; // Assumption: ₹68,000 per tonne sorted aluminum/tin scrap
  glassCulletPriceInrPerTonne: number; // Assumption: ₹4,800 per tonne color-sorted cullet
  cdAggregatesPriceInrPerTonne: number; // Assumption: ₹850 per tonne recycled manufactured sand / aggregate
  rdfPriceInrPerTonne: number; // Assumption: ₹2,400 per tonne RDF supplied to cement kilns
  eprCreditPriceInrPerTonne: number; // Assumption: ₹3,500 per tonne Extended Producer Responsibility plastic credit

  // Fleet & Logistics Factors
  dieselPriceInrPerLiter: number; // Assumption: ₹92.50 per liter diesel
  truckFuelEfficiencyKmPerLiter: number; // Assumption: 3.2 km per liter for municipal compact compactor truck
  truckCapacityTonnes: number; // Assumption: 4.5 tonnes payload capacity per compactor truck
  numberOfTrucks: number; // 4 trucks in pilot fleet

  // Climate & Emission Factors (Assumptions)
  kgCo2ePerLiterDiesel: number; // Assumption: 2.68 kg CO₂e emitted per liter diesel burned
  kgCo2eAvoidedPerTonneRecycled: number; // Assumption: 1,450 kg CO₂e avoided per tonne virgin material offset
  kgCo2eAvoidedPerTonneComposted: number; // Assumption: 520 kg CO₂e avoided by preventing anaerobic landfill methane
  kgCo2eAvoidedPerMwhCleanEnergy: number; // Assumption: 820 kg CO₂e avoided per MWh vs coal-heavy Indian grid average
  landfillTippingCostInrPerTonne: number; // Assumption: ₹1,200 per tonne municipal landfill tipping fee (avoided cost)

  // Real-world comparison conversion factors (all labeled assumptions for transparency)
  kwhPerHomePerMonth: number; // Assumption: ~90 kWh average monthly electricity use per urban Indian home (MNRE 2023)
  kgCo2ePerCarKm: number;     // Assumption: 0.192 kg CO₂e per passenger-car km (IPCC 2021 petrol car average)
  kgCo2ePerTreePerYear: number; // Assumption: 21 kg CO₂e sequestered per mature tree per year (FAO estimate)
}

export const DEFAULT_CONFIG: ConfigState = {
  pilotCity: "Pune Pilot Sector (PCCOE Smart Corridor)",
  depotCoordinates: [18.6515, 73.7610], // Central Municipal Depot (Akurdi / Nigdi area)
  mrfCoordinates: [18.6650, 73.7820], // Central Material Recovery Facility
  adPlantCoordinates: [18.6380, 73.7450], // Bio-Methanation & Waste-to-Energy Park

  binCapacityKg: 120,
  criticalFillThreshold: 80,
  dispatchFillThreshold: 75,

  // Energy & Resource yields
  biogasYieldPerTonneOrganic: 110, // m³/t
  kwhPerCubicMeterBiogas: 2.1, // kWh/m³
  compostYieldFactor: 0.35, // t compost / t organic
  rdfYieldFactor: 0.40, // t RDF / t residual

  // Prices & Tariffs
  electricityTariffInrPerKwh: 6.80,
  compostPriceInrPerTonne: 3200,
  plasticPelletPriceInrPerTonne: 42000,
  paperPulpPriceInrPerTonne: 14500,
  metalScrapPriceInrPerTonne: 68000,
  glassCulletPriceInrPerTonne: 4800,
  cdAggregatesPriceInrPerTonne: 850,
  rdfPriceInrPerTonne: 2400,
  eprCreditPriceInrPerTonne: 3500,

  // Logistics
  dieselPriceInrPerLiter: 92.50,
  truckFuelEfficiencyKmPerLiter: 3.2,
  truckCapacityTonnes: 4.5,
  numberOfTrucks: 4,

  // Emissions
  kgCo2ePerLiterDiesel: 2.68,
  kgCo2eAvoidedPerTonneRecycled: 1450,
  kgCo2eAvoidedPerTonneComposted: 520,
  kgCo2eAvoidedPerMwhCleanEnergy: 820,
  landfillTippingCostInrPerTonne: 1200,

  // Real-world comparison conversion factors (labeled assumptions)
  kwhPerHomePerMonth: 90,        // MNRE 2023: ~90 kWh/month per urban Indian home
  kgCo2ePerCarKm: 0.192,        // IPCC 2021: 0.192 kg CO₂e per km for petrol car
  kgCo2ePerTreePerYear: 21,     // FAO estimate: 21 kg CO₂e per mature tree per year
};

// Pilot zones with distinct waste mix profiles matching slide 5:
export interface ZoneProfile {
  id: string;
  name: string;
  center: [number, number];
  color: string;
  binCount: number;
  baseHourlyRateKg: number; // Base generation speed
  composition: {
    organic: number; // percentage (0 - 100)
    recyclable: number;
    cdWaste: number;
    eWaste: number;
    residual: number;
  };
}

export const PILOT_ZONES: ZoneProfile[] = [
  {
    id: "residential-zone",
    name: "Zone 1: Nigdi Pradhikaran (Residential)",
    center: [18.6530, 73.7700],
    color: "#7BA17D",
    binCount: 26,
    baseHourlyRateKg: 2.8,
    composition: {
      organic: 58,
      recyclable: 24,
      cdWaste: 3,
      eWaste: 2,
      residual: 13,
    },
  },
  {
    id: "commercial-zone",
    name: "Zone 2: Chinchwad Station Commercial Hub",
    center: [18.6360, 73.7910],
    color: "#12305C",
    binCount: 22,
    baseHourlyRateKg: 4.2,
    composition: {
      organic: 32,
      recyclable: 46,
      cdWaste: 4,
      eWaste: 5,
      residual: 13,
    },
  },
  {
    id: "market-zone",
    name: "Zone 3: Pimpri Central Mandi (Wholesale Market)",
    center: [18.6270, 73.8010],
    color: "#D9A441",
    binCount: 20,
    baseHourlyRateKg: 5.8,
    composition: {
      organic: 72,
      recyclable: 14,
      cdWaste: 1,
      eWaste: 1,
      residual: 12,
    },
  },
  {
    id: "construction-zone",
    name: "Zone 4: Moshi Spine Road (C&D Corridor)",
    center: [18.6690, 73.8340],
    color: "#8E9296",
    binCount: 16,
    baseHourlyRateKg: 6.4,
    composition: {
      organic: 12,
      recyclable: 18,
      cdWaste: 55,
      eWaste: 2,
      residual: 13,
    },
  },
  {
    id: "institutional-zone",
    name: "Zone 5: PCCOE Campus & Tech Park",
    center: [18.6517, 73.7615],
    color: "#4D84BE",
    binCount: 16,
    baseHourlyRateKg: 3.4,
    composition: {
      organic: 40,
      recyclable: 38,
      cdWaste: 2,
      eWaste: 9,
      residual: 11,
    },
  },
];
