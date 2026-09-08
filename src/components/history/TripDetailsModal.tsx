import React from 'react';
import {
  MapPin,
  Calendar,
  Clock,
  CreditCard,
  User,
  Star,
  Receipt,
  Car,
  RotateCw,
  X,
  ShieldCheck,
  Navigation,
} from 'lucide-react';
import { Ride } from '../../types';
import { GlassModal } from '../glass/GlassModal';
import { GlassButton } from '../glass/GlassButton';
import { InteractiveMap } from '../InteractiveMap';
import { getVehicle3DImage } from '../../data/vehicleAssets';

export interface TripDetailsModalProps {
  ride: Ride | null;
  isOpen: boolean;
  onClose: () => void;
  onRebook?: (ride: Ride) => void;
}

export const TripDetailsModal: React.FC<TripDetailsModalProps> = ({
  ride,
  isOpen,
  onClose,
  onRebook,
}) => {
  if (!ride) return null;

  const rideDate = new Date(ride.created_at);
  const dateFormatted = rideDate.toLocaleDateString('en-NG', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const distanceKm = (
    Math.abs(ride.destination_latitude - ride.origin_latitude) * 111 +
    Math.abs(ride.destination_longitude - ride.origin_longitude) * 111
  ).toFixed(2);

  const vehicle3D = getVehicle3DImage(ride.vehicle_type || 'car');

  return (
    <GlassModal
      isOpen={isOpen}
      onClose={onClose}
      title="Trip Summary"
      subtitle={`Receipt #${ride.ride_id.slice(-6).toUpperCase()}`}
      maxWidth="md"
    >
      <div className="flex flex-col gap-4">
        {/* Route Interactive Mini Map */}
        <div className="rounded-2xl overflow-hidden border border-white/[0.1] relative">
          <InteractiveMap
            height="h-[180px]"
            showRoute={true}
            interactive={false}
          />
          <div className="absolute top-2 right-2 px-2 py-1 rounded-lg bg-black/70 backdrop-blur-md text-[10px] font-mono font-bold text-white border border-white/10">
            {distanceKm} km • {ride.ride_time || '18'} min
          </div>
        </div>

        {/* Origin & Destination */}
        <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex flex-col gap-3">
          <div className="flex items-start gap-2.5">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 mt-1 shrink-0 shadow-[0_0_8px_#34d399]" />
            <div className="min-w-0 flex-1">
              <span className="text-[10px] text-neutral-400 font-JakartaMedium block uppercase">
                Pickup Location
              </span>
              <p className="text-xs font-JakartaSemiBold text-white truncate">
                {ride.origin_address}
              </p>
            </div>
          </div>

          <div className="h-px bg-white/[0.08] ml-4" />

          <div className="flex items-start gap-2.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-400 mt-1 shrink-0 shadow-[0_0_8px_#f87171]" />
            <div className="min-w-0 flex-1">
              <span className="text-[10px] text-neutral-400 font-JakartaMedium block uppercase">
                Destination
              </span>
              <p className="text-xs font-JakartaSemiBold text-white truncate">
                {ride.destination_address}
              </p>
            </div>
          </div>
        </div>

        {/* Driver & 3D Vehicle Card */}
        <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-300 font-JakartaBold text-sm overflow-hidden">
              {ride.driver?.profile_image_url ? (
                <img
                  src={ride.driver.profile_image_url}
                  alt={ride.driver.first_name}
                  className="w-full h-full object-cover"
                />
              ) : (
                `${ride.driver?.first_name?.[0] || 'D'}${ride.driver?.last_name?.[0] || 'R'}`
              )}
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-JakartaBold text-white">
                  {ride.driver?.first_name} {ride.driver?.last_name}
                </span>
                <span className="flex items-center gap-0.5 text-xs text-yellow-400 font-mono font-bold">
                  <Star className="w-3 h-3 fill-yellow-400" />
                  {ride.driver?.rating || '4.95'}
                </span>
              </div>
              <p className="text-[11px] font-mono text-neutral-400">
                {ride.driver?.car_model || 'Toyota Camry'} • {ride.driver?.plate_number || 'LND-294-XY'}
              </p>
            </div>
          </div>

          <div className="w-16 h-10 shrink-0 flex items-center justify-center">
            <img
              src={vehicle3D}
              alt="Vehicle"
              className="w-full h-full object-contain filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.9)]"
            />
          </div>
        </div>

        {/* Itemized Fare & Payment Breakdown */}
        <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/[0.08] space-y-2 text-xs">
          <div className="flex justify-between text-neutral-400">
            <span>Trip Date & Time</span>
            <span className="font-mono text-neutral-200">{dateFormatted}</span>
          </div>
          <div className="flex justify-between text-neutral-400">
            <span>Payment Method</span>
            <span className="font-JakartaSemiBold text-neutral-200 capitalize">
              {ride.payment_method || 'Broader Wallet'}
            </span>
          </div>
          <div className="flex justify-between text-neutral-400">
            <span>Trip Status</span>
            <span className="text-emerald-400 font-bold uppercase">
              {ride.payment_status || 'Paid & Completed'}
            </span>
          </div>
          <div className="pt-2 border-t border-white/[0.08] flex justify-between text-sm font-JakartaBold text-white">
            <span>Total Fare</span>
            <span className="text-base text-[#0286FF] font-mono">
              ₦{Number(ride.fare_price || 0).toLocaleString()}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 pt-1">
          {onRebook && (
            <GlassButton
              variant="primary"
              fullWidth={true}
              onClick={() => onRebook(ride)}
              leftIcon={<RotateCw className="w-4 h-4" />}
            >
              Rebook This Ride
            </GlassButton>
          )}

          <GlassButton variant="default" onClick={onClose}>
            Close
          </GlassButton>
        </div>
      </div>
    </GlassModal>
  );
};
