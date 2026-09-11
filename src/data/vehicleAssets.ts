/**
 * Global Official Transportation Vehicle Assets
 * Strictly limited to the 8 required vehicles:
 * 🚗 Car
 * 🚐 Van
 * 🚌 Bus
 * 🚲 Bicycle
 * 🏍️ Delivery Bike
 * 🛺 Tricycle
 * 🚚 Lorry
 * 🚑 Ambulance
 */
export const GLOBAL_VEHICLE_ASSETS = {
  car: 'https://admin.cashquora.com/vehicle/car.png',
  van: 'https://admin.cashquora.com/vehicle/van.png',
  bus: '/assets/images/bus.png',
  bicycle: 'https://admin.cashquora.com/vehicle/bicycle.png',
  deliveryBike: 'https://admin.cashquora.com/vehicle/Dispatch.png',
  tricycle: 'https://admin.cashquora.com/vehicle/tricycle.png',
  lorry: 'https://admin.cashquora.com/vehicle/fright.png',
  ambulance: 'https://admin.cashquora.com/vehicle/ambulance.png',
} as const;

export const VEHICLE_3D_ASSETS = {
  car: GLOBAL_VEHICLE_ASSETS.car,
  suv: GLOBAL_VEHICLE_ASSETS.car,
  taxi: GLOBAL_VEHICLE_ASSETS.car,
  van: GLOBAL_VEHICLE_ASSETS.van,
  bus: GLOBAL_VEHICLE_ASSETS.bus,
  bicycle: GLOBAL_VEHICLE_ASSETS.bicycle,
  deliveryBike: GLOBAL_VEHICLE_ASSETS.deliveryBike,
  delivery_bike: GLOBAL_VEHICLE_ASSETS.deliveryBike,
  motorcycle: GLOBAL_VEHICLE_ASSETS.deliveryBike,
  dispatch: GLOBAL_VEHICLE_ASSETS.deliveryBike,
  tricycle: GLOBAL_VEHICLE_ASSETS.tricycle,
  lorry: GLOBAL_VEHICLE_ASSETS.lorry,
  pickup: GLOBAL_VEHICLE_ASSETS.lorry,
  truck: GLOBAL_VEHICLE_ASSETS.lorry,
  freight: GLOBAL_VEHICLE_ASSETS.lorry,
  ambulance: GLOBAL_VEHICLE_ASSETS.ambulance,
};

export interface VehicleSpec {
  id: string;
  name: 'Car' | 'Van' | 'Bus' | 'Bicycle' | 'Delivery Bike' | 'Tricycle' | 'Lorry' | 'Ambulance';
  category: 'car' | 'van' | 'bus' | 'bicycle' | 'deliveryBike' | 'tricycle' | 'lorry' | 'ambulance';
  tag: string;
  seats: number | string;
  etaMinutes: number;
  basePriceNaira: number;
  image: string;
  description: string;
  speed: string;
  luggage: string;
}

/**
 * The only 8 permitted vehicles globally across the app
 */
