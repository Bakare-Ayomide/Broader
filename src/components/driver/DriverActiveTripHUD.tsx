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
  const [enteredPin, setEnteredPin] = useState('');
  const [pinError, setPinError] = useState<string | null>(null);
  const [isPinVerified, setIsPinVerified] = useState(false);

  const expectedPin = activeTrip?.ridePin || '4921';

  const handleVerifyAndStartTrip = () => {
    if (enteredPin.trim() === expectedPin || isPinVerified) {
      setPinError(null);
      setRideStatus('ride_started');
    } else {
      setPinError(`Incorrect PIN. Ask passenger for their 4-digit safety PIN.`);
    }
  };

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
      <div className="glass-panel rounded-3xl border border-white/10 shadow-2xl p-4 space-y-3.5 animate-in slide-in-from-bottom-3 duration-300">
        {/* Top Status Bar with Turn-by-Turn Prompt */}
        <div className="flex items-center justify-between pb-2 border-b border-white/[0.08]">
          <div className="flex items-center gap-2">
            <span
              className={`w-2.5 h-2.5 rounded-full animate-ping ${
                rideStatus === 'ride_completed'
                  ? 'bg-emerald-400'
                  : rideStatus === 'ride_started'
                  ? 'bg-[#9EE6B5]'
                  : 'bg-amber-400'
              }`}
            />
            <span className="text-xs font-JakartaBold text-white uppercase tracking-wide">
              {rideStatus === 'driver_arriving' && 'Heading to Pickup'}
              {rideStatus === 'driver_arrived' && 'Arrived at Pickup'}
              {rideStatus === 'ride_started' && 'En Route to Destination'}
              {rideStatus === 'ride_completed' && 'Trip Completed & Settled'}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setSafetyModalOpen(true)}
              className="p-1.5 rounded-xl bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/30 transition-colors"
              title="Emergency SOS"
            >
              <ShieldAlert className="w-4 h-4" />
            </button>
            {rideStatus !== 'ride_completed' && (
              <button
                onClick={() => setCancelModalOpen(true)}
                className="p-1.5 rounded-xl bg-white/10 text-neutral-300 hover:bg-white/20 transition-colors"
                title="Cancel Trip"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Turn-by-turn Navigation Banner */}
        {rideStatus !== 'ride_completed' && (
          <div className="p-3 bg-white/[0.06] text-white rounded-2xl flex items-center justify-between border border-white/10 shadow-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#9EE6B5] text-black flex items-center justify-center shrink-0 shadow-[0_0_10px_rgba(158,230,181,0.4)]">
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
                <p className="text-[10px] text-neutral-400 font-JakartaMedium truncate">
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
              <span className="text-[10px] text-neutral-400 font-medium">
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
            <div className="flex items-center justify-between p-2.5 bg-white/[0.04] rounded-2xl border border-white/[0.08]">
              <div className="flex items-center gap-2.5">
                <img
                  src={passengerImage}
                  alt={passengerName}
                  className="w-10 h-10 rounded-full object-cover border border-white/20 shadow-xs"
                />
                <div>
                  <h4 className="text-xs font-JakartaBold text-white">{passengerName}</h4>
                  <div className="flex items-center gap-1 text-[10px] text-amber-400 font-JakartaBold">
                    <Star className="w-2.5 h-2.5 fill-amber-400" />
                    <span>{passengerRating}</span>
                    <span className="text-neutral-400 font-normal ml-1">• Broader Passenger</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setCommModal({ open: true, type: 'call' })}
                  className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 border border-emerald-500/30 flex items-center justify-center transition-colors"
                  title="Call Passenger"
                >
                  <Phone className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setCommModal({ open: true, type: 'chat' })}
                  className="w-8 h-8 rounded-full bg-[#9EE6B5]/20 text-[#9EE6B5] hover:bg-[#9EE6B5]/30 border border-[#9EE6B5]/30 flex items-center justify-center transition-colors"
                  title="Chat Passenger"
                >
                  <MessageSquare className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Pickup Note / Instructions if present */}
            {activeTrip.pickupInstructions && (
              <div className="px-3 py-2 bg-amber-500/10 border border-amber-500/20 rounded-2xl text-[11px] text-amber-200 font-JakartaMedium flex items-start gap-1.5">
                <span className="font-JakartaBold shrink-0 text-amber-300">Pickup Note:</span>
                <span className="leading-tight">{activeTrip.pickupInstructions}</span>
              </div>
            )}

            {/* Action: I Have Arrived */}
            <button
              onClick={() => setRideStatus('driver_arrived')}
              className="w-full py-3 rounded-2xl bg-[#9EE6B5] hover:bg-[#8fd8a6] text-black font-extrabold text-xs font-JakartaBold shadow-[0_0_16px_rgba(158,230,181,0.4)] active:scale-98 transition-all flex items-center justify-center gap-2"
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
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-[0_0_8px_rgba(16,185,129,0.5)]">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-JakartaBold text-emerald-300">Passenger Notified of Arrival</p>
                  <p className="text-[10px] text-emerald-400/80">Vehicle: {activeTrip.driver.car_model || 'Toyota Corolla'}</p>
                </div>
              </div>

              {/* Waiting Timer */}
              <div className="text-right">
                <span className="text-[10px] text-emerald-400 font-JakartaMedium block">Free Wait Time</span>
                <span className="text-xs font-mono font-bold text-emerald-300 flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {formatWaitTime(waitSeconds)}
                </span>
              </div>
            </div>

            {/* Pickup Note / Instructions if present */}
            {activeTrip.pickupInstructions && (
              <div className="px-3 py-2 bg-amber-500/10 border border-amber-500/20 rounded-2xl text-[11px] text-amber-200 font-JakartaMedium flex items-start gap-1.5">
                <span className="font-JakartaBold shrink-0 text-amber-300">Pickup Note:</span>
                <span className="leading-tight">{activeTrip.pickupInstructions}</span>
              </div>
            )}

            {/* Passenger Bar */}
            <div className="flex items-center justify-between p-2.5 bg-white/[0.04] rounded-2xl border border-white/[0.08]">
              <div className="flex items-center gap-2.5">
                <img
                  src={passengerImage}
                  alt={passengerName}
                  className="w-10 h-10 rounded-full object-cover border border-white/20 shadow-xs"
                />
                <div>
                  <h4 className="text-xs font-JakartaBold text-white">{passengerName}</h4>
                  <p className="text-[10px] text-neutral-400">Destination: {activeTrip.destination.address.split(',')[0]}</p>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setCommModal({ open: true, type: 'call' })}
                  className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 border border-emerald-500/30 flex items-center justify-center"
                >
                  <Phone className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setCommModal({ open: true, type: 'chat' })}
                  className="w-8 h-8 rounded-full bg-[#9EE6B5]/20 text-[#9EE6B5] hover:bg-[#9EE6B5]/30 border border-[#9EE6B5]/30 flex items-center justify-center"
                >
                  <MessageSquare className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Safety Ride PIN Verification */}
            <div className="p-3 bg-[#9EE6B5]/10 border border-[#9EE6B5]/20 rounded-2xl space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-JakartaBold text-[#9EE6B5] flex items-center gap-1">
                  <span>Verify Passenger PIN</span>
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setEnteredPin(expectedPin);
                    setIsPinVerified(true);
                    setPinError(null);
                  }}
                  className="text-[10px] font-JakartaBold text-[#9EE6B5] hover:underline"
                >
                  Auto-fill ({expectedPin})
                </button>
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  maxLength={4}
                  value={enteredPin}
                  onChange={(e) => {
                    setEnteredPin(e.target.value);
                    if (e.target.value === expectedPin) {
                      setIsPinVerified(true);
                      setPinError(null);
                    }
                  }}
                  placeholder="Enter 4-digit PIN"
                  className="flex-1 px-3 py-2 bg-black/60 border border-white/20 rounded-xl text-xs font-mono font-bold tracking-widest text-center text-white focus:outline-none focus:border-[#9EE6B5]"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (enteredPin === expectedPin) {
                      setIsPinVerified(true);
                      setPinError(null);
                    } else {
                      setPinError('Invalid PIN');
                    }
                  }}
                  className="px-3.5 py-2 rounded-xl bg-[#9EE6B5] hover:bg-[#8fd8a6] text-black font-extrabold text-xs font-JakartaBold transition-colors shadow-[0_0_10px_rgba(158,230,181,0.4)]"
                >
                  Verify
                </button>
              </div>

              {pinError && (
                <p className="text-[10px] font-JakartaBold text-red-400">{pinError}</p>
              )}
              {isPinVerified && (
                <p className="text-[10px] font-JakartaBold text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>PIN Verified Successfully</span>
                </p>
              )}
            </div>

            {/* Action: Start Trip */}
            <button
              onClick={handleVerifyAndStartTrip}
              className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-JakartaBold shadow-[0_0_16px_rgba(16,185,129,0.4)] active:scale-98 transition-all flex items-center justify-center gap-2"
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
              <div className="p-2.5 bg-white/[0.04] rounded-2xl border border-white/[0.08] text-center">
                <span className="text-[10px] text-neutral-400 font-JakartaMedium block">Speed</span>
                <span className="text-xs font-JakartaBold text-white">42 km/h</span>
              </div>
              <div className="p-2.5 bg-white/[0.04] rounded-2xl border border-white/[0.08] text-center">
                <span className="text-[10px] text-neutral-400 font-JakartaMedium block">Estimated Fare</span>
                <span className="text-xs font-JakartaBold text-[#9EE6B5]">₦{grossFare.toLocaleString()}</span>
              </div>
              <div className="p-2.5 bg-white/[0.04] rounded-2xl border border-white/[0.08] text-center">
                <span className="text-[10px] text-neutral-400 font-JakartaMedium block">Net Payout</span>
                <span className="text-xs font-JakartaBold text-emerald-400">₦{netEarnings.toLocaleString()}</span>
              </div>
            </div>

            {/* Destination Address */}
            <div className="p-3 bg-[#9EE6B5]/10 rounded-2xl border border-[#9EE6B5]/25 flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-[#9EE6B5] text-black flex items-center justify-center shrink-0 shadow-[0_0_8px_rgba(158,230,181,0.5)]">
                <MapPin className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] font-JakartaBold text-[#9EE6B5] uppercase">Dropoff Destination</span>
                <p className="text-xs font-JakartaBold text-white truncate">{activeTrip.destination.address}</p>
              </div>
            </div>

            {/* Action: Complete Trip */}
            <button
              onClick={() => completeActiveTrip()}
              className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-JakartaBold shadow-[0_0_16px_rgba(16,185,129,0.4)] active:scale-98 transition-all flex items-center justify-center gap-2"
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
            <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-JakartaBold text-emerald-300 flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Trip Completed
                </span>
                <span className="text-xs font-JakartaBold text-emerald-300 bg-emerald-500/20 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                  Settled to Wallet
                </span>
              </div>

              <div className="space-y-1 text-xs pt-1 border-t border-emerald-500/20">
                <div className="flex justify-between text-neutral-300">
                  <span>Gross Passenger Fare</span>
                  <span className="font-JakartaBold text-white">₦{grossFare.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-neutral-400 text-[11px]">
                  <span>Broader Platform Commission (15%)</span>
                  <span className="text-red-400 font-medium">-₦{commission.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-neutral-400 text-[11px]">
                  <span>Passenger Driver Tip</span>
                  <span className="text-emerald-400 font-medium">+₦0</span>
                </div>
                <div className="flex justify-between pt-1 border-t border-emerald-500/20 font-JakartaBold text-xs text-emerald-300">
                  <span>Net Driver Earnings</span>
                  <span className="text-base text-emerald-400">₦{netEarnings.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Rate Passenger Modal Box */}
            <div className="p-3.5 bg-white/[0.04] rounded-2xl border border-white/10 space-y-2.5 text-center">
              <div className="flex items-center justify-center gap-2">
                <img
                  src={passengerImage}
                  alt={passengerName}
                  className="w-8 h-8 rounded-full object-cover border border-white/20"
                />
                <span className="text-xs font-JakartaBold text-white">Rate Passenger: {passengerName}</span>
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
                        star <= starRating ? 'text-amber-400 fill-amber-400' : 'text-neutral-600'
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
                          ? 'bg-[#9EE6B5]/20 text-[#9EE6B5] border border-[#9EE6B5]/40'
                          : 'bg-white/5 text-neutral-300 border border-white/10 hover:bg-white/10'
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
              className="w-full py-3 rounded-2xl bg-[#9EE6B5] hover:bg-[#8fd8a6] text-black font-extrabold text-xs font-JakartaBold shadow-[0_0_16px_rgba(158,230,181,0.4)] active:scale-98 transition-all flex items-center justify-center gap-1.5"
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
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-sm glass-panel rounded-3xl p-5 shadow-2xl border border-white/15 space-y-3 animate-in slide-in-from-bottom-4 duration-200">
            <div className="flex items-center justify-between pb-2 border-b border-white/[0.08]">
              <h3 className="text-sm font-JakartaBold text-white">Cancel Active Trip</h3>
              <button
                onClick={() => setCancelModalOpen(false)}
                className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-neutral-300"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-neutral-400 font-JakartaMedium">
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
                      ? 'bg-red-500/20 text-red-300 border-red-500/40 font-bold'
                      : 'border-white/10 text-neutral-300 hover:bg-white/5'
                  }`}
                >
                  {reason}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                onClick={() => setCancelModalOpen(false)}
                className="py-2.5 rounded-xl glass-panel text-neutral-300 text-xs font-JakartaBold hover:bg-white/10 border border-white/10"
              >
                Keep Trip
              </button>
              <button
                onClick={() => {
                  driverCancelActiveTrip(cancelReason);
                  setCancelModalOpen(false);
                }}
                className="py-2.5 rounded-xl bg-red-600 text-white text-xs font-JakartaBold hover:bg-red-500 shadow-xs"
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
