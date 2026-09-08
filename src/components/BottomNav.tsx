import React from 'react';
import { useBroaderStore } from '../store/useBroaderStore';
import { ScreenType } from '../types';
import { Home, Clock, MessageSquare, User } from 'lucide-react';

export const BottomNav: React.FC = () => {
  const currentScreen = useBroaderStore((s) => s.currentScreen);
  const setScreen = useBroaderStore((s) => s.setScreen);

  const tabs: { id: ScreenType; label: string; icon: React.ElementType }[] = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'rides', label: 'Rides', icon: Clock },
    { id: 'chat', label: 'Chat', icon: MessageSquare },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <div className="w-full px-5 pb-5 pt-2 shrink-0 pointer-events-auto select-none bg-transparent">
      <nav className="w-full glass-nav h-[66px] rounded-full px-4 flex items-center justify-between shadow-[0_12px_40px_rgba(0,0,0,0.9)] border border-white/[0.12] backdrop-blur-2xl">
        {tabs.map((tab) => {
          const focused = currentScreen === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setScreen(tab.id)}
              className="flex flex-col items-center justify-center p-1 transition-all group"
              aria-label={tab.label}
            >
              <div
                className={`rounded-full w-11 h-11 flex items-center justify-center transition-all ${
                  focused
                    ? 'bg-[#0286FF] text-white shadow-[0_0_16px_rgba(2,134,255,0.6)] scale-105'
                    : 'bg-transparent text-neutral-400 hover:text-white hover:bg-white/[0.06]'
                }`}
              >
                <Icon className="w-5 h-5 stroke-[2.2]" />
              </div>
            </button>
          );
        })}
      </nav>
    </div>
  );
};
