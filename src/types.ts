export type VehicleCategory =
  | 'bicycle'
  | 'motorcycle'
  | 'tricycle'
  | 'car'
  | 'suv'
  | 'van'
  | 'bus'
  | 'pickup'
  | 'lorry'
  | 'freight'
  | 'ambulance';

export interface VehicleOption {
  id: string;
  name: string;
  category: VehicleCategory;
  capacity: string;
  etaMinutes: number;
  price: number; // in Naira (₦)
  description: string;
  iconName?: string;
  icon?: string;
  time?: number;
}

export interface Driver {
  id: number;
  first_name: string;
  last_name: string;
  title?: string;
  profile_image_url: string;
  car_image_url?: string;
  car_seats: number;
  rating: number;
  vehicle_type?: string;
  car_model?: string;
  car_color?: string;
  plate_number?: string;
  phone?: string;
}

export interface MarkerData {
  latitude: number;
  longitude: number;
  id: number;
  title: string;
  profile_image_url: string;
  car_image_url: string;
  car_seats: number;
  rating: number;
  first_name: string;
  last_name: string;
  time?: number;
  price?: string;
  plate_number?: string;
  car_model?: string;
  car_color?: string;
  phone?: string;
}

export type RideStatus =
  | 'idle'
  | 'searching'
  | 'driver_assigned'
  | 'driver_arriving'
  | 'driver_arrived'
  | 'ride_started'
  | 'ride_completed'
  | 'cancelled';

export interface ActiveTrip {
  id: string;
  status: RideStatus;
  driver: Driver;
  driverLocation: { latitude: number; longitude: number };
  pickup: { address: string; latitude: number; longitude: number };
  destination: { address: string; latitude: number; longitude: number };
  vehicle: VehicleOption;
  fare: number;
  etaMinutes: number;
  distanceKm: number;
  paymentMethod: 'wallet' | 'card' | 'cash';
  paymentStatus: 'paid' | 'pending';
  startTime: string;
  ridePin?: string;
  pickupInstructions?: string;
  isScheduled?: boolean;
  scheduledTime?: string;
}

export interface WalletTransaction {
  id: string;
  type: 'topup' | 'ride_payment' | 'refund';
  amount: number; // in ₦
  title: string;
  description: string;
  date: string;
  status: 'completed' | 'pending' | 'failed';
  rideId?: string;
}

export interface Ride {
  ride_id?: string | number;
  origin_address: string;
  destination_address: string;
  origin_latitude: number;
  origin_longitude: number;
  destination_latitude: number;
  destination_longitude: number;
  ride_time: number; // in minutes
  fare_price: number; // in Naira (₦)
  payment_status: 'paid' | 'pending' | 'failed';
  payment_method?: 'wallet' | 'card' | 'cash';
  driver_id: number;
  user_id: string;
  created_at: string;
  vehicle_type?: string;
  driver: {
    first_name: string;
    last_name: string;
    car_seats: number;
    profile_image_url?: string;
    rating?: number;
    plate_number?: string;
    car_model?: string;
  };
}

export interface UserProfile {
  id: string;
  fullName: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  imageUrl: string;
  city?: string;
  country?: string;
  name?: string;
  walletBalance?: number;
}

export type ScreenType =
  | 'welcome'
  | 'sign-in'
  | 'sign-up'
  | 'home'
  | 'rides'
  | 'chat'
  | 'profile'
  | 'find-ride'
  | 'confirm-ride'
  | 'book-ride'
  | 'wallet'
  | 'rental'
  | 'parcel'
  | 'freight'
  | 'ambulance'
  | 'become-driver'
  | 'driver-home'
  | 'driver-earnings';

export type ServiceType = 'ride' | 'rental' | 'parcel' | 'freight' | 'ambulance';

export type ActivityTab = 'ongoing' | 'scheduled' | 'completed' | 'cancelled';

