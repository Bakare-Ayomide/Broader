import { VehicleCategory, VehicleOption, Driver, ActiveTrip, WalletTransaction, Ride } from '../types';

// Authentic Nigerian Drivers Pool
export const NIGERIAN_DRIVERS_POOL: (Driver & {
  supportedCategories: VehicleCategory[];
  plate_number: string;
  car_model: string;
  car_color: string;
  phone: string;
})[] = [
  {
    id: 101,
    first_name: 'Babatunde',
    last_name: 'Adeleke',
    title: 'Babatunde Adeleke',
    profile_image_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=180&auto=format&fit=crop&q=80',
    car_image_url: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=200&auto=format&fit=crop&q=80',
    car_seats: 4,
    rating: 4.92,
    car_model: 'Toyota Corolla 2021',
    car_color: 'Silver Metallic',
    plate_number: 'EKY-428-AB',
    phone: '+234 803 112 3344',
    supportedCategories: ['car'],
  },
  {
    id: 102,
    first_name: 'Chinedu',
    last_name: 'Okafor',
    title: 'Chinedu Okafor',
    profile_image_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=180&auto=format&fit=crop&q=80',
    car_image_url: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=200&auto=format&fit=crop&q=80',
    car_seats: 6,
    rating: 4.88,
    car_model: 'Toyota Prado TXL',
    car_color: 'Midnight Black',
    plate_number: 'KJA-819-LK',
    phone: '+234 802 889 0011',
    supportedCategories: ['suv'],
  },
  {
    id: 103,
    first_name: 'Aminu',
    last_name: 'Bello',
    title: 'Aminu Bello',
    profile_image_url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=180&auto=format&fit=crop&q=80',
    car_image_url: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=200&auto=format&fit=crop&q=80',
    car_seats: 2,
    rating: 4.95,
    car_model: 'Haojue Express 150cc',
    car_color: 'Speed Red',
    plate_number: 'LND-512-XY',
    phone: '+234 814 556 7788',
    supportedCategories: ['motorcycle', 'bicycle'],
  },
  {
    id: 104,
    first_name: 'Ngozi',
    last_name: 'Eze',
    title: 'Ngozi Eze',
    profile_image_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=180&auto=format&fit=crop&q=80',
    car_image_url: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=200&auto=format&fit=crop&q=80',
    car_seats: 4,
    rating: 4.96,
    car_model: 'Hyundai Elantra Premium',
    car_color: 'Pearl White',
    plate_number: 'APP-934-TZ',
    phone: '+234 809 332 1100',
    supportedCategories: ['car', 'suv'],
  },
  {
    id: 105,
    first_name: 'Tunde',
    last_name: 'Alabi',
    title: 'Tunde Alabi',
    profile_image_url: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=180&auto=format&fit=crop&q=80',
    car_image_url: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=200&auto=format&fit=crop&q=80',
    car_seats: 3,
    rating: 4.82,
    car_model: 'Bajaj RE 4S Tricycle (Keke)',
    car_color: 'Lagos Yellow',
    plate_number: 'BDG-701-QA',
    phone: '+234 805 776 2211',
    supportedCategories: ['tricycle'],
  },
  {
    id: 106,
    first_name: 'Emeka',
    last_name: 'Nwosu',
    title: 'Emeka Nwosu',
    profile_image_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=180&auto=format&fit=crop&q=80',
    car_image_url: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=200&auto=format&fit=crop&q=80',
    car_seats: 10,
    rating: 4.89,
    car_model: 'Toyota HiAce High Roof',
    car_color: 'Arctic White',
    plate_number: 'AKD-334-YK',
    phone: '+234 803 998 1234',
    supportedCategories: ['van', 'bus'],
  },
  {
    id: 107,
    first_name: 'Ibrahim',
    last_name: 'Musa',
    title: 'Ibrahim Musa',
    profile_image_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=180&auto=format&fit=crop&q=80',
    car_image_url: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=200&auto=format&fit=crop&q=80',
    car_seats: 3,
    rating: 4.91,
    car_model: 'Toyota Hilux 4x4 Hauler',
    car_color: 'Graphite Grey',
    plate_number: 'FKJ-621-XZ',
    phone: '+234 818 223 9900',
    supportedCategories: ['pickup', 'lorry'],
  },
];

