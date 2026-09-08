import React, { useState } from 'react';
import { useBroaderStore } from '../store/useBroaderStore';
import {
  ArrowLeft,
  Wrench,
  ShieldCheck,
  Search,
  ShoppingCart,
  CheckCircle2,
  Clock,
  MapPin,
  Truck,
  Filter,
  Star,
  Zap,
} from 'lucide-react';
import { soundEngine } from '../services/soundNotification';

interface AutoPartItem {
  id: string;
  name: string;
  category: 'brakes' | 'battery' | 'oil' | 'tires' | 'suspension';
  priceNaira: number;
  brand: string;
  compatibility: string;
  rating: number;
  inStock: boolean;
  etaMins: number;
  description: string;
}

const SAMPLE_AUTO_PARTS: AutoPartItem[] = [
  {
    id: 'prt_bat_01',
    name: 'Bosch S4 Heavy Duty Car Battery (75Ah)',
    category: 'battery',
    priceNaira: 78000,
    brand: 'Bosch Germany',
    compatibility: 'Toyota Corolla, Camry, Honda Accord, RAV4',
    rating: 4.9,
    inStock: true,
    etaMins: 25,
    description: 'Maintenance-free calcium-silver alloy with 18-month warranty.',
  },
  {
    id: 'prt_brk_02',
    name: 'Akebono Ceramic Front Brake Pads Set',
    category: 'brakes',
    priceNaira: 32000,
    brand: 'Akebono OEM',
    compatibility: 'Toyota Camry (2007-2020), Lexus ES350',
    rating: 4.8,
    inStock: true,
    etaMins: 30,
    description: 'Ultra-quiet ceramic formula with rotor-friendly wear and dust reduction.',
  },
  {
    id: 'prt_oil_03',
    name: 'Mobil 1 Full Synthetic 5W-30 (5 Liters) + Filter',
    category: 'oil',
    priceNaira: 42500,
    brand: 'Mobil 1',
    compatibility: 'Universal petrol engines, V4 & V6',
    rating: 5.0,
    inStock: true,
    etaMins: 20,
    description: 'Advanced full synthetic engine formula for high temperature protection in Lagos traffic.',
  },
  {
    id: 'prt_tir_04',
    name: 'Michelin Primacy 4 Tire (215/55 R17)',
    category: 'tires',
    priceNaira: 85000,
    brand: 'Michelin',
    compatibility: 'Sedans and Compact SUVs',
    rating: 4.9,
    inStock: true,
    etaMins: 35,
    description: 'Superior wet grip braking and long-lasting tread life with run-flat capability.',
  },
  {
    id: 'prt_sus_05',
    name: 'KYB Excel-G Gas Front Shock Absorbers (Pair)',
    category: 'suspension',
    priceNaira: 68000,
    brand: 'KYB Japan',
    compatibility: 'Toyota Corolla 2008-2018',
    rating: 4.7,
    inStock: true,
    etaMins: 40,
    description: 'Twin-tube nitrogen charged shocks for pothole damping and highway stability.',
  },
];

interface AutoPartsScreenProps {
  onClose?: () => void;
  isModal?: boolean;
}

