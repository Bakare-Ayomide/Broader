import React, { useState } from 'react';
import {
  X,
  Camera,
  Compass,
  ChevronLeft,
  ChevronRight,
  MapPin,
  ExternalLink,
  ShieldCheck,
  Eye,
  RotateCw,
} from 'lucide-react';
import {
  MAPILLARY_LAGOS_FRAMES,
  StreetImageryFrame,
  getClosestStreetFrame,
} from '../../services/mapillaryService';

interface MapillaryViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  latitude?: number;
  longitude?: number;
}

export const MapillaryViewerModal: React.FC<MapillaryViewerModalProps> = ({
  isOpen,
  onClose,
  latitude = 6.4348,
  longitude = 3.4285,
}) => {
  const [currentFrameIndex, setCurrentFrameIndex] = useState(() => {
    const frame = getClosestStreetFrame(latitude, longitude);
    const idx = MAPILLARY_LAGOS_FRAMES.findIndex((f) => f.id === frame.id);
    return idx >= 0 ? idx : 0;
  });

  const [panOffset, setPanOffset] = useState(0);

  if (!isOpen) return null;

  const currentFrame = MAPILLARY_LAGOS_FRAMES[currentFrameIndex];

  const handleNext = () => {
    if (currentFrameIndex < MAPILLARY_LAGOS_FRAMES.length - 1) {
      setCurrentFrameIndex((i) => i + 1);
      setPanOffset(0);
    }
  };

  const handlePrev = () => {
    if (currentFrameIndex > 0) {
      setCurrentFrameIndex((i) => i - 1);
      setPanOffset(0);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-xl animate-in fade-in duration-200 select-none">
      <div
        className="w-full max-w-2xl h-[85vh] max-h-[640px] bg-[#0c1420] border border-white/15 rounded-3xl flex flex-col overflow-hidden shadow-[0_25px_70px_rgba(0,0,0,0.95)] text-white relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Glass Bar */}
        <div className="p-3.5 bg-black/70 backdrop-blur-xl border-b border-white/10 flex items-center justify-between z-20">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-JakartaBold text-white truncate max-w-[200px] sm:max-w-sm">
                  {currentFrame.streetName}
                </span>
                <span className="text-[10px] font-JakartaBold text-emerald-300 bg-emerald-500/15 border border-emerald-500/25 px-2 py-0.2 rounded-full">
                  Mapillary 360°
                </span>
              </div>
              <p className="text-[11px] font-JakartaMedium text-neutral-400">
                {currentFrame.neighborhood} • {currentFrame.heading}° Compass Heading
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center active:scale-95 transition-all"
            title="Close Street View"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Main 360 Street-Level Imagery Viewport */}
        <div className="relative flex-1 w-full bg-black overflow-hidden flex items-center justify-center cursor-grab active:cursor-grabbing">
          {/* Panoramic Image with dynamic pan offset */}
          <div
            className="absolute inset-0 w-[150%] h-full -left-[25%] transition-transform duration-300 ease-out"
            style={{
              transform: `translateX(${panOffset}px)`,
            }}
          >
            <img
              src={currentFrame.imageUrl}
              alt={currentFrame.streetName}
              className="w-full h-full object-cover brightness-[0.95] contrast-[1.05]"
            />
          </div>

          {/* Compass Orientation HUD Floating Badge */}
          <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-xl border border-white/15 px-3 py-1.5 rounded-2xl flex items-center gap-2 z-10">
            <Compass
              className="w-4 h-4 text-[#9EE6B5] transition-transform duration-300"
              style={{ transform: `rotate(${currentFrame.heading + panOffset * 0.2}deg)` }}
            />
            <span className="text-xs font-JakartaBold text-white">
              {Math.round((currentFrame.heading + panOffset * 0.2 + 360) % 360)}°
            </span>
            <span className="text-[10px] text-neutral-400 font-JakartaMedium">
              {currentFrame.lat.toFixed(4)}, {currentFrame.lng.toFixed(4)}
            </span>
          </div>

          {/* Center Crosshair Target / Focus Circle */}
          <div className="absolute pointer-events-none z-10 w-8 h-8 rounded-full border border-white/40 flex items-center justify-center opacity-60">
            <div className="w-1.5 h-1.5 rounded-full bg-[#9EE6B5]" />
          </div>

          {/* Left / Right Pan Buttons on Viewport */}
          <button
            onClick={() => setPanOffset((p) => Math.min(p + 80, 180))}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md border border-white/15 text-white flex items-center justify-center active:scale-95 transition-all z-20"
            title="Pan Left"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => setPanOffset((p) => Math.max(p - 80, -180))}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md border border-white/15 text-white flex items-center justify-center active:scale-95 transition-all z-20"
            title="Pan Right"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Bottom Street Name Ribbon */}
          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between pointer-events-none z-10">
            <div className="pointer-events-auto bg-black/80 backdrop-blur-xl border border-white/15 px-3 py-1.5 rounded-2xl flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-[#9EE6B5]" />
              <span className="text-xs font-JakartaBold text-white">
                {currentFrame.streetName}
              </span>
            </div>
            <div className="pointer-events-auto bg-black/80 backdrop-blur-xl border border-white/15 px-3 py-1.5 rounded-2xl text-[10px] font-JakartaMedium text-neutral-300">
              Drag or use pan arrows to look 360°
            </div>
          </div>
        </div>

        {/* Bottom Sequence Navigation Bar */}
        <div className="p-3.5 bg-black/80 backdrop-blur-xl border-t border-white/10 flex items-center justify-between z-20">
          <button
            onClick={handlePrev}
            disabled={currentFrameIndex === 0}
            className={`px-3 py-1.5 rounded-xl border text-xs font-JakartaBold flex items-center gap-1 transition-all ${
              currentFrameIndex === 0
                ? 'opacity-30 border-transparent text-neutral-500 cursor-not-allowed'
                : 'bg-white/10 hover:bg-white/20 border-white/15 text-white active:scale-95'
            }`}
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>Previous Frame</span>
          </button>

          {/* Frame indicator dots */}
          <div className="flex items-center gap-1.5">
            {MAPILLARY_LAGOS_FRAMES.map((f, idx) => (
              <button
                key={f.id}
                onClick={() => {
                  setCurrentFrameIndex(idx);
                  setPanOffset(0);
                }}
                className={`h-2 rounded-full transition-all ${
                  idx === currentFrameIndex
                    ? 'w-6 bg-[#9EE6B5]'
                    : 'w-2 bg-white/20 hover:bg-white/40'
                }`}
                title={f.streetName}
              />
            ))}
          </div>

          <button
            onClick={handleNext}
            disabled={currentFrameIndex === MAPILLARY_LAGOS_FRAMES.length - 1}
            className={`px-3 py-1.5 rounded-xl border text-xs font-JakartaBold flex items-center gap-1 transition-all ${
              currentFrameIndex === MAPILLARY_LAGOS_FRAMES.length - 1
                ? 'opacity-30 border-transparent text-neutral-500 cursor-not-allowed'
                : 'bg-[#9EE6B5] hover:bg-[#8fd8a6] border-[#9EE6B5] text-black font-extrabold active:scale-95'
            }`}
          >
            <span>Next Frame</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
