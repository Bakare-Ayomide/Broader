import React, { useEffect, useState } from 'react';
import { useBroaderStore } from '../store/useBroaderStore';
import { requestBackendDriverMatch } from '../services/backendService';
import { VehicleOption } from '../types';
import { Radar, X, Car, Clock, ShieldCheck, MapPin } from 'lucide-react';

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

  return (
    <div className="flex flex-col bg-white rounded-3xl p-5 shadow-xl border border-slate-200 select-none animate-in fade-in slide-in-from-bottom-4 duration-300">
      {/* Header with Radar Icon & Status */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center text-[#0286FF]">
            <Radar className="w-5 h-5 animate-spin" style={{ animationDuration: '3s' }} />
            <span className="absolute top-0 right-0 w-2.5 h-2.5 rounded-full bg-[#0286FF] ring-2 ring-white animate-ping" />
          </div>
          <div>
            <h3 className="text-base font-JakartaBold text-slate-900">Finding your ride</h3>
            <p className="text-xs font-JakartaMedium text-slate-500">
              Connecting with nearby Broader drivers...
            </p>
          </div>
        </div>

        <button
          onClick={onCancelSearch}
          className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors"
          title="Cancel search"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Search Radar Animation Card */}
      <div className="my-4 p-4 rounded-2xl bg-[#F6F8FA] border border-slate-200/80 flex flex-col gap-3">
        {/* Route snippet */}
        <div className="flex items-start gap-2.5 text-xs">
          <MapPin className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <div className="min-w-0 flex-1">
            <span className="text-[10px] uppercase font-bold text-slate-400">Pickup point</span>
            <p className="font-JakartaMedium text-slate-800 truncate">{userAddress}</p>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 text-xs">
          <span className="text-slate-500 font-JakartaMedium">Requested Vehicle</span>
          <span className="font-JakartaBold text-slate-800 flex items-center gap-1.5">
            <Car className="w-3.5 h-3.5 text-[#0286FF]" />
            {vehicle.name}
          </span>
        </div>

        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-500 font-JakartaMedium">Fare Estimate</span>
          <span className="font-JakartaBold text-slate-900">
            ₦{vehicle.price.toLocaleString()} ({selectedPaymentMethod.toUpperCase()})
          </span>
        </div>

        <div className="flex items-center justify-between text-xs pt-1">
          <span className="text-slate-400 flex items-center gap-1">
            <Clock className="w-3 h-3 text-slate-400" />
            Searching: 00:{secondsElapsed.toString().padStart(2, '0')}
          </span>
          <span className="text-[11px] font-JakartaSemiBold text-blue-600">
            Radius: ~3.5 km
          </span>
        </div>
      </div>

      {/* Progress Bar Animation */}
      <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mb-4">
        <div
          className="h-full bg-[#0286FF] rounded-full transition-all duration-300"
          style={{ width: `${Math.min(100, (secondsElapsed / 5) * 100)}%` }}
        />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2.5">
        <button
          type="button"
          onClick={onCancelSearch}
          className="flex-1 py-3 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-JakartaBold text-xs transition-all text-center"
        >
          Cancel Request
        </button>

        <button
          type="button"
          onClick={handleInstantMatch}
          className="flex-1 py-3 rounded-full bg-[#0286FF] hover:bg-blue-600 text-white font-JakartaBold text-xs shadow-md shadow-blue-500/20 transition-all text-center"
        >
          Instant Match
        </button>
      </div>
    </div>
  );
};
