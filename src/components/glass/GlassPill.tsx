import React from 'react';

export type PillVariant = 'default' | 'blue' | 'cyan' | 'violet' | 'green' | 'amber' | 'magenta';

export interface GlassPillProps {
  label: string;
  value?: string | number;
  variant?: PillVariant;
  progressPercent?: number; // 0-100 if showing a circular arc ring like Screenshot 2
  icon?: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

const PILL_VARIANTS: Record<PillVariant, string> = {
  default: 'bg-white/[0.06] text-neutral-200 border-white/[0.1] hover:bg-white/[0.1]',
  blue: 'bg-gradient-to-r from-emerald-950/40 to-[#9EE6B5]/30 text-[#9EE6B5] border-[#9EE6B5]/40 shadow-[0_0_12px_rgba(158,230,181,0.25)]',
  cyan: 'bg-gradient-to-r from-cyan-950/40 to-cyan-500/30 text-cyan-200 border-cyan-400/30 shadow-[0_0_12px_rgba(6,182,212,0.2)]',
  violet: 'bg-gradient-to-r from-purple-900/40 to-purple-600/30 text-purple-200 border-purple-400/30 shadow-[0_0_12px_rgba(147,51,234,0.25)]',
  magenta: 'bg-gradient-to-r from-pink-900/40 to-pink-600/30 text-pink-200 border-pink-400/30 shadow-[0_0_12px_rgba(236,72,153,0.25)]',
  green: 'bg-gradient-to-r from-emerald-950/40 to-emerald-600/30 text-emerald-200 border-emerald-400/30 shadow-[0_0_12px_rgba(16,185,129,0.2)]',
  amber: 'bg-gradient-to-r from-amber-950/40 to-amber-600/30 text-amber-200 border-amber-400/30 shadow-[0_0_12px_rgba(245,158,11,0.2)]',
};

export const GlassPill: React.FC<GlassPillProps> = ({
  label,
  value,
  variant = 'default',
  progressPercent,
  icon,
  className = '',
  onClick,
}) => {
  const radius = 10;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset =
    progressPercent !== undefined
      ? circumference - (Math.min(100, Math.max(0, progressPercent)) / 100) * circumference
      : 0;

  return (
    <div
      onClick={onClick}
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border backdrop-blur-xl text-xs font-JakartaSemiBold select-none transition-all duration-200 whitespace-nowrap ${
        PILL_VARIANTS[variant]
      } ${onClick ? 'cursor-pointer active:scale-95' : ''} ${className}`}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span className="truncate">{label}</span>

      {/* Optional Progress Arc Indicator */}
      {progressPercent !== undefined ? (
        <div className="relative w-5 h-5 flex items-center justify-center shrink-0">
          <svg className="w-5 h-5 -rotate-90" viewBox="0 0 24 24">
            <circle
              cx="12"
              cy="12"
              r={radius}
              stroke="currentColor"
              strokeWidth="2.5"
              fill="transparent"
              className="opacity-20"
            />
            <circle
              cx="12"
              cy="12"
              r={radius}
              stroke="#FACC15"
              strokeWidth="2.5"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              className="transition-all duration-500"
            />
          </svg>
          <span className="absolute text-[8px] font-mono font-bold text-yellow-300">
            {value ?? `${progressPercent}%`}
          </span>
        </div>
      ) : value !== undefined ? (
        <span className="px-1.5 py-0.2 rounded-full bg-white/10 text-[10px] font-mono font-bold text-white">
          {value}
        </span>
      ) : null}
    </div>
  );
};
