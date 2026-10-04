import React from 'react';
import { useStore } from '../store/useStore';
import { PageHeader } from '../components/ui/PageHeader';
import { SectionCard } from '../components/ui/SectionCard';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { 
  Settings2, 
  RotateCcw, 
  Zap, 
  Coins, 
  ShieldCheck, 
  Milestone,
  CheckCircle2
} from 'lucide-react';

export const AssumptionsRoadmap: React.FC = () => {
  const { config, updateConfig, resetConfig, openResetConfirm } = useStore();

  const handleSliderChange = (key: keyof typeof config, value: number) => {
    updateConfig({ [key]: value });
  };

  const roadmapMilestones = [
    {
      phase: 'Phase 1',
      title: 'Single MRF Pilot',
      badge: 'Current Stage (Live Demo)',
      status: 'active',
      desc: '100 smart IoT bins deployed across 5 zones in Nigdi-Chinchwad corridor feeding PCMC Central MRF and pilot anaerobic digester.',
      keyInnovations: ['Ultrasonic fill telemetry', '2-Opt CVRP routing heuristic', 'Edge-CV material classifier'],
    },
    {
      phase: 'Phase 2',
      title: 'Multi-Facility City Network',
      badge: 'Q3 2026',
      status: 'upcoming',
      desc: 'Expansion to 2,500 smart bins across all PCMC & PMC municipal wards, coordinating 6 decentralized secondary sorting hubs.',
      keyInnovations: ['Predictive demand modeling', 'Automated robotic optical sorting arms', 'Dynamic fleet dispatch dispatching 30+ EV compactor trucks'],
    },
    {
      phase: 'Phase 3',
      title: 'Regional Waste-to-Energy Grid',
      badge: '2027',
      status: 'upcoming',
      desc: 'Interconnecting municipal bio-methanation digesters with the Maharashtra state electricity distribution grid (MSEDCL) & city gas utility (MNGL).',
      keyInnovations: ['Real-time energy grid integration', 'Bio-CNG dispensing stations for city buses', 'Co-processing RDF with local cement kilns'],
    },
    {
      phase: 'Phase 4',
      title: 'Cross-City Circular Marketplace',
      badge: '2028',
      status: 'upcoming',
      desc: 'Digital trading platform for high-grade secondary raw materials (rPET, aluminum, M-Sand) and CPCB-accredited Extended Producer Responsibility (EPR) credits.',
      keyInnovations: ['Transparent EPR trading ledger', 'Secondary raw material quality certification', 'FMCG brand packaging traceability'],
    },
    {
      phase: 'Phase 5',
      title: 'Full Smart-City Resource Platform',
      badge: '2029 Vision',
      status: 'upcoming',
      desc: 'Autonomous circular loop integrating municipal solid waste, construction debris, wastewater bio-solids, and district heating/cooling systems.',
      keyInnovations: ['Citizen circular rewards mobile app', 'Public transparency dashboard & ESG reporting', 'Zero-landfill municipal certification'],
    },
  ];

  return (
    <div className="space-y-8 pb-16">
      
      {/* Page Header */}
      <PageHeader
        title="Assumptions & Scaling Roadmap"
        subtitle="Transparent configurable assumptions driving the circular mass balance and 5-phase municipal scaling roadmap for Pune."
        showBackToDashboard={true}
        actions={
          <Button
            variant="secondary"
            size="sm"
            icon={<RotateCcw className="w-3.5 h-3.5" />}
            onClick={resetConfig}
          >
            Reset Assumptions
          </Button>
        }
      />

      {/* Editable Assumptions Config Panel */}
      <SectionCard
        title="Municipal Technical & Economic Parameters"
        subtitle="Each parameter below is explicitly annotated as an assumption for the PCCOE Pune pilot"
        headerAction={
          <Badge variant="sage" size="md">
            <span>Live Reactive Sync Active</span>
          </Badge>
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Energy Yields */}
          <div className="space-y-4 p-4 rounded-xl bg-[#F7F6F2]/50 border border-navy-100">
            <div className="flex items-center gap-2 text-xs font-bold text-navy-900 uppercase tracking-wide">
              <Zap className="w-4 h-4 text-amberGold-600" aria-hidden="true" />
              <span>Energy & Biogas Yields</span>
            </div>

            {/* Slider 1: Biogas Yield */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <label htmlFor="input-biogas" className="text-charcoal-700 font-medium">Biogas Yield per Tonne Organic:</label>
                <span className="font-mono font-bold text-navy-900">{config.biogasYieldPerTonneOrganic} m³/t</span>
              </div>
              <input
                id="input-biogas"
                type="range"
                min="60"
                max="180"
                step="5"
                value={config.biogasYieldPerTonneOrganic}
                onChange={(e) => handleSliderChange('biogasYieldPerTonneOrganic', Number(e.target.value))}
                className="w-full h-2 bg-navy-200 rounded-lg appearance-none cursor-pointer accent-navy-700 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-navy-600"
              />
              <span className="text-xs text-charcoal-500 block">Assumption: Standard food waste mesophilic digestion yield</span>
            </div>

            {/* Slider 2: kWh per m3 Biogas */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <label htmlFor="input-kwh" className="text-charcoal-700 font-medium">Electricity per m³ Biogas:</label>
                <span className="font-mono font-bold text-navy-900">{config.kwhPerCubicMeterBiogas} kWh/m³</span>
              </div>
              <input
                id="input-kwh"
                type="range"
                min="1.2"
                max="3.2"
                step="0.1"
                value={config.kwhPerCubicMeterBiogas}
                onChange={(e) => handleSliderChange('kwhPerCubicMeterBiogas', Number(e.target.value))}
                className="w-full h-2 bg-navy-200 rounded-lg appearance-none cursor-pointer accent-navy-700 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-navy-600"
              />
              <span className="text-xs text-charcoal-500 block">Assumption: Combined heat & power (CHP) generator efficiency ~38%</span>
            </div>

            {/* Slider 3: Grid Feed-in Tariff */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <label htmlFor="input-tariff" className="text-charcoal-700 font-medium">Electricity Feed-in Tariff:</label>
                <span className="font-mono font-bold text-navy-900">₹{config.electricityTariffInrPerKwh}/kWh</span>
              </div>
              <input
                id="input-tariff"
                type="range"
                min="4.0"
                max="11.0"
                step="0.2"
                value={config.electricityTariffInrPerKwh}
                onChange={(e) => handleSliderChange('electricityTariffInrPerKwh', Number(e.target.value))}
                className="w-full h-2 bg-navy-200 rounded-lg appearance-none cursor-pointer accent-navy-700 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-navy-600"
              />
              <span className="text-xs text-charcoal-500 block">Assumption: Municipal renewable feed-in rate (MERC Maharashtra)</span>
            </div>
          </div>

          {/* Commodity Recyclate Prices */}
          <div className="space-y-4 p-4 rounded-xl bg-[#F7F6F2]/50 border border-navy-100">
            <div className="flex items-center gap-2 text-xs font-bold text-navy-900 uppercase tracking-wide">
              <Coins className="w-4 h-4 text-sage-700" aria-hidden="true" />
              <span>Material Selling Prices (₹ / Tonne)</span>
            </div>

            {/* Slider: Plastic Pellet Price */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <label htmlFor="input-plastic" className="text-charcoal-700 font-medium">Sorted Polymer Flakes (rPET/HDPE):</label>
                <span className="font-mono font-bold text-navy-900">₹{config.plasticPelletPriceInrPerTonne.toLocaleString()}/t</span>
              </div>
              <input
                id="input-plastic"
                type="range"
                min="20000"
                max="65000"
                step="1000"
                value={config.plasticPelletPriceInrPerTonne}
                onChange={(e) => handleSliderChange('plasticPelletPriceInrPerTonne', Number(e.target.value))}
                className="w-full h-2 bg-navy-200 rounded-lg appearance-none cursor-pointer accent-sage-600 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-navy-600"
              />
              <span className="text-xs text-charcoal-500 block">Assumption: Clean baled optical sorted flakes</span>
            </div>

            {/* Slider: City Compost Price */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <label htmlFor="input-compost" className="text-charcoal-700 font-medium">Packaged City Compost:</label>
                <span className="font-mono font-bold text-navy-900">₹{config.compostPriceInrPerTonne.toLocaleString()}/t</span>
              </div>
              <input
                id="input-compost"
                type="range"
                min="1500"
                max="6000"
                step="100"
                value={config.compostPriceInrPerTonne}
                onChange={(e) => handleSliderChange('compostPriceInrPerTonne', Number(e.target.value))}
                className="w-full h-2 bg-navy-200 rounded-lg appearance-none cursor-pointer accent-sage-600 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-navy-600"
              />
              <span className="text-xs text-charcoal-500 block">Assumption: FCO standard bulk municipal compost bag price</span>
            </div>

            {/* Slider: EPR Credit Price */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <label htmlFor="input-epr" className="text-charcoal-700 font-medium">EPR Plastic Credit Value:</label>
                <span className="font-mono font-bold text-navy-900">₹{config.eprCreditPriceInrPerTonne.toLocaleString()}/t</span>
              </div>
              <input
                id="input-epr"
                type="range"
                min="1500"
                max="8000"
                step="250"
                value={config.eprCreditPriceInrPerTonne}
                onChange={(e) => handleSliderChange('eprCreditPriceInrPerTonne', Number(e.target.value))}
                className="w-full h-2 bg-navy-200 rounded-lg appearance-none cursor-pointer accent-sage-600 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-navy-600"
              />
              <span className="text-xs text-charcoal-500 block">Assumption: CPCB tradeable Extended Producer certificate market</span>
            </div>
          </div>

          {/* Operational & Climate Parameters */}
          <div className="space-y-4 p-4 rounded-xl bg-[#F7F6F2]/50 border border-navy-100">
            <div className="flex items-center gap-2 text-xs font-bold text-navy-900 uppercase tracking-wide">
              <ShieldCheck className="w-4 h-4 text-navy-700" aria-hidden="true" />
              <span>Logistics & Climate Factors</span>
            </div>

            {/* Slider: Diesel Price */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <label htmlFor="input-diesel" className="text-charcoal-700 font-medium">Municipal Diesel Cost:</label>
                <span className="font-mono font-bold text-navy-900">₹{config.dieselPriceInrPerLiter}/L</span>
              </div>
              <input
                id="input-diesel"
                type="range"
                min="75"
                max="120"
                step="0.5"
                value={config.dieselPriceInrPerLiter}
                onChange={(e) => handleSliderChange('dieselPriceInrPerLiter', Number(e.target.value))}
                className="w-full h-2 bg-navy-200 rounded-lg appearance-none cursor-pointer accent-navy-700 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-navy-600"
              />
              <span className="text-xs text-charcoal-500 block">Assumption: Pune commercial pump diesel rate</span>
            </div>

            {/* Slider: Dispatch Fill Threshold */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <label htmlFor="input-dispatch" className="text-charcoal-700 font-medium">ReLoop Dispatch Threshold:</label>
                <span className="font-mono font-bold text-navy-900">{config.dispatchFillThreshold}% Fill</span>
              </div>
              <input
                id="input-dispatch"
                type="range"
                min="60"
                max="90"
                step="1"
                value={config.dispatchFillThreshold}
                onChange={(e) => handleSliderChange('dispatchFillThreshold', Number(e.target.value))}
                className="w-full h-2 bg-navy-200 rounded-lg appearance-none cursor-pointer accent-navy-700 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-navy-600"
              />
              <span className="text-xs text-charcoal-500 block">Assumption: Bins below this trigger are skipped to prevent wasted trips</span>
            </div>

            {/* Slider: Avoided Landfill Tipping Fee */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <label htmlFor="input-tipping" className="text-charcoal-700 font-medium">Landfill Tipping Fee (Avoided Cost):</label>
                <span className="font-mono font-bold text-navy-900">₹{config.landfillTippingCostInrPerTonne.toLocaleString()}/t</span>
              </div>
              <input
                id="input-tipping"
                type="range"
                min="600"
                max="2500"
                step="50"
                value={config.landfillTippingCostInrPerTonne}
                onChange={(e) => handleSliderChange('landfillTippingCostInrPerTonne', Number(e.target.value))}
                className="w-full h-2 bg-navy-200 rounded-lg appearance-none cursor-pointer accent-navy-700 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-navy-600"
              />
              <span className="text-xs text-charcoal-500 block">Assumption: Municipal cost per tonne dumped at Moshi landfill</span>
            </div>
          </div>

        </div>
      </SectionCard>

      {/* Scope for Scaling: From Pilot to Circular City Network (Slide 10) */}
      <div className="space-y-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-navy-700">Strategic Scaling Roadmap</span>
          <h2 className="text-2xl font-bold text-navy-900 font-['Outfit']">
            Scope for Scaling: From Pilot to Circular City Network (Slide 10)
          </h2>
          <p className="text-sm text-charcoal-600">
            Phase-by-phase rollout pathway from the PCCOE single MRF pilot to regional cross-city resource marketplace.
          </p>
        </div>

        <div className="relative border-l-2 border-navy-200 ml-4 pl-6 space-y-8">
          {roadmapMilestones.map((item, idx) => {
            const isActive = item.status === 'active';
            return (
              <div key={item.phase} className="relative group">
                <div
                  className={`absolute -left-[35px] top-1 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                    isActive 
                      ? 'bg-navy-700 border-white ring-4 ring-navy-200 text-white' 
                      : 'bg-white border-navy-300 text-charcoal-500 group-hover:border-navy-700'
                  }`}
                  aria-hidden="true"
                >
                  <span className="text-xs font-bold font-mono">{idx + 1}</span>
                </div>

                <div className={`p-6 rounded-2xl border transition-all ${
                  isActive 
                    ? 'bg-white border-navy-300 shadow-blueprint-lg ring-1 ring-navy-700/10' 
                    : 'bg-white/80 border-navy-100 shadow-xs hover:border-navy-200'
                }`}>
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold uppercase font-mono text-navy-700">
                        {item.phase}
                      </span>
                      <h3 className="font-bold text-base text-navy-900 font-['Outfit']">
                        {item.title}
                      </h3>
                    </div>
                    <Badge variant={isActive ? 'sage' : 'navy'} size="sm">
                      {item.badge}
                    </Badge>
                  </div>

                  <p className="text-xs sm:text-sm text-charcoal-600 leading-relaxed mb-3">
                    {item.desc}
                  </p>

                  <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-navy-50">
                    <span className="text-xs font-bold text-charcoal-500">Key Technology Deliverables:</span>
                    {item.keyInnovations.map((inv) => (
                      <span key={inv} className="px-2.5 py-1 rounded-lg text-xs font-medium bg-navy-50 text-navy-900 border border-navy-100">
                        {inv}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
