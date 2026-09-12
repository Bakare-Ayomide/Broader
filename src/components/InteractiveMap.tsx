import React, { useState, useEffect, useRef, useCallback } from 'react';
import * as maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useBroaderStore } from '../store/useBroaderStore';
import { getVehicle3DImage, VEHICLE_3D_ASSETS } from '../data/vehicleAssets';
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
  MapPin,
  AlertTriangle,
} from 'lucide-react';
import { fetchOsrmRoute, OsrmRouteResult } from '../services/osrmRoutingService';
import {
  LAGOS_3D_BUILDINGS_GEOJSON,
  LAGOS_TRAFFIC_GEOJSON,
  LAGOS_POIS,
} from '../data/lagos3DBuildings';
import {
  MapLayerControlModal,
  MapLayerSettings,
  BaseMapStyle,
} from './map/MapLayerControlModal';
import { MapillaryViewerModal } from './map/MapillaryViewerModal';
import { MAPILLARY_LAGOS_FRAMES } from '../services/mapillaryService';

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
  layerSettingsProp?: MapLayerSettings;
  recenterTrigger?: number;
  onToggle3D?: () => void;
  onToggleLayers?: () => void;
  onRecenter?: () => void;
  onResetNorth?: () => void;
  interactive?: boolean;
  liveVehiclePosition?: {
    latitude: number;
    longitude: number;
    heading?: number;
    speed?: number;
    isMoving?: boolean;
  };
}

/**
 * Return MapLibre style specification or style URL for requested base map.
 * All providers are 100% free and require NO API key.
 */
function getMapLibreStyleSpec(style: BaseMapStyle): maplibregl.StyleSpecification | string {
  if (style === 'dark') {
    return 'https://tiles.openfreemap.org/styles/dark';
  }

  if (style === 'satellite') {
    return {
      version: 8,
      sources: {
        'esri-satellite': {
          type: 'raster',
          tiles: [
            'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
          ],
          tileSize: 256,
          attribution: '© Esri, Maxar, Earthstar Geographics',
        },
      },
      layers: [
        {
          id: 'esri-satellite-layer',
          type: 'raster',
          source: 'esri-satellite',
          minzoom: 0,
          maxzoom: 19,
        },
      ],
    };
  }

  // Default: Standard OSM (OpenStreetMap standard raster tiles)
  return {
    version: 8,
    sources: {
      'osm-standard': {
        type: 'raster',
        tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
        tileSize: 256,
        attribution: '',
      },
    },
    layers: [
      {
        id: 'osm-standard-layer',
        type: 'raster',
        source: 'osm-standard',
        minzoom: 0,
        maxzoom: 19,
      },
    ],
  };
}

