import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowUpRight, Award, Compass, ExternalLink } from 'lucide-react';

export const PublicFooter: React.FC = () => {
  return (
    <footer className="w-full bg-navy-950 text-white border-t border-navy-800 pt-16 pb-12 select-none">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Grid: Brand + 4 Link Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-14 border-b border-navy-800/80">
          
          {/* Brand Info & Mission (Cols 1 & 2 on desktop) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-navy-950 font-bold shadow-md shadow-emerald-500/20">
                <svg
                  className="w-5 h-5 text-navy-950"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                  <path d="M3 3v5h5" />
                  <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
                  <path d="M16 21h5v-5" />
                </svg>
              </div>
              <span className="font-extrabold text-2xl tracking-tight text-white font-heading">
                ReLoop <span className="text-emerald-400">City</span>
              </span>
            </div>

            <p className="text-charcoal-300 text-sm leading-relaxed max-w-sm">
              Transforming urban waste streams into valuable circular energy, high-grade recyclates, and verified carbon credits through closed-loop municipal intelligence.
            </p>

            <div className="flex items-center gap-2 pt-2">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-950/80 text-emerald-400 border border-emerald-800 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                Deterministic Client-Side Engine
              </span>
            </div>
          </div>

          {/* Column 1: Platform & App */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-charcoal-400">
              Live App
            </h4>
            <ul className="space-y-2 text-sm text-charcoal-300">
              <li>
                <Link to="/app/dashboard" className="hover:text-emerald-400 transition-colors flex items-center gap-1">
                  <span>Executive Dashboard</span>
                </Link>
              </li>
              <li>
                <Link to="/app/map" className="hover:text-emerald-400 transition-colors">
                  Live Bin Map (IoT)
                </Link>
              </li>
              <li>
                <Link to="/app/optimize" className="hover:text-emerald-400 transition-colors">
                  AI Route Dispatch
                </Link>
              </li>
              <li>
                <Link to="/app/classify" className="hover:text-emerald-400 transition-colors">
                  Optical Vision Sorting
                </Link>
              </li>
              <li>
                <Link to="/app/revenue" className="hover:text-emerald-400 transition-colors">
                  Circular Revenue Ledger
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: 7-Step AI Loop */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-charcoal-400">
              The 7 AI Steps
            </h4>
            <ul className="space-y-2 text-sm text-charcoal-300">
              <li><span className="text-charcoal-400">1 ·</span> Sense Telemetry</li>
              <li><span className="text-charcoal-400">2 ·</span> Generation Predict</li>
              <li><span className="text-charcoal-400">3 ·</span> Dispatch Optimize</li>
              <li><span className="text-charcoal-400">4 ·</span> Vision Classify</li>
              <li><span className="text-charcoal-400">5 ·</span> Stream Allocate</li>
              <li><span className="text-charcoal-400">6 ·</span> Power Forecast</li>
              <li><span className="text-charcoal-400">7 ·</span> Revenue Report</li>
            </ul>
          </div>

          {/* Column 3: Grand Challenge & Pilot */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-charcoal-400">
              Challenge & Pilot
            </h4>
            <ul className="space-y-2 text-sm text-charcoal-300">
              <li>
                <a href="#impact" className="hover:text-emerald-400 transition-colors">
                  5-Pillar Municipal Impact
                </a>
              </li>
              <li>
                <a href="#roadmap" className="hover:text-emerald-400 transition-colors">
                  Deployment Roadmap
                </a>
              </li>
              <li>
                <Link to="/app/assumptions" className="hover:text-emerald-400 transition-colors">
                  Technical Assumptions
                </Link>
              </li>
              <li>
                <span className="inline-block text-xs font-mono text-emerald-400/90 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800/60 mt-1">
                  Calibrated to Pune PCMC
                </span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar: Copyright & Grand Challenge Stamp */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-charcoal-400">
          <p>
            © {new Date().getFullYear()} ReLoop City · All simulation rights reserved.
          </p>
          <div className="flex items-center gap-2 text-charcoal-300 font-medium">
            <Award className="w-4 h-4 text-amberGold-400" aria-hidden="true" />
            <span>Built for PCCOE International Grand Challenge 2026 · Pune</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
