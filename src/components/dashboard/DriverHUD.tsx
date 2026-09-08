import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Navigation,
  ArrowUpRight,
  ArrowUpLeft,
  ArrowUp,
  RotateCcw,
  ShieldAlert,
  DollarSign,
  Phone,
  MessageSquare,
  Eye,
  CheckCircle2,
  AlertTriangle,
  Radio,
  Sliders,
  Power,
  ChevronRight,
} from 'lucide-react';
import { Speedometer } from './Speedometer';
import { GlassCard } from '../glass/GlassCard';
import { GlassButton } from '../glass/GlassButton';
import { GlassToggle } from '../glass/GlassToggle';
import { GlassStatusBadge } from '../glass/GlassStatusBadge';
import { RideProgress } from './RideProgress';

export interface DriverHUDProps {
  speed: number;
  speedLimit?: number;
  tripStatus: 'IDLE' | 'EN ROUTE' | 'ARRIVING' | 'TRIP STARTED' | 'COMPLETED';
  etaMinutes: number;
  distanceKm: number;
  passengerName?: string;
  pickupAddress?: string;
  destinationAddress?: string;
  currentInstruction?: string;
  isOnline: boolean;
  onToggleOnline: (online: boolean) => void;
  onOpenEarnings?: () => void;
  onEmergencySOS?: () => void;
  onOpenDriverView?: () => void;
  onTripAction?: (action: 'arrived' | 'start' | 'complete' | 'cancel') => void;
  todayEarningsNaira?: number;
  className?: string;
}

