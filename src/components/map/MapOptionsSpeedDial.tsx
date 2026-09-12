import React, { useState, useRef, useEffect } from 'react';
import { Layers, Compass, Box, SlidersHorizontal, X, Check } from 'lucide-react';
import { soundEngine } from '../../services/soundNotification';

export interface MapOptionsSpeedDialProps {
  is3D: boolean;
  onToggle3D: () => void;
  bearing: number;
  onResetBearing: () => void;
  onOpenLayersModal: () => void;
  className?: string;
}

export const MapOptionsSpeedDial: React.FC<MapOptionsSpeedDialProps> = ({
  is3D,
  onToggle3D,
  bearing,
  onResetBearing,
  onOpenLayersModal,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isOpen]);

  const toggleOpen = () => {
    soundEngine.playClick();
    setIsOpen((prev) => !prev);
  };

  return (
    <div ref={containerRef} className={`relative flex flex-col items-center ${className}`}>
      {/* EXPANDED OPTIONS TRAY (POPS OUT ABOVE / ALONGSIDE WHEN TAPPED) */}
      {isOpen && (
        <div className="absolute right-0 bottom-11 flex flex-col items-end gap-2 z-40 animate-in fade-in slide-in-from-bottom-2 duration-150 select-none">
          {/* Option 1: Map Layers Control Modal */}
          <button
            type="button"
            onClick={() => {
              soundEngine.playClick();
              onOpenLayersModal();
              setIsOpen(false);
            }}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0c1420]/95 backdrop-blur-2xl border border-white/20 text-xs font-JakartaBold text-neutral-200 hover:text-white hover:border-[#9EE6B5] shadow-2xl active:scale-95 transition-all group whitespace-nowrap"
            title="Open Map Layers (Satellite, Traffic, Elevation, 3D Buildings)"
          >
            <span className="text-[11px] font-JakartaMedium text-neutral-300 group-hover:text-white">
              Map Layers
            </span>
            <div className="w-6 h-6 rounded-full bg-[#9EE6B5]/15 border border-[#9EE6B5]/30 text-[#9EE6B5] flex items-center justify-center">
              <Layers className="w-3.5 h-3.5" />
            </div>
          </button>

          {/* Option 2: 3D / 2D Perspective Toggle */}
          <button
            type="button"
            onClick={() => {
              soundEngine.playClick();
              onToggle3D();
              setIsOpen(false);
            }}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full backdrop-blur-2xl border text-xs font-JakartaBold shadow-2xl active:scale-95 transition-all group whitespace-nowrap ${
              is3D
                ? 'bg-[#9EE6B5]/20 border-[#9EE6B5] text-[#9EE6B5]'
                : 'bg-[#0c1420]/95 border-white/20 text-neutral-300 hover:text-white hover:border-white/40'
            }`}
            title={is3D ? 'Switch to 2D Top-Down' : 'Switch to 3D Perspective'}
          >
            <span className="text-[11px] font-JakartaMedium text-neutral-300 group-hover:text-white">
              {is3D ? '3D View (Active)' : '2D Top-Down'}
            </span>
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[10px] ${
                is3D ? 'bg-[#9EE6B5] text-black font-extrabold' : 'bg-white/10 text-white'
              }`}
            >
              {is3D ? '3D' : '2D'}
            </div>
          </button>

          {/* Option 3: Compass / Reset North */}
          <button
            type="button"
            onClick={() => {
              soundEngine.playClick();
              onResetBearing();
              setIsOpen(false);
            }}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0c1420]/95 backdrop-blur-2xl border border-white/20 text-xs font-JakartaBold text-neutral-200 hover:text-white hover:border-cyan-400 shadow-2xl active:scale-95 transition-all group whitespace-nowrap"
            title="Reset Bearing to North"
          >
            <span className="text-[11px] font-JakartaMedium text-neutral-300 group-hover:text-white">
              Reset North
            </span>
            <div className="w-6 h-6 rounded-full bg-cyan-500/15 border border-cyan-400/30 text-cyan-400 flex items-center justify-center">
              <Compass
                className="w-3.5 h-3.5 transition-transform duration-300"
                style={{ transform: `rotate(${-bearing}deg)` }}
              />
            </div>
          </button>
        </div>
      )}

      {/* THE SINGLE SMALL ICON BUTTON (EXPANDS / COLLAPSES WHEN TAPPED) */}
      <button
        type="button"
        onClick={toggleOpen}
        className={`w-9 h-9 rounded-full backdrop-blur-2xl border flex items-center justify-center shadow-xl active:scale-90 transition-all ${
          isOpen
            ? 'bg-[#9EE6B5] text-black border-[#9EE6B5] shadow-[0_0_15px_rgba(158,230,181,0.6)]'
            : 'bg-[#0c1420]/90 border-white/15 text-[#9EE6B5] hover:text-white hover:border-white/30 hover:bg-[#0c1420]'
        }`}
        title={isOpen ? 'Collapse Map Options' : 'Expand Map Options (Layers, 3D, Compass)'}
      >
        {isOpen ? <X className="w-4 h-4" /> : <Layers className="w-4 h-4" />}
      </button>
    </div>
  );
};
