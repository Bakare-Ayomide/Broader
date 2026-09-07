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
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-sm bg-white rounded-3xl p-5 shadow-2xl border border-slate-200 space-y-4 animate-in slide-in-from-bottom-4 duration-200">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-JakartaBold text-slate-900">Safety & Emergency Hub</h3>
              <p className="text-[11px] text-slate-400 font-JakartaMedium">Broader Driver Protection</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {sosTriggered ? (
          <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-center space-y-2">
            <div className="w-12 h-12 mx-auto rounded-full bg-red-600 text-white flex items-center justify-center animate-bounce">
              <Siren className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-JakartaBold text-red-900">Emergency Alert Transmitted</h4>
            <p className="text-xs text-red-700 leading-relaxed">
              Your live GPS telemetry and audio beacon have been dispatched to the <strong>Lagos State Command Centre (112)</strong> and the <strong>Broader Rapid Response Unit</strong>.
            </p>
            <div className="pt-2">
              <button
                onClick={() => setSosTriggered(false)}
                className="px-4 py-1.5 rounded-xl bg-red-600 text-white text-xs font-JakartaBold hover:bg-red-700"
              >
                Dismiss Alert
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="p-3 bg-red-50/70 rounded-2xl border border-red-100 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-red-600 text-white flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-JakartaBold text-red-900">Emergency SOS Beacon</h4>
                  <p className="text-[10px] text-red-700 font-JakartaMedium">Silent trigger to Lagos 112 & LASEMA</p>
                </div>
              </div>
              <button
                onClick={handleTriggerSOS}
                className="px-3 py-1.5 rounded-xl bg-red-600 text-white text-xs font-JakartaBold hover:bg-red-700 shadow-sm active:scale-95 transition-all"
              >
                Send SOS
              </button>
            </div>

            <div className="space-y-2">
              <a
                href="tel:112"
                className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-JakartaBold text-slate-800">Call Lagos Emergency (112)</p>
                    <p className="text-[10px] text-slate-400">Toll-free Police, Fire, LASEMA</p>
                  </div>
                </div>
                <span className="text-xs font-JakartaBold text-[#0286FF]">Call</span>
              </a>

              <a
                href="tel:+2348002762337"
                className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center">
                    <ShieldAlert className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-JakartaBold text-slate-800">Broader 24/7 Security Patrol</p>
                    <p className="text-[10px] text-slate-400">+234 800 BROADER (276 2337)</p>
                  </div>
                </div>
                <span className="text-xs font-JakartaBold text-[#0286FF]">Call</span>
              </a>

              <button
                onClick={handleShareLive}
                className="w-full flex items-center justify-between p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors"
              >
                <div className="flex items-center gap-2.5 text-left">
                  <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center">
                    <Share2 className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-JakartaBold text-slate-800">Share Live Driving Telemetry</p>
                    <p className="text-[10px] text-slate-400">
                      {activeTripAddress ? `Current: ${activeTripAddress.split(',')[0]}` : 'Lekki & VI Patrol Sector'}
                    </p>
                  </div>
                </div>
                {shared ? (
                  <span className="text-xs font-JakartaBold text-emerald-600 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Shared
                  </span>
                ) : (
                  <span className="text-xs font-JakartaBold text-slate-700">Share</span>
                )}
              </button>
            </div>
          </div>
        )}

        <div className="pt-1">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-JakartaBold transition-colors"
          >
            Close Safety Hub
          </button>
        </div>
      </div>
    </div>
  );
};
