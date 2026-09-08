import React, { useState } from 'react';
import { useBroaderStore } from '../store/useBroaderStore';
import { getVehicle3DImage } from '../data/vehicleAssets';
import {
  Phone,
  MessageSquare,
  Share2,
  ShieldAlert,
  X,
  Star,
  Car,
  MapPin,
  CheckCircle2,
  ChevronRight,
  AlertTriangle,
  ArrowRight,
  Check,
} from 'lucide-react';

interface DriverTrackingPanelProps {
  onOpenChat?: () => void;
  onTripCompleted?: () => void;
}

export const DriverTrackingPanel: React.FC<DriverTrackingPanelProps> = ({
  onOpenChat,
  onTripCompleted,
}) => {
  const activeTrip = useBroaderStore((s) => s.activeTrip);
  const rideStatus = useBroaderStore((s) => s.rideStatus);
  const setRideStatus = useBroaderStore((s) => s.setRideStatus);
  const cancelActiveTrip = useBroaderStore((s) => s.cancelActiveTrip);
  const completeActiveTrip = useBroaderStore((s) => s.completeActiveTrip);
  const setScreen = useBroaderStore((s) => s.setScreen);

  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);
  const [showCallModal, setShowCallModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [rating, setRating] = useState(5);
  const [tipAmount, setTipAmount] = useState<number>(500);
  const [selectedCompliments, setSelectedCompliments] = useState<string[]>(['Clean Car', 'Safe Driving']);

  if (!activeTrip) return null;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleShareTrip = () => {
    const shareUrl = `https://broader.ng/track/${activeTrip.id}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl);
      showToast('Trip tracking link copied to clipboard!');
    } else {
      showToast(`Sharing trip #${activeTrip.id}`);
    }
  };

  const advanceRideLifecycle = () => {
    if (rideStatus === 'driver_assigned' || rideStatus === 'driver_arriving') {
      setRideStatus('driver_arrived');
      showToast('Driver has arrived at your pickup point!');
    } else if (rideStatus === 'driver_arrived') {
      setRideStatus('ride_started');
      showToast('Trip started! Enjoy your ride.');
    } else if (rideStatus === 'ride_started') {
      completeActiveTrip();
      if (onTripCompleted) onTripCompleted();
    }
  };

  const getStatusBadge = () => {
    switch (rideStatus) {
      case 'driver_assigned':
      case 'driver_arriving':
        return {
          title: 'Driver is arriving',
          eta: `${activeTrip.etaMinutes} mins away • ${activeTrip.distanceKm} km`,
          color: 'bg-blue-400',
        };
      case 'driver_arrived':
        return {
          title: 'Driver has arrived',
          eta: 'Waiting at pickup point',
          color: 'bg-amber-400',
        };
      case 'ride_started':
        return {
          title: 'On Trip to Destination',
          eta: `Estimated ${Math.max(5, activeTrip.etaMinutes * 2)} mins to drop-off`,
          color: 'bg-emerald-400',
        };
      case 'ride_completed':
        return {
          title: 'Trip Completed',
          eta: 'Arrived at destination',
          color: 'bg-emerald-500',
        };
      default:
        return {
          title: 'Driver Assigned',
          eta: 'Connecting...',
          color: 'bg-blue-400',
        };
    }
  };

  const statusInfo = getStatusBadge();
  const vehicle3DImg = getVehicle3DImage(activeTrip.vehicle?.category || activeTrip.vehicle?.name, activeTrip.driver.car_model);

  return (
    <div className="flex flex-col glass-panel rounded-3xl p-4 shadow-2xl border border-white/[0.08] backdrop-blur-2xl text-white select-none animate-in fade-in slide-in-from-bottom-3 duration-300">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="mb-2.5 px-3.5 py-2 bg-neutral-900 border border-white/10 text-white text-xs font-JakartaSemiBold rounded-xl shadow-lg flex items-center justify-between animate-in fade-in slide-in-from-top-2">
          <span>{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="text-neutral-400 hover:text-white ml-2">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Top Status Header */}
      <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
        <div className="flex items-center gap-2.5">
          <span className={`w-2.5 h-2.5 rounded-full ${statusInfo.color} animate-pulse shadow-[0_0_8px_currentColor]`} />
          <div>
            <h4 className="text-sm font-JakartaBold text-white leading-none">
              {statusInfo.title}
            </h4>
            <span className="text-[11px] font-JakartaMedium text-neutral-400 mt-1 block">
              {statusInfo.eta}
            </span>
          </div>
        </div>

        {/* Advance Lifecycle simulation button for reviewer */}
        {rideStatus !== 'ride_completed' && (
          <button
            onClick={advanceRideLifecycle}
            className="px-2.5 py-1 rounded-full bg-blue-500/15 hover:bg-blue-500/25 text-[#0286FF] text-[11px] font-JakartaBold flex items-center gap-1 transition-all border border-blue-500/30"
            title="Advance to next trip status"
          >
            <span>
              {rideStatus === 'driver_arriving'
                ? 'Simulate Arrived'
                : rideStatus === 'driver_arrived'
                ? 'Start Trip'
                : 'Complete Trip'}
            </span>
            <ChevronRight className="w-3 h-3" />
          </button>
        )}
      </div>

      {/* Driver & 3D Vehicle Details Card */}
      <div className="flex items-center justify-between py-3 border-b border-white/[0.06] gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="relative shrink-0">
            <img
              src={activeTrip.driver.profile_image_url}
              alt={activeTrip.driver.first_name}
              className="w-12 h-12 rounded-full object-cover border border-white/20 shadow-md"
            />
            <div className="absolute -bottom-1 -right-1 bg-amber-400 text-black text-[10px] font-black px-1 rounded-full flex items-center gap-0.5 shadow-xs">
              <Star className="w-2.5 h-2.5 fill-black" />
              <span>{activeTrip.driver.rating || 4.9}</span>
            </div>
          </div>

          <div className="min-w-0">
            <h4 className="text-sm font-JakartaBold text-white truncate">
              {activeTrip.driver.first_name} {activeTrip.driver.last_name}
            </h4>
            <p className="text-xs font-JakartaMedium text-neutral-400 flex items-center gap-1 mt-0.5 truncate">
              <span>{activeTrip.driver.car_model || 'Corolla'}</span>
              <span>•</span>
              <span className="text-neutral-500">{activeTrip.driver.car_color || 'Silver'}</span>
            </p>
            <div className="mt-1 inline-block px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[10px] font-JakartaBold text-neutral-300 tracking-wider">
              {activeTrip.driver.plate_number || 'EKY-428-AB'}
            </div>
          </div>
        </div>

        {/* 3D Vehicle image thumbnail & fare */}
        <div className="flex flex-col items-end shrink-0">
          <div className="w-16 h-12 rounded-xl bg-black/70 border border-white/10 overflow-hidden relative mb-1 flex items-center justify-center">
            <img
              src={vehicle3DImg}
              alt="Vehicle"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>
          <span className="text-sm font-JakartaBold text-white">
            ₦{activeTrip.fare.toLocaleString()}
          </span>
          <span className="text-[9px] font-JakartaBold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-1.5 py-0.5 rounded uppercase mt-0.5">
            {activeTrip.paymentMethod.toUpperCase()}
          </span>
        </div>
      </div>

      {/* Safety Ride PIN Verification Banner - Frosted Glass */}
      <div className="py-2.5 px-3 bg-blue-500/10 border border-blue-500/25 rounded-2xl my-2 flex items-center justify-between">
        <div>
          <span className="text-[10px] font-JakartaBold text-blue-400 uppercase tracking-wider block">
            Trip Safety PIN
          </span>
          <p className="text-[11px] text-neutral-300 font-JakartaMedium">
            Share with driver to start ride
          </p>
        </div>
        <div className="flex items-center gap-1.5 bg-black/60 border border-blue-400/40 px-3 py-1 rounded-xl shadow-lg">
          <span className="text-base font-JakartaExtraBold font-mono text-[#0286FF] tracking-widest">
            {activeTrip.ridePin || '4921'}
          </span>
        </div>
      </div>

      {/* Pickup Instructions if provided */}
      {activeTrip.pickupInstructions && (
        <div className="px-3 py-1.5 bg-amber-500/10 border border-amber-500/20 rounded-xl mb-2 text-[11px] text-amber-300 font-JakartaMedium flex items-start gap-1.5">
          <span className="font-JakartaBold shrink-0 text-amber-400">Note to Driver:</span>
          <span className="truncate">{activeTrip.pickupInstructions}</span>
        </div>
      )}

      {/* Pickup & Destination Locations */}
      <div className="py-2.5 space-y-2 border-b border-white/[0.06] text-xs">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-blue-500/20 border border-blue-500/40 flex items-center justify-center shrink-0">
            <div className="w-1.5 h-1.5 rounded-full bg-[#0286FF]" />
          </div>
          <span className="font-JakartaMedium text-neutral-300 truncate">
            {activeTrip.pickup.address}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center shrink-0">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          </div>
          <span className="font-JakartaMedium text-neutral-300 truncate">
            {activeTrip.destination.address}
          </span>
        </div>
      </div>

      {/* Action Buttons: Call, Chat, Share, SOS, Cancel */}
      {rideStatus !== 'ride_completed' ? (
        <div className="pt-3 grid grid-cols-5 gap-2">
          {/* Call Button */}
          <button
            onClick={() => setShowCallModal(true)}
            className="flex flex-col items-center justify-center py-2 rounded-2xl glass-panel hover:bg-white/10 active:scale-95 text-neutral-300 hover:text-white transition-all border border-white/[0.08]"
            title="Call driver"
          >
            <Phone className="w-4 h-4 text-[#0286FF]" />
            <span className="text-[10px] font-JakartaSemiBold mt-1">Call</span>
          </button>

          {/* Chat Button */}
          <button
            onClick={() => {
              if (onOpenChat) onOpenChat();
              else setScreen('chat');
            }}
            className="flex flex-col items-center justify-center py-2 rounded-2xl glass-panel hover:bg-white/10 active:scale-95 text-neutral-300 hover:text-white transition-all border border-white/[0.08]"
            title="Chat with driver"
          >
            <MessageSquare className="w-4 h-4 text-[#0286FF]" />
            <span className="text-[10px] font-JakartaSemiBold mt-1">Chat</span>
          </button>

          {/* Share Trip */}
          <button
            onClick={handleShareTrip}
            className="flex flex-col items-center justify-center py-2 rounded-2xl glass-panel hover:bg-white/10 active:scale-95 text-neutral-300 hover:text-white transition-all border border-white/[0.08]"
            title="Share live trip"
          >
            <Share2 className="w-4 h-4 text-neutral-400" />
            <span className="text-[10px] font-JakartaSemiBold mt-1">Share</span>
          </button>

          {/* Emergency / Safety SOS */}
          <button
            onClick={() => setShowEmergencyModal(true)}
            className="flex flex-col items-center justify-center py-2 rounded-2xl bg-red-500/10 hover:bg-red-500/20 active:scale-95 text-red-400 transition-all border border-red-500/30"
            title="Emergency safety"
          >
            <ShieldAlert className="w-4 h-4 text-red-400" />
            <span className="text-[10px] font-JakartaBold mt-1">SOS</span>
          </button>

          {/* Cancel Ride */}
          <button
            onClick={() => setShowCancelModal(true)}
            className="flex flex-col items-center justify-center py-2 rounded-2xl glass-panel hover:bg-red-500/10 active:scale-95 text-neutral-400 hover:text-red-400 transition-all border border-white/[0.08]"
            title="Cancel ride"
          >
            <X className="w-4 h-4" />
            <span className="text-[10px] font-JakartaSemiBold mt-1">Cancel</span>
          </button>
        </div>
      ) : (
        /* Ride Completed Rating & Review Experience */
        <div className="pt-2 flex flex-col items-center text-center">
          <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mb-1">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h4 className="text-sm font-JakartaBold text-white">Trip Completed</h4>
          <p className="text-[11px] font-JakartaMedium text-neutral-400">
            ₦{activeTrip.fare.toLocaleString()} settled via {activeTrip.paymentMethod.toUpperCase()}
          </p>

          {/* Rating Stars */}
          <div className="my-2.5 flex flex-col items-center">
            <p className="text-[11px] font-JakartaSemiBold text-neutral-300 mb-1">
              How was your trip with {activeTrip.driver.first_name}?
            </p>
            <div className="flex items-center gap-1.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  className="p-1 hover:scale-110 active:scale-95 transition-transform"
                >
                  <Star
                    className={`w-6 h-6 ${
                      star <= rating ? 'fill-amber-400 text-amber-400' : 'text-neutral-600'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Compliments */}
          <div className="w-full my-1 text-left">
            <p className="text-[10px] font-JakartaSemiBold text-neutral-400 mb-1">Add Compliments:</p>
            <div className="flex flex-wrap gap-1">
              {['Clean Car', 'Smooth Ride', 'Great Music', 'Safe Driver', 'Polite'].map((tag) => {
                const isSelected = selectedCompliments.includes(tag);
                return (
                  <button
                    key={tag}
                    onClick={() => {
                      if (isSelected) {
                        setSelectedCompliments(selectedCompliments.filter((t) => t !== tag));
                      } else {
                        setSelectedCompliments([...selectedCompliments, tag]);
                      }
                    }}
                    className={`px-2.5 py-1 rounded-full text-[10px] font-JakartaSemiBold transition-all ${
                      isSelected
                        ? 'bg-blue-500/20 text-[#0286FF] border border-blue-500/30'
                        : 'glass-panel text-neutral-400 hover:text-white border border-white/10'
                    }`}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tip Options */}
          <div className="w-full my-1.5 text-left">
            <p className="text-[10px] font-JakartaSemiBold text-neutral-400 mb-1">Driver Tip (Optional):</p>
            <div className="grid grid-cols-4 gap-1.5">
              {[0, 500, 1000, 2000].map((tip) => (
                <button
                  key={tip}
                  onClick={() => setTipAmount(tip)}
                  className={`py-1.5 rounded-xl text-[10px] font-JakartaBold border transition-all ${
                    tipAmount === tip
                      ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 shadow-sm'
                      : 'glass-panel text-neutral-300 border-white/10 hover:bg-white/5'
                  }`}
                >
                  {tip === 0 ? 'No Tip' : `₦${tip.toLocaleString()}`}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={() => {
              cancelActiveTrip();
              setScreen('rides');
            }}
            className="w-full mt-2 py-3 rounded-full bg-[#0286FF] hover:bg-blue-500 text-white font-JakartaBold text-xs shadow-[0_0_16px_rgba(2,134,255,0.4)] transition-all"
          >
            Submit Review & Done
          </button>
        </div>
      )}

      {/* Call Modal Dialog */}
      {showCallModal && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-md">
          <div className="glass-panel w-full max-w-xs rounded-3xl p-5 shadow-2xl border border-white/15 animate-in zoom-in-95 text-white">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-base font-JakartaBold text-white">Call Driver</h4>
              <button
                onClick={() => setShowCallModal(false)}
                className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-neutral-300 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex items-center gap-3 p-3 bg-white/[0.04] border border-white/[0.06] rounded-2xl mb-4">
              <img
                src={activeTrip.driver.profile_image_url}
                alt="Driver"
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <p className="font-JakartaBold text-sm text-white">
                  {activeTrip.driver.first_name} {activeTrip.driver.last_name}
                </p>
                <p className="text-xs text-neutral-400 font-JakartaMedium">
                  {activeTrip.driver.phone || '+234 803 112 3344'}
                </p>
              </div>
            </div>
            <a
              href={`tel:${activeTrip.driver.phone || '+2348031123344'}`}
              className="w-full py-3 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-JakartaBold text-xs flex items-center justify-center gap-2 shadow-lg transition-all"
            >
              <Phone className="w-4 h-4" />
              <span>Dial Driver Directly</span>
            </a>
          </div>
        </div>
      )}

      {/* Emergency / Safety SOS Modal */}
      {showEmergencyModal && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-md">
          <div className="glass-panel w-full max-w-xs rounded-3xl p-5 shadow-2xl border border-red-500/30 animate-in zoom-in-95 text-white">
            <div className="w-10 h-10 rounded-full bg-red-500/20 border border-red-500/40 text-red-400 flex items-center justify-center mb-3">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h4 className="text-base font-JakartaBold text-white">Broader Safety & SOS</h4>
            <p className="text-xs font-JakartaMedium text-neutral-400 mt-1 mb-4 leading-relaxed">
              If you feel unsafe or in danger, immediately contact emergency services or our 24/7 Broader Safety team.
            </p>

            <div className="space-y-2">
              <a
                href="tel:112"
                className="w-full py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-JakartaBold text-xs flex items-center justify-center gap-2 shadow-sm"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call Emergency (112 / 767)</span>
              </a>

              <a
                href="tel:+2348002762337"
                className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-JakartaBold text-xs flex items-center justify-center gap-2 shadow-sm border border-white/15"
              >
                <ShieldAlert className="w-3.5 h-3.5 text-blue-400" />
                <span>Broader 24/7 Safety Desk</span>
              </a>

              <button
                onClick={() => setShowEmergencyModal(false)}
                className="w-full py-2 rounded-xl text-neutral-400 hover:text-white font-JakartaSemiBold text-xs"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Confirmation Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-md">
          <div className="glass-panel w-full max-w-xs rounded-3xl p-5 shadow-2xl border border-white/15 animate-in zoom-in-95 text-white">
            <h4 className="text-base font-JakartaBold text-white">Cancel Ride?</h4>
            <p className="text-xs font-JakartaMedium text-neutral-400 mt-1 mb-4 leading-relaxed">
              Are you sure you want to cancel this trip with {activeTrip.driver.first_name}? No cancellation fee will be charged within 5 minutes.
            </p>

            <div className="flex gap-2">
              <button
                onClick={() => setShowCancelModal(false)}
                className="flex-1 py-2.5 rounded-xl border border-white/15 text-neutral-300 font-JakartaBold text-xs hover:bg-white/10"
              >
                Keep Ride
              </button>

              <button
                onClick={() => {
                  setShowCancelModal(false);
                  cancelActiveTrip();
                  showToast('Trip cancelled');
                }}
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-JakartaBold text-xs shadow-md shadow-red-600/30"
              >
                Yes, Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
