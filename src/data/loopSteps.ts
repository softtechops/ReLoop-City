import {
  Radio,
  TrendingUp,
  Route as RouteIcon,
  ScanSearch,
  GitFork,
  Zap,
  Coins,
  type LucideIcon,
} from 'lucide-react';

export interface LoopStepDef {
  step: number;
  name: string;
  headline: string;
  path: string;
  icon: LucideIcon;
  desc: string;
}

export const LOOP_STEPS: LoopStepDef[] = [
  {
    step: 1,
    name: 'Sense',
    headline: 'IoT Telemetry',
    path: '/app/map',
    icon: Radio,
    desc: 'Ultrasonic smart bins across city wards broadcast fill level, weight and fill-velocity every 15 minutes.',
  },
  {
    step: 2,
    name: 'Predict',
    headline: 'Waste Forecast',
    path: '/app/predict',
    icon: TrendingUp,
    desc: 'An LSTM model trained on zone demographics predicts bin overflow 24 hours ahead for pre-emptive dispatch.',
  },
  {
    step: 3,
    name: 'Optimize',
    headline: 'Dynamic Dispatch',
    path: '/app/optimize',
    icon: RouteIcon,
    desc: 'A CVRP 2-Opt heuristic runs hourly. Trucks skip bins below 75% fill, cutting route distance by 32%.',
  },
  {
    step: 4,
    name: 'Classify',
    headline: 'Computer Vision',
    path: '/app/classify',
    icon: ScanSearch,
    desc: 'Conveyor cameras classify polymer grades, metals and organics in milliseconds for pure commodity streams.',
  },
  {
    step: 5,
    name: 'Allocate',
    headline: 'Facility Balancing',
    path: '/app/allocate',
    icon: GitFork,
    desc: 'Tonnage is allocated to the MRF, anaerobic-digestion plant or composting facility to maximise recovery.',
  },
  {
    step: 6,
    name: 'Forecast',
    headline: 'Biogas & Energy',
    path: '/app/forecast',
    icon: Zap,
    desc: 'Organic digestate feeds a CHP plant generating grid electricity at ~2.1 kWh per m³ biogas.',
  },
  {
    step: 7,
    name: 'Report',
    headline: 'Circular Ledger',
    path: '/app/revenue',
    icon: Coins,
    desc: 'Commodity revenues, grid power, EPR credits and compost settle in a daily municipal ledger.',
  },
];
