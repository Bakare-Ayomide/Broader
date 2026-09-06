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
    <div className="flex flex-col min-h-full bg-[#F6F8FA] select-none">
      {/* Navigation Header */}
      <div className="flex items-center px-4 py-3.5 bg-white border-b border-slate-200">
        <button
          onClick={() => setScreen('home')}
          className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors mr-3"
          title="Back to Home"
        >
          <ArrowLeft className="w-4 h-4 text-slate-700" />
        </button>
        <div>
          <h2 className="text-base font-JakartaBold text-slate-900 leading-tight">Choose Destination</h2>
          <p className="text-[11px] font-JakartaMedium text-slate-500">Select pickup and drop-off in Lagos</p>
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
              <label className="text-[11px] font-JakartaBold text-slate-700 uppercase tracking-wider">
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
              className={`flex items-center bg-white border rounded-2xl px-3.5 py-2.5 transition-all shadow-xs ${
                activeInput === 'from' ? 'border-[#0286FF] ring-2 ring-blue-100' : 'border-slate-200'
              }`}
            >
              <img src="/assets/icons/target.png" alt="pickup" className="w-4 h-4 mr-2.5 opacity-80" />
              <input
                type="text"
                value={fromInput}
                onFocus={() => setActiveInput('from')}
                onChange={(e) => setFromInput(e.target.value)}
                placeholder="Choose pickup location"
                className="w-full text-sm font-JakartaMedium text-slate-900 focus:outline-none bg-transparent"
              />
              {fromInput && (
                <button
                  type="button"
                  onClick={() => setFromInput('')}
                  className="p-1 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Destination (To) Field */}
          <div className="my-2">
            <label className="block text-[11px] font-JakartaBold text-slate-700 mb-1 uppercase tracking-wider">
              To (Destination)
            </label>
            <div
              className={`flex items-center bg-white border rounded-2xl px-3.5 py-2.5 transition-all shadow-xs ${
                activeInput === 'to' ? 'border-[#0286FF] ring-2 ring-blue-100' : 'border-slate-200'
              }`}
            >
              <img src="/assets/icons/point.png" alt="destination" className="w-4 h-4 mr-2.5 opacity-80" />
              <input
                type="text"
                value={toInput}
                onFocus={() => setActiveInput('to')}
                onChange={(e) => setToInput(e.target.value)}
                placeholder="Where to in Lagos?"
                className="w-full text-sm font-JakartaMedium text-slate-900 focus:outline-none bg-transparent"
              />
              {toInput && (
                <button
                  type="button"
                  onClick={() => setToInput('')}
                  className="p-1 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Saved Locations (Home, Work) */}
          <div className="mt-3.5">
            <span className="text-[11px] font-JakartaBold text-slate-500 uppercase tracking-wider block mb-1.5">
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
                    className={`p-2.5 rounded-xl border cursor-pointer transition-all flex items-start gap-2.5 ${
                      isSelected
                        ? 'bg-blue-50 border-blue-300 ring-1 ring-blue-300'
                        : 'bg-white border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                        loc.type === 'home'
                          ? 'bg-amber-50 text-amber-600'
                          : 'bg-blue-50 text-[#0286FF]'
                      }`}
                    >
                      <IconComponent className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-JakartaBold text-slate-800 leading-tight">
                        {loc.title}
                      </p>
                      <p className="text-[10px] font-JakartaMedium text-slate-400 truncate mt-0.5">
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
            <span className="text-[11px] font-JakartaBold text-slate-500 uppercase tracking-wider block mb-1.5">
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
                  className={`flex items-center justify-between p-2.5 rounded-xl border text-xs cursor-pointer transition-all ${
                    toInput === dest.name
                      ? 'bg-blue-50 border-blue-300 text-blue-900 font-JakartaBold'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center shrink-0 text-slate-500">
                      <MapPin className="w-3 h-3 text-[#0286FF]" />
                    </div>
                    <div className="truncate">
                      <p className="font-JakartaSemiBold text-slate-800 truncate leading-tight">
                        {dest.name}
                      </p>
                      <p className="text-[10px] text-slate-400 font-JakartaMedium truncate">
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
          className="w-full mt-4 py-3.5 rounded-full bg-[#0286FF] hover:bg-blue-600 active:scale-[0.99] text-white font-JakartaBold text-sm shadow-md shadow-blue-500/25 transition-all flex items-center justify-center gap-2"
        >
          <span>Find Available Rides</span>
        </button>
      </div>
    </div>
  );
};
