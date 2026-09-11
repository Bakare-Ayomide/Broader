/**
 * OpenStreetMap Nominatim Geocoding & Reverse-Geocoding Service
 * Complies with OSM Nominatim usage policy (user-agent, throttled requests).
 * Includes instant fallbacks for Lagos, Nigeria landmarks and user locations.
 */

export interface GeocodingResult {
  placeId: string;
  name: string;
  displayName: string;
  lat: number;
  lng: number;
  type: string;
  category: string;
}

// Local fallback dictionary for instant, offline-proof Lagos search
export const LAGOS_LOCAL_PLACES: GeocodingResult[] = [
  {
    placeId: 'los_murtala_intl',
    name: "Murtala Muhammed International Airport (LOS)",
    displayName: "Murtala Muhammed International Airport, Airport Rd, Ikeja, Lagos",
    lat: 6.5774,
    lng: 3.3212,
    type: 'aerodrome',
    category: 'transport',
  },
  {
    placeId: 'los_lekki_bridge',
    name: "Lekki-Ikoyi Link Bridge",
    displayName: "Lekki - Ikoyi Link Bridge, Admiralty Way, Lekki Phase 1, Lagos",
    lat: 6.4474,
    lng: 3.4735,
    type: 'bridge',
    category: 'highway',
  },
  {
    placeId: 'los_victoria_island_cbd',
    name: "Victoria Island Financial District",
    displayName: "Adeola Odeku & Ahmadu Bello Way, Victoria Island, Lagos",
    lat: 6.4281,
    lng: 3.4219,
    type: 'commercial',
    category: 'place',
  },
  {
    placeId: 'los_palms_mall',
    name: "The Palms Shopping Mall",
    displayName: "1 Bisway St, Maroko, Lekki, Lagos",
    lat: 6.4326,
    lng: 3.4475,
    type: 'shop',
    category: 'amenity',
  },
  {
    placeId: 'los_eko_atlantic',
    name: "Eko Atlantic City",
    displayName: "Eko Atlantic Boulevard, Victoria Island Coastal Zone, Lagos",
    lat: 6.4215,
    lng: 3.4110,
    type: 'residential',
    category: 'place',
  },
  {
    placeId: 'los_civic_centre',
    name: "The Civic Centre & Towers",
    displayName: "Ozumba Mbadiwe Ave, Victoria Island, Lagos",
    lat: 6.4367,
    lng: 3.4358,
    type: 'convention_centre',
    category: 'amenity',
  },
  {
    placeId: 'los_ikeja_city_mall',
    name: "Ikeja City Mall (ICM)",
    displayName: "Obafemi Awolowo Way, Alausa, Ikeja, Lagos",
    lat: 6.6178,
    lng: 3.3578,
    type: 'mall',
    category: 'commercial',
  },
  {
    placeId: 'los_landmark_beach',
    name: "Landmark Beach & Village",
    displayName: "4 Water Corporation Drive, Oniru, Victoria Island, Lagos",
    lat: 6.4241,
    lng: 3.4471,
    type: 'leisure',
    category: 'tourism',
  },
  {
    placeId: 'los_marina_cms',
    name: "Marina CMS Ferry Terminal",
    displayName: "Marina Waterfront, CMS Bus Stop, Lagos Island, Lagos",
    lat: 6.4525,
    lng: 3.3912,
    type: 'ferry_terminal',
    category: 'transport',
  },
  {
    placeId: 'los_yaba_tech',
    name: "Yaba Tech / Innovation Hub",
    displayName: "Herbert Macaulay Way, Sabo, Yaba, Lagos",
    lat: 6.5186,
    lng: 3.3768,
    type: 'commercial',
    category: 'education',
  },
];

// In-memory cache for search queries
const searchCache = new Map<string, GeocodingResult[]>();
let lastRequestTime = 0;

/**
 * Throttles calls to respect OSM 1 request/second rule
 */
async function throttleNominatim(): Promise<void> {
  const now = Date.now();
  const elapsed = now - lastRequestTime;
  if (elapsed < 1000) {
    await new Promise((resolve) => setTimeout(resolve, 1000 - elapsed));
  }
  lastRequestTime = Date.now();
}

/**
 * Search places by query string using OpenStreetMap Nominatim with local fallback
 */
export async function searchNominatim(query: string): Promise<GeocodingResult[]> {
  const trimmed = query.trim().toLowerCase();
  if (!trimmed) return [];

  // Check in-memory cache
  if (searchCache.has(trimmed)) {
    return searchCache.get(trimmed)!;
  }

  // Fast local match first
  const localMatches = LAGOS_LOCAL_PLACES.filter(
    (p) =>
      p.name.toLowerCase().includes(trimmed) ||
      p.displayName.toLowerCase().includes(trimmed)
  );

  try {
    await throttleNominatim();

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    // Limit search to Nigeria bounding box or query with countrycode
    const encoded = encodeURIComponent(query);
    const url = `https://nominatim.openstreetmap.org/search?q=${encoded}&format=json&addressdetails=1&limit=5&countrycodes=ng`;

    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        Accept: 'application/json',
        'User-Agent': 'BroaderApp/1.0 (RideHailingNavigationMap)',
      },
    });

    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      if (Array.isArray(data) && data.length > 0) {
        const osmResults: GeocodingResult[] = data.map((item: any) => ({
          placeId: `osm_${item.place_id}`,
          name: item.name || item.display_name.split(',')[0],
          displayName: item.display_name,
          lat: parseFloat(item.lat),
          lng: parseFloat(item.lon),
          type: item.type || 'place',
          category: item.class || 'general',
        }));

        // Combine unique results
        const combined = [...localMatches];
        for (const res of osmResults) {
          if (!combined.some((c) => Math.abs(c.lat - res.lat) < 0.001 && Math.abs(c.lng - res.lng) < 0.001)) {
            combined.push(res);
          }
        }

        searchCache.set(trimmed, combined);
        return combined;
      }
    }
  } catch (err) {
    // Graceful fallback to local matches
  }

  searchCache.set(trimmed, localMatches);
  return localMatches;
}

/**
 * Reverse geocode a latitude/longitude pair into a human-readable address
 */
export async function reverseGeocodeNominatim(
  lat: number,
  lng: number
): Promise<string> {
  // Check local landmarks within 500m
  for (const place of LAGOS_LOCAL_PLACES) {
    const dLat = Math.abs(place.lat - lat);
    const dLng = Math.abs(place.lng - lng);
    if (dLat < 0.004 && dLng < 0.004) {
      return place.name;
    }
  }

  try {
    await throttleNominatim();
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`;
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        Accept: 'application/json',
        'User-Agent': 'BroaderApp/1.0 (RideHailingNavigationMap)',
      },
    });

    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      if (data && data.display_name) {
        const road = data.address?.road || data.address?.suburb || data.name;
        const city = data.address?.city || data.address?.state || 'Lagos';
        return road ? `${road}, ${city}` : data.display_name.split(',').slice(0, 2).join(',');
      }
    }
  } catch (err) {
    // Fallback
  }

  return 'Victoria Island, Lagos';
}
