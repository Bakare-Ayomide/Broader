import car3d from '../assets/images/car_3d_transparent.png';
import suv3d from '../assets/images/suv_3d_transparent.png';
import motorcycle3d from '../assets/images/bike_3d_transparent.png';
import bicycle3d from '../assets/images/bicycle_3d_transparent.png';
import tricycle3d from '../assets/images/keke_3d_transparent.png';
import van3d from '../assets/images/van_3d_transparent.png';
import bus3d from '../assets/images/bus_3d_transparent.png';
import pickup3d from '../assets/images/pickup_3d_transparent.png';
import truck3d from '../assets/images/truck_3d_transparent.png';
import taxi3d from '../assets/images/taxi_3d_transparent.png';
import ambulance3d from '../assets/images/ambulance_3d_transparent.png';

export const VEHICLE_3D_ASSETS = {
  car: car3d,
  suv: suv3d,
  taxi: taxi3d,
  motorcycle: motorcycle3d,
  bicycle: bicycle3d,
  tricycle: tricycle3d,
  van: van3d,
  bus: bus3d,
  pickup: pickup3d,
  lorry: truck3d,
  truck: truck3d,
  ambulance: ambulance3d,
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
    image: car3d,
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
    image: taxi3d,
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
    image: suv3d,
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
    image: tricycle3d,
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
    image: motorcycle3d,
    description: 'Rapid point-to-point courier and passenger express bike.',
    speed: '60 km/h avg',
    luggage: '1 helmet provided',
  },
  {
    id: 'bicycle_eco',
    name: 'Eco Commuter Bike',
    category: 'bicycle',
    tag: 'Zero Carbon',
    seats: 1,
    etaMinutes: 6,
    basePriceNaira: 650,
    image: bicycle3d,
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
    image: van3d,
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
    image: bus3d,
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
    image: pickup3d,
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
    image: truck3d,
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
    image: ambulance3d,
    description: 'Equipped emergency response unit with onboard paramedic kit.',
    speed: '70 km/h siren',
    luggage: 'Full stretcher',
  },
];

export function getVehicle3DImage(category?: string, name?: string): string {
  const cat = (category || '').toLowerCase();
  const label = (name || '').toLowerCase();

  if (cat.includes('ambulance') || label.includes('ambulance') || label.includes('medic')) {
    return VEHICLE_3D_ASSETS.ambulance;
  }
  if (cat.includes('taxi') || cat.includes('cab') || label.includes('taxi') || label.includes('cab')) {
    return VEHICLE_3D_ASSETS.taxi;
  }
  if (cat.includes('tricycle') || label.includes('keke') || label.includes('rickshaw')) {
    return VEHICLE_3D_ASSETS.tricycle;
  }
  if (cat.includes('bicycle') || label.includes('bicycle') || label.includes('pedal')) {
    return VEHICLE_3D_ASSETS.bicycle;
  }
  if (cat.includes('bike') || cat.includes('motorcycle') || label.includes('okada') || label.includes('moto')) {
    return VEHICLE_3D_ASSETS.motorcycle;
  }
  if (cat.includes('suv') || label.includes('prado') || label.includes('comfort') || label.includes('executive')) {
    return VEHICLE_3D_ASSETS.suv;
  }
  if (cat.includes('bus') || label.includes('coaster') || label.includes('shuttle')) {
    return VEHICLE_3D_ASSETS.bus;
  }
  if (cat.includes('van') || label.includes('van') || label.includes('hiace') || label.includes('transit')) {
    return VEHICLE_3D_ASSETS.van;
  }
  if (cat.includes('pickup') || label.includes('pickup') || label.includes('hilux')) {
    return VEHICLE_3D_ASSETS.pickup;
  }
  if (cat.includes('lorry') || cat.includes('truck') || label.includes('truck') || label.includes('freight') || label.includes('haul')) {
    return VEHICLE_3D_ASSETS.truck;
  }

  return VEHICLE_3D_ASSETS.car;
}
