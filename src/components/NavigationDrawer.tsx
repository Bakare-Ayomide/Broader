import React from 'react';
import { useBroaderStore } from '../store/useBroaderStore';
import { ScreenType } from '../types';
import { soundEngine } from '../services/soundNotification';
import {
  X,
  User,
  Clock,
  Wallet,
  MessageSquare,
  Car,
  Shield,
  Settings,
  HelpCircle,
  LogOut,
  ChevronRight,
  Star,
  MapPin,
  Sparkles,
  Phone,
} from 'lucide-react';

interface NavigationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchMode: () => void;
}

export const NavigationDrawer: React.FC<NavigationDrawerProps> = ({
  isOpen,
  onClose,
  onSwitchMode,
}) => {
  const user = useBroaderStore((s) => s.user);
  const setScreen = useBroaderStore((s) => s.setScreen);
  const isDriverMode = useBroaderStore((s) => s.isDriverMode);
  const walletBalance = useBroaderStore((s) => s.walletBalance);
  const signOut = useBroaderStore((s) => s.signOut);

  if (!isOpen) return null;

  const navigateTo = (screen: ScreenType) => {
    soundEngine.playClick();
    setScreen(screen);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex select-none animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
      />

      {/* Drawer Panel */}
      <div className="relative w-[310px] sm:w-[350px] max-w-[85vw] h-full bg-[#0c1420]/98 backdrop-blur-2xl border-r border-white/10 shadow-[20px_0_50px_rgba(0,0,0,0.95)] flex flex-col justify-between z-10 animate-in slide-in-from-left duration-300">
        {/* Top Header & User Profile Info */}
        <div className="p-5 border-b border-white/[0.08]">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#9EE6B5] shadow-[0_0_8px_#9EE6B5] animate-pulse" />
              <span className="text-xs font-JakartaBold text-[#9EE6B5] uppercase tracking-wider">
                {isDriverMode ? 'Driver Partner' : 'BROADER'}
              </span>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-neutral-300 hover:text-white transition-all active:scale-90"
              title="Close Menu"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* User Card */}
          <div
            onClick={() => navigateTo('profile')}
            className="flex items-center gap-3.5 p-3 rounded-2xl bg-[#131b26]/90 border border-white/[0.08] hover:border-[#9EE6B5]/40 cursor-pointer transition-all active:scale-[0.99] group"
          >
            <div className="relative">
              <img
                src={
                  user.imageUrl ||
                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&auto=format&fit=crop&q=80'
                }
                alt={user.firstName || user.fullName}
                referrerPolicy="no-referrer"
                className="w-12 h-12 rounded-2xl object-cover ring-2 ring-[#9EE6B5]/30 group-hover:ring-[#9EE6B5] transition-all"
              />
              <div className="absolute -bottom-1 -right-1 bg-[#9EE6B5] text-[#020408] rounded-full p-0.5 shadow-md">
                <Star className="w-2.5 h-2.5 fill-black" />
              </div>
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <h3 className="text-sm font-JakartaBold text-white truncate group-hover:text-[#9EE6B5] transition-colors">
                  {user.fullName || `${user.firstName} ${user.lastName}`}
                </h3>
              </div>
              <p className="text-[11px] font-JakartaMedium text-neutral-400 truncate">
                {user.email || 'chris.baker@broader.ng'}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[10px] font-JakartaBold text-amber-400 bg-amber-400/10 px-1.5 py-0.5 rounded-md">
                  ★ 4.92 Rating
                </span>
              </div>
            </div>

            <ChevronRight className="w-4 h-4 text-neutral-500 group-hover:text-[#9EE6B5] transition-colors shrink-0" />
          </div>

          {/* Quick Mode Switcher Pill Banner */}
          <div className="mt-3">
            <button
              onClick={() => {
                onSwitchMode();
                onClose();
              }}
              className={`w-full py-2.5 px-3.5 rounded-xl border flex items-center justify-between font-JakartaBold text-xs transition-all active:scale-[0.98] ${
                isDriverMode
                  ? 'bg-[#9EE6B5]/15 border-[#9EE6B5]/40 text-[#9EE6B5] hover:bg-[#9EE6B5]/25'
                  : 'bg-amber-500/15 border-amber-500/40 text-amber-400 hover:bg-amber-500/25'
              }`}
            >
              <div className="flex items-center gap-2">
                <Car className="w-4 h-4" />
                <span>{isDriverMode ? 'Switch to Passenger Mode' : 'Switch to Driver Mode'}</span>
              </div>
              <Sparkles className="w-3.5 h-3.5 animate-spin duration-3000" />
            </button>
          </div>
        </div>

        {/* Scrollable Navigation Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-1.5 no-scrollbar">
          {/* Wallet Shortcut */}
          <button
            onClick={() => navigateTo('wallet')}
            className="w-full flex items-center justify-between p-3 rounded-2xl bg-[#131b26]/70 hover:bg-[#182333] border border-white/[0.06] hover:border-white/15 text-left transition-all active:scale-[0.99] group"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#9EE6B5]/15 text-[#9EE6B5] flex items-center justify-center group-hover:scale-105 transition-transform">
                <Wallet className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-JakartaBold text-white">Broader Wallet</p>
                <p className="text-[10px] text-neutral-400 font-JakartaMedium">Cards, NGN Balance & Top-Up</p>
              </div>
            </div>
            <span className="text-xs font-JakartaBold text-[#9EE6B5]">
              ₦{walletBalance.toLocaleString()}
            </span>
          </button>

          {/* Rides History */}
          <button
            onClick={() => navigateTo('rides')}
            className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-white/[0.05] border border-transparent hover:border-white/10 text-left transition-all active:scale-[0.99] group text-neutral-300 hover:text-white"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-cyan-500/15 text-cyan-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-JakartaBold text-white">Rides & Receipts</p>
                <p className="text-[10px] text-neutral-400 font-JakartaMedium">Trip history & statements</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-neutral-500 group-hover:text-white" />
          </button>

          {/* Messages & Chat */}
          <button
            onClick={() => navigateTo('chat')}
            className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-white/[0.05] border border-transparent hover:border-white/10 text-left transition-all active:scale-[0.99] group text-neutral-300 hover:text-white"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-purple-500/15 text-purple-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                <MessageSquare className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-JakartaBold text-white">Messages & Support</p>
                <p className="text-[10px] text-neutral-400 font-JakartaMedium">Live driver & support chats</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-neutral-500 group-hover:text-white" />
          </button>

          {/* Become a Driver (if in passenger mode) */}
          {!isDriverMode && (
            <button
              onClick={() => navigateTo('become-driver')}
              className="w-full flex items-center justify-between p-3 rounded-2xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 text-left transition-all active:scale-[0.99] group text-amber-300"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Car className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-JakartaBold text-white">Drive with Broader</p>
                  <p className="text-[10px] text-amber-300/80 font-JakartaMedium">Earn up to ₦450k/month</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-amber-400" />
            </button>
          )}

          {/* Profile & Settings */}
          <button
            onClick={() => navigateTo('profile')}
            className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-white/[0.05] border border-transparent hover:border-white/10 text-left transition-all active:scale-[0.99] group text-neutral-300 hover:text-white"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Settings className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-JakartaBold text-white">Account & Preferences</p>
                <p className="text-[10px] text-neutral-400 font-JakartaMedium">Security, language & alerts</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-neutral-500 group-hover:text-white" />
          </button>
        </div>

        {/* Bottom Drawer Footer */}
        <div className="p-4 border-t border-white/[0.08] space-y-3">
          <div className="flex items-center justify-between text-[11px] font-JakartaMedium text-neutral-400 px-2">
            <span>BROADER v3.4</span>
            <span className="text-[#9EE6B5]">Lagos Live Grid</span>
          </div>

          <button
            onClick={() => {
              soundEngine.playClick();
              signOut();
              onClose();
            }}
            className="w-full py-2.5 px-3 rounded-xl bg-white/[0.04] hover:bg-red-500/15 border border-white/10 hover:border-red-500/30 text-neutral-300 hover:text-red-400 flex items-center justify-center gap-2 text-xs font-JakartaBold transition-all active:scale-95"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );
};
