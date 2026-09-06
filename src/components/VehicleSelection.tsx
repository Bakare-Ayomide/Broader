import React, { useEffect, useState } from 'react';
import { useBroaderStore } from '../store/useBroaderStore';
import { fetchBackendVehiclePricing } from '../services/backendService';
import { VehicleCategory, VehicleOption } from '../types';
import {
  Bike,
  Car,
  Truck,
  Users,
  ShieldCheck,
  Bus,
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

  const getVehicleIcon = (cat: VehicleCategory) => {
    const iconClass = 'w-5 h-5 text-slate-700';
    switch (cat) {
      case 'bicycle':
      case 'motorcycle':
        return <Bike className={iconClass} />;
      case 'tricycle':
        return <Car className={iconClass} />;
      case 'car':
        return <Car className={iconClass} />;
      case 'suv':
        return <ShieldCheck className={iconClass} />;
      case 'van':
        return <Users className={iconClass} />;
      case 'bus':
        return <Bus className={iconClass} />;
      case 'pickup':
      case 'lorry':
        return <Truck className={iconClass} />;
      default:
        return <Car className={iconClass} />;
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
      {/* Category filter tabs */}
      <div className="flex items-center gap-1.5 mb-3 bg-[#F6F8FA] p-1 rounded-xl border border-slate-200/80">
        <button
          type="button"
          onClick={() => setFilterType('all')}
          className={`flex-1 py-1.5 rounded-lg text-xs font-JakartaSemiBold transition-all ${
            filterType === 'all'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          All Vehicles (9)
        </button>
        <button
          type="button"
          onClick={() => setFilterType('passenger')}
          className={`flex-1 py-1.5 rounded-lg text-xs font-JakartaSemiBold transition-all ${
            filterType === 'passenger'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          Rides & Transit
        </button>
        <button
          type="button"
          onClick={() => setFilterType('cargo')}
          className={`flex-1 py-1.5 rounded-lg text-xs font-JakartaSemiBold transition-all ${
            filterType === 'cargo'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          Logistics / Cargo
        </button>
      </div>

      {/* Vehicles list */}
      <div className="space-y-2 max-h-[290px] overflow-y-auto pr-1">
        {loading && vehicleOptions.length === 0 ? (
          <div className="py-8 flex flex-col items-center justify-center text-slate-400 gap-2">
            <div className="w-5 h-5 border-2 border-[#0286FF] border-t-transparent rounded-full animate-spin" />
            <span className="text-xs font-JakartaMedium">Calculating Broader live fares...</span>
          </div>
        ) : (
          filteredOptions.map((opt) => {
            const isSelected = selectedVehicle === opt.category;
            return (
              <div
                key={opt.id}
                onClick={() => handleSelect(opt)}
                className={`flex items-center justify-between p-3 rounded-2xl transition-all cursor-pointer border ${
                  isSelected
                    ? 'bg-[#E6F3FF] border-[#0286FF] ring-1 ring-[#0286FF] shadow-xs'
                    : 'bg-white border-neutral-200 hover:border-slate-300'
                }`}
              >
                {/* Left Icon Thumbnail */}
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border ${
                    isSelected
                      ? 'bg-white border-blue-200 text-[#0286FF]'
                      : 'bg-slate-50 border-slate-200 text-slate-600'
                  }`}
                >
                  {getVehicleIcon(opt.category)}
                </div>

                {/* Details */}
                <div className="flex-1 flex flex-col items-start justify-center mx-3 min-w-0">
                  <div className="flex items-center gap-1.5 w-full">
                    <span className="text-sm font-JakartaBold text-slate-900 truncate">
                      {opt.name}
                    </span>
                    {isSelected && (
                      <span className="w-4 h-4 rounded-full bg-[#0286FF] flex items-center justify-center text-white shrink-0">
                        <Check className="w-2.5 h-2.5" />
                      </span>
                    )}
                  </div>

                  <p className="text-[11px] font-JakartaMedium text-slate-500 truncate w-full">
                    {opt.capacity} • {opt.description}
                  </p>

                  <div className="flex items-center gap-2 mt-0.5 text-[11px] font-JakartaMedium text-slate-500">
                    <span className="flex items-center gap-0.5 text-slate-600">
                      <Clock className="w-3 h-3 text-slate-400" />
                      {opt.etaMinutes} mins away
                    </span>
                  </div>
                </div>

                {/* Price */}
                <div className="flex flex-col items-end shrink-0 pl-1">
                  <span className="text-sm font-JakartaBold text-slate-900">
                    ₦{opt.price.toLocaleString()}
                  </span>
                  <span className="text-[10px] font-JakartaMedium text-slate-400">
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
