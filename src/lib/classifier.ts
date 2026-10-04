// ============================================================================
// COMPUTER VISION CLASSIFICATION LAYER (MRF AUTOMATED SORTING)
// Pluggable architecture: mock classifier with clean classifyImage() signature
// Drop-in compatible with TensorFlow.js or cloud computer-vision inference APIs
// ============================================================================

import { ImageClassificationResult, WasteStreamType } from '../types';

export interface SampleWasteItem {
  id: string;
  name: string;
  category: string;
  imageThumbnail: string; // SVG data URI or crisp visual symbol
  filename: string;
  keywords: string[];
  expectedStream: WasteStreamType;
  streamBadgeColor: string;
  targetUnit: string;
  targetUnitId: string;
  valuePerKg: number;
  co2AvoidanceKg: number;
  instructions: string;
}

export const SAMPLE_WASTE_ITEMS: SampleWasteItem[] = [
  {
    id: 'sample-pet-bottle',
    name: 'PET Water Bottle (Clear)',
    category: 'Plastics #1',
    imageThumbnail: '🍾',
    filename: 'pet_bottle_clear.jpg',
    keywords: ['bottle', 'pet', 'plastic', 'drink', 'water', 'beverage', 'clear'],
    expectedStream: 'recyclable',
    streamBadgeColor: '#12305C',
    targetUnit: 'MRF Optical Sorting Line #1 (PET Flakes)',
    targetUnitId: 'unit-mrf-pet',
    valuePerKg: 42.0,
    co2AvoidanceKg: 1.45,
    instructions: 'Cap removed, baled into grade-A clear flakes for textile yarn and food-grade rPET pellets.',
  },
  {
    id: 'sample-banana-peel',
    name: 'Fruit & Vegetable Peels',
    category: 'Wet Organics',
    imageThumbnail: '🍌',
    filename: 'banana_kitchen_waste.jpg',
    keywords: ['banana', 'peel', 'fruit', 'food', 'vegetable', 'kitchen', 'organic', 'wet', 'compost'],
    expectedStream: 'organic',
    streamBadgeColor: '#7BA17D',
    targetUnit: 'Continuous Thermophilic Anaerobic Digester #2',
    targetUnitId: 'unit-ad-plant',
    valuePerKg: 3.2,
    co2AvoidanceKg: 0.52,
    instructions: 'High methane potential. Routed directly to primary pulper for 28-day anaerobic digestion producing bio-CNG.',
  },
  {
    id: 'sample-corrugated-box',
    name: 'Corrugated Cardboard Carton',
    category: 'Paper & Pulp',
    imageThumbnail: '📦',
    filename: 'shipping_carton.jpg',
    keywords: ['box', 'cardboard', 'carton', 'paper', 'shipping', 'packaging'],
    expectedStream: 'recyclable',
    streamBadgeColor: '#12305C',
    targetUnit: 'MRF Hydropulper & OCC De-inking Line',
    targetUnitId: 'unit-mrf-occ',
    valuePerKg: 14.5,
    co2AvoidanceKg: 0.95,
    instructions: 'Dry, ungreased kraft fibers. High recyclability factor (reusable up to 7 fiber cycles).',
  },
  {
    id: 'sample-concrete-rubble',
    name: 'Concrete Block & Mortar Rubble',
    category: 'C&D Debris',
    imageThumbnail: '🧱',
    filename: 'demolition_rubble.jpg',
    keywords: ['concrete', 'brick', 'rubble', 'stone', 'construction', 'debris', 'aggregate'],
    expectedStream: 'cdWaste',
    streamBadgeColor: '#8E9296',
    targetUnit: 'Moshi Heavy Impactor & Gyratory Secondary Crusher',
    targetUnitId: 'unit-cd-crusher',
    valuePerKg: 0.85,
    co2AvoidanceKg: 0.22,
    instructions: 'Crushed and sieved into 10mm/20mm coarse aggregate and manufactured sand (M-Sand) for municipal paving.',
  },
  {
    id: 'sample-aluminum-can',
    name: 'Aluminum Beverage Can',
    category: 'Non-Ferrous Metals',
    imageThumbnail: '🥫',
    filename: 'aluminum_can.jpg',
    keywords: ['can', 'aluminum', 'metal', 'tin', 'soda', 'coke', 'beer'],
    expectedStream: 'recyclable',
    streamBadgeColor: '#D9A441',
    targetUnit: 'Eddy Current Non-Ferrous Metal Separator',
    targetUnitId: 'unit-mrf-metals',
    valuePerKg: 68.0,
    co2AvoidanceKg: 9.10,
    instructions: 'Infinitely recyclable without quality degradation. 95% energy savings compared to primary bauxite smelting.',
  },
  {
    id: 'sample-circuit-board',
    name: 'Discarded Circuit Board (PCB)',
    category: 'Electronic Waste',
    imageThumbnail: '💾',
    filename: 'motherboard_pcb.jpg',
    keywords: ['pcb', 'circuit', 'board', 'electronics', 'chip', 'computer', 'e-waste', 'wire'],
    expectedStream: 'eWaste',
    streamBadgeColor: '#4D84BE',
    targetUnit: 'Hydrometallurgical Precious Metal Recovery Lab',
    targetUnitId: 'unit-ewaste-refinery',
    valuePerKg: 185.0,
    co2AvoidanceKg: 3.80,
    instructions: 'High-value recovery of gold, copper, silver, and palladium. Hazardous lead and brominated flame retardants neutralized.',
  },
  {
    id: 'sample-multilayer-pouch',
    name: 'Multi-Layer Metallized Crisp Pouch',
    category: 'Non-Recyclable Residual',
    imageThumbnail: '🍟',
    filename: 'chip_bag_foil.jpg',
    keywords: ['crisp', 'chip', 'pouch', 'foil', 'wrapper', 'laminate', 'residual', 'trash'],
    expectedStream: 'residual',
    streamBadgeColor: '#8E9296',
    targetUnit: 'Refuse Derived Fuel (RDF) Pelletizer & Co-Processing',
    targetUnitId: 'unit-rdf-plant',
    valuePerKg: 2.4,
    co2AvoidanceKg: 0.35,
    instructions: 'Non-separable multi-layer polymer/aluminum film. Densified into high-calorific RDF pellets (3,800 kcal/kg) for cement kiln combustion.',
  },
  {
    id: 'sample-glass-bottle',
    name: 'Glass Condiment / Beverage Jar',
    category: 'Glass Cullet',
    imageThumbnail: '🫙',
    filename: 'glass_jar_flint.jpg',
    keywords: ['glass', 'jar', 'bottle', 'flint', 'amber', 'cullet'],
    expectedStream: 'recyclable',
    streamBadgeColor: '#12305C',
    targetUnit: 'Optical Glass Cullet Color-Sorting Line',
    targetUnitId: 'unit-mrf-glass',
    valuePerKg: 4.8,
    co2AvoidanceKg: 0.31,
    instructions: 'Cullet washed and separated by wavelength into flint, amber, and emerald for furnace remelting.',
  },
];

