import React, { useState } from 'react';
import { ShieldAlert, Phone, AlertTriangle, X, CheckCircle2, Siren, Share2 } from 'lucide-react';

interface DriverSafetyModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeTripAddress?: string;
}

export const DriverSafetyModal: React.FC<DriverSafetyModalProps> = ({
  isOpen,
  onClose,
  activeTripAddress,
}) => {
  const [sosTriggered, setSosTriggered] = useState(false);
  const [shared, setShared] = useState(false);

  if (!isOpen) return null;

  const handleTriggerSOS = () => {
    setSosTriggered(true);
  };

  const handleShareLive = () => {
    setShared(true);
    setTimeout(() => setShared(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-sm glass-panel rounded-3xl p-5 shadow-2xl border border-white/15 space-y-4 animate-in slide-in-from-bottom-4 duration-200">
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-red-500/20 text-red-400 border border-red-500/30 flex items-center justify-center">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-JakartaBold text-white">Safety & Emergency Hub</h3>
              <p className="text-[11px] text-neutral-400 font-JakartaMedium">Broader Driver Protection</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-neutral-300 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {sosTriggered ? (
          <div className="p-4 bg-red-500/15 border border-red-500/30 rounded-2xl text-center space-y-2">
            <div className="w-12 h-12 mx-auto rounded-full bg-red-600 text-white flex items-center justify-center animate-bounce shadow-[0_0_16px_rgba(220,38,38,0.5)]">
              <Siren className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-JakartaBold text-red-300">Emergency Alert Transmitted</h4>
            <p className="text-xs text-red-200/90 leading-relaxed">
              Your live GPS telemetry and audio beacon have been dispatched to the <strong>Lagos State Command Centre (112)</strong> and the <strong>Broader Rapid Response Unit</strong>.
            </p>
            <div className="pt-2">
              <button
                onClick={() => setSosTriggered(false)}
                className="px-4 py-1.5 rounded-xl bg-red-600 text-white text-xs font-JakartaBold hover:bg-red-500 shadow-xs"
              >
                Dismiss Alert
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="p-3 bg-red-500/10 rounded-2xl border border-red-500/25 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-red-600 text-white flex items-center justify-center shrink-0 shadow-[0_0_10px_rgba(220,38,38,0.4)]">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-JakartaBold text-red-300">Emergency SOS Beacon</h4>
                  <p className="text-[10px] text-red-200/80 font-JakartaMedium">Silent trigger to Lagos 112 & LASEMA</p>
                </div>
              </div>
              <button
                onClick={handleTriggerSOS}
                className="px-3 py-1.5 rounded-xl bg-red-600 text-white text-xs font-JakartaBold hover:bg-red-500 shadow-sm active:scale-95 transition-all"
              >
                Send SOS
              </button>
            </div>

            <div className="space-y-2">
              <a
                href="tel:112"
                className="flex items-center justify-between p-3 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-white/10 text-white flex items-center justify-center">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-JakartaBold text-white">Call Lagos Emergency (112)</p>
                    <p className="text-[10px] text-neutral-400">Toll-free Police, Fire, LASEMA</p>
                  </div>
                </div>
                <span className="text-xs font-JakartaBold text-[#9EE6B5]">Call</span>
              </a>

              <a
                href="tel:+2348002762337"
                className="flex items-center justify-between p-3 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#9EE6B5] text-black flex items-center justify-center shadow-[0_0_8px_rgba(158,230,181,0.4)]">
                    <ShieldAlert className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-JakartaBold text-white">Broader 24/7 Security Patrol</p>
                    <p className="text-[10px] text-neutral-400">+234 800 BROADER (276 2337)</p>
                  </div>
                </div>
                <span className="text-xs font-JakartaBold text-[#9EE6B5]">Call</span>
              </a>

              <button
                onClick={handleShareLive}
                className="w-full flex items-center justify-between p-3 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 transition-colors"
              >
                <div className="flex items-center gap-2.5 text-left">
                  <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center shadow-[0_0_8px_rgba(16,185,129,0.4)]">
                    <Share2 className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-JakartaBold text-white">Share Live Driving Telemetry</p>
                    <p className="text-[10px] text-neutral-400">
                      {activeTripAddress ? `Current: ${activeTripAddress.split(',')[0]}` : 'Lekki & VI Patrol Sector'}
                    </p>
                  </div>
                </div>
                {shared ? (
                  <span className="text-xs font-JakartaBold text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Shared
                  </span>
                ) : (
                  <span className="text-xs font-JakartaBold text-neutral-300">Share</span>
                )}
              </button>
            </div>
          </div>
        )}

        <div className="pt-1">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl glass-panel hover:bg-white/10 text-neutral-300 text-xs font-JakartaBold border border-white/10 transition-colors"
          >
            Close Safety Hub
          </button>
        </div>
      </div>
    </div>
  );
};
