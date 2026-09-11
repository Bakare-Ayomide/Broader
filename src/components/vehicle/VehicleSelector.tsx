import React, { useState } from 'react';
import { VehicleCategory, VehicleOption } from '../../types';
import { VehicleCard } from './VehicleCard';
import { VehiclePreview } from './VehiclePreview';
import { BROADER_3D_FLEET } from '../../data/vehicleAssets';

export interface VehicleSelectorProps {
  vehicles: VehicleOption[];
  selectedCategory: VehicleCategory;
  onSelect: (category: VehicleCategory) => void;
  className?: string;
  showSpotlight?: boolean;
}

export const VehicleSelector: React.FC<VehicleSelectorProps> = ({
  vehicles,
  selectedCategory,
  onSelect,
  className = '',
  showSpotlight = true,
}) => {
  const [filter, setFilter] = useState<'all' | 'passenger' | 'rapid' | 'cargo'>('all');

  const filteredVehicles = vehicles.filter((v) => {
    if (filter === 'passenger')
      return ['car', 'van', 'bus'].includes(v.category);
    if (filter === 'rapid')
      return ['deliveryBike', 'bicycle', 'tricycle', 'motorcycle', 'dispatch'].includes(v.category);
    if (filter === 'cargo')
      return ['lorry', 'ambulance', 'pickup', 'freight'].includes(v.category);
    return true;
  });

  return (
    <div className={`flex flex-col gap-3 select-none ${className}`}>
      {/* 3D Hero Spotlight Preview for Selected Vehicle */}
      {showSpotlight && (
        <div className="p-3.5 rounded-3xl bg-black/60 backdrop-blur-xl border border-white/[0.1] shadow-xl">
          <VehiclePreview vehicleCategory={selectedCategory} />
        </div>
      )}

      {/* Filter Category Tabs */}
      <div className="flex items-center p-1 rounded-2xl bg-white/[0.04] border border-white/[0.08] text-xs font-JakartaBold">
        {[
          { id: 'all', label: 'All Fleet' },
          { id: 'passenger', label: 'Comfort' },
          { id: 'rapid', label: 'Express Bikes' },
          { id: 'cargo', label: 'Haulage' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id as any)}
            className={`flex-1 py-1.5 rounded-xl transition-all text-center ${
              filter === tab.id
                ? 'bg-[#9EE6B5] text-black font-extrabold shadow-[0_0_15px_rgba(158,230,181,0.35)]'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Vehicle Cards List */}
      <div className="flex flex-col gap-2.5 max-h-[380px] overflow-y-auto pr-1">
        {filteredVehicles.map((vehicle) => {
          const spec =
            BROADER_3D_FLEET.find((s) => s.category === vehicle.category) || BROADER_3D_FLEET[0];
          const vehicleSeats = (vehicle as any).seats ?? spec.seats;
          const vehicleEta = vehicle.etaMinutes ?? (vehicle as any).eta_minutes ?? spec.etaMinutes;
          const vehicleFare = vehicle.price ?? (vehicle as any).fare_estimate ?? spec.basePriceNaira;

          return (
            <VehicleCard
              key={vehicle.id}
              id={String(vehicle.id)}
              name={vehicle.name}
              category={vehicle.category}
              tag={spec.tag}
              seats={vehicleSeats}
              etaMinutes={vehicleEta}
              farePrice={vehicleFare}
              selected={selectedCategory === vehicle.category}
              onSelect={() => onSelect(vehicle.category)}
              description={spec.description}
              speed={spec.speed}
            />
          );
        })}
      </div>
    </div>
  );
};
