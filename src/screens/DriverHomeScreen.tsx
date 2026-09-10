import React, { useState, useRef } from 'react';
import { useBroaderStore } from '../store/useBroaderStore';
import {
  Power,
  Navigation,
  DollarSign,
  Star,
  CheckCircle2,
  Clock,
  ChevronRight,
  TrendingUp,
  User,
  ShieldAlert,
  Car,
  Wallet,
  ShieldCheck,
  Radio,
  Phone,
  Menu,
  Gauge,
  Layers,
  Crosshair,
  ChevronUp,
  ChevronDown,
  Sparkles,
  X,
  Camera,
} from 'lucide-react';
import { InteractiveMap } from '../components/InteractiveMap';
import { DriverIncomingModal } from '../components/driver/DriverIncomingModal';
import { DriverActiveTripHUD } from '../components/driver/DriverActiveTripHUD';
import { DriverEarningsView } from '../components/driver/DriverEarningsView';
import { DriverTripsView } from '../components/driver/DriverTripsView';
import { DriverVehiclesView } from '../components/driver/DriverVehiclesView';
import { DriverSafetyModal } from '../components/driver/DriverSafetyModal';
import { DriverHUD } from '../components/dashboard/DriverHUD';
import { useRideSimulation } from '../components/simulation/useRideSimulation';
import { SAMPLE_INCOMING_DRIVER_REQUESTS } from '../services/backendService';
import { getVehicle3DImage } from '../data/vehicleAssets';
import { soundEngine } from '../services/soundNotification';
import {
  MapLayerControlModal,
  MapLayerSettings,
} from '../components/map/MapLayerControlModal';
import { MapillaryViewerModal } from '../components/map/MapillaryViewerModal';

type SheetSnap = 'collapsed' | 'expanded';

