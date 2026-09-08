import React from 'react';

export interface SpeedometerProps {
  speed: number; // Current speed in km/h
  maxSpeed?: number; // default 200
  speedLimit?: number; // default 80
  size?: number; // size in px (e.g., 200, 240, 160)
  showSubGauge?: boolean; // Fuel / Battery sub-gauge as in Screenshot 1
  subGaugeLevel?: number; // 0 to 1 (e.g., 0.78 for 78% full)
  className?: string;
  variant?: 'full' | 'compact' | 'minimal';
}

export const Speedometer: React.FC<SpeedometerProps> = ({
  speed,
  maxSpeed = 200,
  speedLimit = 80,
  size = 220,
  showSubGauge = true,
  subGaugeLevel = 0.76,
  className = '',
  variant = 'full',
}) => {
  // Clamped displayed speed directly derived from props
  const displayedSpeed = Math.max(0, Math.min(maxSpeed, Math.round(speed)));

  // Total angular span of speedometer: 240 degrees (from -120deg to +120deg)
  // -120 deg corresponds to 0 km/h, +120 deg corresponds to 200 km/h
  const START_ANGLE = -120;
  const END_ANGLE = 120;
  const TOTAL_SPAN = END_ANGLE - START_ANGLE; // 240 deg

  const speedRatio = Math.max(0, Math.min(1, displayedSpeed / maxSpeed));
  const needleAngle = START_ANGLE + speedRatio * TOTAL_SPAN;

  // Determine current active zone color
  let activeColor = '#10B981'; // Green (0-80)
  let activeGlow = 'rgba(16, 185, 129, 0.5)';
  if (displayedSpeed > 160) {
    activeColor = '#EF4444'; // Red (161-200)
    activeGlow = 'rgba(239, 68, 68, 0.6)';
  } else if (displayedSpeed > 120) {
    activeColor = '#F97316'; // Orange (121-160)
    activeGlow = 'rgba(249, 115, 22, 0.6)';
  } else if (displayedSpeed > 80) {
    activeColor = '#EAB308'; // Yellow (81-120)
    activeGlow = 'rgba(234, 179, 8, 0.6)';
  }

  // Major tick speeds: 0, 20, 40, 60, 80, 100, 120, 140, 160, 180, 200
  const ticks = [0, 20, 40, 60, 80, 100, 120, 140, 160, 180, 200];

  // Center coordinates based on viewBox 200x200
  const cx = 100;
  const cy = 100;
  const rOuter = 82;
  const rTicks = 72;

  // Helper to convert polar to cartesian
  const polarToCartesian = (centerX: number, centerY: number, radius: number, angleInDegrees: number) => {
    // 0 deg is at top (12 o'clock), positive is clockwise
    const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
    return {
      x: centerX + radius * Math.cos(angleInRadians),
      y: centerY + radius * Math.sin(angleInRadians),
    };
  };

  // Describe SVG arc
  const describeArc = (x: number, y: number, radius: number, startAngle: number, endAngle: number) => {
    const start = polarToCartesian(x, y, radius, endAngle);
    const end = polarToCartesian(x, y, radius, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';
    return ['M', start.x, start.y, 'A', radius, radius, 0, largeArcFlag, 0, end.x, end.y].join(' ');
  };

  // Colored zones:
  // 0-80: START_ANGLE to START_ANGLE + (80/200)*240 = -120 to -24 deg
  // 81-120: -24 to +24 deg
  // 121-160: +24 to +72 deg
  // 161-200: +72 to +120 deg
  const zoneGreenEnd = START_ANGLE + (80 / maxSpeed) * TOTAL_SPAN;
  const zoneYellowEnd = START_ANGLE + (120 / maxSpeed) * TOTAL_SPAN;
  const zoneOrangeEnd = START_ANGLE + (160 / maxSpeed) * TOTAL_SPAN;
  const zoneRedEnd = END_ANGLE;

  // Sub-gauge needle angle (-60deg to +60deg)
  const subNeedleAngle = -60 + subGaugeLevel * 120;

  return (
    <div
      className={`relative inline-flex flex-col items-center justify-center select-none ${className}`}
      style={{ width: size, height: size }}
    >
      {/* Automotive Gauge Frame Shadow & Metallic Bevel */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-b from-[#1c1d22] via-[#0d0e11] to-[#050608] border-2 border-white/[0.12] shadow-[inset_0_4px_16px_rgba(0,0,0,0.9),0_12px_32px_rgba(0,0,0,0.8)]" />

      {/* Glass Inner Rim Highlight */}
      <div className="absolute inset-2 rounded-full border border-white/[0.05] pointer-events-none" />

      {/* SVG Gauge Visuals */}
      <svg
        className="w-full h-full relative z-10"
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <filter id="gaugeGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2.5" result="glow" />
            <feComposite in="SourceGraphic" in2="glow" operator="over" />
          </filter>

          <linearGradient id="needleGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={activeColor} stopOpacity="0.95" />
            <stop offset="70%" stopColor="#FACC15" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#0286FF" stopOpacity="0.4" />
          </linearGradient>
        </defs>

        {/* Outer Background Track Arc */}
        <path
          d={describeArc(cx, cy, rOuter, START_ANGLE, END_ANGLE)}
          stroke="rgba(255, 255, 255, 0.08)"
          strokeWidth="4"
          strokeLinecap="round"
        />

        {/* Zone 1: Green Zone (0-80 km/h) */}
        <path
          d={describeArc(cx, cy, rOuter, START_ANGLE, zoneGreenEnd)}
          stroke="#10B981"
          strokeWidth="3.5"
          strokeLinecap="round"
          filter="url(#gaugeGlow)"
          className="opacity-90"
        />

        {/* Zone 2: Yellow Zone (81-120 km/h) */}
        <path
          d={describeArc(cx, cy, rOuter, zoneGreenEnd, zoneYellowEnd)}
          stroke="#EAB308"
          strokeWidth="3.5"
          filter="url(#gaugeGlow)"
          className="opacity-90"
        />

        {/* Zone 3: Orange Zone (121-160 km/h) */}
        <path
          d={describeArc(cx, cy, rOuter, zoneYellowEnd, zoneOrangeEnd)}
          stroke="#F97316"
          strokeWidth="3.5"
          filter="url(#gaugeGlow)"
          className="opacity-90"
        />

        {/* Zone 4: Red Zone (161-200 km/h) */}
        <path
          d={describeArc(cx, cy, rOuter, zoneOrangeEnd, zoneRedEnd)}
          stroke="#EF4444"
          strokeWidth="3.5"
          strokeLinecap="round"
          filter="url(#gaugeGlow)"
          className="opacity-90"
        />

        {/* Active illuminated Arc from START to CURRENT SPEED */}
        {speedRatio > 0.01 && (
          <path
            d={describeArc(cx, cy, rOuter, START_ANGLE, needleAngle)}
            stroke={activeColor}
            strokeWidth="5"
            strokeLinecap="round"
            style={{
              filter: `drop-shadow(0 0 6px ${activeColor})`,
            }}
          />
        )}

        {/* Ticks and Numerical Numbers */}
        {ticks.map((t) => {
          const tickAngle = START_ANGLE + (t / maxSpeed) * TOTAL_SPAN;
          const pOuter = polarToCartesian(cx, cy, rOuter + 2, tickAngle);
          const pInner = polarToCartesian(cx, cy, rOuter - 6, tickAngle);
          const pText = polarToCartesian(cx, cy, rTicks - 8, tickAngle);

          // Color tick mark based on zone
          let tickColor = '#10B981';
          if (t > 160) tickColor = '#EF4444';
          else if (t > 120) tickColor = '#F97316';
          else if (t > 80) tickColor = '#EAB308';

          const isMajor = t % 40 === 0;

          return (
            <g key={t}>
              <line
                x1={pOuter.x}
                y1={pOuter.y}
                x2={pInner.x}
                y2={pInner.y}
                stroke={t <= displayedSpeed ? tickColor : 'rgba(255, 255, 255, 0.25)'}
                strokeWidth={isMajor ? 2 : 1.2}
                strokeLinecap="round"
              />
              <text
                x={pText.x}
                y={pText.y + 3}
                fill={t <= displayedSpeed ? '#FFFFFF' : 'rgba(255, 255, 255, 0.45)'}
                fontSize="7.5"
                fontFamily="system-ui, sans-serif"
                fontWeight="600"
                textAnchor="middle"
              >
                {t}
              </text>
            </g>
          );
        })}

        {/* Sub-ticks for fine precision */}
        {[10, 30, 50, 70, 90, 110, 130, 150, 170, 190].map((t) => {
          const tickAngle = START_ANGLE + (t / maxSpeed) * TOTAL_SPAN;
          const pOuter = polarToCartesian(cx, cy, rOuter + 1, tickAngle);
          const pInner = polarToCartesian(cx, cy, rOuter - 3, tickAngle);
          return (
            <line
              key={t}
              x1={pOuter.x}
              y1={pOuter.y}
              x2={pInner.x}
              y2={pInner.y}
              stroke="rgba(255, 255, 255, 0.12)"
              strokeWidth="1"
            />
          );
        })}

        {/* Fuel/Battery Sub-gauge at bottom (matching Screenshot 1) */}
        {showSubGauge && (
          <g className="opacity-90">
            {/* Sub-gauge background arc */}
            <path
              d={describeArc(100, 155, 26, -60, 60)}
              stroke="rgba(255, 255, 255, 0.12)"
              strokeWidth="2"
              strokeLinecap="round"
            />
            {/* E & F labels */}
            <text
              x="82"
              y="168"
              fill="rgba(255, 255, 255, 0.6)"
              fontSize="7"
              fontWeight="bold"
              fontFamily="system-ui"
            >
              E
            </text>
            <text
              x="114"
              y="168"
              fill="rgba(255, 255, 255, 0.6)"
              fontSize="7"
              fontWeight="bold"
              fontFamily="system-ui"
            >
              F
            </text>

            {/* Sub-gauge tick marks */}
            {[-60, -30, 0, 30, 60].map((ang, idx) => {
              const p1 = polarToCartesian(100, 155, 26, ang);
              const p2 = polarToCartesian(100, 155, 21, ang);
              return (
                <line
                  key={idx}
                  x1={p1.x}
                  y1={p1.y}
                  x2={p2.x}
                  y2={p2.y}
                  stroke="rgba(255, 255, 255, 0.3)"
                  strokeWidth="1"
                />
              );
            })}

            {/* Mini Needle */}
            {(() => {
              const pTip = polarToCartesian(100, 155, 22, subNeedleAngle);
              return (
                <g>
                  <line
                    x1="100"
                    y1="155"
                    x2={pTip.x}
                    y2={pTip.y}
                    stroke="#10B981"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    style={{ filter: 'drop-shadow(0 0 3px #10B981)' }}
                  />
                  <circle cx="100" cy="155" r="3" fill="#1e293b" stroke="#10B981" strokeWidth="1" />
                </g>
              );
            })()}
          </g>
        )}

        {/* Automotive Translucent Gauge Needle with Glow (from Screenshot 1) */}
        {(() => {
          // Calculate tip and tail
          const tip = polarToCartesian(cx, cy, rOuter - 6, needleAngle);
          const base1 = polarToCartesian(cx, cy, 7, needleAngle + 90);
          const base2 = polarToCartesian(cx, cy, 7, needleAngle - 90);
          const tail = polarToCartesian(cx, cy, 14, needleAngle + 180);

          return (
            <g style={{ filter: `drop-shadow(0 0 6px ${activeGlow})` }}>
              {/* Tapered Needle Polygon */}
              <polygon
                points={`${tip.x},${tip.y} ${base1.x},${base1.y} ${tail.x},${tail.y} ${base2.x},${base2.y}`}
                fill="url(#needleGrad)"
                opacity="0.9"
              />
              {/* Needle center illuminated line */}
              <line
                x1={tail.x}
                y1={tail.y}
                x2={tip.x}
                y2={tip.y}
                stroke="#FFFFFF"
                strokeWidth="0.8"
                opacity="0.75"
              />
            </g>
          );
        })()}

        {/* Central Concentric Neon Blue Pivot (matching Screenshot 1) */}
        <circle cx={cx} cy={cy} r="14" fill="#0B132B" stroke="#0286FF" strokeWidth="2.5" opacity="0.95" />
        <circle
          cx={cx}
          cy={cy}
          r="10"
          fill="none"
          stroke="#38BDF8"
          strokeWidth="1.5"
          style={{ filter: 'drop-shadow(0 0 5px #0286FF)' }}
        />
        <circle cx={cx} cy={cy} r="5" fill="#0286FF" />
      </svg>

      {/* Central Digital Speed Overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-20 pt-1">
        <span
          className="text-2xl sm:text-3xl font-mono font-extrabold tracking-tighter leading-none"
          style={{
            color: activeColor,
            textShadow: `0 0 14px ${activeGlow}`,
          }}
        >
          {Math.round(displayedSpeed)}
        </span>
        <span className="text-[9px] font-mono font-bold tracking-widest text-neutral-400 uppercase mt-0.5">
          KM/H
        </span>

        {/* Speed Limit Indicator Pill */}
        {speedLimit && (
          <div className="mt-1 flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-black/60 border border-white/10 text-[8px] font-mono font-bold text-neutral-300">
            <span>LIMIT</span>
            <span
              className={`px-1 rounded ${
                displayedSpeed > speedLimit
                  ? 'bg-red-500 text-white font-extrabold animate-pulse'
                  : 'text-yellow-400'
              }`}
            >
              {speedLimit}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