export const AutoPartsScreen: React.FC<AutoPartsScreenProps> = ({ onClose, isModal = false }) => {
  const setScreen = useBroaderStore((s) => s.setScreen);
  const userAddress = useBroaderStore((s) => s.userAddress);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPart, setSelectedPart] = useState<AutoPartItem | null>(null);
  const [orderSuccess, setOrderSuccess] = useState<string | null>(null);

  const filteredParts = SAMPLE_AUTO_PARTS.filter((part) => {
    const matchesCategory = activeCategory === 'all' || part.category === activeCategory;
    const matchesSearch =
      part.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      part.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      part.compatibility.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleOrderPart = (part: AutoPartItem) => {
    soundEngine.playSuccess();
    setOrderSuccess(`Order placed for ${part.name}! Dispatch rider assigned (ETA: ${part.etaMins}m)`);
    setSelectedPart(null);
    setTimeout(() => setOrderSuccess(null), 5000);
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
    <div className="flex flex-col h-full bg-[#020408] text-white select-none">
      {/* Top Header */}
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
              <Wrench className="w-3.5 h-3.5 text-[#0286FF]" />
              <h2 className="text-sm font-JakartaBold text-white leading-none">Broader Auto Parts & Spares</h2>
            </div>
            <p className="text-[11px] text-neutral-400 font-JakartaMedium mt-0.5">
              Verified OEM Spares & Fast Lagos Roadside Dispatch
            </p>
          </div>
        </div>

        <span className="text-[10px] font-JakartaBold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>Express Delivery</span>
        </span>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3.5 custom-scrollbar">
        {orderSuccess && (
          <div className="p-3.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center gap-2.5 text-xs text-emerald-300 font-JakartaSemiBold animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{orderSuccess}</span>
          </div>
        )}

        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search battery, brake pads, oil, shock absorbers..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/10 text-xs font-JakartaMedium text-white placeholder:text-neutral-500 focus:outline-none focus:border-[#0286FF]/60 transition-all"
          />
        </div>

        {/* Categories Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {[
            { id: 'all', label: 'All Spares' },
            { id: 'battery', label: 'Batteries' },
            { id: 'brakes', label: 'Brakes' },
            { id: 'oil', label: 'Oil & Service' },
            { id: 'tires', label: 'Tires' },
            { id: 'suspension', label: 'Suspension' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                soundEngine.playClick();
                setActiveCategory(cat.id);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-JakartaSemiBold whitespace-nowrap transition-all border ${
                activeCategory === cat.id
                  ? 'bg-[#0286FF] text-white border-[#0286FF] shadow-[0_0_12px_rgba(2,134,255,0.4)]'
                  : 'bg-white/[0.04] text-neutral-400 border-white/[0.08] hover:bg-white/[0.08]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Guarantee Banner */}
        <div className="p-3 rounded-2xl bg-gradient-to-r from-blue-950/40 via-[#0286FF]/10 to-transparent border border-[#0286FF]/25 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#0286FF]/20 border border-[#0286FF]/30 flex items-center justify-center text-[#0286FF]">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-JakartaBold text-white">100% Genuine Certified Parts</p>
              <p className="text-[10px] text-neutral-400 font-JakartaMedium">
                Direct from verified OEM importers with 1-year warranty
              </p>
            </div>
          </div>
          <span className="text-[10px] font-JakartaBold text-cyan-300 bg-cyan-500/10 px-2 py-1 rounded-lg border border-cyan-500/20">
            Lagos Hub
          </span>
        </div>

        {/* Parts Grid / List */}
        <div className="space-y-2.5">
          {filteredParts.map((part) => (
            <div
              key={part.id}
              className="glass-panel glass-panel-hover rounded-2xl p-3.5 border border-white/[0.08] flex flex-col gap-2.5 transition-all"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-JakartaBold px-2 py-0.5 rounded-md bg-blue-500/15 text-blue-400 border border-blue-500/30">
                      {part.brand}
                    </span>
                    <div className="flex items-center gap-0.5 text-[10px] font-bold text-amber-400">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      <span>{part.rating}</span>
                    </div>
                  </div>
                  <h4 className="text-xs font-JakartaBold text-white mt-1 leading-snug">
                    {part.name}
                  </h4>
                  <p className="text-[11px] text-neutral-400 font-JakartaMedium mt-0.5">
                    Fits: {part.compatibility}
                  </p>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-sm font-JakartaBold text-white block">
                    ₦{part.priceNaira.toLocaleString()}
                  </span>
                  <span className="text-[10px] text-emerald-400 font-JakartaMedium flex items-center justify-end gap-1 mt-0.5">
                    <Clock className="w-3 h-3" />
                    <span>{part.etaMins}m dispatch</span>
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-white/[0.06]">
                <span className="text-[10px] text-neutral-400 font-JakartaMedium truncate max-w-[200px]">
                  {part.description}
                </span>

                <button
                  onClick={() => {
                    soundEngine.playClick();
                    setSelectedPart(part);
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-[#0286FF] hover:bg-blue-500 active:scale-95 text-white font-JakartaBold text-xs shadow-md transition-all flex items-center gap-1.5"
                >
                  <ShoppingCart className="w-3 h-3" />
                  <span>Order Part</span>
                </button>
              </div>
            </div>
          ))}

          {filteredParts.length === 0 && (
            <div className="p-8 text-center glass-panel rounded-2xl border border-white/[0.08]">
              <Wrench className="w-8 h-8 text-neutral-500 mx-auto mb-2" />
              <p className="text-xs font-JakartaBold text-white">No matching auto parts found</p>
              <p className="text-[11px] text-neutral-400 mt-1">
                Try searching for a different car model, battery, or brake type.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Confirm Order Modal */}
      {selectedPart && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-md">
          <div className="glass-panel w-full max-w-md rounded-3xl p-5 border border-white/15 shadow-2xl text-white animate-in zoom-in-95 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Wrench className="w-4 h-4 text-[#0286FF]" />
                <h3 className="text-sm font-JakartaBold text-white">Confirm Auto Part Order</h3>
              </div>
              <button
                onClick={() => setSelectedPart(null)}
                className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-neutral-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="p-3 bg-white/[0.04] rounded-2xl border border-white/[0.08] space-y-1.5">
              <h4 className="text-xs font-JakartaBold text-white">{selectedPart.name}</h4>
              <p className="text-[11px] text-neutral-300 font-JakartaMedium">Brand: {selectedPart.brand}</p>
              <p className="text-[11px] text-neutral-400 font-JakartaMedium">
                Compatibility: {selectedPart.compatibility}
              </p>
            </div>

            {/* Delivery Details */}
            <div className="p-3 bg-white/[0.03] rounded-2xl border border-white/[0.08] space-y-2 text-xs">
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#0286FF] mt-0.5 shrink-0" />
                <div>
                  <span className="text-[10px] text-neutral-400 font-JakartaBold uppercase">Delivery Location</span>
                  <p className="text-white font-JakartaMedium">{userAddress || 'Victoria Island, Lagos'}</p>
                </div>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-white/[0.06]">
                <span className="text-neutral-400">Estimated Delivery Time</span>
                <span className="font-JakartaBold text-emerald-400">{selectedPart.etaMins} Minutes (Express Dispatch)</span>
              </div>
              <div className="flex items-center justify-between pt-1">
                <span className="text-neutral-400">Total Price</span>
                <span className="text-sm font-JakartaBold text-[#0286FF]">
                  ₦{selectedPart.priceNaira.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-2 pt-1">
              <button
                onClick={() => setSelectedPart(null)}
                className="flex-1 py-2.5 rounded-xl border border-white/10 text-xs font-JakartaMedium text-neutral-300 hover:bg-white/5"
              >
                Cancel
              </button>
              <button
                onClick={() => handleOrderPart(selectedPart)}
                className="flex-1 py-2.5 rounded-xl bg-[#0286FF] hover:bg-blue-500 text-xs font-JakartaBold text-white shadow-[0_0_15px_rgba(2,134,255,0.4)] flex items-center justify-center gap-1.5"
              >
                <Truck className="w-3.5 h-3.5" />
                <span>Confirm & Dispatch</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
