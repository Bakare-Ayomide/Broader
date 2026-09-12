import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useBroaderStore } from '../store/useBroaderStore';
import { ArrowRight, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { soundEngine } from '../services/soundNotification';
import { BroaderLogo } from '../components/BroaderLogo';

interface OnboardingSlide {
  id: number;
  type: 'car' | 'van' | 'tricycle' | 'dispatch' | 'bicycle' | 'fright' | 'ambulance';
  tag: string;
  titleLines: string[];
  description: string;
  image: string;
  fallbackImage: string;
  imageAlt: string;
}

const ONBOARDING_SLIDES: OnboardingSlide[] = [
  {
    id: 1,
    type: 'car',
    tag: 'WELCOME TO BROADER',
    titleLines: ['Your Ride,', 'A Bigger', 'Possibility.'],
    description: 'Safe, fast, and comfortable on-demand sedans and executive chauffeurs across Lagos.',
    image: 'https://admin.cashquora.com/vehicle/car.png',
    fallbackImage: '/assets/vehicles/car.png',
    imageAlt: 'Broader Luxury Car',
  },
  {
    id: 2,
    type: 'van',
    tag: 'RIDE & CHARTER',
    titleLines: ['Vans for', 'Every Move.'],
    description: 'Spacious passenger vans for group travel, executive airport transfers, and corporate shuttles.',
    image: 'https://admin.cashquora.com/vehicle/van.png',
    fallbackImage: '/assets/vehicles/van.png',
    imageAlt: 'Broader Passenger Van',
  },
  {
    id: 3,
    type: 'tricycle',
    tag: 'COMMUNITY TRICYCLE',
    titleLines: ['Quick', 'Rides,', 'Closer to You.'],
    description: 'Affordable, nimble, and ultra-convenient community transit for your short daily journeys.',
    image: 'https://admin.cashquora.com/vehicle/tricycle.png',
    fallbackImage: '/assets/vehicles/tricycle.png',
    imageAlt: 'Broader Tricycle Keke',
  },
  {
    id: 4,
    type: 'dispatch',
    tag: 'DELIVERY MOTORCYCLE',
    titleLines: ['Delivering', 'More', 'Possibilities.'],
    description: 'Express motorcycle couriers for rapid, secure, and trackable citywide parcel delivery.',
    image: 'https://admin.cashquora.com/vehicle/Dispatch.png',
    fallbackImage: '/assets/vehicles/Dispatch.png',
    imageAlt: 'Broader Delivery Motorcycle',
  },
  {
    id: 5,
    type: 'bicycle',
    tag: 'ECO MOBILITY',
    titleLines: ['Green Moves,', 'Active Life.'],
    description: 'Zero-emission micro-mobility and swift green delivery through lively neighbourhood streets.',
    image: 'https://admin.cashquora.com/vehicle/bicycle.png',
    fallbackImage: '/assets/vehicles/bicycle.png',
    imageAlt: 'Broader Eco Bicycle',
  },
  {
    id: 6,
    type: 'fright',
    tag: 'LORRY & FREIGHT',
    titleLines: ['Heavy Haul,', 'Seamless Transit.'],
    description: 'Dependable heavy trucks and haulage logistics for commercial cargo, containers, and relocation.',
    image: 'https://admin.cashquora.com/vehicle/fright.png',
    fallbackImage: '/assets/vehicles/fright.png',
    imageAlt: 'Broader Lorry Freight Haulage',
  },
  {
    id: 7,
    type: 'ambulance',
    tag: 'EMERGENCY DISPATCH',
    titleLines: ['Help', 'Moves', 'Faster.'],
    description: 'Immediate paramedic response and rapid medical ambulance dispatch when every second counts.',
    image: 'https://admin.cashquora.com/vehicle/ambulance.png',
    fallbackImage: '/assets/vehicles/ambulance.png',
    imageAlt: 'Broader Emergency Ambulance',
  },
];

export const WelcomeScreen: React.FC = () => {
  const setScreen = useBroaderStore((s) => s.setScreen);
  const [[page, direction], setPage] = useState<[number, number]>([0, 0]);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  const activeIndex = page;
  const currentSlide = ONBOARDING_SLIDES[activeIndex];
  const isLastSlide = activeIndex === ONBOARDING_SLIDES.length - 1;
  const isFirstSlide = activeIndex === 0;

  const paginate = (newDirection: number) => {
    soundEngine.playClick();
    const nextIndex = page + newDirection;
    if (nextIndex < 0) return;
    if (nextIndex >= ONBOARDING_SLIDES.length) {
      setScreen('sign-up');
      return;
    }
    setPage([nextIndex, newDirection]);
  };

  const handleNext = () => paginate(1);
  const handlePrev = () => paginate(-1);

  const handleSkip = () => {
    soundEngine.playClick();
    setScreen('sign-up');
  };

  const handleDotClick = (targetIndex: number) => {
    if (targetIndex === activeIndex) return;
    soundEngine.playClick();
    const newDir = targetIndex > activeIndex ? 1 : -1;
    setPage([targetIndex, newDir]);
  };

  // Touch swipe support
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;

    if (diff > 45) {
      handleNext();
    } else if (diff < -45) {
      handlePrev();
    }
    setTouchStartX(null);
  };

  // Keyboard navigation support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [page, activeIndex, isLastSlide]);

  return (
    <div
      id="onboarding-container"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="min-h-screen w-full flex flex-col justify-between px-6 sm:px-8 py-6 select-none relative overflow-hidden bg-[#061D17] bg-gradient-to-br from-[#071F19] via-[#051A14] to-[#020E0A] text-white"
    >
      {/* Ambient background glow orbs matching Slide 6 midnight emerald atmosphere */}
      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-[#9EE6B5]/12 blur-[110px] pointer-events-none" />
      <div className="absolute top-1/3 -right-24 w-[450px] h-[450px] rounded-full bg-[#0CC25F]/12 blur-[140px] pointer-events-none" />
      <div className="absolute -bottom-28 left-1/4 w-80 h-80 rounded-full bg-[#9EE6B5]/10 blur-[100px] pointer-events-none" />

      {/* Top Header with app brand header logo & Skip link */}
      <header className="w-full flex items-center justify-between z-30 pt-1 sm:pt-2">
        <div id="onboarding-brand-logo" className="flex items-center gap-2">
          <BroaderLogo className="h-9 sm:h-10 w-auto" withGlow />
        </div>

        <button
          id="btn-skip-top"
          type="button"
          onClick={handleSkip}
          className="text-sm font-JakartaSemiBold text-neutral-300 hover:text-white transition-colors py-1.5 px-4 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/10"
        >
          Skip
        </button>
      </header>

      {/* Main Slide Section with In/Out Slide Transition */}
      <div className="relative flex-1 w-full flex items-center my-auto z-20 min-h-[400px] sm:min-h-[460px] overflow-visible">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={page}
            custom={direction}
            initial={{ opacity: 0, x: direction > 0 ? 60 : -60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction > 0 ? -60 : 60 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="w-full flex items-center relative"
          >
            {/* Left Column: Bold Multi-line Typography & Description */}
            <div className="relative z-20 w-[52%] sm:w-[48%] flex flex-col justify-center select-text pr-2">
              {/* Eyebrow Tag with Sparkle */}
              <div className="inline-flex items-center gap-1.5 text-[10px] sm:text-[11px] font-JakartaBold tracking-[0.16em] uppercase text-[#9EE6B5] mb-3">
                <Sparkles className="w-3.5 h-3.5 text-[#9EE6B5]" />
                <span>{currentSlide.tag}</span>
              </div>

              {/* Bold Headline */}
              <h1 className="text-[28px] sm:text-[34px] md:text-[40px] leading-[1.12] font-JakartaBold tracking-tight text-white mb-3 drop-shadow-[0_2px_12px_rgba(0,0,0,0.6)]">
                {currentSlide.titleLines.map((line, idx) => (
                  <span key={idx} className="block">
                    {line}
                  </span>
                ))}
              </h1>

              {/* Refined Description */}
              <p className="text-[12px] sm:text-[13px] md:text-sm leading-relaxed max-w-[280px] font-JakartaMedium text-[#A3C9B8]">
                {currentSlide.description}
              </p>
            </div>

            {/* Right Column: Biggest Bold Vehicles with Prominent Unique Animations */}
            <div className="absolute -right-10 sm:-right-14 md:-right-20 top-1/2 -translate-y-1/2 w-[76%] sm:w-[72%] md:w-[68%] h-[100%] flex items-center justify-end pointer-events-none z-10 overflow-visible">
              
              {/* 1. CAR: Fast Cruise Deceleration Drive-In + Headlight Beams + Suspension Hover */}
              {currentSlide.type === 'car' && (
                <div className="relative w-full h-full flex items-center justify-end">
                  {/* Glowing forward headlight beam cone flare */}
                  <motion.div
                    initial={{ opacity: 0, scaleX: 0 }}
                    animate={{ opacity: [0.25, 0.6, 0.3], scaleX: 1 }}
                    transition={{
                      opacity: { repeat: Infinity, duration: 2.2, ease: 'easeInOut' },
                      scaleX: { duration: 0.5, ease: 'easeOut' },
                    }}
                    className="absolute top-[48%] right-[40%] w-56 h-24 bg-gradient-to-l from-[#9EE6B5]/35 via-[#9EE6B5]/12 to-transparent blur-md transform -rotate-10 pointer-events-none origin-right"
                  />

                  {/* Asphalt ground contact shadow */}
                  <div className="absolute bottom-6 right-6 w-[82%] h-8 bg-black/85 blur-xl rounded-full scale-y-50" />

                  {/* Mint emerald ambient glow */}
                  <div className="absolute inset-0 bg-[#9EE6B5]/18 blur-3xl rounded-full scale-90 pointer-events-none" />

                  {/* Biggest Bold Car */}
                  <motion.div
                    initial={{ x: 300, opacity: 0, rotate: 3, scale: 0.95 }}
                    animate={{
                      x: [300, -12, 0],
                      opacity: 1,
                      rotate: [3, -1, 0],
                      scale: [0.95, 1.03, 1],
                    }}
                    transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                    className="relative z-10 w-full h-full flex items-center justify-end"
                  >
                    <motion.img
                      src={currentSlide.image}
                      alt={currentSlide.imageAlt}
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = currentSlide.fallbackImage;
                      }}
                      animate={{ y: [0, -7, 0] }}
                      transition={{ repeat: Infinity, duration: 3.4, ease: 'easeInOut' }}
                      className="w-full h-auto max-h-[125%] object-contain object-right transform scale-[1.55] sm:scale-[1.68] md:scale-[1.8] filter drop-shadow-[0_25px_35px_rgba(0,0,0,0.75)]"
                    />
                  </motion.div>
                </div>
              )}

              {/* 2. VAN: Heavy Executive Glide + Chassis Suspension Compression + Luxury Aura */}
              {currentSlide.type === 'van' && (
                <div className="relative w-full h-full flex items-center justify-end">
                  {/* Heavy chassis ground shadow */}
                  <div className="absolute bottom-6 right-8 w-[86%] h-9 bg-black/90 blur-xl rounded-full scale-y-50" />

                  {/* Executive emerald backlight */}
                  <motion.div
                    animate={{ scale: [0.85, 1, 0.85], opacity: [0.15, 0.3, 0.15] }}
                    transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
                    className="absolute inset-0 bg-[#0CC25F]/20 blur-3xl rounded-full scale-90 pointer-events-none"
                  />

                  {/* Biggest Bold Van */}
                  <motion.div
                    initial={{ x: 320, opacity: 0, scale: 0.92 }}
                    animate={{
                      x: [320, -8, 0],
                      opacity: 1,
                      scale: [0.92, 1.02, 1],
                    }}
                    transition={{ duration: 0.6, ease: [0.2, 1, 0.32, 1] }}
                    className="relative z-10 w-full h-full flex items-center justify-end"
                  >
                    <motion.img
                      src={currentSlide.image}
                      alt={currentSlide.imageAlt}
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = currentSlide.fallbackImage;
                      }}
                      animate={{ y: [0, -5, 0] }}
                      transition={{ repeat: Infinity, duration: 3.8, ease: 'easeInOut' }}
                      className="w-full h-auto max-h-[125%] object-contain object-right transform scale-[1.52] sm:scale-[1.65] md:scale-[1.78] filter drop-shadow-[0_26px_38px_rgba(0,0,0,0.8)]"
                    />
                  </motion.div>
                </div>
              )}

              {/* 3. TRICYCLE: Nimble Swerve Arrival + Concentric Energy Arrival Rings + Engine Vibration */}
              {currentSlide.type === 'tricycle' && (
                <div className="relative w-full h-full flex items-center justify-end">
                  {/* Ground contact shadow */}
                  <div className="absolute bottom-6 right-6 w-[78%] h-8 bg-black/85 blur-xl rounded-full scale-y-50" />

                  {/* Concentric Energy Arrival Rings */}
                  <motion.div
                    initial={{ scale: 0.5, opacity: 0.8 }}
                    animate={{ scale: [0.5, 1.4, 2.2], opacity: [0.8, 0.3, 0] }}
                    transition={{ repeat: Infinity, duration: 2.2, ease: 'easeOut' }}
                    className="absolute right-28 top-1/2 -translate-y-1/2 w-32 h-32 rounded-full border border-[#9EE6B5]/40 pointer-events-none"
                  />

                  {/* Mint ambient glow */}
                  <div className="absolute inset-0 bg-[#9EE6B5]/16 blur-3xl rounded-full scale-90 pointer-events-none" />

                  {/* Biggest Bold Keke */}
                  <motion.div
                    initial={{ x: 280, opacity: 0, rotate: -10 }}
                    animate={{
                      x: [280, -10, 0],
                      opacity: 1,
                      rotate: [-10, 3, -1, 0],
                    }}
                    transition={{ duration: 0.52, ease: [0.18, 1, 0.32, 1] }}
                    className="relative z-10 w-full h-full flex items-center justify-end"
                  >
                    <motion.img
                      src={currentSlide.image}
                      alt={currentSlide.imageAlt}
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = currentSlide.fallbackImage;
                      }}
                      animate={{
                        y: [0, -3, 1, -2, 0],
                        rotate: [0, 0.7, -0.4, 0],
                      }}
                      transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
                      className="w-full h-auto max-h-[125%] object-contain object-right transform scale-[1.5] sm:scale-[1.62] md:scale-[1.75] filter drop-shadow-[0_24px_35px_rgba(0,0,0,0.75)]"
                    />
                  </motion.div>
                </div>
              )}

              {/* 4. DELIVERY MOTORCYCLE: Aerodynamic Forward Pitch + Racing Neon Wind Trails */}
              {currentSlide.type === 'dispatch' && (
                <div className="relative w-full h-full flex items-center justify-end">
                  {/* Ground contact shadow */}
                  <div className="absolute bottom-6 right-8 w-[78%] h-8 bg-black/85 blur-xl rounded-full scale-y-50" />

                  {/* Animated wind streak lines streaming backwards past the bike */}
                  <div className="absolute top-[34%] right-[22%] flex flex-col gap-3 pointer-events-none z-0">
                    {[0, 1, 2].map((idx) => (
                      <motion.div
                        key={idx}
                        initial={{ x: 60, opacity: 0 }}
                        animate={{ x: [-20, -150], opacity: [0, 0.85, 0] }}
                        transition={{
                          repeat: Infinity,
                          duration: 1.1,
                          delay: idx * 0.28,
                          ease: 'easeOut',
                        }}
                        className="h-[2px] bg-gradient-to-l from-[#9EE6B5] to-transparent rounded-full"
                        style={{ width: 65 + idx * 30 }}
                      />
                    ))}
                  </div>

                  {/* Ambient glow */}
                  <div className="absolute inset-0 bg-[#9EE6B5]/20 blur-3xl rounded-full scale-90 pointer-events-none" />

                  {/* Biggest Bold Motorcycle */}
                  <motion.div
                    initial={{ x: 300, opacity: 0, rotate: -12, scale: 0.9 }}
                    animate={{
                      x: [300, 0],
                      opacity: 1,
                      rotate: [-12, 3, 0],
                      scale: [0.9, 1.04, 1],
                    }}
                    transition={{ duration: 0.52, ease: [0.16, 1, 0.3, 1] }}
                    className="relative z-10 w-full h-full flex items-center justify-end"
                  >
                    <motion.img
                      src={currentSlide.image}
                      alt={currentSlide.imageAlt}
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = currentSlide.fallbackImage;
                      }}
                      animate={{
                        x: [0, 4, 0, -2, 0],
                        y: [0, -6, 0],
                        rotate: [0, -1.5, 0],
                      }}
                      transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
                      className="w-full h-auto max-h-[125%] object-contain object-right transform scale-[1.55] sm:scale-[1.68] md:scale-[1.8] filter drop-shadow-[0_25px_36px_rgba(0,0,0,0.75)]"
                    />
                  </motion.div>
                </div>
              )}

              {/* 5. BICYCLE: Agile Cadence Pedal Glide + Eco Wheel Halo + Gentle Cadence Rhythm */}
              {currentSlide.type === 'bicycle' && (
                <div className="relative w-full h-full flex items-center justify-end">
                  {/* Wheel contact shadows */}
                  <div className="absolute bottom-6 right-6 w-[76%] h-7 bg-black/80 blur-xl rounded-full scale-y-50" />

                  {/* Fresh Eco green aura halo */}
                  <motion.div
                    animate={{ scale: [0.9, 1.15, 0.9], opacity: [0.2, 0.4, 0.2] }}
                    transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
                    className="absolute inset-0 bg-[#9EE6B5]/22 blur-3xl rounded-full scale-85 pointer-events-none"
                  />

                  {/* Biggest Bold Bicycle */}
                  <motion.div
                    initial={{ x: 270, opacity: 0, rotate: 6, scale: 0.92 }}
                    animate={{
                      x: [270, -6, 0],
                      opacity: 1,
                      rotate: [6, -1, 0],
                      scale: [0.92, 1.02, 1],
                    }}
                    transition={{ duration: 0.5, ease: [0.18, 1, 0.32, 1] }}
                    className="relative z-10 w-full h-full flex items-center justify-end"
                  >
                    <motion.img
                      src={currentSlide.image}
                      alt={currentSlide.imageAlt}
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = currentSlide.fallbackImage;
                      }}
                      animate={{
                        y: [0, -8, 0],
                        rotate: [0, 2, -1, 0],
                      }}
                      transition={{ repeat: Infinity, duration: 2.8, ease: 'easeInOut' }}
                      className="w-full h-auto max-h-[125%] object-contain object-right transform scale-[1.52] sm:scale-[1.65] md:scale-[1.78] filter drop-shadow-[0_24px_34px_rgba(0,0,0,0.7)]"
                    />
                  </motion.div>
                </div>
              )}

              {/* 6. LORRY / FREIGHT: Heavy-Duty Industrial Haul + Ground Compression + Hazard Beacon */}
              {currentSlide.type === 'fright' && (
                <div className="relative w-full h-full flex items-center justify-end">
                  {/* Massive dual-axle ground shadow */}
                  <div className="absolute bottom-6 right-8 w-[88%] h-10 bg-black/90 blur-xl rounded-full scale-y-50" />

                  {/* Golden amber freight safety beacon pulse */}
                  <motion.div
                    animate={{
                      opacity: [0.2, 0.6, 0.2],
                      scale: [0.9, 1.2, 0.9],
                    }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
                    className="absolute top-[26%] right-[32%] w-36 h-36 bg-amber-400/25 blur-2xl rounded-full pointer-events-none z-0"
                  />

                  {/* Emerald industrial glow */}
                  <div className="absolute inset-0 bg-[#0CC25F]/18 blur-3xl rounded-full scale-90 pointer-events-none" />

                  {/* Biggest Bold Freight Lorry */}
                  <motion.div
                    initial={{ x: 330, opacity: 0, scale: 0.9 }}
                    animate={{
                      x: [330, -14, 0],
                      opacity: 1,
                      scale: [0.9, 1.03, 1],
                    }}
                    transition={{ duration: 0.62, ease: [0.2, 1, 0.32, 1] }}
                    className="relative z-10 w-full h-full flex items-center justify-end"
                  >
                    <motion.img
                      src={currentSlide.image}
                      alt={currentSlide.imageAlt}
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = currentSlide.fallbackImage;
                      }}
                      animate={{ y: [0, -4, 0] }}
                      transition={{ repeat: Infinity, duration: 3.5, ease: 'easeInOut' }}
                      className="w-full h-auto max-h-[125%] object-contain object-right transform scale-[1.5] sm:scale-[1.62] md:scale-[1.75] filter drop-shadow-[0_26px_40px_rgba(0,0,0,0.85)]"
                    />
                  </motion.div>
                </div>
              )}

              {/* 7. AMBULANCE: Urgent Priority Rush + Alternating Red/Blue Emergency Rooftop Strobes */}
              {currentSlide.type === 'ambulance' && (
                <div className="relative w-full h-full flex items-center justify-end">
                  {/* Heavy contact shadow */}
                  <div className="absolute bottom-6 right-6 w-[86%] h-9 bg-black/90 blur-xl rounded-full scale-y-50" />

                  {/* ACTIVE EMERGENCY DUAL-BEACON STROBE FLASH (Alternating Red and Electric Blue) */}
                  <motion.div
                    animate={{
                      backgroundColor: [
                        'rgba(255, 59, 48, 0.45)',
                        'rgba(0, 122, 255, 0.45)',
                        'rgba(255, 59, 48, 0.45)',
                      ],
                      scale: [0.85, 1.25, 0.85],
                      opacity: [0.45, 0.95, 0.45],
                    }}
                    transition={{ repeat: Infinity, duration: 0.7, ease: 'easeInOut' }}
                    className="absolute top-[25%] right-[30%] w-56 h-56 rounded-full blur-3xl pointer-events-none z-0"
                  />

                  {/* Concentric Siren Soundwave Radar Circles */}
                  <motion.div
                    animate={{ scale: [1, 2.4], opacity: [0.75, 0] }}
                    transition={{ repeat: Infinity, duration: 1.3, ease: 'easeOut' }}
                    className="absolute top-[30%] right-[32%] w-28 h-28 rounded-full border-2 border-[#FF3B30]/70 pointer-events-none"
                  />

                  {/* Biggest Bold Ambulance */}
                  <motion.div
                    initial={{ x: 330, opacity: 0, scale: 0.9 }}
                    animate={{
                      x: [330, -16, 0],
                      opacity: 1,
                      scale: [0.9, 1.04, 1],
                    }}
                    transition={{ duration: 0.55, ease: [0.18, 1, 0.3, 1] }}
                    className="relative z-10 w-full h-full flex items-center justify-end"
                  >
                    <motion.img
                      src={currentSlide.image}
                      alt={currentSlide.imageAlt}
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = currentSlide.fallbackImage;
                      }}
                      animate={{ y: [0, -5, 0] }}
                      transition={{ repeat: Infinity, duration: 2.8, ease: 'easeInOut' }}
                      className="w-full h-auto max-h-[125%] object-contain object-right transform scale-[1.55] sm:scale-[1.68] md:scale-[1.8] filter drop-shadow-[0_26px_40px_rgba(0,0,0,0.85)]"
                    />
                  </motion.div>
                </div>
              )}

            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom Controls: Prev Button, 7 Pagination Dots, and Next / Get Started Button */}
      <footer className="w-full flex items-center justify-between gap-3 pt-3 pb-2 z-30">
        {/* Prev Button on every slide */}
        <button
          id="btn-prev-slide"
          type="button"
          onClick={handlePrev}
          disabled={isFirstSlide}
          aria-label="Previous slide"
          className={`flex items-center gap-1.5 px-5 sm:px-6 py-3.5 rounded-full font-JakartaSemiBold text-sm transition-all duration-200 cursor-pointer ${
            isFirstSlide
              ? 'opacity-30 cursor-not-allowed bg-white/[0.04] text-white/40 border border-white/5'
              : 'bg-white/[0.08] hover:bg-white/[0.16] text-white/90 active:scale-95 border border-white/10'
          }`}
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Prev</span>
        </button>

        {/* 7-Step Pagination Dots */}
        <div className="flex items-center gap-1 sm:gap-1.5">
          {ONBOARDING_SLIDES.map((slide, i) => (
            <button
              key={slide.id}
              id={`onboarding-dot-${i}`}
              type="button"
              onClick={() => handleDotClick(i)}
              aria-label={`Go to slide ${i + 1} (${slide.tag})`}
              className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                activeIndex === i
                  ? 'w-6 sm:w-8 bg-[#9EE6B5] shadow-[0_0_12px_rgba(158,230,181,0.6)]'
                  : 'w-2 bg-white/20 hover:bg-white/40'
              }`}
            />
          ))}
        </div>

        {/* Next / Get Started Button on every slide */}
        <button
          id="btn-next-slide"
          type="button"
          onClick={handleNext}
          className="flex items-center gap-2 px-6 sm:px-8 py-3.5 rounded-full font-JakartaBold text-sm bg-[#9EE6B5] hover:bg-[#8ee0ab] text-[#031E16] shadow-[0_0_25px_rgba(158,230,181,0.4)] transition-all duration-200 active:scale-95 cursor-pointer"
        >
          <span>{isLastSlide ? 'Get Started' : 'Next'}</span>
          {isLastSlide ? (
            <ArrowRight className="w-4 h-4 stroke-[2.5]" />
          ) : (
            <ChevronRight className="w-4 h-4 stroke-[2.5]" />
          )}
        </button>
      </footer>
    </div>
  );
};
