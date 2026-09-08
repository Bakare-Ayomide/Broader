/**
 * Automotive Ride Telemetry Simulation Engine
 * Simulates realistic vehicle physics, GPS coordinates interpolation,
 * heading changes, speed fluctuations, and turn-by-turn guidance.
 * Ready to be swapped with real WebSockets or GPS streams.
 */

export interface TelemetryPoint {
  latitude: number;
  longitude: number;
  streetName: string;
  instruction: string;
  speedLimit: number;
}

export interface RideTelemetryState {
  speed: number; // in km/h
  speedLimit: number;
  latitude: number;
  longitude: number;
  heading: number; // in degrees 0-360
  distanceRemainingKm: number;
  etaMinutes: number;
  routeProgressPercent: number; // 0 to 100
  currentInstruction: string;
  nextInstruction: string;
  streetName: string;
  fuelLevel: number; // 0 to 1
  isDriving: boolean;
}

// Canonical route waypoints across Lagos arterial network (Victoria Island -> Lekki)
export const DEFAULT_LAGOS_ROUTE_WAYPOINTS: TelemetryPoint[] = [
  {
    latitude: 6.4281,
    longitude: 3.4219,
    streetName: 'Ahmadu Bello Way',
    instruction: 'Head east on Ahmadu Bello Way',
    speedLimit: 60,
  },
  {
    latitude: 6.4312,
    longitude: 3.4285,
    streetName: 'Ozumba Mbadiwe Ave',
    instruction: 'Continue straight onto Ozumba Mbadiwe Ave',
    speedLimit: 80,
  },
  {
    latitude: 6.4345,
    longitude: 3.4389,
    streetName: 'Ozumba Mbadiwe Ave',
    instruction: 'Keep left on Ozumba Mbadiwe Ave towards Lekki Toll',
    speedLimit: 80,
  },
  {
    latitude: 6.4368,
    longitude: 3.4475,
    streetName: 'Lekki - Ikoyi Link Bridge Junction',
    instruction: 'Continue straight through Admiralty interchange',
    speedLimit: 70,
  },
  {
    latitude: 6.441,
    longitude: 3.461,
    streetName: 'Lekki-Epe Expressway',
    instruction: 'Merge onto Lekki-Epe Expressway',
    speedLimit: 90,
  },
  {
    latitude: 6.445,
    longitude: 3.475,
    streetName: 'Lekki Phase 1 Gate',
    instruction: 'In 300 m, prepare to take the ramp towards Admiralty Way',
    speedLimit: 70,
  },
  {
    latitude: 6.4485,
    longitude: 3.483,
    streetName: 'Admiralty Way, Lekki',
    instruction: 'Turn right onto Admiralty Way',
    speedLimit: 50,
  },
  {
    latitude: 6.452,
    longitude: 3.491,
    streetName: 'Admiralty Way, Destination',
    instruction: 'You have arrived at your destination on the right',
    speedLimit: 40,
  },
];

// Helper to calculate bearing between two coordinates
export function calculateBearing(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const toDeg = (rad: number) => (rad * 180) / Math.PI;

  const y = Math.sin(toRad(lon2 - lon1)) * Math.cos(toRad(lat2));
  const x =
    Math.cos(toRad(lat1)) * Math.sin(toRad(lat2)) -
    Math.sin(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.cos(toRad(lon2 - lon1));
  const brng = (toDeg(Math.atan2(y, x)) + 360) % 360;
  return Math.round(brng);
}

// Distance between coords in km
export function calculateHaversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}
