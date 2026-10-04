# ReLoop City 🏙️♻️
### AI-Powered Waste-to-Resource Circular City Platform
**Track**: Smart Cities & Circular Economy | **Theme**: AI for Climate Change  
**Grand Challenge**: PCCOE International Grand Challenge 2026, Pune, India  
**Pilot Corridor**: Pune / PCMC Sector (Akurdi – Chinchwad – Moshi Corridor)

---

## 🌟 Executive Summary
**"Cities are losing value in their own waste."** Current municipal waste systems follow a linear **Collect → Transport → Dump** paradigm, burning taxpayer funds on fuel for fixed routes visiting half-empty bins, while valuable recyclables rot in overflowing landfills emitting subterranean methane.

**ReLoop City** redesigns municipal waste management into an **autonomous 7-step circular loop**:
> **Sense ➔ Predict ➔ Optimize ➔ Classify ➔ Allocate ➔ Forecast ➔ Report**

By converting raw waste streams into **commodity-grade recyclates, clean electricity (MWh), compressed Bio-CNG, organic city compost, and recycled C&D aggregates**, ReLoop achieves:
- **95.2% Landfill Diversion Rate** (vs. 61% baseline)
- **-32% Fleet Distance & Fuel Burn** via dynamic CVRP routing
- **₹34.2 Lakh / Quarter** in newly monetized municipal circular revenue
- **100% Overflow Incident Preemption**

All data is **simulated client-side** in the browser using a deterministic seeded Pseudo-Random Number Generator (PRNG) with clearly labeled assumptions.

---

## 🚀 Quickstart & Setup

### Prerequisites
- Node.js (v18+ or v20+ recommended)
- npm or yarn

### Installation
```bash
# Clone or navigate to the repository
cd "ReLoop City"

# Install dependencies
npm install

# Start the local development server
npm run dev
```

Open `http://localhost:5173/` (or the port shown in your terminal) in any modern web browser.

### Production Build
```bash
# Validate TypeScript and bundle with Vite
npm run build

# Preview production build locally
npm run preview
```

---

## 🧭 The 7-Step AI Loop Architecture

| Step | Page / Component | Key Innovation | Municipal Impact |
|---|---|---|---|
| **1. Sense** | `Live City Map` | 100 Smart Bins with ultrasonic fill & optical telemetry across 5 pilot zones. | Real-time transparency; replaces blind static garbage schedules. |
| **2. Predict** | `Predict Generation` | Multi-zone time-series forecasting model (diurnal human cycles + day-of-week seasonality). | Anticipates overflow surges 24–72 hours in advance. |
| **3. Optimize** | `Dynamic Routes` | Capacity-Constrained Vehicle Routing Problem (CVRP) solved via **Nearest-Neighbor + 2-Opt local search**. | Bins <75% full are skipped; cuts fuel burn and tailpipe CO₂ by 32%. |
| **4. Classify** | `MRF Vision Sort` | Pluggable Computer Vision classifier identifying material stream, purity, and target processing unit. | Recovers high-grade commodity polymers, metals, and pulp worth up to 10x mixed waste. |
| **5. Allocate** | `Resource Streams` | Sankey mass balance flow directing materials to Anaerobic Digestion, Composting, RDF, and Aggregate crushing. | 95%+ of city waste bypasses landfills into value creation. |
| **6. Forecast** | `Energy & Bio-Methane` | Real-time bio-methanation conversion model estimating MWh electrical power and Bio-CNG. | Powers municipal facilities and city transit buses. |
| **7. Report** | `Waste-to-Value Dashboard` | Executive municipal dashboard with live **Baseline (Fixed) vs. ReLoop (AI)** strategy toggle and delta badges. | Data-driven proof of circular economics and carbon ROI. |

---

## 🎤 3-Minute Live Competition Demo Script

### **[0:00 – 0:35] Problem & Concept (Landing Page)**
1. Open the **Landing Page** (`/overview`).
2. Point out the headline: *"Cities are losing value in their own waste."*
3. Show the **Linear Reality vs Circular Future** card: explain how traditional municipal routes collect unsegregated waste, burning fuel and overloading landfills.
4. Highlight the **Animated 3-Stage Diagram**: Inputs (5 streams) ➔ Intelligence Layer (CVRP + Vision) ➔ Outputs (Power, Bio-CNG, Compost, Recycled Aggregates).
5. Click **"Launch Live Prototype"** or **"Guided Tour"**.

### **[0:36 – 1:30] Waste-to-Value Command Center (Dashboard & Map)**
1. On the **Waste-to-Value Dashboard**, show the **6 KPI cards**:
   - Waste Collected: ~162.8 t
   - Recycled: ~49.6 t
   - Energy Generated: ~71.0 MWh
   - Landfill Avoided: ~154.8 t
   - Revenue: ~₹34.2 Lakh
   - CO₂ Avoided: ~146.5 tonnes CO₂e
