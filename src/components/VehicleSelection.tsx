import React, { useEffect, useState } from 'react';
import { useBroaderStore } from '../store/useBroaderStore';
import { fetchBackendVehiclePricing } from '../services/backendService';
import { VehicleCategory, VehicleOption } from '../types';
import { getVehicle3DImage } from '../data/vehicleAssets';
import {
  Clock,
  Check,
  Sparkles,
} from 'lucide-react';

interface VehicleSelectionProps {
  onSelectVehicle?: (vehicle: VehicleOption) => void;
}

export const VehicleSelection: React.FC<VehicleSelectionProps> = ({ onSelectVehicle }) => {
  const userLatitude = useBroaderStore((s) => s.userLatitude);
  const userLongitude = useBroaderStore((s) => s.userLongitude);
  const destinationLatitude = useBroaderStore((s) => s.destinationLatitude) || 6.5774;
  const destinationLongitude = useBroaderStore((s) => s.destinationLongitude) || 3.3212;

  const selectedVehicle = useBroaderStore((s) => s.selectedVehicle);
  const setSelectedVehicle = useBroaderStore((s) => s.setSelectedVehicle);
  const vehicleOptions = useBroaderStore((s) => s.vehicleOptions);
  const setVehicleOptions = useBroaderStore((s) => s.setVehicleOptions);

  const [loading, setLoading] = useState(false);
  const [filterType, setFilterType] = useState<'all' | 'passenger' | 'cargo'>('all');

  // Fetch real dynamic pricing from backend service
  useEffect(() => {
    let isMounted = true;
    const loadPrices = async () => {
      setLoading(true);
      try {
        const res = await fetchBackendVehiclePricing(
          userLatitude,
          userLongitude,
          destinationLatitude,
          destinationLongitude
        );
        if (isMounted) {
          setVehicleOptions(res.options);
          // If onSelectVehicle passed, notify initial selection
          const current = res.options.find((v) => v.id === selectedVehicle) || res.options[3]; // default car
          if (onSelectVehicle && current) {
            onSelectVehicle(current);
          }
        }
      } catch (err) {
        console.error('Failed to load backend vehicle pricing:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadPrices();
    return () => {
      isMounted = false;
    };
  }, [userLatitude, userLongitude, destinationLatitude, destinationLongitude]);

  const handleSelect = (option: VehicleOption) => {
    setSelectedVehicle(option.category);
    if (onSelectVehicle) {
      onSelectVehicle(option);
    }
  };

  const filteredOptions = vehicleOptions.filter((v) => {
    if (filterType === 'passenger') {
      return ['bicycle', 'motorcycle', 'tricycle', 'car', 'suv', 'van', 'bus'].includes(v.category);
    }
    if (filterType === 'cargo') {
      return ['bicycle', 'motorcycle', 'pickup', 'lorry', 'van'].includes(v.category);
    }
    return true;
  });

  return (
    <div className="flex flex-col w-full select-none">
      {/* Category filter tabs with frosted glass */}
      <div className="flex items-center gap-1.5 mb-3 bg-white/[0.04] p-1 rounded-xl border border-white/[0.08] backdrop-blur-xl">
        <button
          type="button"
          onClick={() => setFilterType('all')}
          className={`flex-1 py-1.5 rounded-lg text-xs font-JakartaSemiBold transition-all ${
            filterType === 'all'
              ? 'bg-white/10 text-white shadow-xs border border-white/20'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          All Vehicles (9)
        </button>
        <button
          type="button"
          onClick={() => setFilterType('passenger')}
          className={`flex-1 py-1.5 rounded-lg text-xs font-JakartaSemiBold transition-all ${
            filterType === 'passenger'
              ? 'bg-white/10 text-white shadow-xs border border-white/20'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          Rides & Transit
        </button>
        <button
          type="button"
          onClick={() => setFilterType('cargo')}
          className={`flex-1 py-1.5 rounded-lg text-xs font-JakartaSemiBold transition-all ${
            filterType === 'cargo'
              ? 'bg-white/10 text-white shadow-xs border border-white/20'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          Logistics / Cargo
        </button>
      </div>

      {/* Vehicles list with frosted glass cards & lifelike 3D vehicle images */}
      <div className="space-y-2 max-h-[310px] overflow-y-auto pr-1">
        {loading && vehicleOptions.length === 0 ? (
          <div className="py-8 flex flex-col items-center justify-center text-neutral-400 gap-2">
            <div className="w-5 h-5 border-2 border-[#0286FF] border-t-transparent rounded-full animate-spin" />
            <span className="text-xs font-JakartaMedium">Calculating Broader live fares...</span>
          </div>
        ) : (
          filteredOptions.map((opt) => {
            const isSelected = selectedVehicle === opt.category;
            const vehicle3DImg = getVehicle3DImage(opt.category, opt.name);

            return (
              <div
                key={opt.id}
                onClick={() => handleSelect(opt)}
                className={`flex items-center justify-between p-3 rounded-2xl transition-all cursor-pointer backdrop-blur-xl ${
                  isSelected
                    ? 'glass-panel-selected'
                    : 'glass-panel glass-panel-hover'
                }`}
              >
                {/* Left Lifelike 3D Vehicle Render */}
                <div
                  className={`w-14 h-14 rounded-xl overflow-hidden shrink-0 border relative bg-black/60 flex items-center justify-center ${
                    isSelected
                      ? 'border-[#0286FF]/60 shadow-[0_0_12px_rgba(2,134,255,0.3)]'
                      : 'border-white/10'
                  }`}
                >
                  <img
                    src={vehicle3DImg}
                    alt={opt.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
                </div>

                {/* Details */}
                <div className="flex-1 flex flex-col items-start justify-center mx-3 min-w-0">
                  <div className="flex items-center gap-1.5 w-full">
                    <span className="text-sm font-JakartaBold text-white truncate">
                      {opt.name}
                    </span>
                    {isSelected && (
                      <span className="w-4 h-4 rounded-full bg-[#0286FF] flex items-center justify-center text-white shrink-0 shadow-[0_0_8px_rgba(2,134,255,0.8)]">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </span>
                    )}
                  </div>

                  <p className="text-[11px] font-JakartaMedium text-neutral-400 truncate w-full">
                    {opt.capacity} • {opt.description}
                  </p>

                  <div className="flex items-center gap-2 mt-0.5 text-[11px] font-JakartaMedium text-neutral-400">
                    <span className="flex items-center gap-1 text-neutral-300">
                      <Clock className="w-3 h-3 text-[#0286FF]" />
                      {opt.etaMinutes} mins away
                    </span>
                  </div>
                </div>

                {/* Price */}
                <div className="flex flex-col items-end shrink-0 pl-1">
                  <span className="text-sm font-JakartaBold text-white">
                    ₦{opt.price.toLocaleString()}
                  </span>
                  <span className="text-[10px] font-JakartaMedium text-neutral-400">
                    Estimated
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
