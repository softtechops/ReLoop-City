import React from 'react';

interface IsometricCityLoopProps {
  className?: string;
  size?: number;
}

export const IsometricCityLoop: React.FC<IsometricCityLoopProps> = ({
  className = '',
  size = 560,
}) => {
  return (
    <div
      className={`relative flex items-center justify-center select-none ${className}`}
      style={{ maxWidth: size, maxHeight: size, width: '100%', aspectRatio: '1/1' }}
      aria-label="Isometric illustration of ReLoop City circular waste-to-energy municipal loop"
    >
      {/* Background Soft Blueprint Isometric Radial Glow */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-sage-500/10 via-navy-500/5 to-amberGold-500/10 blur-3xl pointer-events-none" />

      {/* Main Isometric SVG Canvas */}
      <svg
        viewBox="0 0 600 600"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-xl"
        role="img"
      >
        <defs>
          {/* Subtle Blueprint Grid Pattern */}
          <pattern id="iso-grid" width="30" height="30" patternUnits="userSpaceOnUse">
            <path
              d="M 30 0 L 0 30 M 0 0 L 30 30"
              stroke="#0F3E6D"
              strokeWidth="0.5"
              strokeOpacity="0.08"
            />
          </pattern>

          {/* Gradients for Loop Arrows */}
          <linearGradient id="sage-arrow-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#059669" />
            <stop offset="100%" stopColor="#10B981" />
          </linearGradient>

          <linearGradient id="amber-arrow-grad" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#D97706" />
            <stop offset="100%" stopColor="#F59E0B" />
          </linearGradient>

          <filter id="glow-filter" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Blueprint Ground Foundation Ellipse */}
        <ellipse
          cx="300"
          cy="370"
          rx="250"
          ry="130"
          fill="url(#iso-grid)"
          stroke="#0F3E6D"
          strokeWidth="1.5"
          strokeDasharray="4 4"
          strokeOpacity="0.25"
        />
        <ellipse
          cx="300"
          cy="370"
          rx="190"
          ry="95"
          fill="#FFFFFF"
          fillOpacity="0.7"
          stroke="#0F3E6D"
          strokeWidth="2"
          strokeOpacity="0.4"
        />

        {/* ========================================================================= */}
        {/* ROTATING CIRCULAR LOOP OF ARROWS (Sage Green & Amber) */}
        {/* Gently rotating around the skyline */}
        {/* ========================================================================= */}
        <g className="origin-[300px_350px] animate-spin-slow">
          {/* Outer Dashed Orbit Path */}
          <ellipse
            cx="300"
            cy="350"
            rx="230"
            ry="115"
            stroke="#94A3B8"
            strokeWidth="1.5"
            strokeDasharray="6 8"
            strokeOpacity="0.35"
            fill="none"
          />

          {/* Top Sage Green Circular Arc Arrow (Organic & Material Loop) */}
          <path
            d="M 120 310 C 140 240 240 220 380 235 C 470 245 520 300 520 350"
            stroke="url(#sage-arrow-grad)"
            strokeWidth="7"
            strokeLinecap="round"
            fill="none"
            filter="url(#glow-filter)"
          />
          {/* Sage Arrowhead */}
          <polygon
            points="515,365 535,345 505,340"
            fill="#059669"
          />

          {/* Bottom Amber Circular Arc Arrow (Clean Energy & Recovery Loop) */}
          <path
            d="M 480 390 C 460 460 360 480 220 465 C 130 455 80 400 80 350"
            stroke="url(#amber-arrow-grad)"
            strokeWidth="7"
            strokeLinecap="round"
            fill="none"
            filter="url(#glow-filter)"
          />
          {/* Amber Arrowhead */}
          <polygon
            points="85,335 65,355 95,360"
            fill="#D97706"
          />

          {/* Orbiting Satellite Data Nodes */}
          <circle cx="200" cy="230" r="6" fill="#059669" className="animate-ping" opacity="0.6" />
          <circle cx="200" cy="230" r="5" fill="#10B981" />
          <circle cx="400" cy="470" r="6" fill="#D97706" className="animate-ping" opacity="0.6" />
          <circle cx="400" cy="470" r="5" fill="#F59E0B" />
        </g>

        {/* ========================================================================= */}
        {/* ISOMETRIC CITY SKYLINE & FACILITIES (Gently Floating) */}
        {/* ========================================================================= */}
        <g className="animate-float-slow origin-center">
          
          {/* Road / Transport Grid Lines */}
          <path
            d="M 180 380 L 300 440 L 420 380"
            stroke="#94A3B8"
            strokeWidth="3"
            strokeDasharray="4 4"
            fill="none"
          />
          <path
            d="M 300 300 L 300 440"
            stroke="#94A3B8"
            strokeWidth="2.5"
            strokeDasharray="3 3"
            fill="none"
            strokeOpacity="0.5"
          />

          {/* ------------------------------------------------------------- */}
          {/* BUILDING 1: Modern Municipal Hub / Tower (Center Left) */}
          {/* ------------------------------------------------------------- */}
          <g transform="translate(180, 180)">
            {/* Left Face */}
            <polygon points="60,160 10,135 10,60 60,85" fill="#E1EDF7" stroke="#0F3E6D" strokeWidth="2" />
            {/* Right Face */}
            <polygon points="60,160 110,135 110,60 60,85" fill="#C2DCF0" stroke="#0F3E6D" strokeWidth="2" />
            {/* Top Roof */}
            <polygon points="60,85 10,60 60,35 110,60" fill="#F0F5FA" stroke="#0F3E6D" strokeWidth="2" />
            
            {/* Windows / IoT Sensor Arrays */}
            <line x1="25" y1="75" x2="45" y2="85" stroke="#0F3E6D" strokeWidth="1.5" strokeOpacity="0.6" />
            <line x1="25" y1="95" x2="45" y2="105" stroke="#0F3E6D" strokeWidth="1.5" strokeOpacity="0.6" />
            <line x1="25" y1="115" x2="45" y2="125" stroke="#0F3E6D" strokeWidth="1.5" strokeOpacity="0.6" />
            <line x1="75" y1="85" x2="95" y2="75" stroke="#0F3E6D" strokeWidth="1.5" strokeOpacity="0.6" />
            <line x1="75" y1="105" x2="95" y2="95" stroke="#0F3E6D" strokeWidth="1.5" strokeOpacity="0.6" />
            <line x1="75" y1="125" x2="95" y2="115" stroke="#0F3E6D" strokeWidth="1.5" strokeOpacity="0.6" />
            
            {/* Rooftop Antenna with IoT Pulsing Signal */}
            <line x1="60" y1="35" x2="60" y2="10" stroke="#0F3E6D" strokeWidth="2" />
            <circle cx="60" cy="10" r="4" fill="#059669" />
            <circle cx="60" cy="10" r="8" stroke="#059669" strokeWidth="1" strokeOpacity="0.5" className="animate-ping" />
          </g>

          {/* ------------------------------------------------------------- */}
          {/* BUILDING 2: High-Rise Tech Office (Center Rear) */}
          {/* ------------------------------------------------------------- */}
          <g transform="translate(250, 130)">
            {/* Left Face */}
            <polygon points="50,180 10,160 10,50 50,70" fill="#C2DCF0" stroke="#0F3E6D" strokeWidth="2" />
            {/* Right Face */}
            <polygon points="50,180 90,160 90,50 50,70" fill="#94C2E4" stroke="#0F3E6D" strokeWidth="2" />
            {/* Top Roof */}
            <polygon points="50,70 10,50 50,30 90,50" fill="#E1EDF7" stroke="#0F3E6D" strokeWidth="2" />
            
            {/* High-Rise Facade Glass Lines */}
            <line x1="25" y1="65" x2="35" y2="70" stroke="#0F3E6D" strokeWidth="1" strokeOpacity="0.5" />
            <line x1="25" y1="85" x2="35" y2="90" stroke="#0F3E6D" strokeWidth="1" strokeOpacity="0.5" />
            <line x1="25" y1="105" x2="35" y2="110" stroke="#0F3E6D" strokeWidth="1" strokeOpacity="0.5" />
            <line x1="25" y1="125" x2="35" y2="130" stroke="#0F3E6D" strokeWidth="1" strokeOpacity="0.5" />
            <line x1="25" y1="145" x2="35" y2="150" stroke="#0F3E6D" strokeWidth="1" strokeOpacity="0.5" />
            <line x1="65" y1="70" x2="75" y2="65" stroke="#0F3E6D" strokeWidth="1" strokeOpacity="0.5" />
            <line x1="65" y1="90" x2="75" y2="85" stroke="#0F3E6D" strokeWidth="1" strokeOpacity="0.5" />
            <line x1="65" y1="110" x2="75" y2="105" stroke="#0F3E6D" strokeWidth="1" strokeOpacity="0.5" />
            <line x1="65" y1="130" x2="75" y2="125" stroke="#0F3E6D" strokeWidth="1" strokeOpacity="0.5" />
            <line x1="65" y1="150" x2="75" y2="145" stroke="#0F3E6D" strokeWidth="1" strokeOpacity="0.5" />
          </g>

          {/* ------------------------------------------------------------- */}
          {/* FACILITY 1: Cylindrical Biogas Digester Tank with Gas Dome */}
          {/* ------------------------------------------------------------- */}
          <g transform="translate(130, 290)">
            {/* Cylinder Body */}
            <path
              d="M 20 50 L 20 80 C 20 95 60 95 60 80 L 60 50 Z"
              fill="#D1FAE5"
              stroke="#059669"
              strokeWidth="2"
            />
            {/* Cylindrical Dome Top */}
            <ellipse cx="40" cy="50" rx="20" ry="10" fill="#A7F3D0" stroke="#059669" strokeWidth="2" />
            {/* Biogas Pressure Level Indicator */}
            <path d="M 25 70 C 35 77 45 77 55 70" stroke="#047857" strokeWidth="2" fill="none" />
            <circle cx="40" cy="40" r="3" fill="#D97706" />
            {/* Pipeline to Energy Unit */}
            <path
              d="M 60 70 L 95 87 L 120 75"
              stroke="#059669"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
            {/* Eco Leaf Badge */}
            <text x="35" y="83" fontSize="10" fill="#065F46" fontWeight="bold">CH₄</text>
          </g>

          {/* ------------------------------------------------------------- */}
          {/* FACILITY 2: Solar Panel Arrays (Right Forefront) */}
          {/* ------------------------------------------------------------- */}
          <g transform="translate(350, 270)">
            {/* Solar Stand 1 */}
            <line x1="30" y1="50" x2="30" y2="70" stroke="#0F3E6D" strokeWidth="2" />
            <line x1="70" y1="70" x2="70" y2="90" stroke="#0F3E6D" strokeWidth="2" />
            {/* Solar Surface 1 */}
            <polygon
              points="10,40 50,20 90,40 50,60"
              fill="#1E293B"
              stroke="#D97706"
              strokeWidth="2"
            />
            {/* Panel Grid Lines */}
            <line x1="30" y1="30" x2="70" y2="50" stroke="#FDE68A" strokeWidth="1" strokeOpacity="0.7" />
            <line x1="50" y1="20" x2="50" y2="60" stroke="#FDE68A" strokeWidth="1" strokeOpacity="0.7" />
            <line x1="30" y1="50" x2="70" y2="30" stroke="#FDE68A" strokeWidth="1" strokeOpacity="0.7" />

            {/* Solar Surface 2 (Step Behind) */}
            <polygon
              points="60,70 100,50 140,70 100,90"
              fill="#1E293B"
              stroke="#D97706"
              strokeWidth="2"
            />
            <line x1="80" y1="60" x2="120" y2="80" stroke="#FDE68A" strokeWidth="1" strokeOpacity="0.7" />
            <line x1="100" y1="50" x2="100" y2="90" stroke="#FDE68A" strokeWidth="1" strokeOpacity="0.7" />
          </g>

          {/* ------------------------------------------------------------- */}
          {/* FACILITY 3: Power Transmission Pylon (Right Rear) */}
          {/* ------------------------------------------------------------- */}
          <g transform="translate(420, 160)">
            {/* Lattice Tower Frame */}
            <line x1="40" y1="130" x2="30" y2="30" stroke="#0F3E6D" strokeWidth="2" />
            <line x1="60" y1="130" x2="70" y2="30" stroke="#0F3E6D" strokeWidth="2" />
            <line x1="30" y1="30" x2="70" y2="30" stroke="#0F3E6D" strokeWidth="2" />
            {/* Cross Bracing */}
            <line x1="33" y1="60" x2="67" y2="60" stroke="#0F3E6D" strokeWidth="1.5" />
            <line x1="33" y1="60" x2="65" y2="95" stroke="#0F3E6D" strokeWidth="1.5" />
            <line x1="67" y1="60" x2="35" y2="95" stroke="#0F3E6D" strokeWidth="1.5" />
            <line x1="36" y1="95" x2="64" y2="95" stroke="#0F3E6D" strokeWidth="1.5" />
            {/* Transmission Crossarms */}
            <line x1="15" y1="40" x2="85" y2="40" stroke="#0F3E6D" strokeWidth="2.5" />
            <line x1="20" y1="65" x2="80" y2="65" stroke="#0F3E6D" strokeWidth="2" />
            {/* Insulators & Sparks */}
            <circle cx="15" cy="45" r="2.5" fill="#D97706" />
            <circle cx="85" cy="45" r="2.5" fill="#D97706" />
            <path d="M 15 48 Q 50 65 85 48" stroke="#F59E0B" strokeWidth="1.5" strokeDasharray="3 3" fill="none" />
          </g>

          {/* ------------------------------------------------------------- */}
          {/* SMART RECYCLING BINS & ELECTRIC LOGISTICS FLEET */}
          {/* ------------------------------------------------------------- */}
          {/* Smart Bin Station (Front Center) */}
          <g transform="translate(230, 370)">
            {/* Bin 1: Organic (Green) */}
            <rect x="0" y="0" width="14" height="22" rx="3" fill="#10B981" stroke="#047857" strokeWidth="1.5" />
            <circle cx="7" cy="4" r="2" fill="#FFFFFF" />
            {/* Bin 2: Dry Recyclables (Blue) */}
            <rect x="18" y="5" width="14" height="22" rx="3" fill="#2563EB" stroke="#1D4ED8" strokeWidth="1.5" />
            <circle cx="25" cy="9" r="2" fill="#FFFFFF" />
            {/* Bin 3: Inert / Tailings (Gray) */}
            <rect x="36" y="10" width="14" height="22" rx="3" fill="#64748B" stroke="#475569" strokeWidth="1.5" />
            <circle cx="43" cy="14" r="2" fill="#FFFFFF" />
            
            {/* IoT Telemetry Wave Signal */}
            <path
              d="M 5 0 C 15 -10 35 -10 45 0"
              stroke="#059669"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeDasharray="2 3"
              fill="none"
              className="animate-pulse"
            />
          </g>

          {/* Smart Electric Collection Truck (Center Roadway) */}
          <g transform="translate(290, 390)">
            {/* Truck Chassis */}
            <polygon points="20,15 50,0 70,10 40,25" fill="#0A1E35" stroke="#0F3E6D" strokeWidth="1.5" />
            {/* Cab */}
            <polygon points="22,12 38,4 38,-6 22,2" fill="#38BDF8" stroke="#0F3E6D" strokeWidth="1" />
            {/* Cargo Compartment */}
            <polygon points="40,23 68,9 68,0 40,14" fill="#10B981" stroke="#047857" strokeWidth="1.5" />
            {/* Wheels */}
            <circle cx="32" cy="22" r="4" fill="#0F172A" />
            <circle cx="58" cy="14" r="4" fill="#0F172A" />
          </g>

        </g>
      </svg>
    </div>
  );
};
