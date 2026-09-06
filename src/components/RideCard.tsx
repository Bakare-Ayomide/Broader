import React from 'react';
import { Ride } from '../types';

interface RideCardProps {
  ride: Ride;
  onPress?: () => void;
}

export const RideCard: React.FC<RideCardProps> = ({ ride, onPress }) => {
  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  const formattedPrice =
    ride.fare_price >= 100
      ? `₦${Math.round(ride.fare_price).toLocaleString()}`
      : `₦${Math.round(ride.fare_price * 100).toLocaleString()}`;

  return (
    <div
      onClick={onPress}
      className="flex flex-col bg-white rounded-2xl shadow-sm border border-neutral-100 p-4 mb-3 hover:border-blue-200 transition-all cursor-pointer"
    >
      <div className="flex items-center gap-3">
        {/* Map Snapshot Thumbnail */}
        <div className="relative w-20 h-20 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden shrink-0 flex items-center justify-center">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-slate-200 opacity-80" />
          <svg className="w-16 h-16 text-blue-400 opacity-60" viewBox="0 0 100 100">
            <path d="M 10 90 Q 50 10 90 90" stroke="currentColor" strokeWidth="4" fill="none" />
            <circle cx="10" cy="90" r="6" fill="#0286FF" />
            <circle cx="90" cy="90" r="6" fill="#EF4444" />
          </svg>
          <div className="absolute bottom-1 right-1 px-1 py-0.5 rounded bg-white/90 text-[9px] font-bold text-slate-700 shadow-xs">
            LAGOS
          </div>
        </div>

        {/* Origin & Destination route points */}
        <div className="flex flex-col justify-between flex-1 min-w-0 py-1 gap-2.5">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
              <div className="w-1.5 h-1.5 rounded-full bg-[#0286FF]" />
            </div>
            <p className="text-sm font-JakartaMedium text-slate-800 truncate" title={ride.origin_address}>
              {ride.origin_address}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            </div>
            <p className="text-sm font-JakartaMedium text-slate-800 truncate" title={ride.destination_address}>
              {ride.destination_address}
            </p>
          </div>
        </div>
      </div>

      {/* Ride Details Block */}
      <div className="flex flex-col w-full mt-3.5 bg-[#F6F8FA] rounded-xl p-3 text-xs gap-2 border border-slate-100">
        <div className="flex items-center justify-between">
          <span className="text-slate-500 font-JakartaMedium">Date & Time</span>
          <span className="text-slate-800 font-JakartaBold">
            {formatDate(ride.created_at)} • {ride.ride_time} mins
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-slate-500 font-JakartaMedium">Driver</span>
          <span className="text-slate-800 font-JakartaBold">
            {ride.driver.first_name} {ride.driver.last_name}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-slate-500 font-JakartaMedium">Vehicle</span>
          <span className="text-slate-800 font-JakartaBold">{ride.driver.car_seats} seats</span>
        </div>

        <div className="flex items-center justify-between pt-1 border-t border-slate-200/60">
          <span className="text-slate-500 font-JakartaMedium">Payment Status</span>
          <span className="font-JakartaBold text-emerald-600 uppercase tracking-wider text-[11px] bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
            {ride.payment_status} • {formattedPrice}
          </span>
        </div>
      </div>
    </div>
  );
};
