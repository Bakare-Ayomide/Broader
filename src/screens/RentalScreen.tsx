import React, { useState } from 'react';
import { useBroaderStore } from '../store/useBroaderStore';
import {
  ArrowLeft,
  Key,
  Calendar,
  ShieldCheck,
  Fuel,
  Users,
  CheckCircle2,
  Car,
  ChevronRight,
  Sparkles,
  X,
} from 'lucide-react';
import { RENTAL_VEHICLE_FLEET } from '../services/backendService';
import { RentalBooking } from '../types';
import { soundEngine } from '../services/soundNotification';

interface RentalScreenProps {
  onClose?: () => void;
  isModal?: boolean;
}

export const RentalScreen: React.FC<RentalScreenProps> = ({ onClose, isModal = false }) => {
  const setScreen = useBroaderStore((s) => s.setScreen);
  const rentals = useBroaderStore((s) => s.rentals);
  const bookRental = useBroaderStore((s) => s.bookRental);

  const [activeTab, setActiveTab] = useState<'browse' | 'my_rentals'>('browse');
  const [selectedRentalVehicle, setSelectedRentalVehicle] = useState<any | null>(null);
  const [rentalDays, setRentalDays] = useState(2);
  const [withDriver, setWithDriver] = useState(true);
  const [pickupHub, setPickupHub] = useState('Lekki Phase 1 Hub (Admiralty Way)');
  const [bookingSuccess, setBookingSuccess] = useState<string | null>(null);

  const lagosHubs = [
    'Lekki Phase 1 Hub (Admiralty Way)',
    'Victoria Island Hub (Ahmadu Bello)',
    'Ikeja GRA Executive Lounge',
    'Murtala Muhammed Int. Airport T2 Terminal',
  ];

  const handleConfirmBooking = () => {
    if (!selectedRentalVehicle) return;
    soundEngine.playSuccess();

    const totalCost = (selectedRentalVehicle.dailyRate + (withDriver ? 10000 : 0)) * rentalDays;

    const newBooking: RentalBooking = {
      id: 'rnt_ng_' + Date.now().toString().slice(-4),
      vehicleModel: selectedRentalVehicle.name,
      dailyRate: selectedRentalVehicle.dailyRate,
      days: rentalDays,
      totalFare: totalCost,
      withDriver,
      pickupLocation: pickupHub,
      pickupDate: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
      status: 'confirmed',
    };

    bookRental(newBooking);
    setSelectedRentalVehicle(null);
    setBookingSuccess(`Rental confirmed! Booking reference: ${newBooking.id}`);
    setActiveTab('my_rentals');
    setTimeout(() => setBookingSuccess(null), 5000);
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
      <div className="px-5 pt-4 pb-3.5 glass-nav border-b border-white/[0.08] shrink-0 flex items-center justify-between">
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
              <Key className="w-3.5 h-3.5 text-[#9EE6B5]" />
              <h2 className="text-sm font-JakartaBold text-white leading-none">Vehicle Rentals & Chauffeur</h2>
            </div>
            <p className="text-[11px] text-neutral-400 font-JakartaMedium mt-0.5">
              Executive SUVs, Sedans & Self-Drive in Lagos
            </p>
          </div>
        </div>

        <span className="text-[10px] font-JakartaBold text-[#9EE6B5] bg-[#9EE6B5]/10 border border-[#9EE6B5]/25 px-2.5 py-1 rounded-full flex items-center gap-1">
          <ShieldCheck className="w-3 h-3 text-[#9EE6B5]" />
          <span>Full Insurance</span>
        </span>
      </div>

      {/* Tabs */}
      <div className="px-4 pt-3 shrink-0">
        <div className="flex p-1 bg-white/[0.05] border border-white/[0.08] rounded-2xl text-xs font-JakartaBold">
          <button
            onClick={() => {
              soundEngine.playClick();
              setActiveTab('browse');
            }}
            className={`flex-1 py-2 rounded-xl transition-all ${
              activeTab === 'browse'
                ? 'bg-[#9EE6B5] text-black font-extrabold shadow-[0_0_12px_rgba(158,230,181,0.4)]'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Available Fleet
          </button>
          <button
            onClick={() => {
              soundEngine.playClick();
              setActiveTab('my_rentals');
            }}
            className={`flex-1 py-2 rounded-xl transition-all ${
              activeTab === 'my_rentals'
                ? 'bg-[#9EE6B5] text-black font-extrabold shadow-[0_0_12px_rgba(158,230,181,0.4)]'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            My Bookings ({rentals.length})
          </button>
        </div>
      </div>

      {bookingSuccess && (
        <div className="mx-4 mt-3 p-3 bg-emerald-500/15 border border-emerald-500/30 rounded-2xl flex items-center gap-2 text-xs text-emerald-300 font-JakartaMedium animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{bookingSuccess}</span>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3.5 custom-scrollbar">
        {activeTab === 'browse' ? (
          <>
            {/* Rental Configurator Bar */}
            <div className="glass-panel rounded-2xl border border-white/[0.08] p-3.5 space-y-2.5 text-xs">
              <div>
                <label className="block text-[10px] font-JakartaSemiBold text-neutral-400 mb-1">
                  Pickup & Drop-off Hub in Lagos
                </label>
                <select
                  value={pickupHub}
                  onChange={(e) => setPickupHub(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-white/10 font-JakartaMedium text-white bg-white/[0.05] focus:outline-none focus:border-[#9EE6B5]"
                >
                  {lagosHubs.map((hub) => (
                    <option key={hub} value={hub} className="bg-[#0a0f1d]">
                      {hub}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-JakartaSemiBold text-neutral-400 mb-1">
                    Rental Duration
                  </label>
                  <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl border border-white/10 bg-white/[0.04]">
                    <button
                      type="button"
                      onClick={() => {
                        soundEngine.playClick();
                        setRentalDays(Math.max(1, rentalDays - 1));
                      }}
                      className="w-6 h-6 rounded-lg bg-white/10 text-white font-bold hover:bg-white/20 flex items-center justify-center transition-all"
                    >
                      -
                    </button>
                    <span className="flex-1 text-center font-JakartaBold text-white text-xs">
                      {rentalDays} {rentalDays === 1 ? 'Day' : 'Days'}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        soundEngine.playClick();
                        setRentalDays(rentalDays + 1);
                      }}
                      className="w-6 h-6 rounded-lg bg-white/10 text-white font-bold hover:bg-white/20 flex items-center justify-center transition-all"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-JakartaSemiBold text-neutral-400 mb-1">
                    Driver Option
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      soundEngine.playClick();
                      setWithDriver(!withDriver);
                    }}
                    className={`w-full py-2 px-2 rounded-xl border font-JakartaBold text-xs text-center transition-all ${
                      withDriver
                        ? 'bg-[#9EE6B5]/15 border-[#9EE6B5] text-[#9EE6B5]'
                        : 'bg-white/[0.04] border-white/10 text-neutral-400 hover:text-white'
                    }`}
                  >
                    {withDriver ? 'With Chauffeur' : 'Self-Drive'}
                  </button>
                </div>
              </div>
            </div>

            {/* Fleet List */}
            <div className="space-y-3">
              {RENTAL_VEHICLE_FLEET.map((vehicle) => {
                const totalCost = (vehicle.dailyRate + (withDriver ? 10000 : 0)) * rentalDays;
                return (
                  <div
                    key={vehicle.id}
                    className="glass-panel rounded-2xl border border-white/[0.08] overflow-hidden hover:border-white/20 transition-all"
                  >
                    <div className="p-3.5 flex gap-3">
                      <img
                        src={vehicle.image}
                        alt={vehicle.name}
                        className="w-24 h-20 rounded-xl object-contain p-1 border border-white/10 shrink-0 bg-black/40 filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.6)]"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-JakartaBold text-white truncate">
                            {vehicle.name}
                          </h4>
                          <span className="text-[10px] font-JakartaBold text-[#9EE6B5] bg-[#9EE6B5]/10 border border-[#9EE6B5]/20 px-1.5 py-0.5 rounded capitalize">
                            {vehicle.type}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-[10px] text-neutral-400 font-JakartaMedium mt-1">
                          <span className="flex items-center gap-1">
                            <Users className="w-3 h-3 text-neutral-500" />
                            {vehicle.seats} seats
                          </span>
                          <span>•</span>
                          <span>{vehicle.transmission}</span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Fuel className="w-3 h-3 text-neutral-500" />
                            {vehicle.fuelPolicy}
                          </span>
                        </div>

                        <div className="flex items-baseline justify-between mt-2 pt-2 border-t border-white/[0.06]">
                          <div>
                            <span className="text-sm font-JakartaBold text-white">
                              ₦{vehicle.dailyRate.toLocaleString()}
                            </span>
                            <span className="text-[10px] text-neutral-400 font-JakartaMedium"> / day</span>
                          </div>

                          <button
                            type="button"
                            onClick={() => {
                              soundEngine.playClick();
                              setSelectedRentalVehicle(vehicle);
                            }}
                            className="px-3.5 py-1.5 rounded-xl bg-[#9EE6B5] hover:bg-[#8fd8a6] text-black text-xs font-extrabold font-JakartaBold transition-all shadow-[0_0_12px_rgba(158,230,181,0.4)]"
                          >
                            Book Vehicle
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          /* My Bookings Tab */
          <div className="space-y-3">
            {rentals.length > 0 ? (
              rentals.map((item) => (
                <div key={item.id} className="glass-panel rounded-2xl border border-white/[0.08] p-4 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-[#9EE6B5]">{item.id}</span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 font-JakartaBold text-[10px] uppercase border border-emerald-500/25">
                      {item.status}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-sm font-JakartaBold text-white">{item.vehicleModel}</h4>
                    <p className="text-[11px] text-neutral-400 font-JakartaMedium">{item.pickupLocation}</p>
                  </div>

                  <div className="flex justify-between py-1.5 border-t border-b border-white/[0.06] text-[11px]">
                    <span className="text-neutral-400">Pick-up Date</span>
                    <span className="font-JakartaBold text-white">{item.pickupDate}</span>
                  </div>

                  <div className="flex justify-between items-baseline pt-1">
                    <span className="text-neutral-400 text-[11px]">
                      {item.withDriver ? 'Chauffeur Included' : 'Self-Drive'}
                    </span>
                    <span className="text-sm font-JakartaBold text-[#9EE6B5]">
                      ₦{item.totalFare.toLocaleString()}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-16 text-center glass-panel rounded-2xl border border-white/[0.08] p-8">
                <div className="w-14 h-14 rounded-2xl bg-white/[0.05] border border-white/10 flex items-center justify-center text-neutral-400 mx-auto mb-3">
                  <Key className="w-7 h-7 text-neutral-400" />
                </div>
                <h4 className="text-sm font-JakartaBold text-white">No Active Rentals</h4>
                <p className="text-xs text-neutral-400 font-JakartaMedium mt-1">
                  Book executive cars and SUVs across Lagos with Broader.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    soundEngine.playClick();
                    setActiveTab('browse');
                  }}
                  className="mt-4 px-4 py-2 rounded-xl bg-[#9EE6B5] text-black font-extrabold text-xs shadow-[0_0_14px_rgba(158,230,181,0.4)]"
                >
                  Browse Fleet
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Booking Confirmation Bottom Sheet / Modal */}
      {selectedRentalVehicle && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-md">
          <div className="glass-panel w-full max-w-sm rounded-3xl p-5 shadow-2xl border border-white/15 text-white animate-in zoom-in-95">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-base font-JakartaBold text-white">Rental Summary</h4>
              <button
                onClick={() => setSelectedRentalVehicle(null)}
                className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-neutral-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center gap-3 p-3 bg-white/[0.04] rounded-2xl border border-white/10 mb-3">
              <img
                src={selectedRentalVehicle.image}
                alt={selectedRentalVehicle.name}
                className="w-16 h-12 rounded-xl object-contain p-1 bg-black/40"
              />
              <div>
                <h5 className="font-JakartaBold text-xs text-white">{selectedRentalVehicle.name}</h5>
                <p className="text-[11px] text-neutral-400 font-JakartaMedium">
                  {selectedRentalVehicle.seats} seats • {selectedRentalVehicle.transmission}
                </p>
              </div>
            </div>

            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between py-1 border-b border-white/[0.06]">
                <span className="text-neutral-400 font-JakartaMedium">Duration</span>
                <span className="font-JakartaBold text-white">{rentalDays} Days</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/[0.06]">
                <span className="text-neutral-400 font-JakartaMedium">Base Rental (₦{selectedRentalVehicle.dailyRate.toLocaleString()} × {rentalDays})</span>
                <span className="font-JakartaBold text-white">
                  ₦{(selectedRentalVehicle.dailyRate * rentalDays).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/[0.06]">
                <span className="text-neutral-400 font-JakartaMedium">Chauffeur Service</span>
                <span className="font-JakartaBold text-white">
                  {withDriver ? `₦${(10000 * rentalDays).toLocaleString()}` : 'None (Self-Drive)'}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/[0.06]">
                <span className="text-neutral-400 font-JakartaMedium">Refundable Security Deposit</span>
                <span className="font-JakartaBold text-[#9EE6B5]">₦50,000</span>
              </div>
              <div className="flex justify-between pt-1 font-JakartaBold text-sm text-white">
                <span>Total Due Now</span>
                <span className="text-[#9EE6B5]">
                  ₦{((selectedRentalVehicle.dailyRate + (withDriver ? 10000 : 0)) * rentalDays).toLocaleString()}
                </span>
              </div>
            </div>

            <div className="mt-4 space-y-2">
              <button
                type="button"
                onClick={handleConfirmBooking}
                className="w-full py-3.5 rounded-2xl bg-[#9EE6B5] hover:bg-[#8fd8a6] text-black font-extrabold font-JakartaBold text-xs shadow-[0_0_18px_rgba(158,230,181,0.4)] transition-all"
              >
                Confirm & Pay via Broader Wallet
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
