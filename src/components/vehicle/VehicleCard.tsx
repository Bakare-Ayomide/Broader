import React from 'react';
import { motion } from 'motion/react';
import { Clock, Users, Briefcase, Zap, Star } from 'lucide-react';
import { getVehicle3DImage } from '../../data/vehicleAssets';
import { GlassCard } from '../glass/GlassCard';

export interface VehicleCardProps {
  id: string;
  name: string;
  category: string;
  tag?: string;
  seats: number | string;
  etaMinutes: number;
  farePrice: number;
  selected?: boolean;
  onSelect?: () => void;
  description?: string;
  speed?: string;
}

export const VehicleCard: React.FC<VehicleCardProps> = ({
  id,
  name,
  category,
  tag,
  seats,
  etaMinutes,
  farePrice,
  selected = false,
  onSelect,
  description,
  speed = '45 km/h avg',
}) => {
  const vehicle3DImg = getVehicle3DImage(category);

  return (
    <GlassCard
      interactive={true}
      selected={selected}
      glow={selected ? 'green' : 'none'}
      onClick={onSelect}
      className={`p-3.5 transition-all duration-300 ${
        selected ? 'bg-[#9EE6B5]/10 border-[#9EE6B5] shadow-[0_0_20px_rgba(158,230,181,0.25)]' : ''
      }`}
    >
      <div className="flex items-center gap-3.5">
        {/* 3D Vehicle Showcase Container */}
        <div className="relative w-20 h-16 shrink-0 flex items-center justify-center">
          {/* Ambient Platform Floor Shadow */}
          <div className="absolute bottom-1 w-14 h-2.5 bg-black/80 rounded-full blur-[2px] pointer-events-none" />

          {/* Selected Animated Aura */}
          {selected && (
            <div className="absolute inset-0 rounded-full bg-[#9EE6B5]/20 blur-md animate-pulse pointer-events-none" />
          )}

          <motion.img
            src={vehicle3DImg}
            alt={name}
            className="w-full h-full object-contain filter drop-shadow-[0_4px_10px_rgba(0,0,0,0.9)] relative z-10"
            animate={selected ? { y: [-1, 1, -1] } : undefined}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          />

          {/* 3D Model Badge */}
          <div className="absolute bottom-0 right-0 px-1 py-0.2 rounded-full bg-black/80 text-[7px] font-mono font-bold text-[#9EE6B5] border border-white/10 shadow-xs">
            3D
          </div>
        </div>

        {/* Info Column */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5 flex-wrap">
            <h4 className="text-xs font-JakartaBold text-white truncate">{name}</h4>
            {tag && (
              <span className="px-1.5 py-0.2 rounded-full text-[9px] font-JakartaBold bg-[#9EE6B5]/15 text-[#9EE6B5] border border-[#9EE6B5]/30">
                {tag}
              </span>
            )}
          </div>

          <p className="text-[10px] text-neutral-400 font-JakartaRegular truncate mt-0.5">
            {description || `${seats} seats • Air Conditioned • Fast Track`}
          </p>

          <div className="flex items-center gap-2 mt-1 text-[10px] text-neutral-300 font-mono">
            <span className="flex items-center gap-1 text-[#9EE6B5]">
              <Clock className="w-3 h-3" />
              <span>{etaMinutes} min away</span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Users className="w-3 h-3 text-neutral-400" />
              <span>{seats}</span>
            </span>
          </div>
        </div>

        {/* Fare Column */}
        <div className="flex flex-col items-end shrink-0 pl-1">
          <span className="text-sm font-mono font-extrabold text-[#9EE6B5]">
            ₦{Number(farePrice).toLocaleString()}
          </span>
          <span className="text-[9px] text-neutral-400 font-JakartaMedium">Estimated</span>
        </div>
      </div>
    </GlassCard>
  );
};
