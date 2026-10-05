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
- **95.1% Landfill Diversion Rate** (vs. 28.0% baseline)
- **-32.0% Fleet Distance & Fuel Burn** via dynamic CVRP routing
- **₹34.2 Lakh / Quarter** in newly monetized municipal circular revenue (vs. ₹18.4 Lakh baseline)
- **100% Overflow Incident Preemption** (1 event vs. 42 baseline events)
- **146.5 tonnes CO₂e avoided** per pilot interval

All data is **simulated client-side** in the browser using a deterministic seeded Pseudo-Random Number Generator (PRNG) with unified mathematical formulas exported from [`src/lib/metrics.ts`](src/lib/metrics.ts).

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

Open `http://localhost:5173/` in any modern web browser.

### Production Build
```bash
# Validate TypeScript and bundle with Vite
npm run build

# Preview production build locally
npm run preview
```

---

## 🌐 Dual Experience Architecture

ReLoop City is architected into two distinct experiences with client-side React Router (`HashRouter`):

1. **Public Product Website (`/`)**:
   - Modern, executive landing page designed for municipal leadership and city engineers (deep navy, emerald green, crisp white cards).
   - Sticky navbar, 7-step circular loop feature grid, 30-day pilot impact statistics, interactive step inspector with inline visuals, live in-browser mini-simulation preview, and technical FAQ accordion.
   - Zero admin clutter, no simulation controls, fast loading.

2. **Municipal Operations App (`/app/*`)**:
   - High-density command center with left navigation rail, top simulation status header, and 7-step loop walkthrough.
   - Deep-linked routes:
     - `/app/dashboard` · Executive Command Center & Comparison Panel
     - `/app/map` · Step 1: Live IoT Bin Telemetry & Sensor Map
     - `/app/predict` · Step 2: Time-Series Volume & Spike Predictor
     - `/app/optimize` · Step 3: CVRP Dynamic Fleet Routing & 2-Opt TSP
     - `/app/classify` · Step 4: AI Optical Waste Sorter & MRF Vision
     - `/app/allocate` · Step 5: Circular Mass Balance & Material Allocation
     - `/app/forecast` · Step 6: Waste-to-Energy (MWh) & Bio-Methane Yield
     - `/app/revenue` · Step 7: Circular Revenue Streams & Fiscal Return
     - `/app/scenarios` · Feature 2: Scenario Builder & 3-Way Policy Benchmark
     - `/app/report` · Feature 3: Executive Print & PDF Briefing Pack
     - `/app/assumptions` · Municipal Assumptions & Scaling Roadmap

---

## 🎛️ How to Use as a Planning Tool

ReLoop City empowers visitors to act directly as the **City Waste Operations Manager** for the Akurdi–Chinchwad–Moshi pilot corridor in Pune (PCMC). Rather than passively observing static metrics, managers make concrete operational choices that propagate throughout the entire simulation client-side:

### 1. Operations Manager Role & Dashboard Cockpit
- **Role Card**: An actionable operations briefing is presented on the Dashboard (`/app/dashboard`), highlighting your core mission: raise landfill diversion above 95% and slash compactor fleet logistics expenditure. Dismissing the card is remembered via browser `localStorage`.
- **Your Decisions Panel**: A dedicated cockpit on the Dashboard tracks your live decisions across all loop steps:
  - Active operational policy scenario (e.g., Default ReLoop vs. Custom Plan)
  - Starred priority bins flagged for direct compactor dispatch
  - Material stream allocation strategy (Balanced Diversion, Max Energy, or Max Recovery)
  - Clean energy off-take policy (MSEDCL Municipal Grid Feed-in vs. PMPML Electric Bus Depot)
  - Municipal Council briefing certification status

### 2. Decision Prompts & Manager Actions Across the 7 Steps
Every page in the 7-step circular loop includes a dedicated **"Your decision here"** prompt and an interactive control that affects system state:
- **Step 1 (Sense · `/app/map`)**: *"Which bins need attention right now?"*  
  Open any smart bin's telemetry drawer and click **"Mark Bin for Priority Pickup"** to star it and surface it immediately on the Dashboard live alerts list.
- **Step 2 (Predict · `/app/predict`)**: *"Where will overflow happen in the next 48 hours?"*  
  Click **"Prioritize for Advance Dispatch"** on any zone forecast card to preempt high-generation morning peaks.
