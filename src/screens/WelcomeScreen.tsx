import React, { useState } from 'react';
import { useBroaderStore } from '../store/useBroaderStore';

export const WelcomeScreen: React.FC = () => {
  const setScreen = useBroaderStore((s) => s.setScreen);
  const [activeIndex, setActiveIndex] = useState(0);

  const onboarding = [
    {
      id: 1,
      title: 'The perfect ride is just a tap away!',
      description: 'Your journey begins with Broader. Find your ideal ride effortlessly in Lagos.',
      image: '/assets/images/onboarding1.png',
    },
    {
      id: 2,
      title: 'Best ride in your hands with Broader',
      description: 'From motorcycles and cars to vans and freight, Broader moves you everywhere.',
      image: '/assets/images/onboarding2.png',
    },
    {
      id: 3,
      title: "Your ride, your way. Let's go!",
      description: 'Enter your destination, sit back, and let Broader take care of the rest.',
      image: '/assets/images/onboarding3.png',
    },
  ];

  const isLastSlide = activeIndex === onboarding.length - 1;

  return (
    <div className="flex flex-col h-full items-center justify-between bg-white px-5 py-4 select-none">
      {/* Top bar with Skip button */}
      <div className="w-full flex justify-end items-center pt-2">
        <button
          onClick={() => setScreen('sign-up')}
          className="text-slate-800 text-sm font-JakartaBold hover:text-blue-600 transition-colors py-1 px-2"
        >
          Skip
        </button>
      </div>

      {/* Main Slide Content */}
      <div className="flex-1 flex flex-col items-center justify-center w-full max-w-sm text-center my-auto">
        <div className="relative w-full h-[260px] flex items-center justify-center">
          <img
            src={onboarding[activeIndex].image}
            alt="Onboarding"
            className="w-full h-full object-contain"
          />
        </div>

        {/* Slide Title */}
        <h2 className="text-slate-900 text-2xl sm:text-3xl font-JakartaBold mt-6 px-2 tracking-tight">
          {onboarding[activeIndex].title}
        </h2>

        {/* Slide Description */}
        <p className="text-sm font-JakartaSemiBold text-[#858585] mt-3 px-4 leading-relaxed">
          {onboarding[activeIndex].description}
        </p>

        {/* Carousel Pagination Dots */}
        <div className="flex items-center justify-center gap-2 mt-8">
          {onboarding.map((item, idx) => (
            <button
              key={item.id}
              onClick={() => setActiveIndex(idx)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                activeIndex === idx
                  ? 'w-8 bg-[#0286FF]'
                  : 'w-2.5 bg-[#E2E8F0] hover:bg-slate-300'
              }`}
              aria-label={`Slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Action Button */}
      <div className="w-full max-w-sm pb-4 pt-2">
        <button
          onClick={() => {
            if (isLastSlide) {
              setScreen('sign-up');
            } else {
              setActiveIndex((prev) => prev + 1);
            }
          }}
          className="w-full py-4 rounded-full bg-[#0286FF] hover:bg-blue-600 active:scale-[0.99] text-white font-JakartaBold text-base shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center"
        >
          {isLastSlide ? 'Get Started' : 'Next'}
        </button>
      </div>
    </div>
  );
};
