import React from 'react';
import { motion, HTMLMotionProps } from 'motion/react';

export type GlassGlow = 'none' | 'blue' | 'cyan' | 'violet' | 'magenta' | 'green' | 'amber' | 'red';

export interface GlassCardProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode;
  className?: string;
  glow?: GlassGlow;
  interactive?: boolean;
  selected?: boolean;
  intensity?: 'subtle' | 'medium' | 'high';
}

const GLOW_CLASSES: Record<GlassGlow, string> = {
  none: '',
  blue: 'hover:border-[#9EE6B5]/60 hover:shadow-[0_0_24px_rgba(158,230,181,0.25)]',
  cyan: 'hover:border-cyan-400/50 hover:shadow-[0_0_24px_rgba(34,211,238,0.2)]',
  violet: 'hover:border-purple-500/50 hover:shadow-[0_0_24px_rgba(168,85,247,0.22)]',
  magenta: 'hover:border-pink-500/50 hover:shadow-[0_0_24px_rgba(236,72,153,0.22)]',
  green: 'hover:border-emerald-400/50 hover:shadow-[0_0_24px_rgba(52,211,153,0.2)]',
  amber: 'hover:border-amber-400/50 hover:shadow-[0_0_24px_rgba(251,191,36,0.2)]',
  red: 'hover:border-red-500/50 hover:shadow-[0_0_24px_rgba(239,68,68,0.22)]',
};

const SELECTED_GLOW: Record<GlassGlow, string> = {
  none: 'border-white/30 shadow-[0_0_20px_rgba(255,255,255,0.08)]',
  blue: 'border-[#9EE6B5] shadow-[0_0_25px_rgba(158,230,181,0.35)] bg-[#9EE6B5]/10',
  cyan: 'border-cyan-400 shadow-[0_0_25px_rgba(34,211,238,0.28)] bg-cyan-500/10',
  violet: 'border-purple-500 shadow-[0_0_25px_rgba(168,85,247,0.3)] bg-purple-500/10',
  magenta: 'border-pink-500 shadow-[0_0_25px_rgba(236,72,153,0.3)] bg-pink-500/10',
  green: 'border-emerald-400 shadow-[0_0_25px_rgba(52,211,153,0.3)] bg-emerald-500/10',
  amber: 'border-amber-400 shadow-[0_0_25px_rgba(251,191,36,0.3)] bg-amber-500/10',
  red: 'border-red-500 shadow-[0_0_25px_rgba(239,68,68,0.3)] bg-red-500/10',
};

const INTENSITY_BG = {
  subtle: 'bg-white/[0.03] backdrop-blur-md border-white/[0.06]',
  medium: 'bg-black/60 backdrop-blur-xl border-white/[0.09]',
  high: 'bg-black/80 backdrop-blur-2xl border-white/[0.14]',
};

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className = '',
  glow = 'none',
  interactive = false,
  selected = false,
  intensity = 'medium',
  ...rest
}) => {
  const baseBg = INTENSITY_BG[intensity];
  const glowClass = GLOW_CLASSES[glow];
  const selectedClass = selected ? SELECTED_GLOW[glow] : '';
  const interactiveStyles = interactive
    ? 'cursor-pointer transition-all duration-300 hover:bg-white/[0.06]'
    : '';

  return (
    <motion.div
      className={`relative rounded-2xl border p-4 shadow-xl overflow-hidden ${baseBg} ${glowClass} ${selectedClass} ${interactiveStyles} ${className}`}
      whileTap={interactive ? { scale: 0.985 } : undefined}
      {...rest}
    >
      {/* Top subtle sheen highlight */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent pointer-events-none" />
      {children}
    </motion.div>
  );
};