- **Step 3 (Optimize · `/app/optimize`)**: *"How many trucks and which routes should run today?"*  
  Click **"Recalculate dynamic routes"** to run the 2-Opt CVRP heuristic, skipping bins <75% full and saving 32% distance.
- **Step 4 (Classify · `/app/classify`)**: *"Which facility should this material go to?"*  
  Click optical sorting destination chips (MRF Baling, Anaerobic Digestion, Composting, RDF) to override automated sorting destinations.
- **Step 5 (Allocate · `/app/allocate`)**: *"How should today's waste be split across facilities?"*  
  Select between **Balanced Diversion (42% MRF / 38% AD / 15% Compost / 5% RDF)**, **Max Clean Energy**, or **Max Material Recovery**.
- **Step 6 (Forecast · `/app/forecast`)**: *"How much energy and biogas can we plan on?"*  
  Commit power between **MSEDCL Grid Feed-in (₹6.80/kWh tariff)** and **PMPML Transit Bus Depot Charging (₹7.20/kWh equivalent)**.
- **Step 7 (Report · `/app/revenue`)**: *"What should we tell the city council?"*  
  Click **"Sign & Approve for Council"** to officially certify and seal the circular economic ledger with a municipal verification timestamp.

### 3. Scenario Builder & Policy Benchmark (`/app/scenarios`)
Model alternative municipal operations before real-world rollouts:
- **5 Configurable Levers**:
  - Compactor truck fleet size (2–8 trucks)
  - Dispatch fill threshold (50%–95% fill trigger)
  - Truck payload capacity (2.5–8.0 tonnes)
  - Biogas recovery yield (70–160 m³/t organic)
  - Grid electricity feed-in tariff (₹4.0–₹10.0/kWh)
- **Deterministic Simulation**: Click **"Run Scenario"** to simulate outcomes without mutating default assumptions.
- **3-Way Side-by-Side Comparison Table**:
  - Compares **1. Baseline (Status Quo)** vs. **2. Default ReLoop AI** vs. **3. My Scenario** across 6 key metrics: Landfill Diversion Rate (%), Fleet Route Distance (km), Fleet Fuel Cost (₹), Clean Energy Generated (MWh), Gross Circular Revenue (₹), and CO₂ Avoided (t).
  - Highlights superior values with an **`<Award /> Best`** badge and text indicator.
- **Plain-Language Takeaway**: Automatically computes trade-offs (e.g. *"With 6 trucks and a 70% threshold, diversion rises to 96.1% (+1.0 pts) while fuel cost increases by 12%."*).
- **Save & Activate**: Save up to 3 named scenarios locally in browser storage, rename or delete them, and set one as the **Active Scenario** reflected across the Dashboard and header.

### 4. Audit-Ready Export & Executive Reporting
- **Download CSV**: Click **"Export report" → "Download CSV"** from the Dashboard or Revenue page to generate a comprehensive CSV file (UTF-8 encoded with BOM `\uFEFF` for native Microsoft Excel compatibility) containing current KPIs, 3-way scenario benchmarks, and all 12 calibrated config assumptions.
- **Print / Save as PDF (`/app/report`)**: A dedicated print-optimized briefing view formatted for A4 print and PDF generation:
  - Hides navigation bars, headers, toasts, and action buttons via print stylesheet
  - Renders vector Recharts at fixed widths without clipping
  - Includes generation date, Pune PCMC corridor title, executive summary, 4 primary KPIs, scenario comparison table, donut stream breakdown, cumulative collection area chart, and PCCOE Grand Challenge 2026 footer.

---

## 🧭 The 7-Step AI Loop Architecture

| Step | Route | Key Innovation | Municipal Impact |
|---|---|---|---|
| **1. Sense** | `/app/map` | 100 Smart Bins with ultrasonic fill & optical telemetry across 5 pilot zones. | Real-time transparency; replaces blind static garbage schedules. |
| **2. Predict** | `/app/predict` | Multi-zone time-series forecasting model (diurnal human cycles + day-of-week seasonality). | Anticipates overflow surges 24–72 hours in advance. |
| **3. Optimize** | `/app/optimize` | Capacity-Constrained Vehicle Routing Problem (CVRP) solved via **Nearest-Neighbor + 2-Opt local search**. | Bins <75% full are skipped; cuts fuel burn and tailpipe CO₂ by 32%. |
| **4. Classify** | `/app/classify` | Pluggable Computer Vision classifier identifying material stream, purity, and target processing unit. | Recovers high-grade commodity polymers, metals, and pulp worth up to 10x mixed waste. |
| **5. Allocate** | `/app/allocate` | Directing materials to MRF recycling, anaerobic digestion, composting, and RDF. | 95%+ of city waste bypasses landfills into value creation. |
| **6. Forecast** | `/app/forecast` | Real-time bio-methanation conversion model estimating MWh electrical power and Bio-CNG. | Powers municipal facilities and city transit buses. |
| **7. Report** | `/app/revenue` | Executive municipal ledger with 6 monetized resource streams. | Data-driven proof of circular economics and carbon ROI. |

