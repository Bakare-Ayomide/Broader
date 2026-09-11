import React, { useEffect } from 'react';
import { Car, ShieldCheck, Sparkles, Navigation, User } from 'lucide-react';
import { soundEngine } from '../services/soundNotification';

interface ModeSwitchSplashProps {
  targetMode: 'passenger' | 'driver';
  onComplete: () => void;
}

export const ModeSwitchSplash: React.FC<ModeSwitchSplashProps> = ({ targetMode, onComplete }) => {
  useEffect(() => {
    soundEngine.playSuccess();
    const timer = setTimeout(() => {
      onComplete();
    }, 1100);

    return () => clearTimeout(timer);
  }, [onComplete]);

  const isDriver = targetMode === 'driver';

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#020408]/95 backdrop-blur-3xl select-none animate-in fade-in duration-200">
      {/* Background Ambient Glow */}
      <div
        className={`absolute w-72 h-72 rounded-full blur-[90px] opacity-40 animate-pulse pointer-events-none ${
          isDriver ? 'bg-amber-500' : 'bg-[#9EE6B5]'
        }`}
      />

      {/* Main Animated Visual Ring & Icon */}
      <div className="relative flex items-center justify-center mb-6">
        <div
          className={`w-28 h-28 rounded-full border-2 flex items-center justify-center animate-spin duration-[4000ms] ${
            isDriver
              ? 'border-amber-500/40 border-t-amber-400'
              : 'border-[#9EE6B5]/40 border-t-[#9EE6B5]'
          }`}
        />
        <div
          className={`absolute w-20 h-20 rounded-full flex items-center justify-center shadow-2xl backdrop-blur-xl border ${
            isDriver
              ? 'bg-amber-500/15 border-amber-500/50 text-amber-400 shadow-[0_0_35px_rgba(245,158,11,0.5)]'
              : 'bg-[#9EE6B5]/15 border-[#9EE6B5]/50 text-[#9EE6B5] shadow-[0_0_35px_rgba(158,230,181,0.5)]'
          }`}
        >
          {isDriver ? (
            <Car className="w-10 h-10 stroke-[2.2] animate-bounce" />
          ) : (
            <User className="w-10 h-10 stroke-[2.2] animate-bounce" />
          )}
        </div>
      </div>

      {/* Mode Title & Badge */}
      <div className="text-center space-y-2 relative z-10 px-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[11px] font-JakartaBold uppercase tracking-widest backdrop-blur-md bg-white/[0.04] border-white/15">
          <Sparkles
            className={`w-3.5 h-3.5 ${isDriver ? 'text-amber-400' : 'text-[#9EE6B5]'}`}
          />
          <span className={isDriver ? 'text-amber-300' : 'text-[#9EE6B5]'}>
            Mode Activated
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-JakartaExtraBold tracking-wider uppercase text-white drop-shadow-lg">
          {isDriver ? 'DRIVER MODE' : 'PASSENGER MODE'}
        </h1>

        <p className="text-xs sm:text-sm font-JakartaMedium text-neutral-300 max-w-xs mx-auto">
          {isDriver
            ? 'Accessing driver command center, live radar dispatches, and telematics.'
            : 'Switching to passenger ride booking, 3D fleet selection, and route planner.'}
        </p>
      </div>

      {/* Smooth Loading Indicator Dots */}
      <div className="mt-8 flex items-center gap-2">
        <span
          className={`w-2 h-2 rounded-full animate-ping ${
            isDriver ? 'bg-amber-400' : 'bg-[#9EE6B5]'
          }`}
        />
        <span
          className={`w-2 h-2 rounded-full animate-ping delay-100 ${
            isDriver ? 'bg-amber-400' : 'bg-[#9EE6B5]'
          }`}
        />
        <span
          className={`w-2 h-2 rounded-full animate-ping delay-200 ${
            isDriver ? 'bg-amber-400' : 'bg-[#9EE6B5]'
          }`}
        />
      </div>
    </div>
  );
};
