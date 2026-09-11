import React, { useState } from 'react';
import { useBroaderStore } from '../../store/useBroaderStore';
import { LiveRideTelemetry } from '../../services/useLiveRideTracking';
import {
  Navigation,
  Compass,
  Clock,
  MapPin,
  Shield,
  Phone,
  MessageSquare,
  AlertTriangle,
  ChevronUp,
  ChevronDown,
  Gauge,
  Radio,
  Star,
  CheckCircle2,
} from 'lucide-react';
import { soundEngine } from '../../services/soundNotification';
import { CancelRideModal } from '../modals/CancelRideModal';

interface LiveRideNavigationHUDProps {
  telemetry: LiveRideTelemetry;
  onOpenChat: () => void;
  onOpenCall?: () => void;
  onOpenSafety?: () => void;
  onCancelTrip: () => void;
  isDriver?: boolean;
}

export const LiveRideNavigationHUD: React.FC<LiveRideNavigationHUDProps> = ({
  telemetry,
  onOpenChat,
  onOpenCall,
  onOpenSafety,
  onCancelTrip,
  isDriver = false,
}) => {
  const activeTrip = useBroaderStore((s) => s.activeTrip);
  const rideStatus = useBroaderStore((s) => s.rideStatus);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [isDetailsExpanded, setIsDetailsExpanded] = useState(false);

  if (!activeTrip) return null;

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getHeadingDirection = (deg: number) => {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const index = Math.round(((deg % 360) + 360) % 360 / 45) % 8;
    return `${directions[index]} ${Math.round(deg)}°`;
  };

  return (
    <>
      {/* ===================================================================== */}
      {/* 1. TOP FLOATING NAVIGATION HUD (TURN-BY-TURN & VEHICLE SPEED) */}
      {/* ===================================================================== */}
      <div className="fixed top-16 inset-x-0 z-40 px-3 sm:px-6 pointer-events-none max-w-xl mx-auto">
        <div className="pointer-events-auto bg-[#0c1420]/95 backdrop-blur-2xl rounded-2xl border border-white/15 p-3 sm:p-3.5 shadow-[0_16px_36px_rgba(0,0,0,0.85)] animate-in slide-in-from-top-3 duration-300">
          <div className="flex items-center justify-between gap-3">
            {/* Turn Icon & Instruction */}
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <div className="w-10 h-10 rounded-xl bg-[#9EE6B5]/15 text-[#9EE6B5] border border-[#9EE6B5]/30 flex items-center justify-center shrink-0 shadow-[0_0_12px_rgba(158,230,181,0.3)]">
                <Navigation
                  className="w-5 h-5 stroke-[2.5]"
                  style={{ transform: `rotate(${telemetry.heading}deg)` }}
                />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-JakartaBold uppercase tracking-wider text-[#9EE6B5]">
                    {telemetry.streetName || 'Lekki-Epe Expressway'}
                  </span>
                  <span
                    className={`text-[9px] font-JakartaBold px-1.5 py-0.2 rounded-full border ${
                      telemetry.isRealGps
                        ? 'bg-blue-500/15 text-blue-400 border-blue-500/30'
                        : 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                    }`}
                  >
                    {telemetry.isRealGps ? 'REAL GPS' : 'LIVE GRID'}
                  </span>
                </div>
                <h3 className="text-xs sm:text-sm font-JakartaBold text-white truncate">
                  {telemetry.turnInstruction || 'Continue straight along the expressway'}
                </h3>
              </div>
            </div>

            {/* Live Speed & Movement Status Indicator */}
            <div className="text-right shrink-0 pl-2 border-l border-white/[0.08]">
              <div className="flex items-baseline justify-end gap-1">
                <span className="text-xl sm:text-2xl font-JakartaExtraBold text-white tracking-tight font-mono">
                  {telemetry.speed}
                </span>
                <span className="text-[10px] font-JakartaBold text-neutral-400">km/h</span>
              </div>
              <div className="flex items-center justify-end gap-1 mt-0.5">
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    telemetry.isStopped
                      ? 'bg-amber-400 shadow-[0_0_6px_#fbbf24]'
                      : 'bg-[#9EE6B5] animate-ping shadow-[0_0_6px_#9EE6B5]'
                  }`}
                />
                <span
                  className={`text-[9px] font-JakartaBold uppercase ${
                    telemetry.isStopped ? 'text-amber-400' : 'text-[#9EE6B5]'
                  }`}
                >
                  {telemetry.isStopped ? 'STOPPED' : 'MOVING'}
                </span>
              </div>
            </div>
          </div>

          {/* Linear Route Progress Indicator */}
          <div className="mt-2.5 pt-2 border-t border-white/[0.06] flex items-center gap-2">
            <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#9EE6B5] to-emerald-400 rounded-full transition-all duration-700"
                style={{ width: `${telemetry.routeProgressPercent}%` }}
              />
            </div>
            <span className="text-[10px] font-mono font-JakartaBold text-neutral-400 shrink-0">
              {telemetry.routeProgressPercent}%
            </span>
          </div>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* 2. FLOATING TELEMETRY RIBBON (ELAPSED TIME, REMAINING, DISTANCE) */}
      {/* ===================================================================== */}
      <div className="fixed top-[152px] inset-x-0 z-40 px-3 sm:px-6 pointer-events-none max-w-xl mx-auto">
        <div className="pointer-events-auto bg-[#0c1420]/90 backdrop-blur-xl rounded-xl border border-white/10 py-1.5 px-3 flex items-center justify-between text-[11px] shadow-lg font-JakartaMedium">
          {/* Elapsed Time */}
          <div className="flex items-center gap-1.5 text-neutral-300">
            <Clock className="w-3.5 h-3.5 text-[#9EE6B5]" />
            <span className="text-neutral-400">Elapsed:</span>
            <span className="font-JakartaBold text-white font-mono">
              {formatTime(telemetry.elapsedSeconds)}
            </span>
          </div>

          <div className="h-3 w-px bg-white/15" />

          {/* Remaining ETA */}
          <div className="flex items-center gap-1.5 text-neutral-300">
            <span className="text-neutral-400">ETA:</span>
            <span className="font-JakartaBold text-[#9EE6B5] font-mono">
              {telemetry.remainingMinutes} mins
            </span>
          </div>

          <div className="h-3 w-px bg-white/15" />

          {/* Distance Travelled / Remaining */}
          <div className="flex items-center gap-1.5 text-neutral-300">
            <MapPin className="w-3.5 h-3.5 text-cyan-400" />
            <span className="font-JakartaBold text-white font-mono">
              {telemetry.distanceTravelledKm} km
            </span>
            <span className="text-neutral-500">/</span>
            <span className="font-JakartaBold text-neutral-400 font-mono">
              {telemetry.distanceRemainingKm} km left
            </span>
          </div>

          <div className="h-3 w-px bg-white/15 hidden sm:block" />

          {/* Compass Heading */}
          <div className="hidden sm:flex items-center gap-1 text-neutral-400 font-mono text-[10px]">
            <Compass className="w-3 h-3 text-amber-400" />
            <span>{getHeadingDirection(telemetry.heading)}</span>
          </div>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* 3. BOTTOM FLOATING ACTION CARD (DRIVER/PASSENGER INFO & QUICK ACTIONS) */}
      {/* ===================================================================== */}
      <div className="fixed bottom-[74px] inset-x-0 z-40 px-3 sm:px-6 pointer-events-none max-w-xl mx-auto">
        <div className="pointer-events-auto bg-[#0c1420]/95 backdrop-blur-2xl rounded-3xl border border-white/15 p-4 shadow-[0_20px_50px_rgba(0,0,0,0.95)] space-y-3 animate-in slide-in-from-bottom-4 duration-300">
          {/* Driver Snapshot Info */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <img
                  src={
                    activeTrip.driver.profile_image_url ||
                    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=160&auto=format&fit=crop&q=80'
                  }
                  alt={activeTrip.driver.first_name}
                  referrerPolicy="no-referrer"
                  className="w-12 h-12 rounded-2xl object-cover ring-2 ring-[#9EE6B5]/40"
                />
                <div className="absolute -bottom-1 -right-1 bg-[#9EE6B5] text-[#020408] rounded-full p-0.5 shadow-md">
                  <Star className="w-2.5 h-2.5 fill-black" />
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-JakartaBold text-white">
                    {activeTrip.driver.first_name} {activeTrip.driver.last_name}
                  </h4>
                  <span className="text-[10px] font-JakartaBold text-amber-400 bg-amber-400/10 px-1.5 py-0.5 rounded">
                    ★ {activeTrip.driver.rating || 4.9}
                  </span>
                </div>
                <p className="text-xs font-JakartaMedium text-neutral-400">
                  {activeTrip.driver.car_model || 'Toyota Camry'} •{' '}
                  <span className="text-[#9EE6B5] font-JakartaBold">
                    {activeTrip.driver.plate_number || 'EKY-428-AB'}
                  </span>
                </p>
              </div>
            </div>

            {/* Safety Ride PIN Badge */}
            <div className="text-right">
              <span className="text-[10px] font-JakartaBold text-neutral-400 uppercase tracking-wider block">
                Safety PIN
              </span>
              <span className="text-sm font-JakartaExtraBold text-[#9EE6B5] tracking-widest font-mono bg-[#9EE6B5]/10 px-2.5 py-1 rounded-xl border border-[#9EE6B5]/30 inline-block">
                {activeTrip.ridePin || '4921'}
              </span>
            </div>
          </div>

          {/* Interactive Floating Quick Actions (Call, Chat, Safety SOS, Cancel) */}
          <div className="grid grid-cols-4 gap-2 pt-1">
            {/* Call Driver */}
            <button
              onClick={() => {
                soundEngine.playClick();
                if (onOpenCall) onOpenCall();
                else window.location.href = 'tel:+2348012345678';
              }}
              className="py-2 px-1 rounded-xl bg-[#131b26]/90 hover:bg-[#182333] border border-white/[0.08] hover:border-white/20 flex flex-col items-center justify-center text-neutral-300 hover:text-white transition-all active:scale-95"
            >
              <Phone className="w-4 h-4 text-emerald-400 mb-1" />
              <span className="text-[10px] font-JakartaBold">Call</span>
            </button>

            {/* Chat Driver */}
            <button
              onClick={() => {
                soundEngine.playClick();
                onOpenChat();
              }}
              className="py-2 px-1 rounded-xl bg-[#131b26]/90 hover:bg-[#182333] border border-white/[0.08] hover:border-white/20 flex flex-col items-center justify-center text-neutral-300 hover:text-white transition-all active:scale-95"
            >
              <MessageSquare className="w-4 h-4 text-cyan-400 mb-1" />
              <span className="text-[10px] font-JakartaBold">Message</span>
            </button>

            {/* Emergency SOS Modal Trigger */}
            <button
              onClick={() => {
                soundEngine.playClick();
                if (onOpenSafety) onOpenSafety();
              }}
              className="py-2 px-1 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 flex flex-col items-center justify-center text-red-400 transition-all active:scale-95"
            >
              <Shield className="w-4 h-4 text-red-400 mb-1" />
              <span className="text-[10px] font-JakartaBold">Safety SOS</span>
            </button>

            {/* Cancel Trip Dialog Modal Trigger */}
            <button
              onClick={() => {
                soundEngine.playClick();
                setShowCancelModal(true);
              }}
              className="py-2 px-1 rounded-xl bg-white/[0.04] hover:bg-red-500/15 border border-white/10 hover:border-red-500/30 flex flex-col items-center justify-center text-neutral-400 hover:text-red-400 transition-all active:scale-95"
            >
              <AlertTriangle className="w-4 h-4 mb-1" />
              <span className="text-[10px] font-JakartaBold">Cancel</span>
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation Modal for Canceling Active Ride */}
      <CancelRideModal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        onConfirmCancel={(reason) => {
          setShowCancelModal(false);
          onCancelTrip();
        }}
        driverName={activeTrip.driver.first_name}
      />
    </>
  );
};
