import React, { useState, useRef, useEffect } from 'react';
import { useBroaderStore } from '../store/useBroaderStore';
import { InteractiveMap } from '../components/InteractiveMap';
import { RideCard } from '../components/RideCard';
import { BROADER_3D_FLEET } from '../data/vehicleAssets';
import { PassengerHUD } from '../components/dashboard/PassengerHUD';
import { FullScreenSpeedometerModal } from '../components/dashboard/FullScreenSpeedometerModal';
import { MapOptionsSpeedDial } from '../components/map/MapOptionsSpeedDial';
import { useRideSimulation } from '../components/simulation/useRideSimulation';
import { AutoPartsScreen } from './AutoPartsScreen';
import { ParcelScreen } from './ParcelScreen';
import { RentalScreen } from './RentalScreen';
import { FreightScreen } from './FreightScreen';
import { AmbulanceScreen } from './AmbulanceScreen';
import {
  Search,
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
  ChevronRight,
  Gauge,
  X,
  Users,
  Bell,
  Menu,
  Mic,
  Star,
  Layers,
  Crosshair,
  Compass,
  MessageSquare,
  User,
  ChevronUp,
  ChevronDown,
} from 'lucide-react';
import { SavedLocation, RecentDestination, ScreenType } from '../types';
import { soundEngine } from '../services/soundNotification';
import {
  MapLayerControlModal,
  MapLayerSettings,
} from '../components/map/MapLayerControlModal';
import { MapillaryViewerModal } from '../components/map/MapillaryViewerModal';
import { NavigationDrawer } from '../components/NavigationDrawer';
import { ModeSwitchSplash } from '../components/ModeSwitchSplash';
import { PlaceSuggestionDropdown } from '../components/search/PlaceSuggestionDropdown';
import { LiveRideNavigationHUD } from '../components/hud/LiveRideNavigationHUD';
import { useLiveRideTracking } from '../services/useLiveRideTracking';
import { searchNominatim, GeocodingResult } from '../services/nominatimService';

type ModalType = 'none' | 'parts' | 'parcel' | 'rental' | 'freight' | 'ambulance';
type SheetSnap = 'collapsed' | 'expanded';

