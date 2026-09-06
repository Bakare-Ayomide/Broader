import React, { useState } from 'react';
import { useBroaderStore } from '../store/useBroaderStore';
import {
  ArrowLeft,
  HeartPulse,
  Phone,
  ShieldAlert,
  MapPin,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  Activity,
} from 'lucide-react';
import { AmbulanceBooking } from '../types';

export const AmbulanceScreen: React.FC = () => {
  const setScreen = useBroaderStore((s) => s.setScreen);
  const ambulanceBookings = useBroaderStore((s) => s.ambulanceBookings);
  const requestAmbulance = useBroaderStore((s) => s.requestAmbulance);
  const userAddress = useBroaderStore((s) => s.userAddress);

  const [activeTab, setActiveTab] = useState<'request' | 'active'>('request');
  const [patientCondition, setPatientCondition] = useState('Severe Difficulty Breathing / Cardiac');
  const [ambulanceType, setAmbulanceType] = useState<'bls' | 'als' | 'nicu'>('als');
  const [pickupLocation, setPickupLocation] = useState(userAddress || '15 Admiralty Way, Lekki Phase 1, Lagos');
  const [destinationHospital, setDestinationHospital] = useState('Reddington Hospital, Victoria Island, Lagos');
  const [contactPhone, setContactPhone] = useState('+234 803 123 4567');
  const [emergencyAlertSent, setEmergencyAlertSent] = useState(false);

  const lagosHospitals = [
    'Reddington Hospital, Victoria Island, Lagos',
    'Lagos University Teaching Hospital (LUTH), Idi-Araba',
    'First Cardiology Consultants, Ikoyi, Lagos',
    'Lagoon Hospital, Ikeja, Lagos',
    'St. Nicholas Hospital, Lagos Island',
    'Evercare Hospital, Lekki Phase 1, Lagos',
  ];

  const ambulanceTiers = [
    {
      id: 'bls',
      name: 'Basic Life Support (BLS)',
      desc: 'EMT certified, medical oxygen, basic vitals & stretcher',
      price: 25000,
    },
    {
      id: 'als',
      name: 'Advanced Life Support (ALS)',
      desc: 'Intensive care, cardiac monitor, defibrillator & paramedic',
      price: 45000,
    },
    {
      id: 'nicu',
      name: 'Neonatal / Pediatric ICU',
      desc: 'Transport incubator, specialized pediatric respiratory kit',
      price: 60000,
    },
  ];

  const handleDispatch = (e: React.FormEvent) => {
    e.preventDefault();

    const selectedTier = ambulanceTiers.find((t) => t.id === ambulanceType)!;

    const newAmbulance: AmbulanceBooking = {
      id: 'amb_lag_' + Date.now().toString().slice(-4),
      patientCondition,
      ambulanceType,
      pickupLocation,
      destinationHospital,
      status: 'dispatched',
      etaMinutes: 6,
      paramedicName: 'Dr. Tunde Alabi (Senior Paramedic)',
      paramedicPhone: '+234 802 999 4433',
      vehiclePlate: 'MED-771-LG (Mercedes Sprinter ICU)',
      cost: selectedTier.price,
    };

    requestAmbulance(newAmbulance);
    setEmergencyAlertSent(true);
    setActiveTab('active');
  };

  return (
    <div className="flex flex-col h-full bg-[#F6F8FA] select-none">
      {/* Calm & Urgent Header */}
      <div className="px-5 pt-4 pb-3 bg-white border-b border-red-200 shrink-0 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setScreen('home')}
            className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 hover:bg-slate-200"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping" />
              <h2 className="text-base font-JakartaBold text-slate-900 leading-none">Broader MedDesk</h2>
            </div>
            <p className="text-[11px] text-red-600 font-JakartaSemiBold mt-0.5">Emergency Ambulance Dispatch</p>
          </div>
        </div>

        <a
          href="tel:112"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-600 text-white font-JakartaBold text-xs shadow-md shadow-red-600/30 hover:bg-red-700 transition-all"
        >
          <Phone className="w-3.5 h-3.5" />
          <span>Call 112 / 767</span>
        </a>
      </div>

      {/* Tabs */}
      <div className="px-4 pt-3 shrink-0">
        <div className="flex p-1 bg-slate-200/70 rounded-xl text-xs font-JakartaBold">
          <button
            onClick={() => setActiveTab('request')}
            className={`flex-1 py-1.5 rounded-lg transition-all ${
              activeTab === 'request' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
            }`}
          >
            Emergency Dispatch
          </button>
          <button
            onClick={() => setActiveTab('active')}
            className={`flex-1 py-1.5 rounded-lg transition-all ${
              activeTab === 'active' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
            }`}
          >
            Active Medics ({ambulanceBookings.length})
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {activeTab === 'request' ? (
          <form onSubmit={handleDispatch} className="space-y-3">
            {/* Quick condition selector */}
            <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-2.5 text-xs">
              <div className="flex items-center gap-1.5 text-slate-900 font-JakartaBold">
                <HeartPulse className="w-4 h-4 text-red-600" />
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
                    onClick={() => setPatientCondition(situation)}
                    className={`p-2 rounded-xl text-left text-[11px] font-JakartaSemiBold border transition-all ${
                      patientCondition === situation
                        ? 'bg-red-50 border-red-400 text-red-800'
                        : 'border-slate-200 text-slate-600'
                    }`}
                  >
                    {situation}
                  </button>
                ))}
              </div>
            </div>

            {/* Ambulance Medical Tier */}
            <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-2 text-xs">
              <span className="text-xs font-JakartaBold text-slate-900 block">Ambulance Medical Equipment Tier</span>

              <div className="space-y-1.5">
                {ambulanceTiers.map((tier) => (
                  <div
                    key={tier.id}
                    onClick={() => setAmbulanceType(tier.id as any)}
                    className={`p-3 rounded-xl border cursor-pointer transition-all ${
                      ambulanceType === tier.id
                        ? 'bg-red-50/70 border-red-400'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-JakartaBold text-slate-900 text-xs">{tier.name}</span>
                      <span className="font-JakartaBold text-red-600 text-xs">₦{tier.price.toLocaleString()}</span>
                    </div>
                    <p className="text-[10px] text-slate-500 font-JakartaMedium mt-0.5">{tier.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Locations */}
            <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-2.5 text-xs">
              <div>
                <label className="block text-[11px] font-JakartaSemiBold text-slate-500 mb-1">
                  Patient Pickup Address in Lagos
                </label>
                <input
                  type="text"
                  required
                  value={pickupLocation}
                  onChange={(e) => setPickupLocation(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-JakartaMedium text-slate-800 bg-[#F6F8FA]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-JakartaSemiBold text-slate-500 mb-1">
                  Destination Emergency Center / Hospital
                </label>
                <select
                  value={destinationHospital}
                  onChange={(e) => setDestinationHospital(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-JakartaMedium text-slate-800 bg-[#F6F8FA]"
                >
                  {lagosHospitals.map((hosp) => (
                    <option key={hosp} value={hosp}>
                      {hosp}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-JakartaSemiBold text-slate-500 mb-1">
                  Emergency Contact Phone (+234)
                </label>
                <input
                  type="tel"
                  required
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-JakartaBold text-slate-800 bg-[#F6F8FA]"
                />
              </div>
            </div>

            {/* Emergency Action */}
            <button
              type="submit"
              className="w-full py-4 rounded-full bg-red-600 hover:bg-red-700 text-white font-JakartaBold text-sm shadow-lg shadow-red-600/30 flex items-center justify-center gap-2 transition-all active:scale-[0.99]"
            >
              <HeartPulse className="w-5 h-5 animate-pulse" />
              <span>DISPATCH EMERGENCY AMBULANCE NOW</span>
            </button>
          </form>
        ) : (
          /* Active Ambulance Dispatches */
          <div className="space-y-3">
            {ambulanceBookings.length > 0 ? (
              ambulanceBookings.map((amb) => (
                <div key={amb.id} className="bg-white rounded-2xl border border-red-200 p-4 shadow-sm space-y-3 text-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping" />
                      <span className="font-mono font-bold text-red-700">{amb.id}</span>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full bg-red-50 text-red-700 font-JakartaBold text-[10px] uppercase border border-red-200">
                      ETA: ~{amb.etaMinutes} Minutes
                    </span>
                  </div>

                  <div className="bg-red-50/60 p-3 rounded-xl border border-red-100 space-y-1 text-[11px]">
                    <p className="font-JakartaBold text-red-900">{amb.patientCondition}</p>
                    <p className="text-slate-600 font-JakartaMedium">En route to: {amb.destinationHospital}</p>
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                    <div>
                      <p className="font-JakartaBold text-slate-900">{amb.paramedicName}</p>
                      <p className="text-[10px] text-slate-400 font-JakartaMedium">{amb.vehiclePlate}</p>
                    </div>
                    <a
                      href={`tel:${amb.paramedicPhone}`}
                      className="px-3 py-1.5 rounded-full bg-red-600 text-white text-xs font-JakartaBold flex items-center gap-1 shadow-xs"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>Call Medic</span>
                    </a>
                  </div>

                  <div className="flex justify-between items-center pt-1 border-t border-slate-100 text-[11px]">
                    <span className="text-slate-400">Fixed Fee Guarantee</span>
                    <span className="font-JakartaBold text-red-600">₦{amb.cost.toLocaleString()}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-16 text-center">
                <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 mx-auto mb-3">
                  <HeartPulse className="w-7 h-7 text-red-400" />
                </div>
                <h4 className="text-sm font-JakartaBold text-slate-800">No Active Medical Dispatches</h4>
                <p className="text-xs text-slate-400 font-JakartaMedium mt-1">
                  Broader MedDesk provides 24/7 rapid ambulance dispatch across Lagos.
                </p>
                <button
                  onClick={() => setActiveTab('request')}
                  className="mt-4 px-4 py-2 rounded-full bg-red-600 text-white text-xs font-JakartaBold"
                >
                  Book Ambulance
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
