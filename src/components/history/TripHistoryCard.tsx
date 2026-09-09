import React from 'react';
import { motion } from 'motion/react';
import {
  Star,
  MapPin,
  Clock,
  ArrowRight,
  ShieldCheck,
  ChevronRight,
  Receipt,
  Car,
} from 'lucide-react';
import { Ride } from '../../types';
import { TripMiniMap } from './TripMiniMap';
import { GlassCard } from '../glass/GlassCard';
import { GlassPill } from '../glass/GlassPill';
import { getVehicle3DImage } from '../../data/vehicleAssets';

export interface TripHistoryCardProps {
  ride: Ride;
  onClick?: () => void;
  index?: number;
}

export const TripHistoryCard: React.FC<TripHistoryCardProps> = ({
  ride,
  onClick,
  index = 0,
}) => {
  // Format date/time
  const rideDate = new Date(ride.created_at);
  const isToday = new Date().toDateString() === rideDate.toDateString();
  const timeStr = rideDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const dateStr = isToday
    ? `Today • ${timeStr}`
    : `${rideDate.toLocaleDateString([], { month: 'short', day: 'numeric' })} • ${timeStr}`;

  // Vehicle image thumbnail
  const vehicle3DImg = getVehicle3DImage(ride.vehicle_type || 'car');

  // Format distance
  const distanceKm = (
    Math.abs(ride.destination_latitude - ride.origin_latitude) * 111 +
    Math.abs(ride.destination_longitude - ride.origin_longitude) * 111
  ).toFixed(2);

  // Status color badge
  const isCancelled = ride.payment_status?.toLowerCase() === 'cancelled';

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.06, ease: [0.16, 1, 0.3, 1] }}
    >
      <GlassCard
        interactive={true}
        onClick={onClick}
        glow="magenta"
        intensity="medium"
        className="p-4 flex flex-col gap-3 group border border-white/[0.08] hover:border-pink-500/40 transition-all duration-300"
      >
        {/* Top Status & Date Row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span
              className={`text-[10px] font-JakartaBold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                isCancelled
                  ? 'bg-red-500/15 text-red-400 border border-red-500/30'
                  : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
              }`}
            >
              {isCancelled ? 'Trip Cancelled' : 'Trip Completed'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-10 h-7 relative flex items-center justify-center">
              <img
                src={vehicle3DImg}
                alt={ride.vehicle_type || 'Vehicle'}
                referrerPolicy="no-referrer"
                className="w-full h-full object-contain filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
              />
            </div>
            <span className="text-[11px] font-mono text-neutral-400">{dateStr}</span>
          </div>
        </div>

        {/* Mini Map Polyline (Reference Screenshot 4) */}
        <div className="w-full">
          <TripMiniMap color={isCancelled ? '#EF4444' : '#EC4899'} height={54} />
        </div>

        {/* Route Origin -> Destination */}
        <div className="flex items-center gap-2 text-sm font-JakartaSemiBold text-white">
          <span className="truncate max-w-[45%] text-neutral-200">{ride.origin_address}</span>
          <ArrowRight className="w-3.5 h-3.5 text-pink-400 shrink-0" />
          <span className="truncate max-w-[45%] text-neutral-200">{ride.destination_address}</span>
        </div>

        {/* Metrics Row: Distance, Fare & Star Rating */}
        <div className="flex items-center justify-between pt-2 border-t border-white/[0.08]">
          <div className="flex items-center gap-3">
            <div>
              <span className="text-[9px] text-neutral-400 uppercase font-JakartaMedium block">
                Distance
              </span>
              <span className="text-xs font-mono font-bold text-neutral-200">
                {distanceKm} km
              </span>
            </div>

            <div className="h-6 w-px bg-white/[0.08]" />

            <div>
              <span className="text-[9px] text-neutral-400 uppercase font-JakartaMedium block">
                Fare
              </span>
              <span className="text-xs font-mono font-bold text-[#9EE6B5]">
                ₦{Number(ride.fare_price || 0).toLocaleString()}
              </span>
            </div>
          </div>

          {/* Vehicle & Plate / Star Rating */}
          <div className="flex flex-col items-end">
            <div className="flex items-center gap-0.5 text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <span className="text-[10px] font-mono text-neutral-400 mt-0.5">
              {ride.driver?.car_model || 'Toyota Camry'} • {ride.driver?.plate_number || 'LND-294-XY'}
            </span>
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
};