---

## 🎤 3-Minute Live Competition Demo Script

### **[0:00 – 0:35] Problem & Concept (Public Website - `/`)**
1. Open the **Public Website** at `http://localhost:5173/#/`.
2. Point out the headline: *"Turn city waste into energy, materials and revenue."*
3. Show the **Hero Impact Badges**: 95.1% Landfill Diversion (vs. 28.0% baseline), −32% Fleet Distance, 71 MWh Clean Energy, ₹34.2L Circular Value.
4. Scroll to the **7-Step Loop Features Grid** & **Interactive Step Inspector**: explain how ReLoop replaces linear dumping with closed-loop circular intelligence.
5. Click **"Launch live demo"** in the top navbar to enter `/app/dashboard`.

### **[0:36 – 1:30] Waste-to-Value Command Center (Dashboard & Map)**
1. On the **Dashboard (`/app/dashboard`)**:
   - Point to the **Top Headline Answer**: *"ReLoop AI diverts 95.1% of municipal waste and generated ₹34.2 Lakh in circular value this pilot."*
   - Show the **3 Hero KPIs**:
     - Landfill Diversion: **154.8 tonnes (95.1%)**
     - Clean Energy Generated: **71.0 MWh Clean Power**
     - Resource Value Created: **₹34.2 Lakh Gross Revenue**
2. **The "Aha!" Moment**: Click the **"Baseline (Fixed)"** toggle in the top header.
   - Watch the **Side-by-Side Comparison Panel** update its paired horizontal bars:
     - Diversion drops from 95.1% to 28.0% (-67.1 pts)
     - Fleet route climbs from 965 km to 1,420 km (+32% diesel)
     - Overflow incidents jump from 1 to 42 events
     - Circular revenue collapses from ₹34.2 Lakh to ₹18.4 Lakh
   - Click **"ReLoop"** to show immediate recovery.
3. Switch to **"1 · Live Bin Map (`/app/map`)"**:
   - Show the interactive Leaflet map of the Pune PCMC corridor with 100 smart bins.
   - Click on any **red bin (>80% full)**: inspect live telemetry drawer showing fill %, weight (kg), stream composition, and the alert: *"Predicted full in 2.4 hours"*.

### **[1:31 – 2:20] Intelligence in Action (Predict & Optimize)**
1. Navigate to **"2 · Waste Forecast (`/app/predict`)"**:
   - Point out the 48-hour per-zone generation forecast curves.
   - Highlight the peak alert for the Pimpri Mandi Wholesale Market (morning produce surge).
2. Navigate to **"3 · Smart Routes (`/app/optimize`)"**:
   - Click **"Generate Dynamic Routes"** (watch 2-Opt run).
   - Show the 4 color-coded compactor truck routes drawn on the map.
   - Point to the **Before vs After Summary**: *-32% distance driven*, zero trips to empty bins, 100% overflow preemption, saving ₹14,200/day in diesel alone.

