import React, { useState } from 'react';
import { AlertTriangle, X, Check } from 'lucide-react';
import { soundEngine } from '../../services/soundNotification';

interface CancelRideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmCancel: (reason: string) => void;
  driverName?: string;
}

const CANCEL_REASONS = [
  'Changed my mind / plans changed',
  'Driver is taking too long to arrive',
  'Incorrect pickup or drop-off location',
  'Driver requested offline payment or extra fee',
  'Vehicle does not match description',
  'Found alternative transport',
];

export const CancelRideModal: React.FC<CancelRideModalProps> = ({
  isOpen,
  onClose,
  onConfirmCancel,
  driverName = 'Driver',
}) => {
  const [selectedReason, setSelectedReason] = useState(CANCEL_REASONS[0]);

  if (!isOpen) return null;

  const handleConfirm = () => {
    soundEngine.playClick();
    onConfirmCancel(selectedReason);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md select-none animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-[#0c1420]/95 backdrop-blur-2xl rounded-3xl border border-white/15 shadow-[0_25px_60px_rgba(0,0,0,0.95)] overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-5 py-4 border-b border-white/[0.08] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-red-500/15 text-red-400 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-JakartaBold text-white leading-tight">
                Cancel Current Ride?
              </h3>
              <p className="text-[11px] font-JakartaMedium text-neutral-400">
                {driverName} is already on the way
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
        <div className="p-5 space-y-3">
          <p className="text-xs font-JakartaMedium text-neutral-300">
            Please tell us why you wish to cancel this trip to help improve service reliability:
          </p>

          <div className="space-y-2">
            {CANCEL_REASONS.map((reason, idx) => {
              const isSelected = selectedReason === reason;
              return (
                <div
                  key={idx}
                  onClick={() => setSelectedReason(reason)}
                  className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all text-xs font-JakartaMedium ${
                    isSelected
                      ? 'bg-red-500/15 border-red-500/40 text-white'
                      : 'bg-[#131b26]/70 border-white/[0.06] text-neutral-300 hover:bg-white/[0.04]'
                  }`}
                >
                  <span>{reason}</span>
                  <div
                    className={`w-4 h-4 rounded-full flex items-center justify-center border ${
                      isSelected
                        ? 'bg-red-500 border-red-400 text-white'
                        : 'border-white/20 bg-transparent'
                    }`}
                  >
                    {isSelected && <Check className="w-2.5 h-2.5" />}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-4 border-t border-white/[0.08] flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 px-4 rounded-xl border border-white/10 hover:bg-white/[0.06] text-xs font-JakartaBold text-neutral-300 transition-colors"
          >
            Keep My Ride
          </button>
          <button
            onClick={handleConfirm}
            className="flex-1 py-3 px-4 rounded-xl bg-red-500/90 hover:bg-red-600 text-white text-xs font-JakartaBold transition-all shadow-[0_0_15px_rgba(239,68,68,0.4)] active:scale-95"
          >
            Cancel Trip
          </button>
        </div>
      </div>
    </div>
  );
};
