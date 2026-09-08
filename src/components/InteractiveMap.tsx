import React, { useState, useEffect } from 'react';
import { useBroaderStore } from '../store/useBroaderStore';
import {
  Plus,
  Minus,
  Car,
  Crosshair,
  Landmark,
  Building2,
  Trees,
  Key,
  Package,
  Truck,
  Ambulance,
  Bike,
  Users,
  ShieldCheck,
  Navigation,
} from 'lucide-react';

interface InteractiveMapProps {
  showRoute?: boolean;
  className?: string;
  height?: string;
  onSelectLandmark?: (name: string, lat: number, lng: number) => void;
  isSearching?: boolean;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  showRoute = true,
  className = '',
  height = 'h-[300px]',
  onSelectLandmark,
  isSearching = false,
}) => {
  const userLatitude = useBroaderStore((s) => s.userLatitude);
  const userLongitude = useBroaderStore((s) => s.userLongitude);
  const destinationLatitude = useBroaderStore((s) => s.destinationLatitude);
  const destinationLongitude = useBroaderStore((s) => s.destinationLongitude);
  const destinationAddress = useBroaderStore((s) => s.destinationAddress);
  const userAddress = useBroaderStore((s) => s.userAddress);
  const drivers = useBroaderStore((s) => s.drivers);
  const selectedDriver = useBroaderStore((s) => s.selectedDriver);
  const setSelectedDriver = useBroaderStore((s) => s.setSelectedDriver);
  const activeService = useBroaderStore((s) => s.activeService);
  const setDestinationLocation = useBroaderStore((s) => s.setDestinationLocation);
  const rideStatus = useBroaderStore((s) => s.rideStatus);
  const activeTrip = useBroaderStore((s) => s.activeTrip);

  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [showLandmarks, setShowLandmarks] = useState(true);

  // Driver animated position for live tracking
  const [driverAnimPos, setDriverAnimPos] = useState({ x: 120, y: 110 });

  // Update animated driver position based on ride status
  useEffect(() => {
    if (!activeTrip) return;

    if (rideStatus === 'driver_assigned' || rideStatus === 'driver_arriving') {
      // Approach pickup location (180, 160)
      const interval = setInterval(() => {
        setDriverAnimPos((prev) => {
          const targetX = 180;
          const targetY = 160;
          const dx = (targetX - prev.x) * 0.15;
          const dy = (targetY - prev.y) * 0.15;
          if (Math.abs(targetX - prev.x) < 2 && Math.abs(targetY - prev.y) < 2) {
            return { x: 180, y: 160 };
          }
          return { x: prev.x + dx, y: prev.y + dy };
        });
      }, 800);
      return () => clearInterval(interval);
    } else if (rideStatus === 'driver_arrived') {
      setDriverAnimPos({ x: 180, y: 160 });
    } else if (rideStatus === 'ride_started') {
      // Travel along route to destination (360, 240)
      const interval = setInterval(() => {
        setDriverAnimPos((prev) => {
          const targetX = 350;
          const targetY = 235;
          const dx = (targetX - prev.x) * 0.12;
          const dy = (targetY - prev.y) * 0.12;
          return { x: prev.x + dx, y: prev.y + dy };
        });
      }, 800);
      return () => clearInterval(interval);
    } else if (rideStatus === 'ride_completed') {
      setDriverAnimPos({ x: 360, y: 240 });
    }
  }, [rideStatus, activeTrip]);

  // Lagos Landmarks data
  const landmarks = [
    {
      id: 'lekki_bridge',
      name: 'Lekki-Ikoyi Link Bridge',
      x: 395,
      y: 90,
      lat: 6.4474,
      lng: 3.4735,
      icon: Landmark,
      color: '#0286FF',
    },
    {
      id: 'vi_cbd',
      name: 'Victoria Island CBD',
      x: 305,
      y: 140,
      lat: 6.4281,
      lng: 3.4219,
      icon: Building2,
      color: '#0D9488',
    },
    {
      id: 'eko_atlantic',
      name: 'Eko Atlantic City',
      x: 165,
      y: 95,
      lat: 6.4215,
      lng: 3.411,
      icon: Building2,
      color: '#E11D48',
    },
    {
      id: 'palms_mall',
      name: 'The Palms Mall Lekki',
      x: 290,
      y: 255,
      lat: 6.4326,
      lng: 3.4475,
      icon: Trees,
      color: '#16A34A',
    },
  ];

  // Helper to render vehicle icon according to active service or vehicle type
  const renderVehicleIcon = (service: typeof activeService) => {
    const iconColor = '#FFFFFF';
    switch (service) {
      case 'rental':
        return <Key width={12} height={12} color={iconColor} />;
      case 'parcel':
        return <Package width={12} height={12} color={iconColor} />;
      case 'freight':
        return <Truck width={13} height={13} color={iconColor} />;
      case 'ambulance':
        return <Ambulance width={14} height={14} color={iconColor} />;
      case 'ride':
      default:
        return <Car width={13} height={13} color={iconColor} />;
    }
  };

  const getServiceLabel = () => {
    switch (activeService) {
      case 'rental':
        return 'Broader Rentals';
      case 'parcel':
        return 'Broader Parcels';
      case 'freight':
        return 'Freight Units';
      case 'ambulance':
        return 'Priority Responders';
      case 'ride':
      default:
        return 'Broader Drivers';
    }
  };

  const handleLandmarkClick = (lm: (typeof landmarks)[0]) => {
    if (onSelectLandmark) {
      onSelectLandmark(lm.name, lm.lat, lm.lng);
    } else {
      setDestinationLocation({
        latitude: lm.lat,
        longitude: lm.lng,
        address: lm.name,
      });
    }
  };

  const isRadarSearching = isSearching || rideStatus === 'searching';
  const isTracking =
    activeTrip !== null &&
    ['driver_assigned', 'driver_arriving', 'driver_arrived', 'ride_started', 'ride_completed'].includes(
      rideStatus
    );

  return (
    <div
      className={`relative w-full ${height} bg-[#06070a] rounded-2xl overflow-hidden shadow-2xl border border-white/[0.08] select-none group ${className}`}
    >
      {/* Map Graphic SVG */}
      <svg
        className="w-full h-full cursor-grab active:cursor-grabbing transition-transform duration-200"
        viewBox="0 0 500 350"
        style={{
          transform: `scale(${zoom}) translate(${pan.x}px, ${pan.y}px)`,
        }}
      >
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#141824" strokeWidth="1" />
          </pattern>
          <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0286FF" />
            <stop offset="100%" stopColor="#38BDF8" />
          </linearGradient>
          <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.4" />
          </filter>
        </defs>

        {/* Map Base Texture / Roads */}
        <rect width="500" height="350" fill="#07090e" />
        <rect width="500" height="350" fill="url(#grid)" />

        {/* Water bodies (Lagos Lagoon & Atlantic coastline representation) */}
        <path
          d="M 370 0 Q 420 85 435 180 T 500 350 L 500 0 Z"
          fill="#0a1220"
          opacity="0.9"
        />
        <text x="435" y="65" fill="#3b6282" fontSize="9.5" fontWeight="600" className="italic">
          Lagos Lagoon
        </text>

        {/* Atlantic Gulf waters at bottom */}
        <path
          d="M 0 315 Q 250 295 500 325 L 500 350 L 0 350 Z"
          fill="#08101c"
          opacity="0.8"
        />
        <text x="18" y="338" fill="#3b6282" fontSize="8" fontWeight="600" className="italic">
          Gulf of Guinea (Atlantic)
        </text>

        {/* Green Zones / Parks */}
        <rect x="30" y="45" width="80" height="85" rx="12" fill="#0d1811" opacity="0.85" stroke="#162e20" strokeWidth="1" />
        <text x="42" y="88" fill="#48bb78" fontSize="8.5" fontWeight="600">
          Tarkwa Bay
        </text>

        <rect x="260" y="225" width="105" height="65" rx="8" fill="#0d1811" opacity="0.85" stroke="#162e20" strokeWidth="1" />
        <text x="275" y="258" fill="#48bb78" fontSize="8.5" fontWeight="600">
          Lekki Nature Park
        </text>

        {/* Main Arterial Roadways (e.g. Ahmadu Bello Way / Lekki-Epe Expressway) */}
        <path
          d="M -10 180 C 120 180 200 160 320 210 S 480 250 510 270"
          fill="none"
          stroke="#1b2230"
          strokeWidth="14"
        />
        <path
          d="M -10 180 C 120 180 200 160 320 210 S 480 250 510 270"
          fill="none"
          stroke="#0286FF"
          strokeWidth="2.5"
          strokeDasharray="8 6"
          strokeOpacity="0.7"
        />

        {/* Cross Boulevards (Ozumba Mbadiwe & Adeola Odeku) */}
        <path d="M 180 -10 L 180 360" fill="none" stroke="#1a202c" strokeWidth="12" />
        <path d="M 320 -10 L 320 360" fill="none" stroke="#1a202c" strokeWidth="10" />
        <path d="M -10 80 L 380 80" fill="none" stroke="#1a202c" strokeWidth="10" />
        <path d="M 80 -10 L 80 360" fill="none" stroke="#1a202c" strokeWidth="8" />

        {/* Route Line if destination set */}
        {showRoute && (destinationLatitude || isTracking) && (
          <>
            <path
              d="M 180 160 Q 230 140 280 180 T 360 260"
              fill="none"
              stroke="#0286FF"
              strokeWidth="6"
              strokeLinecap="round"
              strokeOpacity="0.3"
            />
            <path
              d="M 180 160 Q 230 140 280 180 T 360 260"
              fill="none"
              stroke="url(#routeGradient)"
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray="6 4"
            />
          </>
        )}

        {/* Important Landmarks (Toggleable) */}
        {showLandmarks &&
          landmarks.map((lm) => (
            <g
              key={lm.id}
              onClick={() => handleLandmarkClick(lm)}
              className="cursor-pointer group/lm transition-all"
              filter="url(#shadow)"
            >
              <circle
                cx={lm.x}
                cy={lm.y}
                r="5.5"
                fill="#000000"
                stroke={lm.color}
                strokeWidth="2"
              />
              <circle cx={lm.x} cy={lm.y} r="2" fill={lm.color} />

              <rect
                x={lm.x - 44}
                y={lm.y - 19}
                width="88"
                height="15"
                rx="4"
                fill="#0e131d"
                stroke="#2a364f"
                strokeWidth="1"
              />
              <text
                x={lm.x}
                y={lm.y - 9}
                fill="#e2e8f0"
                fontSize="7"
                fontWeight="700"
                textAnchor="middle"
              >
                {lm.name}
              </text>
            </g>
          ))}

        {/* DRIVER SEARCH RADAR PULSES (Feature 3) */}
        {isRadarSearching && (
          <g transform="translate(180, 160)">
            {/* Concentric expanding scanning rings */}
            <circle cx="0" cy="0" r="35" fill="#0286FF" opacity="0.15">
              <animate attributeName="r" values="10;85;120" dur="2.4s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.4;0.15;0" dur="2.4s" repeatCount="indefinite" />
            </circle>
            <circle cx="0" cy="0" r="55" fill="none" stroke="#0286FF" strokeWidth="1.5" opacity="0.4">
              <animate attributeName="r" values="20;95;130" dur="2.4s" begin="0.8s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.5;0.15;0" dur="2.4s" begin="0.8s" repeatCount="indefinite" />
            </circle>
            <circle cx="0" cy="0" r="75" fill="none" stroke="#0286FF" strokeWidth="1" opacity="0.2">
              <animate attributeName="r" values="30;110;145" dur="2.4s" begin="1.6s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.4;0.1;0" dur="2.4s" begin="1.6s" repeatCount="indefinite" />
            </circle>

            {/* Radar scanner sweep line */}
            <line x1="0" y1="0" x2="65" y2="65" stroke="#0286FF" strokeWidth="2" strokeOpacity="0.6">
              <animateTransform
                attributeName="transform"
                type="rotate"
                from="0"
                to="360"
                dur="3s"
                repeatCount="indefinite"
              />
            </line>
          </g>
        )}

        {/* Nearby Available Vehicles / Drivers (When not in full tracking) */}
        {!isTracking &&
          drivers.map((d, index) => {
            const coords = [
              { x: 125, y: 125 },
              { x: 235, y: 110 },
              { x: 135, y: 225 },
              { x: 255, y: 175 },
            ][index % 4];

            const isSelected = selectedDriver === d.id;
            const isEmergency = activeService === 'ambulance';

            return (
              <g
                key={d.id}
                onClick={() => setSelectedDriver(d.id)}
                className="cursor-pointer transition-all duration-200"
                filter="url(#shadow)"
              >
                {isEmergency && (
                  <circle cx={coords.x} cy={coords.y} r="18" fill="#EF4444" opacity="0.25">
                    <animate attributeName="r" values="14;22;14" dur="1.2s" repeatCount="indefinite" />
                    <animate
                      attributeName="opacity"
                      values="0.35;0.05;0.35"
                      dur="1.2s"
                      repeatCount="indefinite"
                    />
                  </circle>
                )}
                <circle
                  cx={coords.x}
                  cy={coords.y}
                  r={isSelected ? 15 : 12.5}
                  fill={isEmergency ? '#DC2626' : isSelected ? '#0286FF' : '#1E293B'}
                  stroke="#FFFFFF"
                  strokeWidth={isSelected ? 2.5 : 2}
                />
                <g transform={`translate(${coords.x - 6}, ${coords.y - 6})`}>
                  {renderVehicleIcon(activeService)}
                </g>

                {/* ETA badge over vehicle in Naira ₦ */}
                <rect
                  x={coords.x - 19}
                  y={coords.y - 26}
                  width="38"
                  height="13"
                  rx="4"
                  fill="#FFFFFF"
                  stroke={isSelected ? '#0286FF' : isEmergency ? '#EF4444' : '#CBD5E1'}
                  strokeWidth="1"
                />
                <text
                  x={coords.x}
                  y={coords.y - 17}
                  fill={isSelected ? '#0286FF' : isEmergency ? '#DC2626' : '#334155'}
                  fontSize="7.5"
                  fontWeight="700"
                  textAnchor="middle"
                >
                  {d.time || 4}m • ₦{d.price || '2,800'}
                </text>
              </g>
            );
          })}

        {/* ACTIVE LIVE DRIVER MARKER (Feature 4 - Tracking Mode) */}
        {isTracking && activeTrip && (
          <g
            transform={`translate(${driverAnimPos.x}, ${driverAnimPos.y})`}
            filter="url(#shadow)"
            className="transition-all duration-700 ease-out"
          >
            {/* Pulsing aura */}
            <circle cx="0" cy="0" r="20" fill="#0286FF" opacity="0.2">
              <animate attributeName="r" values="14;22;14" dur="1.8s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.3;0.08;0.3" dur="1.8s" repeatCount="indefinite" />
            </circle>

            {/* Vehicle Icon Circle */}
            <circle cx="0" cy="0" r="16" fill="#0286FF" stroke="#FFFFFF" strokeWidth="2.5" />
            <g transform="translate(-7, -7)">
              <Car width={14} height={14} color="#FFFFFF" />
            </g>

            {/* Driver Callout Badge */}
            <rect
              x="-48"
              y="-32"
              width="96"
              height="16"
              rx="5"
              fill="#1E293B"
              stroke="#0286FF"
              strokeWidth="1"
            />
            <text x="0" y="-21" fill="#FFFFFF" fontSize="7.5" fontWeight="700" textAnchor="middle">
              {activeTrip.driver.first_name} • {activeTrip.driver.plate_number || 'EKY-428-AB'}
            </text>
          </g>
        )}

        {/* Current Pickup Location Pin (Origin GPS) */}
        <g filter="url(#shadow)">
          <circle cx="180" cy="160" r="20" fill="#0286FF" opacity="0.18">
            <animate attributeName="r" values="12;24;12" dur="2.5s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.25;0.05;0.25" dur="2.5s" repeatCount="indefinite" />
          </circle>
          <circle cx="180" cy="160" r="8" fill="#0286FF" stroke="#FFFFFF" strokeWidth="2.5" />
          <circle cx="180" cy="160" r="3" fill="#FFFFFF" />

          {/* Pickup Tag */}
          <rect x="135" y="125" width="90" height="17" rx="5" fill="#1E293B" />
          <text x="180" y="137" fill="#FFFFFF" fontSize="8" fontWeight="700" textAnchor="middle">
            {isTracking ? 'Pickup Point' : 'Your Location'}
          </text>
        </g>

        {/* Destination Pin (if set) */}
        {(destinationLatitude || isTracking) && (
          <g filter="url(#shadow)">
            <path
              d="M 360 238 C 352 238 346 244 346 252 C 346 264 360 276 360 276 C 360 276 374 264 374 252 C 374 244 368 238 360 238 Z"
              fill="#EF4444"
              stroke="#FFFFFF"
              strokeWidth="2"
            />
            <circle cx="360" cy="251" r="3" fill="#FFFFFF" />
            <rect
              x="295"
              y="214"
              width="130"
              height="18"
              rx="5"
              fill="#FFFFFF"
              stroke="#EF4444"
              strokeWidth="1"
            />
            <text x="360" y="226" fill="#1E293B" fontSize="8" fontWeight="700" textAnchor="middle">
              {destinationAddress ? destinationAddress.slice(0, 20) + '...' : 'Destination LOS'}
            </text>
          </g>
        )}
      </svg>

      {/* Map Overlay Controls - Frosted Glass */}
      <div className="absolute top-3 right-3 flex flex-col gap-1.5 z-10">
        <button
          onClick={() => setZoom((z) => Math.min(z + 0.2, 1.8))}
          className="w-8 h-8 rounded-lg bg-black/60 backdrop-blur-xl border border-white/10 text-neutral-300 shadow-lg flex items-center justify-center hover:text-white hover:bg-white/10 active:scale-95 transition-all text-xs"
          title="Zoom In"
        >
          <Plus className="w-4 h-4" />
        </button>
        <button
          onClick={() => setZoom((z) => Math.max(z - 0.2, 0.8))}
          className="w-8 h-8 rounded-lg bg-black/60 backdrop-blur-xl border border-white/10 text-neutral-300 shadow-lg flex items-center justify-center hover:text-white hover:bg-white/10 active:scale-95 transition-all text-xs"
          title="Zoom Out"
        >
          <Minus className="w-4 h-4" />
        </button>
        <button
          onClick={() => {
            setZoom(1);
            setPan({ x: 0, y: 0 });
          }}
          className="w-8 h-8 rounded-lg bg-black/60 backdrop-blur-xl border border-white/10 text-[#0286FF] shadow-lg flex items-center justify-center hover:bg-white/10 active:scale-95 transition-all"
          title="Re-center Location"
        >
          <Crosshair className="w-4 h-4" />
        </button>
        <button
          onClick={() => setShowLandmarks((prev) => !prev)}
          className={`w-8 h-8 rounded-lg shadow-lg flex items-center justify-center transition-all border ${
            showLandmarks
              ? 'bg-[#0286FF] text-white border-[#0286FF]'
              : 'bg-black/60 backdrop-blur-xl border-white/10 text-neutral-300 hover:text-white hover:bg-white/10'
          }`}
          title={showLandmarks ? 'Hide Landmarks' : 'Show Landmarks'}
        >
          <Landmark className="w-4 h-4" />
        </button>
      </div>

      {/* Map Footer Info Pill - Frosted Glass */}
      <div className="absolute bottom-3 left-3 bg-black/75 backdrop-blur-xl px-3 py-1.5 rounded-full text-[11px] font-JakartaMedium text-neutral-300 shadow-xl flex items-center gap-2 border border-white/10">
        <span
          className={`w-2 h-2 rounded-full ${
            isRadarSearching
              ? 'bg-blue-400 animate-ping'
              : isTracking
              ? 'bg-emerald-400 animate-pulse'
              : activeService === 'ambulance'
              ? 'bg-red-400'
              : 'bg-emerald-400'
          }`}
        />
        <span>
          {isRadarSearching
            ? 'Scanning Lagos drivers nearby...'
            : isTracking
            ? `Live Tracking • ${activeTrip?.driver.first_name || 'Driver'}`
            : `Live Map • ${getServiceLabel()}`}
        </span>
      </div>
    </div>
  );
};