export const DriverHUD: React.FC<DriverHUDProps> = ({
  speed,
  speedLimit = 80,
  tripStatus = 'EN ROUTE',
  etaMinutes = 8,
  distanceKm = 2.1,
  passengerName = 'Adewale Adeleke',
  pickupAddress = 'Victoria Island, Lagos',
  destinationAddress = 'Admiralty Way, Lekki Phase 1',
  currentInstruction = 'Turn left in 400 m onto Adeola Odeku St',
  isOnline = true,
  onToggleOnline,
  onOpenEarnings,
  onEmergencySOS,
  onOpenDriverView,
  onTripAction,
  todayEarningsNaira = 38500,
  className = '',
}) => {
  const [autoAccept, setAutoAccept] = useState(true);
  const isOverSpeed = speed > speedLimit;

  // Determine turn icon based on instruction text
  const getNavIcon = () => {
    const text = currentInstruction.toLowerCase();
    if (text.includes('left')) return <ArrowUpLeft className="w-6 h-6 text-cyan-400" />;
    if (text.includes('right')) return <ArrowUpRight className="w-6 h-6 text-cyan-400" />;
    if (text.includes('u-turn') || text.includes('roundabout'))
      return <RotateCcw className="w-6 h-6 text-yellow-400" />;
    return <ArrowUp className="w-6 h-6 text-emerald-400" />;
  };

  return (
    <div className={`flex flex-col gap-3.5 select-none ${className}`}>
      {/* Top Telematics & Quick Actions Header */}
      <div className="flex items-center justify-between gap-2 p-3 rounded-2xl bg-black/70 backdrop-blur-xl border border-white/[0.1] shadow-lg">
        {/* Driver Online Toggle */}
        <div className="flex items-center gap-2">
          <GlassToggle
            checked={isOnline}
            onChange={onToggleOnline}
            color="neon-green"
            size="md"
          />
          <span className="text-xs font-JakartaBold">
            {isOnline ? (
              <span className="text-emerald-400">ONLINE</span>
            ) : (
              <span className="text-neutral-400">OFFLINE</span>
            )}
          </span>
        </div>

        {/* Shortcuts: Earnings, Driver AR View, Emergency SOS */}
        <div className="flex items-center gap-2">
          {onOpenEarnings && (
            <button
              onClick={onOpenEarnings}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs font-mono font-bold hover:bg-emerald-950/60 transition-all shadow-xs"
              title="Today's Earnings"
            >
              <DollarSign className="w-3.5 h-3.5" />
              <span>₦{todayEarningsNaira.toLocaleString()}</span>
            </button>
          )}

          {onOpenDriverView && (
            <button
              onClick={onOpenDriverView}
              className="px-2.5 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/40 text-cyan-300 text-xs font-JakartaBold flex items-center gap-1 transition-all"
              title="Open AR Driver View"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>HUD View</span>
            </button>
          )}

          {onEmergencySOS && (
            <button
              onClick={onEmergencySOS}
              className="w-8 h-8 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-400 flex items-center justify-center border border-red-500/40 transition-colors"
              title="Emergency SOS"
            >
              <ShieldAlert className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Navigation Turn Banner (High Visibility Gaming / Automotive HUD) */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-4 rounded-3xl bg-gradient-to-r from-blue-950/80 via-neutral-900/90 to-black border border-cyan-500/30 shadow-[0_10px_30px_rgba(6,182,212,0.15)] flex items-center gap-3.5 backdrop-blur-xl"
      >
        <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-400/50 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
          {getNavIcon()}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-JakartaBold uppercase tracking-widest text-cyan-400">
              Navigation Guidance
            </span>
            <span className="text-[9px] px-1.5 py-0.2 rounded bg-white/10 text-neutral-300 font-mono">
              GPS LOCK
            </span>
          </div>
          <h4 className="text-sm sm:text-base font-JakartaBold text-white truncate mt-0.5">
            {currentInstruction}
          </h4>
        </div>
      </motion.div>

      {/* Primary Speedometer Cockpit Panel */}
      <div className="p-4 rounded-3xl bg-gradient-to-b from-neutral-900/90 via-black/95 to-black border border-white/[0.12] shadow-2xl backdrop-blur-2xl flex flex-col items-center justify-center">
        {/* Speedometer Gauge */}
        <Speedometer
          speed={speed}
          maxSpeed={200}
          speedLimit={speedLimit}
          size={210}
          showSubGauge={true}
          subGaugeLevel={0.82}
        />

        {/* Live Trip Telemetry Badges */}
        <div className="grid grid-cols-3 gap-2 w-full mt-3">
          <div className="p-2 rounded-2xl bg-white/[0.04] border border-white/[0.08] text-center">
            <span className="text-[9px] text-neutral-400 font-JakartaMedium uppercase block">
              Trip Status
            </span>
            <span className="text-xs font-mono font-bold text-emerald-400 truncate block">
              {tripStatus}
            </span>
          </div>

          <div className="p-2 rounded-2xl bg-white/[0.04] border border-white/[0.08] text-center">
            <span className="text-[9px] text-neutral-400 font-JakartaMedium uppercase block">
              ETA
            </span>
            <span className="text-xs font-mono font-bold text-blue-400 block">
              {etaMinutes} min
            </span>
          </div>

          <div className="p-2 rounded-2xl bg-white/[0.04] border border-white/[0.08] text-center">
            <span className="text-[9px] text-neutral-400 font-JakartaMedium uppercase block">
              Distance
            </span>
            <span className="text-xs font-mono font-bold text-white block">
              {distanceKm} km
            </span>
          </div>
        </div>

        {/* Passenger Info & Trip Control Button */}
        {tripStatus !== 'IDLE' && (
          <div className="w-full mt-3 pt-3 border-t border-white/[0.08]">
            <div className="flex items-center justify-between mb-3 text-xs">
              <div>
                <span className="text-[10px] text-neutral-400 font-JakartaMedium block">
                  Passenger
                </span>
                <span className="font-JakartaBold text-white text-sm">{passengerName}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <button className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-neutral-200">
                  <Phone className="w-3.5 h-3.5" />
                </button>
                <button className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-neutral-200">
                  <MessageSquare className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Dynamic Large Touch-Target Action Button */}
            {onTripAction && (
              <GlassButton
                variant={tripStatus === 'TRIP STARTED' ? 'neon-green' : 'primary'}
                size="lg"
                fullWidth={true}
                onClick={() => {
                  if (tripStatus === 'EN ROUTE') onTripAction('arrived');
                  else if (tripStatus === 'ARRIVING') onTripAction('start');
                  else if (tripStatus === 'TRIP STARTED') onTripAction('complete');
                }}
                leftIcon={<CheckCircle2 className="w-5 h-5" />}
              >
                {tripStatus === 'EN ROUTE' && 'Mark Arrived at Pickup'}
                {tripStatus === 'ARRIVING' && 'Start Passenger Trip'}
                {tripStatus === 'TRIP STARTED' && 'Complete Trip & Collect Fare'}
                {tripStatus === 'COMPLETED' && 'Ready for Next Dispatch'}
              </GlassButton>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
