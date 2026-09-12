import React, { useState } from 'react';
import { useBroaderStore } from '../store/useBroaderStore';
import {
  Bell,
  ArrowLeft,
  CheckCheck,
  Trash2,
  Car,
  Wallet,
  ShieldCheck,
  Sparkles,
  Info,
  ChevronRight,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import { soundEngine } from '../services/soundNotification';
import { ScreenType } from '../types';

export interface NotificationItem {
  id: string;
  type: 'trip' | 'wallet' | 'safety' | 'system';
  title: string;
  message: string;
  timestamp: string;
  unread: boolean;
  action?: {
    label: string;
    screen: ScreenType;
  };
}

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif_01',
    type: 'trip',
    title: 'Driver En Route to Pickup',
    message: 'Aminu Bello (Express Okada • LND-512-XY) is 2 minutes away at 14 Adeola Odeku St.',
    timestamp: 'Just now',
    unread: true,
    action: {
      label: 'Track Ride',
      screen: 'home',
    },
  },
  {
    id: 'notif_02',
    type: 'safety',
    title: 'Passenger Safety PIN Active',
    message: 'Your 4-digit ride verification PIN is 4921. Verify with driver to start ride.',
    timestamp: '12 mins ago',
    unread: true,
  },
  {
    id: 'notif_03',
    type: 'wallet',
    title: 'Wallet Funded Successfully',
    message: '₦45,500 has been credited to your Broader Wallet via instant bank transfer.',
    timestamp: '1 hour ago',
    unread: false,
    action: {
      label: 'View Wallet',
      screen: 'wallet',
    },
  },
  {
    id: 'notif_04',
    type: 'safety',
    title: 'Passenger Identity Verified',
    message: 'Your profile is active as a Verified Passenger with a 4.92 community rating.',
    timestamp: '3 hours ago',
    unread: false,
    action: {
      label: 'View Profile',
      screen: 'profile',
    },
  },
  {
    id: 'notif_05',
    type: 'trip',
    title: 'Trip Completed & Receipt',
    message: 'Ride to Murtala Muhammed Airport completed. Fare: ₦6,800 paid via Wallet.',
    timestamp: 'Yesterday',
    unread: false,
    action: {
      label: 'View Trip',
      screen: 'rides',
    },
  },
  {
    id: 'notif_06',
    type: 'system',
    title: 'Lagos Traffic Flow Update',
    message: 'Third Mainland Bridge and Lekki-Epe expressway are moving smoothly today.',
    timestamp: 'Yesterday',
    unread: false,
  },
];

