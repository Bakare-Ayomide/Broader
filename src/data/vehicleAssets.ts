/**
 * Global Official Transportation Vehicle Assets
 * EXACT URLs requested by the user. Only these 7 transportation vehicles are permitted.
 * Ambulance = https://admin.cashquora.com/vehicle/ambulance.png
 * Van = https://admin.cashquora.com/vehicle/van.png
 * Delivery Motorcycle = https://admin.cashquora.com/vehicle/Dispatch.png
 * Bicycle = https://admin.cashquora.com/vehicle/bicycle.png
 * Tricycle = https://admin.cashquora.com/vehicle/tricycle.png
 * Lorry/Freight = https://admin.cashquora.com/vehicle/fright.png
 * Car = https://admin.cashquora.com/vehicle/car.png
 */
export const GLOBAL_VEHICLE_ASSETS = {
  ambulance: 'https://admin.cashquora.com/vehicle/ambulance.png',
  van: 'https://admin.cashquora.com/vehicle/van.png',
  deliveryMotorcycle: 'https://admin.cashquora.com/vehicle/Dispatch.png',
  bicycle: 'https://admin.cashquora.com/vehicle/bicycle.png',
  tricycle: 'https://admin.cashquora.com/vehicle/tricycle.png',
  lorryFreight: 'https://admin.cashquora.com/vehicle/fright.png',
  car: 'https://admin.cashquora.com/vehicle/car.png',
} as const;

export const VEHICLE_3D_ASSETS = {
  car: GLOBAL_VEHICLE_ASSETS.car,
  suv: GLOBAL_VEHICLE_ASSETS.car,
  taxi: GLOBAL_VEHICLE_ASSETS.car,
  motorcycle: GLOBAL_VEHICLE_ASSETS.deliveryMotorcycle,
  dispatch: GLOBAL_VEHICLE_ASSETS.deliveryMotorcycle,
  bicycle: GLOBAL_VEHICLE_ASSETS.bicycle,
  tricycle: GLOBAL_VEHICLE_ASSETS.tricycle,
  van: GLOBAL_VEHICLE_ASSETS.van,
  bus: GLOBAL_VEHICLE_ASSETS.van,
  pickup: GLOBAL_VEHICLE_ASSETS.lorryFreight,
  lorry: GLOBAL_VEHICLE_ASSETS.lorryFreight,
  truck: GLOBAL_VEHICLE_ASSETS.lorryFreight,
  ambulance: GLOBAL_VEHICLE_ASSETS.ambulance,
};

export interface VehicleSpec {
  id: string;
  name: string;
  category: keyof typeof VEHICLE_3D_ASSETS;
  tag: string;
  seats: number | string;
  etaMinutes: number;
  basePriceNaira: number;
  image: string;
  description: string;
  speed: string;
  luggage: string;
}

