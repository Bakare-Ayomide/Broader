import React, { useState } from 'react';
import { useBroaderStore } from '../store/useBroaderStore';
import {
  LogOut,
  ShieldCheck,
  Star,
  Wallet,
  ChevronRight,
  MapPin,
  Car,
  Home,
  Briefcase,
  Plus,
  Trash2,
  Globe,
  Coins,
  Bell,
  Lock,
  Headphones,
  CheckCircle2,
  X,
  Phone,
  AlertTriangle,
} from 'lucide-react';
import { SavedLocation } from '../types';

export const ProfileScreen: React.FC = () => {
  const user = useBroaderStore((s) => s.user);
  const signOut = useBroaderStore((s) => s.signOut);
  const rides = useBroaderStore((s) => s.rides);
  const walletBalance = useBroaderStore((s) => s.walletBalance);
  const setScreen = useBroaderStore((s) => s.setScreen);
  const driverApplication = useBroaderStore((s) => s.driverApplication);
  const setIsDriverMode = useBroaderStore((s) => s.setIsDriverMode);
  const savedLocations = useBroaderStore((s) => s.savedLocations);
  const addSavedLocation = useBroaderStore((s) => s.addSavedLocation);
  const deleteSavedLocation = useBroaderStore((s) => s.deleteSavedLocation);
  const userPreferences = useBroaderStore((s) => s.userPreferences);
  const setUserPreferences = useBroaderStore((s) => s.setUserPreferences);

  const [showAddLocationModal, setShowAddLocationModal] = useState(false);
  const [newLocTitle, setNewLocTitle] = useState('');
  const [newLocAddress, setNewLocAddress] = useState('');
  const [newLocType, setNewLocType] = useState<'home' | 'work' | 'custom'>('custom');

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordToast, setPasswordToast] = useState<string | null>(null);

  const handleAddLocation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLocTitle || !newLocAddress) return;

    const newLocation: SavedLocation = {
      id: 'loc_' + Date.now().toString().slice(-4),
      title: newLocTitle,
      address: newLocAddress,
      latitude: 6.4474,
      longitude: 3.4723,
      type: newLocType,
    };

    addSavedLocation(newLocation);
    setShowAddLocationModal(false);
    setNewLocTitle('');
    setNewLocAddress('');
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordToast('Password updated securely.');
    setTimeout(() => {
      setPasswordToast(null);
      setShowPasswordModal(false);
    }, 2000);
  };

  return (
    <div className="flex flex-col min-h-full bg-[#F6F8FA] p-4 pb-12 select-none">
      {/* Header */}
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

      {/* Avatar & Verification Section */}
      <div className="flex flex-col items-center justify-center my-3">
        <div className="relative">
          <img
            src={user.imageUrl}
            alt={user.fullName}
            className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-md shadow-neutral-300"
          />
          <div className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center ring-2 ring-white shadow-xs">
            <CheckCircle2 className="w-3.5 h-3.5" />
          </div>
        </div>

        <div className="flex items-center gap-1.5 mt-2.5">
          <h3 className="text-base font-JakartaBold text-slate-900">{user.fullName}</h3>
          <span className="text-[10px] font-JakartaBold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
            Verified Rider
          </span>
        </div>
        <p className="text-xs font-JakartaMedium text-slate-500 mt-0.5">{user.email}</p>
        <p className="text-xs font-mono text-slate-400">{user.phone}</p>

        {/* Rider Stats badge */}
        <div className="flex items-center gap-4 mt-3 bg-white px-4 py-2 rounded-2xl border border-slate-200 shadow-xs text-xs">
          <div className="flex items-center gap-1 text-slate-700 font-JakartaBold">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>4.92 Rating</span>
          </div>
          <span className="text-slate-200">|</span>
          <div className="text-slate-700 font-JakartaBold">
            <span>{rides.length} Rides Taken</span>
          </div>
        </div>
      </div>

      {/* Wallet Card */}
      <div
        onClick={() => setScreen('wallet')}
        className="bg-white hover:bg-slate-50 border border-slate-200 rounded-2xl p-3.5 shadow-xs mb-3 flex items-center justify-between cursor-pointer transition-all active:scale-[0.99]"
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

      {/* Driver Switch Card */}
      <div
        onClick={() => {
          if (driverApplication?.status === 'approved') {
            setIsDriverMode(true);
            setScreen('driver-home');
          } else {
            setScreen('become-driver');
          }
        }}
        className="bg-white hover:bg-slate-50 border border-slate-200 rounded-2xl p-3.5 shadow-xs mb-3 flex items-center justify-between cursor-pointer transition-all active:scale-[0.99]"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Car className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-JakartaBold text-slate-900">
              {driverApplication?.status === 'approved'
                ? 'Driver Console (Approved)'
                : driverApplication?.status === 'pending'
                ? 'Driver Application (Pending)'
                : 'Become a Broader Driver'}
            </p>
            <p className="text-[11px] font-JakartaMedium text-slate-400">
              {driverApplication?.status === 'approved'
                ? 'Switch to operational driver mode'
                : 'Earn on your own schedule across Nigeria'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1 text-xs font-JakartaBold text-amber-600">
          <span>{driverApplication?.status === 'approved' ? 'Switch' : 'Apply'}</span>
          <ChevronRight className="w-4 h-4" />
        </div>
      </div>

      {/* Saved Locations Section */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs mb-3">
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-[#0286FF]" />
            <h4 className="text-xs font-JakartaBold text-slate-900 uppercase tracking-wider">
              Saved Locations ({savedLocations.length})
            </h4>
          </div>
          <button
            onClick={() => setShowAddLocationModal(true)}
            className="text-[11px] font-JakartaBold text-[#0286FF] hover:underline flex items-center gap-0.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Place</span>
          </button>
        </div>

        <div className="space-y-2">
          {savedLocations.map((loc) => {
            const Icon = loc.type === 'home' ? Home : loc.type === 'work' ? Briefcase : MapPin;
            return (
              <div
                key={loc.id}
                className="flex items-center justify-between p-2.5 bg-slate-50/80 rounded-xl border border-slate-200/60 text-xs"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-7 h-7 rounded-lg bg-white border border-slate-200 flex items-center justify-center shrink-0 text-slate-600">
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <div className="truncate">
                    <p className="font-JakartaBold text-slate-800 leading-none">{loc.title}</p>
                    <p className="text-[10px] text-slate-400 font-JakartaMedium truncate mt-0.5">{loc.address}</p>
                  </div>
                </div>
                <button
                  onClick={() => deleteSavedLocation(loc.id)}
                  className="p-1 text-slate-400 hover:text-red-500 transition-colors shrink-0"
                  title="Remove location"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Preferences Section: Language, Currency, Notifications */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs mb-3 space-y-3">
        <h4 className="text-xs font-JakartaBold text-slate-900 uppercase tracking-wider">
          Preferences & Region
        </h4>

        {/* Language selector */}
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-slate-500" />
            <span className="font-JakartaMedium text-slate-700">App Language</span>
          </div>
          <select
            value={userPreferences.language}
            onChange={(e) => setUserPreferences({ language: e.target.value as any })}
            className="text-xs font-JakartaSemiBold bg-slate-100 border border-slate-200 rounded-lg px-2 py-1 text-slate-800 focus:outline-none"
          >
            <option value="en">English (UK/NG)</option>
            <option value="yo">Yorùbá</option>
            <option value="ig">Asụsụ Igbo</option>
            <option value="ha">Harshen Hausa</option>
          </select>
        </div>

        {/* Currency selector */}
        <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100">
          <div className="flex items-center gap-2">
            <Coins className="w-4 h-4 text-slate-500" />
            <span className="font-JakartaMedium text-slate-700">Display Currency</span>
          </div>
          <select
            value={userPreferences.currency}
            onChange={(e) => setUserPreferences({ currency: e.target.value as any })}
            className="text-xs font-JakartaSemiBold bg-slate-100 border border-slate-200 rounded-lg px-2 py-1 text-slate-800 focus:outline-none"
          >
            <option value="NGN">Nigerian Naira (₦)</option>
            <option value="USD">US Dollar ($)</option>
          </select>
        </div>

        {/* SMS ride status toggle */}
        <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-slate-500" />
            <span className="font-JakartaMedium text-slate-700">SMS Driver ETA Alerts</span>
          </div>
          <button
            onClick={() => setUserPreferences({ smsUpdates: !userPreferences.smsUpdates })}
            className={`w-10 h-5 rounded-full transition-colors relative ${
              userPreferences.smsUpdates ? 'bg-[#0286FF]' : 'bg-slate-300'
            }`}
          >
            <span
              className={`w-4 h-4 rounded-full bg-white absolute top-0.5 transition-transform ${
                userPreferences.smsUpdates ? 'left-5' : 'left-0.5'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Security & Support Section */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs mb-3 space-y-2.5">
        <h4 className="text-xs font-JakartaBold text-slate-900 uppercase tracking-wider">
          Security & 24/7 Support
        </h4>

        <div
          onClick={() => setShowPasswordModal(true)}
          className="flex items-center justify-between text-xs p-2 rounded-xl hover:bg-slate-50 cursor-pointer"
        >
          <div className="flex items-center gap-2 text-slate-700 font-JakartaMedium">
            <Lock className="w-4 h-4 text-slate-500" />
            <span>Change Security Password</span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </div>

        <div className="flex items-center justify-between text-xs p-2 rounded-xl bg-blue-50/60 border border-blue-100">
          <div className="flex items-center gap-2 text-blue-900 font-JakartaMedium">
            <Headphones className="w-4 h-4 text-[#0286FF]" />
            <div>
              <p className="font-JakartaBold">24/7 Broader Safety Desk</p>
              <p className="text-[10px] text-blue-700 font-mono">+234 800 BROADER (Toll-Free)</p>
            </div>
          </div>
          <a
            href="tel:112"
            className="px-2.5 py-1 rounded-full bg-blue-600 text-white font-JakartaBold text-[10px]"
          >
            Call 112
          </a>
        </div>
      </div>

      {/* Add Location Modal */}
      {showAddLocationModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white w-full max-w-sm rounded-3xl p-5 shadow-2xl border border-slate-200 animate-in zoom-in-95">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-JakartaBold text-slate-900">Add Saved Place</h4>
              <button
                onClick={() => setShowAddLocationModal(false)}
                className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-500"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddLocation} className="space-y-3 text-xs">
              <div>
                <label className="block font-JakartaBold text-slate-700 mb-1">Place Name</label>
                <input
                  type="text"
                  required
                  value={newLocTitle}
                  onChange={(e) => setNewLocTitle(e.target.value)}
                  placeholder="e.g. Gym, Church, Auntie's House"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#0286FF]"
                />
              </div>

              <div>
                <label className="block font-JakartaBold text-slate-700 mb-1">Address in Lagos</label>
                <input
                  type="text"
                  required
                  value={newLocAddress}
                  onChange={(e) => setNewLocAddress(e.target.value)}
                  placeholder="e.g. 10 Lekki Phase 1, Lagos"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#0286FF]"
                />
              </div>

              <div>
                <label className="block font-JakartaBold text-slate-700 mb-1">Location Category</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['home', 'work', 'custom'] as const).map((t) => (
                    <button
                      type="button"
                      key={t}
                      onClick={() => setNewLocType(t)}
                      className={`py-1.5 rounded-lg border font-JakartaBold capitalize transition-all ${
                        newLocType === t
                          ? 'bg-[#0286FF] text-white border-[#0286FF]'
                          : 'bg-white text-slate-600 border-slate-200'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddLocationModal(false)}
                  className="flex-1 py-2.5 rounded-full border border-slate-200 text-slate-600 font-JakartaBold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-full bg-[#0286FF] text-white font-JakartaBold shadow-xs"
                >
                  Save Location
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white w-full max-w-sm rounded-3xl p-5 shadow-2xl border border-slate-200 animate-in zoom-in-95">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-JakartaBold text-slate-900">Update Password</h4>
              <button
                onClick={() => setShowPasswordModal(false)}
                className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-500"
              >
                ✕
              </button>
            </div>

            {passwordToast ? (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-center text-xs text-emerald-800 font-JakartaSemiBold">
                {passwordToast}
              </div>
            ) : (
              <form onSubmit={handlePasswordSubmit} className="space-y-3 text-xs">
                <div>
                  <label className="block font-JakartaBold text-slate-700 mb-1">Current Password</label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#0286FF]"
                  />
                </div>
                <div>
                  <label className="block font-JakartaBold text-slate-700 mb-1">New Password</label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#0286FF]"
                  />
                </div>
                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowPasswordModal(false)}
                    className="flex-1 py-2.5 rounded-full border border-slate-200 text-slate-600 font-JakartaBold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-full bg-[#0286FF] text-white font-JakartaBold shadow-xs"
                  >
                    Update Password
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