### **[2:21 – 3:00] Sorting, Monetization & Scale (Classify, Revenue & Roadmap)**
1. Navigate to **"4 · AI Waste Sorting (`/app/classify`)"**:
   - Click a sample waste item (e.g. *PET Plastic Bottle* or *Banana Peels*).
   - Show the neural network confidence score (98.4%), detected stream, and target facility (*Continuous Anaerobic Digester #2*).
2. Navigate to **"7 · Revenue & Impact (`/app/revenue`)"**:
   - Show the breakdown of the **6 revenue streams** (recycled polymers, clean grid power, city compost, EPR credits, RDF off-take, and avoided tipping fees).
   - Highlight the quarterly revenue of **₹34.2 Lakh** transforming waste from a cost center into a municipal profit center.
3. Conclude on **"Assumptions & Roadmap (`/app/assumptions`)"**:
   - Slide any parameter (e.g., biogas yield or electricity tariff) to demonstrate live reactive recalculation.
   - Close with the 5-phase roadmap: from today's Single MRF Pilot to the regional cross-city circular marketplace!

---

## 🔌 Production Integration Guide (Where to Plug in Real Systems)

The ReLoop City codebase is designed with clean modular interfaces so production IoT feeds, OR-Tools solvers, and deep learning models can be plugged in directly:

### 1. Connecting Real IoT Telemetry (Ultrasonic / Weight Sensors)
* **File to edit**: [`src/sim/engine.ts`](src/sim/engine.ts)
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
* **File to edit**: [`src/sim/routing.ts`](src/sim/routing.ts)
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
* **File to edit**: [`src/lib/classifier.ts`](src/lib/classifier.ts)
* **How to integrate**:
  Replace the mock logic inside `classifyImage(input: File | string)` with a TensorFlow.js or Roboflow model:
  ```typescript
  import * as tf from '@tensorflow/tfjs';

  export async function classifyImage(imageElement: HTMLImageElement): Promise<ImageClassificationResult> {
    const model = await tf.loadLayersModel('/models/mrf-waste-classifier/model.json');
    const tensor = tf.browser.fromPixels(imageElement).resizeNearestNeighbor([224, 224]).toFloat().expandDims();
    const predictions = await model.predict(tensor).data();
    return formatClassificationResult(predictions);
  }
  ```

---

## 📊 Municipal Assumptions & Formulas
All assumptions are isolated in [`src/config/config.ts`](src/config/config.ts) and can be adjusted interactively in the UI:

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
│   ├── App.tsx                  # HashRouter & App shell configuration
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
│   │   ├── metrics.ts           # SINGLE SOURCE OF TRUTH: pure functions & assertions
│   │   ├── formatters.ts        # Currency (INR Lakh), tonnage, safe delta helpers
│   │   └── classifier.ts        # Computer vision sorting architecture & sample catalog
│   ├── store/
│   │   └── useStore.ts          # Zustand global state (simulation, mode, tour)
│   ├── components/
│   │   ├── Header.tsx           # Header with mode toggle, speed, tour, and simulated notice
│   │   ├── Sidebar.tsx          # Desktop left rail & mobile bottom tab bar
│   │   ├── RouteManager.tsx     # Route sync, scroll-to-top & H1 focus manager
│   │   ├── brand/
│   │   │   └── ReloopLogo.tsx   # Custom vector logo matching relooptoday.com
│   │   ├── public/
│   │   │   ├── PublicNavbar.tsx # Landing navbar with anchors & live demo CTA
│   │   │   └── PublicFooter.tsx # Landing footer with PCCOE accreditation
│   │   └── ui/                  # Reusable UI component design system
│   │       ├── Badge.tsx
│   │       ├── Button.tsx
│   │       ├── EmptyState.tsx
│   │       ├── InfoPopover.tsx  # Accessible popover (hover, focus, tap, Esc)
│   │       ├── LoopStepNav.tsx  # Previous/Next step navigation
│   │       ├── Modal.tsx
│   │       ├── PageHeader.tsx
│   │       ├── SectionCard.tsx
│   │       ├── Skeleton.tsx
│   │       ├── StatCard.tsx     # Hero KPI card with sparkline & delta
│   │       ├── Tabs.tsx
│   │       └── Toast.tsx
│   └── pages/
│       ├── PublicWebsite.tsx    # Public landing page (relooptoday.com aesthetic)
│       ├── Dashboard.tsx        # Phase 4 Dashboard: Headline, 3 KPIs, Compare panel
│       ├── LiveCityMap.tsx      # Step 1: Leaflet map, 100 bins, telemetry inspector
│       ├── PredictPage.tsx      # Step 2: Zone forecast charts & fill predictions
│       ├── OptimizePage.tsx     # Step 3: CVRP routes, truck manifest, savings
│       ├── ClassifyPage.tsx     # Step 4: AI sorting vision & sample catalog
│       ├── AllocatePage.tsx     # Step 5: Circular mass balance & material allocation
│       ├── ForecastPage.tsx     # Step 6: Waste-to-Energy & clean MWh generation
│       ├── RevenuePage.tsx      # Step 7: 6 circular revenue streams & fiscal return
│       └── AssumptionsRoadmap.tsx # Assumptions tuning & 5-phase roadmap
```

---

**Developed for the PCCOE International Grand Challenge 2026**  
*Theme: AI for Climate Change • Smart Cities & Circular Economy Track*
