import React from 'react';
import { Ride } from '../types';
import { getVehicle3DImage } from '../data/vehicleAssets';

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

  const vehicle3DImg = getVehicle3DImage(ride.vehicle_type, ride.driver?.car_model);

  return (
    <div
      onClick={onPress}
      className="flex flex-col glass-panel glass-panel-hover rounded-2xl p-4 mb-3 cursor-pointer select-none backdrop-blur-xl transition-all"
    >
      <div className="flex items-center gap-3.5">
        {/* Lifelike 3D Vehicle Render Thumbnail */}
        <div className="relative w-20 h-20 shrink-0 flex items-center justify-center">
          <div className="absolute bottom-1 w-16 h-3 bg-black/80 rounded-full blur-[2px] pointer-events-none" />
          <img
            src={vehicle3DImg}
            alt={ride.vehicle_type || 'Vehicle'}
            referrerPolicy="no-referrer"
            className="w-full h-full object-contain filter drop-shadow-[0_6px_12px_rgba(0,0,0,0.9)]"
          />
        </div>

        {/* Origin & Destination route points */}
        <div className="flex flex-col justify-between flex-1 min-w-0 py-0.5 gap-2">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-[#9EE6B5]/20 border border-[#9EE6B5]/40 flex items-center justify-center shrink-0">
              <div className="w-1.5 h-1.5 rounded-full bg-[#9EE6B5]" />
            </div>
            <p className="text-xs font-JakartaSemiBold text-neutral-200 truncate" title={ride.origin_address}>
              {ride.origin_address}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center shrink-0">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            </div>
            <p className="text-xs font-JakartaSemiBold text-neutral-200 truncate" title={ride.destination_address}>
              {ride.destination_address}
            </p>
          </div>
        </div>
      </div>

      {/* Ride Details Block in Frosted Sub-card */}
      <div className="flex flex-col w-full mt-3 bg-white/[0.03] rounded-xl p-3 text-xs gap-2 border border-white/[0.06]">
        <div className="flex items-center justify-between">
          <span className="text-neutral-400 font-JakartaMedium">Date & Time</span>
          <span className="text-neutral-200 font-JakartaBold">
            {formatDate(ride.created_at)} • {ride.ride_time} mins
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-neutral-400 font-JakartaMedium">Driver</span>
          <span className="text-neutral-200 font-JakartaBold">
            {ride.driver.first_name} {ride.driver.last_name}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-neutral-400 font-JakartaMedium">Vehicle</span>
          <span className="text-neutral-200 font-JakartaBold">
            {ride.driver.car_model || ride.vehicle_type}
          </span>
        </div>

        <div className="flex items-center justify-between pt-1.5 border-t border-white/[0.06]">
          <span className="text-neutral-400 font-JakartaMedium">Payment</span>
          <span className="font-JakartaBold text-[#9EE6B5] uppercase tracking-wider text-[11px] bg-[#9EE6B5]/10 px-2 py-0.5 rounded-md border border-[#9EE6B5]/30">
            {ride.payment_status} • {formattedPrice}
          </span>
        </div>
      </div>
    </div>
  );
};
