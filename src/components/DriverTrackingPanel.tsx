import React, { useState } from 'react';
import { useBroaderStore } from '../store/useBroaderStore';
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
          color: 'bg-blue-500',
        };
      case 'driver_arrived':
        return {
          title: 'Driver has arrived',
          eta: 'Waiting at pickup point',
          color: 'bg-amber-500',
        };
      case 'ride_started':
        return {
          title: 'On Trip to Destination',
          eta: `Estimated ${Math.max(5, activeTrip.etaMinutes * 2)} mins to drop-off`,
          color: 'bg-emerald-500',
        };
      case 'ride_completed':
        return {
          title: 'Trip Completed',
          eta: 'Arrived at destination',
          color: 'bg-emerald-600',
        };
      default:
        return {
          title: 'Driver Assigned',
          eta: 'Connecting...',
          color: 'bg-blue-500',
        };
    }
  };

  const statusInfo = getStatusBadge();

  return (
    <div className="flex flex-col bg-white rounded-3xl p-4 shadow-xl border border-slate-200 select-none animate-in fade-in slide-in-from-bottom-3 duration-300">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="mb-2.5 px-3.5 py-2 bg-slate-900 text-white text-xs font-JakartaSemiBold rounded-xl shadow-lg flex items-center justify-between animate-in fade-in slide-in-from-top-2">
          <span>{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="text-slate-400 hover:text-white ml-2">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Top Status Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <span className={`w-2.5 h-2.5 rounded-full ${statusInfo.color} animate-pulse`} />
          <div>
            <h4 className="text-sm font-JakartaBold text-slate-900 leading-none">
              {statusInfo.title}
            </h4>
            <span className="text-[11px] font-JakartaMedium text-slate-500 mt-1 block">
              {statusInfo.eta}
            </span>
          </div>
        </div>

        {/* Advance Lifecycle simulation button for reviewer */}
        {rideStatus !== 'ride_completed' && (
          <button
            onClick={advanceRideLifecycle}
            className="px-2.5 py-1 rounded-full bg-blue-50 hover:bg-blue-100 text-[#0286FF] text-[11px] font-JakartaBold flex items-center gap-1 transition-all border border-blue-200"
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

      {/* Driver & Vehicle Profile Details Card */}
      <div className="flex items-center justify-between py-3 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src={activeTrip.driver.profile_image_url}
              alt={activeTrip.driver.first_name}
              className="w-13 h-13 rounded-full object-cover border-2 border-white shadow-sm"
            />
            <div className="absolute -bottom-1 -right-1 bg-amber-400 text-slate-900 text-[10px] font-black px-1 rounded-full flex items-center gap-0.5 shadow-xs">
              <Star className="w-2.5 h-2.5 fill-slate-900" />
              <span>{activeTrip.driver.rating || 4.9}</span>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-JakartaBold text-slate-900">
              {activeTrip.driver.first_name} {activeTrip.driver.last_name}
            </h4>
            <p className="text-xs font-JakartaMedium text-slate-600 flex items-center gap-1 mt-0.5">
              <span>{activeTrip.driver.car_model || 'Toyota Corolla'}</span>
              <span>•</span>
              <span className="text-slate-500">{activeTrip.driver.car_color || 'Silver'}</span>
            </p>
            <div className="mt-1 inline-block px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200 text-[11px] font-JakartaBold text-slate-800 tracking-wider">
              {activeTrip.driver.plate_number || 'EKY-428-AB'}
            </div>
          </div>
        </div>

        <div className="text-right">
          <span className="text-base font-JakartaBold text-slate-900">
            ₦{activeTrip.fare.toLocaleString()}
          </span>
          <span className="block text-[10px] font-JakartaMedium text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded uppercase mt-0.5">
            {activeTrip.paymentMethod.toUpperCase()} • {activeTrip.paymentStatus}
          </span>
        </div>
      </div>

      {/* Pickup & Destination Locations */}
      <div className="py-2.5 space-y-2 border-b border-slate-100 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
            <div className="w-1.5 h-1.5 rounded-full bg-[#0286FF]" />
          </div>
          <span className="font-JakartaMedium text-slate-700 truncate">
            {activeTrip.pickup.address}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          </div>
          <span className="font-JakartaMedium text-slate-700 truncate">
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
            className="flex flex-col items-center justify-center py-2 rounded-2xl bg-[#F6F8FA] hover:bg-slate-100 active:scale-95 text-slate-700 transition-all border border-slate-200/70"
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
            className="flex flex-col items-center justify-center py-2 rounded-2xl bg-[#F6F8FA] hover:bg-slate-100 active:scale-95 text-slate-700 transition-all border border-slate-200/70"
            title="Chat with driver"
          >
            <MessageSquare className="w-4 h-4 text-[#0286FF]" />
            <span className="text-[10px] font-JakartaSemiBold mt-1">Chat</span>
          </button>

          {/* Share Trip */}
          <button
            onClick={handleShareTrip}
            className="flex flex-col items-center justify-center py-2 rounded-2xl bg-[#F6F8FA] hover:bg-slate-100 active:scale-95 text-slate-700 transition-all border border-slate-200/70"
            title="Share live trip"
          >
            <Share2 className="w-4 h-4 text-slate-600" />
            <span className="text-[10px] font-JakartaSemiBold mt-1">Share</span>
          </button>

          {/* Emergency / Safety SOS */}
          <button
            onClick={() => setShowEmergencyModal(true)}
            className="flex flex-col items-center justify-center py-2 rounded-2xl bg-red-50 hover:bg-red-100 active:scale-95 text-red-600 transition-all border border-red-200"
            title="Emergency safety"
          >
            <ShieldAlert className="w-4 h-4 text-red-600" />
            <span className="text-[10px] font-JakartaBold mt-1">SOS</span>
          </button>

          {/* Cancel Ride */}
          <button
            onClick={() => setShowCancelModal(true)}
            className="flex flex-col items-center justify-center py-2 rounded-2xl bg-[#F6F8FA] hover:bg-red-50 active:scale-95 text-slate-500 hover:text-red-600 transition-all border border-slate-200/70"
            title="Cancel ride"
          >
            <X className="w-4 h-4" />
            <span className="text-[10px] font-JakartaSemiBold mt-1">Cancel</span>
          </button>
        </div>
      ) : (
        /* Ride Completed Summary */
        <div className="pt-3 flex flex-col items-center text-center gap-2">
          <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-base font-JakartaBold text-slate-900">You have arrived!</h4>
            <p className="text-xs font-JakartaMedium text-slate-500">
              ₦{activeTrip.fare.toLocaleString()} successfully paid via {activeTrip.paymentMethod.toUpperCase()}
            </p>
          </div>
          <button
            onClick={() => {
              cancelActiveTrip();
              setScreen('rides');
            }}
            className="w-full mt-1 py-3 rounded-full bg-[#0286FF] hover:bg-blue-600 text-white font-JakartaBold text-xs shadow-md shadow-blue-500/20 transition-all"
          >
            View in Rides History
          </button>
        </div>
      )}

      {/* Call Modal Dialog */}
      {showCallModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white w-full max-w-xs rounded-3xl p-5 shadow-2xl border border-slate-200 animate-in zoom-in-95">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-base font-JakartaBold text-slate-900">Call Driver</h4>
              <button
                onClick={() => setShowCallModal(false)}
                className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl mb-4">
              <img
                src={activeTrip.driver.profile_image_url}
                alt="Driver"
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <p className="font-JakartaBold text-sm text-slate-900">
                  {activeTrip.driver.first_name} {activeTrip.driver.last_name}
                </p>
                <p className="text-xs text-slate-500 font-JakartaMedium">
                  {activeTrip.driver.phone || '+234 803 112 3344'}
                </p>
              </div>
            </div>
            <a
              href={`tel:${activeTrip.driver.phone || '+2348031123344'}`}
              className="w-full py-3 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-JakartaBold text-xs flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20 transition-all"
            >
              <Phone className="w-4 h-4" />
              <span>Dial Driver Directly</span>
            </a>
          </div>
        </div>
      )}

      {/* Emergency / Safety SOS Modal */}
      {showEmergencyModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white w-full max-w-xs rounded-3xl p-5 shadow-2xl border border-red-200 animate-in zoom-in-95">
            <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center mb-3">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h4 className="text-base font-JakartaBold text-slate-900">Broader Safety & SOS</h4>
            <p className="text-xs font-JakartaMedium text-slate-500 mt-1 mb-4 leading-relaxed">
              If you feel unsafe or in danger, immediately contact emergency services or our 24/7 Broader Safety team.
            </p>

            <div className="space-y-2">
              <a
                href="tel:112"
                className="w-full py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-JakartaBold text-xs flex items-center justify-center gap-2 shadow-sm"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call Emergency (112 / 767)</span>
              </a>

              <a
                href="tel:+2348002762337"
                className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-JakartaBold text-xs flex items-center justify-center gap-2 shadow-sm"
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>Broader 24/7 Safety Desk</span>
              </a>

              <button
                onClick={() => setShowEmergencyModal(false)}
                className="w-full py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-JakartaSemiBold text-xs"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Confirmation Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white w-full max-w-xs rounded-3xl p-5 shadow-2xl border border-slate-200 animate-in zoom-in-95">
            <h4 className="text-base font-JakartaBold text-slate-900">Cancel Ride?</h4>
            <p className="text-xs font-JakartaMedium text-slate-500 mt-1 mb-4 leading-relaxed">
              Are you sure you want to cancel this trip with {activeTrip.driver.first_name}? No cancellation fee will be charged within 5 minutes.
            </p>

            <div className="flex gap-2">
              <button
                onClick={() => setShowCancelModal(false)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-JakartaBold text-xs hover:bg-slate-50"
              >
                Keep Ride
              </button>

              <button
                onClick={() => {
                  setShowCancelModal(false);
                  cancelActiveTrip();
                  showToast('Trip cancelled');
                }}
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-JakartaBold text-xs shadow-md shadow-red-600/20"
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
