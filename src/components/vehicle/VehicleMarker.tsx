import React from 'react';
import { motion } from 'motion/react';
import { getVehicle3DImage } from '../../data/vehicleAssets';

export interface VehicleMarkerProps {
  vehicleType?: string; // sedan, suv, taxi, bike, van, etc.
  heading?: number; // 0 to 360 degrees
  isMoving?: boolean;
  hasHeadlights?: boolean;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  label?: string;
  selected?: boolean;
  className?: string;
}

const SIZE_MAP = {
  sm: { w: 'w-10', h: 'h-8', img: 'w-8 h-7', beam: 'w-8 h-12' },
  md: { w: 'w-14', h: 'h-11', img: 'w-12 h-9', beam: 'w-12 h-16' },
  lg: { w: 'w-20', h: 'h-16', img: 'w-18 h-14', beam: 'w-16 h-20' },
};

export const VehicleMarker: React.FC<VehicleMarkerProps> = ({
  vehicleType = 'car',
  heading = 0,
  isMoving = false,
  hasHeadlights = true,
  size = 'md',
  showLabel = false,
  label,
  selected = false,
  className = '',
}) => {
  const dimensions = SIZE_MAP[size];
  const vehicle3DImg = getVehicle3DImage(vehicleType);

  return (
    <div className={`relative flex flex-col items-center justify-center select-none ${className}`}>
      {/* Dynamic Rotation Container */}
      <motion.div
        className={`relative ${dimensions.w} ${dimensions.h} flex items-center justify-center`}
        animate={{ rotate: heading }}
        transition={{ type: 'spring', damping: 20, stiffness: 200 }}
      >
        {/* Contact Road Shadow */}
        <div className="absolute -bottom-1 w-3/4 h-2.5 bg-black/80 rounded-full blur-[2px] pointer-events-none" />

        {/* Selected Glowing Ambient Aura */}
        {selected && (
          <div className="absolute inset-0 rounded-full bg-[#0286FF]/30 blur-md animate-pulse pointer-events-none" />
        )}

        {/* Realistic Headlight Beams Glow Forward */}
        {hasHeadlights && (
          <div
            className={`absolute -top-6 left-1/2 -translate-x-1/2 ${dimensions.beam} pointer-events-none`}
            style={{
              background:
                'radial-gradient(ellipse at bottom, rgba(254, 240, 138, 0.45) 0%, rgba(56, 189, 248, 0.15) 50%, transparent 80%)',
              clipPath: 'polygon(30% 100%, 70% 100%, 100% 0%, 0% 0%)',
            }}
          />
        )}

        {/* 3D Transparent Vehicle Image */}
        <img
          src={vehicle3DImg}
          alt={vehicleType}
          className={`${dimensions.img} object-contain filter drop-shadow-[0_4px_10px_rgba(0,0,0,0.9)] relative z-10 transition-transform`}
        />

        {/* Motion Speed Trail Particles if moving */}
        {isMoving && (
          <div className="absolute -bottom-2 flex gap-1">
            <span className="w-1 h-1 rounded-full bg-cyan-400 animate-ping" />
          </div>
        )}
      </motion.div>

      {/* Optional Vehicle Type / Driver Name Pill */}
      {showLabel && label && (
        <div className="mt-1 px-2 py-0.5 rounded-full bg-black/80 backdrop-blur-md border border-white/10 text-[9px] font-JakartaBold text-white shadow-lg whitespace-nowrap">
          {label}
        </div>
      )}
    </div>
  );
};