// Helper to compute distance (Haversine formula in KM)
export const calculateDistanceKm = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const dist = R * c;
  return Math.max(1.5, Math.round(dist * 10) / 10);
};

// Backend Pricing Engine for all 9 Broader Vehicle Types
// Dynamic calculation in Nigerian Naira (₦)
export const fetchBackendVehiclePricing = async (
  originLat: number,
  originLng: number,
  destLat: number,
  destLng: number
): Promise<{ distanceKm: number; etaMinutes: number; options: VehicleOption[] }> => {
  // Simulate backend API network latency (250ms)
  await new Promise((res) => setTimeout(res, 250));

  const distanceKm = calculateDistanceKm(originLat, originLng, destLat, destLng);
  // Base average trip time in minutes (accounting for Lagos traffic factor 1.4)
  const baseMinutes = Math.max(5, Math.round(distanceKm * 2.6));

  const vehicleConfigs: {
    category: VehicleCategory;
    name: string;
    capacity: string;
    baseFare: number;
    perKmRate: number;
    minFare: number;
    etaMultiplier: number;
    description: string;
    iconName: string;
  }[] = [
    {
      category: 'bicycle',
      name: 'Bicycle',
      capacity: '1 rider · micro cargo',
      baseFare: 300,
      perKmRate: 70,
      minFare: 500,
      etaMultiplier: 0.8,
      description: 'Zero-emission bicycle for short distances & swift courier',
      iconName: 'Bike',
    },
    {
      category: 'motorcycle',
      name: 'Motorcycle (Okada)',
      capacity: '1–2 passengers',
      baseFare: 500,
      perKmRate: 140,
      minFare: 850,
      etaMultiplier: 0.7,
      description: 'Fastest way through heavy traffic & gridlocks',
      iconName: 'Bike',
    },
    {
      category: 'tricycle',
      name: 'Tricycle (Keke)',
      capacity: '3 passengers',
      baseFare: 700,
      perKmRate: 180,
      minFare: 1200,
      etaMultiplier: 0.9,
      description: 'Affordable, ventilated neighborhood transport',
      iconName: 'Car',
    },
    {
      category: 'car',
      name: 'Broader Go (Car)',
      capacity: '4 passengers',
      baseFare: 1500,
      perKmRate: 350,
      minFare: 2800,
      etaMultiplier: 1.0,
      description: 'Standard comfortable air-conditioned sedan',
      iconName: 'Car',
    },
    {
      category: 'suv',
      name: 'Broader Executive (SUV)',
      capacity: '4–6 passengers',
      baseFare: 3000,
      perKmRate: 650,
      minFare: 5500,
      etaMultiplier: 1.1,
      description: 'Premium spacious luxury ride with elite comfort',
      iconName: 'ShieldCheck',
    },
    {
      category: 'van',
      name: 'Broader Van',
      capacity: '7–10 passengers',
      baseFare: 4500,
      perKmRate: 900,
      minFare: 8500,
      etaMultiplier: 1.3,
      description: 'Spacious van for group journeys, airport transfers & luggage',
      iconName: 'Users',
    },
    {
      category: 'bus',
      name: 'Broader Shuttle (Bus)',
      capacity: '14–18 passengers',
      baseFare: 8000,
      perKmRate: 1400,
      minFare: 14000,
      etaMultiplier: 1.5,
      description: 'High-capacity shuttle for teams, corporate staff & events',
      iconName: 'Bus',
    },
    {
      category: 'pickup',
      name: 'Broader Pickup (Hilux)',
      capacity: 'Up to 1,000kg cargo',
      baseFare: 9000,
      perKmRate: 1600,
      minFare: 16500,
      etaMultiplier: 1.4,
      description: 'Heavy duty open-bed utility truck for hauling cargo',
      iconName: 'Truck',
    },
    {
      category: 'lorry',
      name: 'Broader Lorry (Heavy Truck)',
      capacity: 'Up to 5,000kg cargo',
      baseFare: 18000,
      perKmRate: 2800,
      minFare: 32000,
      etaMultiplier: 1.8,
      description: 'Full freight, home relocation & large scale logistics',
      iconName: 'Truck',
    },
  ];

  const options: VehicleOption[] = vehicleConfigs.map((cfg) => {
    // Dynamic price calculation from backend rate:
    const calculatedPrice = cfg.baseFare + distanceKm * cfg.perKmRate;
    const roundedPrice = Math.round(Math.max(cfg.minFare, calculatedPrice) / 50) * 50; // round to 50 ₦
    const eta = Math.max(3, Math.round(baseMinutes * cfg.etaMultiplier));

    return {
      id: cfg.category,
      category: cfg.category,
      name: cfg.name,
      capacity: cfg.capacity,
      etaMinutes: eta,
      price: roundedPrice,
      description: cfg.description,
      iconName: cfg.iconName,
    };
  });

  return {
    distanceKm,
    etaMinutes: baseMinutes,
    options,
  };
};