2. **The "Aha!" Moment**: Click the **"Baseline (Fixed)"** toggle in the header.
   - Watch the KPI delta badges update: diversion drops to 61%, revenue falls to ₹18.4 Lakh, landfill spikes to 38%.
   - Switch back to **"ReLoop (AI-Optimized)"** to show the immediate circular rebound.
3. Switch to **"1. Sense (Smart IoT Bins)"**:
   - Show the interactive Leaflet map of the Pune PCMC corridor with 100 smart bins.
   - Click on any **red bin (>80% full)**: inspect the live telemetry drawer showing fill %, weight (kg), stream composition, and the alert: *"Predicted full in 2.4 hours"*.

### **[1:31 – 2:20] Intelligence in Action (Predict & Optimize)**
1. Navigate to **"2. Predict"**:
   - Point out the 48-hour per-zone generation forecast curves.
   - Highlight the peak alert for the Pimpri Mandi Wholesale Market (morning produce surge).
2. Navigate to **"3. Optimize"**:
   - Click **"Recalculate Dynamic Routes"** (watch confetti fire and 2-Opt run).
   - Show the 4 color-coded compactor truck routes drawn on the map.
   - Point to the **Comparison Table**: *-32% distance driven*, zero trips to empty bins, 100% overflow preemption, saving ₹14,200/day in diesel alone.