/**
 * Classify a waste item by image or filename
 * Plug-in point for TensorFlow.js or REST CV API
 */
export async function classifyImage(
  input: File | string,
  previewDataUrl?: string
): Promise<ImageClassificationResult> {
  // Simulate network / GPU inference latency (350 - 650 ms)
  await new Promise((resolve) => setTimeout(resolve, 520));

  const filename = typeof input === 'string' ? input.toLowerCase() : input.name.toLowerCase();
  
  // Find matching sample based on keywords
  let matched = SAMPLE_WASTE_ITEMS.find((item) =>
    item.keywords.some((k) => filename.includes(k)) || filename.includes(item.id)
  );

  if (!matched) {
    // Default fallback to recyclable or organic
    matched = filename.includes('food') || filename.includes('leaf') || filename.includes('bio')
      ? SAMPLE_WASTE_ITEMS[1]
      : SAMPLE_WASTE_ITEMS[0];
  }

  // Realistic high confidence score with slight variance
  const confidence = Number((0.92 + Math.random() * 0.075).toFixed(3));

  return {
    id: `CLS-${Date.now().toString(36).toUpperCase()}`,
    name: matched.name,
    imageUrl: previewDataUrl || matched.imageThumbnail,
    detectedLabel: `${matched.name} (${matched.category})`,
    confidence,
    materialStream: matched.expectedStream,
    streamBadgeColor: matched.streamBadgeColor,
    targetProcessingUnit: matched.targetUnit,
    targetUnitId: matched.targetUnitId,
    estimatedValuePerKgInr: matched.valuePerKg,
    carbonAvoidanceKgPerKg: matched.co2AvoidanceKg,
    sortingInstructions: matched.instructions,
  };
}