export const HomeScreen: React.FC = () => {
  const user = useBroaderStore((s) => s.user);
  const userAddress = useBroaderStore((s) => s.userAddress);
  const setScreen = useBroaderStore((s) => s.setScreen);
  const currentScreen = useBroaderStore((s) => s.currentScreen);
  const rides = useBroaderStore((s) => s.rides);
  const setActiveService = useBroaderStore((s) => s.setActiveService);
  const savedLocations = useBroaderStore((s) => s.savedLocations);
  const recentDestinations = useBroaderStore((s) => s.recentDestinations);
  const setDestinationLocation = useBroaderStore((s) => s.setDestinationLocation);
  const walletBalance = useBroaderStore((s) => s.walletBalance);
  const setIsDriverMode = useBroaderStore((s) => s.setIsDriverMode);
  const setSelectedVehicle = useBroaderStore((s) => s.setSelectedVehicle);
  const activeTrip = useBroaderStore((s) => s.activeTrip);
  const rideStatus = useBroaderStore((s) => s.rideStatus);
  const cancelActiveTrip = useBroaderStore((s) => s.cancelActiveTrip);

  const [activeModal, setActiveModal] = useState<ModalType>('none');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [modeSwitchTarget, setModeSwitchTarget] = useState<'none' | 'passenger' | 'driver'>('none');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [nominatimResults, setNominatimResults] = useState<GeocodingResult[]>([]);
  const [isSearchingOsm, setIsSearchingOsm] = useState(false);

  // Live GPS tracking when trip is active
  const isLiveRideActive = Boolean(activeTrip && rideStatus !== 'idle' && rideStatus !== 'searching');
  const liveTelemetry = useLiveRideTracking(isLiveRideActive);

  // Debounced OpenStreetMap Nominatim search for dropdown overlay
  useEffect(() => {
    if (!searchQuery || searchQuery.trim().length < 2) {
      setNominatimResults([]);
      setIsSearchingOsm(false);
      return;
    }
    setIsSearchingOsm(true);
    const timer = setTimeout(async () => {
      try {
        const results = await searchNominatim(searchQuery);
        setNominatimResults(results);
      } catch (e) {
        setNominatimResults([]);
      } finally {
        setIsSearchingOsm(false);
      }
    }, 350);
    return () => clearTimeout(timer);
  }, [searchQuery]);
  const [isSpeedometerExpanded, setIsSpeedometerExpanded] = useState(false);
  const telemetry = useRideSimulation({ active: true });

  // Map Controls State
  const [bearing, setBearing] = useState(18);
  const [is3D, setIs3D] = useState(true);
  const [recenterKey, setRecenterKey] = useState(0);
  const [isLayerModalOpen, setIsLayerModalOpen] = useState(false);
  const [isStreetViewerOpen, setIsStreetViewerOpen] = useState(false);
  const [layerSettings, setLayerSettings] = useState<MapLayerSettings>({
    baseStyle: 'standard',
    showBuildings: true,
    showRoute: true,
    showTraffic: true,
    showPois: true,
    showStreetImagery: true,
  });

  // Touch & Pointer Draggable Bottom Sheet State
  const [sheetSnap, setSheetSnap] = useState<SheetSnap>('collapsed');
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartY = useRef(0);
  const currentDragOffset = useRef(0);
  const sheetRef = useRef<HTMLDivElement>(null);

  // Time-of-day greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const services = [
    { id: 'ride', label: 'Ride', icon: Car, modal: 'none' as ModalType },
    { id: 'parts', label: 'Auto Parts', icon: Wrench, modal: 'parts' as ModalType },
    { id: 'parcel', label: 'Parcel', icon: Package, modal: 'parcel' as ModalType },
    { id: 'rental', label: 'Rental', icon: Key, modal: 'rental' as ModalType },
    { id: 'freight', label: 'Freight', icon: Truck, modal: 'freight' as ModalType },
    { id: 'ambulance', label: 'Ambulance', icon: HeartPulse, modal: 'ambulance' as ModalType },
  ];

  const handleServiceClick = (svc: (typeof services)[0]) => {
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

  // Draggable bottom sheet pointer events
  const handlePointerDown = (e: React.PointerEvent) => {
    dragStartY.current = e.clientY;
    currentDragOffset.current = 0;
    setIsDragging(true);
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const deltaY = e.clientY - dragStartY.current;

    // Apply drag damping depending on current state
    if (sheetSnap === 'collapsed') {
      // Allow dragging UP (negative delta)
      currentDragOffset.current = Math.min(0, Math.max(-380, deltaY));
    } else {
      // Allow dragging DOWN (positive delta)
      currentDragOffset.current = Math.max(0, Math.min(380, deltaY));
    }
    setDragOffset(currentDragOffset.current);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDragging) return;
    setIsDragging(false);
    const delta = currentDragOffset.current;

    if (sheetSnap === 'collapsed') {
      if (delta < -45) {
        soundEngine.playClick();
        setSheetSnap('expanded');
      }
    } else {
      if (delta > 45) {
        soundEngine.playClick();
        setSheetSnap('collapsed');
      }
    }
    setDragOffset(0);
    currentDragOffset.current = 0;
  };

  const toggleSheet = () => {
    soundEngine.playClick();
    setSheetSnap((prev) => (prev === 'collapsed' ? 'expanded' : 'collapsed'));
  };

  const navTabs: { id: ScreenType; label: string; icon: React.ElementType }[] = [
    { id: 'home', label: 'Home', icon: HomeIcon },
    { id: 'rides', label: 'History', icon: Clock },
    { id: 'chat', label: 'Messages', icon: MessageSquare },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#020408] text-white select-none">
      {/* ========================================================================= */}
      {/* 1. FULL-SCREEN LIVING MAP BACKDROP (MAP-FIRST CONCEPT) */}
      {/* ========================================================================= */}
      <div className="absolute inset-0 w-full h-full z-0 pointer-events-auto">
        <InteractiveMap
          showRoute={true}
          height="h-full"
          className="w-full h-full rounded-none border-0 shadow-none"
          hideControls={true}
          is3DTiltProp={is3D}
          layerSettingsProp={layerSettings}
          recenterTrigger={recenterKey}
          liveVehiclePosition={
            isLiveRideActive
              ? {
                  latitude: liveTelemetry.latitude,
                  longitude: liveTelemetry.longitude,
                  heading: liveTelemetry.heading,
                  speed: liveTelemetry.speed,
                  isMoving: !liveTelemetry.isStopped,
                }
              : undefined
          }
          onSelectLandmark={(name, lat, lng) => {
            soundEngine.playClick();
            setDestinationLocation({ latitude: lat, longitude: lng, address: name });
            setScreen('confirm-ride');
          }}
        />
      </div>

      {/* ========================================================================= */}
      {/* 2. FLOATING FROSTED GLASS HEADER (EXACT REFERENCE DESIGN) */}
      {/* ========================================================================= */}
      <header className="absolute top-3 left-3 right-3 z-30 flex items-center justify-between pointer-events-none">
        {/* Left Pill: Menu + Greeting + Status Location */}
        <div
          onClick={() => {
            soundEngine.playClick();
            setIsDrawerOpen(true);
          }}
          className="pointer-events-auto bg-[#0c1420]/85 backdrop-blur-2xl border border-white/10 rounded-2xl px-3.5 py-2 flex items-center gap-3 shadow-[0_8px_32px_rgba(0,0,0,0.8)] cursor-pointer hover:border-white/20 active:scale-[0.98] transition-all"
        >
          {/* Hamburger Menu Icon */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              soundEngine.playClick();
              setIsDrawerOpen(true);
            }}
            className="text-neutral-300 hover:text-white p-0.5 active:scale-90 transition-transform"
            aria-label="Navigation Menu"
          >
            <Menu className="w-4 h-4" />
          </button>

          {/* User Status / Address Column */}
          <div className="min-w-0 pr-1">
            <p className="text-[11px] font-JakartaMedium text-neutral-300 leading-tight">
              {getGreeting()}
            </p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-2 h-2 rounded-full bg-[#9EE6B5] shadow-[0_0_8px_#9EE6B5] animate-pulse shrink-0" />
              <p className="text-xs font-JakartaBold text-white truncate max-w-[140px] sm:max-w-[200px] leading-tight">
                {userAddress ? userAddress.split(',')[0] : '14 Adeola Odeku, VI'}
              </p>
            </div>
          </div>
        </div>

        {/* Right Pill: Wallet Balance + Mint Wallet Icon */}
        <div
          onClick={() => {
            soundEngine.playClick();
            setScreen('wallet');
          }}
          className="pointer-events-auto bg-[#0c1420]/85 backdrop-blur-2xl border border-white/10 rounded-2xl px-3.5 py-2.5 flex items-center gap-2 shadow-[0_8px_32px_rgba(0,0,0,0.8)] cursor-pointer hover:border-[#9EE6B5]/40 active:scale-[0.98] transition-all"
          title="Open Wallet"
        >
          <span className="text-xs font-JakartaBold text-[#9EE6B5]">₦</span>
          <span className="text-xs font-JakartaBold text-white tracking-tight">
            {walletBalance ? walletBalance.toLocaleString() : '45,500'}
          </span>
          <Wallet className="w-3.5 h-3.5 text-[#9EE6B5] ml-0.5" />
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 3. FLOATING ACTION PILLS ROW (DRIVER, RIDES, NOTIFICATION BELL) */}
      {/* ========================================================================= */}
      <div className="absolute top-[68px] left-3 right-3 z-30 flex items-center justify-between pointer-events-none">
        {/* Left Action Buttons */}
        <div className="flex items-center gap-2 pointer-events-auto">
          {/* Driver Mode Console Switch (Mint Accent Border & Glow) */}
          <button
            onClick={() => {
              soundEngine.playClick();
              setModeSwitchTarget('driver');
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#0c1420]/90 backdrop-blur-2xl border border-[#9EE6B5] text-[#9EE6B5] shadow-[0_0_14px_rgba(158,230,181,0.35)] hover:bg-[#9EE6B5]/10 active:scale-95 transition-all text-xs font-JakartaBold"
            title="Switch to Driver Mode"
          >
            <Car className="w-3.5 h-3.5 text-[#9EE6B5]" />
            <span>Driver</span>
          </button>

          {/* Passenger Rides History Pill */}
          <button
            onClick={() => {
              soundEngine.playClick();
              setScreen('rides');
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#0c1420]/85 backdrop-blur-2xl border border-white/12 text-white shadow-lg hover:border-white/25 hover:bg-white/5 active:scale-95 transition-all text-xs font-JakartaBold"
            title="View Ride History"
          >
            <User className="w-3.5 h-3.5 text-neutral-300" />
            <span>Rides</span>
          </button>

          {/* Compact Floating Speedometer Trigger */}
          <button
            type="button"
            onClick={() => {
              soundEngine.playClick();
              setIsSpeedometerExpanded(true);
            }}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-[#0c1420]/90 backdrop-blur-2xl border border-cyan-500/35 text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.25)] hover:bg-cyan-500/15 hover:border-cyan-400 active:scale-95 transition-all text-xs font-JakartaBold"
            title="Open Fullscreen Cockpit Speedometer"
          >
            <Gauge className="w-3.5 h-3.5 text-cyan-400" />
            <span className="font-mono">{Math.round(telemetry.speed)}</span>
            <span className="text-[9px] text-cyan-400/80 font-mono">KM/H</span>
          </button>
        </div>

        {/* Right Notification Bell Button with Red Dot */}
        <button
          onClick={() => {
            soundEngine.playClick();
            setScreen('notifications');
          }}
          className="pointer-events-auto w-9 h-9 rounded-full bg-[#0c1420]/85 backdrop-blur-2xl border border-white/12 flex items-center justify-center text-neutral-300 shadow-xl active:scale-95 transition-all relative hover:text-white"
          title="Notifications & Alerts"
        >
          <Bell className="w-4 h-4" />
          <span className="w-2 h-2 rounded-full bg-red-500 absolute top-2 right-2 ring-2 ring-[#0c1420] animate-pulse" />
        </button>
      </div>

      {/* FULLSCREEN 100% SOLID BLACK SPEEDOMETER DASHBOARD (EXPANDABLE, COLLAPSIBLE, DOCK STATIC) */}
      <FullScreenSpeedometerModal
        isOpen={isSpeedometerExpanded}
        onClose={() => setIsSpeedometerExpanded(false)}
        speed={telemetry.speed}
        speedLimit={telemetry.speedLimit}
        etaMinutes={telemetry.etaMinutes}
        distanceKm={telemetry.distanceRemainingKm}
        currentInstruction={telemetry.currentInstruction}
        streetName={telemetry.streetName}
        fuelLevel={telemetry.fuelLevel}
        isDriverMode={false}
        tripStatus="PASSENGER EN ROUTE"
      />

      {/* ========================================================================= */}
      {/* 4. RIGHT VERTICAL FLOATING CONTROLS (MAP FOCUS & CONSOLIDATED MAP OPTIONS) */}
      {/* ========================================================================= */}
      <div className="absolute right-3 top-32 z-30 flex flex-col items-center gap-2.5 pointer-events-auto select-none">
        {/* MAP FOCUS ICON (ALWAYS VISIBLE & STANDALONE) */}
        <button
          type="button"
          onClick={() => {
            soundEngine.playClick();
            setRecenterKey((k) => k + 1);
          }}
          className="w-9 h-9 rounded-full bg-[#0c1420]/90 backdrop-blur-2xl border border-white/15 text-[#9EE6B5] hover:text-white flex items-center justify-center shadow-xl active:scale-90 transition-all hover:border-[#9EE6B5]/60 hover:shadow-[0_0_12px_rgba(158,230,181,0.3)]"
          title="Map Focus: Recenter on Current Location"
        >
          <Crosshair className="w-4 h-4" />
        </button>

        {/* ALL OTHER MAP OPTIONS CONSOLIDATED IN ONE SMALL ICON (EXPAND/COLLAPSE ONLY WHEN TAPPED) */}
        <MapOptionsSpeedDial
          is3D={is3D}
          onToggle3D={() => setIs3D((v) => !v)}
          bearing={bearing}
          onResetBearing={() => setBearing(0)}
          onOpenLayersModal={() => setIsLayerModalOpen(true)}
        />
      </div>

      {/* ========================================================================= */}
      {/* 5. REAL TOUCH-FRIENDLY DRAGGABLE BOTTOM SHEET (MAP-FIRST UX) */}
      {/* ========================================================================= */}
      <div
        ref={sheetRef}
        style={{
          transform: `translateY(${
            sheetSnap === 'collapsed'
              ? `calc(100% - 164px + ${Math.min(0, dragOffset)}px)`
              : `${Math.max(0, dragOffset)}px`
          })`,
          transition: isDragging ? 'none' : 'transform 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
        className="fixed inset-x-0 bottom-[68px] z-40 max-w-md sm:max-w-xl md:max-w-2xl lg:max-w-3xl mx-auto h-[calc(84vh-68px)] max-h-[calc(88vh-68px)] flex flex-col rounded-t-[32px] bg-[#0c1420]/95 backdrop-blur-2xl border-t border-x border-white/[0.12] shadow-[0_-16px_48px_rgba(0,0,0,0.95)] overflow-hidden"
      >
        {/* DRAG HEADER & SWIPE CUES (ALWAYS VISIBLE IN COLLAPSED & EXPANDED) */}
        <div
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          className="w-full pt-2 pb-1.5 flex flex-col items-center cursor-grab active:cursor-grabbing select-none shrink-0"
          style={{ touchAction: 'none' }}
        >
          {/* Animated Dual Indicator Arrows (▲ ▼) */}
          <button
            onClick={toggleSheet}
            type="button"
            className="flex items-center justify-center gap-0.5 text-[#9EE6B5] hover:text-white py-0.5 active:scale-90 transition-all group"
            title={sheetSnap === 'collapsed' ? 'Swipe up to open fleet' : 'Swipe down to collapse'}
          >
            {sheetSnap === 'collapsed' ? (
              <ChevronUp className="w-4 h-4 animate-bounce text-[#9EE6B5]" />
            ) : (
              <ChevronDown className="w-4 h-4 text-neutral-400 group-hover:text-white" />
            )}
          </button>

          {/* Smooth Drag Pill Handle */}
          <div
            onClick={toggleSheet}
            className="w-12 h-1 bg-white/30 hover:bg-white/60 rounded-full cursor-pointer transition-colors"
          />
        </div>

        {/* ALWAYS-VISIBLE SEARCH CAPSULE & QUICK SHORTCUTS */}
        <div className="px-4 pb-3 space-y-2.5 shrink-0 select-none">
          {/* Destination Search Capsule with Compact Suggestion Overlay */}
          <div className="relative">
            <div
              className={`flex items-center justify-between bg-[#131b26]/95 backdrop-blur-2xl px-3.5 py-2 rounded-2xl group shadow-[0_6px_20px_rgba(0,0,0,0.6)] border transition-all ${
                isSearchFocused
                  ? 'border-[#9EE6B5] ring-2 ring-[#9EE6B5]/30'
                  : 'border-white/[0.1] hover:border-[#9EE6B5]/50'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className="w-8 h-8 rounded-xl bg-[#9EE6B5]/15 border border-[#9EE6B5]/30 flex items-center justify-center text-[#9EE6B5] group-hover:scale-105 transition-transform shrink-0">
                  <Search className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => {
                      setIsSearchFocused(true);
                      setSheetSnap('expanded');
                    }}
                    placeholder="Where to in Lagos? (Airport, Lekki...)"
                    className="w-full text-xs font-JakartaBold text-white placeholder-neutral-400 focus:outline-none bg-transparent"
                  />
                  <p className="text-[10px] text-neutral-400 font-JakartaMedium truncate">
                    Tap to view verified places & routes
                  </p>
                </div>
              </div>

              {searchQuery ? (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="p-1 text-neutral-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              ) : (
                /* Quick Full-Screen Search Navigation Pill */
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    soundEngine.playClick();
                    setScreen('find-ride');
                  }}
                  className="px-2.5 py-1 rounded-xl bg-white/10 hover:bg-white/20 text-neutral-300 hover:text-white text-[10px] font-JakartaBold flex items-center gap-1 transition-all ml-1 shrink-0"
                  title="Open Search Planner"
                >
                  <span>Search</span>
                  <ChevronRight className="w-3 h-3 text-[#9EE6B5]" />
                </button>
              )}
            </div>

            {/* Compact Suggestion Overlay / Dropdown */}
            <PlaceSuggestionDropdown
              query={searchQuery}
              isOpen={isSearchFocused}
              onClose={() => setIsSearchFocused(false)}
              onSelect={(item) => {
                soundEngine.playClick();
                setDestinationLocation({
                  latitude: item.latitude,
                  longitude: item.longitude,
                  address: item.name,
                });
                setIsSearchFocused(false);
                setSearchQuery('');
                setScreen('confirm-ride');
              }}
              osmResults={nominatimResults}
              isSearchingOsm={isSearchingOsm}
            />
          </div>

          {/* 4 Quick Shortcuts (Home, Work, Favorites, Recent) */}
          <div className="grid grid-cols-4 gap-2">
            {/* Home Shortcut */}
            <button
              onClick={() => {
                const homeLoc = savedLocations.find((l) => l.type === 'home');
                if (homeLoc) handleQuickDestination(homeLoc);
                else setScreen('find-ride');
              }}
              className="flex flex-col items-center justify-center py-2 px-1 rounded-xl bg-[#131b26]/80 hover:bg-[#182333] border border-white/[0.08] hover:border-white/20 active:scale-95 transition-all text-neutral-300 hover:text-white"
            >
              <div className="w-7 h-7 rounded-lg bg-amber-500/15 text-amber-400 flex items-center justify-center mb-1">
                <HomeIcon className="w-3.5 h-3.5" />
              </div>
              <span className="text-[10px] font-JakartaBold truncate w-full text-center">Home</span>
            </button>

            {/* Work Shortcut */}
            <button
              onClick={() => {
                const workLoc = savedLocations.find((l) => l.type === 'work');
                if (workLoc) handleQuickDestination(workLoc);
                else setScreen('find-ride');
              }}
              className="flex flex-col items-center justify-center py-2 px-1 rounded-xl bg-[#131b26]/80 hover:bg-[#182333] border border-white/[0.08] hover:border-white/20 active:scale-95 transition-all text-neutral-300 hover:text-white"
            >
              <div className="w-7 h-7 rounded-lg bg-[#9EE6B5]/15 text-[#9EE6B5] flex items-center justify-center mb-1">
                <Briefcase className="w-3.5 h-3.5" />
              </div>
              <span className="text-[10px] font-JakartaBold truncate w-full text-center">Work</span>
            </button>

            {/* Favorites Shortcut */}
            <button
              onClick={() => {
                soundEngine.playClick();
                setScreen('find-ride');
              }}
              className="flex flex-col items-center justify-center py-2 px-1 rounded-xl bg-[#131b26]/80 hover:bg-[#182333] border border-white/[0.08] hover:border-white/20 active:scale-95 transition-all text-neutral-300 hover:text-white"
            >
              <div className="w-7 h-7 rounded-lg bg-[#9EE6B5]/15 text-[#9EE6B5] flex items-center justify-center mb-1">
                <Star className="w-3.5 h-3.5" />
              </div>
              <span className="text-[10px] font-JakartaBold truncate w-full text-center">
                Favorites
              </span>
            </button>

            {/* Recent Shortcut */}
            <button
              onClick={() => {
                if (recentDestinations.length > 0) handleQuickDestination(recentDestinations[0]);
                else setScreen('rides');
              }}
              className="flex flex-col items-center justify-center py-2 px-1 rounded-xl bg-[#131b26]/80 hover:bg-[#182333] border border-white/[0.08] hover:border-white/20 active:scale-95 transition-all text-neutral-300 hover:text-white"
            >
              <div className="w-7 h-7 rounded-lg bg-white/10 text-neutral-300 flex items-center justify-center mb-1">
                <Clock className="w-3.5 h-3.5" />
              </div>
              <span className="text-[10px] font-JakartaBold truncate w-full text-center">Recent</span>
            </button>
          </div>
        </div>

        {/* ===================================================================== */}
        {/* EXPANDED CONTENT SCROLL AREA (REVEALED WHEN SWIPED UP) */}
        {/* ===================================================================== */}
        <div className="flex-1 overflow-y-auto px-4 pb-24 space-y-4 no-scrollbar pointer-events-auto">
          {/* SECTION: 3D VEHICLE FLEET SHOWCASE (EXACT REFERENCE CARDS) */}
          <div className="pt-1">
            <div className="flex items-center justify-between mb-2 px-1">
              <div className="flex items-center gap-1.5">
                <Car className="w-3.5 h-3.5 text-[#9EE6B5]" />
                <h3 className="text-xs font-JakartaBold text-white tracking-wider uppercase">
                  Vehicle Fleet
                </h3>
              </div>
              <span className="text-[10px] text-neutral-400 font-JakartaMedium">
                Tap vehicle to select
              </span>
            </div>

            {/* Horizontal Fleet Carousel */}
            <div className="flex items-center gap-2.5 overflow-x-auto pb-1 no-scrollbar">
              {BROADER_3D_FLEET.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleSelect3DVehicle(item.category)}
                  className="w-[150px] sm:w-[165px] shrink-0 bg-[#131b26]/90 rounded-2xl p-2.5 flex flex-col items-center cursor-pointer group border border-white/[0.08] backdrop-blur-xl transition-all hover:border-[#9EE6B5]/60 hover:bg-[#182333] relative active:scale-95 shadow-lg"
                >
                  {/* Tag Pill & Price */}
                  <div className="w-full flex justify-between items-center mb-0.5">
                    <span className="text-[9px] font-JakartaBold text-cyan-300 bg-cyan-500/10 border border-cyan-500/30 px-1.5 py-0.5 rounded-full">
                      {item.tag}
                    </span>
                    <span className="text-xs font-JakartaBold text-white">
                      ₦{item.basePriceNaira.toLocaleString()}
                    </span>
                  </div>

                  {/* 3D Transparent Vehicle Image */}
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
                  <div className="w-full flex items-center justify-between mt-0.5 pt-1.5 border-t border-white/[0.06]">
                    <div className="min-w-0 flex-1">
                      <span className="text-xs font-JakartaBold text-white truncate block">
                        {item.name}
                      </span>
                      <span className="text-[9px] text-neutral-400 font-JakartaMedium flex items-center gap-1 mt-0.5">
                        <Users className="w-2.5 h-2.5" />
                        {item.seats} seats • {item.etaMinutes} min
                      </span>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-neutral-400 group-hover:text-[#9EE6B5] shrink-0 ml-1 transition-colors" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SECTION: SAVED & RECENT DESTINATIONS */}
          <div>
            <div className="flex items-center justify-between mb-1.5 px-1">
              <span className="text-[10px] font-JakartaBold text-neutral-400 uppercase tracking-wider">
                Saved Locations
              </span>
            </div>
            <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
              {savedLocations.map((loc) => (
                <button
                  key={loc.id}
                  onClick={() => handleQuickDestination(loc)}
                  className="flex items-center gap-2 bg-[#131b26]/90 px-3 py-2 rounded-xl text-left shrink-0 transition-all border border-white/[0.08] hover:border-white/20 active:scale-95"
                >
                  <div
                    className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${
                      loc.type === 'home'
                        ? 'bg-amber-500/15 text-amber-400'
                        : 'bg-[#9EE6B5]/15 text-[#9EE6B5]'
                    }`}
                  >
                    {loc.type === 'home' ? (
                      <HomeIcon className="w-3 h-3" />
                    ) : (
                      <Briefcase className="w-3 h-3" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] font-JakartaBold text-white leading-tight">
                      {loc.title}
                    </p>
                    <p className="text-[9px] text-neutral-400 font-JakartaMedium truncate max-w-[100px]">
                      {loc.address.split(',')[0]}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* SECTION: BROADER SERVICES & MODALS */}
          <div>
            <div className="flex items-center justify-between mb-1.5 px-1">
              <span className="text-[10px] font-JakartaBold text-neutral-400 uppercase tracking-wider">
                Services & Modals
              </span>
            </div>
            <div className="grid grid-cols-6 gap-1.5">
              {services.map((svc) => {
                const Icon = svc.icon;
                return (
                  <button
                    key={svc.id}
                    onClick={() => handleServiceClick(svc)}
                    className="flex flex-col items-center justify-center py-2 px-1 rounded-2xl border border-white/[0.08] bg-[#131b26]/80 hover:bg-[#182333] hover:border-[#9EE6B5]/50 text-neutral-300 hover:text-white transition-all active:scale-95"
                  >
                    <Icon className="w-4 h-4 mb-1 text-[#9EE6B5]" />
                    <span className="text-[9px] font-JakartaSemiBold tracking-tight truncate w-full text-center">
                      {svc.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* SECTION: RECENT TRIPS */}
          <div>
            <div className="flex items-center justify-between mb-1.5 px-1">
              <h3 className="text-xs font-JakartaBold text-white">Recent Trips</h3>
              <button
                onClick={() => {
                  soundEngine.playClick();
                  setScreen('rides');
                }}
                className="text-[11px] font-JakartaSemiBold text-[#9EE6B5] hover:underline"
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
              <div className="flex flex-col items-center justify-center py-4 bg-[#131b26]/60 rounded-2xl border border-white/[0.08]">
                <p className="text-xs font-JakartaMedium text-neutral-400">No recent rides</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* STATIC BOTTOM NAVIGATION DOCK (FIXED AT SCREEN BOTTOM) */}
      {/* ========================================================================= */}
      <div className="fixed inset-x-0 bottom-0 z-50 max-w-md sm:max-w-xl md:max-w-2xl lg:max-w-3xl mx-auto px-4 pb-3 pt-1.5 select-none pointer-events-auto bg-[#0c1420]/95 backdrop-blur-2xl border-t border-white/[0.08] shadow-[0_-8px_32px_rgba(0,0,0,0.9)]">
        <nav className="w-full h-[56px] rounded-2xl px-3 flex items-center justify-around bg-[#131b26]/90 border border-white/[0.1] shadow-[0_8px_24px_rgba(0,0,0,0.8)]">
          {navTabs.map((tab) => {
            const focused = currentScreen === tab.id;
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  soundEngine.playClick();
                  setScreen(tab.id);
                }}
                className="flex flex-col items-center justify-center p-1 transition-all group active:scale-95"
                aria-label={tab.label}
              >
                <div
                  className={`rounded-xl w-10 h-10 flex items-center justify-center transition-all ${
                    focused
                      ? 'bg-[#9EE6B5] text-[#020408] shadow-[0_0_14px_rgba(158,230,181,0.6)] font-bold'
                      : 'bg-transparent text-neutral-400 hover:text-white hover:bg-white/[0.06]'
                  }`}
                >
                  <Icon className="w-4 h-4 stroke-[2.2]" />
                </div>
              </button>
            );
          })}
        </nav>
      </div>

      {/* ========================================================================= */}
      {/* 6. POP-UP MODAL OVERLAYS (AUTO PARTS, PARCEL, RENTAL, FREIGHT, AMBULANCE) */}
      {/* ========================================================================= */}
      {activeModal !== 'none' && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
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

      {/* Map Layer Control Modal (OSM, OSRM, 3D Buildings, Traffic, Satellite) */}
      <MapLayerControlModal
        isOpen={isLayerModalOpen}
        onClose={() => setIsLayerModalOpen(false)}
        layers={layerSettings}
        onChangeLayers={(updated) => setLayerSettings((prev) => ({ ...prev, ...updated }))}
        onOpenStreetViewer={() => {
          setIsLayerModalOpen(false);
          setIsStreetViewerOpen(true);
        }}
      />

      {/* Mapillary Street-Level 360 Imagery Viewer */}
      <MapillaryViewerModal
        isOpen={isStreetViewerOpen}
        onClose={() => setIsStreetViewerOpen(false)}
      />

      {/* ========================================================================= */}
      {/* 7. SECONDARY NAVIGATION & SETTINGS DRAWER */}
      {/* ========================================================================= */}
      <NavigationDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onSwitchMode={() => {
          setModeSwitchTarget('driver');
        }}
      />

      {/* ========================================================================= */}
      {/* 8. PASSENGER ↔ DRIVER POLISHED MODE SWITCH SPLASH OVERLAY */}
      {/* ========================================================================= */}
      {modeSwitchTarget !== 'none' && (
        <ModeSwitchSplash
          targetMode={modeSwitchTarget}
          onComplete={() => {
            if (modeSwitchTarget === 'driver') {
              setIsDriverMode(true);
              setScreen('driver-home');
            } else {
              setIsDriverMode(false);
              setScreen('home');
            }
            setModeSwitchTarget('none');
          }}
        />
      )}

      {/* ========================================================================= */}
      {/* 9. ACTIVE TRIP FLOATING FULL-SCREEN NAVIGATION HUD OVERLAY */}
      {/* ========================================================================= */}
      {isLiveRideActive && activeTrip && (
        <LiveRideNavigationHUD
          telemetry={liveTelemetry}
          onOpenChat={() => setScreen('chat')}
          onOpenSafety={() => setIsLayerModalOpen(true)}
          onCancelTrip={() => {
            cancelActiveTrip();
          }}
        />
      )}
    </div>
  );
};