// Backend Driver Matching Service
export const requestBackendDriverMatch = async (
  vehicleCategory: VehicleCategory,
  pickup: { address: string; latitude: number; longitude: number },
  destination: { address: string; latitude: number; longitude: number },
  vehicle: VehicleOption,
  paymentMethod: 'wallet' | 'card' | 'cash',
  pickupInstructions?: string
): Promise<ActiveTrip> => {
  // Simulate backend driver dispatch algorithm
  // Finds best rated driver supporting this category or fallback
  const matchingDriver =
    NIGERIAN_DRIVERS_POOL.find((d) => d.supportedCategories.includes(vehicleCategory)) ||
    NIGERIAN_DRIVERS_POOL[0];

  const distanceKm = calculateDistanceKm(
    pickup.latitude,
    pickup.longitude,
    destination.latitude,
    destination.longitude
  );

  // Initial driver location offset (approaching pickup)
  const driverLat = pickup.latitude + (Math.random() * 0.008 - 0.004);
  const driverLng = pickup.longitude + (Math.random() * 0.008 - 0.004);

  // 4-digit Secure Ride PIN
  const ridePin = String(Math.floor(1000 + Math.random() * 9000));

  const activeTrip: ActiveTrip = {
    id: 'trip_' + Date.now().toString().slice(-6),
    status: 'driver_assigned',
    driver: {
      id: matchingDriver.id,
      first_name: matchingDriver.first_name,
      last_name: matchingDriver.last_name,
      title: matchingDriver.title,
      profile_image_url: matchingDriver.profile_image_url,
      car_image_url: matchingDriver.car_image_url,
      car_seats: matchingDriver.car_seats,
      rating: matchingDriver.rating,
      vehicle_type: vehicle.name,
      car_model: matchingDriver.car_model,
      car_color: matchingDriver.car_color,
      plate_number: matchingDriver.plate_number,
      phone: matchingDriver.phone,
    },
    driverLocation: {
      latitude: driverLat,
      longitude: driverLng,
    },
    pickup,
    destination,
    vehicle,
    fare: vehicle.price,
    etaMinutes: Math.max(2, Math.min(vehicle.etaMinutes, 6)),
    distanceKm,
    paymentMethod,
    paymentStatus: paymentMethod === 'cash' ? 'pending' : 'paid',
    startTime: new Date().toISOString(),
    ridePin,
    pickupInstructions: pickupInstructions || '',
  };

  return activeTrip;
};

// ==========================================================
// 4. DRIVER OPERATIONS & DISPATCH BACKEND SERVICE
// ==========================================================
export const DEFAULT_DRIVER_EARNINGS = {
  today: 38500, // ₦38,500
  thisWeek: 184200, // ₦184,200
  thisMonth: 642000, // ₦642,000
  availableBalance: 46800, // ₦46,800
  pendingEarnings: 12500, // ₦12,500
  completedTrips: 8,
  commission: 5775, // 15% Broader commission
  commissionDeducted: 5775,
  bonuses: 3500, // Peak hour incentive
  bonusesEarned: 3500,
};

