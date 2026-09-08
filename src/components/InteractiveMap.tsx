import React, { useState, useEffect, useRef } from 'react';
import { useBroaderStore } from '../store/useBroaderStore';
import { getVehicle3DImage, VEHICLE_3D_ASSETS } from '../data/vehicleAssets';
import { VehicleMarker } from './vehicle/VehicleMarker';
import {
  Plus,
  Minus,
  Crosshair,
  Landmark,
  Building2,
  Trees,
  Maximize2,
  Minimize2,
  Compass,
  Eye,
  Layers,
  Box,
  RotateCcw,
  Navigation,
  Sparkles,
  Car,
  X,
  Phone,
  Star,
  ChevronRight,
  ShieldCheck,
  Zap,
} from 'lucide-react';

interface InteractiveMapProps {
  showRoute?: boolean;
  className?: string;
  height?: string;
  onSelectLandmark?: (name: string, lat: number, lng: number) => void;
  isSearching?: boolean;
  initialFullPreview?: boolean;
  topOffset?: string;
  hideControls?: boolean;
  is3DTiltProp?: boolean;
  onToggle3D?: () => void;
  onToggleLayers?: () => void;
  onRecenter?: () => void;
  onResetNorth?: () => void;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  showRoute = true,
  className = '',
  height = 'h-[320px]',
  onSelectLandmark,
  isSearching = false,
  initialFullPreview = false,
  topOffset,
  hideControls = false,
  is3DTiltProp,
  onToggle3D,
  onToggleLayers,
  onRecenter,
  onResetNorth,
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

