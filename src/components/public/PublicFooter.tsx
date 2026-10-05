import React from 'react';
import { Link } from 'react-router-dom';
import { ReloopLogo } from '../brand/ReloopLogo';
import { MapPin, Mail, ShieldCheck, ArrowRight, ExternalLink } from 'lucide-react';

export const PublicFooter: React.FC = () => {
  return (
    <footer className="bg-navy-950 text-white border-t border-navy-800" aria-label="Site footer">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          
          {/* Column 1: Brand & Pilot Mission */}
          <div className="space-y-4">
            <ReloopLogo className="h-8 w-auto" isDark={true} />
            <p className="text-charcoal-300 text-sm leading-relaxed">
              Autonomous 7-step circular loop platform for municipal solid-waste intelligence. Calibrated to the Akurdi–Chinchwad–Moshi pilot corridor in Pune PCMC.
            </p>
            <div className="pt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 text-xs font-semibold">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" aria-hidden="true" />
                PCCOE Grand Challenge 2026
              </span>
            </div>
          </div>

          {/* Column 2: Platform Links */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-charcoal-400">Platform</h3>
            <nav className="flex flex-col space-y-2 text-sm" aria-label="Platform navigation">
              <a href="#how-it-works" className="text-charcoal-300 hover:text-white transition-colors">
                How it works
              </a>
              <a href="#statistics" className="text-charcoal-300 hover:text-white transition-colors">
                Impact statistics
              </a>
              <a href="#roadmap" className="text-charcoal-300 hover:text-white transition-colors">
                Deployment roadmap
              </a>
              <a href="#faq" className="text-charcoal-300 hover:text-white transition-colors">
                Frequently asked questions
              </a>
              <Link to="/app/dashboard" className="text-emerald-400 hover:text-emerald-300 font-semibold transition-colors flex items-center gap-1">
                <span>Launch live demo</span>
                <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
              </Link>
              <Link to="/app/assumptions" className="text-charcoal-300 hover:text-white transition-colors">
                Engineering assumptions
              </Link>
            </nav>
          </div>

          {/* Column 3: 7-Step Circular Loop */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-charcoal-400">7-Step Loop</h3>
            <nav className="flex flex-col space-y-2 text-sm" aria-label="7-Step Loop routes">
              <Link to="/app/map" className="text-charcoal-300 hover:text-emerald-300 transition-colors">
                1 · Sense (IoT Bin Map)
              </Link>
              <Link to="/app/predict" className="text-charcoal-300 hover:text-emerald-300 transition-colors">
                2 · Predict (Waste Forecast)
              </Link>
              <Link to="/app/optimize" className="text-charcoal-300 hover:text-emerald-300 transition-colors">
                3 · Optimize (Dynamic Routes)
              </Link>
              <Link to="/app/classify" className="text-charcoal-300 hover:text-emerald-300 transition-colors">
                4 · Classify (Optical Sorting)
              </Link>
              <Link to="/app/allocate" className="text-charcoal-300 hover:text-emerald-300 transition-colors">
                5 · Allocate (Mass Streams)
              </Link>
              <Link to="/app/forecast" className="text-charcoal-300 hover:text-emerald-300 transition-colors">
                6 · Forecast (Biogas &amp; MWh)
              </Link>
              <Link to="/app/revenue" className="text-charcoal-300 hover:text-emerald-300 transition-colors">
                7 · Report (Circular Ledger)
              </Link>
            </nav>
          </div>

          {/* Column 4: Pilot & Grand Challenge details */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-charcoal-400">Pilot &amp; Contact</h3>
            <div className="space-y-2.5 text-sm text-charcoal-300">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
                <div className="text-xs leading-relaxed">
                  <p className="font-semibold text-white">Pune PCMC Smart Corridor</p>
                  <p className="text-charcoal-400">Akurdi · Chinchwad · Pimpri Mandi · Moshi · PCCOE Campus</p>
                  <p className="text-charcoal-400">Pune, Maharashtra, India</p>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-emerald-400 flex-shrink-0" aria-hidden="true" />
                <a href="mailto:contact@reloopcity.org" className="text-xs text-charcoal-300 hover:text-white transition-colors font-mono">
                  contact@reloopcity.org
                </a>
              </div>
              <div className="pt-2">
                <p className="text-xs text-charcoal-400">
                  Developed for <span className="text-white font-medium">PCCOE International Grand Challenge 2026</span> (Smart Cities &amp; Circular Economy Track).
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Simulated data note & bottom copyright bar */}
        <div className="mt-12 pt-8 border-t border-navy-800 space-y-4">
          <div className="p-3.5 rounded-xl bg-navy-900 border border-navy-800 text-xs text-charcoal-300 leading-relaxed flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-start gap-2">
              <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold uppercase text-[10px] tracking-wider flex-shrink-0 mt-0.5 sm:mt-0">
                Simulated Data
              </span>
              <span>
                Deterministic client-side simulation calibrated to Pune PCMC ward audit data (28.0% baseline diversion, 75% CVRP dispatch threshold, 100 bins). No live municipal sensors connected.
              </span>
            </div>
            <Link to="/app/assumptions" className="text-emerald-400 hover:underline font-semibold whitespace-nowrap text-xs flex-shrink-0">
              Assumptions &amp; Math →
            </Link>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-charcoal-400">
            <p>
              © 2026 ReLoop City. Built for PCCOE International Grand Challenge 2026.
            </p>
            <div className="flex items-center gap-4">
              <Link to="/app/overview" className="hover:text-white transition-colors">Overview</Link>
              <Link to="/app/assumptions" className="hover:text-white transition-colors">Methodology</Link>
              <Link to="/app/dashboard" className="hover:text-white transition-colors">Dashboard</Link>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
};
