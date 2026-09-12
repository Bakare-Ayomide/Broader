import React from 'react';

interface BroaderLogoProps {
  className?: string;
  width?: number | string;
  height?: number | string;
  withGlow?: boolean;
}

export const BROADER_LOGO_URL = 'https://admin.cashquora.com/vehicle/broaderlogo.png';

export const BroaderLogo: React.FC<BroaderLogoProps> = ({
  className = 'h-8 w-auto',
  width,
  height,
  withGlow = true,
}) => {
  return (
    <div
      className={`inline-flex items-center justify-center relative ${className}`}
      style={{ width, height }}
    >
      {withGlow && (
        <div
          className="absolute inset-0 bg-[#9EE6B5]/15 blur-[12px] rounded-full pointer-events-none scale-105"
          aria-hidden="true"
        />
      )}
      <img
        src={BROADER_LOGO_URL}
        alt="Broader"
        referrerPolicy="no-referrer"
        onError={(e) => {
          (e.currentTarget as HTMLImageElement).src = '/assets/images/broader-logo.svg';
        }}
        className="w-full h-full object-contain relative z-10 drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]"
      />
    </div>
  );
};

