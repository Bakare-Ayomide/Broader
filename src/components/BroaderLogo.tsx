import React from 'react';

interface BroaderLogoProps {
  className?: string;
  width?: number | string;
  height?: number | string;
  withGlow?: boolean;
}

export const BroaderLogo: React.FC<BroaderLogoProps> = ({
  className = 'h-8 w-auto',
  width,
  height,
  withGlow = true,
}) => {
  return (
    <div
      className={`inline-flex items-center relative ${className}`}
      style={{ width, height }}
    >
      {withGlow && (
        <div
          className="absolute inset-0 bg-[#9EE6B5]/20 blur-[14px] rounded-full pointer-events-none scale-105"
          aria-hidden="true"
        />
      )}
      <svg
        viewBox="0 0 740 220"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full object-contain relative z-10 drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]"
      >
        <defs>
          <filter id="logo-drop" x="-10%" y="-10%" width="130%" height="130%">
            <feDropShadow dx="0" dy="3" stdDeviation="4" floodColor="#000000" floodOpacity="0.45" />
          </filter>
        </defs>
        <g filter="url(#logo-drop)">
          {/* 'b' - vertical stem and rounded lower bowl */}
          <path
            d="M 85 45 L 85 155 A 42 42 0 0 0 169 155 A 42 42 0 0 0 127 113 L 85 113"
            stroke="#9EE6B5"
            strokeWidth="19"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* 'r' - arch flow */}
          <path
            d="M 183 155 L 183 113 A 36 36 0 0 1 247 113"
            stroke="#9EE6B5"
            strokeWidth="19"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* 'o' - complete smooth loop */}
          <circle
            cx="305"
            cy="134"
            r="42"
            stroke="#9EE6B5"
            strokeWidth="19"
          />

          {/* 'a' - lower bowl and curved connector */}
          <path
            d="M 432 113 A 42 42 0 1 0 432 155 L 432 100 A 30 30 0 0 0 402 70"
            stroke="#9EE6B5"
            strokeWidth="19"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* 'd' - bowl with tall ascender */}
          <path
            d="M 520 155 A 42 42 0 1 1 520 113 L 520 45"
            stroke="#9EE6B5"
            strokeWidth="19"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* 'e' - loop with horizontal crossbar */}
          <path
            d="M 552 134 L 626 134 A 38 38 0 1 0 574 162"
            stroke="#9EE6B5"
            strokeWidth="19"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* 'r' - terminal arch with bottom descent */}
          <path
            d="M 645 155 L 645 113 A 36 36 0 0 1 709 113 L 709 135"
            stroke="#9EE6B5"
            strokeWidth="19"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
      </svg>
    </div>
  );
};
