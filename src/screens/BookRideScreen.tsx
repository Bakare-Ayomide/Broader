import React, { useState } from 'react';
import { useBroaderStore } from '../store/useBroaderStore';
import { ArrowLeft, Star, CreditCard, Shield, MapPin, Clock, Sparkles, CheckCircle2 } from 'lucide-react';
import { VEHICLE_3D_ASSETS } from '../data/vehicleAssets';

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

  const [paymentMethod, setPaymentMethod] = useState<'card' | 'apple'>('card');
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
        destination_address: destinationAddress || 'Victoria Island, Lagos',
        origin_latitude: 6.4549,
        origin_longitude: 3.4246,
        destination_latitude: 6.4281,
        destination_longitude: 3.4219,
        ride_time: selectedDriver.time || 15,
        fare_price: parseFloat(selectedDriver.price || '3500'),
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
    <div className="flex flex-col min-h-full bg-[#020408] text-white relative select-none">
      {/* Header */}
      <div className="flex items-center px-4 py-3.5 glass-nav border-b border-white/[0.08] shrink-0">
        <button
          onClick={() => setScreen('confirm-ride')}
          className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all active:scale-95 mr-3 text-neutral-300 hover:text-white"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h2 className="text-sm font-JakartaBold text-white">Book Ride Confirmation</h2>
          <p className="text-[11px] text-neutral-400 font-JakartaMedium">Verify trip details & driver</p>
        </div>
      </div>

      <div className="p-4 flex-1 flex flex-col justify-between overflow-y-auto custom-scrollbar space-y-4">
        <div className="space-y-3">
          {/* Driver Highlight Card */}
          <div className="glass-panel rounded-2xl border border-white/[0.08] p-4 flex items-center gap-3.5 shadow-lg relative overflow-hidden">
            <div className="w-14 h-14 rounded-2xl overflow-hidden border border-white/15 shrink-0 relative bg-black/40">
              <img
                src={selectedDriver.profile_image_url}
                alt={selectedDriver.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-JakartaBold text-white truncate">
                {selectedDriver.title}
              </h4>
              <div className="flex items-center gap-1.5 mt-0.5 text-xs text-amber-400 font-JakartaSemiBold">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>{selectedDriver.rating} Rating</span>
                <span className="text-neutral-600 mx-0.5">•</span>
                <span className="text-neutral-400 font-JakartaRegular">{selectedDriver.car_seats} seats</span>
              </div>
              <span className="text-[10px] font-JakartaMedium text-[#9EE6B5] bg-[#9EE6B5]/10 border border-[#9EE6B5]/25 px-2 py-0.5 rounded-full inline-block mt-1">
                Verified Pro Driver
              </span>
            </div>

            {/* 3D Car Thumbnail */}
            <div className="w-16 h-12 shrink-0 flex items-center justify-center">
              <img
                src={VEHICLE_3D_ASSETS.car}
                alt="Vehicle"
                className="w-full h-full object-contain filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.6)]"
              />
            </div>
          </div>

          {/* Pricing & Time Breakdown */}
          <div className="glass-panel rounded-2xl p-4 border border-white/[0.08] text-xs space-y-2.5 shadow-lg">
            <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
              <span className="text-neutral-400 font-JakartaMedium">Estimated Fare</span>
              <span className="text-base font-JakartaBold text-[#9EE6B5]">
                ₦{selectedDriver.price ? parseFloat(selectedDriver.price).toLocaleString() : '3,500'}
              </span>
            </div>

            <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
              <span className="text-neutral-400 font-JakartaMedium">Estimated Pickup ETA</span>
              <span className="font-JakartaBold text-white flex items-center gap-1">
                <Clock className="w-3 h-3 text-[#9EE6B5]" />
                <span>{selectedDriver.time || 4} mins</span>
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-neutral-400 font-JakartaMedium">Vehicle Class</span>
              <span className="font-JakartaBold text-white">Broader Premium Sedan</span>
            </div>
          </div>

          {/* Route Locations */}
          <div className="glass-panel rounded-2xl p-4 border border-white/[0.08] text-xs space-y-3 shadow-lg">
            <div className="flex items-start gap-2.5">
              <div className="w-4 h-4 rounded-full bg-[#9EE6B5]/20 flex items-center justify-center shrink-0 mt-0.5">
                <div className="w-1.5 h-1.5 rounded-full bg-[#9EE6B5]" />
              </div>
              <div>
                <span className="text-[10px] font-JakartaBold text-neutral-400 uppercase tracking-wider block">
                  Pickup Location
                </span>
                <span className="font-JakartaMedium text-white text-xs">
                  {userAddress || '15 Admiralty Way, Lekki Phase 1, Lagos'}
                </span>
              </div>
            </div>

            <div className="h-px bg-white/[0.06]" />

            <div className="flex items-start gap-2.5">
              <div className="w-4 h-4 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0 mt-0.5">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              </div>
              <div>
                <span className="text-[10px] font-JakartaBold text-neutral-400 uppercase tracking-wider block">
                  Dropoff Location
                </span>
                <span className="font-JakartaMedium text-white text-xs">
                  {destinationAddress || 'Victoria Island, Lagos'}
                </span>
              </div>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div>
            <span className="text-xs font-JakartaBold text-neutral-400 uppercase tracking-wider block mb-2">
              Payment Method
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`py-2 px-2.5 rounded-xl border text-xs font-JakartaSemiBold flex flex-col items-center justify-center gap-1 transition-all ${
                  paymentMethod === 'card'
                    ? 'bg-[#9EE6B5]/15 text-[#9EE6B5] border-[#9EE6B5] shadow-xs'
                    : 'glass-panel text-neutral-300 border-white/[0.08] hover:bg-white/5'
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
                    ? 'bg-[#9EE6B5]/15 text-[#9EE6B5] border-[#9EE6B5] shadow-xs'
                    : 'glass-panel text-neutral-300 border-white/[0.08] hover:bg-white/5'
                }`}
              >
                <span className="font-bold"> Pay</span>
                <span>Apple Pay</span>
              </button>
            </div>
          </div>
        </div>

        {/* Submit Booking Button */}
        <button
          onClick={handleConfirmRide}
          disabled={isProcessing}
          className="w-full mt-2 py-4 rounded-full bg-[#9EE6B5] hover:bg-[#8fd8a6] active:scale-[0.99] text-[#020408] font-extrabold font-JakartaBold text-sm shadow-[0_0_20px_rgba(158,230,181,0.4)] transition-all flex items-center justify-center gap-2"
        >
          {isProcessing ? (
            <span>Securing Ride...</span>
          ) : (
            <span>Confirm & Book Ride (₦{selectedDriver.price ? parseFloat(selectedDriver.price).toLocaleString() : '3,500'})</span>
          )}
        </button>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="absolute inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="glass-panel border border-[#9EE6B5]/40 rounded-3xl p-6 w-full max-w-xs shadow-[0_0_30px_rgba(158,230,181,0.2)] text-center flex flex-col items-center animate-in fade-in zoom-in duration-200">
            <div className="w-16 h-16 rounded-full bg-[#9EE6B5]/20 border border-[#9EE6B5]/40 mb-3 flex items-center justify-center text-[#9EE6B5]">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <h3 className="text-lg font-JakartaBold text-white">Ride Confirmed!</h3>
            <p className="text-xs text-neutral-300 font-JakartaMedium mt-2 leading-relaxed">
              <span className="font-bold text-[#9EE6B5]">{selectedDriver.title}</span> has accepted your request and is heading to your pickup location.
            </p>

            <div className="mt-4 p-2.5 bg-[#9EE6B5]/10 rounded-xl w-full text-xs font-JakartaSemiBold text-[#9EE6B5] border border-[#9EE6B5]/25 flex items-center justify-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#9EE6B5]" />
              <span>Arriving in {selectedDriver.time || 4} minutes</span>
            </div>

            <button
              onClick={() => {
                setShowSuccessModal(false);
                setScreen('rides');
              }}
              className="w-full mt-5 py-3 rounded-full bg-[#9EE6B5] text-black font-extrabold font-JakartaBold text-xs hover:bg-[#8fd8a6] transition-all shadow-[0_0_16px_rgba(158,230,181,0.4)]"
            >
              View in My Rides
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
