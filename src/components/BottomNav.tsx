import React from 'react';
import { useBroaderStore } from '../store/useBroaderStore';
import { ScreenType } from '../types';
import { Home, Clock, MessageSquare, User } from 'lucide-react';
import { soundEngine } from '../services/soundNotification';

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
    <div className="w-full px-4 pb-3 pt-1.5 shrink-0 pointer-events-auto select-none bg-[#0c1420]/95 backdrop-blur-2xl border-t border-white/[0.08] shadow-[0_-8px_32px_rgba(0,0,0,0.9)]">
      <nav className="w-full h-[56px] rounded-2xl px-3 flex items-center justify-around bg-[#131b26]/90 border border-white/[0.1] shadow-[0_8px_24px_rgba(0,0,0,0.8)]">
        {tabs.map((tab) => {
          const focused = currentScreen === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => {
                soundEngine.playClick();
                setScreen(tab.id);
              }}
              className="flex flex-col items-center justify-center p-1 transition-all group active:scale-95"
              aria-label={tab.label}
            >
              <div
                className={`rounded-xl w-10 h-10 flex items-center justify-center transition-all ${
                  focused
                    ? 'bg-[#9EE6B5] text-[#020408] shadow-[0_0_14px_rgba(158,230,181,0.6)] font-bold'
                    : 'bg-transparent text-neutral-400 hover:text-white hover:bg-white/[0.06]'
                }`}
              >
                <Icon className="w-4 h-4 stroke-[2.2]" />
              </div>
            </button>
          );
        })}
      </nav>
    </div>
  );
};
