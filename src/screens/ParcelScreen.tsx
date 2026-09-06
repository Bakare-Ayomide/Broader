import React, { useState } from 'react';
import { useBroaderStore } from '../store/useBroaderStore';
import {
  ArrowLeft,
  Package,
  Clock,
  ShieldCheck,
  CheckCircle2,
  MapPin,
  Phone,
  User,
  Zap,
  ChevronRight,
  AlertCircle,
  Truck,
} from 'lucide-react';
import { calculateParcelPrice } from '../services/backendService';
import { ParcelDelivery } from '../types';

export const ParcelScreen: React.FC = () => {
  const setScreen = useBroaderStore((s) => s.setScreen);
  const parcels = useBroaderStore((s) => s.parcels);
  const createParcelDelivery = useBroaderStore((s) => s.createParcelDelivery);
  const userAddress = useBroaderStore((s) => s.userAddress);

  const [activeTab, setActiveTab] = useState<'send' | 'track'>('send');
  const [senderName, setSenderName] = useState('Chris Baker');
  const [senderPhone, setSenderPhone] = useState('+234 803 123 4567');
  const [pickupAddress, setPickupAddress] = useState(userAddress || '15 Admiralty Way, Lekki Phase 1, Lagos');

  const [recipientName, setRecipientName] = useState('Fatima Bello');
  const [recipientPhone, setRecipientPhone] = useState('+234 812 998 7766');
  const [deliveryAddress, setDeliveryAddress] = useState('24 Adeola Odeku St, Victoria Island, Lagos');

  const [packageType, setPackageType] = useState('Documents & Files');
  const [weightKg, setWeightKg] = useState(2);
  const [isExpress, setIsExpress] = useState(true);
  const [deliveryNote, setDeliveryNote] = useState('Please call recipient upon arrival at gate.');
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Price estimate (e.g. 8.5 km from Lekki to VI)
  const estimatedKm = 8.5;
  const estimatedFare = calculateParcelPrice(estimatedKm, weightKg, isExpress);

  const handleSendPackage = (e: React.FormEvent) => {
    e.preventDefault();

    const newParcel: ParcelDelivery = {
      id: 'pcl_lag_' + Date.now().toString().slice(-4),
      senderName,
      senderPhone,
      recipientName,
      recipientPhone,
      pickupAddress,
      deliveryAddress,
      packageType,
      weightKg,
      isExpress,
      fare: estimatedFare,
      status: 'courier_assigned',
      createdDate: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      courier: {
        name: 'Suleiman Garba',
        phone: '+234 802 334 1122',
        vehiclePlate: 'KJA-552-XD (Yamaha 125)',
      },
    };

    createParcelDelivery(newParcel);
    setSuccessToast(`Courier assigned! Parcel tracking ID: ${newParcel.id}`);
    setActiveTab('track');
    setTimeout(() => setSuccessToast(null), 5000);
  };

  return (
    <div className="flex flex-col h-full bg-[#F6F8FA] select-none">
      {/* Header */}
      <div className="px-5 pt-4 pb-3 bg-white border-b border-slate-200 shrink-0 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setScreen('home')}
            className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 hover:bg-slate-200"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h2 className="text-base font-JakartaBold text-slate-900 leading-none">Broader Parcel Delivery</h2>
            <p className="text-[11px] text-slate-400 font-JakartaMedium mt-0.5">Fast, Secure Dispatch in Lagos</p>
          </div>
        </div>

        <span className="text-xs font-JakartaBold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
          Live Dispatch
        </span>
      </div>

      {/* Tabs */}
      <div className="px-4 pt-3 shrink-0">
        <div className="flex p-1 bg-slate-200/70 rounded-xl text-xs font-JakartaBold">
          <button
            onClick={() => setActiveTab('send')}
            className={`flex-1 py-1.5 rounded-lg transition-all ${
              activeTab === 'send' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
            }`}
          >
            Send Package
          </button>
          <button
            onClick={() => setActiveTab('track')}
            className={`flex-1 py-1.5 rounded-lg transition-all ${
              activeTab === 'track' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
            }`}
          >
            Track Deliveries ({parcels.length})
          </button>
        </div>
      </div>

      {successToast && (
        <div className="mx-4 mt-3 p-3 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-2 text-xs text-emerald-800 font-JakartaMedium animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successToast}</span>
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {activeTab === 'send' ? (
          <form onSubmit={handleSendPackage} className="space-y-3">
            {/* Sender Card */}
            <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-2.5 text-xs">
              <div className="flex items-center gap-1.5 text-slate-900 font-JakartaBold text-xs uppercase tracking-wider">
                <div className="w-2.5 h-2.5 rounded-full bg-[#0286FF]" />
                <span>Pickup / Sender Information</span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-JakartaSemiBold text-slate-500 mb-1">Sender Name</label>
                  <input
                    type="text"
                    required
                    value={senderName}
                    onChange={(e) => setSenderName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-JakartaMedium text-slate-800 bg-[#F6F8FA] focus:outline-none focus:border-[#0286FF]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-JakartaSemiBold text-slate-500 mb-1">Sender Phone</label>
                  <input
                    type="text"
                    required
                    value={senderPhone}
                    onChange={(e) => setSenderPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-JakartaBold text-slate-800 bg-[#F6F8FA] focus:outline-none focus:border-[#0286FF]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-JakartaSemiBold text-slate-500 mb-1">Pickup Address</label>
                <input
                  type="text"
                  required
                  value={pickupAddress}
                  onChange={(e) => setPickupAddress(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-JakartaMedium text-slate-800 bg-[#F6F8FA] focus:outline-none focus:border-[#0286FF]"
                />
              </div>
            </div>

            {/* Recipient Card */}
            <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-2.5 text-xs">
              <div className="flex items-center gap-1.5 text-slate-900 font-JakartaBold text-xs uppercase tracking-wider">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span>Delivery / Recipient Information</span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-JakartaSemiBold text-slate-500 mb-1">Recipient Name</label>
                  <input
                    type="text"
                    required
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-JakartaMedium text-slate-800 bg-[#F6F8FA] focus:outline-none focus:border-[#0286FF]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-JakartaSemiBold text-slate-500 mb-1">Recipient Phone</label>
                  <input
                    type="text"
                    required
                    value={recipientPhone}
                    onChange={(e) => setRecipientPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-JakartaBold text-slate-800 bg-[#F6F8FA] focus:outline-none focus:border-[#0286FF]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-JakartaSemiBold text-slate-500 mb-1">Delivery Address</label>
                <input
                  type="text"
                  required
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-JakartaMedium text-slate-800 bg-[#F6F8FA] focus:outline-none focus:border-[#0286FF]"
                />
              </div>
            </div>

            {/* Package Type & Speed Selection */}
            <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-3 text-xs">
              <div>
                <label className="block text-[11px] font-JakartaSemiBold text-slate-500 mb-1">Package Category</label>
                <div className="grid grid-cols-3 gap-1.5">
                  {['Documents & Files', 'Electronics', 'Clothing / Shoes', 'Food & Groceries', 'Fragile Goods'].map((cat) => (
                    <button
                      type="button"
                      key={cat}
                      onClick={() => setPackageType(cat)}
                      className={`p-2 rounded-xl text-[11px] font-JakartaSemiBold border transition-all text-center ${
                        packageType === cat
                          ? 'bg-blue-50 border-[#0286FF] text-[#0286FF]'
                          : 'border-slate-200 text-slate-600'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-JakartaSemiBold text-slate-500 mb-1">Estimated Weight</label>
                  <select
                    value={weightKg}
                    onChange={(e) => setWeightKg(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-JakartaMedium text-slate-800 bg-[#F6F8FA] focus:outline-none focus:border-[#0286FF]"
                  >
                    <option value={1}>Under 1 kg</option>
                    <option value={2}>1 - 3 kg</option>
                    <option value={5}>3 - 7 kg</option>
                    <option value={10}>7 - 15 kg</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-JakartaSemiBold text-slate-500 mb-1">Delivery Speed</label>
                  <button
                    type="button"
                    onClick={() => setIsExpress(!isExpress)}
                    className={`w-full py-2 px-2 rounded-xl border font-JakartaBold text-xs flex items-center justify-center gap-1 transition-all ${
                      isExpress
                        ? 'bg-amber-50 border-amber-300 text-amber-800'
                        : 'bg-[#F6F8FA] border-slate-200 text-slate-600'
                    }`}
                  >
                    <Zap className="w-3 h-3 text-amber-500" />
                    <span>{isExpress ? 'Express (45m)' : 'Standard'}</span>
                  </button>
                </div>
              </div>

              {/* Instant Transparent Pricing Card */}
              <div className="p-3 bg-blue-50/70 rounded-xl border border-blue-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-JakartaBold text-blue-600 uppercase">Estimated Delivery Fee</span>
                  <p className="text-lg font-JakartaBold text-slate-900">₦{estimatedFare.toLocaleString()}</p>
                </div>
                <div className="text-right text-[10px] text-slate-500 font-JakartaMedium">
                  <span>~{estimatedKm} km route</span>
                  <span className="block text-emerald-600 font-JakartaBold">Instant Motorcycle Dispatch</span>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-full bg-[#0286FF] hover:bg-blue-600 text-white font-JakartaBold text-xs shadow-md shadow-blue-500/25 transition-all flex items-center justify-center gap-1.5"
              >
                <span>Request Broader Dispatcher</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        ) : (
          /* Track Deliveries Tab */
          <div className="space-y-3">
            {parcels.length > 0 ? (
              parcels.map((parcel) => (
                <div key={parcel.id} className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-2.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-slate-700">{parcel.id}</span>
                    <span className="px-2 py-0.5 rounded-full bg-blue-50 text-[#0286FF] font-JakartaBold text-[10px] uppercase border border-blue-200">
                      {parcel.status.replace('_', ' ')}
                    </span>
                  </div>

                  <div className="p-2.5 bg-slate-50 rounded-xl space-y-1 text-[11px]">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-[#0286FF]" />
                      <span className="font-JakartaMedium text-slate-800 truncate">{parcel.pickupAddress}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-500" />
                      <span className="font-JakartaMedium text-slate-800 truncate">{parcel.deliveryAddress}</span>
                    </div>
                  </div>

                  {parcel.courier && (
                    <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                      <div>
                        <p className="font-JakartaBold text-slate-900">{parcel.courier.name}</p>
                        <p className="text-[10px] text-slate-400 font-JakartaMedium">{parcel.courier.vehiclePlate}</p>
                      </div>
                      <a
                        href={`tel:${parcel.courier.phone}`}
                        className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-JakartaBold"
                      >
                        Call Rider
                      </a>
                    </div>
                  )}

                  <div className="flex justify-between items-center pt-1 text-[11px]">
                    <span className="text-slate-400">{parcel.packageType} ({parcel.weightKg}kg)</span>
                    <span className="font-JakartaBold text-[#0286FF]">₦{parcel.fare.toLocaleString()}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-16 text-center">
                <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 mx-auto mb-3">
                  <Package className="w-7 h-7" />
                </div>
                <h4 className="text-sm font-JakartaBold text-slate-800">No Parcels in Transit</h4>
                <p className="text-xs text-slate-400 font-JakartaMedium mt-1">
                  Send packages and documents anywhere in Lagos with live rider tracking.
                </p>
                <button
                  onClick={() => setActiveTab('send')}
                  className="mt-4 px-4 py-2 rounded-full bg-[#0286FF] text-white text-xs font-JakartaBold"
                >
                  Send a Package
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