### **[2:21 – 3:00] Sorting, Monetization & Scale (Classify, Revenue & Roadmap)**
1. Navigate to **"4. Classify"**:
   - Click a sample waste item (e.g. *Banana Peels* or *Aluminum Can*).
   - Show the neural network confidence bar (98.4%), detected stream, and target facility (*Continuous Anaerobic Digester #2*).
2. Navigate to **"7. Report & Revenue"**:
   - Show the breakdown of the **6 revenue streams** (recycled polymers, clean grid power, city compost, EPR credits, RDF off-take, and avoided tipping fees).
   - Show how ReLoop delivers an estimated **₹20.4 Lakh net surplus quarterly**.
3. Conclude on **"Assumptions & Scaling Roadmap"**:
   - Slide any parameter (e.g., biogas yield or electricity tariff) to demonstrate live reactive recalculation.
   - Close with the 5-phase roadmap: from today's Single MRF Pilot to the regional cross-city circular marketplace!

---

## 🔌 Production Integration Guide (Where to Plug in Real Systems)

The ReLoop City codebase is designed with clean modular interfaces so production IoT feeds, OR-Tools solvers, and deep learning models can be plugged in directly:

### 1. Connecting Real IoT Telemetry (Ultrasonic / Weight Sensors)
* **File to edit**: [`src/sim/engine.ts`](file:///c:/Users/rekha/Desktop/ReLoop%20City/src/sim/engine.ts)
* **How to integrate**:
  Replace the simulated tick update in `stepSimulation()` with a WebSocket or MQTT listener:
  ```typescript
  import mqtt from 'mqtt';
  const client = mqtt.connect('mqtts://iot.punemunicipal.gov.in:8883');

  client.on('message', (topic, payload) => {
    const telemetry = JSON.parse(payload.toString());
    // update bin fillPercent, currentKg, and battery level
    useStore.getState().updateBinTelemetry(telemetry.binId, telemetry);
  });
  ```

### 2. Plugging in a Real Vehicle Routing Solver (Google OR-Tools / OSRM)
* **File to edit**: [`src/sim/routing.ts`](file:///c:/Users/rekha/Desktop/ReLoop%20City/src/sim/routing.ts)
* **How to integrate**:
  In `generateReLoopRoutes()`, the heuristic currently executes client-side 2-Opt. To connect Google OR-Tools or an OSRM turn-by-turn road network API:
  ```typescript
  export async function solveWithORTools(bins: SmartBin[]): Promise<TruckRoute[]> {
    const response = await fetch('https://api.reloopcity.org/vrp/solve', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        depot: DEFAULT_CONFIG.depotCoordinates,
        locations: bins.map(b => ({ id: b.id, lat: b.lat, lng: b.lng, demand: b.currentKg })),
        capacity: DEFAULT_CONFIG.truckCapacityTonnes * 1000,
        fleetSize: DEFAULT_CONFIG.numberOfTrucks
      })
    });
    return await response.json();
  }
  ```

### 3. Plugging in a Real Computer Vision Model (TensorFlow.js / Cloud Vision)
* **File to edit**: [`src/lib/classifier.ts`](file:///c:/Users/rekha/Desktop/ReLoop%20City/src/lib/classifier.ts)
* **How to integrate**:
  Replace the mock logic inside `classifyImage(input: File | string)` with a TensorFlow.js or Roboflow model:
  ```typescript
  import * as tf from '@tensorflow/tfjs';

  export async function classifyImage(imageElement: HTMLImageElement): Promise<ImageClassificationResult> {
    const model = await tf.loadLayersModel('/models/mrf-waste-classifier/model.json');
    const tensor = tf.browser.fromPixels(imageElement).resizeNearestNeighbor([224, 224]).toFloat().expandDims();
    const predictions = await model.predict(tensor).data();
    // Map tensor argmax to waste class and target facility
    return formatClassificationResult(predictions);
  }
  ```

---

## 📊 Municipal Assumptions & Formulas
All assumptions are isolated in [`src/config/config.ts`](file:///c:/Users/rekha/Desktop/ReLoop%20City/src/config/config.ts) and can be adjusted interactively in the UI:

| Parameter | Default Pilot Value | Standard Source / Municipal Assumption |
|---|---|---|
| **Bin Capacity** | 120 kg | Standard street compactor / underground smart receptacle |
| **Dispatch Threshold** | 75% Fill | ReLoop trigger point to prevent premature collection |
| **Biogas Yield** | 110 m³ / tonne | Mesophilic anaerobic digestion of high-moisture organic kitchen waste |
| **Electrical Conversion** | 2.1 kWh / m³ biogas | Combined Heat and Power (CHP) engine with 38% electrical efficiency |
| **Compost Yield** | 0.35 t / t wet organic | Aerated static pile windrow composting mass balance |
| **Electricity Feed-in Tariff** | ₹6.80 / kWh | Maharashtra Electricity Regulatory Commission (MERC) renewable tariff |
| **Commercial Diesel** | ₹92.50 / Liter | Local Pune municipal commercial bulk fuel price |
| **Truck Consumption** | 3.2 km / Liter | Mid-sized compactor truck in congested urban traffic |
| **Diesel Emissions** | 2.68 kg CO₂e / L | Standard IPCC mobile combustion emission factor |
| **Avoided Landfill Tipping**| ₹1,200 / tonne | Municipal cost per tonne dumped at Moshi landfill |

---

## 🏗️ Project Folder Structure
```
ReLoop City/
├── index.html                   # HTML entry point, Leaflet CSS & typography
├── package.json                 # Project dependencies & scripts
├── postcss.config.js            # PostCSS configuration
├── tailwind.config.js           # Municipal blueprint design tokens & colors
├── tsconfig.json                # TypeScript project configuration
├── src/
│   ├── main.tsx                 # React entry point
│   ├── App.tsx                  # Main layout, router & guided tour orchestrator
│   ├── index.css                # Base styles, blueprint grid & animations
│   ├── types/
│   │   └── index.ts             # Domain interfaces (Bin, Route, Simulation, Streams)
│   ├── config/
│   │   └── config.ts            # Municipal assumptions, zone profiles & prices
│   ├── sim/
│   │   ├── prng.ts              # Seeded Mulberry32 PRNG (deterministic simulation)
│   │   ├── binsGenerator.ts     # 100 geo-located smart bins across 5 Pune zones
│   │   ├── engine.ts            # Hourly simulation engine & baseline comparison
│   │   ├── routing.ts           # CVRP Nearest-Neighbor + 2-Opt TSP solver
│   │   └── predictor.ts         # Time-series 24-72h volume forecast model
│   ├── lib/
│   │   └── classifier.ts        # Computer vision sorting architecture & sample catalog
│   ├── store/
│   │   └── useStore.ts          # Zustand global state (simulation, mode, tour)
│   ├── components/
│   │   ├── Header.tsx           # Municipal header, simulated badge, mode toggle
│   │   ├── Sidebar.tsx          # Desktop left rail & mobile bottom tab bar
│   │   └── GuidedTourModal.tsx  # 7-step interactive walkthrough modal
│   └── pages/
│       ├── LandingOverview.tsx  # Hero, paradigm shift, 7-step stepper
│       ├── Dashboard.tsx        # 6 KPIs, CO2 card, Donut chart, Live time-series
│       ├── LiveCityMap.tsx      # Leaflet map, 100 bins, telemetry inspector
│       ├── PredictPage.tsx      # Zone forecast charts & "Predicted full in Xh"
│       ├── OptimizePage.tsx     # 2-Opt routes, truck manifest, savings table
│       ├── ClassifyPage.tsx     # MRF image upload & 8 sample waste clicker
│       ├── AllocatePage.tsx     # Sankey mass balance flow & energy forecast
│       ├── RevenuePage.tsx      # 6 revenue streams & financial waterfall
│       └── AssumptionsRoadmap.tsx # Reactive config sliders & 5-phase roadmap
```

---

**Developed for the PCCOE International Grand Challenge 2026**  
*Theme: AI for Climate Change • Smart Cities & Circular Economy Track*