// Sample incoming driver requests pool
export const SAMPLE_INCOMING_DRIVER_REQUESTS = [
  {
    id: 'req_lag_891',
    pickup: '12 Adeola Odeku St, Victoria Island',
    destination: 'Murtala Muhammed Int’l Airport (LOS), Terminal 2',
    distanceKm: 24.8,
    estimatedEarnings: 9800,
    vehicleType: 'Broader Go (Car)',
    customerName: 'Oluwaseun Bakare',
    customerRating: 4.95,
    customerImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    estimatedMinutes: 38,
    expiresInSeconds: 15,
  },
  {
    id: 'req_lag_892',
    pickup: 'Admiralty Way, Lekki Phase 1',
    destination: 'Eko Hotels & Suites, Plot 1415 Adetokunbo Ademola St',
    distanceKm: 9.4,
    estimatedEarnings: 4200,
    vehicleType: 'Broader Executive (SUV)',
    customerName: 'Fatima Dangote',
    customerRating: 4.88,
    customerImage: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80',
    estimatedMinutes: 18,
    expiresInSeconds: 15,
  },
  {
    id: 'req_lag_893',
    pickup: 'Ikeja City Mall, Alausa Secretariat',
    destination: 'Maryland Mall, Ikorodu Road',
    distanceKm: 6.2,
    estimatedEarnings: 2900,
    vehicleType: 'Broader Go (Car)',
    customerName: 'Emeka Eze',
    customerRating: 4.92,
    customerImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
    estimatedMinutes: 14,
    expiresInSeconds: 15,
  },
];

// Driver payout withdraw simulation
export const processDriverWithdrawal = async (
  amount: number,
  bankName: string,
  accountNumber: string,
  accountName: string
): Promise<{ success: boolean; message: string; ref: string }> => {
  await new Promise((r) => setTimeout(r, 600));
  const ref = 'PAY_BROADER_' + Math.floor(100000 + Math.random() * 900000);
  return {
    success: true,
    message: `₦${amount.toLocaleString()} paid out successfully to ${accountName} (${bankName} - ${accountNumber})`,
    ref,
  };
};

// ==========================================================
// 6. BECOME A DRIVER REGISTRATION BACKEND
// ==========================================================
const DRIVER_APP_STORAGE_KEY = 'broader_driver_application';

