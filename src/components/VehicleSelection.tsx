import React, { useEffect, useState } from 'react';
import { useBroaderStore } from '../store/useBroaderStore';
import { fetchBackendVehiclePricing } from '../services/backendService';
import { VehicleCategory, VehicleOption } from '../types';
import { getVehicle3DImage, BROADER_3D_FLEET, VehicleSpec } from '../data/vehicleAssets';
import {
  Clock,
  Check,
  Sparkles,
  Users,
  Briefcase,
  Gauge,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

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
  const [filterType, setFilterType] = useState<'all' | 'passenger' | 'cargo' | 'rapid'>('all');

  // Load prices
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
          const current = res.options.find((v) => v.category === selectedVehicle) || res.options[3];
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

  // Find currently selected vehicle spec
  const currentOption = vehicleOptions.find((v) => v.category === selectedVehicle) || vehicleOptions[3] || {
    id: 'car',
    name: 'Broader Sedan',
    category: 'car' as VehicleCategory,
    capacity: '4 seats',
    etaMinutes: 3,
    price: 2800,
    description: 'Comfortable air-conditioned executive ride',
  };

  const currentSpec = BROADER_3D_FLEET.find((s) => s.category === currentOption.category) || BROADER_3D_FLEET[0];
  const activeHeroImage = getVehicle3DImage(currentOption.category, currentOption.name);

  // Filter vehicles
  const filteredOptions = vehicleOptions.filter((v) => {
    if (filterType === 'passenger') {
      return ['car', 'suv', 'van', 'bus', 'taxi'].includes(v.category);
    }
    if (filterType === 'rapid') {
      return ['motorcycle', 'bicycle', 'tricycle'].includes(v.category);
    }
    if (filterType === 'cargo') {
      return ['pickup', 'lorry', 'ambulance', 'van'].includes(v.category);
    }
    return true;
  });

  return (
    <div className="flex flex-col w-full select-none">
      {/* 1. HERO 3D VEHICLE SPOTLIGHT VISUAL FOCUS */}
      <div className="relative w-full rounded-2xl bg-gradient-to-b from-white/[0.06] to-white/[0.02] border border-white/10 p-3.5 mb-3 backdrop-blur-2xl overflow-hidden shadow-2xl">
        {/* Soft radial ambient floor glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-28 bg-[#0286FF]/15 rounded-full blur-2xl pointer-events-none" />

        {/* Animated 3D Vehicle Render Showcase */}
        <div className="relative w-full h-32 flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentOption.category}
              initial={{ opacity: 0, scale: 0.88, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: -8 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="relative w-full h-full flex flex-col items-center justify-center"
            >
              {/* Ground contact shadow */}
              <div className="absolute bottom-1 w-44 h-5 bg-black/80 rounded-full blur-[4px] pointer-events-none" />

              {/* Transparent 3D Vehicle Image */}
              <img
                src={activeHeroImage}
                alt={currentOption.name}
                referrerPolicy="no-referrer"
                className="max-h-28 w-auto object-contain filter drop-shadow-[0_12px_24px_rgba(0,0,0,0.95)] pointer-events-none"
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Compact Hero Specifications Bar */}
        <div className="flex items-center justify-between pt-2 border-t border-white/10">
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="text-sm font-JakartaBold text-white tracking-tight">
                {currentOption.name}
              </h3>
              <span className="text-[9px] font-JakartaBold px-1.5 py-0.5 rounded-md bg-blue-500/15 border border-blue-500/30 text-blue-400">
                {currentSpec.tag}
              </span>
            </div>
            <div className="flex items-center gap-2.5 mt-0.5 text-[11px] font-JakartaMedium text-neutral-400">
              <span className="flex items-center gap-1">
                <Users className="w-3 h-3 text-neutral-400" />
                {currentOption.capacity || `${currentSpec.seats} seats`}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 text-emerald-400 font-JakartaBold">
                <Clock className="w-3 h-3" />
                {currentOption.etaMinutes || currentSpec.etaMinutes} min away
              </span>
            </div>
          </div>

          {/* Large Estimated Price */}
          <div className="text-right">
            <span className="text-[10px] text-neutral-400 font-JakartaMedium block">Estimated Fare</span>
            <span className="text-base font-JakartaExtraBold text-white tracking-tight text-[#0286FF]">
              ₦{currentOption.price.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* 2. CATEGORY FILTER TABS */}
      <div className="flex items-center gap-1 mb-2.5 bg-white/[0.04] p-1 rounded-xl border border-white/[0.08] backdrop-blur-xl">
        <button
          type="button"
          onClick={() => setFilterType('all')}
          className={`flex-1 py-1 rounded-lg text-[11px] font-JakartaSemiBold transition-all ${
            filterType === 'all'
              ? 'bg-white/10 text-white shadow-xs border border-white/20'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          All (11)
        </button>
        <button
          type="button"
          onClick={() => setFilterType('passenger')}
          className={`flex-1 py-1 rounded-lg text-[11px] font-JakartaSemiBold transition-all ${
            filterType === 'passenger'
              ? 'bg-white/10 text-white shadow-xs border border-white/20'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          Sedan & SUV
        </button>
        <button
          type="button"
          onClick={() => setFilterType('rapid')}
          className={`flex-1 py-1 rounded-lg text-[11px] font-JakartaSemiBold transition-all ${
            filterType === 'rapid'
              ? 'bg-white/10 text-white shadow-xs border border-white/20'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          Bike & Keke
        </button>
        <button
          type="button"
          onClick={() => setFilterType('cargo')}
          className={`flex-1 py-1 rounded-lg text-[11px] font-JakartaSemiBold transition-all ${
            filterType === 'cargo'
              ? 'bg-white/10 text-white shadow-xs border border-white/20'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          Cargo & Medic
        </button>
      </div>

      {/* 3. VISUAL VEHICLE LIST WITH TRANSPARENT 3D RENDERS */}
      <div className="space-y-1.5 max-h-[260px] overflow-y-auto pr-1">
        {loading && vehicleOptions.length === 0 ? (
          <div className="py-8 flex flex-col items-center justify-center text-neutral-400 gap-2">
            <div className="w-5 h-5 border-2 border-[#0286FF] border-t-transparent rounded-full animate-spin" />
            <span className="text-xs font-JakartaMedium">Updating live fleet availability...</span>
          </div>
        ) : (
          filteredOptions.map((opt) => {
            const isSelected = selectedVehicle === opt.category;
            const vehicle3DImg = getVehicle3DImage(opt.category, opt.name);
            const spec = BROADER_3D_FLEET.find((s) => s.category === opt.category) || BROADER_3D_FLEET[0];

            return (
              <div
                key={opt.id}
                onClick={() => handleSelect(opt)}
                className={`flex items-center justify-between p-2.5 rounded-2xl transition-all cursor-pointer backdrop-blur-xl group ${
                  isSelected
                    ? 'bg-[#0286FF]/10 border border-[#0286FF]/60 shadow-[0_0_20px_rgba(2,134,255,0.2)]'
                    : 'glass-panel glass-panel-hover border-white/[0.08]'
                }`}
              >
                {/* 3D Transparent Vehicle Icon */}
                <div className="relative w-14 h-11 shrink-0 flex items-center justify-center">
                  <div className="absolute -bottom-0.5 w-10 h-2 bg-black/60 rounded-full blur-[2px] pointer-events-none" />
                  <img
                    src={vehicle3DImg}
                    alt={opt.name}
                    referrerPolicy="no-referrer"
                    className={`w-full h-full object-contain transition-transform group-hover:scale-110 ${
                      isSelected ? 'scale-110 drop-shadow-[0_4px_10px_rgba(2,134,255,0.4)]' : ''
                    }`}
                  />
                </div>

                {/* Details */}
                <div className="flex-1 flex flex-col items-start justify-center mx-3 min-w-0">
                  <div className="flex items-center gap-1.5 w-full">
                    <span className="text-xs font-JakartaBold text-white truncate">
                      {opt.name}
                    </span>
                    {isSelected && (
                      <span className="w-3.5 h-3.5 rounded-full bg-[#0286FF] flex items-center justify-center text-white shrink-0 shadow-[0_0_8px_rgba(2,134,255,0.8)]">
                        <Check className="w-2 h-2 stroke-[3]" />
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5 mt-0.5 text-[10px] font-JakartaMedium text-neutral-400 truncate">
                    <span>{opt.capacity || `${spec.seats} seats`}</span>
                    <span>•</span>
                    <span className="text-emerald-400 font-JakartaSemiBold">
                      {opt.etaMinutes || spec.etaMinutes} min away
                    </span>
                  </div>
                </div>

                {/* Price */}
                <div className="flex flex-col items-end shrink-0 pl-1">
                  <span className={`text-xs font-JakartaBold ${isSelected ? 'text-[#0286FF]' : 'text-white'}`}>
                    ₦{opt.price.toLocaleString()}
                  </span>
                  <span className="text-[9px] font-JakartaMedium text-neutral-400">
                    Est.
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
