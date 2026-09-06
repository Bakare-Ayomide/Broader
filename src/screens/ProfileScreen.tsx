import React from 'react';
import { useBroaderStore } from '../store/useBroaderStore';
import { LogOut, ShieldCheck, Star, Wallet, ChevronRight, MapPin, Car } from 'lucide-react';

export const ProfileScreen: React.FC = () => {
  const user = useBroaderStore((s) => s.user);
  const signOut = useBroaderStore((s) => s.signOut);
  const rides = useBroaderStore((s) => s.rides);
  const walletBalance = useBroaderStore((s) => s.walletBalance);
  const setScreen = useBroaderStore((s) => s.setScreen);
  const driverApplication = useBroaderStore((s) => s.driverApplication);
  const setIsDriverMode = useBroaderStore((s) => s.setIsDriverMode);

  return (
    <div className="flex flex-col min-h-full bg-[#F6F8FA] p-5 pb-8 select-none">
      <div className="flex items-center justify-between my-2">
        <h2 className="text-2xl font-JakartaBold text-slate-900 tracking-tight">My Profile</h2>
        <button
          onClick={signOut}
          className="text-xs font-JakartaBold text-rose-600 hover:text-rose-700 bg-rose-50 px-3 py-1.5 rounded-full border border-rose-200 transition-colors flex items-center gap-1"
        >
          <LogOut className="w-3 h-3" />
          <span>Log Out</span>
        </button>
      </div>

      {/* Avatar Section */}
      <div className="flex flex-col items-center justify-center my-4">
        <div className="relative">
          <img
            src={user.imageUrl}
            alt={user.fullName}
            className="w-[96px] h-[96px] rounded-full object-cover border-4 border-white shadow-md shadow-neutral-300"
          />
          <div className="absolute bottom-1 right-1 w-6 h-6 rounded-full bg-[#0286FF] text-white flex items-center justify-center ring-2 ring-white shadow-xs">
            <ShieldCheck className="w-3.5 h-3.5" />
          </div>
        </div>

        <h3 className="text-lg font-JakartaBold text-slate-900 mt-3">{user.fullName}</h3>
        <p className="text-xs font-JakartaMedium text-slate-500">{user.email}</p>

        <div className="flex items-center gap-1 mt-1 text-[11px] font-JakartaSemiBold text-slate-500">
          <MapPin className="w-3.5 h-3.5 text-[#0286FF]" />
          <span>Lagos, Nigeria</span>
        </div>

        {/* Rider Stats badge */}
        <div className="flex items-center gap-4 mt-3 bg-white px-4 py-2 rounded-2xl border border-slate-200 shadow-xs text-xs">
          <div className="flex items-center gap-1 text-slate-700 font-JakartaBold">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>5.0 Rating</span>
          </div>
          <span className="text-slate-300">|</span>
          <div className="text-slate-700 font-JakartaBold">
            <span>{rides.length} Rides Taken</span>
          </div>
        </div>
      </div>

      {/* Broader Wallet Integration */}
      <div
        onClick={() => setScreen('wallet')}
        className="bg-white hover:bg-slate-50 border border-slate-200 rounded-2xl p-4 shadow-xs mb-3 flex items-center justify-between cursor-pointer transition-all active:scale-[0.99]"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0286FF] flex items-center justify-center">
            <Wallet className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-JakartaBold text-slate-900">Broader Wallet</p>
            <p className="text-[11px] font-JakartaMedium text-slate-400">
              Balance: <span className="font-JakartaBold text-emerald-600">₦{walletBalance.toLocaleString()}</span>
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1 text-xs font-JakartaBold text-[#0286FF]">
          <span>Top Up</span>
          <ChevronRight className="w-4 h-4" />
        </div>
      </div>

      {/* Driver Partner Fleet Entry */}
      <div
        onClick={() => {
          if (driverApplication?.status === 'approved') {
            setIsDriverMode(true);
            setScreen('driver-home');
          } else {
            setScreen('become-driver');
          }
        }}
        className="bg-white hover:bg-slate-50 border border-slate-200 rounded-2xl p-4 shadow-xs mb-3 flex items-center justify-between cursor-pointer transition-all active:scale-[0.99]"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Car className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-JakartaBold text-slate-900">
              {driverApplication?.status === 'approved'
                ? 'Driver Dashboard Mode'
                : driverApplication?.status === 'pending'
                ? 'Driver Application (Pending)'
                : 'Become a Broader Driver'}
            </p>
            <p className="text-[11px] font-JakartaMedium text-slate-400">
              {driverApplication?.status === 'approved'
                ? 'Switch to active driver console'
                : driverApplication?.status === 'pending'
                ? 'Under regulatory review in Lagos'
                : 'Earn up to ₦350,000/month driving in Nigeria'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1 text-xs font-JakartaBold text-amber-600">
          <span>{driverApplication?.status === 'approved' ? 'Open' : 'Apply'}</span>
          <ChevronRight className="w-4 h-4" />
        </div>
      </div>

      {/* Profile Details (Clean, read-only) */}
      <div className="bg-white rounded-2xl shadow-xs border border-slate-200 p-4 space-y-3">
        <div>
          <label className="block text-xs font-JakartaMedium text-slate-500 mb-1">
            First name
          </label>
          <input
            type="text"
            readOnly
            value={user.firstName}
            className="w-full px-3.5 py-2.5 bg-[#F6F8FA] border border-slate-200 rounded-xl text-xs font-JakartaSemiBold text-slate-800"
          />
        </div>

        <div>
          <label className="block text-xs font-JakartaMedium text-slate-500 mb-1">
            Last name
          </label>
          <input
            type="text"
            readOnly
            value={user.lastName}
            className="w-full px-3.5 py-2.5 bg-[#F6F8FA] border border-slate-200 rounded-xl text-xs font-JakartaSemiBold text-slate-800"
          />
        </div>

        <div>
          <label className="block text-xs font-JakartaMedium text-slate-500 mb-1">
            Email
          </label>
          <input
            type="text"
            readOnly
            value={user.email}
            className="w-full px-3.5 py-2.5 bg-[#F6F8FA] border border-slate-200 rounded-xl text-xs font-JakartaSemiBold text-slate-800"
          />
        </div>

        <div>
          <label className="block text-xs font-JakartaMedium text-slate-500 mb-1">
            Phone
          </label>
          <input
            type="text"
            readOnly
            value={user.phone}
            className="w-full px-3.5 py-2.5 bg-[#F6F8FA] border border-slate-200 rounded-xl text-xs font-JakartaSemiBold text-slate-800"
          />
        </div>
      </div>
    </div>
  );
};
