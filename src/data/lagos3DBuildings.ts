/**
 * Lagos GeoJSON Data for MapLibre GL JS Layers
 * Includes 3D building extrusions, live traffic flow corridors, and landmark POIs.
 */

// 3D Buildings GeoJSON for MapLibre GL JS fill-extrusion
export const LAGOS_3D_BUILDINGS_GEOJSON: GeoJSON.FeatureCollection = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: {
        id: 'bld_civic_towers',
        name: 'The Civic Towers',
        height: 110,
        base_height: 0,
        color: '#1e293b',
        roofColor: '#9EE6B5',
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [3.4352, 6.4362],
            [3.4364, 6.4362],
            [3.4364, 6.4372],
            [3.4352, 6.4372],
            [3.4352, 6.4362],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: {
        id: 'bld_eko_atlantic_pearl',
        name: 'Eko Pearl Towers',
        height: 135,
        base_height: 0,
        color: '#0f172a',
        roofColor: '#38bdf8',
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [3.4112, 6.4212],
            [3.4124, 6.4212],
            [3.4124, 6.4222],
            [3.4112, 6.4222],
            [3.4112, 6.4212],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: {
        id: 'bld_standard_chartered',
        name: 'Standard Chartered HQ',
        height: 95,
        base_height: 0,
        color: '#131e2e',
        roofColor: '#9EE6B5',
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [3.4221, 6.4278],
            [3.4233, 6.4278],
            [3.4233, 6.4288],
            [3.4221, 6.4288],
            [3.4221, 6.4278],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: {
        id: 'bld_oriental_hotel',
        name: 'Lagos Oriental Hotel Tower',
        height: 85,
        base_height: 0,
        color: '#1a2234',
        roofColor: '#f59e0b',
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [3.4425, 6.4385],
            [3.4439, 6.4385],
            [3.4439, 6.4395],
            [3.4425, 6.4395],
            [3.4425, 6.4385],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: {
        id: 'bld_admiralty_mall',
        name: 'Lekki Admiralty Financial Centre',
        height: 70,
        base_height: 0,
        color: '#162232',
        roofColor: '#9EE6B5',
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [3.4725, 6.4468],
            [3.4739, 6.4468],
            [3.4739, 6.4478],
            [3.4725, 6.4478],
            [3.4725, 6.4468],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: {
        id: 'bld_the_palms',
        name: 'The Palms Lekki Complex',
        height: 45,
        base_height: 0,
        color: '#151d28',
        roofColor: '#10b981',
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [3.4465, 6.4318],
            [3.4490, 6.4318],
            [3.4490, 6.4338],
            [3.4465, 6.4338],
            [3.4465, 6.4318],
          ],
        ],
      },
    },
  ],
};

// Live Traffic Overlay Segments on Lagos arterial routes
export const LAGOS_TRAFFIC_GEOJSON: GeoJSON.FeatureCollection = {
  type: 'FeatureCollection',
  features: [
    // Lekki-Ikoyi Link Bridge: Clear / Fast Flow (Green)
    {
      type: 'Feature',
      properties: {
        name: 'Lekki-Ikoyi Link Bridge',
        status: 'clear',
        speedKmH: 52,
        color: '#34D399',
      },
      geometry: {
        type: 'LineString',
        coordinates: [
          [3.4735, 6.4474],
          [3.4680, 6.4520],
          [3.4600, 6.4550],
          [3.4520, 6.4560],
        ],
      },
    },
    // Ozumba Mbadiwe: Moderate Traffic (Amber)
    {
      type: 'Feature',
      properties: {
        name: 'Ozumba Mbadiwe Avenue',
        status: 'moderate',
        speedKmH: 26,
        color: '#FBBF24',
      },
      geometry: {
        type: 'LineString',
        coordinates: [
          [3.4219, 6.4281],
          [3.4290, 6.4320],
          [3.4367, 6.4367],
          [3.4430, 6.4390],
        ],
      },
    },
    // Lekki Toll Plaza: Congested / Slow (Red)
    {
      type: 'Feature',
      properties: {
        name: 'Lekki Tollgate Corridor',
        status: 'congested',
        speedKmH: 11,
        color: '#EF4444',
      },
      geometry: {
        type: 'LineString',
        coordinates: [
          [3.4430, 6.4390],
          [3.4550, 6.4430],
          [3.4650, 6.4450],
          [3.4735, 6.4474],
        ],
      },
    },
    // Admiralty Way: Clear Flow (Mint Green)
    {
      type: 'Feature',
      properties: {
        name: 'Admiralty Way, Lekki',
        status: 'clear',
        speedKmH: 45,
        color: '#9EE6B5',
      },
      geometry: {
        type: 'LineString',
        coordinates: [
          [3.4735, 6.4474],
          [3.4780, 6.4510],
          [3.4830, 6.4550],
          [3.4890, 6.4580],
        ],
      },
    },
  ],
};

// Key Points of Interest (POIs) in Lagos
export const LAGOS_POIS = [
  {
    id: 'poi_murtala_airport',
    name: 'Murtala Muhammed Airport (LOS)',
    category: 'Airport / Terminal',
    lat: 6.5774,
    lng: 3.3212,
    icon: 'Plane',
    color: '#00E5FF',
    badge: 'Terminal 1 & 2',
  },
  {
    id: 'poi_lekki_bridge',
    name: 'Lekki-Ikoyi Link Bridge',
    category: 'Landmark Tollway',
    lat: 6.4474,
    lng: 3.4735,
    icon: 'Bridge',
    color: '#9EE6B5',
    badge: 'Iconic Bridge',
  },
  {
    id: 'poi_civic_centre',
    name: 'The Civic Centre',
    category: 'Business & Event Hub',
    lat: 6.4367,
    lng: 3.4358,
    icon: 'Building2',
    color: '#38BDF8',
    badge: 'VI Waterfront',
  },
  {
    id: 'poi_palms_mall',
    name: 'The Palms Lekki',
    category: 'Retail & Dining',
    lat: 6.4326,
    lng: 3.4475,
    icon: 'ShoppingBag',
    color: '#FBBF24',
    badge: 'Open 9AM-10PM',
  },
  {
    id: 'poi_eko_atlantic',
    name: 'Eko Atlantic Coastal City',
    category: 'Commercial District',
    lat: 6.4215,
    lng: 3.4110,
    icon: 'Building2',
    color: '#E11D48',
    badge: 'Ocean Boulevard',
  },
  {
    id: 'poi_marina_terminal',
    name: 'Marina Waterways Terminal',
    category: 'Water Transit',
    lat: 6.4525,
    lng: 3.3912,
    icon: 'Ship',
    color: '#34D399',
    badge: 'Lekki Ferry',
  },
];
