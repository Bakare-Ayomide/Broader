import React, { useState } from 'react';
import { useBroaderStore } from '../store/useBroaderStore';
import { ChevronRight, Sparkles, Shield, ArrowRight } from 'lucide-react';
import { soundEngine } from '../services/soundNotification';

export const WelcomeScreen: React.FC = () => {
  const setScreen = useBroaderStore((s) => s.setScreen);
  const [activeIndex, setActiveIndex] = useState(0);

  const onboarding = [
    {
      id: 1,
      title: 'The perfect ride is just a tap away',
      tag: 'LAGOS URBAN MOBILITY',
      description: 'Find premium sedans, executive chauffeurs, tricycles, and express rides effortlessly across Lagos.',
      image: '/assets/images/onboarding1.png',
    },
    {
      id: 2,
      title: 'Move people, freight & cargo seamlessly',
      tag: 'ALL-IN-ONE ECOSYSTEM',
      description: 'From interstate logistics and commercial haulage to emergency ambulances and car rentals.',
      image: '/assets/images/onboarding2.png',
    },
    {
      id: 3,
      title: "Your journey, your way. Let's ride.",
      tag: 'REAL-TIME TELEMETRICS',
      description: 'Live 3D navigation, verified background-checked drivers, and transparent cashless pricing.',
      image: '/assets/images/onboarding3.png',
    },
  ];

  const isLastSlide = activeIndex === onboarding.length - 1;

  const handleNext = () => {
    soundEngine.playClick();
    if (isLastSlide) {
      setScreen('sign-up');
    } else {
      setActiveIndex((prev) => prev + 1);
    }
  };

  const handleSkip = () => {
    soundEngine.playClick();
    setScreen('sign-up');
  };

  return (
    <div className="flex flex-col h-full items-center justify-between bg-[#020408] text-white px-5 py-4 select-none relative overflow-hidden">
      {/* Subtle Background Glow Spheres */}
      <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-[#0286FF]/15 blur-[80px] pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-72 h-72 rounded-full bg-cyan-500/10 blur-[90px] pointer-events-none" />

      {/* Top bar with Logo & Skip button */}
      <div className="w-full flex justify-between items-center pt-2 relative z-10">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-xl bg-[#0286FF] flex items-center justify-center shadow-[0_0_12px_rgba(2,134,255,0.6)]">
            <span className="font-JakartaExtraBold text-white text-xs tracking-tighter">B</span>
          </div>
          <span className="font-JakartaExtraBold text-sm text-white tracking-tight">BROADER</span>
        </div>

        <button
          onClick={handleSkip}
          className="text-neutral-400 text-xs font-JakartaBold hover:text-white transition-colors py-1.5 px-3 rounded-full hover:bg-white/10"
        >
          Skip
        </button>
      </div>

      {/* Main Slide Content */}
      <div className="flex-1 flex flex-col items-center justify-center w-full max-w-sm text-center my-auto relative z-10">
        {/* Visual Showcase Card with Ambient Glass Backdrop */}
        <div className="relative w-full h-[250px] flex items-center justify-center rounded-3xl p-4 glass-panel border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.8)] overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-[#0286FF]/10 via-transparent to-black/60 pointer-events-none" />
          <img
            src={onboarding[activeIndex].image}
            alt="Onboarding"
            className="w-full h-full object-contain relative z-10 filter drop-shadow-[0_12px_24px_rgba(0,0,0,0.8)]"
          />
        </div>

        {/* Eyebrow Tag */}
        <div className="mt-6 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0286FF]/15 border border-[#0286FF]/30 text-[#0286FF] text-[10px] font-JakartaBold tracking-wider uppercase">
          <Sparkles className="w-3 h-3" />
          <span>{onboarding[activeIndex].tag}</span>
        </div>

        {/* Slide Title */}
        <h2 className="text-white text-xl sm:text-2xl font-JakartaBold mt-3 px-1 tracking-tight leading-snug">
          {onboarding[activeIndex].title}
        </h2>

        {/* Slide Description */}
        <p className="text-xs font-JakartaMedium text-neutral-400 mt-2 px-3 leading-relaxed max-w-xs">
          {onboarding[activeIndex].description}
        </p>

        {/* Carousel Pagination Dots */}
        <div className="flex items-center justify-center gap-2 mt-6">
          {onboarding.map((item, idx) => (
            <button
              key={item.id}
              onClick={() => {
                soundEngine.playClick();
                setActiveIndex(idx);
              }}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                activeIndex === idx
                  ? 'w-7 bg-[#0286FF] shadow-[0_0_12px_rgba(2,134,255,0.7)]'
                  : 'w-2 bg-white/20 hover:bg-white/40'
              }`}
              aria-label={`Slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Action Button */}
      <div className="w-full max-w-sm pb-4 pt-2 relative z-10">
        <button
          onClick={handleNext}
          className="w-full py-3.5 rounded-2xl bg-[#0286FF] hover:bg-blue-500 active:scale-[0.98] text-white font-JakartaBold text-sm shadow-[0_0_24px_rgba(2,134,255,0.4)] transition-all flex items-center justify-center gap-2"
        >
          <span>{isLastSlide ? 'Get Started' : 'Next'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
