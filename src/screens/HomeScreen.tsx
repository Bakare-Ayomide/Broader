import React from 'react';
import { useBroaderStore } from '../store/useBroaderStore';
import { InteractiveMap } from '../components/InteractiveMap';
import { RideCard } from '../components/RideCard';
import {
  Search,
  MapPin,
  Car,
  Key,
  Package,
  Truck,
  Ambulance,
  Home as HomeIcon,
  Briefcase,
  Clock,
  Wallet,
  Plus,
} from 'lucide-react';
import { ServiceType, SavedLocation, RecentDestination } from '../types';

export const HomeScreen: React.FC = () => {
  const user = useBroaderStore((s) => s.user);
  const signOut = useBroaderStore((s) => s.signOut);
  const userAddress = useBroaderStore((s) => s.userAddress);
  const setScreen = useBroaderStore((s) => s.setScreen);
  const rides = useBroaderStore((s) => s.rides);
  const activeService = useBroaderStore((s) => s.activeService);
  const setActiveService = useBroaderStore((s) => s.setActiveService);
  const savedLocations = useBroaderStore((s) => s.savedLocations);
  const recentDestinations = useBroaderStore((s) => s.recentDestinations);
  const setDestinationLocation = useBroaderStore((s) => s.setDestinationLocation);
  const walletBalance = useBroaderStore((s) => s.walletBalance);
  const setIsDriverMode = useBroaderStore((s) => s.setIsDriverMode);

  // Time-of-day greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const services: { id: ServiceType; label: string; icon: React.ElementType }[] = [
    { id: 'ride', label: 'Ride', icon: Car },
    { id: 'rental', label: 'Rental', icon: Key },
    { id: 'parcel', label: 'Parcel', icon: Package },
    { id: 'freight', label: 'Freight', icon: Truck },
    { id: 'ambulance', label: 'Ambulance', icon: Ambulance },
  ];

  const handleQuickDestination = (loc: SavedLocation | RecentDestination) => {
    const title = 'title' in loc ? loc.title : loc.name;
    setDestinationLocation({
      latitude: loc.latitude,
      longitude: loc.longitude,
      address: title,
    });
    setScreen('confirm-ride');
  };

  return (
    <div className="flex flex-col min-h-full bg-[#F6F8FA] p-4 pb-8 select-none">
      {/* 1. Personalized Home Greeting + Wallet Pill + Sign Out */}
      <div className="flex items-center justify-between pt-1 pb-2">
        <div>
          <h2 className="text-xl font-JakartaExtraBold text-slate-900 tracking-tight leading-tight">
            {getGreeting()}, {user.firstName || 'Chris'}
          </h2>
          <p className="text-xs font-JakartaMedium text-slate-500 mt-0.5">
            Where are you going?
          </p>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Driver Mode Quick Switch */}
          <button
            onClick={() => {
              setIsDriverMode(true);
              setScreen('driver-home');
            }}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-700 shadow-xs hover:bg-amber-100 active:scale-95 transition-all text-xs font-JakartaBold"
            title="Switch to Broader Driver Console"
          >
            <Car className="w-3.5 h-3.5 text-amber-600" />
            <span>Driver</span>
          </button>

          {/* Quick Wallet Pill */}
          <button
            onClick={() => setScreen('wallet')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-slate-200 text-slate-800 shadow-xs hover:border-blue-300 active:scale-95 transition-all"
            title="Open Broader Wallet"
          >
            <Wallet className="w-3.5 h-3.5 text-[#0286FF]" />
            <span className="text-xs font-JakartaBold">₦{walletBalance.toLocaleString()}</span>
          </button>

          <button
            onClick={signOut}
            className="w-9 h-9 rounded-full bg-white shadow-xs border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-colors text-slate-700"
            title="Sign Out"
          >
            <img src="/assets/icons/out.png" alt="Sign Out" className="w-4 h-4 object-contain" />
          </button>
        </div>
      </div>

      {/* 4. Quick Services Selector */}
      <div className="grid grid-cols-5 gap-1.5 my-2.5">
        {services.map((svc) => {
          const isActive = activeService === svc.id;
          const Icon = svc.icon;
          return (
            <button
              key={svc.id}
              onClick={() => {
                setActiveService(svc.id);
                if (svc.id === 'rental') setScreen('rental');
                else if (svc.id === 'parcel') setScreen('parcel');
                else if (svc.id === 'freight') setScreen('freight');
                else if (svc.id === 'ambulance') setScreen('ambulance');
              }}
              className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl border transition-all ${
                isActive
                  ? 'bg-[#0286FF] text-white border-[#0286FF] shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-50 border-slate-200'
              }`}
            >
              <Icon className={`w-4 h-4 mb-1 ${isActive ? 'text-white' : 'text-slate-600'}`} />
              <span className="text-[11px] font-JakartaSemiBold tracking-tight">
                {svc.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* 3. Map-First Home Experience (Visually Dominant) */}
      <div className="my-1">
        <div className="flex items-center justify-between mb-1.5 px-0.5">
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-[#0286FF]" />
            <span className="text-xs font-JakartaBold text-slate-900">Live Map • Lagos</span>
          </div>
          <span className="text-[10px] font-JakartaMedium text-slate-500 bg-white px-2 py-0.5 rounded-full border border-slate-200">
            {userAddress ? userAddress.split(',')[0] : 'Victoria Island'}
          </span>
        </div>

        <InteractiveMap
          showRoute={false}
          height="h-[320px] sm:h-[360px]"
          onSelectLandmark={(name, lat, lng) => {
            setDestinationLocation({ latitude: lat, longitude: lng, address: name });
            setScreen('confirm-ride');
          }}
        />
      </div>

      {/* 2. Destination Search & Quick Location Shortcuts */}
      <div className="mt-3">
        {/* Primary Destination Search Bar */}
        <div
          onClick={() => setScreen('find-ride')}
          className="flex items-center gap-3 bg-white p-3 rounded-2xl shadow-xs border border-slate-200 hover:border-blue-300 transition-all cursor-pointer group mb-2.5"
        >
          <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-[#0286FF] group-hover:scale-105 transition-transform">
            <Search className="w-4 h-4" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-JakartaSemiBold text-slate-800 truncate">
              Where are you going?
            </p>
            <p className="text-[11px] text-slate-400 font-JakartaMedium truncate">
              Search destination, airport, island...
            </p>
          </div>
          <span className="text-[11px] font-JakartaBold px-2.5 py-1 rounded-lg bg-[#0286FF] text-white">
            Search
          </span>
        </div>

        {/* Saved & Recent Destination Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar mb-4">
          {/* Home */}
          {savedLocations
            .filter((l) => l.type === 'home')
            .map((loc) => (
              <button
                key={loc.id}
                onClick={() => handleQuickDestination(loc)}
                className="flex items-center gap-2 bg-white border border-slate-200 hover:border-blue-300 px-3 py-1.5 rounded-xl text-left shrink-0 transition-all"
              >
                <div className="w-6 h-6 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                  <HomeIcon className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] font-JakartaBold text-slate-800 leading-tight">
                    {loc.title}
                  </p>
                  <p className="text-[9px] text-slate-400 font-JakartaMedium truncate max-w-[85px]">
                    {loc.address.split(',')[0]}
                  </p>
                </div>
              </button>
            ))}

          {/* Work */}
          {savedLocations
            .filter((l) => l.type === 'work')
            .map((loc) => (
              <button
                key={loc.id}
                onClick={() => handleQuickDestination(loc)}
                className="flex items-center gap-2 bg-white border border-slate-200 hover:border-blue-300 px-3 py-1.5 rounded-xl text-left shrink-0 transition-all"
              >
                <div className="w-6 h-6 rounded-lg bg-blue-50 text-[#0286FF] flex items-center justify-center shrink-0">
                  <Briefcase className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] font-JakartaBold text-slate-800 leading-tight">
                    {loc.title}
                  </p>
                  <p className="text-[9px] text-slate-400 font-JakartaMedium truncate max-w-[85px]">
                    {loc.address.split(',')[0]}
                  </p>
                </div>
              </button>
            ))}

          {/* Recent Destination */}
          {recentDestinations.slice(0, 2).map((rec) => (
            <button
              key={rec.id}
              onClick={() => handleQuickDestination(rec)}
              className="flex items-center gap-2 bg-white border border-slate-200 hover:border-blue-300 px-3 py-1.5 rounded-xl text-left shrink-0 transition-all"
            >
              <div className="w-6 h-6 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center shrink-0">
                <Clock className="w-3.5 h-3.5" />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] font-JakartaBold text-slate-800 leading-tight truncate max-w-[95px]">
                  {rec.name.split(' ')[0]}
                </p>
                <p className="text-[9px] text-slate-400 font-JakartaMedium">Recent</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Recent Rides */}
      <div>
        <div className="flex items-center justify-between mb-2.5">
          <h3 className="text-base font-JakartaBold text-slate-900">Recent Rides</h3>
          <button
            onClick={() => setScreen('rides')}
            className="text-xs font-JakartaSemiBold text-[#0286FF] hover:underline"
          >
            View All
          </button>
        </div>

        {rides.length > 0 ? (
          <div className="space-y-2.5">
            {rides.slice(0, 2).map((ride, idx) => (
              <RideCard key={ride.ride_id || idx} ride={ride} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 bg-white rounded-2xl border border-slate-200">
            <img
              src="/assets/images/no-result.png"
              alt="No rides"
              className="w-24 h-24 object-contain opacity-70"
            />
            <p className="text-xs font-JakartaMedium text-slate-500 mt-2">No recent rides found</p>
          </div>
        )}
      </div>
    </div>
  );
};