function createVehicleMarkerElement({
  vehicleType = 'car',
  heading = 0,
  isMoving = true,
  hasHeadlights = true,
  size = 'sm',
  selected = false,
  showLabel = true,
  label = '',
  onClick,
}: {
  vehicleType?: string;
  heading?: number;
  isMoving?: boolean;
  hasHeadlights?: boolean;
  size?: 'sm' | 'md' | 'lg';
  selected?: boolean;
  showLabel?: boolean;
  label?: string;
  onClick?: (e: MouseEvent) => void;
}): HTMLElement {
  const SIZE_MAP = {
    sm: { w: '40px', h: '32px', imgW: '32px', imgH: '28px' },
    md: { w: '56px', h: '44px', imgW: '48px', imgH: '36px' },
    lg: { w: '80px', h: '64px', imgW: '72px', imgH: '56px' },
  };
  const dimensions = SIZE_MAP[size] || SIZE_MAP.sm;
  const vehicle3DImg = getVehicle3DImage(vehicleType);

  const normalizedHeading = ((heading % 360) + 360) % 360;
  const isFacingLeft = normalizedHeading > 90 && normalizedHeading < 270;
  const angleDelta = isFacingLeft
    ? 180 - normalizedHeading
    : normalizedHeading > 180
    ? normalizedHeading - 360
    : normalizedHeading;
  const roadTilt = Math.max(-15, Math.min(15, angleDelta * 0.3));

  const container = document.createElement('div');
  container.className = 'cursor-pointer select-none group/vehicle';
  if (onClick) {
    container.addEventListener('click', onClick);
  }

  const flipX = isFacingLeft ? -1 : 1;

  container.innerHTML = `
    <div class="relative flex flex-col items-center justify-center">
      <div class="relative flex items-center justify-center" style="width: ${dimensions.w}; height: ${dimensions.h};">
        <div class="absolute -bottom-1 w-4/5 h-2.5 bg-black/85 rounded-full blur-[2px] pointer-events-none"></div>

        ${selected ? '<div class="absolute -inset-1 rounded-full bg-[#9EE6B5]/35 blur-md animate-pulse pointer-events-none"></div>' : ''}

        ${
          hasHeadlights
            ? `<div class="absolute pointer-events-none ${
                isFacingLeft ? '-left-6' : '-right-6'
              } top-1/2 -translate-y-1/2 w-8 h-6"
                 style="background: radial-gradient(ellipse at ${
                   isFacingLeft ? 'right' : 'left'
                 }, rgba(254, 240, 138, 0.45) 0%, rgba(158, 230, 181, 0.2) 40%, transparent 80%);">
              </div>`
            : ''
        }

        <img src="${vehicle3DImg}" alt="${vehicleType}"
             class="object-contain filter drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)] relative z-10"
             style="width: ${dimensions.imgW}; height: ${dimensions.imgH}; transform: scaleX(${flipX}) rotate(${roadTilt}deg); transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);" />

        ${
          isMoving
            ? `<div class="absolute -bottom-1.5 flex gap-1 pointer-events-none">
                <span class="w-1 h-1 rounded-full bg-[#9EE6B5] animate-ping"></span>
              </div>`
            : ''
        }
      </div>

      ${
        showLabel && label
          ? `<div class="mt-1 px-2 py-0.5 rounded-full bg-black/85 backdrop-blur-md border border-white/15 text-[9px] font-bold text-white shadow-lg whitespace-nowrap z-20">
              ${label}
            </div>`
          : ''
      }
    </div>
  `;

  return container;
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
  layerSettingsProp,
  recenterTrigger,
  onToggle3D,
  onToggleLayers,
  onRecenter,
  onResetNorth,
  interactive = true,
  liveVehiclePosition,
}) => {
  const userLatitude = useBroaderStore((s) => s.userLatitude) || 6.4281;
  const userLongitude = useBroaderStore((s) => s.userLongitude) || 3.4219;
  const destinationLatitude = useBroaderStore((s) => s.destinationLatitude);
  const destinationLongitude = useBroaderStore((s) => s.destinationLongitude);
  const destinationAddress = useBroaderStore((s) => s.destinationAddress);
  const userAddress = useBroaderStore((s) => s.userAddress);
  const drivers = useBroaderStore((s) => s.drivers);
  const selectedDriver = useBroaderStore((s) => s.selectedDriver);
  const setSelectedDriver = useBroaderStore((s) => s.setSelectedDriver);
  const rideStatus = useBroaderStore((s) => s.rideStatus);
  const activeTrip = useBroaderStore((s) => s.activeTrip);
  const setDestinationLocation = useBroaderStore((s) => s.setDestinationLocation);

  // Maplibre ref & DOM container
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<maplibregl.Marker[]>([]);

  // State
  const [isFullPreview, setIsFullPreview] = useState(initialFullPreview);
  const [is3DTilt, setIs3DTilt] = useState(is3DTiltProp !== undefined ? is3DTiltProp : true);
  const [bearing, setBearing] = useState(18);
  const [inspectedDriver, setInspectedDriver] = useState<any | null>(null);
  const [isLayerModalOpen, setIsLayerModalOpen] = useState(false);
  const [isStreetViewerOpen, setIsStreetViewerOpen] = useState(false);
  const [webGlSupported, setWebGlSupported] = useState(true);
  const [isMapOptionsExpanded, setIsMapOptionsExpanded] = useState(false);

  // Layer settings (prefer external prop if supplied)
  const [internalLayerSettings, setInternalLayerSettings] = useState<MapLayerSettings>({
    baseStyle: 'standard',
    showBuildings: true,
    showRoute: showRoute,
    showTraffic: true,
    showPois: true,
    showStreetImagery: true,
  });

  const layerSettings = layerSettingsProp || internalLayerSettings;

  // Sync external 3D tilt prop
  useEffect(() => {
    if (is3DTiltProp !== undefined) {
      setIs3DTilt(is3DTiltProp);
    }
  }, [is3DTiltProp]);

  // OSRM calculated route state
  const [osrmRoute, setOsrmRoute] = useState<OsrmRouteResult | null>(null);

  // Destination fallback coord if not selected
  const targetDestLat = destinationLatitude || 6.4474;
  const targetDestLng = destinationLongitude || 3.4735;

  // Real-time trip status check
  const isTracking =
    activeTrip !== null &&
    ['driver_assigned', 'driver_arriving', 'driver_arrived', 'ride_started', 'ride_completed'].includes(
      rideStatus
    );
  const isRadarSearching = isSearching || rideStatus === 'searching';

  // Fetch fastest driving route via OSRM when origin or destination changes
  useEffect(() => {
    let isCancelled = false;
    async function loadRoute() {
      const origin = { lat: userLatitude, lng: userLongitude };
      const dest = { lat: targetDestLat, lng: targetDestLng };
      const result = await fetchOsrmRoute(origin, dest);
      if (!isCancelled) {
        setOsrmRoute(result);
      }
    }

    if (showRoute) {
      loadRoute();
    }

    return () => {
      isCancelled = true;
    };
  }, [userLatitude, userLongitude, targetDestLat, targetDestLng, showRoute]);

  // Clean up markers
  const clearMarkers = useCallback(() => {
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];
  }, []);

  // Update/render layers inside MapLibre GL map
  const updateMapLayers = useCallback(
    (map: maplibregl.Map) => {
      // 1. 3D Buildings Extrusion Layer
      if (!map.getSource('lagos-3d-buildings')) {
        map.addSource('lagos-3d-buildings', {
          type: 'geojson',
          data: LAGOS_3D_BUILDINGS_GEOJSON,
        });
      }
      if (!map.getLayer('lagos-3d-buildings-layer')) {
        map.addLayer({
          id: 'lagos-3d-buildings-layer',
          type: 'fill-extrusion',
          source: 'lagos-3d-buildings',
          layout: {
            visibility: layerSettings.showBuildings ? 'visible' : 'none',
          },
          paint: {
            'fill-extrusion-color': ['get', 'color'],
            'fill-extrusion-height': ['get', 'height'],
            'fill-extrusion-base': ['get', 'base_height'],
            'fill-extrusion-opacity': 0.88,
          },
        });
      } else {
        map.setLayoutProperty(
          'lagos-3d-buildings-layer',
          'visibility',
          layerSettings.showBuildings ? 'visible' : 'none'
        );
      }

      // 2. Traffic Flow Layer
      if (!map.getSource('lagos-traffic')) {
        map.addSource('lagos-traffic', {
          type: 'geojson',
          data: LAGOS_TRAFFIC_GEOJSON,
        });
      }
      if (!map.getLayer('lagos-traffic-layer')) {
        map.addLayer({
          id: 'lagos-traffic-layer',
          type: 'line',
          source: 'lagos-traffic',
          layout: {
            visibility: layerSettings.showTraffic ? 'visible' : 'none',
            'line-join': 'round',
            'line-cap': 'round',
          },
          paint: {
            'line-color': ['get', 'color'],
            'line-width': 5,
            'line-opacity': 0.85,
          },
        });
      } else {
        map.setLayoutProperty(
          'lagos-traffic-layer',
          'visibility',
          layerSettings.showTraffic ? 'visible' : 'none'
        );
      }

      // 3. Mapillary Street Coverage Line
      const mapillaryGeoJson: GeoJSON.FeatureCollection = {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            properties: { name: 'Mapillary Street View Track' },
            geometry: {
              type: 'LineString',
              coordinates: MAPILLARY_LAGOS_FRAMES.map((f) => [f.lng, f.lat]),
            },
          },
        ],
      };

      if (!map.getSource('mapillary-tracks')) {
        map.addSource('mapillary-tracks', {
          type: 'geojson',
          data: mapillaryGeoJson,
        });
      }
      if (!map.getLayer('mapillary-tracks-layer')) {
        map.addLayer({
          id: 'mapillary-tracks-layer',
          type: 'line',
          source: 'mapillary-tracks',
          layout: {
            visibility: layerSettings.showStreetImagery ? 'visible' : 'none',
            'line-join': 'round',
            'line-cap': 'round',
          },
          paint: {
            'line-color': '#10B981',
            'line-width': 3.5,
            'line-dasharray': [2, 1.5],
            'line-opacity': 0.9,
          },
        });
      } else {
        map.setLayoutProperty(
          'mapillary-tracks-layer',
          'visibility',
          layerSettings.showStreetImagery ? 'visible' : 'none'
        );
      }

      // 4. OSRM Fastest Route Line
      if (osrmRoute && osrmRoute.coordinates && osrmRoute.coordinates.length > 0) {
        const routeGeoJson: GeoJSON.Feature<GeoJSON.LineString> = {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: osrmRoute.coordinates,
          },
        };

        if (map.getSource('osrm-route')) {
          (map.getSource('osrm-route') as maplibregl.GeoJSONSource).setData(routeGeoJson);
        } else {
          map.addSource('osrm-route', {
            type: 'geojson',
            data: routeGeoJson,
          });
        }

        // Glow Layer
        if (!map.getLayer('osrm-route-glow')) {
          map.addLayer({
            id: 'osrm-route-glow',
            type: 'line',
            source: 'osrm-route',
            layout: {
              visibility: layerSettings.showRoute ? 'visible' : 'none',
              'line-join': 'round',
              'line-cap': 'round',
            },
            paint: {
              'line-color': '#00E5FF',
              'line-width': 9,
              'line-blur': 4,
              'line-opacity': 0.45,
            },
          });
        } else {
          map.setLayoutProperty(
            'osrm-route-glow',
            'visibility',
            layerSettings.showRoute ? 'visible' : 'none'
          );
        }

        // Core Line
        if (!map.getLayer('osrm-route-core')) {
          map.addLayer({
            id: 'osrm-route-core',
            type: 'line',
            source: 'osrm-route',
            layout: {
              visibility: layerSettings.showRoute ? 'visible' : 'none',
              'line-join': 'round',
              'line-cap': 'round',
            },
            paint: {
              'line-color': '#9EE6B5',
              'line-width': 4,
              'line-opacity': 0.95,
            },
          });
        } else {
          map.setLayoutProperty(
            'osrm-route-core',
            'visibility',
            layerSettings.showRoute ? 'visible' : 'none'
          );
        }

        // Dashed Center
        if (!map.getLayer('osrm-route-dash')) {
          map.addLayer({
            id: 'osrm-route-dash',
            type: 'line',
            source: 'osrm-route',
            layout: {
              visibility: layerSettings.showRoute ? 'visible' : 'none',
              'line-join': 'round',
              'line-cap': 'round',
            },
            paint: {
              'line-color': '#FFFFFF',
              'line-width': 1.6,
              'line-dasharray': [2, 2],
            },
          });
        } else {
          map.setLayoutProperty(
            'osrm-route-dash',
            'visibility',
            layerSettings.showRoute ? 'visible' : 'none'
          );
        }
      }
    },
    [layerSettings, osrmRoute]
  );

  // Initialize MapLibre GL Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    try {
      const map = new maplibregl.Map({
        container: mapContainerRef.current,
        style: getMapLibreStyleSpec(layerSettings.baseStyle),
        center: [userLongitude, userLatitude],
        zoom: 14.2,
        pitch: is3DTilt ? 48 : 0,
        bearing: bearing,
        interactive: interactive,
        attributionControl: false,
      });

      mapInstanceRef.current = map;

      map.on('load', () => {
        updateMapLayers(map);
      });

      // Graceful fallback if vector dark style cannot be fetched (e.g. offline/network firewall)
      map.on('error', (e) => {
        const errorMsg = e?.error?.message || '';
        if (typeof errorMsg === 'string' && (errorMsg.includes('openfreemap') || errorMsg.includes('styles/dark'))) {
          console.warn('OpenFreeMap style fetch issue, activating Esri Dark Gray raster fallback:', errorMsg);
          try {
            map.setStyle({
              version: 8,
              sources: {
                'esri-dark-fallback': {
                  type: 'raster',
                  tiles: [
                    'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}',
                  ],
                  tileSize: 256,
                  attribution: '',
                },
              },
              layers: [
                {
                  id: 'esri-dark-fallback-layer',
                  type: 'raster',
                  source: 'esri-dark-fallback',
                  minzoom: 0,
                  maxzoom: 16,
                },
              ],
            });
            map.once('style.load', () => {
              updateMapLayers(map);
            });
          } catch (fallbackErr) {
            console.warn('Fallback style failed:', fallbackErr);
          }
        }
      });

      map.on('rotate', () => {
        setBearing(Math.round(map.getBearing()));
      });

      return () => {
        clearMarkers();
        // Defer map removal to ensure React finishes synchronous rendering phase
        setTimeout(() => {
          try {
            map.remove();
          } catch (e) {
            // ignore cleanup errors
          }
        }, 0);
        mapInstanceRef.current = null;
      };
    } catch (err) {
      console.warn('MapLibre WebGL init failed, using fallback:', err);
      setWebGlSupported(false);
    }
  }, [interactive]);

  // Handle Base Style updates dynamically without recreating the Map instance
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    try {
      map.setStyle(getMapLibreStyleSpec(layerSettings.baseStyle));
      map.once('style.load', () => {
        updateMapLayers(map);
      });
    } catch (err) {
      console.warn('Failed to switch map style:', err);
    }
  }, [layerSettings.baseStyle, updateMapLayers]);

  // Handle Recenter trigger from floating GPS button
  useEffect(() => {
    if (recenterTrigger === undefined || recenterTrigger === 0) return;
    const map = mapInstanceRef.current;
    if (!map) return;

    map.flyTo({
      center: [userLongitude, userLatitude],
      zoom: 14.5,
      pitch: is3DTilt ? 48 : 0,
      duration: 700,
    });
  }, [recenterTrigger, userLongitude, userLatitude, is3DTilt]);

  // Sync 3D tilt pitch and bearing changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    map.easeTo({
      pitch: is3DTilt ? 48 : 0,
      bearing: bearing,
      duration: 500,
    });
  }, [is3DTilt, bearing]);

  // Update map layers when settings or route change
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (map && map.isStyleLoaded()) {
      updateMapLayers(map);
    }
  }, [layerSettings, osrmRoute, updateMapLayers]);

  // Render HTML Markers (User origin, Destination, 3D Vehicles, and POIs)
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    clearMarkers();

    // 1. User Origin Marker (Mint Green Glowing Beacon)
    const originEl = document.createElement('div');
    originEl.className = 'cursor-pointer select-none';
    originEl.innerHTML = `
      <div class="relative flex items-center justify-center -translate-x-1/2 -translate-y-1/2">
        <div class="w-8 h-8 rounded-full bg-[#9EE6B5]/25 animate-ping absolute"></div>
        <div class="w-5 h-5 rounded-full bg-[#9EE6B5] border-2 border-white shadow-[0_0_12px_#9EE6B5] flex items-center justify-center">
          <div class="w-1.5 h-1.5 rounded-full bg-black"></div>
        </div>
        <div class="absolute -top-7 bg-[#0c1420]/90 backdrop-blur-md px-2 py-0.5 rounded-lg border border-white/15 text-[10px] font-bold text-white whitespace-nowrap shadow-xl">
          ${isTracking ? 'Pickup Point' : 'Your Location'}
        </div>
      </div>
    `;
    const originMarker = new maplibregl.Marker({ element: originEl })
      .setLngLat([userLongitude, userLatitude])
      .addTo(map);
    markersRef.current.push(originMarker);

    // 2. Destination Marker (Red Glowing Pin)
    if (layerSettings.showRoute || destinationLatitude) {
      const destEl = document.createElement('div');
      destEl.className = 'cursor-pointer select-none';
      destEl.innerHTML = `
        <div class="relative flex items-center justify-center -translate-x-1/2 -translate-y-1/2">
          <div class="w-7 h-7 rounded-full bg-red-500/25 animate-pulse absolute"></div>
          <div class="w-5 h-5 rounded-full bg-red-500 border-2 border-white shadow-[0_0_12px_rgba(239,68,68,0.8)] flex items-center justify-center">
            <div class="w-1.5 h-1.5 rounded-full bg-white"></div>
          </div>
          <div class="absolute -top-7 bg-[#0c1420]/90 backdrop-blur-md px-2 py-0.5 rounded-lg border border-red-500/40 text-[10px] font-bold text-white whitespace-nowrap shadow-xl">
            ${destinationAddress ? destinationAddress.slice(0, 16) + '...' : 'Destination'}
          </div>
        </div>
      `;
      const destMarker = new maplibregl.Marker({ element: destEl })
        .setLngLat([targetDestLng, targetDestLat])
        .addTo(map);
      markersRef.current.push(destMarker);
    }

    // 3. Render Nearby 3D Vehicles as MapLibre Markers
    if (!isTracking) {
      // Dynamic GPS offsets around user for real map locations
      const vehicleCoords = [
        { lng: userLongitude + 0.0035, lat: userLatitude + 0.0025, heading: 45, type: 'car' },
        { lng: userLongitude - 0.0042, lat: userLatitude + 0.0015, heading: 120, type: 'suv' },
        { lng: userLongitude + 0.0021, lat: userLatitude - 0.0032, heading: 260, type: 'motorcycle' },
        { lng: userLongitude - 0.0030, lat: userLatitude - 0.0028, heading: 85, type: 'tricycle' },
      ];

      drivers.forEach((driver, idx) => {
        const coord = vehicleCoords[idx % vehicleCoords.length];
        const isSelected = selectedDriver === driver.id;

        const vehicleEl = createVehicleMarkerElement({
          vehicleType: driver.vehicle_type || coord.type || 'car',
          heading: coord.heading,
          isMoving: true,
          hasHeadlights: true,
          size: 'sm',
          selected: isSelected,
          showLabel: true,
          label: `${driver.time || 3}m • ₦${driver.price || '2,800'}`,
          onClick: (e) => {
            e.stopPropagation();
            setSelectedDriver(driver.id);
            setInspectedDriver(driver);
          },
        });

        const marker = new maplibregl.Marker({ element: vehicleEl })
          .setLngLat([coord.lng, coord.lat])
          .addTo(map);
        markersRef.current.push(marker);
      });
    }

    // 4. Assigned Driver Marker (Tracking Mode on Route)
    if (isTracking && activeTrip) {
      // Use live vehicle position if provided, else smooth midpoint on route
      const activeCarLng = liveVehiclePosition
        ? liveVehiclePosition.longitude
        : (userLongitude + targetDestLng) / 2;
      const activeCarLat = liveVehiclePosition
        ? liveVehiclePosition.latitude
        : (userLatitude + targetDestLat) / 2;
      const heading = liveVehiclePosition?.heading ?? 35;
      const isMoving = liveVehiclePosition?.isMoving ?? (liveVehiclePosition?.speed !== undefined ? liveVehiclePosition.speed > 3 : true);

      const activeCarEl = createVehicleMarkerElement({
        vehicleType: activeTrip.vehicle?.category || 'car',
        heading: heading,
        isMoving: isMoving,
        hasHeadlights: true,
        size: 'md',
        selected: true,
        showLabel: true,
        label: `${activeTrip.driver.first_name} • ${activeTrip.driver.plate_number || 'EKY-428-AB'}`,
      });

      const marker = new maplibregl.Marker({ element: activeCarEl })
        .setLngLat([activeCarLng, activeCarLat])
        .addTo(map);
      markersRef.current.push(marker);
    }

    // 5. POIs & Landmarks Markers (when POI layer enabled)
    if (layerSettings.showPois) {
      LAGOS_POIS.forEach((poi) => {
        const poiEl = document.createElement('div');
        poiEl.className = 'cursor-pointer group/poi select-none';
        poiEl.innerHTML = `
          <div class="relative flex items-center justify-center -translate-x-1/2 -translate-y-1/2">
            <div class="w-3 h-3 rounded-full bg-[${poi.color}] border border-white shadow-lg"></div>
            <div class="absolute -top-7 bg-[#080d14]/90 backdrop-blur-md px-2 py-0.5 rounded-lg border border-white/15 text-[9px] font-JakartaBold text-neutral-200 whitespace-nowrap shadow-xl flex items-center gap-1 group-hover/poi:border-[#9EE6B5]">
              <span class="w-1.5 h-1.5 rounded-full bg-[${poi.color}]"></span>
              <span>${poi.name}</span>
            </div>
          </div>
        `;

        poiEl.onclick = () => {
          if (onSelectLandmark) {
            onSelectLandmark(poi.name, poi.lat, poi.lng);
          } else {
            setDestinationLocation({
              latitude: poi.lat,
              longitude: poi.lng,
              address: poi.name,
            });
          }
        };

        const marker = new maplibregl.Marker({ element: poiEl })
          .setLngLat([poi.lng, poi.lat])
          .addTo(map);
        markersRef.current.push(marker);
      });
    }
  }, [
    userLongitude,
    userLatitude,
    targetDestLng,
    targetDestLat,
    destinationAddress,
    drivers,
    selectedDriver,
    isTracking,
    activeTrip,
    liveVehiclePosition,
    layerSettings.showRoute,
    layerSettings.showPois,
    onSelectLandmark,
    setDestinationLocation,
    clearMarkers,
  ]);

  // Recenter GPS
  const handleRecenter = () => {
    if (onRecenter) {
      onRecenter();
      return;
    }
    const map = mapInstanceRef.current;
    if (map) {
      map.flyTo({
        center: [userLongitude, userLatitude],
        zoom: 14.8,
        pitch: is3DTilt ? 48 : 0,
        bearing: bearing,
        duration: 900,
      });
    }
  };

  // Reset North
  const handleResetNorth = () => {
    if (onResetNorth) {
      onResetNorth();
      return;
    }
    setBearing(0);
    const map = mapInstanceRef.current;
    if (map) {
      map.rotateTo(0, { duration: 600 });
    }
  };

  // Toggle 3D Tilt
  const handleToggle3D = () => {
    if (onToggle3D) {
      onToggle3D();
      return;
    }
    setIs3DTilt((prev) => !prev);
  };

  // Open Layers Modal
  const handleOpenLayers = () => {
    if (onToggleLayers) {
      onToggleLayers();
    }
    setIsLayerModalOpen(true);
  };

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
      {/* 1. MAPLIBRE GL JS PRIMARY WEBGL CONTAINER */}
      <div
        ref={mapContainerRef}
        className="w-full h-full relative cursor-grab active:cursor-grabbing"
      />

      {/* 2. FLOATING TOP CONTROLS BAR (FULL WIDTH & FROSTED GLASS) */}
      {!hideControls && (
        <div
          className={`absolute ${
            topOffset || 'top-3'
          } left-3 right-3 flex items-center justify-between pointer-events-none z-30`}
        >
          {/* Left Status Pill with Live Map Multi-Service Indicator */}
          <div className="pointer-events-auto bg-[#0c1420]/85 backdrop-blur-xl px-3 py-1.5 rounded-full border border-white/10 text-xs font-JakartaBold text-white shadow-xl flex items-center gap-2">
            <span
              className={`w-2 h-2 rounded-full ${
                isRadarSearching
                  ? 'bg-[#9EE6B5] animate-ping'
                  : isTracking
                  ? 'bg-emerald-400 animate-pulse'
                  : 'bg-[#9EE6B5]'
              }`}
            />
            <span className="truncate max-w-[150px] sm:max-w-xs text-[11px]">
              {isRadarSearching
                ? 'Scanning Lagos...'
                : isTracking
                ? `Live • ${activeTrip?.driver.first_name || 'Driver'}`
                : layerSettings.baseStyle === 'satellite'
                ? 'Satellite Aerial'
                : layerSettings.baseStyle === 'standard'
                ? 'Standard Map'
                : 'Dark Map'}
            </span>
          </div>

          {/* Consolidated Map Options Speed Dial / Popover */}
          <div className="pointer-events-auto relative flex items-center">
            <button
              onClick={() => setIsMapOptionsExpanded((v) => !v)}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl backdrop-blur-xl border text-xs font-JakartaSemiBold shadow-lg active:scale-95 transition-all ${
                isMapOptionsExpanded
                  ? 'bg-[#9EE6B5] text-[#020408] border-[#9EE6B5]'
                  : 'bg-[#0c1420]/85 text-neutral-200 border-white/15 hover:border-[#9EE6B5]'
              }`}
              title="Map Options & Display Controls"
            >
              <Layers className="w-3.5 h-3.5" />
              <span className="text-[11px] font-JakartaBold">Options</span>
            </button>

            {/* Expanded Options Tray */}
            {isMapOptionsExpanded && (
              <div className="absolute right-0 top-full mt-2 flex flex-col gap-1.5 p-1.5 rounded-2xl bg-[#0c1420]/95 backdrop-blur-2xl border border-white/15 shadow-2xl z-50 min-w-[140px] animate-in fade-in zoom-in-95 duration-150">
                {/* Map Layers */}
                <button
                  onClick={() => {
                    handleOpenLayers();
                    setIsMapOptionsExpanded(false);
                  }}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-JakartaSemiBold text-neutral-200 hover:text-white hover:bg-white/10 active:scale-95 transition-all w-full text-left"
                >
                  <Layers className="w-3.5 h-3.5 text-[#9EE6B5]" />
                  <span>Map Layers</span>
                </button>

                {/* 3D / 2D Perspective Toggle */}
                <button
                  onClick={() => {
                    handleToggle3D();
                    setIsMapOptionsExpanded(false);
                  }}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-JakartaSemiBold text-neutral-200 hover:text-white hover:bg-white/10 active:scale-95 transition-all w-full text-left"
                >
                  <Box className="w-3.5 h-3.5 text-[#9EE6B5]" />
                  <span>{is3DTilt ? '2D Top-Down' : '3D Perspective'}</span>
                </button>

                {/* Fullscreen Map Toggle */}
                <button
                  onClick={() => {
                    setIsFullPreview((p) => !p);
                    setIsMapOptionsExpanded(false);
                  }}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-JakartaSemiBold text-neutral-200 hover:text-white hover:bg-white/10 active:scale-95 transition-all w-full text-left"
                >
                  {isFullPreview ? (
                    <>
                      <Minimize2 className="w-3.5 h-3.5 text-amber-400" />
                      <span>Standard View</span>
                    </>
                  ) : (
                    <>
                      <Maximize2 className="w-3.5 h-3.5 text-[#9EE6B5]" />
                      <span>Full Map View</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 3. RIGHT FLOATING NAVIGATION CONTROLS (COMPASS, ROTATE, ZOOM, RECENTER) */}
      {!hideControls && (
        <div
          className={`absolute right-3 ${
            topOffset ? 'top-24' : 'top-14'
          } flex flex-col items-center gap-2 z-30`}
        >
          {/* Working Magnetic Compass */}
          <button
            onClick={handleResetNorth}
            className="w-10 h-10 rounded-2xl bg-[#0c1420]/85 backdrop-blur-xl border border-white/15 shadow-2xl flex flex-col items-center justify-center active:scale-90 hover:border-white/30 transition-all group/compass relative"
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

          {/* Rotate left/right buttons */}
          <div className="flex flex-col rounded-xl bg-[#0c1420]/80 backdrop-blur-xl border border-white/10 overflow-hidden shadow-xl">
            <button
              onClick={() => {
                const newB = bearing - 20;
                setBearing(newB);
                mapInstanceRef.current?.rotateTo(newB);
              }}
              className="w-8 h-7 text-neutral-300 hover:text-white hover:bg-white/10 flex items-center justify-center text-[10px] font-JakartaBold active:scale-95"
              title="Rotate Left"
            >
              ↺
            </button>
            <div className="w-full h-px bg-white/10" />
            <button
              onClick={() => {
                const newB = bearing + 20;
                setBearing(newB);
                mapInstanceRef.current?.rotateTo(newB);
              }}
              className="w-8 h-7 text-neutral-300 hover:text-white hover:bg-white/10 flex items-center justify-center text-[10px] font-JakartaBold active:scale-95"
              title="Rotate Right"
            >
              ↻
            </button>
          </div>

          {/* Zoom In, Zoom Out & Recenter GPS */}
          <div className="flex flex-col rounded-xl bg-[#0c1420]/80 backdrop-blur-xl border border-white/10 overflow-hidden shadow-xl">
            <button
              onClick={() => mapInstanceRef.current?.zoomIn()}
              className="w-8 h-8 text-neutral-300 hover:text-white hover:bg-white/10 flex items-center justify-center active:scale-95 transition-all"
              title="Zoom In"
            >
              <Plus className="w-4 h-4" />
            </button>
            <div className="w-full h-px bg-white/10" />
            <button
              onClick={() => mapInstanceRef.current?.zoomOut()}
              className="w-8 h-8 text-neutral-300 hover:text-white hover:bg-white/10 flex items-center justify-center active:scale-95 transition-all"
              title="Zoom Out"
            >
              <Minus className="w-4 h-4" />
            </button>
            <div className="w-full h-px bg-white/10" />
            <button
              onClick={handleRecenter}
              className="w-8 h-8 text-[#9EE6B5] hover:bg-white/10 flex items-center justify-center active:scale-95 transition-all"
              title="Re-center My GPS Location"
            >
              <Crosshair className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* 4. OSRM LIVE FASTEST ROUTE TELEMETRY BADGE (IF ROUTE ACTIVE) */}
      {showRoute && osrmRoute && (
        <div className="absolute bottom-3 left-3 pointer-events-none z-30">
          <div className="pointer-events-auto bg-[#0c1420]/90 backdrop-blur-xl px-3 py-1.5 rounded-2xl border border-[#9EE6B5]/30 text-white shadow-2xl flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-lg bg-[#9EE6B5]/20 flex items-center justify-center text-[#9EE6B5]">
              <Navigation className="w-3.5 h-3.5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-JakartaBold text-[#9EE6B5]">
                  {osrmRoute.distanceKm} km
                </span>
                <span className="text-[10px] text-neutral-400">•</span>
                <span className="text-xs font-JakartaBold text-white">
                  {osrmRoute.durationMinutes} mins
                </span>
                <span className="text-[9px] bg-cyan-400/20 text-cyan-300 px-1.5 py-0.2 rounded-full font-bold">
                  Live Route
                </span>
              </div>
              <p className="text-[10px] text-neutral-400 truncate max-w-[180px]">
                {osrmRoute.summary}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 5. INSPECTED DRIVER POPUP CARD */}
      {inspectedDriver && (
        <div className="absolute bottom-3 left-3 right-3 max-w-sm mx-auto bg-[#0c1420]/95 backdrop-blur-2xl p-3.5 rounded-2xl border border-[#9EE6B5]/40 shadow-[0_10px_35px_rgba(0,0,0,0.9)] z-40 animate-in fade-in slide-in-from-bottom-3 duration-200">
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

      {/* 6. CLEAN MAP LAYER CONTROL MODAL */}
      <MapLayerControlModal
        isOpen={isLayerModalOpen}
        onClose={() => setIsLayerModalOpen(false)}
        layers={layerSettings}
        onChangeLayers={(updated) => setInternalLayerSettings((prev) => ({ ...prev, ...updated }))}
        onOpenStreetViewer={() => {
          setIsLayerModalOpen(false);
          setIsStreetViewerOpen(true);
        }}
      />

      {/* 7. MAPILLARY STREET-LEVEL 360 IMAGERY VIEWER MODAL */}
      <MapillaryViewerModal
        isOpen={isStreetViewerOpen}
        onClose={() => setIsStreetViewerOpen(false)}
        latitude={userLatitude}
        longitude={userLongitude}
      />
    </div>
  );
};
