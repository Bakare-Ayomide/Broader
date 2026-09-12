import React, { useState, useEffect } from 'react';
import {
  Gauge,
  X,
  ChevronDown,
  Fuel,
  Zap,
  AlertTriangle,
  CheckCircle2,
  Navigation,
  Activity,
  ShieldCheck,
  Flame,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { Speedometer } from './Speedometer';
import { soundEngine } from '../../services/soundNotification';

export interface FullScreenSpeedometerModalProps {
  isOpen: boolean;
  onClose: () => void;
  speed: number;
  speedLimit?: number;
  distanceKm?: number;
  etaMinutes?: number;
  currentInstruction?: string;
  streetName?: string;
  fuelLevel?: number;
  isDriverMode?: boolean;
  passengerName?: string;
  tripStatus?: string;
}

export const FullScreenSpeedometerModal: React.FC<FullScreenSpeedometerModalProps> = ({
  isOpen,
  onClose,
  speed: initialSpeed,
  speedLimit = 80,
  distanceKm = 2.4,
  etaMinutes = 7,
  currentInstruction = 'Continue straight onto Ozumba Mbadiwe Ave',
  streetName = 'Ozumba Mbadiwe Ave, Victoria Island',
  fuelLevel = 0.78,
  isDriverMode = false,
  passengerName = 'Adewale Adeleke',
  tripStatus = 'EN ROUTE',
}) => {
  // Allow user to test/simulate speed or use live speed
  const [testSpeed, setTestSpeed] = useState<number | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [unit, setUnit] = useState<'km/h' | 'mph'>('km/h');
  const [maxRecordedSpeed, setMaxRecordedSpeed] = useState(Math.max(initialSpeed, 78));

  // Current active speed (either live or test)
  const currentSpeed = testSpeed !== null ? testSpeed : initialSpeed;
  const isOverSpeed = currentSpeed > speedLimit;

  // Track max speed
  useEffect(() => {
    if (currentSpeed > maxRecordedSpeed) {
      setMaxRecordedSpeed(currentSpeed);
    }
  }, [currentSpeed, maxRecordedSpeed]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        soundEngine.playClick();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Converted speed if MPH
  const displayedValue = unit === 'mph' ? Math.round(currentSpeed * 0.621371) : Math.round(currentSpeed);
  const displayedLimit = unit === 'mph' ? Math.round(speedLimit * 0.621371) : speedLimit;

  // Calculated RPM based on speed and simulated gears
  const simulatedRpm = Math.min(6500, Math.round(900 + currentSpeed * 32));
  const simulatedGear =
    currentSpeed === 0 ? 'P' : currentSpeed < 20 ? 'D1' : currentSpeed < 45 ? 'D2' : currentSpeed < 75 ? 'D3' : currentSpeed < 105 ? 'D4' : 'D5';

  return (
    <div
      id="fullscreen-speedometer-dashboard"
      className="fixed inset-0 z-[100] flex flex-col text-white select-none overflow-y-auto"
      style={{ backgroundColor: '#000000', opacity: 1 }}
    >
      {/* 1. TOP HEADER NAVIGATION BAR */}
      <div className="shrink-0 w-full max-w-2xl mx-auto px-4 pt-4 pb-3 flex items-center justify-between border-b border-white/[0.08] bg-black">
        {/* Collapse / Close Button */}
        <button
          type="button"
          onClick={() => {
            soundEngine.playClick();
            onClose();
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.08] hover:bg-white/[0.15] border border-white/10 active:scale-95 transition-all text-xs font-JakartaBold text-neutral-300 hover:text-white"
          title="Collapse Dashboard (ESC)"
        >
          <ChevronDown className="w-4 h-4 text-[#9EE6B5]" />
          <span>Collapse</span>
        </button>

        {/* Center Telematics Title with GPS Pulse */}
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#9EE6B5] animate-ping" />
            <h2 className="text-xs sm:text-sm font-JakartaBold uppercase tracking-wider text-white">
              {isDriverMode ? 'Driver Cockpit Telematics' : 'Passenger Speedometer HUD'}
            </h2>
          </div>
          <span className="text-[10px] text-neutral-400 font-mono">GPS LOCK • 60Hz PRECISION</span>
        </div>

        {/* Right Controls: Unit Toggle & Close X */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              soundEngine.playClick();
              setUnit((u) => (u === 'km/h' ? 'mph' : 'km/h'));
            }}
            className="px-2 py-1 rounded-lg bg-white/[0.08] hover:bg-white/[0.15] border border-white/10 text-[10px] font-mono font-bold text-neutral-300 active:scale-95 transition-all"
            title="Toggle Speed Unit"
          >
            {unit.toUpperCase()}
          </button>

          <button
            type="button"
            onClick={() => {
              soundEngine.playClick();
              setIsMuted((m) => !m);
            }}
            className="w-8 h-8 rounded-full bg-white/[0.08] hover:bg-white/[0.15] border border-white/10 flex items-center justify-center text-neutral-300 active:scale-95 transition-all"
            title={isMuted ? 'Unmute Alerts' : 'Mute Speed Alerts'}
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-[#9EE6B5]" />}
          </button>

          <button
            type="button"
            onClick={() => {
              soundEngine.playClick();
              onClose();
            }}
            className="w-8 h-8 rounded-full bg-white/[0.08] hover:bg-red-500/20 border border-white/10 hover:border-red-500/40 flex items-center justify-center text-neutral-300 hover:text-red-400 active:scale-95 transition-all"
            title="Close Dashboard"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. SCROLLABLE DASHBOARD COCKPIT BODY */}
      <div className="flex-1 w-full max-w-2xl mx-auto px-4 py-4 flex flex-col items-center justify-start space-y-4">
        {/* Active Speed Limit Warning Banner */}
        <div
          className={`w-full p-2.5 px-4 rounded-2xl flex items-center justify-between border transition-all ${
            isOverSpeed
              ? 'bg-red-950/40 border-red-500/60 text-red-300 shadow-[0_0_20px_rgba(239,68,68,0.3)] animate-pulse'
              : 'bg-white/[0.04] border-white/[0.08] text-neutral-300'
          }`}
        >
          <div className="flex items-center gap-2.5">
            {isOverSpeed ? (
              <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
            ) : (
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            )}
            <div>
              <span className="text-xs font-JakartaBold block text-white">
                {isOverSpeed ? 'Speed Limit Exceeded!' : 'Safe Cruising Range'}
              </span>
              <span className="text-[10px] text-neutral-400">
                {isOverSpeed
                  ? `You are ${displayedValue - displayedLimit} ${unit} over the safe limit.`
                  : `Zone speed regulated by Lagos State Traffic Authority (LASTMA).`}
              </span>
            </div>
          </div>

          <div className="flex flex-col items-end shrink-0">
            <span className="text-[9px] font-JakartaSemiBold text-neutral-400 uppercase">Limit</span>
            <span className="text-xs font-mono font-extrabold text-amber-400 bg-amber-400/10 border border-amber-400/30 px-2 py-0.5 rounded-md">
              {displayedLimit} {unit}
            </span>
          </div>
        </div>

        {/* PRIMARY SPEEDOMETER GAUGE */}
        <div className="relative flex flex-col items-center justify-center p-4 rounded-3xl bg-black border border-white/[0.1] w-full shadow-2xl">
          {/* Main SVG Dial */}
          <Speedometer
            speed={currentSpeed}
            maxSpeed={200}
            speedLimit={speedLimit}
            size={250}
            showSubGauge={true}
            subGaugeLevel={fuelLevel}
          />

          {/* Large Digital Speed Readout */}
          <div className="flex flex-col items-center mt-2">
            <div className="flex items-baseline gap-1">
              <span
                className={`text-5xl sm:text-6xl font-black font-mono tracking-tight ${
                  isOverSpeed ? 'text-red-400' : 'text-white'
                }`}
              >
                {displayedValue}
              </span>
              <span className="text-sm sm:text-base font-JakartaBold text-neutral-400 uppercase">{unit}</span>
            </div>

            {/* Gear & RPM Indicators */}
            <div className="flex items-center gap-3 mt-1 text-xs">
              <span className="px-2 py-0.5 rounded bg-white/[0.08] font-mono font-bold text-[#9EE6B5]">
                GEAR: {simulatedGear}
              </span>
              <span className="text-neutral-400 font-mono">{simulatedRpm} RPM</span>
            </div>
          </div>

          {/* Quick Speed Simulator Presets */}
          <div className="w-full mt-4 pt-3 border-t border-white/[0.08] flex flex-wrap items-center justify-center gap-2">
            <span className="text-[10px] font-JakartaSemiBold text-neutral-400 mr-1 uppercase">Test Speed:</span>
            {[
              { label: 'Idle (0)', speed: 0 },
              { label: 'City (35)', speed: 35 },
              { label: 'Express (70)', speed: 70 },
              { label: 'Highway (95)', speed: 95 },
              { label: 'Live GPS', speed: null },
            ].map((preset) => (
              <button
                key={preset.label}
                type="button"
                onClick={() => {
                  soundEngine.playClick();
                  setTestSpeed(preset.speed);
                }}
                className={`px-2.5 py-1 rounded-full text-[11px] font-JakartaBold border transition-all active:scale-95 ${
                  (preset.speed === null && testSpeed === null) || testSpeed === preset.speed
                    ? 'bg-[#9EE6B5] text-black border-[#9EE6B5] shadow-[0_0_10px_rgba(158,230,181,0.4)]'
                    : 'bg-white/[0.05] border-white/10 text-neutral-300 hover:text-white hover:bg-white/10'
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        {/* 3. AUTOMOTIVE TELEMETRICS BENTO GRID */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 w-full">
          {/* Metric 1: Distance */}
          <div className="p-3 rounded-2xl bg-black border border-white/[0.1] flex flex-col justify-between">
            <div className="flex items-center justify-between text-neutral-400">
              <span className="text-[10px] font-JakartaBold uppercase">Remaining</span>
              <Navigation className="w-3.5 h-3.5 text-cyan-400" />
            </div>
            <div className="mt-2">
              <span className="text-xl font-mono font-black text-white">{distanceKm}</span>
              <span className="text-xs text-neutral-400 ml-1">km</span>
            </div>
            <span className="text-[10px] text-neutral-400 mt-1 font-JakartaMedium truncate">To Destination</span>
          </div>

          {/* Metric 2: ETA */}
          <div className="p-3 rounded-2xl bg-black border border-white/[0.1] flex flex-col justify-between">
            <div className="flex items-center justify-between text-neutral-400">
              <span className="text-[10px] font-JakartaBold uppercase">ETA</span>
              <Activity className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <div className="mt-2">
              <span className="text-xl font-mono font-black text-emerald-400">{etaMinutes}</span>
              <span className="text-xs text-neutral-400 ml-1">mins</span>
            </div>
            <span className="text-[10px] text-neutral-400 mt-1 font-JakartaMedium truncate">Live Traffic Sync</span>
          </div>

          {/* Metric 3: Max Speed */}
          <div className="p-3 rounded-2xl bg-black border border-white/[0.1] flex flex-col justify-between">
            <div className="flex items-center justify-between text-neutral-400">
              <span className="text-[10px] font-JakartaBold uppercase">Peak Speed</span>
              <Flame className="w-3.5 h-3.5 text-amber-400" />
            </div>
            <div className="mt-2">
              <span className="text-xl font-mono font-black text-white">
                {unit === 'mph' ? Math.round(maxRecordedSpeed * 0.621371) : Math.round(maxRecordedSpeed)}
              </span>
              <span className="text-xs text-neutral-400 ml-1">{unit}</span>
            </div>
            <span className="text-[10px] text-neutral-400 mt-1 font-JakartaMedium truncate">Session Record</span>
          </div>

          {/* Metric 4: Fuel / Energy */}
          <div className="p-3 rounded-2xl bg-black border border-white/[0.1] flex flex-col justify-between">
            <div className="flex items-center justify-between text-neutral-400">
              <span className="text-[10px] font-JakartaBold uppercase">Energy / Fuel</span>
              <Fuel className="w-3.5 h-3.5 text-green-400" />
            </div>
            <div className="mt-2">
              <span className="text-xl font-mono font-black text-white">{Math.round(fuelLevel * 100)}</span>
              <span className="text-xs text-neutral-400 ml-1">%</span>
            </div>
            <span className="text-[10px] text-neutral-400 mt-1 font-JakartaMedium truncate">Range ~340 km</span>
          </div>
        </div>

        {/* 4. CURRENT ROAD & ROUTE GUIDANCE CARD */}
        <div className="w-full p-3.5 rounded-2xl bg-black border border-white/[0.1] flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center shrink-0">
            <Navigation className="w-5 h-5 text-cyan-300" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-JakartaBold text-cyan-400 uppercase tracking-wide">
                Route Guidance
              </span>
              <span className="text-[9px] bg-white/10 px-1.5 py-0.2 rounded font-mono text-neutral-300">
                {tripStatus}
              </span>
            </div>
            <p className="text-xs sm:text-sm font-JakartaBold text-white truncate mt-0.5">{currentInstruction}</p>
            <p className="text-[11px] text-neutral-400 truncate">{streetName}</p>
          </div>
        </div>

        {/* 5. COLLAPSE & RETURN BUTTON */}
        <div className="w-full pt-2 pb-6">
          <button
            type="button"
            onClick={() => {
              soundEngine.playClick();
              onClose();
            }}
            className="w-full py-3.5 rounded-2xl bg-[#9EE6B5] hover:bg-[#8fd8a6] text-black font-extrabold font-JakartaBold text-sm flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(158,230,181,0.4)] active:scale-98 transition-all"
          >
            <ChevronDown className="w-4 h-4" />
            <span>Collapse & Return to Map</span>
          </button>
        </div>
      </div>
    </div>
  );
};
