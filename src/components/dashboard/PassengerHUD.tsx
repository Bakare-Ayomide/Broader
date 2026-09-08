import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Gauge,
  Navigation,
  Clock,
  Compass,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  Eye,
  AlertTriangle,
  Radio,
} from 'lucide-react';
import { Speedometer } from './Speedometer';
import { GlassCard } from '../glass/GlassCard';
import { GlassPill } from '../glass/GlassPill';
import { GlassButton } from '../glass/GlassButton';

export interface PassengerHUDProps {
  speed: number;
  speedLimit?: number;
  etaMinutes: number;
  distanceKm: number;
  currentInstruction?: string;
  streetName?: string;
  fuelLevel?: number;
  onOpenStreetView?: () => void;
  className?: string;
}

export const PassengerHUD: React.FC<PassengerHUDProps> = ({
  speed,
  speedLimit = 80,
  etaMinutes,
  distanceKm,
  currentInstruction = 'Continue straight onto Ozumba Mbadiwe Ave',
  streetName = 'Ozumba Mbadiwe Ave',
  fuelLevel = 0.76,
  onOpenStreetView,
  className = '',
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const isOverSpeed = speed > speedLimit;

  return (
    <div className={`select-none ${className}`}>
      {/* Collapsed Compact Floating HUD Pill */}
      {!isExpanded ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between gap-2 p-2 px-3 rounded-2xl bg-black/75 backdrop-blur-xl border border-white/[0.12] shadow-[0_8px_30px_rgba(0,0,0,0.8)] cursor-pointer"
          onClick={() => setIsExpanded(true)}
        >
          {/* Speed badge */}
          <div className="flex items-center gap-2">
            <div
              className={`w-9 h-9 rounded-xl flex flex-col items-center justify-center font-mono border ${
                isOverSpeed
                  ? 'bg-red-950/60 border-red-500/50 text-red-400 animate-pulse'
                  : 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
              }`}
            >
              <span className="text-xs font-bold leading-none">{Math.round(speed)}</span>
              <span className="text-[7px] text-neutral-400">KM/H</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-JakartaBold text-white">Telematics HUD</span>
                <span className="text-[9px] px-1 rounded bg-white/10 text-neutral-300 font-mono">
                  LMT {speedLimit}
                </span>
              </div>
              <p className="text-[10px] text-neutral-400 font-JakartaRegular truncate max-w-[140px]">
                {streetName}
              </p>
            </div>
          </div>

          {/* ETA & Distance */}
          <div className="flex items-center gap-2">
            <div className="text-right">
              <div className="text-xs font-JakartaBold text-blue-400">{etaMinutes} min</div>
              <div className="text-[10px] font-mono text-neutral-400">{distanceKm} km</div>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsExpanded(true);
              }}
              className="w-7 h-7 rounded-full bg-white/[0.08] hover:bg-white/[0.15] flex items-center justify-center text-neutral-300 transition-colors"
            >
              <ChevronUp className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      ) : (
        /* Expanded Glass Dashboard Overlay */
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ type: 'spring', damping: 25, stiffness: 350 }}
          className="rounded-3xl bg-gradient-to-b from-neutral-900/95 via-black/95 to-black/95 backdrop-blur-2xl border border-white/[0.14] p-4 shadow-[0_20px_50px_rgba(0,0,0,0.9)] overflow-hidden"
        >
          {/* Header Bar */}
          <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <span className="text-xs font-JakartaBold uppercase tracking-wider text-neutral-200">
                Live Ride Telematics
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-white/10 text-cyan-300 font-mono">
                TELEMETRY
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              {onOpenStreetView && (
                <button
                  onClick={onOpenStreetView}
                  className="px-2.5 py-1 rounded-full bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/40 text-[10px] font-JakartaBold text-cyan-300 flex items-center gap-1 transition-all"
                >
                  <Eye className="w-3 h-3" />
                  <span>3D View</span>
                </button>
              )}
              <button
                onClick={() => setIsExpanded(false)}
                className="w-7 h-7 rounded-full bg-white/[0.08] hover:bg-white/[0.15] flex items-center justify-center text-neutral-300 transition-colors"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Speedometer Gauge Presentation */}
          <div className="py-2 flex flex-col items-center justify-center relative">
            <Speedometer
              speed={speed}
              maxSpeed={200}
              speedLimit={speedLimit}
              size={180}
              showSubGauge={true}
              subGaugeLevel={fuelLevel}
            />

            {isOverSpeed && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-1 flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-500/20 border border-red-500/40 text-red-400 text-[10px] font-JakartaBold"
              >
                <AlertTriangle className="w-3 h-3" />
                <span>Speed Warning: Above {speedLimit} km/h Limit</span>
              </motion.div>
            )}
          </div>

          {/* Telemetry Metrics Row */}
          <div className="grid grid-cols-3 gap-2 my-2">
            <div className="p-2.5 rounded-2xl bg-white/[0.04] border border-white/[0.06] text-center">
              <span className="text-[9px] text-neutral-400 font-JakartaMedium block uppercase">
                Current Speed
              </span>
              <span className="text-base font-mono font-extrabold text-white">
                {Math.round(speed)}{' '}
                <span className="text-[10px] font-normal text-neutral-400">km/h</span>
              </span>
            </div>

            <div className="p-2.5 rounded-2xl bg-white/[0.04] border border-white/[0.06] text-center">
              <span className="text-[9px] text-neutral-400 font-JakartaMedium block uppercase">
                Trip ETA
              </span>
              <span className="text-base font-mono font-extrabold text-blue-400">
                {etaMinutes} <span className="text-[10px] font-normal text-neutral-400">min</span>
              </span>
            </div>

            <div className="p-2.5 rounded-2xl bg-white/[0.04] border border-white/[0.06] text-center">
              <span className="text-[9px] text-neutral-400 font-JakartaMedium block uppercase">
                Distance
              </span>
              <span className="text-base font-mono font-extrabold text-emerald-400">
                {distanceKm} <span className="text-[10px] font-normal text-neutral-400">km</span>
              </span>
            </div>
          </div>

          {/* Navigation Instruction Pill */}
          <div className="p-2.5 rounded-2xl bg-white/[0.03] border border-white/[0.08] flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#9EE6B5]/20 text-[#9EE6B5] flex items-center justify-center shrink-0 border border-[#9EE6B5]/30">
              <Navigation className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-[9px] text-[#9EE6B5] font-bold uppercase tracking-wider block">
                Next Waypoint
              </span>
              <p className="text-xs text-neutral-200 font-JakartaMedium truncate">
                {currentInstruction}
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};
