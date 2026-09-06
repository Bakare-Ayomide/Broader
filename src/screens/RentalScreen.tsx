import React, { useState } from 'react';
import { useBroaderStore } from '../store/useBroaderStore';
import {
  ArrowLeft,
  Calendar,
  Clock,
  Car,
  ShieldCheck,
  CheckCircle2,
  MapPin,
  Users,
  Fuel,
  Key,
  ChevronRight,
  Filter,
} from 'lucide-react';
import { RENTAL_VEHICLE_FLEET } from '../services/backendService';
import { RentalBooking } from '../types';

export const RentalScreen: React.FC = () => {
  const setScreen = useBroaderStore((s) => s.setScreen);
  const rentals = useBroaderStore((s) => s.rentals);
  const bookRental = useBroaderStore((s) => s.bookRental);
  const walletBalance = useBroaderStore((s) => s.walletBalance);

  const [activeTab, setActiveTab] = useState<'browse' | 'my_rentals'>('browse');
  const [selectedRentalVehicle, setSelectedRentalVehicle] = useState<typeof RENTAL_VEHICLE_FLEET[0] | null>(null);
  const [rentalDays, setRentalDays] = useState(2);
  const [withDriver, setWithDriver] = useState(true);
  const [pickupHub, setPickupHub] = useState('Murtala Muhammed Int’l Airport (MMA2), Ikeja');
  const [startDate, setStartDate] = useState('Tomorrow, 09:00 AM');
  const [bookingSuccess, setBookingSuccess] = useState<string | null>(null);

  const lagosHubs = [
    'Murtala Muhammed Int’l Airport (MMA2), Ikeja',
    'Victoria Island Hub (Adeola Odeku)',
    'Lekki Phase 1 Hub (Admiralty Way)',
    'Ikeja GRA Business Hub',
  ];

  const handleConfirmBooking = () => {
    if (!selectedRentalVehicle) return;
    const baseDaily = selectedRentalVehicle.dailyRate;
    const driverFeePerDay = withDriver ? 10000 : 0;
    const totalFare = (baseDaily + driverFeePerDay) * rentalDays;

    const newBooking: RentalBooking = {
      id: 'rnt_lag_' + Date.now().toString().slice(-4),
      vehicleModel: selectedRentalVehicle.name,
      vehicleType: selectedRentalVehicle.type,
      pickupDate: startDate,
      returnDate: `${rentalDays} days later`,
      withDriver,
      totalFare,
      status: 'confirmed',
      pickupLocation: pickupHub,
      depositAmount: 50000,
    };

    bookRental(newBooking);
    setSelectedRentalVehicle(null);
    setBookingSuccess(`Rental confirmed for ${newBooking.vehicleModel}! Total: ₦${totalFare.toLocaleString()}`);
    setActiveTab('my_rentals');
    setTimeout(() => setBookingSuccess(null), 5000);
  };

  return (
    <div className="flex flex-col h-full bg-[#F6F8FA] select-none">
      {/* Top Header */}
      <div className="px-5 pt-4 pb-3 bg-white border-b border-slate-200 shrink-0 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setScreen('home')}
            className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 hover:bg-slate-200"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h2 className="text-base font-JakartaBold text-slate-900 leading-none">Broader Car Rentals</h2>
            <p className="text-[11px] text-slate-400 font-JakartaMedium mt-0.5">Self-drive & Chauffeur Services</p>
          </div>
        </div>

        <span className="text-xs font-JakartaBold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-full">
          Lagos Fleet
        </span>
      </div>

      {/* Tabs */}
      <div className="px-4 pt-3 shrink-0">
        <div className="flex p-1 bg-slate-200/70 rounded-xl text-xs font-JakartaBold">
          <button
            onClick={() => setActiveTab('browse')}
            className={`flex-1 py-1.5 rounded-lg transition-all ${
              activeTab === 'browse' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
            }`}
          >
            Browse Fleet ({RENTAL_VEHICLE_FLEET.length})
          </button>
          <button
            onClick={() => setActiveTab('my_rentals')}
            className={`flex-1 py-1.5 rounded-lg transition-all ${
              activeTab === 'my_rentals' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
            }`}
          >
            My Bookings ({rentals.length})
          </button>
        </div>
      </div>

      {bookingSuccess && (
        <div className="mx-4 mt-3 p-3 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-2 text-xs text-emerald-800 font-JakartaMedium animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{bookingSuccess}</span>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {activeTab === 'browse' ? (
          <>
            {/* Rental Configurator Bar */}
            <div className="bg-white rounded-2xl border border-slate-200 p-3.5 shadow-xs space-y-2.5 text-xs">
              <div>
                <label className="block text-[11px] font-JakartaSemiBold text-slate-500 mb-1">
                  Pickup & Drop-off Hub in Lagos
                </label>
                <select
                  value={pickupHub}
                  onChange={(e) => setPickupHub(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 font-JakartaMedium text-slate-800 bg-[#F6F8FA] focus:outline-none focus:border-[#0286FF]"
                >
                  {lagosHubs.map((hub) => (
                    <option key={hub} value={hub}>
                      {hub}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-JakartaSemiBold text-slate-500 mb-1">
                    Rental Duration
                  </label>
                  <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl border border-slate-200 bg-[#F6F8FA]">
                    <button
                      onClick={() => setRentalDays(Math.max(1, rentalDays - 1))}
                      className="w-6 h-6 rounded-lg bg-white text-slate-700 font-bold shadow-xs flex items-center justify-center"
                    >
                      -
                    </button>
                    <span className="flex-1 text-center font-JakartaBold text-slate-900">
                      {rentalDays} {rentalDays === 1 ? 'Day' : 'Days'}
                    </span>
                    <button
                      onClick={() => setRentalDays(rentalDays + 1)}
                      className="w-6 h-6 rounded-lg bg-white text-slate-700 font-bold shadow-xs flex items-center justify-center"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-JakartaSemiBold text-slate-500 mb-1">
                    Driver Option
                  </label>
                  <button
                    onClick={() => setWithDriver(!withDriver)}
                    className={`w-full py-2 px-2 rounded-xl border font-JakartaBold text-center transition-all ${
                      withDriver
                        ? 'bg-blue-50 border-[#0286FF] text-[#0286FF]'
                        : 'bg-[#F6F8FA] border-slate-200 text-slate-600'
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
                    className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:border-blue-300 transition-all"
                  >
                    <div className="p-3.5 flex gap-3">
                      <img
                        src={vehicle.image}
                        alt={vehicle.name}
                        className="w-24 h-20 rounded-xl object-cover border border-slate-100 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-JakartaBold text-slate-900 truncate">
                            {vehicle.name}
                          </h4>
                          <span className="text-[10px] font-JakartaBold text-[#0286FF] bg-blue-50 px-1.5 py-0.5 rounded capitalize">
                            {vehicle.type}
                          </span>
                        </div>

                        <div className="flex items-center gap-3 text-[10px] text-slate-500 font-JakartaMedium mt-1">
                          <span className="flex items-center gap-1">
                            <Users className="w-3 h-3 text-slate-400" />
                            {vehicle.seats} seats
                          </span>
                          <span>•</span>
                          <span>{vehicle.transmission}</span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Fuel className="w-3 h-3 text-slate-400" />
                            {vehicle.fuelPolicy}
                          </span>
                        </div>

                        <div className="flex items-baseline justify-between mt-2 pt-2 border-t border-slate-100">
                          <div>
                            <span className="text-sm font-JakartaBold text-slate-900">
                              ₦{vehicle.dailyRate.toLocaleString()}
                            </span>
                            <span className="text-[10px] text-slate-400 font-JakartaMedium"> / day</span>
                          </div>

                          <button
                            onClick={() => setSelectedRentalVehicle(vehicle)}
                            className="px-3 py-1.5 rounded-full bg-[#0286FF] text-white text-xs font-JakartaBold hover:bg-blue-600 transition-all shadow-xs"
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
                <div key={item.id} className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-slate-700">{item.id}</span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-JakartaBold text-[10px] uppercase border border-emerald-200">
                      {item.status}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-sm font-JakartaBold text-slate-900">{item.vehicleModel}</h4>
                    <p className="text-[11px] text-slate-500 font-JakartaMedium">{item.pickupLocation}</p>
                  </div>

                  <div className="flex justify-between py-1.5 border-t border-b border-slate-100 text-[11px]">
                    <span className="text-slate-500">Pick-up Date</span>
                    <span className="font-JakartaBold text-slate-800">{item.pickupDate}</span>
                  </div>

                  <div className="flex justify-between items-baseline pt-1">
                    <span className="text-slate-400 text-[11px]">
                      {item.withDriver ? 'Chauffeur Included' : 'Self-Drive'}
                    </span>
                    <span className="text-sm font-JakartaBold text-[#0286FF]">
                      ₦{item.totalFare.toLocaleString()}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-16 text-center">
                <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 mx-auto mb-3">
                  <Key className="w-7 h-7" />
                </div>
                <h4 className="text-sm font-JakartaBold text-slate-800">No Active Rentals</h4>
                <p className="text-xs text-slate-400 font-JakartaMedium mt-1">
                  Book executive cars and SUVs across Lagos with Broader.
                </p>
                <button
                  onClick={() => setActiveTab('browse')}
                  className="mt-4 px-4 py-2 rounded-full bg-[#0286FF] text-white text-xs font-JakartaBold"
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
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white w-full max-w-sm rounded-3xl p-5 shadow-2xl border border-slate-200 animate-in zoom-in-95">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-base font-JakartaBold text-slate-900">Rental Summary</h4>
              <button
                onClick={() => setSelectedRentalVehicle(null)}
                className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-500"
              >
                ✕
              </button>
            </div>

            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100 mb-3">
              <img
                src={selectedRentalVehicle.image}
                alt={selectedRentalVehicle.name}
                className="w-16 h-12 rounded-xl object-cover"
              />
              <div>
                <h5 className="font-JakartaBold text-xs text-slate-900">{selectedRentalVehicle.name}</h5>
                <p className="text-[11px] text-slate-500 font-JakartaMedium">
                  {selectedRentalVehicle.seats} seats • {selectedRentalVehicle.transmission}
                </p>
              </div>
            </div>

            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500 font-JakartaMedium">Duration</span>
                <span className="font-JakartaBold text-slate-800">{rentalDays} Days</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500 font-JakartaMedium">Base Rental (₦{selectedRentalVehicle.dailyRate.toLocaleString()} × {rentalDays})</span>
                <span className="font-JakartaBold text-slate-800">
                  ₦{(selectedRentalVehicle.dailyRate * rentalDays).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500 font-JakartaMedium">Chauffeur Service</span>
                <span className="font-JakartaBold text-slate-800">
                  {withDriver ? `₦${(10000 * rentalDays).toLocaleString()}` : 'None (Self-Drive)'}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500 font-JakartaMedium">Refundable Security Deposit</span>
                <span className="font-JakartaBold text-slate-800">₦50,000</span>
              </div>
              <div className="flex justify-between pt-1 font-JakartaBold text-sm text-slate-900">
                <span>Total Due Now</span>
                <span className="text-[#0286FF]">
                  ₦{((selectedRentalVehicle.dailyRate + (withDriver ? 10000 : 0)) * rentalDays).toLocaleString()}
                </span>
              </div>
            </div>

            <div className="mt-4 space-y-2">
              <button
                onClick={handleConfirmBooking}
                className="w-full py-3 rounded-full bg-[#0286FF] hover:bg-blue-600 text-white font-JakartaBold text-xs shadow-md shadow-blue-500/25 transition-all"
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