export const getSavedDriverApplication = () => {
  try {
    const raw = localStorage.getItem(DRIVER_APP_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    // fallback
  }
  return null;
};

export const saveDriverApplication = (data: any) => {
  try {
    localStorage.setItem(DRIVER_APP_STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    // fallback
  }
};

// ==========================================================
// 7. RENTAL VEHICLES CATALOG & BOOKING BACKEND
// ==========================================================
export const BROADER_RENTAL_FLEET = [
  {
    id: 'rent_01',
    name: 'Toyota Prado TXL Luxury 4WD',
    category: 'suv' as const,
    brand: 'Toyota',
    model: 'Prado TXL',
    year: 2023,
    dailyPrice: 65000,
    hourlyPrice: 8500,
    seats: 7,
    transmission: 'Automatic' as const,
    fuelType: 'Petrol' as const,
    hasAC: true,
    luggageCapacity: 5,
    imageUrl: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=600&auto=format&fit=crop&q=80',
    rating: 4.96,
    tripsCount: 142,
    pickupHub: 'Victoria Island Executive Hub',
    isAvailable: true,
    features: ['Leather Seats', 'Chauffeur Option', 'Tinted Windows', 'Comprehensive Insurance', 'GPS Navigation'],
  },
  {
    id: 'rent_02',
    name: 'Mercedes-Benz E300 AMG Executive',
    category: 'luxury' as const,
    brand: 'Mercedes-Benz',
    model: 'E300 AMG',
    year: 2022,
    dailyPrice: 95000,
    hourlyPrice: 12000,
    seats: 5,
    transmission: 'Automatic' as const,
    fuelType: 'Petrol' as const,
    hasAC: true,
    luggageCapacity: 3,
    imageUrl: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=600&auto=format&fit=crop&q=80',
    rating: 4.98,
    tripsCount: 89,
    pickupHub: 'Eko Hotels / VI Hub',
    isAvailable: true,
    features: ['Panoramic Sunroof', 'Burmester Sound', 'Airport Fast-Track', 'VIP Chauffeur'],
  },
  {
    id: 'rent_03',
    name: 'Toyota Camry XLE Sedan',
    category: 'sedan' as const,
    brand: 'Toyota',
    model: 'Camry XLE',
    year: 2022,
    dailyPrice: 32000,
    hourlyPrice: 4200,
    seats: 5,
    transmission: 'Automatic' as const,
    fuelType: 'Petrol' as const,
    hasAC: true,
    luggageCapacity: 3,
    imageUrl: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=600&auto=format&fit=crop&q=80',
    rating: 4.88,
    tripsCount: 215,
    pickupHub: 'Ikeja Commercial Hub',
    isAvailable: true,
    features: ['Cruise Control', 'Bluetooth Media', 'Low Fuel Consumption', 'Airbags'],
  },
  {
    id: 'rent_04',
    name: 'Toyota HiAce High Roof Bus',
    category: 'van' as const,
    brand: 'Toyota',
    model: 'HiAce High Roof',
    year: 2021,
    dailyPrice: 55000,
    hourlyPrice: 7000,
    seats: 14,
    transmission: 'Manual' as const,
    fuelType: 'Diesel' as const,
    hasAC: true,
    luggageCapacity: 10,
    imageUrl: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=600&auto=format&fit=crop&q=80',
    rating: 4.84,
    tripsCount: 167,
    pickupHub: 'Murtala Muhammed Airport Hub',
    isAvailable: true,
    features: ['Dual AC System', 'Luggage Compartment', 'Interstate Permitted', 'Experienced Group Driver'],
  },
  {
    id: 'rent_05',
    name: 'Toyota Hilux 4x4 Double Cabin Hauler',
    category: 'commercial' as const,
    brand: 'Toyota',
    model: 'Hilux Revo',
    year: 2023,
    dailyPrice: 70000,
    hourlyPrice: 9000,
    seats: 5,
    transmission: 'Automatic' as const,
    fuelType: 'Diesel' as const,
    hasAC: true,
    luggageCapacity: 8,
    imageUrl: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=600&auto=format&fit=crop&q=80',
    rating: 4.92,
    tripsCount: 104,
    pickupHub: 'Lekki Phase 1 Logistics Hub',
    isAvailable: true,
    features: ['Heavy Towing Bed', 'High Ground Clearance', 'All-Terrain 4WD', 'Roll Bar Protection'],
  },
];

export const RENTAL_VEHICLE_FLEET = BROADER_RENTAL_FLEET.map((vehicle) => ({
  ...vehicle,
  image: vehicle.imageUrl,
  fuelPolicy: 'Same to Same (Full-to-Full)',
  dailyRate: vehicle.dailyPrice,
  type: vehicle.category,
}));

// ==========================================================
// 8. PARCEL DELIVERY PRICING & LOGISTICS BACKEND
// ==========================================================
export const calculateParcelPrice = (
  distanceOrKm: number,
  sizeOrWeight: 'small' | 'medium' | 'large' | 'extra_large' | number,
  categoryOrExpress?: string | boolean
): number => {
  if (typeof sizeOrWeight === 'number') {
    const base = 1200;
    const kmRate = 120;
    const weightRate = 250;
    const expressMult = categoryOrExpress === true ? 1.4 : 1.0;
    const calc = (base + distanceOrKm * kmRate + sizeOrWeight * weightRate) * expressMult;
    return Math.round(Math.max(1200, calc) / 50) * 50;
  }

  const sizeRates = {
    small: { base: 850, perKm: 90 },
    medium: { base: 1400, perKm: 140 },
    large: { base: 2600, perKm: 220 },
    extra_large: { base: 4500, perKm: 350 },
  };
  const rate = sizeRates[sizeOrWeight] || sizeRates.small;
  const fragileMultiplier = categoryOrExpress === 'fragile' ? 1.25 : 1.0;
  const calculated = (rate.base + distanceOrKm * rate.perKm) * fragileMultiplier;
  return Math.round(Math.max(1000, calculated) / 50) * 50;
};

// ==========================================================
// 9. FREIGHT COMMERCIAL TRANSPORTATION PRICING BACKEND
// ==========================================================
export const calculateFreightPrice = (
  arg1: number,
  arg2: 'pickup' | 'van' | 'lorry' | 'heavy_truck' | number,
  arg3?: number | string
): number => {
  if (typeof arg2 === 'number') {
    // Called as: calculateFreightPrice(weightTons, distanceKm, truckTypeString)
    const weightTons = arg1;
    const distanceKm = arg2;
    const truckTypeStr = typeof arg3 === 'string' ? arg3.toLowerCase() : '';
    let base = 25000;
    let perKm = 900;
    if (truckTypeStr.includes('heavy') || truckTypeStr.includes('30-ton')) {
      base = 65000;
      perKm = 2400;
    } else if (truckTypeStr.includes('box') || truckTypeStr.includes('5-ton')) {
      base = 35000;
      perKm = 1300;
    } else if (truckTypeStr.includes('van') || truckTypeStr.includes('3-ton')) {
      base = 20000;
      perKm = 850;
    } else if (truckTypeStr.includes('1-ton') || truckTypeStr.includes('pickup')) {
      base = 12000;
      perKm = 500;
    }
    const total = base + distanceKm * perKm + weightTons * 2500;
    return Math.round(total / 100) * 100;
  }

  const distanceKm = arg1;
  const vehicleType = arg2;
  const cargoWeightKg = typeof arg3 === 'number' ? arg3 : 1000;
  const freightConfig = {
    pickup: { base: 9500, perKm: 450, capacityKg: 1000 },
    van: { base: 14000, perKm: 600, capacityKg: 1800 },
    lorry: { base: 26000, perKm: 1100, capacityKg: 4500 },
    heavy_truck: { base: 55000, perKm: 2200, capacityKg: 15000 },
  };

  const cfg = freightConfig[vehicleType] || freightConfig.pickup;
  const weightFactor = Math.max(1, cargoWeightKg / cfg.capacityKg);
  const total = cfg.base + distanceKm * cfg.perKm * weightFactor;
  return Math.round(Math.max(cfg.base, total) / 100) * 100;
};

// ==========================================================
// 10. AMBULANCE HOSPITALS & EMERGENCY BACKEND
// ==========================================================
export const LAGOS_EMERGENCY_HOSPITALS = [
  {
    id: 'hosp_01',
    name: 'Lagos University Teaching Hospital (LUTH)',
    zone: 'Idi-Araba / Surulere',
    latitude: 6.5167,
    longitude: 3.3556,
    emergencyHotline: '+234 1 897 4521',
    icuAvailable: true,
  },
  {
    id: 'hosp_02',
    name: 'Reddington Hospital Victoria Island',
    zone: 'Victoria Island (Sanusi Fafunwa St)',
    latitude: 6.4312,
    longitude: 3.4245,
    emergencyHotline: '+234 1 271 5340',
    icuAvailable: true,
  },
  {
    id: 'hosp_03',
    name: 'First Cardiology Consultants Ikoyi',
    zone: 'Ikoyi (Thompson Ave)',
    latitude: 6.4523,
    longitude: 3.4412,
    emergencyHotline: '+234 1 291 0022',
    icuAvailable: true,
  },
  {
    id: 'hosp_04',
    name: 'Lagoon Hospital Ikeja',
    zone: 'Ikeja GRA (Marine Road)',
    latitude: 6.5898,
    longitude: 3.3567,
    emergencyHotline: '+234 1 448 3000',
    icuAvailable: true,
  },
  {
    id: 'hosp_05',
    name: 'Lagos Island General Hospital',
    zone: 'Broad Street, Lagos Marina',
    latitude: 6.4529,
    longitude: 3.3934,
    emergencyHotline: '+234 1 263 2191',
    icuAvailable: true,
  },
];

export const AMBULANCE_TYPES_DATA = [
  {
    type: 'bls' as const,
    title: 'Basic Life Support (BLS)',
    description: 'First responder EMTs, Oxygen delivery, Vital monitors, Stretchers & First Aid',
    baseFee: 15000,
    etaMinutes: 6,
    icon: 'Ambulance',
  },
  {
    type: 'als' as const,
    title: 'Advanced Life Support (ALS)',
    description: 'Paramedics, ECG defibrillators, IV fluid therapy, Cardiac monitoring, Airway kits',
    baseFee: 28000,
    etaMinutes: 8,
    icon: 'HeartPulse',
  },
  {
    type: 'icu' as const,
    title: 'Mobile Intensive Care Unit (ICU)',
    description: 'Specialist emergency physician, Mechanical ventilator, Defibrillator, Advanced meds',
    baseFee: 45000,
    etaMinutes: 10,
    icon: 'ShieldAlert',
  },
];
