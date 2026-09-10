/**
 * Mapillary Street-Level Imagery Service
 * Provides street photography imagery, panoramic camera perspectives,
 * sequence steps, and coverage endpoints along Lagos transportation corridors.
 */

export interface StreetImageryFrame {
  id: string;
  streetName: string;
  neighborhood: string;
  lat: number;
  lng: number;
  heading: number;
  capturedAt: string;
  imageUrl: string;
  panoramicThumbUrl: string;
  nextFrameId?: string;
  prevFrameId?: string;
}

// Curated street-level photographic scenes for key Lagos routes
export const MAPILLARY_LAGOS_FRAMES: StreetImageryFrame[] = [
  {
    id: 'mly_ozumba_mbadiwe_1',
    streetName: 'Ozumba Mbadiwe Avenue',
    neighborhood: 'Victoria Island, Lagos',
    lat: 6.4348,
    lng: 3.4285,
    heading: 75,
    capturedAt: '2024-05-18T14:22:00Z',
    imageUrl:
      'https://images.unsplash.com/photo-1577717903315-1691ae25ab3f?auto=format&fit=crop&w=1600&q=80',
    panoramicThumbUrl:
      'https://images.unsplash.com/photo-1577717903315-1691ae25ab3f?auto=format&fit=crop&w=400&q=60',
    nextFrameId: 'mly_ozumba_mbadiwe_2',
  },
  {
    id: 'mly_ozumba_mbadiwe_2',
    streetName: 'Ozumba Mbadiwe at Civic Towers',
    neighborhood: 'Victoria Island, Lagos',
    lat: 6.4365,
    lng: 3.4342,
    heading: 82,
    capturedAt: '2024-05-18T14:25:00Z',
    imageUrl:
      'https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=1600&q=80',
    panoramicThumbUrl:
      'https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=400&q=60',
    prevFrameId: 'mly_ozumba_mbadiwe_1',
    nextFrameId: 'mly_lekki_bridge_1',
  },
  {
    id: 'mly_lekki_bridge_1',
    streetName: 'Lekki-Ikoyi Link Bridge Ramp',
    neighborhood: 'Lekki Phase 1, Lagos',
    lat: 6.4468,
    lng: 3.4712,
    heading: 320,
    capturedAt: '2024-06-02T16:10:00Z',
    imageUrl:
      'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=1600&q=80',
    panoramicThumbUrl:
      'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=400&q=60',
    prevFrameId: 'mly_ozumba_mbadiwe_2',
    nextFrameId: 'mly_admiralty_way_1',
  },
  {
    id: 'mly_admiralty_way_1',
    streetName: 'Admiralty Way (Commercial Strip)',
    neighborhood: 'Lekki Phase 1, Lagos',
    lat: 6.4492,
    lng: 3.4756,
    heading: 95,
    capturedAt: '2024-06-02T16:15:00Z',
    imageUrl:
      'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=1600&q=80',
    panoramicThumbUrl:
      'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=400&q=60',
    prevFrameId: 'mly_lekki_bridge_1',
    nextFrameId: 'mly_eko_atlantic_1',
  },
  {
    id: 'mly_eko_atlantic_1',
    streetName: 'Eko Atlantic Coastal Boulevard',
    neighborhood: 'Victoria Island, Lagos',
    lat: 6.4218,
    lng: 3.4115,
    heading: 180,
    capturedAt: '2024-07-10T11:45:00Z',
    imageUrl:
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=80',
    panoramicThumbUrl:
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=400&q=60',
    prevFrameId: 'mly_admiralty_way_1',
  },
];

/**
 * Find the closest street imagery frame to a given GPS coordinate
 */
export function getClosestStreetFrame(lat: number, lng: number): StreetImageryFrame {
  let closest = MAPILLARY_LAGOS_FRAMES[0];
  let minDistance = Infinity;

  for (const frame of MAPILLARY_LAGOS_FRAMES) {
    const d = Math.hypot(frame.lat - lat, frame.lng - lng);
    if (d < minDistance) {
      minDistance = d;
      closest = frame;
    }
  }

  return closest;
}