export interface SavedLocation {
  id: string;
  type: 'home' | 'work' | 'other';
  title: string;
  address: string;
  latitude: number;
  longitude: number;
}

export interface RecentDestination {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  etaMinutes?: number;
}

// 4. Driver Experience Types
export type DriverStatus = 'online' | 'offline' | 'on_trip';

export interface DriverRequest {
  id: string;
  pickup: string;
  destination: string;
  distanceKm: number;
  estimatedEarnings: number; // in ₦
  vehicleType: string;
  customerName: string;
  customerRating: number;
  customerImage?: string;
  estimatedMinutes: number;
  expiresInSeconds: number;
  pickupInstructions?: string;
  ridePin?: string;
}

export interface DriverEarnings {
  today: number;
  thisWeek: number;
  thisMonth: number;
  availableBalance: number;
  pendingEarnings: number;
  completedTrips: number;
  commission: number; // e.g. 15%
  commissionDeducted: number;
  bonuses: number;
  bonusesEarned: number;
}

export interface DriverVehicle {
  id: string;
  name: string;
  category: VehicleCategory;
  categoryName: string;
  plateNumber: string;
  color: string;
  year: number;
  seats: number;
  isVerified: boolean;
  isActive: boolean;
}

export interface DriverTripRecord {
  id: string;
  passengerName: string;
  passengerRating: number;
  passengerImage?: string;
  pickup: string;
  destination: string;
  distanceKm: number;
  durationMinutes: number;
  fare: number;
  commission: number;
  netEarnings: number;
  tip: number;
  status: 'completed' | 'cancelled' | 'upcoming';
  timestamp: string;
  serviceType: ServiceType;
  vehiclePlate: string;
}

// 6. Become a Driver Types
export type DriverApplicationStatus =
  | 'not_submitted'
  | 'draft'
  | 'pending_review'
  | 'pending'
  | 'approved'
  | 'rejected'
  | 'requires_correction';

export interface DriverApplicationData {
  id?: string;
  applicantName?: string;
  fullName: string;
  phone: string;
  email?: string;
  address?: string;
  residentialAddress?: string;
  city?: string;
  state?: string;
  licenseNumber?: string;
  driversLicenseNumber?: string;
  licenseExpiry?: string;
  ninNumber?: string;
  vehicleCategory?: VehicleCategory;
  vehicleType?: string;
  vehicleMake?: string;
  vehicleModel?: string;
  vehicleYear?: string;
  plateNumber: string;
  vehicleColor?: string;
  driverPhotoUrl?: string;
  licensePhotoUrl?: string;
  vehiclePhotoUrl?: string;
  roadworthinessUrl?: string;
  status: DriverApplicationStatus;
  submissionDate?: string;
  submittedAt?: string;
  reviewedAt?: string;
  reviewNotes?: string;
  documentsUploaded?: string[];
}

// 7. Rental Functionality Types
export interface RentalVehicle {
  id: string;
  name: string;
  category: 'sedan' | 'suv' | 'luxury' | 'van' | 'commercial';
  brand: string;
  model: string;
  year: number;
  dailyPrice: number; // in ₦
  dailyRate?: number; // in ₦
  type?: string;
  hourlyPrice: number; // in ₦
  seats: number;
  transmission: 'Automatic' | 'Manual';
  fuelType: 'Petrol' | 'Diesel' | 'Hybrid';
  hasAC: boolean;
  luggageCapacity: number;
  imageUrl: string;
  image?: string;
  fuelPolicy?: string;
  rating: number;
  tripsCount: number;
  pickupHub: string;
  isAvailable: boolean;
  features: string[];
}

