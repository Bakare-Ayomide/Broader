import React from 'react';
import { motion, HTMLMotionProps } from 'motion/react';
import { Loader2 } from 'lucide-react';

export type GlassButtonVariant =
  | 'default'
  | 'primary'
  | 'neon-green'
  | 'violet'
  | 'magenta'
  | 'cyan'
  | 'danger'
  | 'ghost';

export type GlassButtonSize = 'sm' | 'md' | 'lg' | 'icon';

export interface GlassButtonProps extends Omit<HTMLMotionProps<'button'>, 'size'> {
  variant?: GlassButtonVariant;
  size?: GlassButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  children?: React.ReactNode;
}

const VARIANTS: Record<GlassButtonVariant, string> = {
  default:
    'bg-white/[0.08] hover:bg-white/[0.14] text-white border-white/[0.14] shadow-lg shadow-black/40',
  primary:
    'bg-gradient-to-r from-[#9EE6B5] to-[#7bd899] text-black font-extrabold border-[#9EE6B5]/60 shadow-[0_0_20px_rgba(158,230,181,0.4)] hover:shadow-[0_0_28px_rgba(158,230,181,0.65)]',
  'neon-green':
    'bg-gradient-to-r from-emerald-500 to-green-600 text-black font-extrabold border-emerald-300/40 shadow-[0_0_20px_rgba(16,185,129,0.45)] hover:shadow-[0_0_28px_rgba(16,185,129,0.7)]',
  violet:
    'bg-gradient-to-r from-purple-600 to-indigo-600 text-white border-purple-400/40 shadow-[0_0_20px_rgba(147,51,234,0.4)] hover:shadow-[0_0_28px_rgba(147,51,234,0.65)]',
  magenta:
    'bg-gradient-to-r from-pink-600 to-rose-600 text-white border-pink-400/40 shadow-[0_0_20px_rgba(236,72,153,0.4)] hover:shadow-[0_0_28px_rgba(236,72,153,0.65)]',
  cyan:
    'bg-gradient-to-r from-cyan-500 to-blue-500 text-black font-extrabold border-cyan-300/40 shadow-[0_0_20px_rgba(6,182,212,0.45)] hover:shadow-[0_0_28px_rgba(6,182,212,0.7)]',
  danger:
    'bg-gradient-to-r from-red-600 to-rose-700 text-white border-red-400/40 shadow-[0_0_20px_rgba(239,68,68,0.4)] hover:shadow-[0_0_28px_rgba(239,68,68,0.6)]',
  ghost:
    'bg-transparent hover:bg-white/[0.08] text-neutral-300 hover:text-white border-transparent',
};

const SIZES: Record<GlassButtonSize, string> = {
  sm: 'px-3 py-1.5 text-xs rounded-xl gap-1.5',
  md: 'px-4 py-2.5 text-sm rounded-xl gap-2',
  lg: 'px-6 py-3.5 text-base rounded-2xl gap-2.5 font-bold',
  icon: 'w-10 h-10 p-0 rounded-xl justify-center items-center',
};

export const GlassButton: React.FC<GlassButtonProps> = ({
  variant = 'default',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  children,
  className = '',
  disabled,
  ...rest
}) => {
  return (
    <motion.button
      whileHover={!disabled && !isLoading ? { scale: 1.02 } : undefined}
      whileTap={!disabled && !isLoading ? { scale: 0.96 } : undefined}
      transition={{ duration: 0.15, ease: 'easeOut' }}
      disabled={disabled || isLoading}
      className={`relative inline-flex items-center justify-center font-JakartaSemiBold select-none backdrop-blur-xl border transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-blue-400/50 ${
        VARIANTS[variant]
      } ${SIZES[size]} ${fullWidth ? 'w-full' : ''} ${
        disabled || isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
      } ${className}`}
      {...rest}
    >
      {/* Subtle top bevel specular glow */}
      <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none rounded-t-xl" />
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin text-current" />
      ) : (
        <>
          {leftIcon && <span className="shrink-0">{leftIcon}</span>}
          {children && <span>{children}</span>}
          {rightIcon && <span className="shrink-0">{rightIcon}</span>}
        </>
      )}
    </motion.button>
  );
};
