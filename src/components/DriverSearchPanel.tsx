import React, { useEffect, useState } from 'react';
import { useBroaderStore } from '../store/useBroaderStore';
import { requestBackendDriverMatch } from '../services/backendService';
import { VehicleOption } from '../types';
import { getVehicle3DImage } from '../data/vehicleAssets';
import { Radar, X, Clock, MapPin, Zap } from 'lucide-react';

interface DriverSearchPanelProps {
  vehicle: VehicleOption;
  onDriverMatched: () => void;
  onCancelSearch: () => void;
}

export const DriverSearchPanel: React.FC<DriverSearchPanelProps> = ({
  vehicle,
  onDriverMatched,
  onCancelSearch,
}) => {
  const userLatitude = useBroaderStore((s) => s.userLatitude);
  const userLongitude = useBroaderStore((s) => s.userLongitude);
  const userAddress = useBroaderStore((s) => s.userAddress);
  const destinationLatitude = useBroaderStore((s) => s.destinationLatitude) || 6.5774;
  const destinationLongitude = useBroaderStore((s) => s.destinationLongitude) || 3.3212;
  const destinationAddress = useBroaderStore((s) => s.destinationAddress) || 'Murtala Muhammed Airport';
  const selectedPaymentMethod = useBroaderStore((s) => s.selectedPaymentMethod);
  const setActiveTrip = useBroaderStore((s) => s.setActiveTrip);
  const setRideStatus = useBroaderStore((s) => s.setRideStatus);

  const [secondsElapsed, setSecondsElapsed] = useState(0);

  // Timer counter for search duration
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsElapsed((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Automatic backend driver dispatch match after 4.5 seconds
  useEffect(() => {
    let isCancelled = false;
    const matchTimer = setTimeout(async () => {
      if (isCancelled) return;
      try {
        const activeTrip = await requestBackendDriverMatch(
          vehicle.category,
          {
            address: userAddress,
            latitude: userLatitude,
            longitude: userLongitude,
          },
          {
            address: destinationAddress,
            latitude: destinationLatitude,
            longitude: destinationLongitude,
          },
          vehicle,
          selectedPaymentMethod
        );
        if (!isCancelled) {
          setActiveTrip(activeTrip);
          setRideStatus('driver_arriving');
          onDriverMatched();
        }
      } catch (err) {
        console.error('Driver dispatch failed:', err);
      }
    }, 4500);

    return () => {
      isCancelled = true;
      clearTimeout(matchTimer);
    };
  }, []);

  const handleInstantMatch = async () => {
    try {
      const activeTrip = await requestBackendDriverMatch(
        vehicle.category,
        {
          address: userAddress,
          latitude: userLatitude,
          longitude: userLongitude,
        },
        {
          address: destinationAddress,
          latitude: destinationLatitude,
          longitude: destinationLongitude,
        },
        vehicle,
        selectedPaymentMethod
      );
      setActiveTrip(activeTrip);
      setRideStatus('driver_arriving');
      onDriverMatched();
    } catch (err) {
      console.error(err);
    }
  };

  const vehicle3DImg = getVehicle3DImage(vehicle.category, vehicle.name);

  return (
    <div className="flex flex-col glass-panel rounded-3xl p-5 shadow-2xl border border-white/[0.08] backdrop-blur-2xl text-white select-none animate-in fade-in slide-in-from-bottom-4 duration-300">
      {/* Header with Radar Icon & Status */}
      <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 rounded-full bg-[#9EE6B5]/10 border border-[#9EE6B5]/30 flex items-center justify-center text-[#9EE6B5]">
            <Radar className="w-5 h-5 animate-spin" style={{ animationDuration: '3s' }} />
            <span className="absolute top-0 right-0 w-2.5 h-2.5 rounded-full bg-[#9EE6B5] ring-2 ring-black animate-ping" />
          </div>
          <div>
            <h3 className="text-base font-JakartaBold text-white">Finding your ride</h3>
            <p className="text-xs font-JakartaMedium text-neutral-400">
              Connecting with nearby Broader drivers...
            </p>
          </div>
        </div>

        <button
          onClick={onCancelSearch}
          className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-neutral-300 hover:text-white transition-colors"
          title="Cancel search"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Search Radar Animation Card with 3D Image */}
      <div className="my-4 p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <div className="w-16 h-16 relative shrink-0 flex items-center justify-center">
            <div className="absolute bottom-1 w-12 h-2.5 bg-black/80 rounded-full blur-[2px] pointer-events-none" />
            <img
              src={vehicle3DImg}
              alt={vehicle.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-contain filter drop-shadow-[0_6px_12px_rgba(0,0,0,0.9)]"
            />
          </div>
          <div className="min-w-0 flex-1">
            <span className="text-[10px] font-JakartaBold uppercase tracking-wider text-[#9EE6B5]">
              Requested Vehicle
            </span>
            <p className="font-JakartaBold text-white text-sm truncate">{vehicle.name}</p>
            <p className="font-JakartaMedium text-neutral-400 text-xs">
              ₦{vehicle.price.toLocaleString()} • {selectedPaymentMethod.toUpperCase()}
            </p>
          </div>
        </div>

        {/* Route snippet */}
        <div className="flex items-start gap-2.5 text-xs pt-2 border-t border-white/[0.06]">
          <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <div className="min-w-0 flex-1">
            <span className="text-[10px] uppercase font-bold text-neutral-500">Pickup point</span>
            <p className="font-JakartaMedium text-neutral-200 truncate">{userAddress}</p>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs pt-1">
          <span className="text-neutral-400 flex items-center gap-1 font-JakartaMedium">
            <Clock className="w-3 h-3 text-neutral-400" />
            Searching: 00:{secondsElapsed.toString().padStart(2, '0')}
          </span>
          <span className="text-[11px] font-JakartaSemiBold text-[#9EE6B5]">
            Radius: ~3.5 km
          </span>
        </div>
      </div>

      {/* Progress Bar Animation */}
      <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden mb-4 border border-white/5">
        <div
          className="h-full bg-gradient-to-r from-[#9EE6B5] to-emerald-400 rounded-full transition-all duration-300 shadow-[0_0_10px_#9EE6B5]"
          style={{ width: `${Math.min(100, (secondsElapsed / 5) * 100)}%` }}
        />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2.5">
        <button
          type="button"
          onClick={onCancelSearch}
          className="flex-1 py-3 rounded-full border border-white/10 glass-panel hover:bg-white/10 text-neutral-300 font-JakartaBold text-xs transition-all text-center"
        >
          Cancel Request
        </button>

        <button
          type="button"
          onClick={handleInstantMatch}
          className="flex-1 py-3 rounded-full bg-[#9EE6B5] hover:bg-[#8fd8a6] text-black font-JakartaBold text-xs font-extrabold shadow-[0_0_18px_rgba(158,230,181,0.4)] transition-all text-center flex items-center justify-center gap-1.5"
        >
          <Zap className="w-3.5 h-3.5" />
          <span>Instant Match</span>
        </button>
      </div>
    </div>
  );
};
