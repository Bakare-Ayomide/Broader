import React from 'react';
import { useBroaderStore } from '../store/useBroaderStore';
import { ScreenType } from '../types';

export const BottomNav: React.FC = () => {
  const currentScreen = useBroaderStore((s) => s.currentScreen);
  const setScreen = useBroaderStore((s) => s.setScreen);

  const tabs: { id: ScreenType; label: string; icon: string }[] = [
    { id: 'home', label: 'Home', icon: '/assets/icons/home.png' },
    { id: 'rides', label: 'Rides', icon: '/assets/icons/list.png' },
    { id: 'chat', label: 'Chat', icon: '/assets/icons/chat.png' },
    { id: 'profile', label: 'Profile', icon: '/assets/icons/profile.png' },
  ];

  return (
    <div className="w-full px-5 pb-5 pt-2 shrink-0 pointer-events-auto select-none bg-transparent">
      <nav className="w-full bg-[#333333] h-[68px] rounded-full px-4 flex items-center justify-between shadow-xl">
        {tabs.map((tab) => {
          const focused = currentScreen === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setScreen(tab.id)}
              className={`flex items-center justify-center transition-all ${
                focused ? 'p-1 rounded-full bg-[#0286FF]/20' : 'p-1'
              }`}
              aria-label={tab.label}
            >
              <div
                className={`rounded-full w-11 h-11 flex items-center justify-center transition-all ${
                  focused ? 'bg-[#0286FF]' : 'bg-transparent hover:bg-neutral-700/50'
                }`}
              >
                <img
                  src={tab.icon}
                  alt={tab.label}
                  className="w-6 h-6 object-contain brightness-0 invert"
                />
              </div>
            </button>
          );
        })}
      </nav>
    </div>
  );
};
