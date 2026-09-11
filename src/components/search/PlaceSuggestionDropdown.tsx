import React, { useEffect, useRef } from 'react';
import { MapPin, Navigation, Clock, Home, Briefcase, Sparkles, Loader2 } from 'lucide-react';
import { POPULAR_DESTINATIONS } from '../../data/mockData';
import { GeocodingResult } from '../../services/nominatimService';
import { soundEngine } from '../../services/soundNotification';

export interface SelectedLocationItem {
  name: string;
  address: string;
  latitude: number;
  longitude: number;
}

interface PlaceSuggestionDropdownProps {
  query: string;
  isOpen: boolean;
  onClose: () => void;
  onSelect: (item: SelectedLocationItem) => void;
  osmResults?: GeocodingResult[];
  isSearchingOsm?: boolean;
}

export const PlaceSuggestionDropdown: React.FC<PlaceSuggestionDropdownProps> = ({
  query,
  isOpen,
  onClose,
  onSelect,
  osmResults = [],
  isSearchingOsm = false,
}) => {
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return;
    const handleOutsideClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const trimmed = query.trim().toLowerCase();

  // Filter popular Lagos destinations
  const filteredPopular = POPULAR_DESTINATIONS.filter(
    (d) =>
      !trimmed ||
      d.name.toLowerCase().includes(trimmed) ||
      d.address.toLowerCase().includes(trimmed)
  ).slice(0, 5);

  const handleItemClick = (item: SelectedLocationItem) => {
    soundEngine.playClick();
    onSelect(item);
    onClose();
  };

  return (
    <div
      ref={dropdownRef}
      className="absolute top-full left-0 right-0 mt-1.5 z-50 max-h-64 overflow-y-auto rounded-2xl bg-[#0c1420]/95 backdrop-blur-2xl border border-white/15 shadow-[0_12px_36px_rgba(0,0,0,0.85)] no-scrollbar animate-in fade-in slide-in-from-top-2 duration-150"
    >
      {/* Header bar indicating search state */}
      <div className="px-3.5 py-2 border-b border-white/[0.08] flex items-center justify-between text-[11px] font-JakartaSemiBold text-neutral-400 bg-white/[0.02]">
        <div className="flex items-center gap-1.5">
          <Sparkles className="w-3 h-3 text-[#9EE6B5]" />
          <span>{trimmed ? 'Suggested Lagos Places' : 'Popular Destinations'}</span>
        </div>
        {isSearchingOsm && (
          <div className="flex items-center gap-1 text-[#9EE6B5]">
            <Loader2 className="w-3 h-3 animate-spin" />
            <span className="text-[10px]">Searching OSM...</span>
          </div>
        )}
      </div>

      {/* 1. Live OSM Nominatim Search Results (if user has typed) */}
      {osmResults.length > 0 && (
        <div className="p-1 border-b border-white/[0.06]">
          <span className="text-[10px] font-JakartaBold text-neutral-400 uppercase tracking-wider px-3 py-1 block">
            OpenStreetMap Verified
          </span>
          {osmResults.slice(0, 4).map((res) => (
            <div
              key={res.place_id}
              onClick={() =>
                handleItemClick({
                  name: res.display_name.split(',')[0],
                  address: res.display_name,
                  latitude: parseFloat(res.lat),
                  longitude: parseFloat(res.lon),
                })
              }
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/[0.08] cursor-pointer transition-all active:scale-[0.99] group"
            >
              <div className="w-7 h-7 rounded-lg bg-[#9EE6B5]/15 text-[#9EE6B5] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Navigation className="w-3.5 h-3.5" />
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="text-xs font-JakartaBold text-white truncate group-hover:text-[#9EE6B5] transition-colors">
                  {res.display_name.split(',')[0]}
                </h4>
                <p className="text-[10px] font-JakartaMedium text-neutral-400 truncate">
                  {res.display_name}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 2. Popular Pre-mapped Lagos Destinations */}
      <div className="p-1">
        {filteredPopular.length > 0 ? (
          filteredPopular.map((dest, idx) => (
            <div
              key={dest.name + idx}
              onClick={() =>
                handleItemClick({
                  name: dest.name,
                  address: dest.address,
                  latitude: dest.latitude,
                  longitude: dest.longitude,
                })
              }
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/[0.08] cursor-pointer transition-all active:scale-[0.99] group"
            >
              <div className="w-7 h-7 rounded-lg bg-white/10 text-neutral-300 group-hover:bg-[#9EE6B5]/20 group-hover:text-[#9EE6B5] flex items-center justify-center shrink-0 transition-colors">
                <MapPin className="w-3.5 h-3.5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-JakartaBold text-white truncate group-hover:text-[#9EE6B5] transition-colors">
                    {dest.name}
                  </h4>
                  <span className="text-[9px] font-JakartaBold text-[#9EE6B5] bg-[#9EE6B5]/10 px-1.5 py-0.5 rounded ml-2 shrink-0">
                    Lagos Hub
                  </span>
                </div>
                <p className="text-[10px] font-JakartaMedium text-neutral-400 truncate">
                  {dest.address}
                </p>
              </div>
            </div>
          ))
        ) : osmResults.length === 0 && !isSearchingOsm ? (
          <div className="py-4 text-center text-xs font-JakartaMedium text-neutral-400">
            No matching places found. Try typing a street or landmark in Lagos.
          </div>
        ) : null}
      </div>
    </div>
  );
};