export const BROADER_3D_FLEET: VehicleSpec[] = [
  {
    id: 'car',
    name: 'Car',
    category: 'car',
    tag: 'Popular',
    seats: 4,
    etaMinutes: 3,
    basePriceNaira: 2800,
    image: GLOBAL_VEHICLE_ASSETS.car,
    description: 'Comfortable air-conditioned standard sedan for daily travel.',
    speed: '45 km/h',
    luggage: '2 bags',
  },
  {
    id: 'van',
    name: 'Van',
    category: 'van',
    tag: 'Group',
    seats: 7,
    etaMinutes: 5,
    basePriceNaira: 6800,
    image: GLOBAL_VEHICLE_ASSETS.van,
    description: 'Spacious passenger van for teams, families, and luggage.',
    speed: '40 km/h',
    luggage: '6 bags',
  },
  {
    id: 'bus',
    name: 'Bus',
    category: 'bus',
    tag: 'Large Group',
    seats: 18,
    etaMinutes: 8,
    basePriceNaira: 14500,
    image: GLOBAL_VEHICLE_ASSETS.bus,
    description: 'High-capacity shuttle bus for corporate events & large groups.',
    speed: '40 km/h',
    luggage: '18 bags',
  },
  {
    id: 'bicycle',
    name: 'Bicycle',
    category: 'bicycle',
    tag: 'Eco',
    seats: 1,
    etaMinutes: 5,
    basePriceNaira: 650,
    image: GLOBAL_VEHICLE_ASSETS.bicycle,
    description: 'Zero-emission commuter bicycle for short hops and light deliveries.',
    speed: '20 km/h',
    luggage: 'Front basket',
  },
  {
    id: 'delivery_bike',
    name: 'Delivery Bike',
    category: 'deliveryBike',
    tag: 'Fast',
    seats: 1,
    etaMinutes: 2,
    basePriceNaira: 1200,
    image: GLOBAL_VEHICLE_ASSETS.deliveryBike,
    description: 'Rapid courier and dispatch motorcycle with secure rear cargo box.',
    speed: '55 km/h',
    luggage: 'Up to 35kg box',
  },
  {
    id: 'tricycle',
    name: 'Tricycle',
    category: 'tricycle',
    tag: 'Economy',
    seats: 3,
    etaMinutes: 2,
    basePriceNaira: 950,
    image: GLOBAL_VEHICLE_ASSETS.tricycle,
    description: 'Affordable, ventilated 3-wheeler for navigating city traffic.',
    speed: '30 km/h',
    luggage: '1 bag',
  },
  {
    id: 'lorry',
    name: 'Lorry',
    category: 'lorry',
    tag: 'Cargo',
    seats: 2,
    etaMinutes: 10,
    basePriceNaira: 22000,
    image: GLOBAL_VEHICLE_ASSETS.lorry,
    description: 'Heavy duty commercial transport lorry for cargo & relocation.',
    speed: '35 km/h',
    luggage: 'Up to 5,000kg',
  },
  {
    id: 'ambulance',
    name: 'Ambulance',
    category: 'ambulance',
    tag: 'Emergency',
    seats: 3,
    etaMinutes: 2,
    basePriceNaira: 15000,
    image: GLOBAL_VEHICLE_ASSETS.ambulance,
    description: 'Equipped emergency response vehicle with paramedic support.',
    speed: '70 km/h siren',
    luggage: 'Medical stretcher',
  },
];

export function getVehicle3DImage(category?: string, name?: string): string {
  const cat = (category || '').toLowerCase().trim();
  const label = (name || '').toLowerCase().trim();

  if (cat.includes('ambulance') || label.includes('ambulance') || label.includes('medic')) {
    return GLOBAL_VEHICLE_ASSETS.ambulance;
  }
  if (
    cat.includes('delivery') ||
    label.includes('delivery') ||
    cat.includes('dispatch') ||
    label.includes('dispatch') ||
    cat.includes('courier') ||
    label.includes('courier') ||
    cat.includes('motorcycle') ||
    label.includes('motorcycle') ||
    cat.includes('okada') ||
    label.includes('okada') ||
    (cat === 'bike' && !cat.includes('bicycle'))
  ) {
    return GLOBAL_VEHICLE_ASSETS.deliveryBike;
  }
  if (cat.includes('bicycle') || label.includes('bicycle') || cat.includes('pedal')) {
    return GLOBAL_VEHICLE_ASSETS.bicycle;
  }
  if (cat.includes('tricycle') || label.includes('tricycle') || cat.includes('keke') || label.includes('keke')) {
    return GLOBAL_VEHICLE_ASSETS.tricycle;
  }
  if (
    cat.includes('lorry') ||
    label.includes('lorry') ||
    cat.includes('truck') ||
    label.includes('truck') ||
    cat.includes('freight') ||
    label.includes('freight') ||
    cat.includes('pickup') ||
    label.includes('pickup')
  ) {
    return GLOBAL_VEHICLE_ASSETS.lorry;
  }
  if (cat === 'bus' || label === 'bus' || cat.includes('shuttle') || label.includes('coaster')) {
    return GLOBAL_VEHICLE_ASSETS.bus;
  }
  if (cat.includes('van') || label.includes('van') || cat.includes('hiace')) {
    return GLOBAL_VEHICLE_ASSETS.van;
  }

  // Default to Car
  return GLOBAL_VEHICLE_ASSETS.car;
}
