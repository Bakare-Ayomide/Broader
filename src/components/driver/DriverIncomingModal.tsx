import React, { useState, useEffect } from 'react';
import { useBroaderStore } from '../../store/useBroaderStore';
import { Clock, MapPin, Star, ChevronRight, X, Check, Car, User, Navigation } from 'lucide-react';

export const DriverIncomingModal: React.FC = () => {
  const incomingDriverRequest = useBroaderStore((s) => s.incomingDriverRequest);
  const respondToDriverRequest = useBroaderStore((s) => s.respondToDriverRequest);

  const [timerSeconds, setTimerSeconds] = useState(15);

  // Synchronize timer with request
  useEffect(() => {
    if (!incomingDriverRequest) {
      setTimerSeconds(15);
      return;
    }

    setTimerSeconds(15);
    const timer = setInterval(() => {
      setTimerSeconds((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [incomingDriverRequest]);

  // Request auto-expires when timer hits 0
  useEffect(() => {
    if (incomingDriverRequest && timerSeconds === 0) {
      respondToDriverRequest(false);
    }
  }, [incomingDriverRequest, timerSeconds, respondToDriverRequest]);

  if (!incomingDriverRequest) return null;

  const estimatedFare = Math.round(incomingDriverRequest.estimatedEarnings / 0.85);

  return (
    <div className="glass-panel rounded-3xl p-4 shadow-2xl border border-blue-500/40 animate-in zoom-in-95 duration-200 space-y-3">
      {/* Top Header with Pulse & Countdown Timer */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#0286FF] animate-ping" />
          <h4 className="text-xs font-JakartaBold text-white uppercase tracking-wider">
            Incoming Ride Dispatch
          </h4>
        </div>

        {/* Circular Countdown Badge */}
        <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-500/20 text-[#0286FF] text-xs font-JakartaBold border border-blue-500/30 shadow-xs">
          <Clock className="w-3 h-3 animate-spin" style={{ animationDuration: '4s' }} />
          <span>{timerSeconds}s remaining</span>
        </div>
      </div>

      {/* Countdown Progress Bar */}
      <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
        <div
          className="bg-[#0286FF] h-full transition-all duration-1000 ease-linear rounded-full shadow-[0_0_8px_rgba(2,134,255,0.8)]"
          style={{ width: `${(timerSeconds / 15) * 100}%` }}
        />
      </div>

      {/* Net Earnings & Trip Specs Card */}
      <div className="flex items-center justify-between p-3 bg-blue-500/10 rounded-2xl border border-blue-500/25">
        <div>
          <span className="text-[10px] font-JakartaBold text-blue-400 uppercase tracking-wide">
            Est. Net Driver Earnings
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl font-JakartaBold text-white">
              ₦{incomingDriverRequest.estimatedEarnings.toLocaleString()}
            </span>
            <span className="text-[10px] text-neutral-400 font-JakartaMedium">
              (Fare ₦{estimatedFare.toLocaleString()})
            </span>
          </div>
        </div>
        <div className="text-right">
          <span className="text-xs font-JakartaBold text-white block">
            {incomingDriverRequest.distanceKm} km • ~{incomingDriverRequest.estimatedMinutes} mins
          </span>
          <span className="text-[10px] font-JakartaMedium text-blue-300 bg-blue-500/20 border border-blue-500/30 px-2 py-0.5 rounded-full inline-block mt-0.5 capitalize">
            {incomingDriverRequest.vehicleType}
          </span>
        </div>
      </div>

      {/* Passenger Info Bar */}
      <div className="flex items-center gap-2.5 px-1">
        <img
          src={
            incomingDriverRequest.customerImage ||
            'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80'
          }
          alt={incomingDriverRequest.customerName}
          className="w-9 h-9 rounded-full object-cover border border-white/20 shadow-xs"
        />
        <div className="min-w-0 flex-1">
          <p className="text-xs font-JakartaBold text-white truncate">
            {incomingDriverRequest.customerName}
          </p>
          <div className="flex items-center gap-1 text-[10px] text-amber-400 font-bold">
            <Star className="w-2.5 h-2.5 fill-amber-400" />
            <span>{incomingDriverRequest.customerRating || 4.9}</span>
            <span className="text-neutral-400 font-normal ml-1">• Lagos Passenger</span>
          </div>
        </div>
      </div>

      {/* Pickup & Dropoff Address Route */}
      <div className="space-y-2 p-3 bg-white/[0.04] rounded-2xl text-xs border border-white/[0.08]">
        <div className="flex items-start gap-2.5">
          <div className="w-2 h-2 rounded-full bg-[#0286FF] mt-1 shrink-0 shadow-[0_0_6px_rgba(2,134,255,0.8)]" />
          <div className="min-w-0 flex-1">
            <span className="text-[10px] text-neutral-400 font-JakartaMedium block">Pickup Location</span>
            <p className="font-JakartaMedium text-neutral-200 text-[11px] truncate">
              {incomingDriverRequest.pickup}
            </p>
          </div>
        </div>
        <div className="flex items-start gap-2.5 pt-1 border-t border-white/[0.06]">
          <div className="w-2 h-2 rounded-full bg-emerald-400 mt-1 shrink-0 shadow-[0_0_6px_rgba(52,211,153,0.8)]" />
          <div className="min-w-0 flex-1">
            <span className="text-[10px] text-neutral-400 font-JakartaMedium block">Dropoff Destination</span>
            <p className="font-JakartaMedium text-neutral-200 text-[11px] truncate">
              {incomingDriverRequest.destination}
            </p>
          </div>
        </div>
      </div>

      {/* Pickup Note / Instructions if present */}
      {incomingDriverRequest.pickupInstructions && (
        <div className="px-3 py-1.5 bg-amber-500/10 border border-amber-500/20 rounded-xl text-[11px] text-amber-200 font-JakartaMedium flex items-start gap-1.5">
          <span className="font-JakartaBold shrink-0 text-amber-300">Rider Note:</span>
          <span className="truncate">{incomingDriverRequest.pickupInstructions}</span>
        </div>
      )}

      {/* Action Buttons: Reject & Accept with Icon Buttons */}
      <div className="grid grid-cols-3 gap-2 pt-1">
        <button
          onClick={() => respondToDriverRequest(false)}
          className="py-3 rounded-2xl border border-white/15 hover:bg-white/5 active:scale-95 text-neutral-300 font-JakartaBold text-xs flex items-center justify-center gap-1.5 transition-all"
        >
          <X className="w-3.5 h-3.5 text-neutral-400" />
          <span>Decline</span>
        </button>

        <button
          onClick={() => respondToDriverRequest(true)}
          className="col-span-2 py-3 rounded-2xl bg-[#0286FF] hover:bg-blue-500 text-white font-JakartaBold text-xs shadow-[0_0_16px_rgba(2,134,255,0.4)] active:scale-95 transition-all flex items-center justify-center gap-1.5"
        >
          <Check className="w-4 h-4" />
          <span>Accept Trip</span>
          <ChevronRight className="w-3.5 h-3.5 ml-0.5 opacity-80" />
        </button>
      </div>
    </div>
  );
};
