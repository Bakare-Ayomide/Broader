import React from 'react';
import { VehicleOption } from '../../types';
import { getVehicle3DImage } from '../../data/vehicleAssets';
import {
  X,
  MapPin,
  Clock,
  Wallet,
  CreditCard,
  Banknote,
  ShieldCheck,
  Sparkles,
  AlertCircle,
  Navigation,
} from 'lucide-react';
import { soundEngine } from '../../services/soundNotification';

interface RideConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  vehicle: VehicleOption | null;
  pickupAddress: string;
  destinationAddress: string;
  paymentMethod: 'wallet' | 'card' | 'cash';
  walletBalance: number;
}

export const RideConfirmationModal: React.FC<RideConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  vehicle,
  pickupAddress,
  destinationAddress,
  paymentMethod,
  walletBalance,
}) => {
  if (!isOpen || !vehicle) return null;

  const fare = vehicle.price;
  const isWalletInsufficient = paymentMethod === 'wallet' && walletBalance < fare;

  const handleConfirm = () => {
    soundEngine.playSuccess();
    onConfirm();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md select-none animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-[#0c1420]/95 backdrop-blur-2xl rounded-3xl border border-white/15 shadow-[0_25px_60px_rgba(0,0,0,0.95)] overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-5 py-4 border-b border-white/[0.08] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#9EE6B5]/15 text-[#9EE6B5] flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-JakartaBold text-white leading-tight">
                Confirm Ride Request
              </h3>
              <p className="text-[11px] font-JakartaMedium text-neutral-400">
                Review trip and pricing details
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-neutral-400 hover:text-white transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto no-scrollbar">
          {/* Vehicle Snapshot Card */}
          <div className="p-3.5 rounded-2xl bg-[#131b26]/90 border border-white/[0.08] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-16 h-12 flex items-center justify-center shrink-0">
                <img
                  src={getVehicle3DImage(vehicle.category, vehicle.name)}
                  alt={vehicle.name}
                  referrerPolicy="no-referrer"
                  className="max-h-12 w-auto object-contain filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)]"
                />
              </div>
              <div>
                <h4 className="text-sm font-JakartaBold text-white">{vehicle.name}</h4>
                <div className="flex items-center gap-2 text-[11px] font-JakartaMedium text-neutral-400 mt-0.5">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-[#9EE6B5]" />
                    {vehicle.time} mins ETA
                  </span>
                  <span>•</span>
                  <span>{vehicle.seats} Seats</span>
                </div>
              </div>
            </div>

            <div className="text-right">
              <span className="text-base font-JakartaExtraBold text-[#9EE6B5]">
                ₦{fare.toLocaleString()}
              </span>
              <span className="block text-[10px] font-JakartaMedium text-neutral-400">
                Guaranteed Fare
              </span>
            </div>
          </div>

          {/* Route Overview */}
          <div className="p-3.5 rounded-2xl bg-[#131b26]/60 border border-white/[0.06] space-y-3">
            <div className="flex items-start gap-3">
              <div className="mt-1 flex flex-col items-center">
                <div className="w-2.5 h-2.5 rounded-full bg-[#9EE6B5] shadow-[0_0_8px_#9EE6B5]" />
                <div className="w-0.5 h-6 bg-white/20 my-0.5" />
                <div className="w-2.5 h-2.5 rounded-full bg-red-400 shadow-[0_0_8px_#f87171]" />
              </div>
              <div className="space-y-3 flex-1 min-w-0">
                <div>
                  <span className="text-[10px] font-JakartaBold text-neutral-400 uppercase tracking-wider block">
                    Pickup Location
                  </span>
                  <p className="text-xs font-JakartaMedium text-white truncate">
                    {pickupAddress || 'Victoria Island, Lagos'}
                  </p>
                </div>
                <div>
                  <span className="text-[10px] font-JakartaBold text-neutral-400 uppercase tracking-wider block">
                    Drop-off Destination
                  </span>
                  <p className="text-xs font-JakartaMedium text-white truncate">
                    {destinationAddress || 'Murtala Muhammed Airport (LOS)'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Method Details */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-white/[0.03] border border-white/[0.08] text-xs">
            <div className="flex items-center gap-2">
              {paymentMethod === 'wallet' ? (
                <Wallet className="w-4 h-4 text-[#9EE6B5]" />
              ) : paymentMethod === 'card' ? (
                <CreditCard className="w-4 h-4 text-cyan-400" />
              ) : (
                <Banknote className="w-4 h-4 text-amber-400" />
              )}
              <span className="font-JakartaBold text-white uppercase tracking-wider">
                Payment: {paymentMethod}
              </span>
            </div>
            {paymentMethod === 'wallet' && (
              <span className={`text-[11px] font-JakartaBold ${isWalletInsufficient ? 'text-red-400' : 'text-[#9EE6B5]'}`}>
                Bal: ₦{walletBalance.toLocaleString()}
              </span>
            )}
          </div>

          {isWalletInsufficient && (
            <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-xs font-JakartaSemiBold text-red-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>Insufficient wallet balance. Please choose another payment method.</span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="p-4 border-t border-white/[0.08] flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 px-4 rounded-xl border border-white/10 hover:bg-white/[0.06] text-xs font-JakartaBold text-neutral-300 transition-colors"
          >
            Cancel
          </button>
          <button
            disabled={isWalletInsufficient}
            onClick={handleConfirm}
            className={`flex-1 py-3 px-4 rounded-xl text-xs font-JakartaBold flex items-center justify-center gap-2 transition-all shadow-lg active:scale-95 ${
              isWalletInsufficient
                ? 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
                : 'bg-[#9EE6B5] text-[#020408] hover:bg-[#8cd6a3] shadow-[0_0_20px_rgba(158,230,181,0.4)]'
            }`}
          >
            <span>Confirm & Request</span>
          </button>
        </div>
      </div>
    </div>
  );
};
