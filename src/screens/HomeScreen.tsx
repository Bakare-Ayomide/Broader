import React, { useState } from 'react';
import { useBroaderStore } from '../store/useBroaderStore';
import { InteractiveMap } from '../components/InteractiveMap';
import { RideCard } from '../components/RideCard';
import { BROADER_3D_FLEET } from '../data/vehicleAssets';
import { PassengerHUD } from '../components/dashboard/PassengerHUD';
import { useRideSimulation } from '../components/simulation/useRideSimulation';
import { AutoPartsScreen } from './AutoPartsScreen';
import { ParcelScreen } from './ParcelScreen';
import { RentalScreen } from './RentalScreen';
import { FreightScreen } from './FreightScreen';
import { AmbulanceScreen } from './AmbulanceScreen';
import {
  Search,
  MapPin,
  Car,
  Key,
  Package,
  Truck,
  HeartPulse,
  Wrench,
  Home as HomeIcon,
  Briefcase,
  Clock,
  Wallet,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  ChevronRight,
  LogOut,
  Gauge,
  X,
  Users,
} from 'lucide-react';
import { ServiceType, SavedLocation, RecentDestination } from '../types';
import { soundEngine } from '../services/soundNotification';

type ModalType = 'none' | 'parts' | 'parcel' | 'rental' | 'freight' | 'ambulance';

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

  const [activeModal, setActiveModal] = useState<ModalType>('none');
  const [showTelemetryHUD, setShowTelemetryHUD] = useState(false);
  const telemetry = useRideSimulation({ active: showTelemetryHUD });

  // Time-of-day greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const displayName = user.firstName || user.name?.split(' ')[0] || 'Chris';

  const services = [
    { id: 'ride', label: 'Ride', icon: Car, modal: 'none' as ModalType },
    { id: 'parts', label: 'Auto Parts', icon: Wrench, modal: 'parts' as ModalType },
    { id: 'parcel', label: 'Parcel', icon: Package, modal: 'parcel' as ModalType },
    { id: 'rental', label: 'Rental', icon: Key, modal: 'rental' as ModalType },
    { id: 'freight', label: 'Freight', icon: Truck, modal: 'freight' as ModalType },
    { id: 'ambulance', label: 'Ambulance', icon: HeartPulse, modal: 'ambulance' as ModalType },
  ];

  const handleServiceClick = (svc: typeof services[0]) => {
    soundEngine.playClick();
    if (svc.modal !== 'none') {
      setActiveModal(svc.modal);
    } else {
      setActiveService('ride');
      setScreen('find-ride');
    }
  };

  const closeModal = () => {
    soundEngine.playClick();
    setActiveModal('none');
  };

  const handleQuickDestination = (loc: SavedLocation | RecentDestination) => {
    soundEngine.playClick();
    const title = 'title' in loc ? loc.title : loc.name;
    setDestinationLocation({
      latitude: loc.latitude,
      longitude: loc.longitude,
      address: title,
    });
    setScreen('confirm-ride');
  };

  const handleSelect3DVehicle = (vehicleCategory: any) => {
    soundEngine.playClick();
    setSelectedVehicle(vehicleCategory);
    setScreen('find-ride');
  };

  return (
    <div className="relative w-full h-full min-h-screen overflow-hidden bg-[#020408] text-white select-none">
      {/* 1. FULL-WIDTH, FULL-SCREEN LIVING MAP BACKDROP */}
      <div className="absolute inset-0 w-full h-full z-0 pointer-events-auto">
        <InteractiveMap
          showRoute={showTelemetryHUD}
          height="h-full"
          className="w-full h-full rounded-none border-0 shadow-none"
          topOffset="top-[70px]"
          onSelectLandmark={(name, lat, lng) => {
            soundEngine.playClick();
            setDestinationLocation({ latitude: lat, longitude: lng, address: name });
            setScreen('confirm-ride');
          }}
        />
      </div>

      {/* 2. FLOATING TOP STATUS BAR */}
      <header className="absolute top-2 left-3 right-3 z-30 glass-nav rounded-2xl border border-white/[0.12] px-3.5 py-2.5 shadow-2xl backdrop-blur-2xl flex items-center justify-between">
        <div className="min-w-0 pr-2">
          {/* Greeting strictly on one line */}
          <h2 className="text-sm font-JakartaBold text-white tracking-tight leading-snug truncate">
            {getGreeting()}, <span className="text-[#0286FF]">{displayName}</span>
          </h2>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
            <span className="text-[11px] font-JakartaMedium text-neutral-400 truncate max-w-[150px] sm:max-w-[220px]">
              {userAddress ? userAddress.split(',')[0] : 'Victoria Island, Lagos'}
            </span>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Driver Mode Console Switch */}
          <button
            onClick={() => {
              soundEngine.playClick();
              setIsDriverMode(true);
              setScreen('driver-home');
            }}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/40 text-amber-300 shadow-md hover:bg-amber-500/25 active:scale-95 transition-all text-[11px] font-JakartaBold backdrop-blur-xl"
            title="Switch to Broader Driver Console"
          >
            <Car className="w-3.5 h-3.5 text-amber-400" />
            <span>Driver</span>
          </button>

          {/* Quick Wallet Balance */}
          <button
            onClick={() => {
              soundEngine.playClick();
              setScreen('wallet');
            }}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full glass-panel hover:bg-white/10 text-white shadow-md active:scale-95 transition-all border border-white/10"
            title="Open Broader Wallet"
          >
            <Wallet className="w-3.5 h-3.5 text-[#0286FF]" />
            <span className="text-xs font-JakartaBold">₦{walletBalance.toLocaleString()}</span>
          </button>

          <button
            onClick={() => {
              soundEngine.playClick();
              signOut();
            }}
            className="w-8 h-8 rounded-full glass-panel hover:bg-white/10 flex items-center justify-center transition-colors text-neutral-400 hover:text-white border border-white/10"
            title="Sign Out"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* Floating Telematics HUD Toggle on Map */}
      <div className="absolute top-[68px] left-3 z-30">
        <button
          onClick={() => {
            soundEngine.playClick();
            setShowTelemetryHUD((v) => !v);
          }}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full backdrop-blur-xl border text-[11px] font-JakartaBold shadow-2xl transition-all active:scale-95 ${
            showTelemetryHUD
              ? 'bg-[#0286FF] text-white border-[#0286FF] shadow-[0_0_16px_rgba(2,134,255,0.6)]'
              : 'bg-black/85 text-cyan-300 border-cyan-500/40 hover:bg-black'
          }`}
        >
          <Gauge className="w-3.5 h-3.5 text-cyan-400" />
          <span>{showTelemetryHUD ? 'Hide HUD' : 'Telematics HUD'}</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        </button>
      </div>

      {/* COMPACT PASSENGER HUD */}
      {showTelemetryHUD && (
        <div className="absolute top-[108px] left-3 right-3 max-w-sm z-30 pointer-events-auto">
          <PassengerHUD
            speed={telemetry.speed}
            speedLimit={telemetry.speedLimit}
            etaMinutes={telemetry.etaMinutes}
            distanceKm={telemetry.distanceRemainingKm}
            currentInstruction={telemetry.currentInstruction}
            streetName={telemetry.streetName}
            fuelLevel={telemetry.fuelLevel}
            onOpenStreetView={() => {
              const btn = document.querySelector('[title="Open 3D Street View"]') as HTMLButtonElement;
              if (btn) btn.click();
            }}
          />
        </div>
      )}

      {/* 3. SCROLLABLE BOTTOM SELECTION DRAWER OVER FULL-SCREEN MAP */}
      <div className="absolute bottom-[72px] left-0 right-0 z-20 max-h-[50vh] sm:max-h-[55vh] flex flex-col rounded-t-[32px] bg-[#020408]/92 backdrop-blur-2xl border-t border-x border-white/[0.12] shadow-[0_-16px_48px_rgba(0,0,0,0.95)] overflow-hidden transition-all">
        {/* Subtle grab bar indicator */}
        <div className="w-12 h-1 bg-white/30 rounded-full mx-auto my-2.5 shrink-0" />

        {/* Scrollable Selections Content */}
        <div className="flex-1 overflow-y-auto px-4 pb-6 space-y-4 no-scrollbar pointer-events-auto">
        {/* Destination Search Capsule */}
        <div
          onClick={() => {
            soundEngine.playClick();
            setScreen('find-ride');
          }}
          className="flex items-center gap-3 bg-black/90 backdrop-blur-2xl p-3 rounded-2xl cursor-pointer group shadow-[0_10px_30px_rgba(0,0,0,0.8)] border border-white/[0.12] transition-all hover:border-[#0286FF]/60 active:scale-[0.99]"
        >
          <div className="w-9 h-9 rounded-xl bg-[#0286FF]/15 border border-[#0286FF]/40 flex items-center justify-center text-[#0286FF] group-hover:scale-105 transition-transform shrink-0">
            <Search className="w-4 h-4" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-JakartaBold text-white truncate">
              Where to?
            </p>
            <p className="text-[11px] text-neutral-400 font-JakartaMedium truncate">
              Search Lagos airport, Lekki, VI, Ikeja, Ikoyi...
            </p>
          </div>
          <span className="text-xs font-JakartaBold px-3 py-1.5 rounded-xl bg-[#0286FF] text-white shadow-[0_0_15px_rgba(2,134,255,0.4)] shrink-0">
            Plan Trip
          </span>
        </div>

        {/* 4. CLEAN SERVICES BAR (RIDE + MODAL SERVICES) */}
        <div>
          <div className="flex items-center justify-between mb-1.5 px-1">
            <span className="text-[10px] font-JakartaBold text-neutral-400 uppercase tracking-wider">
              Broader Services & Modals
            </span>
          </div>
          <div className="grid grid-cols-6 gap-1.5">
            {services.map((svc) => {
              const Icon = svc.icon;
              return (
                <button
                  key={svc.id}
                  onClick={() => handleServiceClick(svc)}
                  className="flex flex-col items-center justify-center py-2.5 px-1 rounded-2xl border border-white/[0.08] glass-panel hover:bg-white/10 hover:border-[#0286FF]/50 text-neutral-300 hover:text-white transition-all backdrop-blur-xl active:scale-95"
                >
                  <Icon className="w-4 h-4 mb-1 text-cyan-300" />
                  <span className="text-[10px] font-JakartaSemiBold tracking-tight truncate w-full text-center">
                    {svc.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 5. 3D VEHICLE FLEET SHOWCASE */}
        <div className="pt-0.5">
          <div className="flex items-center justify-between mb-1.5 px-1">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#0286FF]" />
              <h3 className="text-xs font-JakartaBold text-white tracking-wide uppercase">
                3D Vehicle Fleet
              </h3>
            </div>
            <span className="text-[10px] text-neutral-400 font-JakartaMedium">
              Tap vehicle to select
            </span>
          </div>

          <div className="flex items-center gap-2.5 overflow-x-auto pb-1 no-scrollbar">
            {BROADER_3D_FLEET.map((item) => (
              <div
                key={item.id}
                onClick={() => handleSelect3DVehicle(item.category)}
                className="w-[145px] sm:w-[160px] shrink-0 glass-panel rounded-2xl p-2.5 flex flex-col items-center cursor-pointer group border border-white/[0.08] backdrop-blur-xl transition-all hover:border-[#0286FF]/50 relative active:scale-95"
              >
                {/* Header Tag & Price */}
                <div className="w-full flex justify-between items-center mb-0.5">
                  <span className="text-[9px] font-JakartaBold text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-1.5 py-0.5 rounded-md">
                    {item.tag}
                  </span>
                  <span className="text-[10px] font-JakartaBold text-white">
                    ₦{item.basePriceNaira.toLocaleString()}
                  </span>
                </div>

                {/* 3D Transparent Vehicle Image with Ground Shadow */}
                <div className="w-full h-16 relative my-1 flex items-center justify-center">
                  <div className="absolute bottom-1 w-24 h-2.5 bg-black/80 rounded-full blur-[2px] pointer-events-none" />
                  <img
                    src={item.image}
                    alt={item.name}
                    referrerPolicy="no-referrer"
                    className="max-h-14 w-auto object-contain group-hover:scale-105 transition-transform duration-300 filter drop-shadow-[0_6px_12px_rgba(0,0,0,0.9)]"
                  />
                </div>

                {/* Vehicle Name & Seats */}
                <div className="w-full flex items-center justify-between mt-0.5 pt-1 border-t border-white/[0.06]">
                  <div className="min-w-0 flex-1">
                    <span className="text-[11px] font-JakartaBold text-white truncate block">
                      {item.name}
                    </span>
                    <span className="text-[9px] text-neutral-400 font-JakartaMedium flex items-center gap-1">
                      <Users className="w-2.5 h-2.5" />
                      {item.seats} seats • {item.etaMinutes}m
                    </span>
                  </div>
                  <ChevronRight className="w-3 h-3 text-neutral-400 group-hover:text-white shrink-0 ml-1" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 6. QUICK DESTINATION SHORTCUTS */}
        <div>
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            {savedLocations
              .filter((l) => l.type === 'home')
              .map((loc) => (
                <button
                  key={loc.id}
                  onClick={() => handleQuickDestination(loc)}
                  className="flex items-center gap-2 glass-panel px-3 py-1.5 rounded-xl text-left shrink-0 transition-all border border-white/[0.08] hover:border-white/20 active:scale-95"
                >
                  <div className="w-6 h-6 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center shrink-0">
                    <HomeIcon className="w-3 h-3" />
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

            {savedLocations
              .filter((l) => l.type === 'work')
              .map((loc) => (
                <button
                  key={loc.id}
                  onClick={() => handleQuickDestination(loc)}
                  className="flex items-center gap-2 glass-panel px-3 py-1.5 rounded-xl text-left shrink-0 transition-all border border-white/[0.08] hover:border-white/20 active:scale-95"
                >
                  <div className="w-6 h-6 rounded-lg bg-blue-500/10 border border-blue-500/30 text-[#0286FF] flex items-center justify-center shrink-0">
                    <Briefcase className="w-3 h-3" />
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

            {recentDestinations.slice(0, 2).map((rec) => (
              <button
                key={rec.id}
                onClick={() => handleQuickDestination(rec)}
                className="flex items-center gap-2 glass-panel px-3 py-1.5 rounded-xl text-left shrink-0 transition-all border border-white/[0.08] hover:border-white/20 active:scale-95"
              >
                <div className="w-6 h-6 rounded-lg bg-white/5 border border-white/10 text-neutral-300 flex items-center justify-center shrink-0">
                  <Clock className="w-3 h-3" />
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

        {/* 7. RECENT TRIPS */}
        <div>
          <div className="flex items-center justify-between mb-1.5 px-1">
            <h3 className="text-xs font-JakartaBold text-white">Recent Trips</h3>
            <button
              onClick={() => {
                soundEngine.playClick();
                setScreen('rides');
              }}
              className="text-[11px] font-JakartaSemiBold text-[#0286FF] hover:underline"
            >
              View All
            </button>
          </div>

          {rides.length > 0 ? (
            <div className="space-y-2">
              {rides.slice(0, 1).map((ride, idx) => (
                <RideCard key={ride.ride_id || idx} ride={ride} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-4 glass-panel rounded-2xl border border-white/[0.08]">
              <p className="text-xs font-JakartaMedium text-neutral-400">No recent rides</p>
            </div>
          )}
        </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 8. POP-UP MODAL OVERLAY (SPACIOUS, MAP REMAINS AS LIVING BACKDROP) */}
      {/* ========================================================================= */}
      {activeModal !== 'none' && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
          <div className="w-full sm:max-w-xl h-[92vh] sm:h-[86vh] bg-[#020408] rounded-t-3xl sm:rounded-3xl border border-white/15 shadow-[0_25px_60px_rgba(0,0,0,0.95)] flex flex-col overflow-hidden animate-in slide-in-from-bottom-8 duration-300 relative">
            {/* Modal Drag/Close Pill Bar */}
            <div className="w-full pt-2.5 pb-1 flex justify-center items-center relative z-20 shrink-0 bg-[#020408]">
              <div className="w-12 h-1 rounded-full bg-white/20" />
              <button
                onClick={closeModal}
                className="absolute right-4 top-2.5 w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-neutral-400 hover:text-white transition-all active:scale-90"
                title="Close Modal"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Modal Screen Content */}
            <div className="flex-1 overflow-hidden relative">
              {activeModal === 'parts' && <AutoPartsScreen isModal onClose={closeModal} />}
              {activeModal === 'parcel' && <ParcelScreen isModal onClose={closeModal} />}
              {activeModal === 'rental' && <RentalScreen isModal onClose={closeModal} />}
              {activeModal === 'freight' && <FreightScreen isModal onClose={closeModal} />}
              {activeModal === 'ambulance' && <AmbulanceScreen isModal onClose={closeModal} />}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