export interface RentalBooking {
  id: string;
  vehicleId?: string;
  vehicle?: RentalVehicle;
  vehicleModel?: string;
  vehicleType?: string;
  startDate?: string;
  endDate?: string;
  pickupDate?: string;
  returnDate?: string;
  durationDays?: number;
  pickupLocation: string;
  withDriver?: boolean;
  totalPrice?: number;
  totalFare?: number;
  depositAmount?: number;
  paymentMethod?: 'wallet' | 'card' | 'cash';
  paymentStatus?: 'paid' | 'pending';
  bookingStatus?: 'confirmed' | 'active' | 'completed' | 'cancelled';
  status?: string;
  createdAt?: string;
}

// 8. Parcel Delivery Types
export type PackageCategory = 'documents' | 'electronics' | 'clothing' | 'food' | 'fragile' | 'other';
export type PackageSize = 'small' | 'medium' | 'large' | 'extra_large';

export interface ParcelDelivery {
  id: string;
  senderName: string;
  senderPhone: string;
  pickupAddress: string;
  receiverName?: string;
  recipientName?: string;
  receiverPhone?: string;
  recipientPhone?: string;
  dropoffAddress?: string;
  deliveryAddress?: string;
  packageType: PackageCategory | string;
  packageSize?: PackageSize;
  weightKg: number;
  isExpress?: boolean;
  instructions?: string;
  deliveryFee?: number;
  fare?: number;
  paymentMethod?: 'wallet' | 'card' | 'cash';
  paymentStatus?: 'paid' | 'pending';
  status: 'order_placed' | 'courier_assigned' | 'in_transit' | 'delivered' | 'cancelled' | string;
  courierName?: string;
  courierPhone?: string;
  courierVehicle?: string;
  courier?: {
    name: string;
    phone: string;
    vehiclePlate: string;
  };
  createdAt?: string;
  createdDate?: string;
  estimatedDeliveryTime?: string;
}

// 9. Freight / Commercial Transportation Types
export type CargoCategory = 'palletized' | 'building_materials' | 'machinery' | 'fmcg' | 'furniture_moving' | 'general';
export type FreightVehicleType = 'pickup' | 'van' | 'lorry' | 'heavy_truck';

export interface FreightShipment {
  id: string;
  cargoType: CargoCategory | string;
  cargoWeightKg?: number;
  weightTons?: number;
  dimensions?: { length: number; width: number; height: number };
  pickupAddress?: string;
  origin?: string;
  destinationAddress?: string;
  destination?: string;
  vehicleType?: FreightVehicleType | string;
  truckType?: string;
  loadingInstructions?: string;
  requiresForklift?: boolean;
  requiresHelpers?: boolean;
  totalFreightCost?: number;
  estimatedPrice?: number;
  paymentMethod?: 'wallet' | 'card' | 'cash';
  paymentStatus?: 'paid' | 'pending';
  status: 'booked' | 'assigned' | 'loading' | 'in_transit' | 'delivered' | 'cancelled' | 'scheduled' | string;
  driverName?: string;
  driverPhone?: string;
  plateNumber?: string;
  driverInfo?: {
    name: string;
    phone: string;
    plateNumber: string;
  };
  scheduledDate?: string;
  createdAt?: string;
}

// 10. Ambulance Emergency Types
export type AmbulanceType = 'bls' | 'als' | 'icu';

export interface AmbulanceBooking {
  id: string;
  patientName?: string;
  patientAge?: string;
  patientCondition?: string;
  conditionDescription?: string;
  ambulanceType: AmbulanceType | string;
  pickupAddress?: string;
  pickupLocation?: string;
  destinationHospital: string;
  callerPhone?: string;
  priorityLevel?: 'immediate' | 'urgent';
  fee?: number;
  cost?: number;
  status: 'dispatched' | 'en_route_pickup' | 'on_scene' | 'transporting' | 'arrived_hospital' | string;
  unitNumber?: string;
  paramedicTeam?: string;
  paramedicName?: string;
  paramedicContact?: string;
  paramedicPhone?: string;
  vehiclePlate?: string;
  createdAt?: string;
  etaMinutes: number;
}