export const NotificationsScreen: React.FC = () => {
  const setScreen = useBroaderStore((s) => s.setScreen);
  const isDriverMode = useBroaderStore((s) => s.isDriverMode);

  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [filter, setFilter] = useState<'all' | 'trip' | 'wallet' | 'safety'>('all');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const unreadCount = notifications.filter((n) => n.unread).length;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleMarkAllAsRead = () => {
    soundEngine.playSuccess();
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
    showToast('All notifications marked as read');
  };

  const handleClearAll = () => {
    soundEngine.playClick();
    setNotifications([]);
    showToast('All notifications cleared');
  };

  const handleNotificationClick = (item: NotificationItem) => {
    soundEngine.playClick();
    setNotifications((prev) =>
      prev.map((n) => (n.id === item.id ? { ...n, unread: false } : n))
    );
    if (item.action) {
      setScreen(item.action.screen);
    }
  };

  const handleDeleteItem = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    soundEngine.playClick();
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const filteredNotifications = notifications.filter((n) => {
    if (filter === 'all') return true;
    return n.type === filter;
  });

  const getIconForType = (type: NotificationItem['type']) => {
    switch (type) {
      case 'trip':
        return <Car className="w-4 h-4 text-[#9EE6B5]" />;
      case 'wallet':
        return <Wallet className="w-4 h-4 text-emerald-400" />;
      case 'safety':
        return <ShieldCheck className="w-4 h-4 text-amber-400" />;
      case 'system':
      default:
        return <Sparkles className="w-4 h-4 text-cyan-400" />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#020408] text-white select-none">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full bg-[#0c1420]/95 border border-[#9EE6B5]/40 text-[#9EE6B5] text-xs font-JakartaBold shadow-2xl flex items-center gap-2 animate-in fade-in duration-150">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top App Bar */}
      <header className="sticky top-0 z-40 bg-[#020408]/90 backdrop-blur-2xl border-b border-white/[0.08] px-4 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              soundEngine.playClick();
              setScreen(isDriverMode ? 'driver-home' : 'home');
            }}
            className="w-9 h-9 rounded-full bg-white/[0.06] hover:bg-white/10 border border-white/10 flex items-center justify-center text-neutral-300 hover:text-white transition-all active:scale-95"
            title="Back to Home"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-JakartaBold text-white tracking-tight">Notifications</h1>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-[#9EE6B5]/15 border border-[#9EE6B5]/30 text-[#9EE6B5] text-[10px] font-JakartaBold">
                  {unreadCount} new
                </span>
              )}
            </div>
            <p className="text-[11px] text-neutral-400 font-JakartaMedium">
              {isDriverMode ? 'Driver trip dispatches & updates' : 'Live trip alerts, PINs & payments'}
            </p>
          </div>
        </div>

        {notifications.length > 0 && (
          <div className="flex items-center gap-1.5">
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="px-2.5 py-1.5 rounded-xl bg-white/[0.06] hover:bg-white/10 border border-white/10 text-[11px] font-JakartaSemiBold text-neutral-200 hover:text-white flex items-center gap-1 transition-all active:scale-95"
                title="Mark all as read"
              >
                <CheckCheck className="w-3.5 h-3.5 text-[#9EE6B5]" />
                <span className="hidden sm:inline">Mark all read</span>
              </button>
            )}
            <button
              onClick={handleClearAll}
              className="w-8 h-8 rounded-full bg-white/[0.04] hover:bg-red-500/15 border border-white/10 hover:border-red-500/30 text-neutral-400 hover:text-red-400 flex items-center justify-center transition-all active:scale-95"
              title="Clear all"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </header>

      {/* Filter Tabs */}
      <div className="px-4 pt-3 pb-2 flex items-center gap-1.5 overflow-x-auto no-scrollbar border-b border-white/[0.04]">
        {[
          { id: 'all', label: 'All' },
          { id: 'trip', label: 'Trips' },
          { id: 'wallet', label: 'Wallet' },
          { id: 'safety', label: 'Safety & System' },
        ].map((tab) => {
          const isActive = filter === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                soundEngine.playClick();
                setFilter(tab.id as any);
              }}
              className={`px-3 py-1.5 rounded-full text-xs font-JakartaSemiBold whitespace-nowrap transition-all active:scale-95 ${
                isActive
                  ? 'bg-[#9EE6B5] text-[#020408] font-JakartaBold shadow-[0_0_12px_rgba(158,230,181,0.35)]'
                  : 'bg-white/[0.05] border border-white/10 text-neutral-300 hover:text-white hover:bg-white/10'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Notifications List Container */}
      <div className="flex-1 px-4 py-3 space-y-2.5 overflow-y-auto">
        {filteredNotifications.length === 0 ? (
          <div className="py-20 flex flex-col items-center justify-center text-center px-6">
            <div className="w-16 h-16 rounded-3xl bg-white/[0.04] border border-white/10 flex items-center justify-center text-neutral-500 mb-4">
              <Bell className="w-7 h-7" />
            </div>
            <h3 className="text-sm font-JakartaBold text-white mb-1">No Notifications</h3>
            <p className="text-xs text-neutral-400 max-w-xs mb-6">
              You are completely caught up! New trip alerts, ride PINs, and payments will appear here.
            </p>
            <button
              onClick={() => {
                soundEngine.playClick();
                setScreen(isDriverMode ? 'driver-home' : 'home');
              }}
              className="px-4 py-2 rounded-xl bg-[#9EE6B5] hover:bg-[#8fd8a6] text-black font-JakartaBold text-xs shadow-lg active:scale-95 transition-all"
            >
              Return to Map
            </button>
          </div>
        ) : (
          filteredNotifications.map((item) => (
            <div
              key={item.id}
              onClick={() => handleNotificationClick(item)}
              className={`p-3.5 rounded-2xl border transition-all cursor-pointer relative overflow-hidden group ${
                item.unread
                  ? 'bg-[#0c1420]/90 border-[#9EE6B5]/40 shadow-[0_0_15px_rgba(158,230,181,0.12)]'
                  : 'bg-white/[0.03] border-white/[0.08] hover:border-white/20'
              }`}
            >
              {item.unread && (
                <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-[#9EE6B5] shadow-[0_0_8px_rgba(158,230,181,0.8)]" />
              )}

              <div className="flex items-start gap-3">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${
                    item.unread
                      ? 'bg-[#9EE6B5]/15 border-[#9EE6B5]/30'
                      : 'bg-white/[0.04] border-white/10'
                  }`}
                >
                  {getIconForType(item.type)}
                </div>

                <div className="flex-1 min-w-0 pr-4">
                  <div className="flex items-center justify-between gap-2 mb-0.5">
                    <h4
                      className={`text-xs font-JakartaBold truncate ${
                        item.unread ? 'text-white' : 'text-neutral-200'
                      }`}
                    >
                      {item.title}
                    </h4>
                    <span className="text-[10px] text-neutral-400 font-JakartaMedium shrink-0 flex items-center gap-1">
                      <Clock className="w-2.5 h-2.5" />
                      {item.timestamp}
                    </span>
                  </div>

                  <p className="text-xs text-neutral-300 font-JakartaMedium leading-relaxed">
                    {item.message}
                  </p>

                  {item.action && (
                    <div className="mt-2.5 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleNotificationClick(item);
                        }}
                        className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-[#9EE6B5]/15 hover:bg-[#9EE6B5]/25 border border-[#9EE6B5]/30 text-[#9EE6B5] text-[11px] font-JakartaBold transition-all active:scale-95"
                      >
                        <span>{item.action.label}</span>
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={(e) => handleDeleteItem(item.id, e)}
                  className="opacity-0 group-hover:opacity-100 p-1 text-neutral-500 hover:text-red-400 transition-all shrink-0 self-center"
                  title="Delete notification"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
