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
  Sparkles,
} from 'lucide-react';
import { calculateParcelPrice } from '../services/backendService';
import { ParcelDelivery } from '../types';
import { soundEngine } from '../services/soundNotification';

interface ParcelScreenProps {
  onClose?: () => void;
  isModal?: boolean;
}

export const ParcelScreen: React.FC<ParcelScreenProps> = ({ onClose, isModal = false }) => {
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
    soundEngine.playSuccess();

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
              <Package className="w-3.5 h-3.5 text-[#9EE6B5]" />
              <h2 className="text-sm font-JakartaBold text-white leading-none">Broader Parcel Delivery</h2>
            </div>
            <p className="text-[11px] text-neutral-400 font-JakartaMedium mt-0.5">
              Rapid On-Demand Dispatch in Lagos
            </p>
          </div>
        </div>

        <span className="text-[10px] font-JakartaBold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>Live Dispatch</span>
        </span>
      </div>

      {/* Tabs */}
      <div className="px-4 pt-3 shrink-0">
        <div className="flex p-1 bg-white/[0.05] border border-white/[0.08] rounded-2xl text-xs font-JakartaBold">
          <button
            onClick={() => {
              soundEngine.playClick();
              setActiveTab('send');
            }}
            className={`flex-1 py-2 rounded-xl transition-all ${
              activeTab === 'send'
                ? 'bg-[#9EE6B5] text-black font-extrabold shadow-[0_0_12px_rgba(158,230,181,0.4)]'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Send Package
          </button>
          <button
            onClick={() => {
              soundEngine.playClick();
              setActiveTab('track');
            }}
            className={`flex-1 py-2 rounded-xl transition-all ${
              activeTab === 'track'
                ? 'bg-[#9EE6B5] text-black font-extrabold shadow-[0_0_12px_rgba(158,230,181,0.4)]'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Track Deliveries ({parcels.length})
          </button>
        </div>
      </div>

      {successToast && (
        <div className="mx-4 mt-3 p-3 bg-emerald-500/15 border border-emerald-500/30 rounded-2xl flex items-center gap-2 text-xs text-emerald-300 font-JakartaMedium animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{successToast}</span>
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-4 space-y-3.5 custom-scrollbar">
        {activeTab === 'send' ? (
          <form onSubmit={handleSendPackage} className="space-y-3.5">
            {/* Sender Card */}
            <div className="glass-panel rounded-2xl border border-white/[0.08] p-4 space-y-2.5 text-xs">
              <div className="flex items-center gap-2 text-white font-JakartaBold text-xs uppercase tracking-wider">
                <div className="w-2.5 h-2.5 rounded-full bg-[#9EE6B5] shadow-[0_0_8px_rgba(158,230,181,0.8)]" />
                <span>Pickup / Sender Information</span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-JakartaSemiBold text-neutral-400 mb-1">Sender Name</label>
                  <input
                    type="text"
                    required
                    value={senderName}
                    onChange={(e) => setSenderName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-white/10 text-xs font-JakartaMedium text-white bg-white/[0.04] focus:outline-none focus:border-[#9EE6B5]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-JakartaSemiBold text-neutral-400 mb-1">Sender Phone</label>
                  <input
                    type="text"
                    required
                    value={senderPhone}
                    onChange={(e) => setSenderPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-white/10 text-xs font-JakartaBold text-white bg-white/[0.04] focus:outline-none focus:border-[#9EE6B5]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-JakartaSemiBold text-neutral-400 mb-1">Pickup Address</label>
                <input
                  type="text"
                  required
                  value={pickupAddress}
                  onChange={(e) => setPickupAddress(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-white/10 text-xs font-JakartaMedium text-white bg-white/[0.04] focus:outline-none focus:border-[#9EE6B5]"
                />
              </div>
            </div>

            {/* Recipient Card */}
            <div className="glass-panel rounded-2xl border border-white/[0.08] p-4 space-y-2.5 text-xs">
              <div className="flex items-center gap-2 text-white font-JakartaBold text-xs uppercase tracking-wider">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                <span>Delivery / Recipient Information</span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-JakartaSemiBold text-neutral-400 mb-1">Recipient Name</label>
                  <input
                    type="text"
                    required
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-white/10 text-xs font-JakartaMedium text-white bg-white/[0.04] focus:outline-none focus:border-[#9EE6B5]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-JakartaSemiBold text-neutral-400 mb-1">Recipient Phone</label>
                  <input
                    type="text"
                    required
                    value={recipientPhone}
                    onChange={(e) => setRecipientPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-white/10 text-xs font-JakartaBold text-white bg-white/[0.04] focus:outline-none focus:border-[#9EE6B5]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-JakartaSemiBold text-neutral-400 mb-1">Delivery Address</label>
                <input
                  type="text"
                  required
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-white/10 text-xs font-JakartaMedium text-white bg-white/[0.04] focus:outline-none focus:border-[#9EE6B5]"
                />
              </div>
            </div>

            {/* Package Details */}
            <div className="glass-panel rounded-2xl border border-white/[0.08] p-4 space-y-3 text-xs">
              <div className="flex items-center gap-2 text-white font-JakartaBold text-xs uppercase tracking-wider">
                <Package className="w-3.5 h-3.5 text-[#9EE6B5]" />
                <span>Package Specifications</span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-JakartaSemiBold text-neutral-400 mb-1">Category</label>
                  <select
                    value={packageType}
                    onChange={(e) => setPackageType(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-white/10 text-xs font-JakartaMedium text-white bg-white/[0.06] focus:outline-none focus:border-[#9EE6B5]"
                  >
                    <option value="Documents & Files" className="bg-[#0a0f1d]">Documents & Files</option>
                    <option value="Electronics & Gadgets" className="bg-[#0a0f1d]">Electronics & Gadgets</option>
                    <option value="Clothing & Apparel" className="bg-[#0a0f1d]">Clothing & Apparel</option>
                    <option value="Food & Perishables" className="bg-[#0a0f1d]">Food & Perishables</option>
                    <option value="Fragile & Glassware" className="bg-[#0a0f1d]">Fragile & Glassware</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-JakartaSemiBold text-neutral-400 mb-1">Weight (Kg)</label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 5, 10].map((kg) => (
                      <button
                        key={kg}
                        type="button"
                        onClick={() => {
                          soundEngine.playClick();
                          setWeightKg(kg);
                        }}
                        className={`flex-1 py-1.5 rounded-lg border text-xs font-bold transition-all ${
                          weightKg === kg
                            ? 'bg-[#9EE6B5] text-black font-extrabold border-[#9EE6B5]'
                            : 'bg-white/[0.04] text-neutral-400 border-white/10 hover:bg-white/[0.08]'
                        }`}
                      >
                        {kg}kg
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Express Toggle */}
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-400" />
                  <div>
                    <span className="text-xs font-JakartaBold text-white">Express Priority Dispatch</span>
                    <p className="text-[10px] text-neutral-400">Direct courier route with no intermediate stops</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    soundEngine.playClick();
                    setIsExpress(!isExpress);
                  }}
                  className={`w-10 h-6 rounded-full p-0.5 transition-colors ${
                    isExpress ? 'bg-[#9EE6B5]' : 'bg-white/20'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white transition-transform ${
                      isExpress ? 'translate-x-4' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              <div>
                <label className="block text-[10px] font-JakartaSemiBold text-neutral-400 mb-1">
                  Delivery Notes for Rider
                </label>
                <input
                  type="text"
                  value={deliveryNote}
                  onChange={(e) => setDeliveryNote(e.target.value)}
                  placeholder="Gate code, landmark, calling instructions..."
                  className="w-full px-3 py-2 rounded-xl border border-white/10 text-xs font-JakartaMedium text-white bg-white/[0.04] focus:outline-none focus:border-[#9EE6B5]"
                />
              </div>
            </div>

            {/* Pricing & Dispatch CTA */}
            <div className="glass-panel rounded-2xl border border-white/[0.08] p-4 flex items-center justify-between shadow-lg">
              <div>
                <span className="text-[10px] font-JakartaBold text-neutral-400 uppercase">Estimated Delivery Fare</span>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-xl font-JakartaBold text-[#9EE6B5]">
                    ₦{estimatedFare.toLocaleString()}
                  </span>
                  <span className="text-[10px] text-neutral-400 font-JakartaMedium">({estimatedKm} km route)</span>
                </div>
              </div>

              <button
                type="submit"
                className="px-5 py-3 rounded-xl bg-[#9EE6B5] hover:bg-[#8fd8a6] active:scale-95 text-black font-extrabold font-JakartaBold text-xs shadow-[0_0_18px_rgba(158,230,181,0.4)] transition-all flex items-center gap-1.5"
              >
                <Truck className="w-4 h-4" />
                <span>Dispatch Rider</span>
              </button>
            </div>
          </form>
        ) : (
          /* Track Tab */
          <div className="space-y-3">
            {parcels.map((parcel) => (
              <div
                key={parcel.id}
                className="glass-panel rounded-2xl border border-white/[0.08] p-4 space-y-3 transition-all"
              >
                <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
                  <div>
                    <span className="text-xs font-JakartaBold text-white">{parcel.id}</span>
                    <p className="text-[10px] text-neutral-400">{parcel.packageType} • {parcel.weightKg}kg</p>
                  </div>
                  <span className="text-[10px] font-JakartaBold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    <span>In Transit</span>
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#9EE6B5] mt-1 shrink-0" />
                    <div>
                      <span className="text-[10px] text-neutral-400 uppercase block">Pickup</span>
                      <p className="text-white font-JakartaMedium">{parcel.pickupAddress}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-400 mt-1 shrink-0" />
                    <div>
                      <span className="text-[10px] text-neutral-400 uppercase block">Dropoff</span>
                      <p className="text-white font-JakartaMedium">{parcel.deliveryAddress}</p>
                    </div>
                  </div>
                </div>

                {parcel.courier && (
                  <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-[#9EE6B5]/20 text-[#9EE6B5] flex items-center justify-center font-bold text-xs">
                        SG
                      </div>
                      <div>
                        <span className="text-xs font-JakartaBold text-white block">{parcel.courier.name}</span>
                        <span className="text-[10px] text-neutral-400">{parcel.courier.vehiclePlate}</span>
                      </div>
                    </div>
                    <a
                      href={`tel:${parcel.courier.phone}`}
                      className="px-3 py-1.5 rounded-lg bg-[#9EE6B5]/15 border border-[#9EE6B5]/30 text-[#9EE6B5] text-xs font-JakartaBold hover:bg-[#9EE6B5]/25 transition-all flex items-center gap-1"
                    >
                      <Phone className="w-3 h-3" />
                      <span>Call</span>
                    </a>
                  </div>
                )}
              </div>
            ))}

            {parcels.length === 0 && (
              <div className="p-8 text-center glass-panel rounded-2xl border border-white/[0.08]">
                <Package className="w-8 h-8 text-neutral-500 mx-auto mb-2" />
                <h4 className="text-xs font-JakartaBold text-white">No Parcels in Transit</h4>
                <p className="text-[11px] text-neutral-400 mt-1">
                  You haven't requested any package deliveries yet. Send one in seconds!
                </p>
                <button
                  onClick={() => setActiveTab('send')}
                  className="mt-3 px-4 py-2 rounded-xl bg-[#9EE6B5] text-black font-extrabold text-xs font-JakartaBold shadow-md"
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