  // Map state
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isFullPreview, setIsFullPreview] = useState(initialFullPreview);
  const [is3DTilt, setIs3DTilt] = useState(true);
  const [mapMode, setMapMode] = useState<'vector' | 'satellite'>('vector');
  const [bearing, setBearing] = useState(18); // slight aesthetic heading angle
  const [showLandmarks, setShowLandmarks] = useState(true);
  const [isStreetView, setIsStreetView] = useState(false);
  const [streetViewPan, setStreetViewPan] = useState(0);
  const [inspectedDriver, setInspectedDriver] = useState<any | null>(null);

  // Animated driver coordinates for live journey
  const [driverAnimPos, setDriverAnimPos] = useState({ x: 135, y: 120, rotation: 35 });

  // Update animated driver position based on ride status
  useEffect(() => {
    if (!activeTrip) return;

    if (rideStatus === 'driver_assigned' || rideStatus === 'driver_arriving') {
      const interval = setInterval(() => {
        setDriverAnimPos((prev) => {
          const targetX = 180;
          const targetY = 160;
          const dx = (targetX - prev.x) * 0.16;
          const dy = (targetY - prev.y) * 0.16;
          const angle = Math.atan2(dy, dx) * (180 / Math.PI);
          if (Math.abs(targetX - prev.x) < 2 && Math.abs(targetY - prev.y) < 2) {
            return { x: 180, y: 160, rotation: 40 };
          }
          return { x: prev.x + dx, y: prev.y + dy, rotation: angle || 35 };
        });
      }, 700);
      return () => clearInterval(interval);
    } else if (rideStatus === 'driver_arrived') {
      setDriverAnimPos({ x: 180, y: 160, rotation: 0 });
    } else if (rideStatus === 'ride_started') {
      const interval = setInterval(() => {
        setDriverAnimPos((prev) => {
          const targetX = 350;
          const targetY = 235;
          const dx = (targetX - prev.x) * 0.14;
          const dy = (targetY - prev.y) * 0.14;
          const angle = Math.atan2(dy, dx) * (180 / Math.PI);
          return { x: prev.x + dx, y: prev.y + dy, rotation: angle || 45 };
        });
      }, 700);
      return () => clearInterval(interval);
    } else if (rideStatus === 'ride_completed') {
      setDriverAnimPos({ x: 360, y: 240, rotation: 45 });
    }
  }, [rideStatus, activeTrip]);

  // Lagos Landmarks
  const landmarks = [
    {
      id: 'lekki_bridge',
      name: 'Lekki-Ikoyi Link Bridge',
      x: 395,
      y: 90,
      lat: 6.4474,
      lng: 3.4735,
      icon: Landmark,
      color: '#9EE6B5',
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
      name: 'Eko Atlantic Boulevard',
      x: 165,
      y: 95,
      lat: 6.4215,
      lng: 3.411,
      icon: Building2,
      color: '#E11D48',
    },
    {
      id: 'palms_mall',
      name: 'The Palms Lekki',
      x: 290,
      y: 255,
      lat: 6.4326,
      lng: 3.4475,
      icon: Trees,
      color: '#16A34A',
    },
  ];

  // Coords for nearby 3D vehicles
  const vehicleLocations = [
    { x: 125, y: 125, heading: 45, category: 'car' },
    { x: 235, y: 110, heading: -25, category: 'suv' },
    { x: 135, y: 225, heading: 85, category: 'motorcycle' },
    { x: 265, y: 185, heading: -60, category: 'tricycle' },
  ];

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

  const getCompassHeadingLabel = (deg: number) => {
    const norm = ((deg % 360) + 360) % 360;
    if (norm >= 337.5 || norm < 22.5) return `${Math.round(norm)}° N`;
    if (norm >= 22.5 && norm < 67.5) return `${Math.round(norm)}° NE`;
    if (norm >= 67.5 && norm < 112.5) return `${Math.round(norm)}° E`;
    if (norm >= 112.5 && norm < 157.5) return `${Math.round(norm)}° SE`;
    if (norm >= 157.5 && norm < 202.5) return `${Math.round(norm)}° S`;
    if (norm >= 202.5 && norm < 247.5) return `${Math.round(norm)}° SW`;
    if (norm >= 247.5 && norm < 292.5) return `${Math.round(norm)}° W`;
    return `${Math.round(norm)}° NW`;
  };

  return (
    <div
      id="broader-map-container"
      className={`relative w-full ${
        isFullPreview
          ? 'fixed inset-0 z-50 h-screen w-screen bg-[#04060a] m-0 rounded-none border-0'
          : height === 'h-full'
          ? 'h-full rounded-none border-0 shadow-none'
          : `${height} rounded-2xl border border-white/[0.08] shadow-2xl`
      } bg-[#04060a] overflow-hidden select-none group transition-all duration-300 ${className}`}
    >
      {/* 3D MAP VIEWPORT CONTAINER */}
      <div
        className="w-full h-full relative overflow-hidden flex items-center justify-center cursor-grab active:cursor-grabbing"
        style={{
          perspective: is3DTilt ? '1000px' : 'none',
        }}
      >
        {/* Transformable 3D Map Plane */}
        <div
          className="w-full h-full relative transition-transform duration-500 ease-out origin-center"
          style={{
            transform: is3DTilt
              ? `scale(${zoom}) rotateX(46deg) rotateZ(${bearing}deg) translate(${pan.x}px, ${pan.y}px)`
              : `scale(${zoom}) translate(${pan.x}px, ${pan.y}px)`,
          }}
        >
          {/* SVG Map Geometry */}
          <svg
            className="w-full h-full"
            viewBox="0 0 500 350"
            preserveAspectRatio="xMidYMid slice"
          >
            <defs>
              {/* Pattern for dark vector street grid */}
              <pattern id="streetGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#121722" strokeWidth="0.8" />
              </pattern>

              {/* Satellite texture pattern */}
              <linearGradient id="satOcean" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#051322" />
                <stop offset="60%" stopColor="#081c33" />
                <stop offset="100%" stopColor="#020914" />
              </linearGradient>

              <linearGradient id="satTerrain" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#0c1318" />
                <stop offset="50%" stopColor="#0f191f" />
                <stop offset="100%" stopColor="#080c10" />
              </linearGradient>

              {/* Headlight illumination beam cone */}
              <linearGradient id="headlightCone" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.85" />
                <stop offset="40%" stopColor="#E0F2FE" stopOpacity="0.4" />
                <stop offset="80%" stopColor="#38BDF8" stopOpacity="0.15" />
                <stop offset="100%" stopColor="#38BDF8" stopOpacity="0" />
              </linearGradient>

              {/* Glowing Route Line */}
              <linearGradient id="routeGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#9EE6B5" />
                <stop offset="50%" stopColor="#34D399" />
                <stop offset="100%" stopColor="#00E5FF" />
              </linearGradient>

              <filter id="softShadow" x="-30%" y="-30%" width="160%" height="160%">
                <feDropShadow dx="0" dy="4" stdDeviation="4" floodOpacity="0.55" floodColor="#000000" />
              </filter>
            </defs>

            {/* BASE TERRAIN LAYER */}
            {mapMode === 'satellite' ? (
              <>
                {/* Satellite Base Surface */}
                <rect width="500" height="350" fill="url(#satTerrain)" />
                {/* High tech terrain contour lines */}
                <path
                  d="M 20 60 Q 180 30 320 80 T 500 40"
                  fill="none"
                  stroke="#162633"
                  strokeWidth="1.2"
                  strokeDasharray="4 8"
                />
                <path
                  d="M 0 140 Q 220 170 380 130 T 500 170"
                  fill="none"
                  stroke="#162633"
                  strokeWidth="1.2"
                  strokeDasharray="6 10"
                />
                {/* Realistic Lagos Lagoon Coastline */}
                <path
                  d="M 360 0 Q 420 80 435 180 T 500 350 L 500 0 Z"
                  fill="url(#satOcean)"
                  opacity="0.95"
                />
                {/* Atlantic Coast water */}
                <path
                  d="M 0 310 Q 240 290 500 320 L 500 350 L 0 350 Z"
                  fill="url(#satOcean)"
                  opacity="0.95"
                />
                {/* City nighttime light speckles */}
                <circle cx="160" cy="110" r="1.5" fill="#38BDF8" opacity="0.6" />
                <circle cx="210" cy="85" r="1.2" fill="#FBBF24" opacity="0.5" />
                <circle cx="290" cy="140" r="1.8" fill="#38BDF8" opacity="0.7" />
                <circle cx="340" cy="200" r="1.5" fill="#FBBF24" opacity="0.6" />
                <circle cx="110" cy="200" r="1.2" fill="#38BDF8" opacity="0.5" />
              </>
            ) : (
              <>
                {/* Dark Obsidian Vector Grid Base */}
                <rect width="500" height="350" fill="#06090e" />
                <rect width="500" height="350" fill="url(#streetGrid)" />

                {/* Lagoon & Ocean */}
                <path
                  d="M 370 0 Q 420 85 435 180 T 500 350 L 500 0 Z"
                  fill="#091424"
                  opacity="0.9"
                />
                <path
                  d="M 0 315 Q 250 295 500 325 L 500 350 L 0 350 Z"
                  fill="#07101d"
                  opacity="0.9"
                />
              </>
            )}

            {/* Ocean & Lagoon labels */}
            <text x="430" y="55" fill="#38bdf8" opacity="0.4" fontSize="8.5" fontWeight="700" letterSpacing="0.1em">
              LAGOS LAGOON
            </text>
            <text x="24" y="338" fill="#38bdf8" opacity="0.35" fontSize="7.5" fontWeight="700" letterSpacing="0.1em">
              GULF OF GUINEA (ATLANTIC)
            </text>

            {/* Green Parks / Coastal nature areas */}
            <rect x="30" y="45" width="80" height="85" rx="12" fill="#0b1710" opacity="0.85" stroke="#132e1c" strokeWidth="1" />
            <text x="44" y="88" fill="#34d399" fontSize="8" fontWeight="600" opacity="0.8">
              Tarkwa Bay
            </text>

            <rect x="260" y="225" width="105" height="65" rx="10" fill="#0b1710" opacity="0.85" stroke="#132e1c" strokeWidth="1" />
            <text x="275" y="258" fill="#34d399" fontSize="8" fontWeight="600" opacity="0.8">
              Lekki Conservation
            </text>

            {/* 3D BUILDING EXTRUSIONS IN 3D MODE */}
            {is3DTilt && (
              <g className="transition-opacity duration-300">
                {/* VI Highrises */}
                <polygon points="190,110 215,100 215,130 190,140" fill="#131d2b" stroke="#1e2d42" strokeWidth="0.8" />
                <polygon points="190,110 202,95 227,85 215,100" fill="#1e2c3f" />
                {/* Lit windows in skyscraper */}
                <circle cx="198" cy="118" r="1" fill="#38bdf8" opacity="0.7" />
                <circle cx="206" cy="115" r="1" fill="#facc15" opacity="0.6" />
                <circle cx="198" cy="128" r="1" fill="#38bdf8" opacity="0.7" />

                {/* Lekki Commercial Tower */}
                <polygon points="310,130 335,120 335,150 310,160" fill="#15202e" stroke="#22334a" strokeWidth="0.8" />
                <polygon points="310,130 322,118 347,108 335,120" fill="#203046" />
                <circle cx="318" cy="138" r="1" fill="#38bdf8" opacity="0.8" />
                <circle cx="326" cy="135" r="1" fill="#38bdf8" opacity="0.8" />

                {/* Eko Atlantic Crown */}
                <polygon points="145,85 168,75 168,105 145,115" fill="#182333" stroke="#283d57" strokeWidth="0.8" />
                <polygon points="145,85 155,75 178,65 168,75" fill="#24374e" />
              </g>
            )}

            {/* GLOWING STREET TREES ALONG BOULEVARDS */}
            <g opacity="0.85">
              {[
                { x: 30, y: 72 }, { x: 50, y: 72 }, { x: 70, y: 72 },
                { x: 100, y: 72 }, { x: 120, y: 72 }, { x: 140, y: 72 }, { x: 160, y: 72 },
                { x: 200, y: 72 }, { x: 220, y: 72 }, { x: 240, y: 72 }, { x: 260, y: 72 },
                { x: 190, y: 20 }, { x: 190, y: 40 }, { x: 190, y: 60 },
                { x: 190, y: 100 }, { x: 190, y: 120 }, { x: 190, y: 140 },
                { x: 190, y: 220 }, { x: 190, y: 240 }, { x: 190, y: 260 },
                { x: 330, y: 20 }, { x: 330, y: 40 }, { x: 330, y: 60 },
                { x: 330, y: 100 }, { x: 330, y: 120 }, { x: 330, y: 140 },
                { x: 330, y: 220 }, { x: 330, y: 240 }, { x: 330, y: 260 },
              ].map((t, idx) => (
                <circle
                  key={idx}
                  cx={t.x}
                  cy={t.y}
                  r="2.2"
                  fill="#9EE6B5"
                  className="filter drop-shadow-[0_0_4px_rgba(158,230,181,0.9)]"
                />
              ))}
            </g>

            {/* MAIN ARTERIAL ROAD NETWORK (Lekki-Epe Expressway, Ozumba Mbadiwe, Ahmadu Bello Way) */}
            <path
              d="M -10 180 C 120 180 200 160 320 210 S 480 250 510 270"
              fill="none"
              stroke="#18202d"
              strokeWidth="16"
            />
            {/* Road center dash lighting */}
            <path
              d="M -10 180 C 120 180 200 160 320 210 S 480 250 510 270"
              fill="none"
              stroke="#9EE6B5"
              strokeWidth="1.8"
              strokeDasharray="8 6"
              strokeOpacity="0.75"
            />

            {/* Cross Avenues */}
            <path d="M 180 -10 L 180 360" fill="none" stroke="#161e2a" strokeWidth="12" />
            <path d="M 320 -10 L 320 360" fill="none" stroke="#161e2a" strokeWidth="10" />
            <path d="M -10 80 L 480 80" fill="none" stroke="#161e2a" strokeWidth="10" />
            <path d="M 80 -10 L 80 360" fill="none" stroke="#161e2a" strokeWidth="8" />

            {/* FLOATING STREET NAMES (As shown in reference mockup) */}
            <g className="pointer-events-none select-none">
              <rect x="92" y="66" width="94" height="13" rx="3" fill="#090f18" fillOpacity="0.85" stroke="#ffffff" strokeOpacity="0.12" strokeWidth="0.7" />
              <text x="139" y="75.5" fill="#e2e8f0" fontSize="6.5" fontWeight="700" letterSpacing="0.04em" textAnchor="middle">
                Atlantic Boulevard
              </text>

              <rect x="188" y="196" width="118" height="13" rx="3" fill="#090f18" fillOpacity="0.85" stroke="#ffffff" strokeOpacity="0.12" strokeWidth="0.7" />
              <text x="247" y="205.5" fill="#e2e8f0" fontSize="6.5" fontWeight="700" letterSpacing="0.04em" textAnchor="middle">
                Lekki - Epe Expressway
              </text>
            </g>

            {/* ROUTE LINE WITH CINEMATIC LIGHTING & NEON BLOOM */}
            {showRoute && (
              <>
                {/* Wide cyan glow bloom */}
                <path
                  d="M 140 160 C 180 160 210 145 280 175 S 350 220 395 235"
                  fill="none"
                  stroke="#00E5FF"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeOpacity="0.3"
                  className="filter drop-shadow-[0_0_12px_rgba(0,229,255,0.7)]"
                />
                {/* Middle mint glow line */}
                <path
                  d="M 140 160 C 180 160 210 145 280 175 S 350 220 395 235"
                  fill="none"
                  stroke="#9EE6B5"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeOpacity="0.6"
                />
                {/* Crisp bright white/cyan core line */}
                <path
                  d="M 140 160 C 180 160 210 145 280 175 S 350 220 395 235"
                  fill="none"
                  stroke="#FFFFFF"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeDasharray="6 4"
                />

                {/* DESTINATION WAYPOINT BULLSEYE (Concentric Glowing Red Rings) */}
                <g transform="translate(395, 235)" filter="url(#softShadow)">
                  {/* Outer pulse wave */}
                  <circle cx="0" cy="0" r="14" fill="#ef4444" fillOpacity="0.15" stroke="#ef4444" strokeWidth="1" strokeOpacity="0.4">
                    <animate attributeName="r" values="8;18;8" dur="2.2s" repeatCount="indefinite" />
                    <animate attributeName="stroke-opacity" values="0.6;0.1;0.6" dur="2.2s" repeatCount="indefinite" />
                  </circle>
                  <circle cx="0" cy="0" r="9" fill="#ef4444" fillOpacity="0.3" stroke="#ef4444" strokeWidth="1.5" />
                  <circle cx="0" cy="0" r="4.5" fill="#ef4444" stroke="#ffffff" strokeWidth="1.2" />
                  <circle cx="0" cy="0" r="1.5" fill="#ffffff" />
                </g>

                {/* ACTIVE VEHICLE WITH HEADLIGHT BEAMS & TAILLIGHTS ON ROUTE */}
                <g transform="translate(235, 155) rotate(22)">
                  {/* Headlight beam cones projecting forward onto road */}
                  <polygon
                    points="6,-4 38,-14 38,14 6,4"
                    fill="url(#headlightCone)"
                    opacity="0.75"
                  />
                  {/* Left & Right Headlight bulbs */}
                  <circle cx="6" cy="-3" r="1.5" fill="#ffffff" className="filter drop-shadow-[0_0_4px_#ffffff]" />
                  <circle cx="6" cy="3" r="1.5" fill="#ffffff" className="filter drop-shadow-[0_0_4px_#ffffff]" />

                  {/* Rear red taillights & light trail */}
                  <line x1="-7" y1="-3" x2="-18" y2="-3" stroke="#ef4444" strokeWidth="1.5" strokeOpacity="0.7" strokeLinecap="round" />
                  <line x1="-7" y1="3" x2="-18" y2="3" stroke="#ef4444" strokeWidth="1.5" strokeOpacity="0.7" strokeLinecap="round" />
                  <circle cx="-6" cy="-3" r="1.2" fill="#ef4444" className="filter drop-shadow-[0_0_4px_#ef4444]" />
                  <circle cx="-6" cy="3" r="1.2" fill="#ef4444" className="filter drop-shadow-[0_0_4px_#ef4444]" />

                  {/* Vehicle Body chassis (Sleek aerodynamic modern executive sedan) */}
                  <rect x="-7" y="-4" width="14" height="8" rx="2.5" fill="#0f172a" stroke="#38bdf8" strokeWidth="0.8" />
                  <rect x="-3" y="-3" width="7" height="6" rx="1.5" fill="#1e293b" />
                  {/* Roof glass */}
                  <rect x="-1" y="-2" width="4" height="4" rx="1" fill="#9EE6B5" fillOpacity="0.5" />
                </g>
              </>
            )}

            {/* IMPORTANT LANDMARKS */}
            {showLandmarks &&
              landmarks.map((lm) => (
                <g
                  key={lm.id}
                  onClick={() => handleLandmarkClick(lm)}
                  className="cursor-pointer transition-all hover:scale-110"
                  filter="url(#softShadow)"
                >
                  <circle cx={lm.x} cy={lm.y} r="5" fill="#000000" stroke={lm.color} strokeWidth="2" />
                  <circle cx={lm.x} cy={lm.y} r="2" fill={lm.color} />
                  <rect
                    x={lm.x - 45}
                    y={lm.y - 20}
                    width="90"
                    height="16"
                    rx="5"
                    fill="#0a0f18"
                    stroke="#1e293b"
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

            {/* RADAR PULSE IN SEARCHING MODE */}
            {isRadarSearching && (
              <g transform="translate(180, 160)">
                <circle cx="0" cy="0" r="35" fill="#9EE6B5" opacity="0.15">
                  <animate attributeName="r" values="10;90;130" dur="2.4s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.45;0.12;0" dur="2.4s" repeatCount="indefinite" />
                </circle>
                <circle cx="0" cy="0" r="60" fill="none" stroke="#9EE6B5" strokeWidth="1.5" opacity="0.4">
                  <animate attributeName="r" values="25;105;145" dur="2.4s" begin="0.8s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.5;0.15;0" dur="2.4s" begin="0.8s" repeatCount="indefinite" />
                </circle>
                <line x1="0" y1="0" x2="65" y2="65" stroke="#9EE6B5" strokeWidth="2.2" strokeOpacity="0.7">
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

            {/* PICKUP PIN (ORIGIN GPS) */}
            <g filter="url(#softShadow)">
              <circle cx="180" cy="160" r="18" fill="#9EE6B5" opacity="0.2">
                <animate attributeName="r" values="12;22;12" dur="2.4s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.3;0.06;0.3" dur="2.4s" repeatCount="indefinite" />
              </circle>
              <circle cx="180" cy="160" r="7" fill="#9EE6B5" stroke="#FFFFFF" strokeWidth="2" />
              <circle cx="180" cy="160" r="2.5" fill="#FFFFFF" />
              <rect x="135" y="126" width="90" height="17" rx="5" fill="#0f172a" stroke="#1e293b" strokeWidth="1" />
              <text x="180" y="138" fill="#FFFFFF" fontSize="8" fontWeight="700" textAnchor="middle">
                {isTracking ? 'Pickup Point' : 'Your Location'}
              </text>
            </g>

            {/* DESTINATION PIN */}
            {(destinationLatitude || isTracking) && (
              <g filter="url(#softShadow)">
                <path
                  d="M 360 238 C 352 238 346 244 346 252 C 346 264 360 276 360 276 C 360 276 374 264 374 252 C 374 244 368 238 360 238 Z"
                  fill="#EF4444"
                  stroke="#FFFFFF"
                  strokeWidth="1.5"
                />
                <circle cx="360" cy="251" r="3" fill="#FFFFFF" />
                <rect x="295" y="214" width="130" height="18" rx="5" fill="#0f172a" stroke="#EF4444" strokeWidth="1" />
                <text x="360" y="226" fill="#FFFFFF" fontSize="8" fontWeight="700" textAnchor="middle">
                  {destinationAddress ? destinationAddress.slice(0, 20) + '...' : 'Destination LOS'}
                </text>
              </g>
            )}
          </svg>

          {/* HTML 3D VEHICLE OVERLAYS WITH TRANSPARENT 3D RENDERS */}
          {!isTracking &&
            drivers.map((d, idx) => {
              const loc = vehicleLocations[idx % vehicleLocations.length];
              const isSelected = selectedDriver === d.id;

              return (
                <div
                  key={d.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedDriver(d.id);
                    setInspectedDriver(d);
                  }}
                  className="absolute cursor-pointer group/vehicle z-20"
                  style={{
                    left: `${(loc.x / 500) * 100}%`,
                    top: `${(loc.y / 350) * 100}%`,
                    transform: 'translate(-50%, -50%)',
                  }}
                >
                  <VehicleMarker
                    vehicleType={d.vehicle_type || loc.category || 'car'}
                    heading={loc.heading}
                    isMoving={true}
                    hasHeadlights={true}
                    size="sm"
                    selected={isSelected}
                    showLabel={true}
                    label={`${d.time || 3}m • ₦${d.price || '2,800'}`}
                  />
                </div>
              );
            })}

          {/* ACTIVE ASSIGNED DRIVER 3D MARKER (Tracking Mode) */}
          {isTracking && activeTrip && (
            <div
              className="absolute cursor-pointer z-30"
              style={{
                left: `${(driverAnimPos.x / 500) * 100}%`,
                top: `${(driverAnimPos.y / 350) * 100}%`,
                transform: 'translate(-50%, -50%)',
              }}
            >
              <VehicleMarker
                vehicleType={activeTrip.vehicle?.category || 'car'}
                heading={driverAnimPos.rotation}
                isMoving={true}
                hasHeadlights={true}
                size="md"
                selected={true}
                showLabel={true}
                label={`${activeTrip.driver.first_name} • ${activeTrip.driver.plate_number || 'EKY-428-AB'}`}
              />
            </div>
          )}
        </div>
      </div>

      {/* TOP CONTROLS BAR (FULL WIDTH & COMPACT FLOATING) */}
      {!hideControls && (
        <>
          <div className={`absolute ${topOffset || 'top-3'} left-3 right-3 flex items-center justify-between pointer-events-none z-30`}>
            {/* Left Status pill */}
            <div className="pointer-events-auto bg-black/80 backdrop-blur-xl px-3 py-1.5 rounded-full border border-white/10 text-xs font-JakartaBold text-white shadow-xl flex items-center gap-2">
              <span
                className={`w-2 h-2 rounded-full ${
                  isRadarSearching
                    ? 'bg-blue-400 animate-ping'
                    : isTracking
                    ? 'bg-emerald-400 animate-pulse'
                    : 'bg-emerald-400'
                }`}
              />
              <span className="truncate max-w-[150px] sm:max-w-xs text-[11px]">
                {isRadarSearching
                  ? 'Scanning Lagos...'
                  : isTracking
                  ? `Live • ${activeTrip?.driver.first_name || 'Driver'}`
                  : mapMode === 'satellite'
                  ? 'Satellite 3D • Lagos'
                  : 'Broader 3D Navigation'}
              </span>
            </div>

            {/* Right Action buttons */}
            <div className="pointer-events-auto flex items-center gap-1.5">
              {/* Street View Toggle */}
              <button
                onClick={() => setIsStreetView(true)}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-black/80 backdrop-blur-xl border border-white/15 text-xs font-JakartaSemiBold text-neutral-200 hover:text-white hover:border-[#9EE6B5] shadow-lg active:scale-95 transition-all"
                title="Open 3D Street View"
              >
                <Eye className="w-3.5 h-3.5 text-[#9EE6B5]" />
                <span className="hidden sm:inline text-[11px]">Street View</span>
              </button>

              {/* Satellite 3D Toggle */}
              <button
                onClick={() => setMapMode((m) => (m === 'vector' ? 'satellite' : 'vector'))}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl backdrop-blur-xl border text-xs font-JakartaSemiBold shadow-lg active:scale-95 transition-all ${
                  mapMode === 'satellite'
                    ? 'bg-[#9EE6B5] text-black font-extrabold border-[#9EE6B5]'
                    : 'bg-black/80 border-white/15 text-neutral-200 hover:text-white'
                }`}
                title="Toggle Satellite 3D"
              >
                <Layers className="w-3.5 h-3.5" />
                <span className="hidden sm:inline text-[11px]">Satellite</span>
              </button>

              {/* 3D Tilt View Mode */}
              <button
                onClick={() => setIs3DTilt((t) => !t)}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl backdrop-blur-xl border text-xs font-JakartaSemiBold shadow-lg active:scale-95 transition-all ${
                  is3DTilt
                    ? 'bg-white/15 text-white border-white/30'
                    : 'bg-black/80 border-white/15 text-neutral-400 hover:text-white'
                }`}
                title={is3DTilt ? '2D Top-Down' : '3D Perspective'}
              >
                <Box className="w-3.5 h-3.5 text-[#9EE6B5]" />
                <span className="text-[11px] font-JakartaBold">{is3DTilt ? '3D' : '2D'}</span>
              </button>

              {/* Full Preview Toggle */}
              <button
                onClick={() => setIsFullPreview((p) => !p)}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-black/80 backdrop-blur-xl border border-white/15 text-white hover:border-[#9EE6B5] shadow-lg active:scale-95 transition-all"
                title={isFullPreview ? 'Exit Full Preview' : 'Full Preview (3D)'}
              >
                {isFullPreview ? (
                  <>
                    <Minimize2 className="w-3.5 h-3.5 text-amber-400" />
                    <span className="text-[11px] font-JakartaBold">Exit</span>
                  </>
                ) : (
                  <>
                    <Maximize2 className="w-3.5 h-3.5 text-[#9EE6B5]" />
                    <span className="text-[11px] font-JakartaBold">Full 3D</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* FLOATING COMPASS & MAP MANIPULATION CONTROLS */}
          <div className={`absolute right-3 ${topOffset ? 'top-24' : 'top-14'} flex flex-col items-center gap-2 z-30`}>
            {/* Interactive Working Compass */}
            <button
              onClick={() => setBearing(0)}
              className="w-10 h-10 rounded-2xl bg-black/85 backdrop-blur-xl border border-white/15 shadow-2xl flex flex-col items-center justify-center active:scale-90 hover:border-white/30 transition-all group/compass relative"
              title={`Heading: ${getCompassHeadingLabel(bearing)} (Click to reset North)`}
            >
              <div
                className="w-6 h-6 flex items-center justify-center transition-transform duration-300"
                style={{ transform: `rotate(${-bearing}deg)` }}
              >
                <div className="w-0.5 h-3 bg-red-500 rounded-t-sm" />
                <div className="w-0.5 h-3 bg-slate-300 rounded-b-sm" />
              </div>
              <span className="text-[8px] font-JakartaBold text-neutral-300 -mt-0.5 tracking-tighter">
                {getCompassHeadingLabel(bearing).split(' ')[1] || 'N'}
              </span>
            </button>

            {/* Rotate left/right buttons for 3D bearing */}
            <div className="flex flex-col rounded-xl bg-black/80 backdrop-blur-xl border border-white/10 overflow-hidden shadow-xl">
              <button
                onClick={() => setBearing((b) => b - 15)}
                className="w-8 h-7 text-neutral-300 hover:text-white hover:bg-white/10 flex items-center justify-center text-[10px] font-JakartaBold active:scale-95"
                title="Rotate Left"
              >
                ↺
              </button>
              <div className="w-full h-px bg-white/10" />
              <button
                onClick={() => setBearing((b) => b + 15)}
                className="w-8 h-7 text-neutral-300 hover:text-white hover:bg-white/10 flex items-center justify-center text-[10px] font-JakartaBold active:scale-95"
                title="Rotate Right"
              >
                ↻
              </button>
            </div>

            {/* Zoom Controls */}
            <div className="flex flex-col rounded-xl bg-black/80 backdrop-blur-xl border border-white/10 overflow-hidden shadow-xl">
              <button
                onClick={() => setZoom((z) => Math.min(z + 0.2, 2.2))}
                className="w-8 h-8 text-neutral-300 hover:text-white hover:bg-white/10 flex items-center justify-center active:scale-95 transition-all"
                title="Zoom In"
              >
                <Plus className="w-4 h-4" />
              </button>
              <div className="w-full h-px bg-white/10" />
              <button
                onClick={() => setZoom((z) => Math.max(z - 0.2, 0.7))}
                className="w-8 h-8 text-neutral-300 hover:text-white hover:bg-white/10 flex items-center justify-center active:scale-95 transition-all"
                title="Zoom Out"
              >
                <Minus className="w-4 h-4" />
              </button>
              <div className="w-full h-px bg-white/10" />
              <button
                onClick={() => {
                  setZoom(1);
                  setPan({ x: 0, y: 0 });
                  setBearing(18);
                }}
                className="w-8 h-8 text-[#9EE6B5] hover:bg-white/10 flex items-center justify-center active:scale-95 transition-all"
                title="Re-center View"
              >
                <Crosshair className="w-4 h-4" />
              </button>
            </div>
          </div>
        </>
      )}

      {/* INSPECTED DRIVER POPUP CARD */}
      {inspectedDriver && (
        <div className="absolute bottom-3 left-3 right-3 max-w-sm mx-auto bg-black/90 backdrop-blur-2xl p-3 rounded-2xl border border-[#9EE6B5]/40 shadow-[0_10px_35px_rgba(0,0,0,0.9)] z-40 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <div className="flex items-center justify-between pb-2 border-b border-white/10">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl overflow-hidden bg-black/70 border border-white/15 flex items-center justify-center p-0.5">
                <img
                  src={getVehicle3DImage(inspectedDriver.vehicle_type, inspectedDriver.first_name)}
                  alt="Vehicle"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h4 className="text-xs font-JakartaBold text-white flex items-center gap-1.5">
                  {inspectedDriver.first_name} {inspectedDriver.last_name}
                  <span className="flex items-center text-[10px] text-amber-400">
                    <Star className="w-3 h-3 fill-amber-400 inline mr-0.5" />
                    {inspectedDriver.rating || 4.9}
                  </span>
                </h4>
                <p className="text-[10px] font-JakartaMedium text-neutral-400">
                  {inspectedDriver.car_seats || 4} Seats • {inspectedDriver.time || 3} mins away
                </p>
              </div>
            </div>
            <button
              onClick={() => setInspectedDriver(null)}
              className="w-6 h-6 rounded-full bg-white/10 hover:bg-white/20 text-neutral-300 flex items-center justify-center"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex items-center justify-between pt-2">
            <div>
              <span className="text-[10px] text-neutral-400 block font-JakartaMedium">Estimated Fare</span>
              <span className="text-sm font-JakartaBold text-[#9EE6B5]">₦{inspectedDriver.price || '2,800'}</span>
            </div>
            <button
              onClick={() => {
                setSelectedDriver(inspectedDriver.id);
                setInspectedDriver(null);
              }}
              className="px-3.5 py-1.5 rounded-xl bg-[#9EE6B5] hover:bg-[#8fd8a6] text-black font-extrabold text-xs font-JakartaBold shadow-lg active:scale-95 transition-all"
            >
              Select Vehicle
            </button>
          </div>
        </div>
      )}

      {/* 3D STREET VIEW OVERLAY MODAL */}
      {isStreetView && (
        <div className="absolute inset-0 z-50 bg-[#020408] flex flex-col justify-between overflow-hidden animate-in fade-in duration-300">
          {/* Street View Top Header */}
          <div className="p-3 bg-gradient-to-b from-black/90 to-transparent flex items-center justify-between z-20">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-full bg-blue-500/20 border border-blue-500/40 text-blue-400 text-[10px] font-JakartaBold flex items-center gap-1">
                <Eye className="w-3 h-3" />
                3D Street Level
              </span>
              <span className="text-xs font-JakartaBold text-white truncate max-w-[200px]">
                Ozumba Mbadiwe Ave, Victoria Island
              </span>
            </div>
            <button
              onClick={() => setIsStreetView(false)}
              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-white text-xs font-JakartaBold flex items-center gap-1 transition-all"
            >
              <X className="w-3.5 h-3.5" />
              <span>Exit</span>
            </button>
          </div>

          {/* 3D First-Person Perspective Viewport */}
          <div className="relative flex-1 w-full overflow-hidden flex items-center justify-center">
            {/* Horizon Sky & Lagos Skyline */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#060c18] via-[#09152b] to-[#040810]" />

            {/* Distant 3D Skyscrapers Skyline */}
            <div
              className="absolute bottom-[38%] w-[160%] flex items-end justify-around opacity-40 transition-transform duration-300"
              style={{ transform: `translateX(${streetViewPan * 0.4}px)` }}
            >
              <div className="w-16 h-40 bg-[#121c2d] rounded-t-sm relative border-t border-blue-400/40">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-ping absolute -top-1 left-7" />
              </div>
              <div className="w-24 h-56 bg-[#0f1726] rounded-t-md relative border-t border-sky-400/30" />
              <div className="w-20 h-48 bg-[#152238] rounded-t-md relative" />
              <div className="w-32 h-64 bg-[#0d1624] rounded-t-lg relative border-t border-blue-400/40" />
              <div className="w-24 h-44 bg-[#111d2e] rounded-t-sm relative" />
              <div className="w-16 h-52 bg-[#0e1726] rounded-t-md relative" />
            </div>

            {/* 3D Roadway with vanishing point perspective */}
            <div
              className="absolute bottom-0 w-full h-[45%] bg-[#080d14] border-t-2 border-white/20 overflow-hidden flex justify-center"
              style={{
                perspective: '400px',
              }}
            >
              <div
                className="w-[140%] h-full bg-[#0d121c] border-x-4 border-amber-400/30 flex justify-center"
                style={{
                  transform: 'rotateX(65deg)',
                  transformOrigin: 'bottom center',
                }}
              >
                {/* Dashed Center Road Divider */}
                <div className="w-2 h-full border-r-2 border-dashed border-white/70" />
              </div>
            </div>

            {/* Passing 3D Vehicles on the road */}
            <div
              className="absolute bottom-[10%] flex items-center gap-12 transition-transform duration-300"
              style={{ transform: `translateX(${streetViewPan}px)` }}
            >
              {/* Sedan */}
              <div className="relative w-44 h-44 flex flex-col items-center">
                <img
                  src={VEHICLE_3D_ASSETS.car}
                  alt="3D Car"
                  className="w-full h-full object-contain filter drop-shadow-[0_12px_24px_rgba(0,0,0,0.95)]"
                />
                <span className="text-[10px] font-JakartaBold text-blue-400 bg-black/80 px-2 py-0.5 rounded-full -mt-4 border border-blue-500/30">
                  Broader Comfort
                </span>
              </div>

              {/* Keke */}
              <div className="relative w-36 h-36 flex flex-col items-center">
                <img
                  src={VEHICLE_3D_ASSETS.tricycle}
                  alt="3D Tricycle"
                  className="w-full h-full object-contain filter drop-shadow-[0_12px_24px_rgba(0,0,0,0.95)]"
                />
                <span className="text-[10px] font-JakartaBold text-emerald-400 bg-black/80 px-2 py-0.5 rounded-full -mt-3 border border-emerald-500/30">
                  Keke Napep
                </span>
              </div>

              {/* Express Okada */}
              <div className="relative w-32 h-32 flex flex-col items-center">
                <img
                  src={VEHICLE_3D_ASSETS.motorcycle}
                  alt="3D Bike"
                  className="w-full h-full object-contain filter drop-shadow-[0_12px_24px_rgba(0,0,0,0.95)]"
                />
                <span className="text-[10px] font-JakartaBold text-amber-400 bg-black/80 px-2 py-0.5 rounded-full -mt-2 border border-amber-500/30">
                  Express Bike
                </span>
              </div>
            </div>
          </div>

          {/* Street View Bottom Pan Navigation Controls */}
          <div className="p-3 bg-black/90 backdrop-blur-2xl border-t border-white/10 flex items-center justify-between z-20">
            <button
              onClick={() => setStreetViewPan((p) => Math.min(p + 60, 160))}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-JakartaBold text-white flex items-center gap-1.5"
            >
              ← Pan Left
            </button>
            <span className="text-[11px] font-JakartaMedium text-neutral-400">
              Drag or use pan arrows to look 360°
            </span>
            <button
              onClick={() => setStreetViewPan((p) => Math.max(p - 60, -160))}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-JakartaBold text-white flex items-center gap-1.5"
            >
              Pan Right →
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
