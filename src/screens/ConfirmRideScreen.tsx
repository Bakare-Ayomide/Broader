import React, { useState, useEffect } from 'react';
import { useBroaderStore } from '../store/useBroaderStore';
import { InteractiveMap } from '../components/InteractiveMap';
import { VehicleSelection } from '../components/VehicleSelection';
import { DriverSearchPanel } from '../components/DriverSearchPanel';
import { DriverTrackingPanel } from '../components/DriverTrackingPanel';
import { VehicleOption } from '../types';
import {
  ArrowLeft,
  Wallet,
  CreditCard,
  Banknote,
  Plus,
  AlertCircle,
  MapPin,
  Clock,
  Sparkles,
  ChevronRight,
} from 'lucide-react';

export const ConfirmRideScreen: React.FC = () => {
  const setScreen = useBroaderStore((s) => s.setScreen);
  const userAddress = useBroaderStore((s) => s.userAddress);
  const destinationAddress = useBroaderStore((s) => s.destinationAddress);
  const selectedPaymentMethod = useBroaderStore((s) => s.selectedPaymentMethod);
  const setSelectedPaymentMethod = useBroaderStore((s) => s.setSelectedPaymentMethod);
  const walletBalance = useBroaderStore((s) => s.walletBalance);
  const rideStatus = useBroaderStore((s) => s.rideStatus);
  const setRideStatus = useBroaderStore((s) => s.setRideStatus);
  const vehicleOptions = useBroaderStore((s) => s.vehicleOptions);
  const selectedVehicle = useBroaderStore((s) => s.selectedVehicle);
  const activeTrip = useBroaderStore((s) => s.activeTrip);
  const cancelActiveTrip = useBroaderStore((s) => s.cancelActiveTrip);

  const [currentSelectedVehicle, setCurrentSelectedVehicle] = useState<VehicleOption | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [bookingType, setBookingType] = useState<'now' | 'schedule'>('now');
  const [scheduledDate, setScheduledDate] = useState('Tomorrow, Mar 8');
  const [scheduledTime, setScheduledTime] = useState('08:00 AM');
  const [scheduleSuccessMessage, setScheduleSuccessMessage] = useState<string | null>(null);

  const addScheduledRide = useBroaderStore((s) => s.addScheduledRide);
  const setIncomingDriverRequest = useBroaderStore((s) => s.setIncomingDriverRequest);
  const pickupInstructions = useBroaderStore((s) => s.pickupInstructions);

  // Sync selected vehicle option
  useEffect(() => {
    if (vehicleOptions.length > 0) {
      const match = vehicleOptions.find((v) => v.category === selectedVehicle) || vehicleOptions[3];
      setCurrentSelectedVehicle(match);
    }
  }, [vehicleOptions, selectedVehicle]);

  const activeFare = currentSelectedVehicle ? currentSelectedVehicle.price : 2800;
  const isWalletInsufficient = selectedPaymentMethod === 'wallet' && walletBalance < activeFare;

  const handleStartBooking = () => {
    if (isWalletInsufficient) {
      setErrorMessage(`Insufficient wallet balance (₦${walletBalance.toLocaleString()}). Please top up or select another method.`);
      return;
    }
    setErrorMessage(null);

    // Sync incoming driver request so Driver Mode receives the operational dispatch
    const generatedPin = Math.floor(1000 + Math.random() * 9000).toString();
    setIncomingDriverRequest({
      id: 'req_' + Date.now().toString().slice(-4),
      passengerName: 'Chris Baker',
      passengerRating: 4.92,
      passengerImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&auto=format&fit=crop&q=80',
      pickup: userAddress || '15 Admiralty Way, Lekki Phase 1',
      destination: destinationAddress || 'Murtala Muhammed Airport (LOS), Ikeja',
      estimatedEarnings: Math.round(activeFare * 0.85),
      distanceKm: 18.5,
      estimatedMinutes: currentSelectedVehicle ? currentSelectedVehicle.time : 25,
      vehicleType: currentSelectedVehicle ? currentSelectedVehicle.name : 'Broader Comfort',
      expiresInSeconds: 30,
      ridePin: generatedPin,
      pickupInstructions: pickupInstructions || 'Waiting at the main entrance',
    });

    setRideStatus('searching');
  };

  const handleConfirmSchedule = () => {
    if (!currentSelectedVehicle) return;

    const newScheduled: any = {
      ride_id: 'sch_' + Date.now().toString().slice(-4),
      origin_address: userAddress || '15 Admiralty Way, Lekki Phase 1',
      destination_address: destinationAddress || 'Murtala Muhammed Airport (LOS), Ikeja',
      origin_latitude: 6.4474,
      origin_longitude: 3.4723,
      destination_latitude: 6.5774,
      destination_longitude: 3.3212,
      ride_time: currentSelectedVehicle.time,
      fare_price: activeFare,
      payment_status: 'paid',
      payment_method: selectedPaymentMethod,
      driver_id: 101,
      user_id: 'usr_chris_101',
      created_at: new Date().toISOString(),
      vehicle_type: currentSelectedVehicle.name,
      isScheduled: true,
      scheduledTime: `${scheduledDate} at ${scheduledTime}`,
      ridePin: Math.floor(1000 + Math.random() * 9000).toString(),
      pickupInstructions: pickupInstructions || undefined,
      driver: {
        first_name: 'Babatunde',
        last_name: 'Adeleke',
        car_seats: 4,
        profile_image_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=160&auto=format&fit=crop&q=80',
        rating: 4.92,
        plate_number: 'EKY-428-AB',
        car_model: currentSelectedVehicle.name,
      },
    };

    addScheduledRide(newScheduled);
    setScheduleSuccessMessage(`Ride scheduled for ${scheduledDate} at ${scheduledTime}! Driver will be dispatched 15 mins prior.`);
    setTimeout(() => {
      setScheduleSuccessMessage(null);
      setScreen('rides');
    }, 2800);
  };

  return (
    <div className="flex flex-col min-h-full bg-[#F6F8FA] select-none">
      {/* Navigation Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-slate-200 shrink-0">
        <div className="flex items-center">
          <button
            onClick={() => {
              if (rideStatus === 'searching') {
                setRideStatus('idle');
              } else if (rideStatus !== 'idle') {
                cancelActiveTrip();
              } else {
                setScreen('find-ride');
              }
            }}
            className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors mr-3"
            title="Back"
          >
            <ArrowLeft className="w-4 h-4 text-slate-700" />
          </button>
          <div>
            <h2 className="text-base font-JakartaBold text-slate-900 leading-none">
              {rideStatus === 'searching'
                ? 'Finding Driver'
                : activeTrip
                ? 'Active Ride'
                : 'Select Vehicle'}
            </h2>
            <span className="text-[11px] text-slate-400 font-JakartaMedium">
              {rideStatus === 'searching'
                ? 'Scanning nearby drivers...'
                : activeTrip
                ? activeTrip.driver.first_name + ' • ' + activeTrip.driver.plate_number
                : 'Lagos Island & Mainland'}
            </span>
          </div>
        </div>

        {/* Quick Wallet balance pill */}
        <button
          type="button"
          onClick={() => setScreen('wallet')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-50 hover:bg-blue-100 border border-blue-200 text-[#0286FF] transition-all"
          title="Open Broader Wallet"
        >
          <Wallet className="w-3.5 h-3.5" />
          <span className="text-xs font-JakartaBold">₦{walletBalance.toLocaleString()}</span>
        </button>
      </div>

      {/* Map Route Area (Primary Visual Element) */}
      <div className="p-3 shrink-0">
        <InteractiveMap
          showRoute={true}
          height={activeTrip || rideStatus === 'searching' ? 'h-[230px]' : 'h-[170px]'}
          isSearching={rideStatus === 'searching'}
        />
      </div>

      {/* Route Addresses Summary Pill */}
      <div className="mx-3 mb-2 px-3 py-2 bg-white rounded-xl border border-slate-200 text-[11px] flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-1.5 min-w-0 flex-1">
          <div className="w-2 h-2 rounded-full bg-[#0286FF] shrink-0" />
          <span className="font-JakartaSemiBold text-slate-700 truncate">
            {userAddress ? userAddress.split(',')[0] : 'Victoria Island'}
          </span>
          <ChevronRight className="w-3 h-3 text-slate-400 shrink-0" />
          <div className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
          <span className="font-JakartaSemiBold text-slate-700 truncate">
            {destinationAddress ? destinationAddress.split(',')[0] : 'Airport LOS'}
          </span>
        </div>
      </div>

      {/* Main Dynamic Flow Container */}
      <div className="flex-1 px-3 pb-4 overflow-y-auto">
        {/* State 1: Searching for Driver */}
        {rideStatus === 'searching' && currentSelectedVehicle && (
          <DriverSearchPanel
            vehicle={currentSelectedVehicle}
            onDriverMatched={() => {}}
            onCancelSearch={() => setRideStatus('idle')}
          />
        )}

        {/* State 2: Active Driver Tracking Panel */}
        {activeTrip && rideStatus !== 'idle' && rideStatus !== 'searching' && (
          <DriverTrackingPanel
            onOpenChat={() => setScreen('chat')}
            onTripCompleted={() => {}}
          />
        )}

        {/* State 0: Vehicle Selection & Payment (Idle Booking Flow) */}
        {rideStatus === 'idle' && (
          <div className="bg-white rounded-3xl p-4 shadow-sm border border-slate-200 space-y-4">
            {/* Schedule success toast */}
            {scheduleSuccessMessage && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-JakartaSemiBold text-emerald-800 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{scheduleSuccessMessage}</span>
              </div>
            )}

            {/* Error banner if wallet insufficient */}
            {errorMessage && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs font-JakartaSemiBold text-red-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Booking Mode Selector: Ride Now vs Schedule */}
            <div className="flex p-1 bg-slate-100 rounded-2xl">
              <button
                type="button"
                onClick={() => setBookingType('now')}
                className={`flex-1 py-2 rounded-xl text-xs font-JakartaBold transition-all flex items-center justify-center gap-1.5 ${
                  bookingType === 'now'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <Clock className="w-3.5 h-3.5 text-[#0286FF]" />
                <span>Ride Now</span>
              </button>
              <button
                type="button"
                onClick={() => setBookingType('schedule')}
                className={`flex-1 py-2 rounded-xl text-xs font-JakartaBold transition-all flex items-center justify-center gap-1.5 ${
                  bookingType === 'schedule'
                    ? 'bg-white text-[#0286FF] shadow-xs'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Schedule for Later</span>
              </button>
            </div>

            {/* Scheduled Date & Time Pickers */}
            {bookingType === 'schedule' && (
              <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-JakartaBold text-amber-900">Choose Pickup Schedule</span>
                  <span className="text-[10px] font-JakartaMedium text-amber-700">Guaranteed arrival</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] font-JakartaBold text-amber-900 block mb-1 uppercase">Date</label>
                    <select
                      value={scheduledDate}
                      onChange={(e) => setScheduledDate(e.target.value)}
                      className="w-full text-xs font-JakartaSemiBold bg-white border border-amber-200 rounded-xl px-2.5 py-2 text-slate-800 focus:outline-none focus:ring-1 focus:ring-amber-400"
                    >
                      <option value="Tomorrow, Mar 8">Tomorrow, Mar 8</option>
                      <option value="Sunday, Mar 9">Sunday, Mar 9</option>
                      <option value="Monday, Mar 10">Monday, Mar 10</option>
                      <option value="Tuesday, Mar 11">Tuesday, Mar 11</option>
                      <option value="Wednesday, Mar 12">Wednesday, Mar 12</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-JakartaBold text-amber-900 block mb-1 uppercase">Time</label>
                    <select
                      value={scheduledTime}
                      onChange={(e) => setScheduledTime(e.target.value)}
                      className="w-full text-xs font-JakartaSemiBold bg-white border border-amber-200 rounded-xl px-2.5 py-2 text-slate-800 focus:outline-none focus:ring-1 focus:ring-amber-400"
                    >
                      <option value="06:30 AM">06:30 AM (Early flight)</option>
                      <option value="08:00 AM">08:00 AM (Morning rush)</option>
                      <option value="10:30 AM">10:30 AM (Off-peak)</option>
                      <option value="02:00 PM">02:00 PM (Afternoon)</option>
                      <option value="05:30 PM">05:30 PM (Evening commute)</option>
                      <option value="08:00 PM">08:00 PM (Night ride)</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Feature 1: Vehicle Selection (All 9 vehicle types) */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-JakartaBold text-slate-900 uppercase tracking-wider">
                  Available Broader Vehicles
                </h3>
                <span className="text-[10px] font-JakartaSemiBold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                  Real-time Backend Fares
                </span>
              </div>

              <VehicleSelection onSelectVehicle={(v) => setCurrentSelectedVehicle(v)} />
            </div>

            {/* Feature 5: Payment Method Selector */}
            <div className="pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-JakartaBold text-slate-700 uppercase tracking-wider">
                  Payment Method
                </span>
                <button
                  type="button"
                  onClick={() => setScreen('wallet')}
                  className="text-[11px] font-JakartaBold text-[#0286FF] hover:underline flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" />
                  <span>Top Up Wallet</span>
                </button>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {/* Wallet Option */}
                <button
                  type="button"
                  onClick={() => {
                    setSelectedPaymentMethod('wallet');
                    setErrorMessage(null);
                  }}
                  className={`p-2.5 rounded-2xl border text-left transition-all relative ${
                    selectedPaymentMethod === 'wallet'
                      ? 'bg-[#E6F3FF] border-[#0286FF] ring-1 ring-[#0286FF]'
                      : 'bg-white border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <Wallet className="w-4 h-4 text-[#0286FF]" />
                    <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-1 rounded">
                      Instant
                    </span>
                  </div>
                  <p className="text-xs font-JakartaBold text-slate-900 leading-tight">
                    Wallet
                  </p>
                  <p className="text-[10px] font-JakartaSemiBold text-slate-500 mt-0.5">
                    ₦{walletBalance.toLocaleString()}
                  </p>
                </button>

                {/* Debit Card Option */}
                <button
                  type="button"
                  onClick={() => {
                    setSelectedPaymentMethod('card');
                    setErrorMessage(null);
                  }}
                  className={`p-2.5 rounded-2xl border text-left transition-all ${
                    selectedPaymentMethod === 'card'
                      ? 'bg-[#E6F3FF] border-[#0286FF] ring-1 ring-[#0286FF]'
                      : 'bg-white border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <CreditCard className="w-4 h-4 text-slate-700 mb-1" />
                  <p className="text-xs font-JakartaBold text-slate-900 leading-tight">
                    Card
                  </p>
                  <p className="text-[10px] font-JakartaSemiBold text-slate-500 mt-0.5">
                    •••• 4242
                  </p>
                </button>

                {/* Cash Option */}
                <button
                  type="button"
                  onClick={() => {
                    setSelectedPaymentMethod('cash');
                    setErrorMessage(null);
                  }}
                  className={`p-2.5 rounded-2xl border text-left transition-all ${
                    selectedPaymentMethod === 'cash'
                      ? 'bg-[#E6F3FF] border-[#0286FF] ring-1 ring-[#0286FF]'
                      : 'bg-white border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <Banknote className="w-4 h-4 text-slate-700 mb-1" />
                  <p className="text-xs font-JakartaBold text-slate-900 leading-tight">
                    Cash
                  </p>
                  <p className="text-[10px] font-JakartaSemiBold text-slate-500 mt-0.5">
                    Pay in vehicle
                  </p>
                </button>
              </div>
            </div>

            {/* Total Fare & Confirm Booking Button */}
            <div className="pt-2">
              <div className="flex items-center justify-between mb-3 text-xs">
                <span className="text-slate-500 font-JakartaMedium">
                  {bookingType === 'schedule' ? 'Estimated Scheduled Fare' : 'Estimated Total Fare'}
                </span>
                <span className="text-base font-JakartaBold text-slate-900">
                  ₦{activeFare.toLocaleString()}
                </span>
              </div>

              {bookingType === 'schedule' ? (
                <button
                  onClick={handleConfirmSchedule}
                  className="w-full py-4 rounded-full bg-amber-500 hover:bg-amber-600 active:scale-[0.99] text-white font-JakartaBold text-sm shadow-md shadow-amber-500/25 transition-all flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Confirm Schedule for {scheduledDate.split(',')[0]} ({scheduledTime})</span>
                </button>
              ) : (
                <button
                  onClick={handleStartBooking}
                  className="w-full py-4 rounded-full bg-[#0286FF] hover:bg-blue-600 active:scale-[0.99] text-white font-JakartaBold text-sm shadow-md shadow-blue-500/25 transition-all flex items-center justify-center gap-2"
                >
                  <span>Request {currentSelectedVehicle ? currentSelectedVehicle.name : 'Broader Ride'}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
