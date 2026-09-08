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

  // Smoothly orient isometric 3D vehicle so wheels stay grounded
  const normalizedHeading = ((heading % 360) + 360) % 360;
  const isFacingLeft = normalizedHeading > 90 && normalizedHeading < 270;
  // Subtle pitch/yaw tilt aligned with road heading (-14 to +14 deg)
  const angleDelta = isFacingLeft ? 180 - normalizedHeading : (normalizedHeading > 180 ? normalizedHeading - 360 : normalizedHeading);
  const roadTilt = Math.max(-15, Math.min(15, angleDelta * 0.3));

  return (
    <div className={`relative flex flex-col items-center justify-center select-none ${className}`}>
      {/* Vehicle Container */}
      <div className={`relative ${dimensions.w} ${dimensions.h} flex items-center justify-center`}>
        {/* Contact Road Shadow Beneath Tires */}
        <div className="absolute -bottom-1 w-4/5 h-2.5 bg-black/85 rounded-full blur-[2px] pointer-events-none" />

        {/* Selected Glowing Ambient Aura */}
        {selected && (
          <div className="absolute -inset-1 rounded-full bg-[#9EE6B5]/35 blur-md animate-pulse pointer-events-none" />
        )}

        {/* Dynamic Headlight Glow casting in facing direction */}
        {hasHeadlights && (
          <div
            className={`absolute pointer-events-none ${
              isFacingLeft ? '-left-6 top-1/2 -translate-y-1/2 w-8 h-6' : '-right-6 top-1/2 -translate-y-1/2 w-8 h-6'
            }`}
            style={{
              background: `radial-gradient(ellipse at ${isFacingLeft ? 'right' : 'left'}, rgba(254, 240, 138, 0.45) 0%, rgba(158, 230, 181, 0.2) 40%, transparent 80%)`,
            }}
          />
        )}

        {/* 3D Transparent Vehicle Image with Upright Grounded Orientation */}
        <img
          src={vehicle3DImg}
          alt={vehicleType}
          style={{
            transform: `${isFacingLeft ? 'scaleX(-1)' : 'scaleX(1)'} rotate(${roadTilt}deg)`,
            transition: 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
          }}
          className={`${dimensions.img} object-contain filter drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)] relative z-10`}
        />

        {/* Motion Speed Trail Particles if moving */}
        {isMoving && (
          <div className="absolute -bottom-1.5 flex gap-1 pointer-events-none">
            <span className="w-1 h-1 rounded-full bg-[#9EE6B5] animate-ping" />
          </div>
        )}
      </div>

      {/* Optional Vehicle Type / Driver Name Pill */}
      {showLabel && label && (
        <div className="mt-1 px-2 py-0.5 rounded-full bg-black/85 backdrop-blur-md border border-white/15 text-[9px] font-JakartaBold text-white shadow-lg whitespace-nowrap z-20">
          {label}
        </div>
      )}
    </div>
  );
};
