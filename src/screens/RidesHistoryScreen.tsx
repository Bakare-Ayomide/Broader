import React, { useState } from 'react';
import { useBroaderStore } from '../store/useBroaderStore';
import { TripHistoryCard } from '../components/history/TripHistoryCard';
import { TripDetailsModal } from '../components/history/TripDetailsModal';
import { Ride, ActivityTab } from '../types';
import {
  Plus,
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  XCircle,
  AlertCircle,
  RotateCw,
  Star,
  Receipt,
  Car,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';

export const RidesHistoryScreen: React.FC = () => {
  const rides = useBroaderStore((s) => s.rides);
  const scheduledRides = useBroaderStore((s) => s.scheduledRides);
  const cancelledRides = useBroaderStore((s) => s.cancelledRides);
  const activeTrip = useBroaderStore((s) => s.activeTrip);
  const setScreen = useBroaderStore((s) => s.setScreen);

  const setDestinationLocation = useBroaderStore((s) => s.setDestinationLocation);
  const setUserLocation = useBroaderStore((s) => s.setUserLocation);

  const [activeTab, setActiveTab] = useState<ActivityTab>('completed');
  const [selectedRide, setSelectedRide] = useState<Ride | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [showLostItemModal, setShowLostItemModal] = useState(false);
  const [lostItemDesc, setLostItemDesc] = useState('');
  const [lostItemSubmitted, setLostItemSubmitted] = useState(false);

  const handleRebook = (ride: Ride) => {
    setUserLocation({
      latitude: ride.origin_latitude,
      longitude: ride.origin_longitude,
      address: ride.origin_address,
    });
    setDestinationLocation({
      latitude: ride.destination_latitude,
      longitude: ride.destination_longitude,
      address: ride.destination_address,
    });
    setSelectedRide(null);
    setScreen('confirm-ride');
  };

  const handleReportLostItem = (e: React.FormEvent) => {
    e.preventDefault();
    setLostItemSubmitted(true);
    setTimeout(() => {
      setLostItemSubmitted(false);
      setShowLostItemModal(false);
      setLostItemDesc('');
    }, 2500);
  };

  // Convert activeTrip to Ride format if ongoing
  const ongoingRides: Ride[] = activeTrip
    ? [
        {
          ride_id: activeTrip.id,
          origin_address: activeTrip.pickup.address,
          destination_address: activeTrip.destination.address,
          origin_latitude: activeTrip.pickup.latitude,
          origin_longitude: activeTrip.pickup.longitude,
          destination_latitude: activeTrip.destination.latitude,
          destination_longitude: activeTrip.destination.longitude,
          ride_time: activeTrip.etaMinutes,
          fare_price: activeTrip.fare,
          payment_status: activeTrip.paymentStatus,
          payment_method: activeTrip.paymentMethod,
          driver_id: activeTrip.driver.id,
          user_id: 'usr_broader_ng_101',
          created_at: activeTrip.startTime,
          vehicle_type: activeTrip.vehicle.name,
          driver: {
            first_name: activeTrip.driver.first_name,
            last_name: activeTrip.driver.last_name,
            car_seats: activeTrip.driver.car_seats,
            profile_image_url: activeTrip.driver.profile_image_url,
            rating: activeTrip.driver.rating,
            plate_number: activeTrip.driver.plate_number,
            car_model: activeTrip.driver.car_model,
          },
        },
      ]
    : [];

  const getTabRides = () => {
    switch (activeTab) {
      case 'ongoing':
        return ongoingRides;
      case 'scheduled':
        return scheduledRides;
      case 'completed':
        return rides;
      case 'cancelled':
        return cancelledRides;
      default:
        return rides;
    }
  };

  const currentRides = getTabRides();

  const handleRefresh = () => {
    setIsLoading(true);
    setHasError(false);
    setTimeout(() => {
      setIsLoading(false);
    }, 400);
  };

  return (
    <div className="flex flex-col min-h-full bg-[#000000] text-white p-5 pb-8 select-none">
      {/* Header */}
      <div className="flex items-center justify-between my-2">
        <div>
          <h2 className="text-2xl font-JakartaBold text-white tracking-tight">Activity</h2>
          <p className="text-xs text-neutral-400 font-JakartaMedium">Trips & bookings across Nigeria</p>
        </div>
        <button
          onClick={() => setScreen('find-ride')}
          className="text-xs font-JakartaBold px-3 py-1.5 rounded-full bg-[#0286FF] hover:bg-blue-500 text-white flex items-center gap-1 shadow-[0_0_14px_rgba(2,134,255,0.4)] transition-all"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Ride</span>
        </button>
      </div>

      {/* 4 Activity Tabs */}
      <div className="flex items-center p-1 glass-panel border border-white/[0.08] rounded-2xl my-3 text-xs font-JakartaBold">
        <button
          onClick={() => setActiveTab('ongoing')}
          className={`flex-1 py-2 rounded-xl text-center transition-all flex items-center justify-center gap-1 ${
            activeTab === 'ongoing'
              ? 'bg-white/15 text-white shadow-sm border border-white/10'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          <span>Ongoing</span>
          {ongoingRides.length > 0 && (
            <span className="w-2 h-2 rounded-full bg-[#0286FF] animate-pulse" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('scheduled')}
          className={`flex-1 py-2 rounded-xl text-center transition-all ${
            activeTab === 'scheduled'
              ? 'bg-white/15 text-white shadow-sm border border-white/10'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          Scheduled ({scheduledRides.length})
        </button>

        <button
          onClick={() => setActiveTab('completed')}
          className={`flex-1 py-2 rounded-xl text-center transition-all ${
            activeTab === 'completed'
              ? 'bg-white/15 text-white shadow-sm border border-white/10'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          Completed ({rides.length})
        </button>

        <button
          onClick={() => setActiveTab('cancelled')}
          className={`flex-1 py-2 rounded-xl text-center transition-all ${
            activeTab === 'cancelled'
              ? 'bg-white/15 text-white shadow-sm border border-white/10'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          Cancelled ({cancelledRides.length})
        </button>
      </div>

      {/* Sub-header status counter */}
      <div className="flex items-center justify-between my-2 text-xs text-neutral-400 font-JakartaMedium border-b border-white/[0.08] pb-2">
        <span>{currentRides.length} {activeTab} Records</span>
        <button
          onClick={handleRefresh}
          className="text-[#0286FF] font-JakartaSemiBold flex items-center gap-1 hover:underline"
        >
          <RotateCw className={`w-3 h-3 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Error State */}
      {hasError ? (
        <div className="flex-1 flex flex-col items-center justify-center py-12 text-center">
          <div className="w-12 h-12 rounded-full bg-red-500/10 text-red-400 flex items-center justify-center mb-3">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-JakartaBold text-white">Failed to load activities</h3>
          <p className="text-xs text-neutral-400 font-JakartaMedium mt-1 mb-4">
            Could not retrieve backend trip records.
          </p>
          <button
            onClick={handleRefresh}
            className="px-4 py-2 rounded-full bg-[#0286FF] text-white text-xs font-JakartaBold shadow-[0_0_12px_rgba(2,134,255,0.4)]"
          >
            Retry Connection
          </button>
        </div>
      ) : isLoading ? (
        /* Loading State */
        <div className="flex-1 flex flex-col items-center justify-center py-16 text-center space-y-3">
          <div className="w-8 h-8 rounded-full border-2 border-[#0286FF] border-t-transparent animate-spin" />
          <p className="text-xs text-neutral-400 font-JakartaMedium">Retrieving trips from backend...</p>
        </div>
      ) : currentRides.length > 0 ? (
        /* Completed/Populated Rides List with Progressive Glow Polyline */
        <div className="space-y-3 mt-1">
          {currentRides.map((ride, idx) => (
            <TripHistoryCard
              key={ride.ride_id || idx}
              ride={ride}
              index={idx}
              onClick={() => setSelectedRide(ride)}
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="flex-1 flex flex-col items-center justify-center py-16 text-center">
          <div className="w-14 h-14 rounded-2xl glass-panel border border-white/10 flex items-center justify-center text-neutral-400 mb-3">
            <Calendar className="w-7 h-7" />
          </div>
          <h3 className="text-base font-JakartaBold text-white">
            No {activeTab} trips
          </h3>
          <p className="text-xs text-neutral-400 font-JakartaMedium max-w-xs mt-1">
            {activeTab === 'ongoing'
              ? 'You currently do not have an active trip in progress.'
              : activeTab === 'scheduled'
              ? 'Plan ahead! Book scheduled rides for airport transfers and meetings.'
              : activeTab === 'cancelled'
              ? 'No cancelled trips found on your account.'
              : 'Book your first ride across Lagos with Broader!'}
          </p>
          <button
            onClick={() => setScreen('find-ride')}
            className="mt-4 px-5 py-2.5 rounded-full bg-[#0286FF] hover:bg-blue-500 text-white font-JakartaBold text-xs shadow-[0_0_14px_rgba(2,134,255,0.4)] transition-all"
          >
            Find a Ride
          </button>
        </div>
      )}

      {/* High Fidelity Glass Trip Details Modal */}
      <TripDetailsModal
        ride={selectedRide}
        isOpen={selectedRide !== null}
        onClose={() => setSelectedRide(null)}
        onRebook={handleRebook}
      />

      {/* Report Lost Item Modal */}
      {showLostItemModal && selectedRide && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-md">
          <div className="glass-panel w-full max-w-sm rounded-3xl p-5 shadow-2xl border border-white/15 animate-in zoom-in-95 text-white">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-JakartaBold text-white flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span>Report Lost Item</span>
              </h4>
              <button
                onClick={() => setShowLostItemModal(false)}
                className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-neutral-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            {lostItemSubmitted ? (
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-center">
                <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                <h5 className="font-JakartaBold text-sm text-emerald-300">Claim Logged with Support</h5>
                <p className="text-xs text-emerald-400 font-JakartaMedium mt-1">
                  We have notified driver {selectedRide.driver.first_name} and our 24/7 Lagos Lost & Found Desk.
                </p>
              </div>
            ) : (
              <form onSubmit={handleReportLostItem} className="space-y-3">
                <p className="text-xs text-neutral-400 font-JakartaMedium">
                  Trip with {selectedRide.driver.first_name} • {selectedRide.driver.plate_number}
                </p>
                <div>
                  <label className="block text-[11px] font-JakartaBold text-neutral-300 mb-1">
                    Describe your missing item
                  </label>
                  <textarea
                    rows={3}
                    value={lostItemDesc}
                    onChange={(e) => setLostItemDesc(e.target.value)}
                    required
                    placeholder="e.g. Black leather wallet or phone left on the back passenger seat..."
                    className="w-full text-xs font-JakartaMedium border border-white/15 rounded-2xl p-2.5 bg-black/60 text-white placeholder-neutral-500 focus:outline-none focus:border-[#0286FF]"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setShowLostItemModal(false)}
                    className="flex-1 py-2.5 rounded-2xl border border-white/15 text-neutral-300 font-JakartaBold text-xs hover:bg-white/10"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-JakartaBold text-xs shadow-md shadow-amber-500/20"
                  >
                    Submit Report
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
