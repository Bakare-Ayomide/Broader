import React from 'react';
import { motion } from 'motion/react';
import { MapPin, Navigation } from 'lucide-react';

export interface RideProgressProps {
  progressPercent: number; // 0 to 100
  pickupAddress: string;
  destinationAddress: string;
  etaMinutes: number;
  distanceRemainingKm: number;
  className?: string;
}

export const RideProgress: React.FC<RideProgressProps> = ({
  progressPercent,
  pickupAddress,
  destinationAddress,
  etaMinutes,
  distanceRemainingKm,
  className = '',
}) => {
  const clampedProgress = Math.min(100, Math.max(0, progressPercent));

  return (
    <div
      className={`relative p-3.5 rounded-2xl bg-black/60 backdrop-blur-xl border border-white/[0.08] shadow-lg ${className}`}
    >
      {/* Upper ETA & Distance Header */}
      <div className="flex items-center justify-between text-xs mb-2.5">
        <div className="flex items-center gap-1.5 text-blue-400 font-JakartaBold">
          <Navigation className="w-3.5 h-3.5 animate-pulse" />
          <span>{etaMinutes} min away</span>
        </div>
        <div className="text-[11px] font-mono text-neutral-400">
          {distanceRemainingKm} km remaining
        </div>
      </div>

      {/* Progress Track with animated vehicle indicator */}
      <div className="relative w-full h-2.5 bg-white/[0.08] rounded-full overflow-visible my-3 border border-white/[0.06]">
        {/* Animated Fill Gradient */}
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-[#0286FF] via-cyan-400 to-emerald-400 shadow-[0_0_12px_rgba(2,134,255,0.6)]"
          style={{ width: `${clampedProgress}%` }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        />

        {/* Moving Vehicle Pill Marker */}
        <motion.div
          className="absolute -top-1.5 -ml-3 w-6 h-6 rounded-full bg-black border-2 border-cyan-300 shadow-[0_0_10px_#22d3ee] flex items-center justify-center text-[10px]"
          style={{ left: `${clampedProgress}%` }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        >
          <div className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
        </motion.div>
      </div>

      {/* Origin & Destination Labels */}
      <div className="flex items-center justify-between text-[11px] text-neutral-300 font-JakartaMedium pt-0.5">
        <div className="flex items-center gap-1 truncate max-w-[45%]">
          <div className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
          <span className="truncate">{pickupAddress}</span>
        </div>
        <div className="flex items-center gap-1 truncate max-w-[45%] justify-end">
          <span className="truncate">{destinationAddress}</span>
          <MapPin className="w-3 h-3 text-red-400 shrink-0" />
        </div>
      </div>
    </div>
  );
};
