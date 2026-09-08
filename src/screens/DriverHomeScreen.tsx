import React, { useState, useEffect } from 'react';
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
  ArrowRight,
  Car,
  Compass,
  Calendar,
  Wallet,
  ShieldCheck,
  Send,
  MapPin,
  Radio,
  FileText,
  Phone,
} from 'lucide-react';
import { InteractiveMap } from '../components/InteractiveMap';
import { DriverIncomingModal } from '../components/driver/DriverIncomingModal';
import { DriverActiveTripHUD } from '../components/driver/DriverActiveTripHUD';
import { DriverEarningsView } from '../components/driver/DriverEarningsView';
import { DriverTripsView } from '../components/driver/DriverTripsView';
import { DriverVehiclesView } from '../components/driver/DriverVehiclesView';
import { DriverSafetyModal } from '../components/driver/DriverSafetyModal';
import { SAMPLE_INCOMING_DRIVER_REQUESTS } from '../services/backendService';

export const DriverHomeScreen: React.FC = () => {
  const isDriverMode = useBroaderStore((s) => s.isDriverMode);
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

  const activeVehicle =
    driverVehicles.find((v) => v.id === activeDriverVehicleId) || driverVehicles[0];

  const toggleOnlineStatus = () => {
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
  };

  const isOnTrip = driverStatus === 'on_trip' || (activeTrip !== null && rideStatus !== 'idle');

  return (
    <div className="flex flex-col h-full bg-[#000000] text-white select-none">
      {/* Top Driver Header */}
      <header className="px-4 pt-3.5 pb-2.5 glass-nav border-b border-white/[0.08] shrink-0 flex items-center justify-between z-20">
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <div className="w-9 h-9 rounded-full bg-white/10 text-white flex items-center justify-center font-JakartaBold text-xs shadow-xs border border-white/15">
              CB
            </div>
            <div
              className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-black ${
                isOnTrip
                  ? 'bg-blue-500'
                  : driverStatus === 'online'
                  ? 'bg-emerald-500'
                  : 'bg-neutral-500'
              }`}
            />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h2 className="text-xs font-JakartaBold text-white leading-none">Chris Bakare</h2>
              <span className="text-[9px] font-mono font-bold text-neutral-300 bg-white/10 px-1.5 py-0.5 rounded border border-white/10">
                {activeVehicle?.plateNumber || 'LND-394-AK'}
              </span>
            </div>
            <p className="text-[10px] text-neutral-400 font-JakartaMedium mt-0.5">
              {isOnTrip
                ? 'Active Passenger Trip'
                : driverStatus === 'online'
                ? 'Online • Waiting for Dispatch'
                : 'Offline'}
            </p>
          </div>
        </div>

        {/* Quick Actions: Switch to Rider App & Emergency SOS */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setSafetyModalOpen(true)}
            className="w-8 h-8 rounded-full bg-red-500/20 text-red-400 hover:bg-red-500/30 flex items-center justify-center border border-red-500/30 transition-colors"
            title="Emergency SOS"
          >
            <ShieldAlert className="w-4 h-4" />
          </button>

          <button
            onClick={() => {
              setIsDriverMode(false);
              setScreen('home');
            }}
            className="px-2.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-neutral-200 text-[11px] font-JakartaBold flex items-center gap-1 border border-white/10 transition-all"
            title="Switch back to Passenger Rider App"
          >
            <span>Rider App</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </header>

      {/* Driver Operational Tab Navigation */}
      <nav className="px-4 py-1.5 glass-nav border-b border-white/[0.08] shrink-0 flex items-center justify-between gap-1 z-10">
        {[
          { id: 'hud', label: 'Cockpit', icon: Navigation },
          { id: 'earnings', label: 'Earnings', icon: DollarSign },
          { id: 'trips', label: 'Trips', icon: Clock },
          { id: 'vehicles', label: 'Fleet', icon: Car },
          { id: 'profile', label: 'Profile', icon: ShieldCheck },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = driverActiveTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setDriverActiveTab(tab.id as any)}
              className={`flex-1 py-1.5 px-1 rounded-xl text-[11px] font-JakartaBold flex items-center justify-center gap-1 transition-all ${
                isActive
                  ? 'bg-blue-500/20 text-[#0286FF] border border-blue-500/30 shadow-[0_0_10px_rgba(2,134,255,0.2)]'
                  : 'text-neutral-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
        {/* TAB 1: COCKPIT / MAP HUD */}
        {driverActiveTab === 'hud' && (
          <div className="space-y-3">
            {/* Interactive Map Cockpit */}
            <div className="relative rounded-3xl overflow-hidden border border-white/10 shadow-xs bg-black h-[220px]">
              <InteractiveMap height="h-[220px]" showRoute={isOnTrip} />

              {/* Map Floating Beacon: GPS & Demand Badge */}
              <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                <div className="px-2.5 py-1 rounded-full bg-black/80 backdrop-blur-md text-white text-[10px] font-JakartaBold flex items-center gap-1.5 shadow-sm border border-white/10">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Lekki Phase 1, Lagos • GPS 5G</span>
                </div>

                <div className="px-2.5 py-1 rounded-full bg-[#0286FF]/90 backdrop-blur-md text-white text-[10px] font-JakartaBold flex items-center gap-1 shadow-sm border border-blue-400/30">
                  <TrendingUp className="w-3 h-3" />
                  <span>Surge 1.3x</span>
                </div>
              </div>

              {/* Map Floating Current Vehicle Indicator */}
              <div className="absolute bottom-2.5 left-3 pointer-events-none">
                <div className="px-2 py-0.5 rounded-lg bg-black/80 backdrop-blur-md text-neutral-200 text-[9px] font-mono font-bold shadow-xs border border-white/15">
                  {activeVehicle?.name} ({activeVehicle?.plateNumber})
                </div>
              </div>
            </div>

            {/* ACTIVE TRIP ON-COURSE HUD */}
            {isOnTrip ? (
              <DriverActiveTripHUD />
            ) : incomingDriverRequest ? (
              /* INCOMING DISPATCH MODAL */
              <DriverIncomingModal />
            ) : (
              /* ONLINE / OFFLINE AVAILABILITY CONTROLLER */
              <div className="space-y-3">
                <div className="glass-panel rounded-3xl border border-white/10 p-4 shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={toggleOnlineStatus}
                        className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
                          driverStatus === 'online'
                            ? 'bg-emerald-500 text-white shadow-[0_0_16px_rgba(16,185,129,0.5)] ring-2 ring-emerald-400/50'
                            : 'bg-white/10 text-neutral-400 hover:bg-white/15 active:scale-95 border border-white/10'
                        }`}
                        title={driverStatus === 'online' ? 'Tap to go Offline' : 'Tap to go Online'}
                      >
                        <Power className="w-5 h-5" />
                      </button>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h4 className="text-xs font-JakartaBold text-white">
                            {driverStatus === 'online' ? 'You are Online' : 'You are Offline'}
                          </h4>
                          <span
                            className={`w-2 h-2 rounded-full ${
                              driverStatus === 'online' ? 'bg-emerald-500 animate-ping' : 'bg-neutral-500'
                            }`}
                          />
                        </div>
                        <p className="text-[11px] text-neutral-400 font-JakartaMedium">
                          {driverStatus === 'online'
                            ? 'Actively receiving trip dispatches'
                            : 'Go online to start receiving ride requests'}
                        </p>
                      </div>
                    </div>

                    <span
                      className={`text-[10px] font-JakartaBold px-2.5 py-1 rounded-full ${
                        driverStatus === 'online'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-white/5 text-neutral-400 border border-white/10'
                      }`}
                    >
                      {driverStatus === 'online' ? 'READY' : 'OFFLINE'}
                    </span>
                  </div>

                  {/* Operational Controls when Online */}
                  {driverStatus === 'online' && (
                    <div className="p-3 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 flex items-center justify-between text-xs animate-in fade-in duration-150">
                      <div className="flex items-center gap-2">
                        <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
                        <span className="text-[11px] font-JakartaMedium text-emerald-300">
                          Scanning Lekki & VI for passengers...
                        </span>
                      </div>
                      <button
                        onClick={handleSimulateNewRequest}
                        className="px-2.5 py-1 rounded-xl bg-white/10 hover:bg-white/20 text-emerald-300 text-[10px] font-JakartaBold border border-emerald-500/30 shadow-xs transition-colors"
                        title="Simulate incoming passenger booking"
                      >
                        Test Dispatch
                      </button>
                    </div>
                  )}

                  {/* Selected Vehicle Indicator */}
                  <div
                    onClick={() => setDriverActiveTab('vehicles')}
                    className="p-2.5 bg-white/[0.04] hover:bg-white/[0.08] rounded-2xl border border-white/10 flex items-center justify-between text-xs cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <Car className="w-4 h-4 text-neutral-400" />
                      <div>
                        <span className="text-xs font-JakartaBold text-white block">
                          {activeVehicle?.name}
                        </span>
                        <span className="text-[10px] text-neutral-400 font-mono">
                          {activeVehicle?.plateNumber} • {activeVehicle?.categoryName}
                        </span>
                      </div>
                    </div>
                    <span className="text-[11px] font-JakartaBold text-[#0286FF] flex items-center">
                      Change <ChevronRight className="w-3 h-3 ml-0.5" />
                    </span>
                  </div>
                </div>

                {/* Today's Quick Summary Pill */}
                <div
                  onClick={() => setDriverActiveTab('earnings')}
                  className="glass-panel rounded-3xl border border-white/10 p-4 shadow-xs cursor-pointer hover:border-blue-500/40 transition-all"
                >
                  <div className="flex items-center justify-between text-neutral-400 mb-1">
                    <span className="text-xs font-JakartaMedium flex items-center gap-1">
                      <DollarSign className="w-3.5 h-3.5 text-[#0286FF]" />
                      Today's Operational Earnings
                    </span>
                    <span className="text-[11px] font-JakartaBold text-[#0286FF] flex items-center">
                      Statement <ChevronRight className="w-3 h-3 ml-0.5" />
                    </span>
                  </div>

                  <div className="flex items-baseline justify-between mt-1">
                    <span className="text-lg font-JakartaBold text-white tracking-tight">
                      ₦{driverEarnings.today.toLocaleString()}
                    </span>
                    <span className="text-xs font-JakartaSemiBold text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                      {driverEarnings.completedTrips} Completed
                    </span>
                  </div>
                </div>

                {/* Driver Performance Metrics (3 Columns) */}
                <div className="grid grid-cols-3 gap-2">
                  <div className="glass-panel p-3 rounded-2xl border border-white/10 text-center shadow-xs">
                    <div className="flex items-center justify-center text-amber-400 mb-0.5">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                    </div>
                    <span className="text-xs font-JakartaBold text-white block">
                      {driverRating}
                    </span>
                    <span className="text-[10px] font-JakartaMedium text-neutral-400">Driver Rating</span>
                  </div>

                  <div className="glass-panel p-3 rounded-2xl border border-white/10 text-center shadow-xs">
                    <div className="flex items-center justify-center text-emerald-400 mb-0.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-xs font-JakartaBold text-white block">
                      {driverAcceptanceRate}%
                    </span>
                    <span className="text-[10px] font-JakartaMedium text-neutral-400">Acceptance</span>
                  </div>

                  <div className="glass-panel p-3 rounded-2xl border border-white/10 text-center shadow-xs">
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
            )}
          </div>
        )}

        {/* TAB 2: EARNINGS VIEW */}
        {driverActiveTab === 'earnings' && <DriverEarningsView />}

        {/* TAB 3: TRIPS ACTIVITY VIEW */}
        {driverActiveTab === 'trips' && <DriverTripsView />}

        {/* TAB 4: VEHICLES FLEET VIEW */}
        {driverActiveTab === 'vehicles' && <DriverVehiclesView />}

        {/* TAB 5: PROFILE & COMPLIANCE VIEW */}
        {driverActiveTab === 'profile' && (
          <div className="space-y-3 pb-6 animate-in fade-in duration-200">
            {/* Driver Identity Card */}
            <div className="glass-panel rounded-3xl border border-white/10 p-4 shadow-xs space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-white/10 text-white flex items-center justify-center font-JakartaBold text-sm shadow-xs border border-white/15">
                  CB
                </div>
                <div>
                  <h3 className="text-sm font-JakartaBold text-white">Chris Bakare</h3>
                  <p className="text-[11px] text-neutral-400 font-JakartaMedium">
                    Verified Professional Driver • Lagos State
                  </p>
                </div>
              </div>

              <div className="p-3 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span className="font-JakartaBold text-emerald-300">Account Approved & Active</span>
                </div>
                <span className="text-[10px] font-JakartaBold text-emerald-300 bg-emerald-500/20 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                  Verified
                </span>
              </div>
            </div>

            {/* Regulatory Credentials */}
            <div className="glass-panel rounded-3xl border border-white/10 p-4 shadow-xs space-y-2.5 text-xs">
              <h4 className="text-xs font-JakartaBold text-neutral-300 uppercase tracking-wide">
                Regulatory Licenses & Documents
              </h4>

              <div className="space-y-2">
                <div className="p-2.5 bg-white/[0.04] rounded-xl flex items-center justify-between border border-white/[0.06]">
                  <div>
                    <span className="text-neutral-400 font-JakartaMedium block text-[10px]">FRSC Driver's Licence</span>
                    <span className="font-mono font-bold text-white">FRSC-LA-2022-88190</span>
                  </div>
                  <span className="text-[10px] text-emerald-400 font-JakartaBold">Expires 2027</span>
                </div>

                <div className="p-2.5 bg-white/[0.04] rounded-xl flex items-center justify-between border border-white/[0.06]">
                  <div>
                    <span className="text-neutral-400 font-JakartaMedium block text-[10px]">LASDRI Certification</span>
                    <span className="font-mono font-bold text-white">LASDRI-VI-44910</span>
                  </div>
                  <span className="text-[10px] text-emerald-400 font-JakartaBold">Active</span>
                </div>

                <div className="p-2.5 bg-white/[0.04] rounded-xl flex items-center justify-between border border-white/[0.06]">
                  <div>
                    <span className="text-neutral-400 font-JakartaMedium block text-[10px]">National Identity (NIN)</span>
                    <span className="font-mono font-bold text-white">9281-7264-819</span>
                  </div>
                  <span className="text-[10px] text-emerald-400 font-JakartaBold">NIMC Verified</span>
                </div>
              </div>
            </div>

            {/* Support & Safety Dispatch */}
            <div className="glass-panel rounded-3xl border border-white/10 p-4 shadow-xs space-y-2.5">
              <h4 className="text-xs font-JakartaBold text-neutral-300 uppercase tracking-wide">
                Support & Emergency
              </h4>

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
                  className="w-full p-3 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-left flex items-center justify-between transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <Phone className="w-4 h-4 text-[#0286FF]" />
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
          </div>
        )}
      </main>

      {/* Safety SOS Modal */}
      <DriverSafetyModal isOpen={safetyModalOpen} onClose={() => setSafetyModalOpen(false)} />
    </div>
  );
};
