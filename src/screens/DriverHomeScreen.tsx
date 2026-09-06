import React, { useState, useEffect } from 'react';
import { useBroaderStore } from '../store/useBroaderStore';
import {
  Power,
  Navigation,
  DollarSign,
  Star,
  CheckCircle2,
  XCircle,
  Clock,
  MapPin,
  ChevronRight,
  TrendingUp,
  User,
  Phone,
  ShieldAlert,
  ArrowRight,
  Car,
  Bell,
  Layers,
} from 'lucide-react';
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
  const respondToDriverRequest = useBroaderStore((s) => s.respondToDriverRequest);

  const [timerSeconds, setTimerSeconds] = useState(15);
  const [activeDriverRideStep, setActiveDriverRideStep] = useState<'arriving' | 'arrived' | 'in_transit' | 'completed'>('arriving');

  // Countdown timer for incoming request
  useEffect(() => {
    if (!incomingDriverRequest) {
      setTimerSeconds(15);
      return;
    }

    const timer = setInterval(() => {
      setTimerSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          respondToDriverRequest(false);
          return 15;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [incomingDriverRequest, respondToDriverRequest]);

  const toggleOnlineStatus = () => {
    if (driverStatus === 'online') {
      setDriverStatus('offline');
    } else {
      setDriverStatus('online');
      // If no active request, offer sample incoming request for demonstration
      if (!incomingDriverRequest) {
        setIncomingDriverRequest(SAMPLE_INCOMING_DRIVER_REQUESTS[0]);
      }
    }
  };

  const handleSimulateNewRequest = () => {
    const randomReq = SAMPLE_INCOMING_DRIVER_REQUESTS[Math.floor(Math.random() * SAMPLE_INCOMING_DRIVER_REQUESTS.length)];
    setIncomingDriverRequest({
      ...randomReq,
      id: 'req_lag_' + Date.now().toString().slice(-4),
    });
    setTimerSeconds(15);
  };

  return (
    <div className="flex flex-col h-full bg-[#F6F8FA] select-none">
      {/* Top Driver Header */}
      <div className="px-5 pt-4 pb-3 bg-white border-b border-slate-200 shrink-0 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center font-JakartaBold text-sm shadow-xs">
              DR
            </div>
            <div
              className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white ${
                driverStatus === 'online'
                  ? 'bg-emerald-500'
                  : driverStatus === 'on_trip'
                  ? 'bg-blue-500'
                  : 'bg-slate-400'
              }`}
            />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h2 className="text-sm font-JakartaBold text-slate-900 leading-none">Broader Driver</h2>
              <span className="text-[10px] font-JakartaBold text-blue-600 bg-blue-50 px-1.5 py-0.2 rounded">
                Lagos
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-JakartaMedium mt-0.5">
              {driverStatus === 'online'
                ? 'Ready for trip requests'
                : driverStatus === 'on_trip'
                ? 'Active passenger trip'
                : 'You are currently offline'}
            </p>
          </div>
        </div>

        {/* Switch Mode Pill */}
        <button
          onClick={() => setIsDriverMode(false)}
          className="px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-JakartaBold flex items-center gap-1 transition-all"
          title="Switch to Passenger Rider App"
        >
          <span>Rider App</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
        {/* Online / Offline Switcher Banner */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={toggleOnlineStatus}
              className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
                driverStatus === 'online' || driverStatus === 'on_trip'
                  ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/25 ring-4 ring-emerald-100'
                  : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
              }`}
            >
              <Power className="w-6 h-6" />
            </button>
            <div>
              <span className="text-xs font-JakartaBold text-slate-800">
                {driverStatus === 'online' ? 'You are Online' : driverStatus === 'on_trip' ? 'On Trip' : 'Go Online'}
              </span>
              <p className="text-[11px] text-slate-400 font-JakartaMedium">
                {driverStatus === 'online' ? 'Receiving ride dispatches' : 'Tap power button to connect'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {driverStatus === 'online' && !incomingDriverRequest && (
              <button
                onClick={handleSimulateNewRequest}
                className="px-2.5 py-1 rounded-xl bg-blue-50 border border-blue-200 text-[#0286FF] text-[10px] font-JakartaBold hover:bg-blue-100 transition-all"
              >
                Test Dispatch
              </button>
            )}
            <span
              className={`text-xs font-JakartaBold px-2.5 py-1 rounded-full ${
                driverStatus === 'online'
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'bg-slate-100 text-slate-500'
              }`}
            >
              {driverStatus.toUpperCase()}
            </span>
          </div>
        </div>

        {/* Today's Operational Earnings Card */}
        <div
          onClick={() => setScreen('driver-earnings')}
          className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs cursor-pointer hover:border-blue-300 transition-all"
        >
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-JakartaMedium flex items-center gap-1">
              <DollarSign className="w-3.5 h-3.5 text-[#0286FF]" />
              Today’s Total Earnings
            </span>
            <span className="text-[11px] font-JakartaBold text-[#0286FF] flex items-center">
              <span>View Statement</span>
              <ChevronRight className="w-3 h-3 ml-0.5" />
            </span>
          </div>

          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl font-JakartaBold text-slate-900 tracking-tight">
              ₦{driverEarnings.today.toLocaleString()}
            </span>
            <span className="text-xs font-JakartaSemiBold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              {driverEarnings.completedTrips} Trips Completed
            </span>
          </div>

          <div className="mt-3 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="text-[10px] font-JakartaMedium text-slate-400">Available to Withdraw</span>
              <p className="font-JakartaBold text-slate-800">₦{driverEarnings.availableBalance.toLocaleString()}</p>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-JakartaMedium text-slate-400">Week-to-date</span>
              <p className="font-JakartaBold text-slate-800">₦{driverEarnings.thisWeek.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Driver Performance Metrics */}
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-white p-3 rounded-2xl border border-slate-200 text-center shadow-xs">
            <div className="flex items-center justify-center text-amber-500 mb-0.5">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
            </div>
            <span className="text-sm font-JakartaBold text-slate-900 block">4.93</span>
            <span className="text-[10px] font-JakartaMedium text-slate-400">Rating</span>
          </div>

          <div className="bg-white p-3 rounded-2xl border border-slate-200 text-center shadow-xs">
            <div className="flex items-center justify-center text-emerald-500 mb-0.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </div>
            <span className="text-sm font-JakartaBold text-slate-900 block">98%</span>
            <span className="text-[10px] font-JakartaMedium text-slate-400">Acceptance</span>
          </div>

          <div className="bg-white p-3 rounded-2xl border border-slate-200 text-center shadow-xs">
            <div className="flex items-center justify-center text-blue-500 mb-0.5">
              <TrendingUp className="w-3.5 h-3.5" />
            </div>
            <span className="text-sm font-JakartaBold text-slate-900 block">0.8%</span>
            <span className="text-[10px] font-JakartaMedium text-slate-400">Cancellation</span>
          </div>
        </div>

        {/* INCOMING RIDE REQUEST INTERFACE */}
        {incomingDriverRequest && (
          <div className="bg-white rounded-3xl p-4 shadow-xl border-2 border-[#0286FF] animate-in zoom-in-95 duration-200 space-y-3">
            {/* Header with Countdown */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#0286FF] animate-ping" />
                <h4 className="text-sm font-JakartaBold text-slate-900 uppercase tracking-wider">
                  New Ride Request
                </h4>
              </div>

              {/* Countdown badge */}
              <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-50 text-[#0286FF] text-xs font-JakartaBold border border-blue-200">
                <Clock className="w-3 h-3" />
                <span>{timerSeconds}s</span>
              </div>
            </div>

            {/* Countdown Progress Bar */}
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-[#0286FF] h-full transition-all duration-1000 ease-linear"
                style={{ width: `${(timerSeconds / 15) * 100}%` }}
              />
            </div>

            {/* Price & Trip Spec */}
            <div className="flex items-center justify-between p-3 bg-blue-50/60 rounded-2xl border border-blue-100">
              <div>
                <span className="text-[10px] font-JakartaBold text-blue-600 uppercase">Estimated Earnings</span>
                <p className="text-xl font-JakartaBold text-slate-900">
                  ₦{incomingDriverRequest.estimatedEarnings.toLocaleString()}
                </p>
              </div>
              <div className="text-right">
                <span className="text-xs font-JakartaBold text-slate-800 block">
                  {incomingDriverRequest.distanceKm} km • ~{incomingDriverRequest.estimatedMinutes} mins
                </span>
                <span className="text-[10px] font-JakartaMedium text-slate-500">
                  {incomingDriverRequest.vehicleType}
                </span>
              </div>
            </div>

            {/* Passenger Info */}
            <div className="flex items-center gap-2.5 px-1">
              <img
                src={incomingDriverRequest.customerImage || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80'}
                alt="Passenger"
                className="w-9 h-9 rounded-full object-cover"
              />
              <div className="min-w-0 flex-1">
                <p className="text-xs font-JakartaBold text-slate-900 truncate">
                  {incomingDriverRequest.customerName}
                </p>
                <div className="flex items-center gap-1 text-[10px] text-amber-500 font-bold">
                  <Star className="w-2.5 h-2.5 fill-amber-400" />
                  <span>{incomingDriverRequest.customerRating}</span>
                </div>
              </div>
            </div>

            {/* Pickup & Dropoff */}
            <div className="space-y-2 p-3 bg-slate-50 rounded-2xl text-xs">
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 rounded-full bg-[#0286FF] mt-1 shrink-0" />
                <p className="font-JakartaMedium text-slate-800 text-[11px] truncate">
                  {incomingDriverRequest.pickup}
                </p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1 shrink-0" />
                <p className="font-JakartaMedium text-slate-800 text-[11px] truncate">
                  {incomingDriverRequest.destination}
                </p>
              </div>
            </div>

            {/* Accept / Reject Action Buttons */}
            <div className="grid grid-cols-3 gap-2 pt-1">
              <button
                onClick={() => respondToDriverRequest(false)}
                className="py-3 rounded-2xl border border-slate-200 text-slate-600 font-JakartaBold text-xs hover:bg-slate-50 active:scale-95 transition-all"
              >
                Reject
              </button>

              <button
                onClick={() => respondToDriverRequest(true)}
                className="col-span-2 py-3 rounded-2xl bg-[#0286FF] hover:bg-blue-600 text-white font-JakartaBold text-xs shadow-lg shadow-blue-500/25 active:scale-95 transition-all flex items-center justify-center gap-1.5"
              >
                <span>Accept Trip</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ACTIVE ON-TRIP OPERATOR FLOW */}
        {driverStatus === 'on_trip' && (
          <div className="bg-white rounded-3xl p-4 shadow-md border border-slate-200 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <h4 className="text-xs font-JakartaBold text-slate-900 uppercase">Active Turn-by-Turn Navigation</h4>
              </div>
              <span className="text-[11px] font-JakartaBold text-[#0286FF]">GPS Pinned</span>
            </div>

            <div className="p-3 bg-slate-900 text-white rounded-2xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center">
                  <Navigation className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-JakartaBold">In 200m Turn Right</p>
                  <p className="text-[10px] text-slate-400 font-JakartaMedium">onto Ozumba Mbadiwe Ave, Victoria Island</p>
                </div>
              </div>
              <span className="text-xs font-mono font-bold text-emerald-400">12 min</span>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  setDriverStatus('online');
                }}
                className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-JakartaBold text-xs shadow-md shadow-emerald-600/20"
              >
                Complete Ride & Collect Fare
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
