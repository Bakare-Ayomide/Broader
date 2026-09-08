import React from 'react';

export type StatusType =
  | 'online'
  | 'offline'
  | 'en_route'
  | 'searching'
  | 'arrived'
  | 'completed'
  | 'warning'
  | 'emergency';

export interface GlassStatusBadgeProps {
  status: StatusType;
  label?: string;
  pulse?: boolean;
  className?: string;
}

const STATUS_CONFIG: Record<
  StatusType,
  { label: string; bg: string; border: string; dot: string; text: string; shadow: string }
> = {
  online: {
    label: 'Online',
    bg: 'bg-emerald-950/40',
    border: 'border-emerald-500/30',
    dot: 'bg-emerald-400',
    text: 'text-emerald-300',
    shadow: 'shadow-[0_0_12px_rgba(16,185,129,0.3)]',
  },
  offline: {
    label: 'Offline',
    bg: 'bg-neutral-900/50',
    border: 'border-white/10',
    dot: 'bg-neutral-500',
    text: 'text-neutral-400',
    shadow: '',
  },
  en_route: {
    label: 'En Route',
    bg: 'bg-blue-950/40',
    border: 'border-blue-500/30',
    dot: 'bg-blue-400',
    text: 'text-blue-300',
    shadow: 'shadow-[0_0_12px_rgba(2,134,255,0.35)]',
  },
  searching: {
    label: 'Searching',
    bg: 'bg-purple-950/40',
    border: 'border-purple-500/30',
    dot: 'bg-purple-400',
    text: 'text-purple-300',
    shadow: 'shadow-[0_0_12px_rgba(147,51,234,0.3)]',
  },
  arrived: {
    label: 'Arrived',
    bg: 'bg-amber-950/40',
    border: 'border-amber-500/30',
    dot: 'bg-amber-400',
    text: 'text-amber-300',
    shadow: 'shadow-[0_0_12px_rgba(245,158,11,0.3)]',
  },
  completed: {
    label: 'Completed',
    bg: 'bg-teal-950/40',
    border: 'border-teal-500/30',
    dot: 'bg-teal-400',
    text: 'text-teal-300',
    shadow: 'shadow-[0_0_12px_rgba(20,184,166,0.3)]',
  },
  warning: {
    label: 'Warning',
    bg: 'bg-yellow-950/40',
    border: 'border-yellow-500/30',
    dot: 'bg-yellow-400',
    text: 'text-yellow-300',
    shadow: 'shadow-[0_0_12px_rgba(234,179,8,0.3)]',
  },
  emergency: {
    label: 'Emergency',
    bg: 'bg-red-950/50',
    border: 'border-red-500/40',
    dot: 'bg-red-500',
    text: 'text-red-300',
    shadow: 'shadow-[0_0_16px_rgba(239,68,68,0.45)]',
  },
};

export const GlassStatusBadge: React.FC<GlassStatusBadgeProps> = ({
  status,
  label,
  pulse = true,
  className = '',
}) => {
  const config = STATUS_CONFIG[status];
  const displayLabel = label || config.label;

  return (
    <div
      className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-full border backdrop-blur-md text-[11px] font-JakartaSemiBold tracking-wide uppercase select-none ${config.bg} ${config.border} ${config.text} ${config.shadow} ${className}`}
    >
      <span className="relative flex h-2 w-2">
        {pulse && (
          <span
            className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${config.dot}`}
          />
        )}
        <span className={`relative inline-flex rounded-full h-2 w-2 ${config.dot}`} />
      </span>
      <span>{displayLabel}</span>
    </div>
  );
};
