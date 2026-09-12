import React from 'react';
import {
  X,
  Layers,
  Map as MapIcon,
  Building2,
  Navigation2,
  AlertTriangle,
  MapPin,
  Sparkles,
  ShieldCheck,
  Compass,
} from 'lucide-react';

export type BaseMapStyle = 'dark' | 'satellite' | 'standard';

export interface MapLayerSettings {
  baseStyle: BaseMapStyle;
  showBuildings: boolean;
  showRoute: boolean;
  showTraffic: boolean;
  showPois: boolean;
  showStreetImagery: boolean;
}

interface MapLayerControlModalProps {
  isOpen: boolean;
  onClose: () => void;
  layers: MapLayerSettings;
  onChangeLayers: (updated: Partial<MapLayerSettings>) => void;
  onOpenStreetViewer?: () => void;
}

export const MapLayerControlModal: React.FC<MapLayerControlModalProps> = ({
  isOpen,
  onClose,
  layers,
  onChangeLayers,
  onOpenStreetViewer,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="w-full max-w-sm bg-[#0c1420]/95 backdrop-blur-2xl border border-white/15 rounded-3xl p-5 shadow-[0_20px_60px_rgba(0,0,0,0.9)] text-white relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow ambient background pill */}
        <div className="absolute -top-16 -right-16 w-36 h-36 bg-[#9EE6B5]/15 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#9EE6B5]/15 border border-[#9EE6B5]/30 flex items-center justify-center text-[#9EE6B5]">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-JakartaBold text-white flex items-center gap-1.5 leading-tight">
                Map Layers & Services
                <span className="text-[10px] font-JakartaBold text-[#9EE6B5] bg-[#9EE6B5]/10 px-1.5 py-0.5 rounded-full border border-[#9EE6B5]/20">
                  Live Navigation
                </span>
              </h3>
              <p className="text-[11px] font-JakartaMedium text-neutral-400">
                High Precision Vector & Satellite Layers
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-neutral-300 flex items-center justify-center active:scale-95 transition-all"
            title="Close"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Base Map Style Section */}
        <div className="mt-4">
          <label className="text-[11px] font-JakartaBold text-neutral-300 uppercase tracking-wider block mb-2">
            Base Map Renderer
          </label>
          <div className="grid grid-cols-3 gap-2">
            {/* Cinematic Dark (OpenFreeMap Dark - No API Key) */}
            <button
              onClick={() => onChangeLayers({ baseStyle: 'dark' })}
              className={`p-2.5 rounded-2xl border text-left flex flex-col items-center justify-center gap-1.5 transition-all active:scale-95 ${
                layers.baseStyle === 'dark'
                  ? 'bg-[#9EE6B5]/15 border-[#9EE6B5] text-[#9EE6B5] shadow-[0_0_15px_rgba(158,230,181,0.25)]'
                  : 'bg-black/40 border-white/10 text-neutral-400 hover:border-white/25 hover:text-white'
              }`}
            >
              <div className="w-8 h-8 rounded-xl bg-[#080d14] border border-white/20 flex items-center justify-center">
                <div className="w-4 h-4 rounded-full bg-[#111c2a] border border-[#9EE6B5]" />
              </div>
              <span className="text-[11px] font-JakartaBold text-center leading-tight">
                Cinematic Dark
              </span>
            </button>

            {/* Satellite Aerial (Esri World Imagery) */}
            <button
              onClick={() => onChangeLayers({ baseStyle: 'satellite' })}
              className={`p-2.5 rounded-2xl border text-left flex flex-col items-center justify-center gap-1.5 transition-all active:scale-95 ${
                layers.baseStyle === 'satellite'
                  ? 'bg-[#9EE6B5]/15 border-[#9EE6B5] text-[#9EE6B5] shadow-[0_0_15px_rgba(158,230,181,0.25)]'
                  : 'bg-black/40 border-white/10 text-neutral-400 hover:border-white/25 hover:text-white'
              }`}
            >
              <div className="w-8 h-8 rounded-xl bg-[#091f14] border border-white/20 flex items-center justify-center overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=120&q=80"
                  alt="Satellite"
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-[11px] font-JakartaBold text-center leading-tight">
                Satellite View
              </span>
            </button>

            {/* Standard Map */}
            <button
              onClick={() => onChangeLayers({ baseStyle: 'standard' })}
              className={`p-2.5 rounded-2xl border text-left flex flex-col items-center justify-center gap-1.5 transition-all active:scale-95 ${
                layers.baseStyle === 'standard'
                  ? 'bg-[#9EE6B5]/15 border-[#9EE6B5] text-[#9EE6B5] shadow-[0_0_15px_rgba(158,230,181,0.25)]'
                  : 'bg-black/40 border-white/10 text-neutral-400 hover:border-white/25 hover:text-white'
              }`}
            >
              <div className="w-8 h-8 rounded-xl bg-[#e5e7eb] border border-white/20 flex items-center justify-center">
                <MapIcon className="w-4 h-4 text-slate-800" />
              </div>
              <span className="text-[11px] font-JakartaBold text-center leading-tight">
                Standard Map
              </span>
            </button>
          </div>
        </div>

        {/* Feature Overlays Toggles */}
        <div className="mt-4 space-y-2">
          <label className="text-[11px] font-JakartaBold text-neutral-300 uppercase tracking-wider block mb-1">
            Data Layers & Overlays
          </label>

          {/* 3D Buildings & Landmarks */}
          <div className="flex items-center justify-between p-2.5 rounded-2xl bg-black/40 border border-white/10 hover:border-white/20 transition-all">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                <Building2 className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-JakartaBold text-white">3D Buildings & Extrusions</p>
                <p className="text-[10px] text-neutral-400">Realistic 3D heights & landmarks</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => onChangeLayers({ showBuildings: !layers.showBuildings })}
              className={`w-11 h-6 rounded-full transition-colors relative flex items-center p-0.5 ${
                layers.showBuildings ? 'bg-[#9EE6B5]' : 'bg-neutral-800'
              }`}
            >
              <span
                className={`w-5 h-5 rounded-full bg-black shadow-md transform transition-transform ${
                  layers.showBuildings ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Fastest Route */}
          <div className="flex items-center justify-between p-2.5 rounded-2xl bg-black/40 border border-white/10 hover:border-white/20 transition-all">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-[#9EE6B5]/20 text-[#9EE6B5] flex items-center justify-center">
                <Navigation2 className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-JakartaBold text-white flex items-center gap-1.5">
                  Fastest Route
                  <span className="text-[9px] bg-cyan-400/20 text-cyan-300 px-1.5 py-0.2 rounded-full font-bold">
                    Turn Guidance
                  </span>
                </p>
                <p className="text-[10px] text-neutral-400">Live navigation polyline & arrows</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => onChangeLayers({ showRoute: !layers.showRoute })}
              className={`w-11 h-6 rounded-full transition-colors relative flex items-center p-0.5 ${
                layers.showRoute ? 'bg-[#9EE6B5]' : 'bg-neutral-800'
              }`}
            >
              <span
                className={`w-5 h-5 rounded-full bg-black shadow-md transform transition-transform ${
                  layers.showRoute ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Traffic Flow & Road Information */}
          <div className="flex items-center justify-between p-2.5 rounded-2xl bg-black/40 border border-white/10 hover:border-white/20 transition-all">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-JakartaBold text-white">Live Traffic & Congestion</p>
                <p className="text-[10px] text-neutral-400">Bridge & arterial road speed flow</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => onChangeLayers({ showTraffic: !layers.showTraffic })}
              className={`w-11 h-6 rounded-full transition-colors relative flex items-center p-0.5 ${
                layers.showTraffic ? 'bg-[#9EE6B5]' : 'bg-neutral-800'
              }`}
            >
              <span
                className={`w-5 h-5 rounded-full bg-black shadow-md transform transition-transform ${
                  layers.showTraffic ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Points of Interest (POIs) */}
          <div className="flex items-center justify-between p-2.5 rounded-2xl bg-black/40 border border-white/10 hover:border-white/20 transition-all">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-JakartaBold text-white">Points of Interest (POIs)</p>
                <p className="text-[10px] text-neutral-400">Airports, malls, ferries & terminals</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => onChangeLayers({ showPois: !layers.showPois })}
              className={`w-11 h-6 rounded-full transition-colors relative flex items-center p-0.5 ${
                layers.showPois ? 'bg-[#9EE6B5]' : 'bg-neutral-800'
              }`}
            >
              <span
                className={`w-5 h-5 rounded-full bg-black shadow-md transform transition-transform ${
                  layers.showPois ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[9px] font-JakartaMedium text-neutral-400">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-[#9EE6B5]" />
            Live Satellite & Navigation Network
          </span>
          <button
            onClick={() => {
              onChangeLayers({
                baseStyle: 'standard',
                showBuildings: true,
                showRoute: true,
                showTraffic: true,
                showPois: true,
                showStreetImagery: true,
              });
            }}
            className="text-[#9EE6B5] hover:underline font-bold"
          >
            Enable All
          </button>
        </div>
      </div>
    </div>
  );
};
