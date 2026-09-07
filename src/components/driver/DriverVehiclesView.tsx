import React, { useState } from 'react';
import { useBroaderStore } from '../../store/useBroaderStore';
import {
  Car,
  CheckCircle2,
  Plus,
  ShieldCheck,
  FileCheck,
  AlertCircle,
  X,
  ChevronRight,
  Info,
} from 'lucide-react';
import { DriverVehicle } from '../../types';

export const DriverVehiclesView: React.FC = () => {
  const driverVehicles = useBroaderStore((s) => s.driverVehicles);
  const activeDriverVehicleId = useBroaderStore((s) => s.activeDriverVehicleId);
  const setActiveDriverVehicleId = useBroaderStore((s) => s.setActiveDriverVehicleId);
  const addDriverVehicle = useBroaderStore((s) => s.addDriverVehicle);

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [newVehName, setNewVehName] = useState('');
  const [newVehPlate, setNewVehPlate] = useState('');
  const [newVehCategory, setNewVehCategory] = useState<'car' | 'suv' | 'van' | 'tricycle' | 'freight' | 'ambulance'>('car');
  const [newVehColor, setNewVehColor] = useState('');

  const handleAddVehicle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVehName || !newVehPlate) return;

    const newVehicle: DriverVehicle = {
      id: 'veh_' + Date.now().toString().slice(-4),
      name: newVehName,
      category: newVehCategory,
      categoryName:
        newVehCategory === 'car'
          ? 'Broader Go (Car)'
          : newVehCategory === 'tricycle'
          ? 'Broader Keke'
          : newVehCategory === 'van'
          ? 'Broader Shuttle'
          : newVehCategory === 'freight'
          ? 'Broader Heavy Freight'
          : 'Broader Emergency Ambulance',
      plateNumber: newVehPlate.toUpperCase(),
      color: newVehColor || 'White',
      year: 2022,
      seats: newVehCategory === 'van' ? 14 : newVehCategory === 'tricycle' ? 3 : 4,
      isVerified: true,
      isActive: false,
    };

    addDriverVehicle(newVehicle);
    setAddModalOpen(false);
    setNewVehName('');
    setNewVehPlate('');
  };

  return (
    <div className="space-y-3 pb-6 animate-in fade-in duration-200">
      {/* Header & Add Button */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xs font-JakartaBold text-slate-900 uppercase tracking-wide">
            Registered Fleet Vehicles
          </h3>
          <p className="text-[11px] text-slate-400 font-JakartaMedium">Select which vehicle you are driving right now</p>
        </div>

        <button
          onClick={() => setAddModalOpen(true)}
          className="px-3 py-1.5 rounded-xl bg-blue-50 text-[#0286FF] hover:bg-blue-100 text-xs font-JakartaBold border border-blue-200 flex items-center gap-1 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Vehicle</span>
        </button>
      </div>

      {/* Vehicle Cards List */}
      <div className="space-y-2.5">
        {driverVehicles.map((vehicle) => {
          const isActive = vehicle.id === activeDriverVehicleId;

          return (
            <div
              key={vehicle.id}
              onClick={() => setActiveDriverVehicleId(vehicle.id)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                isActive
                  ? 'bg-blue-50/50 border-blue-400 ring-2 ring-blue-500/20 shadow-xs'
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                      isActive ? 'bg-[#0286FF] text-white shadow-xs' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    <Car className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-xs font-JakartaBold text-slate-900">{vehicle.name}</h4>
                      {isActive && (
                        <span className="px-2 py-0.5 rounded-full bg-blue-600 text-white text-[9px] font-JakartaBold">
                          ACTIVE
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] font-mono font-bold text-slate-700 mt-0.5">{vehicle.plateNumber}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div
                    className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
                      isActive
                        ? 'border-[#0286FF] bg-[#0286FF] text-white'
                        : 'border-slate-300 bg-white'
                    }`}
                  >
                    {isActive && <CheckCircle2 className="w-3.5 h-3.5" />}
                  </div>
                </div>
              </div>

              {/* Status details */}
              <div className="mt-3 pt-3 border-t border-slate-100 grid grid-cols-3 gap-1 text-[10px]">
                <div className="flex items-center gap-1 text-emerald-600 font-JakartaMedium">
                  <ShieldCheck className="w-3 h-3" />
                  <span>FRSC Verified</span>
                </div>
                <div className="flex items-center gap-1 text-slate-500 font-JakartaMedium">
                  <span>Color: {vehicle.color}</span>
                </div>
                <div className="flex items-center gap-1 text-slate-500 font-JakartaMedium text-right justify-end">
                  <span>{vehicle.seats} Seats</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Compliance / Inspection Info Pill */}
      <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-start gap-2.5 text-xs">
        <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
        <p className="text-[11px] text-slate-500 leading-relaxed font-JakartaMedium">
          All active vehicles must carry valid <strong>Lagos State Ministry of Transportation (VIS) Roadworthiness</strong>, <strong>Comprehensive / 3rd-Party Insurance</strong>, and valid Hackney Carriage permit.
        </p>
      </div>

      {/* ADD VEHICLE MODAL */}
      {addModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-sm bg-white rounded-3xl p-5 shadow-2xl border border-slate-200 space-y-3.5 animate-in slide-in-from-bottom-4 duration-200">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Car className="w-4 h-4 text-[#0286FF]" />
                <h3 className="text-sm font-JakartaBold text-slate-900">Add Vehicle to Fleet</h3>
              </div>
              <button
                onClick={() => setAddModalOpen(false)}
                className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddVehicle} className="space-y-3">
              <div>
                <label className="text-[11px] font-JakartaBold text-slate-700 block mb-1">
                  Vehicle Make & Model
                </label>
                <input
                  type="text"
                  value={newVehName}
                  onChange={(e) => setNewVehName(e.target.value)}
                  placeholder="e.g. Toyota Camry 2022"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-JakartaBold text-slate-900 focus:outline-hidden focus:border-[#0286FF]"
                  required
                />
              </div>

              <div>
                <label className="text-[11px] font-JakartaBold text-slate-700 block mb-1">
                  Service Category
                </label>
                <select
                  value={newVehCategory}
                  onChange={(e) => setNewVehCategory(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-JakartaMedium text-slate-800 focus:outline-hidden focus:border-[#0286FF]"
                >
                  <option value="car">Broader Go (Sedan / Car)</option>
                  <option value="suv">Broader Executive (SUV)</option>
                  <option value="tricycle">Broader Keke (Tricycle)</option>
                  <option value="van">Broader Shuttle (Bus / Van)</option>
                  <option value="freight">Broader Freight (Truck)</option>
                  <option value="ambulance">Broader Ambulance</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-JakartaBold text-slate-700 block mb-1">
                    Plate Number
                  </label>
                  <input
                    type="text"
                    value={newVehPlate}
                    onChange={(e) => setNewVehPlate(e.target.value)}
                    placeholder="e.g. LSR-419-AA"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-hidden focus:border-[#0286FF]"
                    required
                  />
                </div>
                <div>
                  <label className="text-[11px] font-JakartaBold text-slate-700 block mb-1">
                    Exterior Color
                  </label>
                  <input
                    type="text"
                    value={newVehColor}
                    onChange={(e) => setNewVehColor(e.target.value)}
                    placeholder="e.g. Silver / Black"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-JakartaMedium text-slate-900 focus:outline-hidden focus:border-[#0286FF]"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-[#0286FF] hover:bg-blue-600 text-white text-xs font-JakartaBold shadow-md shadow-blue-500/20 active:scale-95 transition-all flex items-center justify-center gap-1.5"
                >
                  <span>Register & Verify Vehicle</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
