import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';

export interface TripMiniMapProps {
  routePoints?: { x: number; y: number }[];
  color?: string;
  width?: number | string;
  height?: number | string;
  animated?: boolean;
  className?: string;
}

// Preset route polyline paths inspired by Screenshot 4 and Lagos arterial roads
const PRESET_PATHS = [
  // Lekki to VI (sharp turn, long straight, curve)
  'M 10 20 C 35 18, 45 40, 65 42 L 110 44 L 140 45',
  // Short trip with elevation curve
  'M 10 40 C 40 40, 70 38, 95 32 L 130 18',
  // Zig-zag city avenue
  'M 10 22 L 30 25 L 35 42 L 75 42 L 95 44 L 105 28 L 135 28',
  // Bridge crossing curve
  'M 10 42 C 40 32, 60 22, 85 24 C 110 26, 125 40, 140 38',
  // Loop / Ring Road
  'M 10 32 C 10 18, 40 18, 80 18 C 110 18, 130 24, 130 36 C 130 48, 100 48, 60 48 L 25 48',
  // Island highway
  'M 10 20 L 40 22 L 50 42 L 110 42 L 135 44',
];

export const TripMiniMap: React.FC<TripMiniMapProps> = ({
  routePoints,
  color = '#EC4899', // Electric pink/magenta matching Screenshot 4
  width = '100%',
  height = 56,
  animated = true,
  className = '',
}) => {
  // Generate random or deterministic path based on color/seed
  const [pathD, setPathD] = useState(() => {
    if (routePoints && routePoints.length > 1) {
      return routePoints
        .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`)
        .join(' ');
    }
    return PRESET_PATHS[Math.floor(Math.random() * PRESET_PATHS.length)];
  });

  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden rounded-xl bg-black/40 border border-white/[0.06] ${className}`}
      style={{ width, height }}
    >
      {/* Subtle grid background pattern */}
      <div
        className="absolute inset-0 opacity-[0.07] pointer-events-none"
        style={{
          backgroundImage:
            'radial-gradient(circle, rgba(255,255,255,0.4) 1px, transparent 1px)',
          backgroundSize: '12px 12px',
        }}
      />

      <svg
        className="w-full h-full p-2 overflow-visible"
        viewBox="0 0 150 60"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <filter id={`routeGlow-${color}`} x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Ambient Glow Shadow Route */}
        <path
          d={pathD}
          stroke={color}
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="opacity-30 blur-xs"
        />

        {/* Progressive Drawing Route Line */}
        <motion.path
          d={pathD}
          stroke={color}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter={`url(#routeGlow-${color})`}
          initial={animated ? { pathLength: 0, opacity: 0 } : { pathLength: 1, opacity: 1 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        />

        {/* Pickup Start Dot (Green) */}
        <circle cx="10" cy="24" r="3" fill="#10B981" stroke="#000000" strokeWidth="1" />

        {/* Destination End Dot (Pulse Red/Pink) */}
        <circle cx="138" cy="40" r="3.5" fill={color} stroke="#FFFFFF" strokeWidth="1" />
      </svg>
    </div>
  );
};
