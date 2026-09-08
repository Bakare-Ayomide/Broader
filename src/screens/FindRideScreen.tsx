import React, { useState } from 'react';
import { useBroaderStore } from '../store/useBroaderStore';
import { InteractiveMap } from '../components/InteractiveMap';
import {
  ArrowLeft,
  MapPin,
  Navigation,
  Crosshair,
  Home,
  Briefcase,
  Clock,
  Search,
  X,
  Check,
} from 'lucide-react';
import { POPULAR_DESTINATIONS, LAGOS_COORDS } from '../data/mockData';
import { RecentDestination, SavedLocation } from '../types';

export const FindRideScreen: React.FC = () => {
  const setScreen = useBroaderStore((s) => s.setScreen);
  const userAddress = useBroaderStore((s) => s.userAddress);
  const userLatitude = useBroaderStore((s) => s.userLatitude);
  const userLongitude = useBroaderStore((s) => s.userLongitude);
  const destinationAddress = useBroaderStore((s) => s.destinationAddress);
  const setUserLocation = useBroaderStore((s) => s.setUserLocation);
  const setDestinationLocation = useBroaderStore((s) => s.setDestinationLocation);
  const resetToCurrentLocation = useBroaderStore((s) => s.resetToCurrentLocation);
  const savedLocations = useBroaderStore((s) => s.savedLocations);
  const recentDestinations = useBroaderStore((s) => s.recentDestinations);
  const addRecentDestination = useBroaderStore((s) => s.addRecentDestination);
  const pickupInstructions = useBroaderStore((s) => s.pickupInstructions);
  const setPickupInstructions = useBroaderStore((s) => s.setPickupInstructions);

  const [toInput, setToInput] = useState(destinationAddress || "Murtala Muhammed Int'l Airport (LOS), Ikeja");
  const [fromInput, setFromInput] = useState(userAddress || LAGOS_COORDS.address);
  const [activeInput, setActiveInput] = useState<'from' | 'to'>('to');

  // Handle selecting a destination
  const handleSelectLocation = (loc: {
    name?: string;
    title?: string;
    address: string;
    latitude: number;
    longitude: number;
  }) => {
    const displayName = loc.name || loc.title || loc.address;
    if (activeInput === 'from') {
      setFromInput(displayName);
      setUserLocation({
        latitude: loc.latitude,
        longitude: loc.longitude,
        address: displayName,
      });
      setActiveInput('to');
    } else {
      setToInput(displayName);
      setDestinationLocation({
        latitude: loc.latitude,
        longitude: loc.longitude,
        address: displayName,
      });
      addRecentDestination({
        id: 'rec_' + Date.now(),
        name: displayName,
        address: loc.address,
        latitude: loc.latitude,
        longitude: loc.longitude,
      });
    }
  };

  // Handle "Use Current Location" (Lagos Nigeria)
  const handleUseCurrentLocation = () => {
    resetToCurrentLocation();
    setFromInput(LAGOS_COORDS.address);
    setUserLocation({
      latitude: LAGOS_COORDS.latitude,
      longitude: LAGOS_COORDS.longitude,
      address: LAGOS_COORDS.address,
    });
  };

  const handleFindNow = () => {
    if (!destinationAddress || destinationAddress !== toInput) {
      setDestinationLocation({
        latitude: 6.5774,
        longitude: 3.3212,
        address: toInput,
      });
    }
    setScreen('confirm-ride');
  };

  const searchQuery = toInput.trim().toLowerCase();
  const filteredPopular = POPULAR_DESTINATIONS.filter(
    (d) =>
      d.name.toLowerCase().includes(searchQuery) ||
      d.address.toLowerCase().includes(searchQuery)
  );

  return (
    <div className="flex flex-col min-h-full bg-[#000000] text-white select-none">
      {/* Navigation Header - Frosted Glass */}
      <div className="flex items-center px-4 py-3.5 glass-nav border-b border-white/[0.08]">
        <button
          onClick={() => setScreen('home')}
          className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors mr-3 text-neutral-300 hover:text-white"
          title="Back to Home"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h2 className="text-base font-JakartaBold text-white leading-tight">Choose Destination</h2>
          <p className="text-[11px] font-JakartaMedium text-neutral-400">Select pickup and drop-off in Lagos</p>
        </div>
      </div>

      {/* Map Route Header */}
      <div className="p-4">
        <InteractiveMap
          showRoute={true}
          height="h-[200px]"
          onSelectLandmark={(name, lat, lng) => {
            setToInput(name);
            setDestinationLocation({ latitude: lat, longitude: lng, address: name });
          }}
        />
      </div>

      {/* Form Inputs Container */}
      <div className="px-5 flex-1 flex flex-col justify-between pb-6">
        <div>
          {/* Pickup (From) Location */}
          <div className="my-2">
            <div className="flex items-center justify-between mb-1">
              <label className="text-[11px] font-JakartaBold text-neutral-300 uppercase tracking-wider">
                From (Pickup Location)
              </label>
              <button
                type="button"
                onClick={handleUseCurrentLocation}
                className="flex items-center gap-1 text-[11px] font-JakartaSemiBold text-[#0286FF] hover:underline"
              >
                <Crosshair className="w-3 h-3" />
                <span>Use current location</span>
              </button>
            </div>
            <div
              className={`flex items-center glass-panel border rounded-2xl px-3.5 py-2.5 transition-all ${
                activeInput === 'from' ? 'border-[#0286FF] ring-2 ring-blue-500/30' : 'border-white/[0.08]'
              }`}
            >
              <img src="/assets/icons/target.png" alt="pickup" className="w-4 h-4 mr-2.5 opacity-80 invert" />
              <input
                type="text"
                value={fromInput}
                onFocus={() => setActiveInput('from')}
                onChange={(e) => setFromInput(e.target.value)}
                placeholder="Choose pickup location"
                className="w-full text-sm font-JakartaMedium text-white placeholder-neutral-500 focus:outline-none bg-transparent"
              />
              {fromInput && (
                <button
                  type="button"
                  onClick={() => setFromInput('')}
                  className="p-1 text-neutral-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Destination (To) Field */}
          <div className="my-2">
            <label className="block text-[11px] font-JakartaBold text-neutral-300 mb-1 uppercase tracking-wider">
              To (Destination)
            </label>
            <div
              className={`flex items-center glass-panel border rounded-2xl px-3.5 py-2.5 transition-all ${
                activeInput === 'to' ? 'border-[#0286FF] ring-2 ring-blue-500/30' : 'border-white/[0.08]'
              }`}
            >
              <img src="/assets/icons/point.png" alt="destination" className="w-4 h-4 mr-2.5 opacity-80" />
              <input
                type="text"
                value={toInput}
                onFocus={() => setActiveInput('to')}
                onChange={(e) => setToInput(e.target.value)}
                placeholder="Where to in Lagos?"
                className="w-full text-sm font-JakartaMedium text-white placeholder-neutral-500 focus:outline-none bg-transparent"
              />
              {toInput && (
                <button
                  type="button"
                  onClick={() => setToInput('')}
                  className="p-1 text-neutral-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Pickup Instructions Field (Optional Note for Driver) */}
          <div className="my-2">
            <label className="block text-[11px] font-JakartaBold text-neutral-300 mb-1 uppercase tracking-wider">
              Pickup Instructions (Optional)
            </label>
            <div className="flex items-center glass-panel border border-white/[0.08] rounded-2xl px-3.5 py-2 transition-all focus-within:border-[#0286FF] focus-within:ring-2 focus-within:ring-blue-500/30">
              <input
                type="text"
                value={pickupInstructions}
                onChange={(e) => setPickupInstructions(e.target.value)}
                placeholder="e.g. Waiting at second gate beside the pharmacy"
                className="w-full text-xs font-JakartaMedium text-white placeholder-neutral-500 focus:outline-none bg-transparent"
              />
            </div>
          </div>

          {/* Neighborhood & Short-Distance Ride Presets */}
          <div className="mt-3">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-JakartaBold text-neutral-400 uppercase tracking-wider block">
                Short-Distance / Neighborhood Rides
              </span>
              <span className="text-[10px] text-[#0286FF] font-JakartaBold bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded-full">
                Quick Dispatch
              </span>
            </div>
            <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
              {[
                { name: 'Estate Security Gate', dist: '500m', lat: 6.4480, lng: 3.4730 },
                { name: 'Admiralty Shopping Mall', dist: '1.0 km', lat: 6.4495, lng: 3.4760 },
                { name: 'Local Market & Bus Stop', dist: '1.5 km', lat: 6.4520, lng: 3.4800 },
                { name: 'Victoria Island Ferry Jet', dist: '2.5 km', lat: 6.4290, lng: 3.4240 },
                { name: 'Lekki Medical Diagnostic', dist: '3.0 km', lat: 6.4460, lng: 3.4850 },
              ].map((preset, pIdx) => (
                <button
                  key={pIdx}
                  type="button"
                  onClick={() =>
                    handleSelectLocation({
                      name: preset.name,
                      address: `${preset.name} (${preset.dist})`,
                      latitude: preset.lat,
                      longitude: preset.lng,
                    })
                  }
                  className="px-2.5 py-1.5 rounded-xl glass-panel border border-white/10 hover:border-blue-400 hover:bg-blue-500/10 text-neutral-300 hover:text-white text-xs font-JakartaMedium shrink-0 transition-all flex items-center gap-1.5"
                >
                  <span className="font-JakartaBold text-white text-[11px]">{preset.name}</span>
                  <span className="text-[10px] font-mono text-blue-400 bg-blue-500/10 px-1.5 py-0.5 rounded-md">
                    {preset.dist}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Saved Locations (Home, Work) */}
          <div className="mt-3.5">
            <span className="text-[11px] font-JakartaBold text-neutral-400 uppercase tracking-wider block mb-1.5">
              Saved Locations
            </span>
            <div className="grid grid-cols-2 gap-2">
              {savedLocations.map((loc) => {
                const isSelected = toInput === loc.title || toInput === loc.address;
                const IconComponent = loc.type === 'home' ? Home : Briefcase;
                return (
                  <div
                    key={loc.id}
                    onClick={() =>
                      handleSelectLocation({
                        title: loc.title,
                        address: loc.address,
                        latitude: loc.latitude,
                        longitude: loc.longitude,
                      })
                    }
                    className={`p-2.5 rounded-2xl border cursor-pointer transition-all flex items-start gap-2.5 ${
                      isSelected
                        ? 'bg-blue-500/15 border-[#0286FF] ring-1 ring-[#0286FF]'
                        : 'glass-panel border-white/[0.08] hover:bg-white/5'
                    }`}
                  >
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                        loc.type === 'home'
                          ? 'bg-amber-500/10 text-amber-400'
                          : 'bg-blue-500/10 text-[#0286FF]'
                      }`}
                    >
                      <IconComponent className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-JakartaBold text-white leading-tight">
                        {loc.title}
                      </p>
                      <p className="text-[10px] font-JakartaMedium text-neutral-400 truncate mt-0.5">
                        {loc.address}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Popular / Recent Destinations */}
          <div className="mt-4">
            <span className="text-[11px] font-JakartaBold text-neutral-400 uppercase tracking-wider block mb-1.5">
              Popular Lagos Destinations
            </span>
            <div className="space-y-1.5 max-h-[140px] overflow-y-auto">
              {filteredPopular.slice(0, 4).map((dest, idx) => (
                <div
                  key={idx}
                  onClick={() =>
                    handleSelectLocation({
                      name: dest.name,
                      address: dest.address,
                      latitude: dest.latitude,
                      longitude: dest.longitude,
                    })
                  }
                  className={`flex items-center justify-between p-2.5 rounded-2xl border text-xs cursor-pointer transition-all ${
                    toInput === dest.name
                      ? 'bg-blue-500/15 border-[#0286FF] text-white font-JakartaBold'
                      : 'glass-panel border-white/[0.08] text-neutral-300 hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center shrink-0 text-neutral-400">
                      <MapPin className="w-3 h-3 text-[#0286FF]" />
                    </div>
                    <div className="truncate">
                      <p className="font-JakartaSemiBold text-white truncate leading-tight">
                        {dest.name}
                      </p>
                      <p className="text-[10px] text-neutral-400 font-JakartaMedium truncate">
                        {dest.address}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Find Now Button */}
        <button
          onClick={handleFindNow}
          className="w-full mt-4 py-3.5 rounded-full bg-[#0286FF] hover:bg-blue-500 active:scale-[0.99] text-white font-JakartaBold text-sm shadow-[0_0_20px_rgba(2,134,255,0.4)] transition-all flex items-center justify-center gap-2"
        >
          <span>Find Available Rides</span>
        </button>
      </div>
    </div>
  );
};