export const BROADER_3D_FLEET: VehicleSpec[] = [
  {
    id: 'car_sedan',
    name: 'Broader Sedan',
    category: 'car',
    tag: 'Popular',
    seats: 4,
    etaMinutes: 3,
    basePriceNaira: 2800,
    image: GLOBAL_VEHICLE_ASSETS.car,
    description: 'Modern executive comfort sedan for seamless daily travel.',
    speed: '45 km/h avg',
    luggage: '2 bags',
  },
  {
    id: 'taxi_cab',
    name: 'Lagos City Cab',
    category: 'taxi',
    tag: 'Fast Track',
    seats: 4,
    etaMinutes: 2,
    basePriceNaira: 2400,
    image: GLOBAL_VEHICLE_ASSETS.car,
    description: 'Licensed city taxi with bus-lane clearance and fixed rate.',
    speed: '50 km/h avg',
    luggage: '2 bags',
  },
  {
    id: 'suv_executive',
    name: 'Executive SUV',
    category: 'suv',
    tag: 'Premium',
    seats: 4,
    etaMinutes: 5,
    basePriceNaira: 5200,
    image: GLOBAL_VEHICLE_ASSETS.car,
    description: 'High-riding luxury SUV with leather upholstery and climate control.',
    speed: '55 km/h avg',
    luggage: '4 bags',
  },
  {
    id: 'tricycle_keke',
    name: 'Keke Tricycle',
    category: 'tricycle',
    tag: 'Economy',
    seats: 3,
    etaMinutes: 2,
    basePriceNaira: 950,
    image: GLOBAL_VEHICLE_ASSETS.tricycle,
    description: 'Zippy 3-wheeler designed to beat inner-city traffic bottlenecks.',
    speed: '30 km/h avg',
    luggage: '1 backpack',
  },
  {
    id: 'bike_moto',
    name: 'Express Okada',
    category: 'motorcycle',
    tag: 'Fastest',
    seats: 1,
    etaMinutes: 1,
    basePriceNaira: 1200,
    image: GLOBAL_VEHICLE_ASSETS.deliveryMotorcycle,
    description: 'Rapid point-to-point courier and passenger express bike.',
    speed: '60 km/h avg',
    luggage: '1 helmet provided',
  },
  {
    id: 'dispatch_rider',
    name: 'Dispatch Rider',
    category: 'dispatch',
    tag: 'Package Delivery',
    seats: 1,
    etaMinutes: 2,
    basePriceNaira: 1400,
    image: GLOBAL_VEHICLE_ASSETS.deliveryMotorcycle,
    description: 'Dedicated courier delivery bike with sealed secure cargo top-box.',
    speed: '55 km/h avg',
    luggage: 'Up to 25kg cargo box',
  },
  {
    id: 'bicycle_eco',
    name: 'Eco Commuter Bike',
    category: 'bicycle',
    tag: 'Zero Carbon',
    seats: 1,
    etaMinutes: 6,
    basePriceNaira: 650,
    image: GLOBAL_VEHICLE_ASSETS.bicycle,
    description: 'Silent pedal-assist commuter bike for short eco-friendly hops.',
    speed: '20 km/h avg',
    luggage: 'Front basket',
  },
  {
    id: 'van_group',
    name: 'Prime Van (7-Seater)',
    category: 'van',
    tag: 'Group',
    seats: 7,
    etaMinutes: 6,
    basePriceNaira: 6800,
    image: GLOBAL_VEHICLE_ASSETS.van,
    description: 'Spacious multi-passenger van for teams, families, and airport runs.',
    speed: '40 km/h avg',
    luggage: '6 bags',
  },
  {
    id: 'bus_coaster',
    name: 'Luxury Coaster Bus',
    category: 'bus',
    tag: 'Charter',
    seats: 18,
    etaMinutes: 10,
    basePriceNaira: 16500,
    image: GLOBAL_VEHICLE_ASSETS.van,
    description: 'High-capacity shuttle bus for corporate events and excursions.',
    speed: '40 km/h avg',
    luggage: '18 bags',
  },
  {
    id: 'pickup_truck',
    name: 'All-Terrain Pickup',
    category: 'pickup',
    tag: 'Utility',
    seats: 5,
    etaMinutes: 7,
    basePriceNaira: 8500,
    image: GLOBAL_VEHICLE_ASSETS.lorryFreight,
    description: 'Heavy duty dual-cab pickup truck with open-bed cargo capacity.',
    speed: '45 km/h avg',
    luggage: '500kg payload',
  },
  {
    id: 'freight_lorry',
    name: 'Freight Lorry',
    category: 'truck',
    tag: 'Heavy Haul',
    seats: 2,
    etaMinutes: 12,
    basePriceNaira: 24000,
    image: GLOBAL_VEHICLE_ASSETS.lorryFreight,
    description: 'Full commercial container truck for bulky cargo and logistics.',
    speed: '35 km/h avg',
    luggage: '3,000kg payload',
  },
  {
    id: 'ambulance_medic',
    name: 'Critical Ambulance',
    category: 'ambulance',
    tag: 'Emergency',
    seats: 3,
    etaMinutes: 2,
    basePriceNaira: 15000,
    image: GLOBAL_VEHICLE_ASSETS.ambulance,
    description: 'Equipped emergency response unit with onboard paramedic kit.',
    speed: '70 km/h siren',
    luggage: 'Full stretcher',
  },
];

export function getVehicle3DImage(category?: string, name?: string): string {
  const cat = (category || '').toLowerCase();
  const label = (name || '').toLowerCase();

  if (cat.includes('ambulance') || label.includes('ambulance') || label.includes('medic')) {
    return GLOBAL_VEHICLE_ASSETS.ambulance;
  }
  if (
    cat.includes('dispatch') ||
    label.includes('dispatch') ||
    cat.includes('courier') ||
    label.includes('courier') ||
    cat.includes('delivery') ||
    label.includes('delivery') ||
    cat.includes('package') ||
    label.includes('package') ||
    cat.includes('motorcycle') ||
    cat.includes('bike') ||
    label.includes('okada') ||
    label.includes('moto')
  ) {
    return GLOBAL_VEHICLE_ASSETS.deliveryMotorcycle;
  }
  if (cat.includes('bicycle') || label.includes('bicycle') || label.includes('pedal')) {
    return GLOBAL_VEHICLE_ASSETS.bicycle;
  }
  if (cat.includes('tricycle') || label.includes('keke') || label.includes('rickshaw')) {
    return GLOBAL_VEHICLE_ASSETS.tricycle;
  }
  if (
    cat.includes('lorry') ||
    cat.includes('truck') ||
    cat.includes('freight') ||
    cat.includes('pickup') ||
    cat.includes('cargo') ||
    label.includes('truck') ||
    label.includes('freight') ||
    label.includes('lorry') ||
    label.includes('haul') ||
    label.includes('pickup') ||
    label.includes('canter') ||
    label.includes('flatbed') ||
    label.includes('container')
  ) {
    return GLOBAL_VEHICLE_ASSETS.lorryFreight;
  }
  if (
    cat.includes('van') ||
    cat.includes('bus') ||
    label.includes('van') ||
    label.includes('bus') ||
    label.includes('hiace') ||
    label.includes('coaster') ||
    label.includes('shuttle') ||
    label.includes('transit')
  ) {
    return GLOBAL_VEHICLE_ASSETS.van;
  }

  // Default to Car
  return GLOBAL_VEHICLE_ASSETS.car;
}
