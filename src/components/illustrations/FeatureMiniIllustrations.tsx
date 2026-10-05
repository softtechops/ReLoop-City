import React from 'react';

export const SmartBinIllustration: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg
    viewBox="0 0 200 200"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`w-full h-full ${className}`}
    role="img"
    aria-label="Smart IoT bin telemetry illustration"
  >
    <rect x="50" y="60" width="100" height="120" rx="12" fill="currentColor" className="text-slate-100 dark:text-slate-800" stroke="currentColor" strokeWidth="3" />
    <path d="M 40 50 L 160 50" stroke="currentColor" className="text-navy-800 dark:text-slate-300" strokeWidth="4" strokeLinecap="round" />
    <rect x="75" y="38" width="50" height="12" rx="4" fill="currentColor" className="text-navy-800 dark:text-slate-700" />
    
    {/* Internal Ultrasonic Fill Level Display (84%) */}
    <rect x="62" y="85" width="76" height="85" rx="6" fill="#D1FAE5" className="dark:opacity-20" />
    <rect x="62" y="115" width="76" height="55" rx="6" fill="#10B981" />
    
    {/* Telemetry Sensor Indicator */}
    <circle cx="100" cy="50" r="5" fill="#10B981" className="animate-pulse" />
    <path d="M 85 30 Q 100 20 115 30" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" fill="none" />
    <path d="M 75 22 Q 100 8 125 22" stroke="#059669" strokeWidth="2" strokeDasharray="3 3" fill="none" />
    
    {/* Sensor Metric Label */}
    <rect x="70" y="90" width="60" height="18" rx="4" fill="#0A1E35" />
    <text x="100" y="103" textAnchor="middle" fill="#FFFFFF" fontSize="10" fontWeight="bold" fontFamily="monospace">84% FULL</text>
  </svg>
);

export const TruckRouteIllustration: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg
    viewBox="0 0 240 180"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`w-full h-full ${className}`}
    role="img"
    aria-label="Smart AI Route Optimization"
  >
    {/* City Ward Map Grid lines */}
    <rect width="240" height="180" rx="12" fill="currentColor" className="text-slate-100 dark:text-slate-800/80" />
    <path d="M 20 50 H 220 M 20 100 H 220 M 20 140 H 220" stroke="currentColor" className="text-slate-300 dark:text-slate-700" strokeWidth="1.5" strokeDasharray="4 4" />
    <path d="M 60 20 V 160 M 120 20 V 160 M 180 20 V 160" stroke="currentColor" className="text-slate-300 dark:text-slate-700" strokeWidth="1.5" strokeDasharray="4 4" />
    
    {/* Old Inefficient Baseline Route (Faint Red) */}
    <path
      d="M 40 130 L 70 40 L 190 120 L 160 30"
      stroke="#EF4444"
      strokeWidth="2"
      strokeDasharray="4 4"
      strokeOpacity="0.4"
      fill="none"
    />

    {/* AI Optimized Dynamic Route (Bright Emerald) */}
    <path
      d="M 40 130 C 50 80 90 90 120 60 C 150 30 180 60 200 40"
      stroke="#059669"
      strokeWidth="4"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
      className="animate-draw"
    />

    {/* Stops & Waypoints */}
    <circle cx="40" cy="130" r="7" fill="#0A1E35" stroke="#FFFFFF" strokeWidth="2" />
    <circle cx="120" cy="60" r="7" fill="#059669" stroke="#FFFFFF" strokeWidth="2" />
    <circle cx="200" cy="40" r="8" fill="#D97706" stroke="#FFFFFF" strokeWidth="2" />

    {/* Moving Electric Truck Icon */}
    <g transform="translate(110, 48)">
      <rect x="0" y="0" width="22" height="12" rx="3" fill="#0A1E35" />
      <circle cx="5" cy="12" r="3" fill="#334155" />
      <circle cx="17" cy="12" r="3" fill="#334155" />
      <rect x="14" y="2" width="6" height="5" rx="1" fill="#38BDF8" />
    </g>

    {/* Distance Saved Badge */}
    <g transform="translate(140, 135)">
      <rect x="0" y="0" width="85" height="24" rx="6" fill="#059669" />
      <text x="42" y="16" textAnchor="middle" fill="#FFFFFF" fontSize="11" fontWeight="bold">-32% DISTANCE</text>
    </g>
  </svg>
);

export const VisionSortingIllustration: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg
    viewBox="0 0 240 180"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`w-full h-full ${className}`}
    role="img"
    aria-label="Computer Vision AI Waste Sorting"
  >
    {/* Conveyor Belt Surface */}
    <rect width="240" height="180" rx="12" fill="#0A1E35" />
    <rect x="20" y="40" width="200" height="100" rx="8" fill="#1E293B" stroke="#334155" strokeWidth="2" />
    <line x1="20" y1="90" x2="220" y2="90" stroke="#475569" strokeWidth="1" strokeDasharray="6 6" />

    {/* Object 1: PET Plastic Bottle */}
    <g transform="translate(45, 60)">
      <rect x="5" y="10" width="28" height="50" rx="6" fill="#38BDF8" fillOpacity="0.3" stroke="#38BDF8" strokeWidth="1.5" />
      <rect x="12" y="2" width="14" height="8" rx="2" fill="#38BDF8" />
      
      {/* Bounding Box Green */}
      <rect x="0" y="0" width="40" height="66" rx="4" stroke="#10B981" strokeWidth="2" strokeDasharray="3 2" fill="#10B981" fillOpacity="0.08" />
      {/* Tag */}
      <rect x="0" y="-14" width="48" height="14" rx="2" fill="#10B981" />
      <text x="24" y="-3" textAnchor="middle" fill="#064E3B" fontSize="8" fontWeight="bold" fontFamily="monospace">rPET 98.4%</text>
    </g>

    {/* Object 2: Aluminium Can */}
    <g transform="translate(130, 68)">
      <rect x="6" y="8" width="26" height="42" rx="4" fill="#CBD5E1" fillOpacity="0.4" stroke="#94A3B8" strokeWidth="1.5" />
      <ellipse cx="19" cy="8" rx="13" ry="5" fill="#E2E8F0" />
      
      {/* Bounding Box Amber */}
      <rect x="0" y="0" width="38" height="56" rx="4" stroke="#F59E0B" strokeWidth="2" strokeDasharray="3 2" fill="#F59E0B" fillOpacity="0.08" />
      {/* Tag */}
      <rect x="0" y="-14" width="42" height="14" rx="2" fill="#F59E0B" />
      <text x="21" y="-3" textAnchor="middle" fill="#78350F" fontSize="8" fontWeight="bold" fontFamily="monospace">ALU 96.1%</text>
    </g>

    {/* Optical Sorting Air Jet Ejector */}
    <path d="M 190 20 L 190 40" stroke="#38BDF8" strokeWidth="2" />
    <circle cx="190" cy="40" r="3" fill="#38BDF8" />
    <path d="M 185 45 L 195 55 M 195 45 L 185 55" stroke="#38BDF8" strokeWidth="1.5" />

    {/* Real-time Conveyor Speed & Accuracy Indicator */}
    <rect x="20" y="150" width="200" height="20" rx="4" fill="#0F172A" />
    <text x="30" y="164" fill="#94A3B8" fontSize="9" fontFamily="monospace">FPS: 60 · SPEED: 1.8 m/s · JET: AUTO</text>
  </svg>
);
