import React, { useState } from 'react';
import { useBroaderStore } from '../store/useBroaderStore';
import {
  ArrowLeft,
  Truck,
  Box,
  MapPin,
  Calendar,
  CheckCircle2,
  ShieldAlert,
  Clock,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { calculateFreightPrice } from '../services/backendService';
import { FreightShipment } from '../types';
import { soundEngine } from '../services/soundNotification';

interface FreightScreenProps {
  onClose?: () => void;
  isModal?: boolean;
}

export const FreightScreen: React.FC<FreightScreenProps> = ({ onClose, isModal = false }) => {
  const setScreen = useBroaderStore((s) => s.setScreen);
  const freightShipments = useBroaderStore((s) => s.freightShipments);
  const bookFreightShipment = useBroaderStore((s) => s.bookFreightShipment);

  const [activeTab, setActiveTab] = useState<'quote' | 'shipments'>('quote');
  const [cargoType, setCargoType] = useState('Industrial Machinery & Parts');
  const [weightTons, setWeightTons] = useState(5);
  const [selectedTruckType, setSelectedTruckType] = useState('10-Tonne Box Truck');

  const [originCity, setOriginCity] = useState('Lagos (Apapa Port)');
  const [destinationCity, setDestinationCity] = useState('Ibadan (Oyo State)');
  const [estimatedKm, setEstimatedKm] = useState(145);

  const [pickupDate, setPickupDate] = useState('Tomorrow, 08:00 AM');
  const [requiresInsurance, setRequiresInsurance] = useState(true);
  const [quoteSuccess, setQuoteSuccess] = useState<string | null>(null);

  const truckOptions = [
    { type: '3-Tonne Mitsubishi Canter', cap: 'Up to 3 Tons', baseMultiplier: 1.0 },
    { type: '10-Tonne Box Truck', cap: 'Up to 10 Tons', baseMultiplier: 1.6 },
    { type: '20-Tonne Tipper / Flatbed', cap: 'Up to 20 Tons', baseMultiplier: 2.3 },
    { type: '30-Tonne Articulated Container Hauler', cap: 'Up to 30 Tons', baseMultiplier: 3.2 },
  ];

  const estimatedFreightFare = calculateFreightPrice(estimatedKm, weightTons, selectedTruckType);

  const handleBookFreight = (e: React.FormEvent) => {
    e.preventDefault();
    soundEngine.playSuccess();

    const newShipment: FreightShipment = {
      id: 'frt_ng_' + Date.now().toString().slice(-4),
      cargoDescription: `${cargoType} (${weightTons} Tons)`,
      truckType: selectedTruckType,
      origin: originCity,
      destination: destinationCity,
      pickupDate,
      quotedFare: estimatedFreightFare,
      status: 'driver_assigned',
      hauler: {
        company: 'Dangote & BUA Logistics Partner Net',
        driverName: 'Alhaji Usman Danladi',
        truckPlate: 'APP-998-XA (Mack 400)',
      },
    };

    bookFreightShipment(newShipment);
    setQuoteSuccess(`Freight shipment scheduled! Reference ID: ${newShipment.id}`);
    setActiveTab('shipments');
    setTimeout(() => setQuoteSuccess(null), 5000);
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
              <Truck className="w-3.5 h-3.5 text-[#0286FF]" />
              <h2 className="text-sm font-JakartaBold text-white leading-none">Broader Freight & Cargo</h2>
            </div>
            <p className="text-[11px] text-neutral-400 font-JakartaMedium mt-0.5">Heavy Logistics Across Nigeria</p>
          </div>
        </div>

        <span className="text-[10px] font-JakartaBold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-full">
          Commercial
        </span>
      </div>

      {/* Tabs */}
      <div className="px-4 pt-3 shrink-0">
        <div className="flex p-1 bg-white/[0.05] border border-white/[0.08] rounded-2xl text-xs font-JakartaBold">
          <button
            onClick={() => {
              soundEngine.playClick();
              setActiveTab('quote');
            }}
            className={`flex-1 py-2 rounded-xl transition-all ${
              activeTab === 'quote'
                ? 'bg-[#0286FF] text-white shadow-[0_0_12px_rgba(2,134,255,0.4)]'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Freight Request
          </button>
          <button
            onClick={() => {
              soundEngine.playClick();
              setActiveTab('shipments');
            }}
            className={`flex-1 py-2 rounded-xl transition-all ${
              activeTab === 'shipments'
                ? 'bg-[#0286FF] text-white shadow-[0_0_12px_rgba(2,134,255,0.4)]'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Active Shipments ({freightShipments.length})
          </button>
        </div>
      </div>

      {quoteSuccess && (
        <div className="mx-4 mt-3 p-3 bg-emerald-500/15 border border-emerald-500/30 rounded-2xl flex items-center gap-2 text-xs text-emerald-300 font-JakartaMedium animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{quoteSuccess}</span>
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-4 space-y-3.5 custom-scrollbar">
        {activeTab === 'quote' ? (
          <form onSubmit={handleBookFreight} className="space-y-3.5">
            {/* Cargo Details Card */}
            <div className="glass-panel rounded-2xl border border-white/[0.08] p-4 space-y-3 text-xs">
              <h4 className="text-xs font-JakartaBold text-white uppercase tracking-wider">
                Cargo Specifications
              </h4>

              <div>
                <label className="block text-[10px] font-JakartaSemiBold text-neutral-400 mb-1">
                  Nature of Cargo / Goods
                </label>
                <select
                  value={cargoType}
                  onChange={(e) => setCargoType(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-white/10 text-xs font-JakartaMedium text-white bg-white/[0.05] focus:outline-none focus:border-[#0286FF]"
                >
                  <option value="Industrial Machinery & Parts" className="bg-[#0a0f1d]">Industrial Machinery & Parts</option>
                  <option value="Building Materials & Cement" className="bg-[#0a0f1d]">Building Materials & Cement</option>
                  <option value="FMCG & Packaged Retail Stock" className="bg-[#0a0f1d]">FMCG & Packaged Retail Stock</option>
                  <option value="Commercial Furniture & Fixtures" className="bg-[#0a0f1d]">Commercial Furniture & Fixtures</option>
                  <option value="Agricultural Produce & Grains" className="bg-[#0a0f1d]">Agricultural Produce & Grains</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-JakartaSemiBold text-neutral-400 mb-1">
                  Estimated Net Weight (Metric Tons)
                </label>
                <div className="flex items-center gap-2">
                  {[1, 3, 5, 10, 20, 30].map((t) => (
                    <button
                      type="button"
                      key={t}
                      onClick={() => {
                        soundEngine.playClick();
                        setWeightTons(t);
                      }}
                      className={`flex-1 py-1.5 rounded-xl border text-center font-JakartaBold text-xs transition-all ${
                        weightTons === t
                          ? 'bg-[#0286FF] border-[#0286FF] text-white shadow-[0_0_10px_rgba(2,134,255,0.4)]'
                          : 'border-white/10 bg-white/[0.04] text-neutral-400 hover:bg-white/[0.08]'
                      }`}
                    >
                      {t}T
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Commercial Vehicle Selection */}
            <div className="glass-panel rounded-2xl border border-white/[0.08] p-4 space-y-2.5 text-xs">
              <h4 className="text-xs font-JakartaBold text-white uppercase tracking-wider">
                Commercial Haulage Vehicle
              </h4>

              <div className="space-y-1.5">
                {truckOptions.map((truck) => (
                  <div
                    key={truck.type}
                    onClick={() => {
                      soundEngine.playClick();
                      setSelectedTruckType(truck.type);
                    }}
                    className={`flex items-center justify-between p-2.5 rounded-xl border cursor-pointer transition-all ${
                      selectedTruckType === truck.type
                        ? 'bg-[#0286FF]/20 border-[#0286FF]'
                        : 'border-white/10 bg-white/[0.03] hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-white/10 text-cyan-400 flex items-center justify-center">
                        <Truck className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-JakartaBold text-white">{truck.type}</p>
                        <p className="text-[10px] text-neutral-400 font-JakartaMedium">Rated: {truck.cap}</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-JakartaBold text-cyan-300">
                      {selectedTruckType === truck.type ? 'Selected' : 'Select'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Origin & Destination */}
            <div className="glass-panel rounded-2xl border border-white/[0.08] p-4 space-y-2.5 text-xs">
              <h4 className="text-xs font-JakartaBold text-white uppercase tracking-wider">
                Interstate Haulage Route
              </h4>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-JakartaSemiBold text-neutral-400 mb-1">Origin Hub</label>
                  <input
                    type="text"
                    required
                    value={originCity}
                    onChange={(e) => setOriginCity(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-white/10 text-xs font-JakartaMedium text-white bg-white/[0.04] focus:outline-none focus:border-[#0286FF]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-JakartaSemiBold text-neutral-400 mb-1">Destination</label>
                  <input
                    type="text"
                    required
                    value={destinationCity}
                    onChange={(e) => setDestinationCity(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-white/10 text-xs font-JakartaMedium text-white bg-white/[0.04] focus:outline-none focus:border-[#0286FF]"
                  />
                </div>
              </div>
            </div>

            {/* Fare Summary & CTA */}
            <div className="glass-panel rounded-2xl border border-white/[0.08] p-4 flex items-center justify-between shadow-lg">
              <div>
                <span className="text-[10px] font-JakartaBold text-neutral-400 uppercase">Estimated Haulage Quote</span>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-xl font-JakartaBold text-[#0286FF]">
                    ₦{estimatedFreightFare.toLocaleString()}
                  </span>
                  <span className="text-[10px] text-neutral-400 font-JakartaMedium">({estimatedKm} km)</span>
                </div>
              </div>

              <button
                type="submit"
                className="px-5 py-3 rounded-xl bg-[#0286FF] hover:bg-blue-500 active:scale-95 text-white font-JakartaBold text-xs shadow-[0_0_18px_rgba(2,134,255,0.4)] transition-all flex items-center gap-1.5"
              >
                <Truck className="w-4 h-4" />
                <span>Confirm Haulage</span>
              </button>
            </div>
          </form>
        ) : (
          /* Active Shipments Tab */
          <div className="space-y-3">
            {freightShipments.map((shipment) => (
              <div
                key={shipment.id}
                className="glass-panel rounded-2xl border border-white/[0.08] p-4 space-y-3"
              >
                <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
                  <div>
                    <span className="text-xs font-JakartaBold text-white">{shipment.id}</span>
                    <p className="text-[10px] text-neutral-400">{shipment.cargoDescription}</p>
                  </div>
                  <span className="text-[10px] font-JakartaBold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                    Confirmed
                  </span>
                </div>

                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Route:</span>
                    <span className="font-JakartaBold text-white">{shipment.origin} → {shipment.destination}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Vehicle:</span>
                    <span className="text-white">{shipment.truckType}</span>
                  </div>
                  <div className="flex justify-between items-baseline pt-1">
                    <span className="text-neutral-400">Agreed Fare:</span>
                    <span className="font-JakartaBold text-cyan-300 text-sm">₦{shipment.quotedFare.toLocaleString()}</span>
                  </div>
                </div>

                {shipment.hauler && (
                  <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-xs">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-JakartaBold text-white">{shipment.hauler.driverName}</span>
                      <span className="text-[10px] text-cyan-400">{shipment.hauler.truckPlate}</span>
                    </div>
                    <p className="text-[10px] text-neutral-400">{shipment.hauler.company}</p>
                  </div>
                )}
              </div>
            ))}

            {freightShipments.length === 0 && (
              <div className="py-16 text-center glass-panel rounded-2xl border border-white/[0.08] p-8">
                <Truck className="w-8 h-8 text-neutral-500 mx-auto mb-2" />
                <h4 className="text-xs font-JakartaBold text-white">No Active Haulage Shipments</h4>
                <p className="text-[11px] text-neutral-400 mt-1">
                  Request an instant commercial logistics quote for heavy goods.
                </p>
                <button
                  onClick={() => setActiveTab('quote')}
                  className="mt-3 px-4 py-2 rounded-xl bg-[#0286FF] text-white text-xs font-JakartaBold shadow-md"
                >
                  Create Freight Request
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
