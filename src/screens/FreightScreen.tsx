import React, { useState } from 'react';
import { useBroaderStore } from '../store/useBroaderStore';
import {
  ArrowLeft,
  Truck,
  Package,
  Clock,
  ShieldCheck,
  CheckCircle2,
  MapPin,
  ChevronRight,
  Layers,
  Scale,
  Building,
} from 'lucide-react';
import { calculateFreightPrice } from '../services/backendService';
import { FreightShipment } from '../types';

export const FreightScreen: React.FC = () => {
  const setScreen = useBroaderStore((s) => s.setScreen);
  const freightShipments = useBroaderStore((s) => s.freightShipments);
  const bookFreightShipment = useBroaderStore((s) => s.bookFreightShipment);

  const [activeTab, setActiveTab] = useState<'quote' | 'shipments'>('quote');
  const [cargoType, setCargoType] = useState('Industrial Machinery & Parts');
  const [weightTons, setWeightTons] = useState(5);
  const [originHub, setOriginHub] = useState('Apapa Container Port, Lagos');
  const [destinationCity, setDestinationCity] = useState('Ikeja Industrial Estate, Lagos');
  const [selectedTruckType, setSelectedTruckType] = useState('5-Ton Box Truck');
  const [requiresLoadingCrew, setRequiresLoadingCrew] = useState(true);
  const [quoteSuccess, setQuoteSuccess] = useState<string | null>(null);

  const hubOptions = [
    'Apapa Container Port, Lagos',
    'Tin Can Island Terminal, Lagos',
    'Ikeja Industrial Estate, Lagos',
    'Lekki Free Trade Zone & Deep Sea Port',
    'Sagamu Logistics Park, Ogun State',
    'Onne Port, Rivers State',
  ];

  const destinationOptions = [
    'Ikeja Industrial Estate, Lagos',
    'Alaba International Market, Ojo, Lagos',
    'Abuja Central Distribution Hub, FCT',
    'Onitsha Main Commercial Hub, Anambra',
    'Kano Bompai Industrial Zone',
    'Port Harcourt Trans-Amadi, Rivers',
  ];

  const truckOptions = [
    { type: '1-Ton Pickup', cap: '1 Ton', rateMult: 1 },
    { type: '3-Ton Covered Van', cap: '3 Tons', rateMult: 1.5 },
    { type: '5-Ton Box Truck', cap: '5 Tons', rateMult: 2.2 },
    { type: '10-Ton Heavy Hauler', cap: '10 Tons', rateMult: 3.8 },
    { type: '30-Ton Flatbed Semi-Trailer', cap: '30 Tons', rateMult: 6.5 },
  ];

  // Calculate freight price based on weight and truck
  const estimatedFreightPrice = calculateFreightPrice(weightTons, 45, selectedTruckType);

  const handleBookFreight = (e: React.FormEvent) => {
    e.preventDefault();

    const newShipment: FreightShipment = {
      id: 'frt_ng_' + Date.now().toString().slice(-4),
      cargoType,
      weightTons,
      truckType: selectedTruckType,
      origin: originHub,
      destination: destinationCity,
      estimatedPrice: estimatedFreightPrice,
      status: 'scheduled',
      scheduledDate: 'Tomorrow, 08:00 AM',
      driverInfo: {
        name: 'Alhaji Musa Danladi',
        phone: '+234 803 771 9900',
        plateNumber: 'KRD-914-XA (Mack 5-Ton)',
      },
    };

    bookFreightShipment(newShipment);
    setQuoteSuccess(`Freight shipment booked! Consignment #${newShipment.id}`);
    setActiveTab('shipments');
    setTimeout(() => setQuoteSuccess(null), 5000);
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
            <h2 className="text-base font-JakartaBold text-slate-900 leading-none">Broader Freight & Cargo</h2>
            <p className="text-[11px] text-slate-400 font-JakartaMedium mt-0.5">Heavy Logistics Across Nigeria</p>
          </div>
        </div>

        <span className="text-xs font-JakartaBold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-full">
          Commercial
        </span>
      </div>

      {/* Tabs */}
      <div className="px-4 pt-3 shrink-0">
        <div className="flex p-1 bg-slate-200/70 rounded-xl text-xs font-JakartaBold">
          <button
            onClick={() => setActiveTab('quote')}
            className={`flex-1 py-1.5 rounded-lg transition-all ${
              activeTab === 'quote' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
            }`}
          >
            Freight Request
          </button>
          <button
            onClick={() => setActiveTab('shipments')}
            className={`flex-1 py-1.5 rounded-lg transition-all ${
              activeTab === 'shipments' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
            }`}
          >
            Active Shipments ({freightShipments.length})
          </button>
        </div>
      </div>

      {quoteSuccess && (
        <div className="mx-4 mt-3 p-3 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-2 text-xs text-emerald-800 font-JakartaMedium animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{quoteSuccess}</span>
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {activeTab === 'quote' ? (
          <form onSubmit={handleBookFreight} className="space-y-3">
            {/* Cargo Details Card */}
            <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-3 text-xs">
              <h4 className="text-xs font-JakartaBold text-slate-900 uppercase tracking-wider">
                Cargo Specifications
              </h4>

              <div>
                <label className="block text-[11px] font-JakartaSemiBold text-slate-500 mb-1">
                  Nature of Cargo / Goods
                </label>
                <select
                  value={cargoType}
                  onChange={(e) => setCargoType(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-JakartaMedium text-slate-800 bg-[#F6F8FA] focus:outline-none focus:border-[#0286FF]"
                >
                  <option>Industrial Machinery & Parts</option>
                  <option>Building Materials & Cement</option>
                  <option>FMCG & Packaged Retail Stock</option>
                  <option>Commercial Furniture & Fixtures</option>
                  <option>Agricultural Produce & Grains</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-JakartaSemiBold text-slate-500 mb-1">
                  Estimated Net Weight (Metric Tons)
                </label>
                <div className="flex items-center gap-2">
                  {[1, 3, 5, 10, 20, 30].map((t) => (
                    <button
                      type="button"
                      key={t}
                      onClick={() => setWeightTons(t)}
                      className={`flex-1 py-1.5 rounded-xl border text-center font-JakartaBold text-xs transition-all ${
                        weightTons === t
                          ? 'bg-blue-50 border-[#0286FF] text-[#0286FF]'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {t}T
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Commercial Vehicle Selection */}
            <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-2.5 text-xs">
              <h4 className="text-xs font-JakartaBold text-slate-900 uppercase tracking-wider">
                Commercial Haulage Vehicle
              </h4>

              <div className="space-y-1.5">
                {truckOptions.map((truck) => (
                  <div
                    key={truck.type}
                    onClick={() => setSelectedTruckType(truck.type)}
                    className={`flex items-center justify-between p-2.5 rounded-xl border cursor-pointer transition-all ${
                      selectedTruckType === truck.type
                        ? 'bg-blue-50/70 border-[#0286FF]'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center">
                        <Truck className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <p className="text-xs font-JakartaBold text-slate-900">{truck.type}</p>
                        <p className="text-[10px] text-slate-400 font-JakartaMedium">Rated: {truck.cap}</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-JakartaBold text-[#0286FF]">
                      {selectedTruckType === truck.type ? 'Selected' : 'Select'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Route Hubs Card */}
            <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-2.5 text-xs">
              <h4 className="text-xs font-JakartaBold text-slate-900 uppercase tracking-wider">
                Origin & Destination Terminals
              </h4>

              <div>
                <label className="block text-[11px] font-JakartaSemiBold text-slate-500 mb-1">
                  Origin Freight Hub / Port
                </label>
                <select
                  value={originHub}
                  onChange={(e) => setOriginHub(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-JakartaMedium text-slate-800 bg-[#F6F8FA]"
                >
                  {hubOptions.map((h) => (
                    <option key={h} value={h}>
                      {h}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-JakartaSemiBold text-slate-500 mb-1">
                  Destination City / Hub
                </label>
                <select
                  value={destinationCity}
                  onChange={(e) => setDestinationCity(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-JakartaMedium text-slate-800 bg-[#F6F8FA]"
                >
                  {destinationOptions.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Price & Booking Button */}
            <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-3 text-xs">
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div>
                  <span className="text-[10px] font-JakartaBold text-slate-400 uppercase">Haulage Quote</span>
                  <p className="text-xl font-JakartaBold text-slate-900">
                    ₦{estimatedFreightPrice.toLocaleString()}
                  </p>
                </div>
                <div className="text-right text-[10px] text-slate-500 font-JakartaMedium">
                  <span>GIT Insurance Included</span>
                  <span className="block font-JakartaBold text-emerald-600">FRSC Certified Carrier</span>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-full bg-[#0286FF] hover:bg-blue-600 text-white font-JakartaBold text-xs shadow-md shadow-blue-500/25 transition-all flex items-center justify-center gap-1.5"
              >
                <span>Dispatch Commercial Hauler</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        ) : (
          /* Active Shipments Tab */
          <div className="space-y-3">
            {freightShipments.length > 0 ? (
              freightShipments.map((shipment) => (
                <div key={shipment.id} className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-2.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-slate-700">{shipment.id}</span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-JakartaBold text-[10px] uppercase border border-emerald-200">
                      {shipment.status}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-sm font-JakartaBold text-slate-900">{shipment.cargoType}</h4>
                    <p className="text-[11px] text-slate-500 font-JakartaMedium">
                      {shipment.truckType} • {shipment.weightTons} Metric Tons
                    </p>
                  </div>

                  <div className="p-2.5 bg-slate-50 rounded-xl space-y-1 text-[11px]">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-[#0286FF]" />
                      <span className="font-JakartaMedium text-slate-800 truncate">{shipment.origin}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-500" />
                      <span className="font-JakartaMedium text-slate-800 truncate">{shipment.destination}</span>
                    </div>
                  </div>

                  {shipment.driverInfo && (
                    <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                      <div>
                        <p className="font-JakartaBold text-slate-900">{shipment.driverInfo.name}</p>
                        <p className="text-[10px] text-slate-400 font-JakartaMedium">{shipment.driverInfo.plateNumber}</p>
                      </div>
                      <a
                        href={`tel:${shipment.driverInfo.phone}`}
                        className="px-2.5 py-1 rounded-full bg-blue-50 text-[#0286FF] border border-blue-200 text-[10px] font-JakartaBold"
                      >
                        Call Driver
                      </a>
                    </div>
                  )}

                  <div className="flex justify-between items-baseline pt-1">
                    <span className="text-slate-400 text-[11px]">{shipment.scheduledDate}</span>
                    <span className="text-sm font-JakartaBold text-[#0286FF]">
                      ₦{shipment.estimatedPrice.toLocaleString()}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-16 text-center">
                <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 mx-auto mb-3">
                  <Truck className="w-7 h-7" />
                </div>
                <h4 className="text-sm font-JakartaBold text-slate-800">No Freight Shipments</h4>
                <p className="text-xs text-slate-400 font-JakartaMedium mt-1">
                  Book commercial trucks, flatbeds, and containers across Nigeria.
                </p>
                <button
                  onClick={() => setActiveTab('quote')}
                  className="mt-4 px-4 py-2 rounded-full bg-[#0286FF] text-white text-xs font-JakartaBold"
                >
                  Create Freight Order
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
