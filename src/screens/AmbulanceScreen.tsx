import React, { useState } from 'react';
import { useBroaderStore } from '../store/useBroaderStore';
import {
  ArrowLeft,
  HeartPulse,
  Phone,
  Clock,
  MapPin,
  ShieldAlert,
  AlertTriangle,
  Hospital,
  Activity,
  User,
  Sparkles,
} from 'lucide-react';
import { AmbulanceBooking } from '../types';
import { soundEngine } from '../services/soundNotification';

interface AmbulanceScreenProps {
  onClose?: () => void;
  isModal?: boolean;
}

export const AmbulanceScreen: React.FC<AmbulanceScreenProps> = ({ onClose, isModal = false }) => {
  const setScreen = useBroaderStore((s) => s.setScreen);
  const ambulanceBookings = useBroaderStore((s) => s.ambulanceBookings);
  const requestAmbulance = useBroaderStore((s) => s.requestAmbulance);
  const userAddress = useBroaderStore((s) => s.userAddress);

  const [activeTab, setActiveTab] = useState<'request' | 'active'>('request');
  const [patientCondition, setPatientCondition] = useState('Cardiac / Severe Chest Pain');
  const [ambulanceType, setAmbulanceType] = useState<'basic' | 'advanced' | 'icu'>('advanced');
  const [patientLocation, setPatientLocation] = useState(userAddress || '12 Adeola Hopewell, Victoria Island, Lagos');
  const [destinationHospital, setDestinationHospital] = useState('Reddington Hospital (Victoria Island)');
  const [patientName, setPatientName] = useState('Babatunde Adebayo');
  const [contactPhone, setContactPhone] = useState('+234 802 888 1234');
  const [emergencySuccess, setEmergencySuccess] = useState<string | null>(null);

  const ambulanceTiers = [
    {
      id: 'basic',
      name: 'Basic Life Support (BLS)',
      desc: 'Oxygen, AED, certified paramedic crew. Suitable for non-critical stabilization.',
      price: 35000,
    },
    {
      id: 'advanced',
      name: 'Advanced Life Support (ALS)',
      desc: 'ECG monitor, ventilator, IV lines, emergency physician onboard.',
      price: 65000,
    },
    {
      id: 'icu',
      name: 'Mobile Intensive Care Unit (MICU)',
      desc: 'Full portable ICU setup for critical cardiac, neurological, and trauma emergencies.',
      price: 110000,
    },
  ];

  const selectedTier = ambulanceTiers.find((t) => t.id === ambulanceType)!;

  const handleDispatch = (e: React.FormEvent) => {
    e.preventDefault();
    soundEngine.playDispatchAlert();

    const newBooking: AmbulanceBooking = {
      id: 'amb_lag_' + Date.now().toString().slice(-4),
      patientCondition,
      ambulanceType,
      patientLocation,
      destinationHospital,
      emergencyFare: selectedTier.price,
      etaMinutes: 6,
      status: 'dispatched',
      paramedic: {
        name: 'Dr. Chinedu Okafor (Lead ER Medic)',
        phone: '+234 809 111 9900',
        unitId: 'MED-UNIT 04 (Ford Transit MICU)',
      },
    };

    requestAmbulance(newBooking);
    setEmergencySuccess(`Ambulance dispatched! Paramedic unit on route (ETA: 6 mins). Reference: ${newBooking.id}`);
    setActiveTab('active');
  };

  const handleBack = () => {
    soundEngine.playClick();
    if (onClose) {
      onClose();
    } else {
      setScreen('home');
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#020408] text-white select-none relative overflow-hidden">
      {/* Header */}
      <div className="px-5 pt-4 pb-3.5 glass-nav border-b border-red-500/20 shrink-0 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={handleBack}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-neutral-300 hover:text-white transition-all active:scale-95"
            title="Go Back"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
              <h2 className="text-sm font-JakartaBold text-white leading-none">Broader MedDesk</h2>
            </div>
            <p className="text-[11px] text-red-400 font-JakartaSemiBold mt-0.5">Emergency Ambulance Dispatch</p>
          </div>
        </div>

        <a
          href="tel:112"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-600 hover:bg-red-500 text-white font-JakartaBold text-xs shadow-[0_0_15px_rgba(239,68,68,0.5)] transition-all"
        >
          <Phone className="w-3.5 h-3.5" />
          <span>Call 112 / 767</span>
        </a>
      </div>

      {/* Tabs */}
      <div className="px-4 pt-3 shrink-0">
        <div className="flex p-1 bg-white/[0.05] border border-white/[0.08] rounded-2xl text-xs font-JakartaBold">
          <button
            onClick={() => {
              soundEngine.playClick();
              setActiveTab('request');
            }}
            className={`flex-1 py-2 rounded-xl transition-all ${
              activeTab === 'request'
                ? 'bg-red-600 text-white shadow-[0_0_12px_rgba(239,68,68,0.4)]'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Emergency Dispatch
          </button>
          <button
            onClick={() => {
              soundEngine.playClick();
              setActiveTab('active');
            }}
            className={`flex-1 py-2 rounded-xl transition-all ${
              activeTab === 'active'
                ? 'bg-red-600 text-white shadow-[0_0_12px_rgba(239,68,68,0.4)]'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Active Medics ({ambulanceBookings.length})
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3.5 custom-scrollbar">
        {activeTab === 'request' ? (
          <form onSubmit={handleDispatch} className="space-y-3.5">
            {/* Quick condition selector */}
            <div className="glass-panel rounded-2xl border border-white/[0.08] p-4 space-y-2.5 text-xs">
              <div className="flex items-center gap-2 text-white font-JakartaBold">
                <HeartPulse className="w-4 h-4 text-red-400" />
                <span>Patient Situation & Triage</span>
              </div>

              <div className="grid grid-cols-2 gap-1.5">
                {[
                  'Cardiac / Severe Chest Pain',
                  'Difficulty Breathing / Asthma',
                  'Accident & Trauma Injury',
                  'Maternity / Active Labor',
                  'Stroke Symptoms / Paralysis',
                  'Non-Emergency Patient Transfer',
                ].map((situation) => (
                  <button
                    type="button"
                    key={situation}
                    onClick={() => {
                      soundEngine.playClick();
                      setPatientCondition(situation);
                    }}
                    className={`p-2.5 rounded-xl text-left text-[11px] font-JakartaSemiBold border transition-all ${
                      patientCondition === situation
                        ? 'bg-red-500/20 border-red-500 text-red-200 shadow-[0_0_10px_rgba(239,68,68,0.3)]'
                        : 'border-white/10 bg-white/[0.03] text-neutral-300 hover:border-white/20'
                    }`}
                  >
                    {situation}
                  </button>
                ))}
              </div>
            </div>

            {/* Ambulance Medical Tier */}
            <div className="glass-panel rounded-2xl border border-white/[0.08] p-4 space-y-2 text-xs">
              <span className="text-xs font-JakartaBold text-white block">Ambulance Medical Equipment Tier</span>

              <div className="space-y-1.5">
                {ambulanceTiers.map((tier) => (
                  <div
                    key={tier.id}
                    onClick={() => {
                      soundEngine.playClick();
                      setAmbulanceType(tier.id as any);
                    }}
                    className={`p-3 rounded-xl border cursor-pointer transition-all ${
                      ambulanceType === tier.id
                        ? 'bg-red-500/15 border-red-500/60 shadow-[0_0_12px_rgba(239,68,68,0.2)]'
                        : 'border-white/10 bg-white/[0.03] hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-JakartaBold text-white text-xs">{tier.name}</span>
                      <span className="font-JakartaBold text-red-400 text-xs">₦{tier.price.toLocaleString()}</span>
                    </div>
                    <p className="text-[10px] text-neutral-400 font-JakartaMedium mt-0.5">{tier.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Locations */}
            <div className="glass-panel rounded-2xl border border-white/[0.08] p-4 space-y-2.5 text-xs">
              <div>
                <label className="block text-[10px] font-JakartaSemiBold text-neutral-400 mb-1">
                  Patient Pickup Address in Lagos
                </label>
                <input
                  type="text"
                  required
                  value={patientLocation}
                  onChange={(e) => setPatientLocation(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-white/10 text-xs font-JakartaMedium text-white bg-white/[0.04] focus:outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-[10px] font-JakartaSemiBold text-neutral-400 mb-1">
                  Target Destination Hospital
                </label>
                <select
                  value={destinationHospital}
                  onChange={(e) => setDestinationHospital(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-white/10 text-xs font-JakartaMedium text-white bg-white/[0.05] focus:outline-none focus:border-red-500"
                >
                  <option className="bg-[#0a0f1d]" value="Reddington Hospital (Victoria Island)">Reddington Hospital (Victoria Island)</option>
                  <option className="bg-[#0a0f1d]" value="Lagoon Hospitals (Ikoyi & Ikeja)">Lagoon Hospitals (Ikoyi & Ikeja)</option>
                  <option className="bg-[#0a0f1d]" value="Lagos University Teaching Hospital (LUTH)">Lagos University Teaching Hospital (LUTH)</option>
                  <option className="bg-[#0a0f1d]" value="Epe General Hospital Emergency Unit">Epe General Hospital Emergency Unit</option>
                  <option className="bg-[#0a0f1d]" value="Evercare Hospital Lekki">Evercare Hospital Lekki</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-JakartaSemiBold text-neutral-400 mb-1">Patient Name</label>
                  <input
                    type="text"
                    required
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-white/10 text-xs font-JakartaMedium text-white bg-white/[0.04] focus:outline-none focus:border-red-500"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-JakartaSemiBold text-neutral-400 mb-1">Contact Phone</label>
                  <input
                    type="text"
                    required
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-white/10 text-xs font-JakartaBold text-white bg-white/[0.04] focus:outline-none focus:border-red-500"
                  />
                </div>
              </div>
            </div>

            {/* CTA */}
            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-red-600 hover:bg-red-500 active:scale-95 text-white font-JakartaBold text-xs shadow-[0_0_24px_rgba(239,68,68,0.5)] transition-all flex items-center justify-center gap-2"
            >
              <HeartPulse className="w-4 h-4 animate-pulse" />
              <span>Dispatch Emergency Ambulance Now (₦{selectedTier.price.toLocaleString()})</span>
            </button>
          </form>
        ) : (
          /* Active Medics Tab */
          <div className="space-y-3">
            {ambulanceBookings.map((b) => (
              <div
                key={b.id}
                className="glass-panel rounded-2xl border border-red-500/30 p-4 space-y-3"
              >
                <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
                  <div>
                    <span className="text-xs font-JakartaBold text-white">{b.id}</span>
                    <p className="text-[10px] text-neutral-400">{b.patientCondition}</p>
                  </div>
                  <span className="text-[10px] font-JakartaBold text-red-400 bg-red-500/15 border border-red-500/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
                    <span>ETA ~{b.etaMinutes} Mins</span>
                  </span>
                </div>

                <div className="space-y-1 text-xs">
                  <p className="text-neutral-400 text-[11px]">
                    <span className="text-white font-JakartaBold">Pickup:</span> {b.patientLocation}
                  </p>
                  <p className="text-neutral-400 text-[11px]">
                    <span className="text-white font-JakartaBold">Hospital:</span> {b.destinationHospital}
                  </p>
                </div>

                {b.paramedic && (
                  <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-between">
                    <div>
                      <p className="text-xs font-JakartaBold text-white">{b.paramedic.name}</p>
                      <p className="text-[10px] text-cyan-300">{b.paramedic.unitId}</p>
                    </div>
                    <a
                      href={`tel:${b.paramedic.phone}`}
                      className="px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-JakartaBold flex items-center gap-1"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>Call Medic</span>
                    </a>
                  </div>
                )}
              </div>
            ))}

            {ambulanceBookings.length === 0 && (
              <div className="py-16 text-center glass-panel rounded-2xl border border-white/[0.08] p-8">
                <HeartPulse className="w-8 h-8 text-neutral-500 mx-auto mb-2" />
                <h4 className="text-xs font-JakartaBold text-white">No Active Medical Dispatches</h4>
                <p className="text-[11px] text-neutral-400 mt-1">
                  Broader MedDesk provides rapid response ambulances across Lagos with certified paramedics.
                </p>
                <button
                  onClick={() => setActiveTab('request')}
                  className="mt-3 px-4 py-2 rounded-xl bg-red-600 text-white text-xs font-JakartaBold shadow-md"
                >
                  Dispatch Ambulance
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
