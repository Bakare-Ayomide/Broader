import React, { useState } from 'react';
import { useBroaderStore } from '../store/useBroaderStore';
import { ArrowLeft, Star, CheckCircle, CreditCard, Shield, MapPin, Clock } from 'lucide-react';

export const BookRideScreen: React.FC = () => {
  const setScreen = useBroaderStore((s) => s.setScreen);
  const user = useBroaderStore((s) => s.user);
  const userAddress = useBroaderStore((s) => s.userAddress);
  const destinationAddress = useBroaderStore((s) => s.destinationAddress);
  const drivers = useBroaderStore((s) => s.drivers);
  const selectedDriverId = useBroaderStore((s) => s.selectedDriver);
  const addRide = useBroaderStore((s) => s.addRide);

  const selectedDriver =
    drivers.find((d) => d.id === selectedDriverId) || drivers[0];

  const [paymentMethod, setPaymentMethod] = useState<'card' | 'apple' | 'cash'>('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleConfirmRide = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setShowSuccessModal(true);

      // Create new ride in store
      addRide({
        ride_id: 'rd_' + Date.now().toString().slice(-5),
        origin_address: userAddress,
        destination_address: destinationAddress || 'San Francisco Airport (SFO)',
        origin_latitude: 37.78825,
        origin_longitude: -122.4042,
        destination_latitude: 37.6213,
        destination_longitude: -122.3790,
        ride_time: selectedDriver.time || 15,
        fare_price: parseFloat(selectedDriver.price || '24.50'),
        payment_status: 'paid',
        driver_id: selectedDriver.id,
        user_id: user.id,
        created_at: new Date().toISOString(),
        driver: {
          first_name: selectedDriver.first_name,
          last_name: selectedDriver.last_name,
          car_seats: selectedDriver.car_seats,
          profile_image_url: selectedDriver.profile_image_url,
          rating: selectedDriver.rating,
        },
      });
    }, 900);
  };

  return (
    <div className="flex flex-col min-h-full bg-[#F6F8FA] relative select-none">
      {/* Header */}
      <div className="flex items-center px-4 py-3 bg-white border-b border-slate-200 shrink-0">
        <button
          onClick={() => setScreen('confirm-ride')}
          className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors mr-3"
        >
          <ArrowLeft className="w-4 h-4 text-slate-700" />
        </button>
        <h2 className="text-lg font-JakartaBold text-slate-900">Book Ride</h2>
      </div>

      <div className="p-5 flex-1 flex flex-col justify-between overflow-y-auto">
        <div>
          <h3 className="text-sm font-JakartaBold text-slate-900 uppercase tracking-wider mb-3">
            Ride Summary
          </h3>

          {/* Driver Highlight Card */}
          <div className="flex flex-col items-center justify-center p-4 bg-white rounded-2xl border border-slate-200 shadow-xs mb-4">
            <img
              src={selectedDriver.profile_image_url}
              alt={selectedDriver.title}
              className="w-20 h-20 rounded-full object-cover border-4 border-blue-50 shadow-sm"
            />
            <h4 className="text-base font-JakartaBold text-slate-900 mt-2">
              {selectedDriver.title}
            </h4>
            <div className="flex items-center gap-1 mt-0.5 text-xs text-amber-600 font-JakartaSemiBold">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{selectedDriver.rating} Rating</span>
              <span className="text-slate-300 mx-1">•</span>
              <span className="text-slate-500 font-JakartaRegular">{selectedDriver.car_seats} seats</span>
            </div>
          </div>

          {/* Pricing & Time Breakdown (Matching Ryde bg-general-600) */}
          <div className="bg-[#E6F3FF] rounded-2xl p-4 border border-blue-100 text-sm space-y-2.5 mb-4">
            <div className="flex items-center justify-between pb-2 border-b border-blue-200/50">
              <span className="text-slate-600 font-JakartaMedium">Ride Price</span>
              <span className="text-base font-JakartaBold text-[#0CC25F]">
                ${selectedDriver.price || '24.50'}
              </span>
            </div>

            <div className="flex items-center justify-between pb-2 border-b border-blue-200/50">
              <span className="text-slate-600 font-JakartaMedium">Estimated Pickup</span>
              <span className="font-JakartaBold text-slate-800">
                {selectedDriver.time || 4} mins
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-600 font-JakartaMedium">Vehicle Type</span>
              <span className="font-JakartaBold text-slate-800">Sedan</span>
            </div>
          </div>

          {/* Route Locations */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200 text-xs space-y-3 mb-4">
            <div className="flex items-start gap-2.5">
              <div className="w-4 h-4 rounded-full bg-blue-100 flex items-center justify-center shrink-0 mt-0.5">
                <div className="w-1.5 h-1.5 rounded-full bg-[#0286FF]" />
              </div>
              <div>
                <span className="text-[10px] font-JakartaBold text-slate-400 uppercase tracking-wider block">
                  Pickup Location
                </span>
                <span className="font-JakartaMedium text-slate-800 text-xs">
                  {userAddress}
                </span>
              </div>
            </div>

            <div className="h-px bg-slate-100" />

            <div className="flex items-start gap-2.5">
              <div className="w-4 h-4 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 mt-0.5">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              </div>
              <div>
                <span className="text-[10px] font-JakartaBold text-slate-400 uppercase tracking-wider block">
                  Dropoff Location
                </span>
                <span className="font-JakartaMedium text-slate-800 text-xs">
                  {destinationAddress || 'San Francisco International Airport (SFO)'}
                </span>
              </div>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="mb-4">
            <span className="text-xs font-JakartaBold text-slate-500 uppercase tracking-wider block mb-2">
              Payment Method (Stripe)
            </span>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`py-2 px-2.5 rounded-xl border text-xs font-JakartaSemiBold flex flex-col items-center justify-center gap-1 transition-all ${
                  paymentMethod === 'card'
                    ? 'bg-[#0286FF] text-white border-[#0286FF] shadow-xs'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <CreditCard className="w-4 h-4" />
                <span>Card (•••• 4242)</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('apple')}
                className={`py-2 px-2.5 rounded-xl border text-xs font-JakartaSemiBold flex flex-col items-center justify-center gap-1 transition-all ${
                  paymentMethod === 'apple'
                    ? 'bg-[#0286FF] text-white border-[#0286FF] shadow-xs'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <span className="font-bold"> Pay</span>
                <span>Apple Pay</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('cash')}
                className={`py-2 px-2.5 rounded-xl border text-xs font-JakartaSemiBold flex flex-col items-center justify-center gap-1 transition-all ${
                  paymentMethod === 'cash'
                    ? 'bg-[#0286FF] text-white border-[#0286FF] shadow-xs'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <span className="font-bold">$ Cash</span>
                <span>Pay in Car</span>
              </button>
            </div>
          </div>
        </div>

        {/* Submit Booking Button */}
        <button
          onClick={handleConfirmRide}
          disabled={isProcessing}
          className="w-full mt-2 py-3.5 rounded-full bg-[#0286FF] hover:bg-blue-600 active:scale-[0.99] text-white font-JakartaBold text-sm shadow-md shadow-blue-500/25 transition-all flex items-center justify-center gap-2"
        >
          {isProcessing ? (
            <span>Securing Ride...</span>
          ) : (
            <span>Confirm & Book Ride (${selectedDriver.price || '24.50'})</span>
          )}
        </button>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 w-full max-w-xs shadow-2xl text-center flex flex-col items-center animate-in fade-in zoom-in duration-200">
            <div className="w-18 h-18 mb-3 flex items-center justify-center">
              <img
                src="/assets/images/check.png"
                alt="Confirmed"
                className="w-full h-full object-contain"
              />
            </div>
            <h3 className="text-xl font-JakartaBold text-slate-900">Ride Confirmed!</h3>
            <p className="text-xs text-slate-500 font-JakartaMedium mt-2 leading-relaxed">
              <span className="font-bold text-slate-700">{selectedDriver.title}</span> has accepted your request and is heading to your pickup location.
            </p>

            <div className="mt-4 p-2.5 bg-blue-50 rounded-xl w-full text-xs font-JakartaSemiBold text-blue-900 border border-blue-100 flex items-center justify-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-blue-600" />
              <span>Arriving in {selectedDriver.time || 4} minutes</span>
            </div>

            <button
              onClick={() => {
                setShowSuccessModal(false);
                setScreen('rides');
              }}
              className="w-full mt-5 py-3 rounded-full bg-[#0286FF] text-white font-JakartaBold text-sm hover:bg-blue-600 transition-all shadow-md shadow-blue-500/30"
            >
              View in My Rides
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
