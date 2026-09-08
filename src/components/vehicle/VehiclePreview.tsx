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
  const [rotationAngle, setRotationAngle] = useState(0);
  const spec =
    BROADER_3D_FLEET.find((v) => v.category === vehicleCategory) || BROADER_3D_FLEET[0];
  const vehicle3DImg = getVehicle3DImage(vehicleCategory);

  const handleRotate = () => {
    setRotationAngle((prev) => prev + 45);
  };

  return (
    <div className={`relative flex flex-col items-center select-none ${className}`}>
      {/* 3D Showcase Stage with Ambient Floor Glow */}
      <div className="relative w-full h-44 flex items-center justify-center overflow-hidden">
        {/* Radial Stage Spotlight */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(2,134,255,0.18)_0%,transparent_70%)] pointer-events-none" />

        {/* Ambient Floor Platform Disc */}
        <div className="absolute bottom-4 w-44 h-8 bg-gradient-to-r from-transparent via-[#0286FF]/25 to-transparent rounded-[100%] blur-[4px] pointer-events-none" />

        {/* Contact Road Shadow */}
        <div className="absolute bottom-6 w-36 h-3.5 bg-black/90 rounded-full blur-[2px] pointer-events-none" />

        {/* Interactive 3D Model Render */}
        <AnimatePresence mode="wait">
          <motion.div
            key={vehicleCategory}
            initial={{ opacity: 0, scale: 0.88, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.88, y: -10 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="relative z-10 w-44 h-32 flex items-center justify-center"
            style={{ transform: `rotate(${rotationAngle}deg)`, transition: 'transform 0.5s ease' }}
          >
            <motion.img
              src={vehicle3DImg}
              alt={spec.name}
              className="w-full h-full object-contain filter drop-shadow-[0_8px_20px_rgba(0,0,0,0.95)] cursor-pointer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleRotate}
            />
          </motion.div>
        </AnimatePresence>

        {/* Floating Specular Sparkle Badges */}
        <div className="absolute top-2 left-2 flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-black/70 backdrop-blur-md border border-white/10 text-[9px] font-JakartaBold text-cyan-300">
          <Sparkles className="w-2.5 h-2.5" />
          <span>Full 3D Model</span>
        </div>

        <button
          onClick={handleRotate}
          className="absolute bottom-2 right-2 px-2 py-1 rounded-lg bg-black/60 hover:bg-black/80 backdrop-blur-md border border-white/10 text-[9px] font-mono text-neutral-300 flex items-center gap-1 transition-colors"
          title="Rotate vehicle"
        >
          <RotateCw className="w-2.5 h-2.5" />
          <span>Rotate</span>
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
            <span className="text-xs font-mono font-bold text-cyan-400">{spec.speed}</span>
          </div>

          <div className="p-2 rounded-xl bg-white/[0.04] border border-white/[0.08] text-center">
            <span className="text-[9px] text-neutral-400 font-JakartaMedium block uppercase">
              Luggage
            </span>
            <span className="text-xs font-mono font-bold text-emerald-400">{spec.luggage}</span>
          </div>
        </div>
      )}
    </div>
  );
};
