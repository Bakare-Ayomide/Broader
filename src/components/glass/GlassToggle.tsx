import React from 'react';
import { motion } from 'motion/react';

export type ToggleColor = 'neon-green' | 'electric-blue' | 'violet' | 'cyan' | 'amber';

export interface GlassToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  description?: string;
  color?: ToggleColor;
  disabled?: boolean;
  icon?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  id?: string;
  className?: string;
}

const COLOR_TRACKS: Record<ToggleColor, string> = {
  'neon-green': 'bg-gradient-to-r from-emerald-600 to-green-500 border-emerald-400/50 shadow-[0_0_16px_rgba(16,185,129,0.4)]',
  'electric-blue': 'bg-gradient-to-r from-[#0286FF] to-blue-600 border-blue-400/50 shadow-[0_0_16px_rgba(2,134,255,0.45)]',
  violet: 'bg-gradient-to-r from-purple-700 via-indigo-600 to-purple-600 border-purple-400/50 shadow-[0_0_16px_rgba(147,51,234,0.45)]',
  cyan: 'bg-gradient-to-r from-cyan-600 to-teal-500 border-cyan-400/50 shadow-[0_0_16px_rgba(6,182,212,0.45)]',
  amber: 'bg-gradient-to-r from-amber-600 to-yellow-500 border-amber-400/50 shadow-[0_0_16px_rgba(245,158,11,0.45)]',
};

export const GlassToggle: React.FC<GlassToggleProps> = ({
  checked,
  onChange,
  label,
  description,
  color = 'electric-blue',
  disabled = false,
  icon,
  size = 'md',
  id,
  className = '',
}) => {
  const toggleId = id || `glass-toggle-${Math.random().toString(36).substring(2, 7)}`;

  // Size dimensions
  const trackSize =
    size === 'sm'
      ? 'w-11 h-6 p-0.5'
      : size === 'lg'
      ? 'w-16 h-9 p-1'
      : 'w-13 h-7 p-0.5';

  const thumbSize =
    size === 'sm'
      ? 'w-5 h-5'
      : size === 'lg'
      ? 'w-7 h-7'
      : 'w-6 h-6';

  const travelX =
    size === 'sm'
      ? 20
      : size === 'lg'
      ? 28
      : 24;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      if (!disabled) onChange(!checked);
    }
  };

  return (
    <div
      className={`flex items-center justify-between gap-3 select-none ${
        disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
      } ${className}`}
      onClick={() => {
        if (!disabled) onChange(!checked);
      }}
    >
      {(label || description || icon) && (
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          {icon && (
            <div className="w-8 h-8 rounded-xl bg-white/[0.06] border border-white/10 flex items-center justify-center shrink-0 text-neutral-300">
              {icon}
            </div>
          )}
          <div className="min-w-0 flex-1">
            {label && (
              <label
                htmlFor={toggleId}
                className="text-xs font-JakartaSemiBold text-white block cursor-pointer truncate"
              >
                {label}
              </label>
            )}
            {description && (
              <p className="text-[10px] text-neutral-400 font-JakartaRegular truncate mt-0.5">
                {description}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Interactive Switch Component */}
      <button
        type="button"
        id={toggleId}
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onKeyDown={handleKeyDown}
        className={`relative inline-flex items-center rounded-full transition-colors duration-300 border focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50 shrink-0 ${trackSize} ${
          checked
            ? COLOR_TRACKS[color]
            : 'bg-white/[0.08] border-white/[0.12] hover:bg-white/[0.12]'
        }`}
      >
        <motion.div
          className={`rounded-full bg-white shadow-md shadow-black/50 ${thumbSize} flex items-center justify-center`}
          animate={{ x: checked ? travelX : 0 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        >
          {/* Subtle micro dot inside thumb */}
          <div
            className={`w-1.5 h-1.5 rounded-full transition-colors duration-200 ${
              checked ? 'bg-neutral-800' : 'bg-neutral-400'
            }`}
          />
        </motion.div>
      </button>
    </div>
  );
};