export const DriverHomeScreen: React.FC = () => {
  const setIsDriverMode = useBroaderStore((s) => s.setIsDriverMode);
  const setScreen = useBroaderStore((s) => s.setScreen);
  const driverStatus = useBroaderStore((s) => s.driverStatus);
  const setDriverStatus = useBroaderStore((s) => s.setDriverStatus);
  const driverEarnings = useBroaderStore((s) => s.driverEarnings);
  const incomingDriverRequest = useBroaderStore((s) => s.incomingDriverRequest);
  const setIncomingDriverRequest = useBroaderStore((s) => s.setIncomingDriverRequest);
  const activeTrip = useBroaderStore((s) => s.activeTrip);
  const rideStatus = useBroaderStore((s) => s.rideStatus);
  const driverVehicles = useBroaderStore((s) => s.driverVehicles);
  const activeDriverVehicleId = useBroaderStore((s) => s.activeDriverVehicleId);
  const driverActiveTab = useBroaderStore((s) => s.driverActiveTab);
  const setDriverActiveTab = useBroaderStore((s) => s.setDriverActiveTab);
  const driverRating = useBroaderStore((s) => s.driverRating);
  const driverAcceptanceRate = useBroaderStore((s) => s.driverAcceptanceRate);
  const driverCancellationRate = useBroaderStore((s) => s.driverCancellationRate);

  const [safetyModalOpen, setSafetyModalOpen] = useState(false);
  const [showDriverCockpitHUD, setShowDriverCockpitHUD] = useState(false);

  // Map Controls State (matching Passenger Home)
  const [bearing, setBearing] = useState(18);
  const [is3D, setIs3D] = useState(true);
  const [recenterKey, setRecenterKey] = useState(0);
  const [isLayerModalOpen, setIsLayerModalOpen] = useState(false);
  const [isStreetViewerOpen, setIsStreetViewerOpen] = useState(false);
  const [layerSettings, setLayerSettings] = useState<MapLayerSettings>({
    baseStyle: 'dark',
    showBuildings: true,
    showRoute: true,
    showTraffic: true,
    showPois: true,
    showStreetImagery: true,
  });

  // Touch & Pointer Draggable Bottom Sheet State (matching Passenger Home)
  const [sheetSnap, setSheetSnap] = useState<SheetSnap>('collapsed');
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartY = useRef(0);
  const currentDragOffset = useRef(0);
  const sheetRef = useRef<HTMLDivElement>(null);

  const activeVehicle =
    driverVehicles.find((v) => v.id === activeDriverVehicleId) || driverVehicles[0];

  const isOnTrip = driverStatus === 'on_trip' || (activeTrip !== null && rideStatus !== 'idle');

  const telemetry = useRideSimulation({
    active: showDriverCockpitHUD || isOnTrip,
    initialSpeed: 52,
  });

  const toggleOnlineStatus = () => {
    soundEngine.playClick();
    if (driverStatus === 'online') {
      setDriverStatus('offline');
      setIncomingDriverRequest(null);
    } else {
      setDriverStatus('online');
    }
  };

  const handleSimulateNewRequest = () => {
    const randomReq =
      SAMPLE_INCOMING_DRIVER_REQUESTS[
        Math.floor(Math.random() * SAMPLE_INCOMING_DRIVER_REQUESTS.length)
      ];
    setIncomingDriverRequest({
      ...randomReq,
      id: 'req_lag_' + Date.now().toString().slice(-4),
    });
    setSheetSnap('expanded');
  };

  // Draggable bottom sheet pointer events (identical to Passenger Home)
  const handlePointerDown = (e: React.PointerEvent) => {
    dragStartY.current = e.clientY;
    currentDragOffset.current = 0;
    setIsDragging(true);
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const deltaY = e.clientY - dragStartY.current;

    if (sheetSnap === 'collapsed') {
      currentDragOffset.current = Math.min(0, Math.max(-380, deltaY));
    } else {
      currentDragOffset.current = Math.max(0, Math.min(380, deltaY));
    }
    setDragOffset(currentDragOffset.current);
  };

  const handlePointerUp = () => {
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

  const navTabs = [
    { id: 'hud', label: 'Cockpit', icon: Navigation },
    { id: 'earnings', label: 'Earnings', icon: DollarSign },
    { id: 'trips', label: 'Trips', icon: Clock },
    { id: 'vehicles', label: 'Fleet', icon: Car },
    { id: 'profile', label: 'Profile', icon: ShieldCheck },
  ] as const;

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#020408] text-white select-none">
      {/* ========================================================================= */}
      {/* 1. FULL-SCREEN LIVING MAP BACKDROP (MAP-FIRST CONCEPT) */}
      {/* ========================================================================= */}
      <div className="absolute inset-0 w-full h-full z-0 pointer-events-auto">
        <InteractiveMap
          showRoute={isOnTrip}
          height="h-full"
          className="w-full h-full rounded-none border-0 shadow-none"
          hideControls={true}
          is3DTiltProp={is3D}
          layerSettingsProp={layerSettings}
          recenterTrigger={recenterKey}
        />
      </div>

      {/* ========================================================================= */}
      {/* 2. FLOATING FROSTED GLASS HEADER (EXACT PASSENGER PROPORTIONS & GLOW) */}
      {/* ========================================================================= */}
      <header className="absolute top-3 left-3 right-3 z-30 flex items-center justify-between pointer-events-none">
        {/* Left Pill: Menu + Driver Identity + Live Status Indicator */}
        <div
          onClick={() => {
            soundEngine.playClick();
            setDriverActiveTab('profile');
            setSheetSnap('expanded');
          }}
          className="pointer-events-auto bg-[#0c1420]/85 backdrop-blur-2xl border border-white/10 rounded-2xl px-3.5 py-2 flex items-center gap-3 shadow-[0_8px_32px_rgba(0,0,0,0.8)] cursor-pointer hover:border-white/20 active:scale-[0.98] transition-all"
        >
          <button
            type="button"
            className="text-neutral-300 hover:text-white p-0.5 active:scale-90 transition-transform"
            aria-label="Driver Menu"
          >
            <Menu className="w-4 h-4" />
          </button>

          <div className="min-w-0 pr-1">
            <p className="text-[11px] font-JakartaMedium text-neutral-300 leading-tight">
              Chris Bakare
            </p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span
                className={`w-2 h-2 rounded-full shrink-0 ${
                  isOnTrip
                    ? 'bg-blue-400 shadow-[0_0_8px_#60A5FA] animate-pulse'
                    : driverStatus === 'online'
                    ? 'bg-[#9EE6B5] shadow-[0_0_8px_#9EE6B5] animate-pulse'
                    : 'bg-neutral-500'
                }`}
              />
              <p className="text-xs font-JakartaBold text-white truncate max-w-[140px] sm:max-w-[200px] leading-tight">
                {isOnTrip
                  ? 'Active Trip • En Route'
                  : driverStatus === 'online'
                  ? 'Online • Ready for Dispatch'
                  : 'Offline • Console Idle'}
              </p>
            </div>
          </div>
        </div>

        {/* Right Pill: Operational Earnings + Mint Wallet Icon */}
        <div
          onClick={() => {
            soundEngine.playClick();
            setDriverActiveTab('earnings');
            setSheetSnap('expanded');
          }}
          className="pointer-events-auto bg-[#0c1420]/85 backdrop-blur-2xl border border-white/10 rounded-2xl px-3.5 py-2.5 flex items-center gap-2 shadow-[0_8px_32px_rgba(0,0,0,0.8)] cursor-pointer hover:border-[#9EE6B5]/40 active:scale-[0.98] transition-all"
          title="View Driver Earnings"
        >
          <span className="text-xs font-JakartaBold text-[#9EE6B5]">₦</span>
          <span className="text-xs font-JakartaBold text-white tracking-tight">
            {driverEarnings.today ? driverEarnings.today.toLocaleString() : '0'}
          </span>
          <Wallet className="w-3.5 h-3.5 text-[#9EE6B5] ml-0.5" />
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 3. FLOATING ACTION PILLS ROW (RIDER SWITCH, ONLINE TOGGLE, SPEEDOMETER) */}
      {/* ========================================================================= */}
      <div className="absolute top-[68px] left-3 right-3 z-30 flex items-center justify-between pointer-events-none">
        {/* Left Action Buttons */}
        <div className="flex items-center gap-2 pointer-events-auto">
          {/* Passenger Rider App Switch (Mint Accent Border & Glow) */}
          <button
            onClick={() => {
              soundEngine.playClick();
              setIsDriverMode(false);
              setScreen('home');
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#0c1420]/90 backdrop-blur-2xl border border-[#9EE6B5] text-[#9EE6B5] shadow-[0_0_14px_rgba(158,230,181,0.35)] hover:bg-[#9EE6B5]/10 active:scale-95 transition-all text-xs font-JakartaBold"
            title="Switch to Passenger Rider App"
          >
            <User className="w-3.5 h-3.5 text-[#9EE6B5]" />
            <span>Rider</span>
          </button>

          {/* Quick Online/Offline Toggle Pill */}
          <button
            onClick={toggleOnlineStatus}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full backdrop-blur-2xl border transition-all text-xs font-JakartaBold shadow-lg active:scale-95 ${
              driverStatus === 'online'
                ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.3)]'
                : 'bg-[#0c1420]/85 border-white/12 text-neutral-300 hover:border-white/25 hover:text-white'
            }`}
            title={driverStatus === 'online' ? 'Tap to go Offline' : 'Tap to go Online'}
          >
            <Power className="w-3.5 h-3.5" />
            <span>{driverStatus === 'online' ? 'Online' : 'Offline'}</span>
          </button>

          {/* Cockpit Speedometer HUD toggle */}
          <button
            onClick={() => {
              soundEngine.playClick();
              setShowDriverCockpitHUD((v) => !v);
            }}
            className={`w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-2xl border transition-all active:scale-95 ${
              showDriverCockpitHUD
                ? 'bg-[#9EE6B5] text-[#020408] border-[#9EE6B5] shadow-[0_0_12px_rgba(158,230,181,0.5)]'
                : 'bg-[#0c1420]/85 text-cyan-300 border-white/12 hover:bg-white/10'
            }`}
            title="Toggle Cockpit Speedometer HUD"
          >
            <Gauge className="w-3.5 h-3.5" />
          </button>

          {/* Test Dispatch Pill when Online */}
          {driverStatus === 'online' && !isOnTrip && (
            <button
              onClick={() => {
                soundEngine.playClick();
                handleSimulateNewRequest();
              }}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-[11px] font-JakartaBold hover:bg-cyan-500/25 active:scale-95 transition-all shadow-xs"
              title="Simulate incoming passenger trip request"
            >
              <Radio className="w-3 h-3 animate-pulse" />
              <span className="hidden sm:inline">Dispatch</span>
            </button>
          )}
        </div>

        {/* Right Emergency SOS Button */}
        <button
          onClick={() => {
            soundEngine.playClick();
            setSafetyModalOpen(true);
          }}
          className="pointer-events-auto w-9 h-9 rounded-full bg-red-500/15 backdrop-blur-2xl border border-red-500/35 flex items-center justify-center text-red-400 shadow-xl active:scale-95 transition-all hover:bg-red-500/25 relative shadow-[0_0_12px_rgba(239,68,68,0.2)]"
          title="Emergency SOS & Lagos 112"
        >
          <ShieldAlert className="w-4 h-4" />
        </button>
      </div>

      {/* ========================================================================= */}
      {/* COCKPIT HUD OVERLAY (IF ENABLED) */}
      {/* ========================================================================= */}
      {showDriverCockpitHUD && (
        <div className="absolute top-[114px] left-3 right-3 max-w-sm z-30 pointer-events-auto">
          <div className="relative">
            <button
              onClick={() => setShowDriverCockpitHUD(false)}
              className="absolute -top-2 -right-2 z-40 w-6 h-6 rounded-full bg-[#0c1420] border border-white/20 text-neutral-400 hover:text-white flex items-center justify-center shadow-md active:scale-90"
              title="Hide Speedometer HUD"
            >
              <X className="w-3 h-3" />
            </button>
            <DriverHUD
              speed={telemetry.speed}
              speedLimit={80}
              tripStatus={isOnTrip ? 'EN ROUTE' : driverStatus === 'online' ? 'SEARCHING' : 'IDLE'}
              etaMinutes={telemetry.etaMinutes}
              distanceKm={telemetry.distanceRemainingKm}
              passengerName="Adewale Adeleke"
              pickupAddress={activeTrip?.pickup?.address || 'Victoria Island, Lagos'}
              destinationAddress={activeTrip?.destination?.address || 'Admiralty Way, Lekki Phase 1'}
              currentInstruction={telemetry.currentInstruction}
              isOnline={driverStatus === 'online'}
              onToggleOnline={toggleOnlineStatus}
              onOpenEarnings={() => {
                setDriverActiveTab('earnings');
                setSheetSnap('expanded');
              }}
              onEmergencySOS={() => setSafetyModalOpen(true)}
              onOpenDriverView={() => {
                const btn = document.querySelector('[title="Open 3D Street View"]') as HTMLButtonElement;
                if (btn) btn.click();
              }}
            />
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. RIGHT VERTICAL FLOATING CONTROLS (COMPASS, 3D, LAYERS, CROSSHAIR) */}
      {/* ========================================================================= */}
      <div className="absolute right-3 top-32 z-30 flex flex-col items-center gap-2 pointer-events-auto">
        {/* Working Compass Needle */}
        <button
          onClick={() => {
            soundEngine.playClick();
            setBearing(0);
          }}
          className="w-10 h-10 rounded-full bg-[#0c1420]/85 backdrop-blur-2xl border border-white/15 shadow-2xl flex flex-col items-center justify-center hover:border-white/30 active:scale-90 transition-all group/compass relative"
          title="Heading (Click to reset North)"
        >
          <div
            className="w-5 h-5 flex items-center justify-center transition-transform duration-300"
            style={{ transform: `rotate(${-bearing}deg)` }}
          >
            <div className="w-0.5 h-2.5 bg-red-500 rounded-t-sm" />
            <div className="w-0.5 h-2.5 bg-slate-300 rounded-b-sm" />
          </div>
          <span className="text-[8px] font-JakartaBold text-neutral-300 -mt-0.5 tracking-tighter">
            N
          </span>
        </button>

        {/* 3D Mode Toggle Button */}
        <button
          onClick={() => {
            soundEngine.playClick();
            setIs3D((v) => !v);
          }}
          className={`w-9 h-9 rounded-full backdrop-blur-2xl border flex items-center justify-center text-xs font-JakartaBold shadow-xl active:scale-90 transition-all ${
            is3D
              ? 'bg-[#0c1420]/90 border-[#9EE6B5] text-[#9EE6B5] shadow-[0_0_10px_rgba(158,230,181,0.3)]'
              : 'bg-[#0c1420]/85 border-white/15 text-neutral-400 hover:text-white'
          }`}
          title={is3D ? 'Perspective: 3D Tilt' : 'Perspective: 2D Top-Down'}
        >
          3D
        </button>

        {/* Street Level 360 Imagery (Mapillary) */}
        <button
          onClick={() => {
            soundEngine.playClick();
            setIsStreetViewerOpen(true);
          }}
          className="w-9 h-9 rounded-full backdrop-blur-2xl border border-white/15 bg-[#0c1420]/85 text-emerald-400 hover:text-white flex items-center justify-center shadow-xl active:scale-90 transition-all"
          title="Open Mapillary Street-Level Imagery"
        >
          <Camera className="w-4 h-4" />
        </button>

        {/* Map Layers & Services Control Modal */}
        <button
          onClick={() => {
            soundEngine.playClick();
            setIsLayerModalOpen(true);
          }}
          className="w-9 h-9 rounded-full backdrop-blur-2xl border border-white/15 bg-[#0c1420]/85 text-[#9EE6B5] hover:text-white flex items-center justify-center shadow-xl active:scale-90 transition-all"
          title="Open Map Layers Control (OSM, OSRM, 3D, Traffic)"
        >
          <Layers className="w-4 h-4" />
        </button>

        {/* Re-center User GPS Crosshair */}
        <button
          onClick={() => {
            soundEngine.playClick();
            setRecenterKey((k) => k + 1);
          }}
          className="w-9 h-9 rounded-full bg-[#0c1420]/85 backdrop-blur-2xl border border-white/15 flex items-center justify-center text-[#9EE6B5] hover:text-white shadow-xl active:scale-90 transition-all"
          title="Re-center My GPS Location"
        >
          <Crosshair className="w-4 h-4" />
        </button>
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
            title={sheetSnap === 'collapsed' ? 'Swipe up to expand console' : 'Swipe down to collapse'}
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

        {/* ALWAYS-VISIBLE DRIVER STATUS CAPSULE & QUICK SHORTCUTS */}
        <div className="px-4 pb-3 space-y-2.5 shrink-0 select-none">
          {/* Main Operational Capsule */}
          <div
            onClick={() => {
              soundEngine.playClick();
              if (isOnTrip) {
                setDriverActiveTab('hud');
                setSheetSnap('expanded');
              } else {
                toggleOnlineStatus();
              }
            }}
            className="flex items-center justify-between bg-[#131b26]/90 backdrop-blur-2xl px-3.5 py-2.5 rounded-2xl cursor-pointer group shadow-[0_6px_20px_rgba(0,0,0,0.6)] border border-white/[0.1] transition-all hover:border-[#9EE6B5]/50 active:scale-[0.99]"
          >
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border transition-transform group-hover:scale-105 ${
                  isOnTrip
                    ? 'bg-blue-500/20 text-blue-400 border-blue-500/30'
                    : driverStatus === 'online'
                    ? 'bg-[#9EE6B5]/15 text-[#9EE6B5] border-[#9EE6B5]/30'
                    : 'bg-white/5 text-neutral-400 border-white/10'
                }`}
              >
                {isOnTrip ? (
                  <Navigation className="w-4 h-4" />
                ) : (
                  <Power className="w-4 h-4" />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <p className="text-xs font-JakartaBold text-white truncate">
                    {isOnTrip
                      ? 'Passenger En Route'
                      : driverStatus === 'online'
                      ? 'Online • Scanning for Dispatches'
                      : 'You are Currently Offline'}
                  </p>
                  {driverStatus === 'online' && (
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  )}
                </div>
                <p className="text-[10px] text-neutral-400 font-JakartaMedium truncate">
                  {isOnTrip
                    ? `${activeTrip?.destination?.address || 'Admiralty Way, Lekki'}`
                    : driverStatus === 'online'
                    ? 'Lekki Phase 1, Lagos • Surge 1.3x active'
                    : 'Tap here or press Online to start receiving ride requests'}
                </p>
              </div>
            </div>

            {/* Quick Action Button on Right */}
            <div className="shrink-0 ml-2">
              <span
                className={`text-[10px] font-JakartaBold px-2.5 py-1 rounded-full flex items-center gap-1 border ${
                  isOnTrip
                    ? 'bg-blue-500/20 text-blue-300 border-blue-500/30'
                    : driverStatus === 'online'
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                    : 'bg-[#9EE6B5] text-[#020408] border-[#9EE6B5]'
                }`}
              >
                {isOnTrip ? 'Active' : driverStatus === 'online' ? 'Ready' : 'Go Online'}
                <ChevronRight className="w-3 h-3" />
              </span>
            </div>
          </div>

          {/* 4 Quick Driver Shortcuts Grid (Earnings, Trips, Fleet, Rating) */}
          <div className="grid grid-cols-4 gap-2">
            {/* Today's Earnings Shortcut */}
            <button
              onClick={() => {
                soundEngine.playClick();
                setDriverActiveTab('earnings');
                setSheetSnap('expanded');
              }}
              className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl border active:scale-95 transition-all ${
                driverActiveTab === 'earnings'
                  ? 'bg-[#182333] border-[#9EE6B5]/60 text-white'
                  : 'bg-[#131b26]/80 hover:bg-[#182333] border-white/[0.08] text-neutral-300 hover:text-white'
              }`}
            >
              <div className="w-7 h-7 rounded-lg bg-[#9EE6B5]/15 text-[#9EE6B5] flex items-center justify-center mb-1">
                <DollarSign className="w-3.5 h-3.5" />
              </div>
              <span className="text-[10px] font-JakartaBold truncate w-full text-center">
                ₦{driverEarnings.today ? driverEarnings.today.toLocaleString() : '0'}
              </span>
            </button>

            {/* Trips Completed Shortcut */}
            <button
              onClick={() => {
                soundEngine.playClick();
                setDriverActiveTab('trips');
                setSheetSnap('expanded');
              }}
              className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl border active:scale-95 transition-all ${
                driverActiveTab === 'trips'
                  ? 'bg-[#182333] border-[#9EE6B5]/60 text-white'
                  : 'bg-[#131b26]/80 hover:bg-[#182333] border-white/[0.08] text-neutral-300 hover:text-white'
              }`}
            >
              <div className="w-7 h-7 rounded-lg bg-cyan-500/15 text-cyan-400 flex items-center justify-center mb-1">
                <Clock className="w-3.5 h-3.5" />
              </div>
              <span className="text-[10px] font-JakartaBold truncate w-full text-center">
                {driverEarnings.completedTrips} Trips
              </span>
            </button>

            {/* Vehicle / Fleet Shortcut */}
            <button
              onClick={() => {
                soundEngine.playClick();
                setDriverActiveTab('vehicles');
                setSheetSnap('expanded');
              }}
              className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl border active:scale-95 transition-all ${
                driverActiveTab === 'vehicles'
                  ? 'bg-[#182333] border-[#9EE6B5]/60 text-white'
                  : 'bg-[#131b26]/80 hover:bg-[#182333] border-white/[0.08] text-neutral-300 hover:text-white'
              }`}
            >
              <div className="w-7 h-7 rounded-lg bg-amber-500/15 text-amber-400 flex items-center justify-center mb-1">
                <Car className="w-3.5 h-3.5" />
              </div>
              <span className="text-[10px] font-JakartaBold truncate w-full text-center">
                {activeVehicle?.plateNumber ? activeVehicle.plateNumber.split('-')[0] : 'Fleet'}
              </span>
            </button>

            {/* Rating / Profile Shortcut */}
            <button
              onClick={() => {
                soundEngine.playClick();
                setDriverActiveTab('profile');
                setSheetSnap('expanded');
              }}
              className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl border active:scale-95 transition-all ${
                driverActiveTab === 'profile'
                  ? 'bg-[#182333] border-[#9EE6B5]/60 text-white'
                  : 'bg-[#131b26]/80 hover:bg-[#182333] border-white/[0.08] text-neutral-300 hover:text-white'
              }`}
            >
              <div className="w-7 h-7 rounded-lg bg-amber-500/15 text-amber-400 flex items-center justify-center mb-1">
                <Star className="w-3.5 h-3.5 fill-amber-400" />
              </div>
              <span className="text-[10px] font-JakartaBold truncate w-full text-center">
                ★ {driverRating}
              </span>
            </button>
          </div>
        </div>

        {/* ===================================================================== */}
        {/* EXPANDED CONTENT SCROLL AREA (REVEALED WHEN SWIPED UP) */}
        {/* ===================================================================== */}
        <div className="flex-1 overflow-y-auto px-4 pb-24 space-y-4 no-scrollbar pointer-events-auto">
          {/* INCOMING DISPATCH MODAL / ALERT (IF ANY) */}
          {incomingDriverRequest && (
            <div className="pt-1">
              <DriverIncomingModal />
            </div>
          )}

          {/* TAB 1: COCKPIT VIEW */}
          {driverActiveTab === 'hud' && (
            <div className="space-y-4 pt-1">
              {/* If on trip: display the active trip navigation and interaction HUD */}
              {isOnTrip ? (
                <DriverActiveTripHUD />
              ) : (
                <>
                  {/* ACTIVE VEHICLE SELECTOR CARD WITH 3D ASSET */}
                  <div>
                    <div className="flex items-center justify-between mb-2 px-1">
                      <div className="flex items-center gap-1.5">
                        <Car className="w-3.5 h-3.5 text-[#9EE6B5]" />
                        <h3 className="text-xs font-JakartaBold text-white tracking-wider uppercase">
                          Active Vehicle in Service
                        </h3>
                      </div>
                      <button
                        onClick={() => setDriverActiveTab('vehicles')}
                        className="text-[10px] text-[#9EE6B5] font-JakartaSemiBold hover:underline flex items-center"
                      >
                        Change <ChevronRight className="w-3 h-3 ml-0.5" />
                      </button>
                    </div>

                    <div
                      onClick={() => setDriverActiveTab('vehicles')}
                      className="bg-[#131b26]/90 rounded-2xl p-3.5 border border-white/[0.08] backdrop-blur-xl flex items-center justify-between cursor-pointer hover:border-[#9EE6B5]/50 active:scale-[0.99] transition-all shadow-lg"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-16 h-12 relative flex items-center justify-center shrink-0">
                          <img
                            src={getVehicle3DImage(activeVehicle?.category, activeVehicle?.name)}
                            alt={activeVehicle?.name || 'Vehicle'}
                            referrerPolicy="no-referrer"
                            className="max-h-12 w-auto object-contain filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)]"
                          />
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-xs font-JakartaBold text-white truncate">
                            {activeVehicle?.name || 'Broader Sedan'}
                          </h4>
                          <p className="text-[10px] text-neutral-400 font-mono mt-0.5">
                            {activeVehicle?.plateNumber || 'LND-394-AK'} • {activeVehicle?.categoryName || 'Standard Car'}
                          </p>
                        </div>
                      </div>

                      <span className="text-[9px] font-JakartaBold text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-2 py-1 rounded-full shrink-0">
                        Active In Service
                      </span>
                    </div>
                  </div>

                  {/* DRIVER PERFORMANCE METRICS (3 COLUMNS) */}
                  <div>
                    <div className="flex items-center justify-between mb-2 px-1">
                      <span className="text-[10px] font-JakartaBold text-neutral-400 uppercase tracking-wider">
                        Operational Quality Score
                      </span>
                      <span className="text-[10px] text-emerald-400 font-JakartaMedium">
                        Top 5% in Lagos
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      <div className="bg-[#131b26]/90 p-3 rounded-2xl border border-white/[0.08] text-center shadow-xs">
                        <div className="flex items-center justify-center text-amber-400 mb-0.5">
                          <Star className="w-3.5 h-3.5 fill-amber-400" />
                        </div>
                        <span className="text-xs font-JakartaBold text-white block">
                          {driverRating}
                        </span>
                        <span className="text-[10px] font-JakartaMedium text-neutral-400">Driver Rating</span>
                      </div>

                      <div className="bg-[#131b26]/90 p-3 rounded-2xl border border-white/[0.08] text-center shadow-xs">
                        <div className="flex items-center justify-center text-emerald-400 mb-0.5">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        </div>
                        <span className="text-xs font-JakartaBold text-white block">
                          {driverAcceptanceRate}%
                        </span>
                        <span className="text-[10px] font-JakartaMedium text-neutral-400">Acceptance</span>
                      </div>

                      <div className="bg-[#131b26]/90 p-3 rounded-2xl border border-white/[0.08] text-center shadow-xs">
                        <div className="flex items-center justify-center text-blue-400 mb-0.5">
                          <TrendingUp className="w-3.5 h-3.5" />
                        </div>
                        <span className="text-xs font-JakartaBold text-white block">
                          {driverCancellationRate}%
                        </span>
                        <span className="text-[10px] font-JakartaMedium text-neutral-400">Cancellation</span>
                      </div>
                    </div>
                  </div>

                  {/* TODAY'S EARNINGS SUMMARY CARD */}
                  <div
                    onClick={() => setDriverActiveTab('earnings')}
                    className="bg-[#131b26]/90 rounded-2xl border border-white/[0.08] p-3.5 shadow-lg cursor-pointer hover:border-[#9EE6B5]/40 transition-all"
                  >
                    <div className="flex items-center justify-between text-neutral-400 mb-1">
                      <span className="text-xs font-JakartaMedium flex items-center gap-1">
                        <DollarSign className="w-3.5 h-3.5 text-[#9EE6B5]" />
                        Today's Operational Earnings
                      </span>
                      <span className="text-[11px] font-JakartaBold text-[#9EE6B5] flex items-center">
                        Statement <ChevronRight className="w-3 h-3 ml-0.5" />
                      </span>
                    </div>

                    <div className="flex items-baseline justify-between mt-1">
                      <span className="text-lg font-JakartaBold text-white tracking-tight">
                        ₦{driverEarnings.today.toLocaleString()}
                      </span>
                      <span className="text-xs font-JakartaSemiBold text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-0.5 rounded-full">
                        {driverEarnings.completedTrips} Trips Completed
                      </span>
                    </div>
                  </div>

                  {/* EMERGENCY DISPATCH & SUPPORT */}
                  <div className="space-y-2">
                    <button
                      onClick={() => setSafetyModalOpen(true)}
                      className="w-full p-3 rounded-2xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/25 text-left flex items-center justify-between transition-colors active:scale-[0.99]"
                    >
                      <div className="flex items-center gap-2.5">
                        <ShieldAlert className="w-4 h-4 text-red-400" />
                        <div>
                          <span className="text-xs font-JakartaBold text-red-300 block">
                            Emergency SOS & Lagos 112
                          </span>
                          <span className="text-[10px] text-red-400/80">Immediate police & medical dispatch</span>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-red-400" />
                    </button>

                    <a
                      href="tel:+2348002762337"
                      className="w-full p-3 rounded-2xl bg-[#131b26]/90 hover:bg-[#182333] border border-white/[0.08] text-left flex items-center justify-between transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        <Phone className="w-4 h-4 text-[#9EE6B5]" />
                        <div>
                          <span className="text-xs font-JakartaBold text-white block">
                            Broader Driver Support Helpline
                          </span>
                          <span className="text-[10px] text-neutral-400">+234 800 BROADER (Toll-Free)</span>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-neutral-400" />
                    </a>
                  </div>
                </>
              )}
            </div>
          )}

          {/* TAB 2: EARNINGS VIEW */}
          {driverActiveTab === 'earnings' && (
            <div className="pt-1">
              <DriverEarningsView />
            </div>
          )}

          {/* TAB 3: TRIPS ACTIVITY VIEW */}
          {driverActiveTab === 'trips' && (
            <div className="pt-1">
              <DriverTripsView />
            </div>
          )}

          {/* TAB 4: VEHICLES FLEET VIEW */}
          {driverActiveTab === 'vehicles' && (
            <div className="pt-1">
              <DriverVehiclesView />
            </div>
          )}

          {/* TAB 5: PROFILE & COMPLIANCE VIEW */}
          {driverActiveTab === 'profile' && (
            <div className="space-y-3 pt-1 animate-in fade-in duration-200">
              {/* Driver Identity Card */}
              <div className="bg-[#131b26]/90 rounded-2xl border border-white/[0.08] p-3.5 shadow-lg space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-[#9EE6B5]/15 text-[#9EE6B5] border border-[#9EE6B5]/30 flex items-center justify-center font-JakartaBold text-sm shadow-xs">
                    CB
                  </div>
                  <div>
                    <h3 className="text-xs font-JakartaBold text-white">Chris Bakare</h3>
                    <p className="text-[10px] text-neutral-400 font-JakartaMedium">
                      Verified Professional Driver • Lagos State
                    </p>
                  </div>
                </div>

                <div className="p-2.5 bg-emerald-500/10 rounded-xl border border-emerald-500/20 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span className="font-JakartaBold text-emerald-300 text-[11px]">Account Approved & Active</span>
                  </div>
                  <span className="text-[9px] font-JakartaBold text-emerald-300 bg-emerald-500/20 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                    Verified
                  </span>
                </div>
              </div>

              {/* Regulatory Credentials */}
              <div className="bg-[#131b26]/90 rounded-2xl border border-white/[0.08] p-3.5 shadow-lg space-y-2 text-xs">
                <h4 className="text-[10px] font-JakartaBold text-neutral-300 uppercase tracking-wide">
                  Regulatory Licenses & Documents
                </h4>

                <div className="space-y-1.5">
                  <div className="p-2 bg-white/[0.04] rounded-xl flex items-center justify-between border border-white/[0.06]">
                    <div>
                      <span className="text-neutral-400 font-JakartaMedium block text-[9px]">FRSC Driver's Licence</span>
                      <span className="font-mono font-bold text-white text-[11px]">FRSC-LA-2022-88190</span>
                    </div>
                    <span className="text-[9px] text-emerald-400 font-JakartaBold">Expires 2027</span>
                  </div>

                  <div className="p-2 bg-white/[0.04] rounded-xl flex items-center justify-between border border-white/[0.06]">
                    <div>
                      <span className="text-neutral-400 font-JakartaMedium block text-[9px]">LASDRI Certification</span>
                      <span className="font-mono font-bold text-white text-[11px]">LASDRI-VI-44910</span>
                    </div>
                    <span className="text-[9px] text-emerald-400 font-JakartaBold">Active</span>
                  </div>

                  <div className="p-2 bg-white/[0.04] rounded-xl flex items-center justify-between border border-white/[0.06]">
                    <div>
                      <span className="text-neutral-400 font-JakartaMedium block text-[9px]">National Identity (NIN)</span>
                      <span className="font-mono font-bold text-white text-[11px]">9281-7264-819</span>
                    </div>
                    <span className="text-[9px] text-emerald-400 font-JakartaBold">NIMC Verified</span>
                  </div>
                </div>
              </div>

              {/* Safety & Hotline */}
              <div className="space-y-2">
                <button
                  onClick={() => setSafetyModalOpen(true)}
                  className="w-full p-3 rounded-2xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/25 text-left flex items-center justify-between transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <ShieldAlert className="w-4 h-4 text-red-400" />
                    <div>
                      <span className="text-xs font-JakartaBold text-red-300 block">
                        Emergency SOS & Lagos 112
                      </span>
                      <span className="text-[10px] text-red-400/80">Immediate police & medical dispatch</span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-red-400" />
                </button>

                <a
                  href="tel:+2348002762337"
                  className="w-full p-3 rounded-2xl bg-[#131b26]/90 hover:bg-[#182333] border border-white/[0.08] text-left flex items-center justify-between transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <Phone className="w-4 h-4 text-[#9EE6B5]" />
                    <div>
                      <span className="text-xs font-JakartaBold text-white block">
                        Broader Driver Support Helpline
                      </span>
                      <span className="text-[10px] text-neutral-400">+234 800 BROADER (Toll-Free)</span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-neutral-400" />
                </a>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* STATIC BOTTOM NAVIGATION DOCK (FIXED AT SCREEN BOTTOM) */}
      {/* ========================================================================= */}
      <div className="fixed inset-x-0 bottom-0 z-50 max-w-md sm:max-w-xl md:max-w-2xl lg:max-w-3xl mx-auto px-4 pb-3 pt-1.5 select-none pointer-events-auto bg-[#0c1420]/95 backdrop-blur-2xl border-t border-white/[0.08] shadow-[0_-8px_32px_rgba(0,0,0,0.9)]">
        <nav className="w-full h-[56px] rounded-2xl px-3 flex items-center justify-around bg-[#131b26]/90 border border-white/[0.1] shadow-[0_8px_24px_rgba(0,0,0,0.8)]">
          {navTabs.map((tab) => {
            const focused = driverActiveTab === tab.id;
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  soundEngine.playClick();
                  setDriverActiveTab(tab.id);
                  setSheetSnap('expanded');
                }}
                className="flex flex-col items-center justify-center p-1 transition-all group active:scale-95"
                aria-label={tab.label}
                title={tab.label}
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

      {/* Safety SOS Modal */}
      <DriverSafetyModal isOpen={safetyModalOpen} onClose={() => setSafetyModalOpen(false)} />

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
    </div>
  );
};

