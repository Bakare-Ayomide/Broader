import { useState, useEffect, useMemo } from 'react';
import {
  DEFAULT_LAGOS_ROUTE_WAYPOINTS,
  calculateBearing,
  RideTelemetryState,
} from './rideSimulationEngine';

export interface UseRideSimulationOptions {
  active?: boolean;
  initialSpeed?: number;
  waypoints?: typeof DEFAULT_LAGOS_ROUTE_WAYPOINTS;
  totalDistanceKm?: number;
  initialEtaMinutes?: number;
}

const SPEED_HISTORY = [42, 47, 51, 56, 61, 58, 64, 70, 66, 62, 59, 68, 72, 65, 54, 48];

export function useRideSimulation({
  active = true,
  initialSpeed = 54,
  waypoints = DEFAULT_LAGOS_ROUTE_WAYPOINTS,
  totalDistanceKm = 8.4,
  initialEtaMinutes = 12,
}: UseRideSimulationOptions = {}) {
  // Current waypoint segment index & progress fraction (0 to 1) along segment
  const [simState, setSimState] = useState({
    segmentIndex: 0,
    segmentT: 0,
    speedCycleIdx: 2,
  });

  // Smooth periodic position update without recursive RAF state cascading
  useEffect(() => {
    if (!active) return;

    const interval = setInterval(() => {
      setSimState((prev) => {
        const advanceSpeed = 0.012; // advancement step every 150ms
        let nextT = prev.segmentT + advanceSpeed;
        let nextIdx = prev.segmentIndex;
        let nextSpeedCycle = prev.speedCycleIdx;

        if (nextT >= 1) {
          nextT = 0;
          nextIdx = (prev.segmentIndex + 1) % (waypoints.length - 1);
          nextSpeedCycle = (prev.speedCycleIdx + 1) % SPEED_HISTORY.length;
        }

        return {
          segmentIndex: nextIdx,
          segmentT: nextT,
          speedCycleIdx: nextSpeedCycle,
        };
      });
    }, 150);

    return () => clearInterval(interval);
  }, [active, waypoints.length]);

  // Derived telemetry state via useMemo (NO setState in useEffect!)
  const telemetry = useMemo<RideTelemetryState>(() => {
    const wpList = waypoints && waypoints.length > 0 ? waypoints : DEFAULT_LAGOS_ROUTE_WAYPOINTS;
    const currentWp = wpList[simState.segmentIndex] || wpList[0];
    const nextWp = wpList[simState.segmentIndex + 1] || wpList[wpList.length - 1];

    // Linear interpolation of lat/lon
    const lat = currentWp.latitude + (nextWp.latitude - currentWp.latitude) * simState.segmentT;
    const lon = currentWp.longitude + (nextWp.longitude - currentWp.longitude) * simState.segmentT;
    const heading = calculateBearing(lat, lon, nextWp.latitude, nextWp.longitude);

    // Calculate overall route progress
    const totalSegments = Math.max(1, wpList.length - 1);
    const overallProgress = Math.min(100, Math.round(((simState.segmentIndex + simState.segmentT) / totalSegments) * 100));

    // Distance remaining and ETA calculation
    const distRemaining = Math.max(0.1, Number((totalDistanceKm * (1 - overallProgress / 100)).toFixed(1)));
    const eta = Math.max(1, Math.round(initialEtaMinutes * (1 - overallProgress / 100)));

    // Dynamic speed based on state
    const baseTargetSpeed = SPEED_HISTORY[simState.speedCycleIdx] || initialSpeed;
    const dynamicSpeed = active ? Math.round(baseTargetSpeed + Math.sin(simState.segmentT * Math.PI) * 4) : 0;

    return {
      speed: dynamicSpeed,
      speedLimit: currentWp.speedLimit,
      latitude: lat,
      longitude: lon,
      heading: heading,
      distanceRemainingKm: distRemaining,
      etaMinutes: eta,
      routeProgressPercent: overallProgress,
      currentInstruction: currentWp.instruction,
      nextInstruction: nextWp.instruction,
      streetName: currentWp.streetName,
      fuelLevel: 0.78,
      isDriving: active,
    };
  }, [
    simState.segmentIndex,
    simState.segmentT,
    simState.speedCycleIdx,
    active,
    initialSpeed,
    totalDistanceKm,
    initialEtaMinutes,
    waypoints,
  ]);

  return telemetry;
}
