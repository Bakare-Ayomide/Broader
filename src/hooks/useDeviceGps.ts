import { useEffect, useRef, useCallback } from 'react';
import { useBroaderStore, getBroaderStore } from '../store/useBroaderStore';
import { reverseGeocodeNominatim } from '../services/nominatimService';
import { calculateBearing } from '../components/simulation/rideSimulationEngine';

/**
 * Real device GPS tracking hook
 * Uses navigator.geolocation to monitor physical device GPS position and update store/map pin.
 */
export function useDeviceGps(enabled: boolean = true) {
  const setUserLocation = useBroaderStore((s) => s.setUserLocation);
  const setIsGpsActive = useBroaderStore((s) => s.setIsGpsActive);
  const setGpsAccuracy = useBroaderStore((s) => s.setGpsAccuracy);
  const setHasInitialGpsFix = useBroaderStore((s) => s.setHasInitialGpsFix);

  const isFirstFixRef = useRef(true);
  const lastCoordsRef = useRef<{ lat: number; lng: number; time: number } | null>(null);
  const isGeocodingRef = useRef(false);
  const watchIdRef = useRef<number | null>(null);

  const processPosition = useCallback(
    async (position: GeolocationPosition) => {
      const { latitude, longitude, accuracy, speed: rawSpeed, heading: rawHeading } = position.coords;
      const now = Date.now();

      setIsGpsActive(true);
      setGpsAccuracy(Math.round(accuracy));

      // Calculate speed and heading
      let computedSpeed = rawSpeed !== null && !isNaN(rawSpeed) ? Math.round(rawSpeed * 3.6) : null;
      let computedHeading = rawHeading !== null && !isNaN(rawHeading) ? Math.round(rawHeading) : null;

      if (lastCoordsRef.current) {
        const dt = (now - lastCoordsRef.current.time) / 1000;
        if (dt > 1) {
          if (computedHeading === null) {
            computedHeading = calculateBearing(
              lastCoordsRef.current.lat,
              lastCoordsRef.current.lng,
              latitude,
              longitude
            );
          }
          if (computedSpeed === null) {
            const dLat = (latitude - lastCoordsRef.current.lat) * 111.32;
            const dLng =
              (longitude - lastCoordsRef.current.lng) *
              111.32 *
              Math.cos((latitude * Math.PI) / 180);
            const distKm = Math.sqrt(dLat * dLat + dLng * dLng);
            computedSpeed = Math.round((distKm / (dt / 3600)));
          }
        }
      }

      const isFirst = isFirstFixRef.current;
      isFirstFixRef.current = false;
      setHasInitialGpsFix(true);

      lastCoordsRef.current = { lat: latitude, lng: longitude, time: now };

      const currentAddr = getBroaderStore().userAddress;
      const initialPlaceholder =
        isFirst && (!currentAddr || currentAddr.includes('Admiralty Way'))
          ? `GPS Location (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`
          : currentAddr;

      setUserLocation({
        latitude,
        longitude,
        address: initialPlaceholder || `GPS Location (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`,
        heading: computedHeading,
        speed: computedSpeed,
        accuracy: Math.round(accuracy),
      });

      // Reverse-geocode to get the real-world street & neighborhood
      if (!isGeocodingRef.current) {
        isGeocodingRef.current = true;
        try {
          const resolvedAddress = await reverseGeocodeNominatim(latitude, longitude);
          if (resolvedAddress) {
            setUserLocation({
              latitude,
              longitude,
              address: resolvedAddress,
              heading: computedHeading,
              speed: computedSpeed,
              accuracy: Math.round(accuracy),
            });
          }
        } catch (e) {
          // Non-critical network fallback
        } finally {
          isGeocodingRef.current = false;
        }
      }
    },
    [setUserLocation, setIsGpsActive, setGpsAccuracy, setHasInitialGpsFix]
  );

  useEffect(() => {
    if (!enabled || typeof window === 'undefined' || !('geolocation' in navigator)) {
      setIsGpsActive(false);
      return;
    }

    const handleError = (error: GeolocationPositionError) => {
      console.warn('Real GPS acquisition notice:', error.message);
      setIsGpsActive(false);
    };

    const options: PositionOptions = {
      enableHighAccuracy: true,
      timeout: 15000,
      maximumAge: 0,
    };

    // Immediate fix request
    navigator.geolocation.getCurrentPosition(processPosition, handleError, options);

    // Continuous real-time GPS tracking stream
    try {
      watchIdRef.current = navigator.geolocation.watchPosition(
        processPosition,
        handleError,
        options
      );
    } catch (err) {
      console.warn('Could not register GPS watchPosition:', err);
    }

    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
    };
  }, [enabled, processPosition, setIsGpsActive]);
}
