import React from 'react';
import { useBroaderStore } from '../store/useBroaderStore';
import { InteractiveMap } from '../components/InteractiveMap';
import { RideCard } from '../components/RideCard';
import { getVehicle3DImage, VEHICLE_3D_ASSETS } from '../data/vehicleAssets';
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
  Sparkles,
  ArrowRight,
  ShieldCheck,
  ChevronRight,
  LogOut,
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
  const setSelectedVehicle = useBroaderStore((s) => s.setSelectedVehicle);

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

  // 3D Showcase vehicles
  const showcase3DFleet = [
    {
      id: 'car',
      name: 'Broader Sedan',
      category: 'car',
      tag: 'Popular',
      image: VEHICLE_3D_ASSETS.car,
      price: '₦2,800',
    },
    {
      id: 'suv',
      name: 'Executive SUV',
      category: 'suv',
      tag: 'Luxury',
      image: VEHICLE_3D_ASSETS.suv,
      price: '₦5,200',
    },
    {
      id: 'motorcycle',
      name: 'Speed Bike',
      category: 'motorcycle',
      tag: 'Fastest',
      image: VEHICLE_3D_ASSETS.motorcycle,
      price: '₦1,100',
    },
    {
      id: 'tricycle',
      name: 'Keke Napep',
      category: 'tricycle',
      tag: 'Economy',
      image: VEHICLE_3D_ASSETS.tricycle,
      price: '₦950',
    },
    {
      id: 'van',
      name: 'Group Van',
      category: 'van',
      tag: '7 Seats',
      image: VEHICLE_3D_ASSETS.van,
      price: '₦6,500',
    },
    {
      id: 'truck',
      name: 'Cargo Truck',
      category: 'pickup',
      tag: 'Freight',
      image: VEHICLE_3D_ASSETS.truck,
      price: '₦12,000',
    },
    {
      id: 'ambulance',
      name: 'Emergency Medic',
      category: 'ambulance',
      tag: 'Emergency',
      image: VEHICLE_3D_ASSETS.ambulance,
      price: '₦15,000',
    },
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

  const handleSelect3DVehicle = (vehicleCategory: any) => {
    setSelectedVehicle(vehicleCategory);
    setScreen('find-ride');
  };

  return (
    <div className="flex flex-col min-h-full bg-[#000000] text-white p-4 pb-10 select-none">
      {/* 1. Frosted Glass Top Navigation & Greeting */}
      <div className="flex items-center justify-between pt-1 pb-3">
        <div>
          <h2 className="text-xl font-JakartaExtraBold text-white tracking-tight leading-tight">
            {getGreeting()}, {user.firstName || 'Chris'}
          </h2>
          <p className="text-xs font-JakartaMedium text-neutral-400 mt-0.5">
            Where are you heading today?
          </p>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Driver Mode Quick Switch - Frosted Amber */}
          <button
            onClick={() => {
              setIsDriverMode(true);
              setScreen('driver-home');
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 shadow-lg hover:bg-amber-500/20 active:scale-95 transition-all text-xs font-JakartaBold backdrop-blur-xl"
            title="Switch to Broader Driver Console"
          >
            <Car className="w-3.5 h-3.5 text-amber-400" />
            <span>Driver</span>
          </button>

          {/* Quick Wallet Pill - Frosted Glass */}
          <button
            onClick={() => setScreen('wallet')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full glass-panel glass-panel-hover text-white shadow-lg active:scale-95 transition-all"
            title="Open Broader Wallet"
          >
            <Wallet className="w-3.5 h-3.5 text-[#0286FF]" />
            <span className="text-xs font-JakartaBold">₦{walletBalance.toLocaleString()}</span>
          </button>

          <button
            onClick={signOut}
            className="w-9 h-9 rounded-full glass-panel glass-panel-hover flex items-center justify-center transition-colors text-neutral-300 hover:text-white"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. Quick Services Selector - Frosted Glass Grid */}
      <div className="grid grid-cols-5 gap-1.5 my-2">
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
              className={`flex flex-col items-center justify-center py-2.5 px-1 rounded-2xl border transition-all backdrop-blur-xl ${
                isActive
                  ? 'bg-[#0286FF] text-white border-[#0286FF] shadow-[0_0_16px_rgba(2,134,255,0.4)]'
                  : 'glass-panel glass-panel-hover text-neutral-300'
              }`}
            >
              <Icon className={`w-4 h-4 mb-1 ${isActive ? 'text-white' : 'text-neutral-300'}`} />
              <span className="text-[11px] font-JakartaSemiBold tracking-tight">
                {svc.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* 3. Primary Destination Search Bar - Minimalist Frosted Glass */}
      <div className="my-2">
        <div
          onClick={() => setScreen('find-ride')}
          className="flex items-center gap-3 glass-panel glass-panel-hover p-3.5 rounded-2xl cursor-pointer group shadow-xl border border-white/[0.1] backdrop-blur-2xl"
        >
          <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-[#0286FF] group-hover:scale-105 transition-transform shrink-0">
            <Search className="w-4 h-4" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-JakartaBold text-white truncate">
              Where are you going?
            </p>
            <p className="text-[11px] text-neutral-400 font-JakartaMedium truncate">
              Search Lagos airport, Lekki, VI, Ikeja...
            </p>
          </div>
          <span className="text-xs font-JakartaBold px-3 py-1.5 rounded-xl bg-[#0286FF] text-white shadow-[0_0_12px_rgba(2,134,255,0.4)]">
            Search
          </span>
        </div>
      </div>

      {/* 4. Lifelike 3D Vehicle Fleet Showcase (Frosted Glass Horizontal Scroll) */}
      <div className="my-2.5">
        <div className="flex items-center justify-between mb-2 px-1">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#0286FF]" />
            <h3 className="text-xs font-JakartaBold text-white tracking-wide uppercase">
              Lifelike 3D Fleet
            </h3>
          </div>
          <span className="text-[10px] text-neutral-400 font-JakartaMedium">
            Tap to book
          </span>
        </div>

        <div className="flex items-center gap-3 overflow-x-auto pb-2 pt-0.5 no-scrollbar">
          {showcase3DFleet.map((item) => (
            <div
              key={item.id}
              onClick={() => handleSelect3DVehicle(item.category)}
              className="w-[145px] shrink-0 glass-panel glass-panel-hover rounded-2xl p-2.5 flex flex-col items-center cursor-pointer group border border-white/[0.08] backdrop-blur-xl transition-all hover:border-[#0286FF]/50"
            >
              {/* Tag pill */}
              <div className="w-full flex justify-between items-center mb-1">
                <span className="text-[9px] font-JakartaBold text-blue-400 bg-blue-500/10 border border-blue-500/20 px-1.5 py-0.5 rounded-md">
                  {item.tag}
                </span>
                <span className="text-[10px] font-JakartaBold text-white">
                  {item.price}
                </span>
              </div>

              {/* 3D Vehicle Image Render */}
              <div className="w-full h-20 rounded-xl bg-black/70 border border-white/10 overflow-hidden relative my-1 flex items-center justify-center group-hover:border-white/20 transition-all">
                <img
                  src={item.image}
                  alt={item.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
              </div>

              {/* Name & Book CTA */}
              <div className="w-full flex items-center justify-between mt-1">
                <span className="text-xs font-JakartaBold text-white truncate max-w-[95px]">
                  {item.name}
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-neutral-400 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Map-First Home Experience (Dark Obsidian + Frosted Overlays) */}
      <div className="my-2">
        <div className="flex items-center justify-between mb-1.5 px-0.5">
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-[#0286FF]" />
            <span className="text-xs font-JakartaBold text-white">Live Lagos Map</span>
          </div>
          <span className="text-[10px] font-JakartaMedium text-neutral-400 glass-panel px-2.5 py-0.5 rounded-full border border-white/10">
            {userAddress ? userAddress.split(',')[0] : 'Victoria Island'}
          </span>
        </div>

        <InteractiveMap
          showRoute={false}
          height="h-[280px] sm:h-[320px]"
          onSelectLandmark={(name, lat, lng) => {
            setDestinationLocation({ latitude: lat, longitude: lng, address: name });
            setScreen('confirm-ride');
          }}
        />
      </div>

      {/* 6. Saved & Recent Destination Chips (Frosted Glass) */}
      <div className="my-2">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {/* Home */}
          {savedLocations
            .filter((l) => l.type === 'home')
            .map((loc) => (
              <button
                key={loc.id}
                onClick={() => handleQuickDestination(loc)}
                className="flex items-center gap-2.5 glass-panel glass-panel-hover px-3 py-2 rounded-xl text-left shrink-0 transition-all border border-white/[0.08]"
              >
                <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center shrink-0">
                  <HomeIcon className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] font-JakartaBold text-white leading-tight">
                    {loc.title}
                  </p>
                  <p className="text-[9px] text-neutral-400 font-JakartaMedium truncate max-w-[85px]">
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
                className="flex items-center gap-2.5 glass-panel glass-panel-hover px-3 py-2 rounded-xl text-left shrink-0 transition-all border border-white/[0.08]"
              >
                <div className="w-7 h-7 rounded-lg bg-blue-500/10 border border-blue-500/30 text-[#0286FF] flex items-center justify-center shrink-0">
                  <Briefcase className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] font-JakartaBold text-white leading-tight">
                    {loc.title}
                  </p>
                  <p className="text-[9px] text-neutral-400 font-JakartaMedium truncate max-w-[85px]">
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
              className="flex items-center gap-2.5 glass-panel glass-panel-hover px-3 py-2 rounded-xl text-left shrink-0 transition-all border border-white/[0.08]"
            >
              <div className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 text-neutral-300 flex items-center justify-center shrink-0">
                <Clock className="w-3.5 h-3.5" />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] font-JakartaBold text-white leading-tight truncate max-w-[95px]">
                  {rec.name.split(' ')[0]}
                </p>
                <p className="text-[9px] text-neutral-400 font-JakartaMedium">Recent</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 7. Recent Rides Section */}
      <div className="mt-3">
        <div className="flex items-center justify-between mb-2 px-0.5">
          <h3 className="text-sm font-JakartaBold text-white">Recent Trips</h3>
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
          <div className="flex flex-col items-center justify-center py-8 glass-panel rounded-2xl border border-white/[0.08]">
            <p className="text-xs font-JakartaMedium text-neutral-400">No recent rides found</p>
          </div>
        )}
      </div>
    </div>
  );
};
