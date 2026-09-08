import React from 'react';
import { MarkerData } from '../types';
import { Star, Users, Clock } from 'lucide-react';
import { getVehicle3DImage } from '../data/vehicleAssets';

interface DriverCardProps {
  item: MarkerData;
  selected: boolean;
  onSelect: () => void;
}

export const DriverCard: React.FC<DriverCardProps> = ({ item, selected, onSelect }) => {
  const vehicleImg = item.car_image_url || getVehicle3DImage(item.vehicle_type || (item as any).category);

  return (
    <div
      onClick={onSelect}
      className={`flex items-center justify-between p-3.5 rounded-2xl transition-all cursor-pointer mb-3 border ${
        selected
          ? 'bg-[#9EE6B5]/10 border-[#9EE6B5] shadow-[0_0_15px_rgba(158,230,181,0.25)] ring-1 ring-[#9EE6B5]'
          : 'bg-black/50 backdrop-blur-xl border-white/10 hover:border-white/20'
      }`}
    >
      {/* Driver Avatar */}
      <img
        src={item.profile_image_url}
        alt={item.title}
        className="w-12 h-12 rounded-full object-cover border border-white/20 shadow-sm shrink-0"
      />

      {/* Info Middle */}
      <div className="flex-1 flex flex-col items-start justify-center mx-3 min-w-0">
        <div className="flex items-center gap-1.5 mb-1">
          <span className="text-sm font-JakartaSemiBold text-white truncate">
            {item.title}
          </span>
          <div className="flex items-center gap-0.5 bg-amber-500/15 border border-amber-500/30 px-1.5 py-0.5 rounded text-amber-300 text-xs font-semibold">
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            <span>{item.rating}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-JakartaMedium text-neutral-400">
          <span className="font-mono font-bold text-[#9EE6B5] flex items-center">
            {item.price?.startsWith('₦') ? item.price : `₦${Number(item.price || 2500).toLocaleString()}`}
          </span>
          <span>•</span>
          <span className="flex items-center gap-0.5 text-neutral-300">
            <Clock className="w-3 h-3 text-neutral-400" />
            {item.time || 4} mins
          </span>
          <span>•</span>
          <span className="flex items-center gap-0.5 text-neutral-300">
            <Users className="w-3 h-3 text-neutral-400" />
            {item.car_seats} seats
          </span>
        </div>
      </div>

      {/* Car Vehicle Preview */}
      <div className="w-14 h-12 flex items-center justify-center shrink-0">
        <img
          src={vehicleImg}
          alt={item.car_model || 'Vehicle'}
          className="w-full h-full object-contain filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)]"
        />
      </div>
    </div>
  );
};
