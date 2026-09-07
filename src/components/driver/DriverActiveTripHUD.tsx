import React, { useState, useEffect } from 'react';
import { useBroaderStore } from '../../store/useBroaderStore';
import {
  Navigation,
  CheckCircle2,
  Play,
  Flag,
  Phone,
  MessageSquare,
  ShieldAlert,
  Clock,
  MapPin,
  Star,
  DollarSign,
  AlertCircle,
  X,
  Compass,
  ArrowRight,
  TrendingUp,
  Percent,
} from 'lucide-react';
import { DriverSafetyModal } from './DriverSafetyModal';
import { DriverCommunicationModal } from './DriverCommunicationModal';

export const DriverActiveTripHUD: React.FC = () => {
  const activeTrip = useBroaderStore((s) => s.activeTrip);
  const rideStatus = useBroaderStore((s) => s.rideStatus);
  const setRideStatus = useBroaderStore((s) => s.setRideStatus);
  const completeActiveTrip = useBroaderStore((s) => s.completeActiveTrip);
  const driverRatePassenger = useBroaderStore((s) => s.driverRatePassenger);
  const driverCancelActiveTrip = useBroaderStore((s) => s.driverCancelActiveTrip);

  // Modals state
  const [safetyModalOpen, setSafetyModalOpen] = useState(false);
  const [commModal, setCommModal] = useState<{ open: boolean; type: 'call' | 'chat' }>({
    open: false,
    type: 'call',
  });
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState('Passenger no-show after 5 minutes');

  // Waiting timer for 'driver_arrived'
  const [waitSeconds, setWaitSeconds] = useState(300); // 5 minutes free wait
  useEffect(() => {
    if (rideStatus !== 'driver_arrived') {
      setWaitSeconds(300);
      return;
    }
    const interval = setInterval(() => {
      setWaitSeconds((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [rideStatus]);

  // Rating state for completed trip
  const [starRating, setStarRating] = useState(5);
  const [selectedPraises, setSelectedPraises] = useState<string[]>(['Polite & respectful', 'Punctual']);

  if (!activeTrip) return null;

  // Passenger data fallback
  const passengerName = 'Amina Yusuf';
  const passengerRating = 4.9;
  const passengerImage = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80';

  const grossFare = activeTrip.fare || 3200;
  const commission = Math.round(grossFare * 0.15);
  const netEarnings = grossFare - commission;

  const togglePraise = (praise: string) => {
    if (selectedPraises.includes(praise)) {
      setSelectedPraises(selectedPraises.filter((p) => p !== praise));
    } else {
      setSelectedPraises([...selectedPraises, praise]);
    }
  };

  const formatWaitTime = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins}:${secs < 10 ? '0' + secs : secs}`;
  };

  return (
    <>
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-4 space-y-3.5 animate-in slide-in-from-bottom-3 duration-300">
        {/* Top Status Bar with Turn-by-Turn Prompt */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span
              className={`w-2.5 h-2.5 rounded-full animate-ping ${
                rideStatus === 'ride_completed'
                  ? 'bg-emerald-500'
                  : rideStatus === 'ride_started'
                  ? 'bg-blue-600'
                  : 'bg-amber-500'
              }`}
            />
            <span className="text-xs font-JakartaBold text-slate-800 uppercase tracking-wide">
              {rideStatus === 'driver_arriving' && 'Heading to Pickup'}
              {rideStatus === 'driver_arrived' && 'Arrived at Pickup'}
              {rideStatus === 'ride_started' && 'En Route to Destination'}
              {rideStatus === 'ride_completed' && 'Trip Completed & Settled'}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setSafetyModalOpen(true)}
              className="p-1.5 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
              title="Emergency SOS"
            >
              <ShieldAlert className="w-4 h-4" />
            </button>
            {rideStatus !== 'ride_completed' && (
              <button
                onClick={() => setCancelModalOpen(true)}
                className="p-1.5 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
                title="Cancel Trip"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Turn-by-turn Navigation Banner */}
        {rideStatus !== 'ride_completed' && (
          <div className="p-3 bg-slate-900 text-white rounded-2xl flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0">
                <Navigation className="w-4 h-4 rotate-45" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-JakartaBold truncate">
                  {rideStatus === 'driver_arriving'
                    ? 'In 250m turn right onto Admiralty Way'
                    : rideStatus === 'driver_arrived'
                    ? 'Wait at gate for passenger boarding'
                    : 'In 500m proceed along Ozumba Mbadiwe Ave'}
                </p>
                <p className="text-[10px] text-slate-400 font-JakartaMedium truncate">
                  {rideStatus === 'ride_started'
                    ? activeTrip.destination.address
                    : activeTrip.pickup.address}
                </p>
              </div>
            </div>
            <div className="text-right shrink-0 pl-2">
              <span className="text-xs font-mono font-bold text-emerald-400 block">
                {rideStatus === 'ride_started' ? '12 min' : '3 min'}
              </span>
              <span className="text-[10px] text-slate-400 font-medium">
                {rideStatus === 'ride_started' ? `${activeTrip.distanceKm || 4.8} km` : '0.8 km'}
              </span>
            </div>
          </div>
        )}

        {/* PHASE SPECIFIC CONTENT */}

        {/* 1. DRIVER ARRIVING */}
        {rideStatus === 'driver_arriving' && (
          <div className="space-y-3">
            {/* Passenger Bar with Call & Chat buttons */}
            <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="flex items-center gap-2.5">
                <img
                  src={passengerImage}
                  alt={passengerName}
                  className="w-10 h-10 rounded-full object-cover border border-white shadow-xs"
                />
                <div>
                  <h4 className="text-xs font-JakartaBold text-slate-900">{passengerName}</h4>
                  <div className="flex items-center gap-1 text-[10px] text-amber-500 font-JakartaBold">
                    <Star className="w-2.5 h-2.5 fill-amber-400" />
                    <span>{passengerRating}</span>
                    <span className="text-slate-400 font-normal ml-1">• Broader Rider</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setCommModal({ open: true, type: 'call' })}
                  className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 hover:bg-emerald-100 flex items-center justify-center transition-colors"
                  title="Call Passenger"
                >
                  <Phone className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setCommModal({ open: true, type: 'chat' })}
                  className="w-8 h-8 rounded-full bg-blue-50 text-[#0286FF] hover:bg-blue-100 flex items-center justify-center transition-colors"
                  title="Chat Passenger"
                >
                  <MessageSquare className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Action: I Have Arrived */}
            <button
              onClick={() => setRideStatus('driver_arrived')}
              className="w-full py-3 rounded-2xl bg-[#0286FF] hover:bg-blue-600 text-white text-xs font-JakartaBold shadow-md shadow-blue-500/20 active:scale-98 transition-all flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>I Have Arrived at Pickup</span>
            </button>
          </div>
        )}

        {/* 2. DRIVER ARRIVED */}
        {rideStatus === 'driver_arrived' && (
          <div className="space-y-3">
            {/* Passenger Notified Alert */}
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-JakartaBold text-emerald-900">Passenger Notified of Arrival</p>
                  <p className="text-[10px] text-emerald-700">Vehicle: {activeTrip.driver.car_model || 'Toyota Corolla'}</p>
                </div>
              </div>

              {/* Waiting Timer */}
              <div className="text-right">
                <span className="text-[10px] text-emerald-800 font-JakartaMedium block">Free Wait Time</span>
                <span className="text-xs font-mono font-bold text-emerald-900 flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {formatWaitTime(waitSeconds)}
                </span>
              </div>
            </div>

            {/* Passenger Bar */}
            <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="flex items-center gap-2.5">
                <img
                  src={passengerImage}
                  alt={passengerName}
                  className="w-10 h-10 rounded-full object-cover border border-white shadow-xs"
                />
                <div>
                  <h4 className="text-xs font-JakartaBold text-slate-900">{passengerName}</h4>
                  <p className="text-[10px] text-slate-500">Destination: {activeTrip.destination.address.split(',')[0]}</p>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setCommModal({ open: true, type: 'call' })}
                  className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 hover:bg-emerald-100 flex items-center justify-center"
                >
                  <Phone className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setCommModal({ open: true, type: 'chat' })}
                  className="w-8 h-8 rounded-full bg-blue-50 text-[#0286FF] hover:bg-blue-100 flex items-center justify-center"
                >
                  <MessageSquare className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Action: Start Trip */}
            <button
              onClick={() => setRideStatus('ride_started')}
              className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-JakartaBold shadow-md shadow-emerald-600/20 active:scale-98 transition-all flex items-center justify-center gap-2"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Passenger Onboard • Start Trip</span>
            </button>
          </div>
        )}

        {/* 3. TRIP STARTED (EN ROUTE) */}
        {rideStatus === 'ride_started' && (
          <div className="space-y-3">
            {/* Live Trip Telemetry */}
            <div className="grid grid-cols-3 gap-2">
              <div className="p-2.5 bg-slate-50 rounded-2xl border border-slate-100 text-center">
                <span className="text-[10px] text-slate-400 font-JakartaMedium block">Speed</span>
                <span className="text-xs font-JakartaBold text-slate-800">42 km/h</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-2xl border border-slate-100 text-center">
                <span className="text-[10px] text-slate-400 font-JakartaMedium block">Estimated Fare</span>
                <span className="text-xs font-JakartaBold text-[#0286FF]">₦{grossFare.toLocaleString()}</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-2xl border border-slate-100 text-center">
                <span className="text-[10px] text-slate-400 font-JakartaMedium block">Net Payout</span>
                <span className="text-xs font-JakartaBold text-emerald-600">₦{netEarnings.toLocaleString()}</span>
              </div>
            </div>

            {/* Destination Address */}
            <div className="p-3 bg-blue-50/60 rounded-2xl border border-blue-100 flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0">
                <MapPin className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] font-JakartaBold text-blue-600 uppercase">Dropoff Destination</span>
                <p className="text-xs font-JakartaBold text-slate-900 truncate">{activeTrip.destination.address}</p>
              </div>
            </div>

            {/* Action: Complete Trip */}
            <button
              onClick={() => completeActiveTrip()}
              className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-JakartaBold shadow-md shadow-emerald-600/20 active:scale-98 transition-all flex items-center justify-center gap-2"
            >
              <Flag className="w-4 h-4" />
              <span>Destination Reached • Complete Trip</span>
            </button>
          </div>
        )}

        {/* 4. TRIP COMPLETED (SETTLEMENT & RATING) */}
        {rideStatus === 'ride_completed' && (
          <div className="space-y-3.5">
            {/* Earnings Breakdown Statement */}
            <div className="p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-2xl space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-JakartaBold text-emerald-900 flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Trip Completed
                </span>
                <span className="text-xs font-JakartaBold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                  Settled to Wallet
                </span>
              </div>

              <div className="space-y-1 text-xs pt-1 border-t border-emerald-100">
                <div className="flex justify-between text-slate-600">
                  <span>Gross Passenger Fare</span>
                  <span className="font-JakartaBold text-slate-900">₦{grossFare.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-500 text-[11px]">
                  <span>Broader Platform Commission (15%)</span>
                  <span className="text-red-500 font-medium">-₦{commission.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-500 text-[11px]">
                  <span>Passenger Driver Tip</span>
                  <span className="text-emerald-600 font-medium">+₦0</span>
                </div>
                <div className="flex justify-between pt-1 border-t border-emerald-200 font-JakartaBold text-xs text-emerald-900">
                  <span>Net Driver Earnings</span>
                  <span className="text-base text-emerald-700">₦{netEarnings.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Rate Passenger Modal Box */}
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2.5 text-center">
              <div className="flex items-center justify-center gap-2">
                <img
                  src={passengerImage}
                  alt={passengerName}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <span className="text-xs font-JakartaBold text-slate-900">Rate Passenger: {passengerName}</span>
              </div>

              {/* Star Rating */}
              <div className="flex items-center justify-center gap-1.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setStarRating(star)}
                    className="p-1 transition-transform active:scale-110"
                  >
                    <Star
                      className={`w-5 h-5 ${
                        star <= starRating ? 'text-amber-400 fill-amber-400' : 'text-slate-300'
                      }`}
                    />
                  </button>
                ))}
              </div>

              {/* Praise chips */}
              <div className="flex flex-wrap items-center justify-center gap-1.5 pt-1">
                {[
                  'Polite & respectful',
                  'Punctual',
                  'Pleasant ride',
                  'Clean passenger',
                ].map((praise) => {
                  const isSelected = selectedPraises.includes(praise);
                  return (
                    <button
                      key={praise}
                      onClick={() => togglePraise(praise)}
                      className={`px-2.5 py-1 rounded-full text-[10px] font-JakartaBold transition-all ${
                        isSelected
                          ? 'bg-blue-100 text-[#0286FF] border border-blue-300'
                          : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {praise}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Action: Finish & Return to Online */}
            <button
              onClick={() => driverRatePassenger(starRating, selectedPraises.join(', '))}
              className="w-full py-3 rounded-2xl bg-[#0286FF] hover:bg-blue-600 text-white text-xs font-JakartaBold shadow-md shadow-blue-500/20 active:scale-98 transition-all flex items-center justify-center gap-1.5"
            >
              <span>Submit Rating & Go Back Online</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Safety SOS Modal */}
      <DriverSafetyModal
        isOpen={safetyModalOpen}
        onClose={() => setSafetyModalOpen(false)}
        activeTripAddress={activeTrip.pickup.address}
      />

      {/* Communication Modal (Call / Chat) */}
      <DriverCommunicationModal
        isOpen={commModal.open}
        type={commModal.type}
        onClose={() => setCommModal({ open: false, type: 'call' })}
        passengerName={passengerName}
        passengerImage={passengerImage}
      />

      {/* Cancel Trip Confirmation Modal */}
      {cancelModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-sm bg-white rounded-3xl p-5 shadow-2xl border border-slate-200 space-y-3 animate-in slide-in-from-bottom-4 duration-200">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-sm font-JakartaBold text-slate-900">Cancel Active Trip</h3>
              <button
                onClick={() => setCancelModalOpen(false)}
                className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-500 font-JakartaMedium">
              Please select a cancellation reason. Frequent unjustified cancellations affect your Driver Acceptance score.
            </p>

            <div className="space-y-1.5 text-xs">
              {[
                'Passenger no-show after 5 minutes',
                'Passenger requested cancellation',
                'Wrong pickup address / inaccessible road',
                'Vehicle issue / mechanical problem',
              ].map((reason) => (
                <button
                  key={reason}
                  onClick={() => setCancelReason(reason)}
                  className={`w-full text-left p-2.5 rounded-xl border text-xs font-JakartaMedium transition-all ${
                    cancelReason === reason
                      ? 'bg-red-50 text-red-800 border-red-200 font-bold'
                      : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {reason}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                onClick={() => setCancelModalOpen(false)}
                className="py-2.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-JakartaBold hover:bg-slate-200"
              >
                Keep Trip
              </button>
              <button
                onClick={() => {
                  driverCancelActiveTrip(cancelReason);
                  setCancelModalOpen(false);
                }}
                className="py-2.5 rounded-xl bg-red-600 text-white text-xs font-JakartaBold hover:bg-red-700 shadow-xs"
              >
                Confirm Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
