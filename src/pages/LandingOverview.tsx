import React from 'react';
import { useStore } from '../store/useStore';
import { 
  ArrowRight, 
  Sparkles, 
  Leaf, 
  Zap, 
  TrendingUp, 
  ShieldCheck, 
  RefreshCw, 
  AlertTriangle,
  CheckCircle,
  Radio,
  Route,
  ScanSearch,
  GitFork,
  Coins,
  Cpu,
  Boxes,
  Factory
} from 'lucide-react';

export const LandingOverview: React.FC = () => {
  const { setActivePage, startGuidedTour, setMode } = useStore();

  const handleLaunchDemo = () => {
    setMode('reloop');
    setActivePage('dashboard');
  };

  const aiSteps = [
    { num: '01', name: 'Sense', icon: Radio, desc: 'IoT fill-levels & ultrasonic composition telemetry across city bins' },
    { num: '02', name: 'Predict', icon: TrendingUp, desc: 'Time-series volume forecasting & generation hotspot detection' },
    { num: '03', name: 'Optimize', icon: Route, desc: 'Capacity-constrained dynamic routing (CVRP) saving 32%+ fuel' },
    { num: '04', name: 'Classify', icon: ScanSearch, desc: 'Computer vision sorting at MRF recovering high-purity commodities' },
    { num: '05', name: 'Allocate', icon: GitFork, desc: 'Dynamic mass allocation to Anaerobic Digestion, Composting & Recycling' },
    { num: '06', name: 'Forecast', icon: Zap, desc: 'Bio-methane & clean electricity generation forecasting for the grid' },
    { num: '07', name: 'Report', icon: Coins, desc: 'Municipal Waste-to-Value Dashboard for transparent circular governance' },
  ];

  return (
    <div className="space-y-12 pb-16">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-navy-700 text-white p-8 sm:p-12 lg:p-16 shadow-2xl">
        <div className="absolute inset-0 blueprint-grid opacity-15 pointer-events-none"></div>
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-sage-500/20 blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-amberGold-500/20 blur-3xl pointer-events-none"></div>

        <div className="relative max-w-4xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold tracking-wide text-amberGold-300">
            <Sparkles className="w-3.5 h-3.5 text-amberGold-400" />
            <span>PCCOE International Grand Challenge 2026 • Pune, India</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight font-['Outfit']">
            AI-Powered Waste-to-Resource <br />
            <span className="text-sage-400">Circular City Platform</span>
          </h1>

          <p className="text-lg sm:text-xl text-navy-100 font-light max-w-2xl leading-relaxed">
            <span className="font-semibold text-white">Cities are losing value in their own waste.</span> ReLoop redesigns the municipal waste stream as an AI-driven resource-and-energy loop instead of an endless disposal problem.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-4">
            <button
              id="hero-launch-btn"
              onClick={handleLaunchDemo}
              className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-sage-500 hover:bg-sage-600 text-white font-bold text-sm shadow-lg shadow-sage-500/30 transition-all hover:scale-102 active:scale-98"
            >
              <span>Launch Live Prototype</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              id="hero-guided-tour-btn"
              onClick={startGuidedTour}
              className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm border border-white/20 backdrop-blur-md transition-all hover:scale-102"
            >
              <Sparkles className="w-4 h-4 text-amberGold-400" />
              <span>Interactive 7-Step Tour</span>
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-white/15 text-xs text-navy-200">
            <div>
              <span className="block font-bold text-xl sm:text-2xl text-white">95.2%</span>
              <span>Landfill Diversion Rate</span>
            </div>
            <div>
              <span className="block font-bold text-xl sm:text-2xl text-amberGold-400">-32%</span>
              <span>Fleet Route Distance (km)</span>
            </div>
            <div>
              <span className="block font-bold text-xl sm:text-2xl text-sage-400">71 MWh</span>
              <span>Clean Energy Generated</span>
            </div>
            <div>
              <span className="block font-bold text-xl sm:text-2xl text-white">₹34.2 Lakh</span>
              <span>Resource Value Created</span>
            </div>
          </div>
        </div>
      </section>

      {/* The Paradigm Shift: Linear Reality vs Circular Future (Slide 3) */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-navy-600">The Paradigm Shift</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-navy-800 font-['Outfit']">
            Minimizing Landfill Dependency
          </h2>
          <p className="text-xs sm:text-sm text-charcoal-500">
            Transforming municipal waste from an uncontrollable cost center into an economically self-sustaining resource loop.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-navy-100 shadow-blueprint overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-navy-100">
            
            {/* Linear Reality */}
            <div className="p-6 sm:p-8 space-y-6 bg-residual-500/5">
              <div className="flex items-center justify-between pb-3 border-b border-residual-500/20">
                <div>
                  <h3 className="text-lg font-bold text-charcoal-700 flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
                    Linear Reality (Waste to Landfill)
                  </h3>
                  <span className="text-xs text-charcoal-400">Current status quo across global municipalities</span>
                </div>
                <span className="px-2 py-1 rounded bg-red-100 text-red-800 text-xs font-bold">Unsustainable</span>
              </div>

              <div className="space-y-4 text-xs sm:text-sm">
                <div className="flex items-start gap-3 p-3 rounded-xl bg-white border border-red-100">
                  <div className="w-6 h-6 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-bold flex-shrink-0">✕</div>
                  <div>
                    <h4 className="font-bold text-charcoal-800">Resource Inefficient</h4>
                    <p className="text-charcoal-500 text-xs mt-0.5">High-grade recyclable plastic, paper, and glass lost in mixed dumpsites.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-white border border-red-100">
                  <div className="w-6 h-6 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-bold flex-shrink-0">✕</div>
                  <div>
                    <h4 className="font-bold text-charcoal-800">Heavy Landfill Overload</h4>
                    <p className="text-charcoal-500 text-xs mt-0.5">Rapidly shrinking landfill airspace and severe subterranean methane leaks.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-white border border-red-100">
                  <div className="w-6 h-6 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-bold flex-shrink-0">✕</div>
                  <div>
                    <h4 className="font-bold text-charcoal-800">Energy & Material Loss</h4>
                    <p className="text-charcoal-500 text-xs mt-0.5">Wet organic waste rots anaerobically without capturing calorific or biogas potential.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-white border border-red-100">
                  <div className="w-6 h-6 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-bold flex-shrink-0">✕</div>
                  <div>
                    <h4 className="font-bold text-charcoal-800">Perpetual Cost Center</h4>
                    <p className="text-charcoal-500 text-xs mt-0.5">Taxpayer funds burn on fuel for fixed routes visiting half-empty bins.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Circular Future */}
            <div className="p-6 sm:p-8 space-y-6 bg-sage-50/30">
              <div className="flex items-center justify-between pb-3 border-b border-sage-200">
                <div>
                  <h3 className="text-lg font-bold text-navy-800 flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-sage-500"></span>
                    Circular Future (Waste to Value & Energy)
                  </h3>
                  <span className="text-xs text-charcoal-400">ReLoop AI-Driven Closed-Loop Architecture</span>
                </div>
                <span className="px-2 py-1 rounded bg-sage-100 text-sage-800 text-xs font-bold">Closed Loop</span>
              </div>

              <div className="space-y-4 text-xs sm:text-sm">
                <div className="flex items-start gap-3 p-3 rounded-xl bg-white border border-sage-200">
                  <div className="w-6 h-6 rounded-full bg-sage-100 text-sage-700 flex items-center justify-center font-bold flex-shrink-0">✓</div>
                  <div>
                    <h4 className="font-bold text-charcoal-800">Resource-Efficient Recovery</h4>
                    <p className="text-charcoal-500 text-xs mt-0.5">Automated MRF computer vision sorts clean streams for remanufacturing.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-white border border-sage-200">
                  <div className="w-6 h-6 rounded-full bg-sage-100 text-sage-700 flex items-center justify-center font-bold flex-shrink-0">✓</div>
                  <div>
                    <h4 className="font-bold text-charcoal-800">95%+ Landfill Diversion</h4>
                    <p className="text-charcoal-500 text-xs mt-0.5">Only non-combustible unavoidable inert residuals reach sanitary landfills.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-white border border-sage-200">
                  <div className="w-6 h-6 rounded-full bg-sage-100 text-sage-700 flex items-center justify-center font-bold flex-shrink-0">✓</div>
                  <div>
                    <h4 className="font-bold text-charcoal-800">Clean Energy Generation</h4>
                    <p className="text-charcoal-500 text-xs mt-0.5">Anaerobic digestion and RDF generate continuous MWh electricity and Bio-CNG.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-white border border-sage-200">
                  <div className="w-6 h-6 rounded-full bg-sage-100 text-sage-700 flex items-center justify-center font-bold flex-shrink-0">✓</div>
                  <div>
                    <h4 className="font-bold text-charcoal-800">Economically Self-Sustaining</h4>
                    <p className="text-charcoal-500 text-xs mt-0.5">6 diversified revenue streams (recycled pellets, power, compost, EPR credits).</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* System Mechanics & Material Flow (Slide 5 & 6) */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-navy-600">Architecture</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-navy-800 font-['Outfit']">
            System Mechanics & Material Flow
          </h2>
          <p className="text-xs sm:text-sm text-charcoal-500">
            How inputs flow through the AI intelligence engine into commercial municipal outputs.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-navy-100 shadow-blueprint p-6 sm:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative">
            
            {/* Input Column */}
            <div className="space-y-3">
              <div className="p-2.5 rounded-xl bg-navy-50 text-navy-800 font-bold text-xs uppercase tracking-wide flex items-center gap-2 border border-navy-100">
                <Boxes className="w-4 h-4 text-navy-600" />
                <span>1. City Waste Inputs</span>
              </div>

              <div className="space-y-2">
                {[
                  { name: 'Organic Waste', desc: 'Food scraps, wet market mandi produce', color: 'border-sage-300 bg-sage-50/50' },
                  { name: 'Recyclables', desc: 'Plastics (PET, HDPE), paper, metals, glass', color: 'border-navy-200 bg-navy-50/50' },
                  { name: 'C&D Debris', desc: 'Demolition concrete, bricks, mortar rubble', color: 'border-charcoal-200 bg-charcoal-50/50' },
                  { name: 'E-Waste', desc: 'Circuit boards, cables, discarded IT hardware', color: 'border-blue-200 bg-blue-50/50' },
                  { name: 'Residual Waste', desc: 'Non-recyclable multi-layer plastics, composites', color: 'border-residual-400 bg-residual-500/10' },
                ].map((item) => (
                  <div key={item.name} className={`p-3 rounded-xl border ${item.color} text-xs space-y-0.5`}>
                    <span className="font-bold text-charcoal-800">{item.name}</span>
                    <p className="text-[11px] text-charcoal-500">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Process / Intelligence Column */}
            <div className="space-y-3">
              <div className="p-2.5 rounded-xl bg-sage-50 text-sage-900 font-bold text-xs uppercase tracking-wide flex items-center gap-2 border border-sage-200">
                <Cpu className="w-4 h-4 text-sage-600" />
                <span>2. AI Intelligence & Processing</span>
              </div>

              <div className="space-y-2">
                {[
                  { title: 'Smart Bin Sensing & CVRP Routing', tech: 'Ultrasonic IoT + Nearest-Neighbor 2-Opt Heuristic' },
                  { title: 'Automated MRF Computer Vision', tech: 'Deep convolutional sorting lines' },
                  { title: 'Continuous Anaerobic Digestion', tech: 'Thermophilic wet digesters producing bio-methane' },
                  { title: 'Recycling & Remanufacturing Lines', tech: 'Flaking, washing, de-inking & metal eddy currents' },
                  { title: 'RDF Pelletizing for Kilns', tech: 'High-calorific refuse fuel co-processing' },
                ].map((proc) => (
                  <div key={proc.title} className="p-3 rounded-xl border border-navy-100 bg-white shadow-xs text-xs space-y-0.5 hover:border-navy-300 transition-colors">
                    <span className="font-bold text-navy-800 flex items-center gap-1.5">
                      <Sparkles className="w-3 h-3 text-amberGold-500" />
                      {proc.title}
                    </span>
                    <p className="text-[11px] text-charcoal-500">{proc.tech}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Output Column */}
            <div className="space-y-3">
              <div className="p-2.5 rounded-xl bg-amberGold-50 text-amberGold-900 font-bold text-xs uppercase tracking-wide flex items-center gap-2 border border-amberGold-200">
                <Factory className="w-4 h-4 text-amberGold-600" />
                <span>3. High-Value Circular Outputs</span>
              </div>

              <div className="space-y-2">
                {[
                  { title: 'Commodity Polymers & Metals', impact: 'Food-grade rPET, aluminum ingots, kraft pulp' },
                  { title: 'Organic Compost & Bio-Fertilizer', impact: 'Enriched soil conditioner for peri-urban farms' },
                  { title: 'Clean Electricity & Bio-CNG', impact: 'Municipal vehicle fuel & grid feed-in power' },
                  { title: 'Recycled C&D Aggregates', impact: 'M-Sand & road base for smart infrastructure' },
                  { title: 'Drastically Reduced Landfill', impact: '<5% volume remaining as stabilized inert' },
                ].map((out) => (
                  <div key={out.title} className="p-3 rounded-xl border border-amberGold-200/60 bg-amberGold-50/30 text-xs space-y-0.5">
                    <span className="font-bold text-charcoal-800">{out.title}</span>
                    <p className="text-[11px] text-charcoal-500">{out.impact}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* The 7 AI Steps Horizontal Stepper (Slide 7) */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-navy-600">The 7 AI Steps</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-navy-800 font-['Outfit']">
              Where AI Adds Intelligence
            </h2>
          </div>
          <button
            onClick={startGuidedTour}
            className="self-start sm:self-auto flex items-center gap-1.5 px-4 py-2 rounded-xl bg-navy-700 text-white text-xs font-bold shadow-md hover:bg-navy-800 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5 text-amberGold-400" />
            <span>Launch Step-by-Step Walkthrough</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-3">
          {aiSteps.map((step, idx) => {
            const Icon = step.icon;
            const pageTargets = ['map', 'predict', 'optimize', 'classify', 'allocate', 'allocate', 'dashboard'] as const;
            return (
              <div
                key={step.num}
                onClick={() => setActivePage(pageTargets[idx])}
                className="group p-4 rounded-2xl bg-white border border-navy-100 shadow-blueprint hover:border-navy-400 hover:shadow-blueprint-lg transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-mono text-xs font-bold text-charcoal-400 group-hover:text-navy-700">
                      {step.num}
                    </span>
                    <div className="w-8 h-8 rounded-lg bg-navy-50 group-hover:bg-navy-700 group-hover:text-white text-navy-700 flex items-center justify-center transition-colors">
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>
                  <h3 className="font-bold text-sm text-navy-800 group-hover:text-navy-900 mb-1">
                    {step.name}
                  </h3>
                  <p className="text-[11px] text-charcoal-500 leading-snug">
                    {step.desc}
                  </p>
                </div>
                <div className="pt-3 mt-3 border-t border-navy-50 flex items-center text-[10px] font-bold text-navy-600 group-hover:text-navy-800">
                  <span>Explore step</span>
                  <ArrowRight className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA Box */}
      <section className="rounded-2xl bg-gradient-to-r from-navy-700 to-navy-800 text-white p-8 text-center space-y-4 shadow-xl">
        <h3 className="text-xl sm:text-2xl font-bold font-['Outfit']">
          Ready to experience ReLoop City in action?
        </h3>
        <p className="text-xs sm:text-sm text-navy-200 max-w-xl mx-auto">
          Observe live IoT bin fill telemetry in Pune, test CVRP dynamic collection routes, classify waste items via computer vision, and explore circular revenue streams.
        </p>
        <div className="flex justify-center gap-3 pt-2">
          <button
            onClick={handleLaunchDemo}
            className="px-6 py-3 rounded-xl bg-sage-500 hover:bg-sage-600 text-white font-bold text-xs sm:text-sm shadow-md transition-all hover:scale-102"
          >
            Open Waste-to-Value Dashboard
          </button>
        </div>
      </section>

    </div>
  );
};
