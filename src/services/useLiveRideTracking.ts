import { useState, useEffect, useRef } from 'react';
import { calculateBearing } from '../components/simulation/rideSimulationEngine';
import { LAGOS_COORDS } from '../data/mockData';

export interface LiveRideTelemetry {
  latitude: number;
  longitude: number;
  heading: number;
  speed: number; // in km/h
  isStopped: boolean;
  elapsedSeconds: number;
  remainingMinutes: number;
  distanceTravelledKm: number;
  distanceRemainingKm: number;
  totalDistanceKm: number;
  streetName: string;
  turnInstruction: string;
  isRealGps: boolean;
  routeProgressPercent: number;
}

// Realistic Lagos route waypoints for smooth navigation fallback
const LAGOS_LIVE_WAYPOINTS = [
  { lat: 6.4281, lng: 3.4219, street: 'Ahmadu Bello Way', instruction: 'Head north on Ahmadu Bello Way', limit: 50 },
  { lat: 6.4350, lng: 3.4290, street: 'Ozumba Mbadiwe Ave', instruction: 'Turn right onto Ozumba Mbadiwe Ave', limit: 60 },
  { lat: 6.4420, lng: 3.4410, street: 'Lekki Toll Gate', instruction: 'Continue through Lekki Toll Plaza', limit: 70 },
  { lat: 6.4474, lng: 3.4723, street: 'Admiralty Way, Lekki Phase 1', instruction: 'Take the ramp towards Ikoyi Link Bridge', limit: 60 },
  { lat: 6.4550, lng: 3.4600, street: 'Ikoyi Link Bridge', instruction: 'Merge onto Ikoyi-Lekki Cable Bridge', limit: 80 },
  { lat: 6.4700, lng: 3.4400, street: 'Bourbillion Road, Ikoyi', instruction: 'Continue straight onto Alfred Rewane Rd', limit: 60 },
  { lat: 6.4850, lng: 3.4150, street: 'Osborne Foreshore Rd', instruction: 'Keep left towards Third Mainland Bridge', limit: 70 },
  { lat: 6.5100, lng: 3.3950, street: 'Third Mainland Bridge', instruction: 'Follow Third Mainland Bridge for 8 km', limit: 90 },
  { lat: 6.5400, lng: 3.3750, street: 'Adekunle Interchange', instruction: 'Stay on express lane towards Oworonshoki', limit: 90 },
  { lat: 6.5650, lng: 3.3550, street: 'Ikorodu Road Connector', instruction: 'Take exit towards Anthony / Oshodi', limit: 70 },
  { lat: 6.5774, lng: 3.3212, street: 'Airport Road, Ikeja', instruction: 'Arrive at Murtala Muhammed Int Airport', limit: 50 },
];

