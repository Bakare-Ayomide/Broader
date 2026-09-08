import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Users, Briefcase, Gauge, ShieldCheck, Sparkles, RotateCw } from 'lucide-react';
import { getVehicle3DImage, BROADER_3D_FLEET, VehicleSpec } from '../../data/vehicleAssets';

export interface VehiclePreviewProps {
  vehicleCategory: string;
  className?: string;
  showSpecs?: boolean;
}

export const VehiclePreview: React.FC<VehiclePreviewProps> = ({
  vehicleCategory,
  className = '',
  showSpecs = true,
}) => {
  const [angleIndex, setAngleIndex] = useState(0);
  const angles = [
    { name: 'Front 3/4', yaw: 0, flip: false },
    { name: 'Side Yaw', yaw: 16, flip: false },
    { name: 'Left 3/4', yaw: 0, flip: true },
    { name: 'Reverse Yaw', yaw: -16, flip: true },
  ];

  const currentAngle = angles[angleIndex % angles.length];
  const spec =
    BROADER_3D_FLEET.find((v) => v.category === vehicleCategory) || BROADER_3D_FLEET[0];
  const vehicle3DImg = getVehicle3DImage(vehicleCategory);

  const handleRotate = () => {
    setAngleIndex((prev) => prev + 1);
  };

  return (
    <div className={`relative flex flex-col items-center select-none ${className}`}>
      {/* 3D Showcase Stage with Ambient Floor Glow */}
      <div className="relative w-full h-48 flex items-center justify-center overflow-hidden">
        {/* Radial Stage Spotlight */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(158,230,181,0.20)_0%,transparent_70%)] pointer-events-none" />

        {/* Ambient Floor Platform Disc */}
        <div className="absolute bottom-5 w-48 h-8 bg-gradient-to-r from-transparent via-[#9EE6B5]/35 to-transparent rounded-[100%] blur-[4px] pointer-events-none" />

        {/* Contact Road Shadow */}
        <div className="absolute bottom-7 w-40 h-4 bg-black/90 rounded-full blur-[3px] pointer-events-none" />

        {/* Interactive 3D Model Render */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`${vehicleCategory}_${angleIndex}`}
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.92 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="relative z-10 w-52 h-36 flex items-center justify-center"
            style={{
              perspective: '800px',
            }}
          >
            <motion.img
              src={vehicle3DImg}
              alt={spec.name}
              style={{
                transform: `scaleX(${currentAngle.flip ? -1 : 1}) rotateY(${currentAngle.yaw}deg)`,
                transition: 'transform 0.45s cubic-bezier(0.34, 1.56, 0.64, 1)',
              }}
              className="max-w-full max-h-full object-contain filter drop-shadow-[0_10px_24px_rgba(0,0,0,0.95)] cursor-pointer"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleRotate}
            />
          </motion.div>
        </AnimatePresence>

        {/* Floating Specular Sparkle Badges */}
        <div className="absolute top-2 left-2 flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-black/70 backdrop-blur-md border border-white/10 text-[9px] font-JakartaBold text-[#9EE6B5]">
          <Sparkles className="w-2.5 h-2.5" />
          <span>{currentAngle.name}</span>
        </div>

        <button
          onClick={handleRotate}
          className="absolute bottom-2 right-2 px-2.5 py-1 rounded-lg bg-black/60 hover:bg-black/85 backdrop-blur-md border border-white/15 text-[10px] font-mono text-[#9EE6B5] flex items-center gap-1.5 transition-all shadow-md active:scale-95"
          title="Rotate vehicle view"
        >
          <RotateCw className="w-3 h-3" />
          <span>Rotate 3D</span>
        </button>
      </div>

      {/* Specs Overview Row */}
      {showSpecs && (
        <div className="grid grid-cols-3 gap-2 w-full mt-2">
          <div className="p-2 rounded-xl bg-white/[0.04] border border-white/[0.08] text-center">
            <span className="text-[9px] text-neutral-400 font-JakartaMedium block uppercase">
              Capacity
            </span>
            <span className="text-xs font-mono font-bold text-white">{spec.seats} Seats</span>
          </div>

          <div className="p-2 rounded-xl bg-white/[0.04] border border-white/[0.08] text-center">
            <span className="text-[9px] text-neutral-400 font-JakartaMedium block uppercase">
              Speed Rate
            </span>
            <span className="text-xs font-mono font-bold text-[#9EE6B5]">{spec.speed}</span>
          </div>

          <div className="p-2 rounded-xl bg-white/[0.04] border border-white/[0.08] text-center">
            <span className="text-[9px] text-neutral-400 font-JakartaMedium block uppercase">
              Luggage
            </span>
            <span className="text-xs font-mono font-bold text-[#9EE6B5]">{spec.luggage}</span>
          </div>
        </div>
      )}
    </div>
  );
};
