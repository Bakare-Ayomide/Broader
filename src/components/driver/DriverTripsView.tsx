import React, { useState } from 'react';
import { useBroaderStore } from '../../store/useBroaderStore';
import {
  Clock,
  MapPin,
  Calendar,
  CheckCircle2,
  XCircle,
  ChevronRight,
  Star,
  Check,
  Car,
  Filter,
} from 'lucide-react';

export const DriverTripsView: React.FC = () => {
  const driverTripsHistory = useBroaderStore((s) => s.driverTripsHistory);
  const scheduledRides = useBroaderStore((s) => s.scheduledRides);
  const acceptScheduledRideAsDriver = useBroaderStore((s) => s.acceptScheduledRideAsDriver);

  const [filterTab, setFilterTab] = useState<'today' | 'scheduled' | 'all' | 'cancelled'>('today');
  const [claimedRideIds, setClaimedRideIds] = useState<string[]>([]);

  const handleClaim = (rideId: string) => {
    acceptScheduledRideAsDriver(rideId);
    setClaimedRideIds([...claimedRideIds, rideId]);
  };

  const filteredTrips = driverTripsHistory.filter((t) => {
    if (filterTab === 'today') return t.timestamp.includes('Today') && t.status === 'completed';
    if (filterTab === 'cancelled') return t.status === 'cancelled';
    return true;
  });

  return (
    <div className="space-y-3 pb-6 animate-in fade-in duration-200">
      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-2xl">
        {[
          { id: 'today', label: 'Today' },
          { id: 'scheduled', label: `Scheduled (${scheduledRides.length})` },
          { id: 'all', label: 'All History' },
          { id: 'cancelled', label: 'Cancelled' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilterTab(tab.id as any)}
            className={`flex-1 py-1.5 rounded-xl text-xs font-JakartaBold transition-all ${
              filterTab === tab.id
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* SCHEDULED BOOKINGS TAB */}
      {filterTab === 'scheduled' ? (
        <div className="space-y-2.5">
          <div className="p-3 bg-blue-50/70 border border-blue-100 rounded-2xl flex items-center justify-between text-xs">
            <span className="font-JakartaBold text-blue-900 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#0286FF]" /> Available Pre-Booked Trips
            </span>
            <span className="text-[10px] text-blue-700 font-JakartaMedium">Claim in advance</span>
          </div>

          {scheduledRides.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-3xl border border-slate-200">
              <Calendar className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-xs font-JakartaBold text-slate-700">No scheduled rides available</p>
              <p className="text-[10px] text-slate-400">Pre-booked passenger trips will appear here</p>
            </div>
          ) : (
            scheduledRides.map((ride) => {
              const isClaimed = claimedRideIds.includes(ride.ride_id.toString());
              const netEarnings = Math.round(ride.fare_price * 0.85);

              return (
                <div
                  key={ride.ride_id}
                  className="bg-white rounded-2xl p-3.5 border border-slate-200 shadow-xs space-y-2.5 hover:border-blue-200 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-xl bg-blue-50 text-[#0286FF] flex items-center justify-center">
                        <Car className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <span className="text-xs font-JakartaBold text-slate-900 block">
                          {ride.vehicle_type || 'Broader Go'}
                        </span>
                        <span className="text-[10px] text-slate-400 font-JakartaMedium flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(ride.created_at).toLocaleDateString([], {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-JakartaBold text-emerald-600 block">
                        ₦{netEarnings.toLocaleString()}
                      </span>
                      <span className="text-[9px] text-slate-400">Fare: ₦{ride.fare_price.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="p-2 bg-slate-50 rounded-xl space-y-1 text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#0286FF]" />
                      <span className="text-[11px] font-JakartaMedium text-slate-800 truncate">
                        {ride.origin_address}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      <span className="text-[11px] font-JakartaMedium text-slate-800 truncate">
                        {ride.destination_address}
                      </span>
                    </div>
                  </div>

                  <div className="pt-1 flex items-center justify-between">
                    <span className="text-[10px] text-slate-500 font-JakartaMedium">
                      Est. Duration: {ride.ride_time} mins
                    </span>
                    {isClaimed ? (
                      <span className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-JakartaBold border border-emerald-200 flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" /> Claimed
                      </span>
                    ) : (
                      <button
                        onClick={() => handleClaim(ride.ride_id.toString())}
                        className="px-3 py-1.5 rounded-xl bg-[#0286FF] hover:bg-blue-600 text-white text-xs font-JakartaBold shadow-xs active:scale-95 transition-all flex items-center gap-1"
                      >
                        <span>Claim Scheduled Ride</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      ) : (
        /* COMPLETED & CANCELLED TRIPS LIST */
        <div className="space-y-2.5">
          {filteredTrips.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-3xl border border-slate-200">
              <Clock className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-xs font-JakartaBold text-slate-700">No records found for this view</p>
              <p className="text-[10px] text-slate-400">Your completed rides will appear here</p>
            </div>
          ) : (
            filteredTrips.map((trip) => (
              <div
                key={trip.id}
                className="bg-white rounded-2xl p-3.5 border border-slate-200 shadow-xs space-y-2.5 hover:border-blue-200 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <img
                      src={
                        trip.passengerImage ||
                        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80'
                      }
                      alt={trip.passengerName}
                      className="w-8 h-8 rounded-full object-cover border border-slate-200"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-JakartaBold text-slate-900">{trip.passengerName}</span>
                        <span className="text-[10px] text-amber-500 font-JakartaBold flex items-center">
                          <Star className="w-2.5 h-2.5 fill-amber-400 mr-0.5" /> {trip.passengerRating}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-JakartaMedium">{trip.timestamp}</span>
                    </div>
                  </div>

                  <div className="text-right">
                    {trip.status === 'completed' ? (
                      <>
                        <span className="text-xs font-JakartaBold text-emerald-600 block">
                          +₦{trip.netEarnings.toLocaleString()}
                        </span>
                        <span className="text-[9px] text-slate-400">
                          Gross ₦{trip.fare.toLocaleString()} • Fee ₦{trip.commission.toLocaleString()}
                        </span>
                      </>
                    ) : (
                      <span className="text-xs font-JakartaBold text-red-500 bg-red-50 px-2 py-0.5 rounded-full">
                        Cancelled
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-2 bg-slate-50 rounded-xl space-y-1 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#0286FF]" />
                    <span className="text-[11px] font-JakartaMedium text-slate-800 truncate">
                      {trip.pickup}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span className="text-[11px] font-JakartaMedium text-slate-800 truncate">
                      {trip.destination}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[10px] text-slate-400 pt-0.5 font-JakartaMedium">
                  <span>Plate: {trip.vehiclePlate}</span>
                  <span>
                    {trip.distanceKm} km • ~{trip.durationMinutes} mins
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