export function useLiveRideTracking(isActive: boolean = false, totalTripDistanceKm: number = 18.5) {
  const [telemetry, setTelemetry] = useState<LiveRideTelemetry>({
    latitude: LAGOS_LIVE_WAYPOINTS[0].lat,
    longitude: LAGOS_LIVE_WAYPOINTS[0].lng,
    heading: 32,
    speed: 0,
    isStopped: true,
    elapsedSeconds: 0,
    remainingMinutes: 26,
    distanceTravelledKm: 0.0,
    distanceRemainingKm: totalTripDistanceKm,
    totalDistanceKm: totalTripDistanceKm,
    streetName: LAGOS_LIVE_WAYPOINTS[0].street,
    turnInstruction: LAGOS_LIVE_WAYPOINTS[0].instruction,
    isRealGps: false,
    routeProgressPercent: 0,
  });

  const progressRef = useRef(0); // 0 to 1
  const elapsedRef = useRef(0);
  const realGpsWatchId = useRef<number | null>(null);
  const lastRealCoord = useRef<{ lat: number; lng: number; time: number } | null>(null);

  // 1. Listen for Real Device GPS when available
  useEffect(() => {
    if (!isActive) return;

    if ('geolocation' in navigator) {
      try {
        realGpsWatchId.current = navigator.geolocation.watchPosition(
          (position) => {
            const { latitude, longitude, speed: rawSpeed, heading: rawHeading } = position.coords;
            const now = Date.now();

            let computedSpeed = rawSpeed !== null && !isNaN(rawSpeed) ? Math.round(rawSpeed * 3.6) : null;
            let computedHeading = rawHeading !== null && !isNaN(rawHeading) ? Math.round(rawHeading) : null;

            if (lastRealCoord.current) {
              const dt = (now - lastRealCoord.current.time) / 1000;
              if (dt > 1) {
                if (computedHeading === null) {
                  computedHeading = calculateBearing(
                    lastRealCoord.current.lat,
                    lastRealCoord.current.lng,
                    latitude,
                    longitude
                  );
                }
                if (computedSpeed === null) {
                  // Approximate distance in km
                  const dLat = (latitude - lastRealCoord.current.lat) * 111;
                  const dLng = (longitude - lastRealCoord.current.lng) * 111 * Math.cos((latitude * Math.PI) / 180);
                  const distKm = Math.sqrt(dLat * dLat + dLng * dLng);
                  computedSpeed = Math.round((distKm / (dt / 3600)));
                }
              }
            }

            lastRealCoord.current = { lat: latitude, lng: longitude, time: now };

            const finalSpeed = Math.max(0, computedSpeed ?? 45);
            const isStopped = finalSpeed < 3;

            setTelemetry((prev) => ({
              ...prev,
              latitude,
              longitude,
              heading: computedHeading ?? prev.heading,
              speed: finalSpeed,
              isStopped,
              isRealGps: true,
            }));
          },
          (err) => {
            // Permission denied or unavailable, fallback cleanly to smooth simulated stream
            console.debug('Real GPS stream note (fallback active):', err.message);
          },
          { enableHighAccuracy: true, maximumAge: 2000, timeout: 5000 }
        );
      } catch (e) {
        // Geolocation call failed
      }
    }

    return () => {
      if (realGpsWatchId.current !== null) {
        navigator.geolocation.clearWatch(realGpsWatchId.current);
        realGpsWatchId.current = null;
      }
    };
  }, [isActive]);

  // 2. High-precision continuous progression & timer loop
  useEffect(() => {
    if (!isActive) {
      progressRef.current = 0;
      elapsedRef.current = 0;
      return;
    }

    const interval = setInterval(() => {
      elapsedRef.current += 1;
      const elapsed = elapsedRef.current;

      // Increment progress smoothly along waypoints
      progressRef.current = Math.min(1, progressRef.current + 0.0035);
      const progress = progressRef.current;

      // Find current waypoint segment
      const numSegments = LAGOS_LIVE_WAYPOINTS.length - 1;
      const segmentFloat = progress * numSegments;
      const segIndex = Math.min(numSegments - 1, Math.floor(segmentFloat));
      const segT = segmentFloat - segIndex;

      const p1 = LAGOS_LIVE_WAYPOINTS[segIndex];
      const p2 = LAGOS_LIVE_WAYPOINTS[segIndex + 1] || p1;

      // Linear interpolated coordinates
      const simLat = p1.lat + (p2.lat - p1.lat) * segT;
      const simLng = p1.lng + (p2.lng - p1.lng) * segT;
      const simHeading = calculateBearing(p1.lat, p1.lng, p2.lat, p2.lng);

      // Speed profile with traffic fluctuations (simulate realistic Lagos highway & street dynamics)
      const baseSpeed = p1.limit || 60;
      const speedOscillation = Math.sin(elapsed * 0.4) * 8 + Math.cos(elapsed * 0.8) * 4;
      const targetSpeed = Math.max(0, Math.round(baseSpeed + speedOscillation));
      const isStopped = targetSpeed < 4;

      const distTravelled = Number((totalTripDistanceKm * progress).toFixed(1));
      const distRemaining = Math.max(0.1, Number((totalTripDistanceKm * (1 - progress)).toFixed(1)));
      const etaMinutes = Math.max(1, Math.round(distRemaining * 1.5));

      setTelemetry((prev) => {
        // If real GPS is actively feeding real coordinates, preserve real lat/lng while syncing trip calculations
        const lat = prev.isRealGps ? prev.latitude : simLat;
        const lng = prev.isRealGps ? prev.longitude : simLng;
        const heading = prev.isRealGps ? prev.heading : simHeading;
        const speed = prev.isRealGps ? prev.speed : targetSpeed;

        return {
          ...prev,
          latitude: lat,
          longitude: lng,
          heading,
          speed,
          isStopped: speed < 4,
          elapsedSeconds: elapsed,
          remainingMinutes: etaMinutes,
          distanceTravelledKm: distTravelled,
          distanceRemainingKm: distRemaining,
          totalDistanceKm: totalTripDistanceKm,
          streetName: p1.street,
          turnInstruction: p1.instruction,
          routeProgressPercent: Math.round(progress * 100),
        };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, totalTripDistanceKm]);

  return telemetry;
}
