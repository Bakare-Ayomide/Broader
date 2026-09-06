import {
  INITIAL_DRIVERS,
  INITIAL_RIDES,
  INITIAL_USER,
  SAVED_LOCATIONS,
  RECENT_DESTINATIONS,
  INITIAL_WALLET_TRANSACTIONS,
  LAGOS_COORDS,
} from '../data/mockData';
import {
  Driver,
  MarkerData,
  Ride,
  ScreenType,
  UserProfile,
  ServiceType,
  SavedLocation,
  RecentDestination,
  VehicleCategory,
  VehicleOption,
  RideStatus,
  ActiveTrip,
  WalletTransaction,
  DriverStatus,
  DriverRequest,
  DriverEarnings,
  DriverApplicationData,
  RentalBooking,
  ParcelDelivery,
  FreightShipment,
  AmbulanceBooking,
} from '../types';
import {
  DEFAULT_DRIVER_EARNINGS,
  SAMPLE_INCOMING_DRIVER_REQUESTS,
  BROADER_RENTAL_FLEET,
} from '../services/backendService';

interface Message {
  id: string;
  sender: 'user' | 'driver' | 'support';
  text: string;
  timestamp: string;
}

export interface BroaderStoreState {
  // Navigation & Auth
  currentScreen: ScreenType;
  isSignedIn: boolean;
  user: UserProfile;
  setScreen: (screen: ScreenType) => void;
  setSignedIn: (signedIn: boolean) => void;
  signOut: () => void;

  // Active Service (Ride, Rental, Parcel, Freight, Ambulance)
  activeService: ServiceType;
  setActiveService: (service: ServiceType) => void;

  // Location Store
  userLatitude: number;
  userLongitude: number;
  userAddress: string;
  destinationLatitude: number | null;
  destinationLongitude: number | null;
  destinationAddress: string | null;
  setUserLocation: (loc: { latitude: number; longitude: number; address: string }) => void;
  setDestinationLocation: (loc: { latitude: number; longitude: number; address: string }) => void;
  resetToCurrentLocation: () => void;

  // Saved & Recent Locations
  savedLocations: SavedLocation[];
  recentDestinations: RecentDestination[];
  addRecentDestination: (dest: RecentDestination) => void;

  // Vehicles Selection
  selectedVehicle: VehicleCategory;
  setSelectedVehicle: (category: VehicleCategory) => void;
  vehicleOptions: VehicleOption[];
  setVehicleOptions: (options: VehicleOption[]) => void;

  // Driver Store
  drivers: MarkerData[];
  selectedDriver: number | null;
  setSelectedDriver: (driverId: number) => void;
  setDrivers: (drivers: MarkerData[]) => void;
  clearSelectedDriver: () => void;

  // Payment Selection
  selectedPaymentMethod: 'wallet' | 'card' | 'cash';
  setSelectedPaymentMethod: (method: 'wallet' | 'card' | 'cash') => void;

  // Wallet Management
  walletBalance: number; // in Naira (₦)
  walletTransactions: WalletTransaction[];
  topUpWallet: (amount: number, methodTitle?: string) => void;
  deductWalletPayment: (amount: number, description: string, rideId?: string) => boolean;

  // Ride & Trip State Machine (Searching, Assigned, Arriving, Arrived, Started, Completed)
  rideStatus: RideStatus;
  setRideStatus: (status: RideStatus) => void;
  activeTrip: ActiveTrip | null;
  setActiveTrip: (trip: ActiveTrip | null) => void;
  driverPosition: { latitude: number; longitude: number };
  setDriverPosition: (pos: { latitude: number; longitude: number }) => void;
  cancelActiveTrip: () => void;
  completeActiveTrip: () => void;

  // Rides History
  rides: Ride[];
  scheduledRides: Ride[];
  cancelledRides: Ride[];
  addRide: (ride: Ride) => void;
  addScheduledRide: (ride: Ride) => void;
  addCancelledRide: (ride: Ride) => void;

  // 4. Driver Mode & Experience
  isDriverMode: boolean;
  setIsDriverMode: (enabled: boolean) => void;
  driverStatus: DriverStatus;
  setDriverStatus: (status: DriverStatus) => void;
  driverEarnings: DriverEarnings;
  incomingDriverRequest: DriverRequest | null;
  setIncomingDriverRequest: (req: DriverRequest | null) => void;
  respondToDriverRequest: (accept: boolean) => void;
  withdrawDriverEarnings: (amount: number, bankName: string, accountNum: string, accountName: string) => Promise<boolean>;

  // 6. Become a Driver Application
  driverApplication: DriverApplicationData;
  updateDriverApplication: (data: Partial<DriverApplicationData>) => void;
  submitDriverApplication: () => void;
  simulateAdminApproveDriver: () => void;

  // 7. Vehicle Rental State
  rentals: RentalBooking[];
  addRentalBooking: (booking: RentalBooking) => void;

  // 8. Parcel Delivery State
  parcels: ParcelDelivery[];
  addParcelDelivery: (parcel: ParcelDelivery) => void;

  // 9. Freight / Commercial Cargo State
  freightShipments: FreightShipment[];
  addFreightShipment: (shipment: FreightShipment) => void;

  // 10. Ambulance Emergency Dispatch State
  ambulanceBookings: AmbulanceBooking[];
  addAmbulanceBooking: (booking: AmbulanceBooking) => void;

  // In-app Messages
  messages: Message[];
  addMessage: (text: string, sender?: 'user' | 'driver' | 'support') => void;
}

const generateInitialMarkers = (userLat: number, userLng: number, drivers: Driver[]): MarkerData[] => {
  const offsets = [
    { lat: 0.0035, lng: -0.0028, time: 3, price: '2,800' },
    { lat: -0.0029, lng: 0.0042, time: 5, price: '3,200' },
    { lat: 0.0048, lng: 0.0035, time: 7, price: '1,100' },
    { lat: -0.0042, lng: -0.0038, time: 8, price: '5,500' },
  ];

  return drivers.map((driver, idx) => {
    const off = offsets[idx % offsets.length];
    return {
      id: driver.id,
      latitude: userLat + off.lat,
      longitude: userLng + off.lng,
      title: `${driver.first_name} ${driver.last_name}`,
      profile_image_url: driver.profile_image_url,
      car_image_url: driver.car_image_url,
      car_seats: driver.car_seats,
      rating: driver.rating,
      first_name: driver.first_name,
      last_name: driver.last_name,
      time: off.time,
      price: off.price,
      plate_number: driver.plate_number,
      car_model: driver.car_model,
      car_color: driver.car_color,
      phone: driver.phone,
    };
  });
};

const initialUserLat = LAGOS_COORDS.latitude;
const initialUserLng = LAGOS_COORDS.longitude;
const initialDrivers = generateInitialMarkers(initialUserLat, initialUserLng, INITIAL_DRIVERS);

let state: BroaderStoreState = {
  currentScreen: 'welcome',
  isSignedIn: true,
  user: INITIAL_USER,
  setScreen: (screen) => setState({ currentScreen: screen }),
  setSignedIn: (signedIn) => setState({ isSignedIn: signedIn }),
  signOut: () => setState({ isSignedIn: false, currentScreen: 'sign-in' }),

  activeService: 'ride',
  setActiveService: (service) => setState({ activeService: service }),

  userLatitude: initialUserLat,
  userLongitude: initialUserLng,
  userAddress: LAGOS_COORDS.address,
  destinationLatitude: 6.5774,
  destinationLongitude: 3.3212,
  destinationAddress: "Murtala Muhammed Int'l Airport (LOS), Ikeja",
  setUserLocation: ({ latitude, longitude, address }) => {
    setState({
      userLatitude: latitude,
      userLongitude: longitude,
      userAddress: address,
      selectedDriver: null,
    });
  },
  setDestinationLocation: ({ latitude, longitude, address }) => {
    setState({
      destinationLatitude: latitude,
      destinationLongitude: longitude,
      destinationAddress: address,
      selectedDriver: null,
    });
  },
  resetToCurrentLocation: () => {
    setState({
      userLatitude: initialUserLat,
      userLongitude: initialUserLng,
      userAddress: LAGOS_COORDS.address,
    });
  },

  savedLocations: SAVED_LOCATIONS,
  recentDestinations: RECENT_DESTINATIONS,
  addRecentDestination: (dest) => {
    const filtered = state.recentDestinations.filter(
      (d) => d.name.toLowerCase() !== dest.name.toLowerCase()
    );
    setState({ recentDestinations: [dest, ...filtered].slice(0, 6) });
  },

  selectedVehicle: 'car',
  setSelectedVehicle: (category) => setState({ selectedVehicle: category }),
  vehicleOptions: [],
  setVehicleOptions: (options) => setState({ vehicleOptions: options }),

  drivers: initialDrivers,
  selectedDriver: 1,
  setSelectedDriver: (driverId) => setState({ selectedDriver: driverId }),
  setDrivers: (drivers) => setState({ drivers }),
  clearSelectedDriver: () => setState({ selectedDriver: null }),

  selectedPaymentMethod: 'wallet',
  setSelectedPaymentMethod: (method) => setState({ selectedPaymentMethod: method }),

  walletBalance: 45500, // ₦45,500
  walletTransactions: INITIAL_WALLET_TRANSACTIONS,
  topUpWallet: (amount: number, methodTitle: string = 'Card Payment') => {
    const newTx: WalletTransaction = {
      id: 'tx_topup_' + Date.now().toString().slice(-6),
      type: 'topup',
      amount,
      title: `Top-up via ${methodTitle}`,
      description: 'Credited directly to Broader Wallet',
      date: 'Just now',
      status: 'completed',
    };
    setState({
      walletBalance: state.walletBalance + amount,
      walletTransactions: [newTx, ...state.walletTransactions],
    });
  },
  deductWalletPayment: (amount: number, description: string, rideId?: string) => {
    if (state.walletBalance < amount) {
      return false; // insufficient funds
    }
    const newTx: WalletTransaction = {
      id: 'tx_deduct_' + Date.now().toString().slice(-6),
      type: 'ride_payment',
      amount,
      title: 'Broader Ride Payment',
      description,
      date: 'Just now',
      status: 'completed',
      rideId,
    };
    setState({
      walletBalance: state.walletBalance - amount,
      walletTransactions: [newTx, ...state.walletTransactions],
    });
    return true;
  },

  rideStatus: 'idle',
  setRideStatus: (status) => setState({ rideStatus: status }),
  activeTrip: null,
  setActiveTrip: (trip) => {
    if (trip) {
      setState({
        activeTrip: trip,
        rideStatus: trip.status,
        driverPosition: trip.driverLocation,
      });
    } else {
      setState({
        activeTrip: null,
        rideStatus: 'idle',
      });
    }
  },
  driverPosition: { latitude: initialUserLat + 0.004, longitude: initialUserLng - 0.003 },
  setDriverPosition: (pos) => setState({ driverPosition: pos }),
  cancelActiveTrip: () => {
    setState({
      rideStatus: 'idle',
      activeTrip: null,
    });
  },
  completeActiveTrip: () => {
    if (!state.activeTrip) return;
    const trip = state.activeTrip;

    // Deduct from wallet if wallet was payment method and not already deducted
    if (trip.paymentMethod === 'wallet') {
      state.deductWalletPayment(
        trip.fare,
        `Trip to ${trip.destination.address.split(',')[0]}`,
        trip.id
      );
    }

    // Add completed ride to history
    const completedRide: Ride = {
      ride_id: trip.id,
      origin_address: trip.pickup.address,
      destination_address: trip.destination.address,
      origin_latitude: trip.pickup.latitude,
      origin_longitude: trip.pickup.longitude,
      destination_latitude: trip.destination.latitude,
      destination_longitude: trip.destination.longitude,
      ride_time: trip.etaMinutes || 20,
      fare_price: trip.fare,
      payment_status: 'paid',
      payment_method: trip.paymentMethod,
      driver_id: trip.driver.id,
      user_id: state.user.id,
      created_at: new Date().toISOString(),
      vehicle_type: trip.vehicle.name,
      driver: {
        first_name: trip.driver.first_name,
        last_name: trip.driver.last_name,
        car_seats: trip.driver.car_seats,
        profile_image_url: trip.driver.profile_image_url,
        rating: trip.driver.rating,
        plate_number: trip.driver.plate_number,
        car_model: trip.driver.car_model,
      },
    };

    setState({
      rides: [completedRide, ...state.rides],
      rideStatus: 'ride_completed',
      activeTrip: {
        ...trip,
        status: 'ride_completed',
        paymentStatus: 'paid',
      },
    });
  },

  rides: INITIAL_RIDES,
  scheduledRides: [
    {
      ride_id: 'sch_991',
      origin_address: '14 Adeola Odeku St, Victoria Island',
      destination_address: 'Murtala Muhammed Int’l Airport (LOS), Ikeja',
      origin_latitude: 6.4281,
      origin_longitude: 3.4219,
      destination_latitude: 6.5774,
      destination_longitude: 3.3212,
      ride_time: 42,
      fare_price: 6500,
      payment_status: 'paid',
      payment_method: 'wallet',
      driver_id: 102,
      user_id: 'usr_broader_ng_101',
      created_at: new Date(Date.now() + 86400000).toISOString(),
      vehicle_type: 'Broader Executive (SUV)',
      driver: {
        first_name: 'Chinedu',
        last_name: 'Okafor',
        car_seats: 6,
        profile_image_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=160&auto=format&fit=crop&q=80',
        rating: 4.88,
        plate_number: 'KJA-819-LK',
        car_model: 'Toyota Prado TXL',
      },
    },
  ],
  cancelledRides: [
    {
      ride_id: 'can_402',
      origin_address: 'Admiralty Way, Lekki Phase 1',
      destination_address: 'Silverbird Galleria, Ahmadu Bello Way, VI',
      origin_latitude: 6.4474,
      origin_longitude: 3.4723,
      destination_latitude: 6.4289,
      destination_longitude: 3.4112,
      ride_time: 18,
      fare_price: 2400,
      payment_status: 'failed',
      payment_method: 'card',
      driver_id: 101,
      user_id: 'usr_broader_ng_101',
      created_at: new Date(Date.now() - 172800000).toISOString(),
      vehicle_type: 'Broader Go (Car)',
      driver: {
        first_name: 'Babatunde',
        last_name: 'Adeleke',
        car_seats: 4,
        profile_image_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=160&auto=format&fit=crop&q=80',
        rating: 4.92,
        plate_number: 'EKY-428-AB',
        car_model: 'Toyota Corolla 2021',
      },
    },
  ],
  addRide: (ride) => setState({ rides: [ride, ...state.rides] }),
  addScheduledRide: (ride) => setState({ scheduledRides: [ride, ...state.scheduledRides] }),
  addCancelledRide: (ride) => setState({ cancelledRides: [ride, ...state.cancelledRides] }),

  // 4. Driver Mode & Experience
  isDriverMode: false,
  setIsDriverMode: (enabled) => {
    setState({
      isDriverMode: enabled,
      currentScreen: enabled ? 'driver-home' : 'home',
    });
  },
  driverStatus: 'online',
  setDriverStatus: (status) => setState({ driverStatus: status }),
  driverEarnings: DEFAULT_DRIVER_EARNINGS,
  incomingDriverRequest: SAMPLE_INCOMING_DRIVER_REQUESTS[0],
  setIncomingDriverRequest: (req) => setState({ incomingDriverRequest: req }),
  respondToDriverRequest: (accept) => {
    const currentReq = state.incomingDriverRequest;
    if (accept && currentReq) {
      setState({
        incomingDriverRequest: null,
        driverStatus: 'on_trip',
        driverEarnings: {
          ...state.driverEarnings,
          today: state.driverEarnings.today + currentReq.estimatedEarnings,
          availableBalance: state.driverEarnings.availableBalance + currentReq.estimatedEarnings,
          completedTrips: state.driverEarnings.completedTrips + 1,
        },
      });
    } else {
      setState({ incomingDriverRequest: null });
    }
  },
  withdrawDriverEarnings: async (amount, bankName, accountNum, accountName) => {
    if (amount <= 0 || amount > state.driverEarnings.availableBalance) {
      return false;
    }
    setState({
      driverEarnings: {
        ...state.driverEarnings,
        availableBalance: state.driverEarnings.availableBalance - amount,
      },
      walletTransactions: [
        {
          id: 'tx_drv_' + Date.now(),
          type: 'topup',
          amount,
          title: `Driver Payout to ${bankName}`,
          description: `Account: ${accountNum} (${accountName})`,
          date: 'Just now',
          status: 'completed',
        },
        ...state.walletTransactions,
      ],
    });
    return true;
  },

  // 6. Become a Driver Application
  driverApplication: {
    fullName: 'Chris Bakare',
    phone: '+234 803 456 7890',
    email: 'chrisbak.music@gmail.com',
    address: '14 Adeola Odeku St, Victoria Island, Lagos',
    licenseNumber: 'FRSC-LA-2022-88190',
    licenseExpiry: '2027-11-20',
    ninNumber: '92817264819',
    vehicleCategory: 'car',
    vehicleMake: 'Toyota',
    vehicleModel: 'Corolla',
    vehicleYear: '2021',
    plateNumber: 'LND-394-AK',
    vehicleColor: 'Black',
    status: 'approved', // Pre-approved for instant testing, user can also reset or edit
    submittedAt: new Date(Date.now() - 86400000).toISOString(),
    reviewedAt: new Date().toISOString(),
    reviewNotes: 'All credentials and vehicle inspection documents verified by Broader Lagos Operations.',
  },
  updateDriverApplication: (data) => {
    const updated = { ...state.driverApplication, ...data };
    setState({ driverApplication: updated });
    try {
      localStorage.setItem('broader_driver_app', JSON.stringify(updated));
    } catch (e) {}
  },
  submitDriverApplication: () => {
    const submitted: DriverApplicationData = {
      ...state.driverApplication,
      status: 'pending_review',
      submittedAt: new Date().toISOString(),
    };
    setState({ driverApplication: submitted });
    try {
      localStorage.setItem('broader_driver_app', JSON.stringify(submitted));
    } catch (e) {}
  },
  simulateAdminApproveDriver: () => {
    const approved: DriverApplicationData = {
      ...state.driverApplication,
      status: 'approved',
      reviewedAt: new Date().toISOString(),
      reviewNotes: 'Approved by Broader Lagos Safety & Operations Board.',
    };
    setState({ driverApplication: approved });
    try {
      localStorage.setItem('broader_driver_app', JSON.stringify(approved));
    } catch (e) {}
  },

  // 7. Vehicle Rental State
  rentals: [
    {
      id: 'rent_bk_101',
      vehicleId: 'rent_01',
      vehicle: BROADER_RENTAL_FLEET[0],
      startDate: new Date().toLocaleDateString('en-GB'),
      endDate: new Date(Date.now() + 86400000 * 3).toLocaleDateString('en-GB'),
      durationDays: 3,
      pickupLocation: 'Victoria Island Executive Hub',
      totalPrice: 195000,
      paymentMethod: 'wallet',
      paymentStatus: 'paid',
      bookingStatus: 'confirmed',
      createdAt: new Date().toISOString(),
    },
  ],
  addRentalBooking: (booking) => {
    setState({
      rentals: [booking, ...state.rentals],
      walletTransactions: [
        {
          id: 'tx_rent_' + Date.now(),
          type: 'ride_payment',
          amount: booking.totalPrice,
          title: `Broader Rental: ${booking.vehicle.name}`,
          description: `${booking.durationDays} Days • ${booking.pickupLocation}`,
          date: 'Just now',
          status: 'completed',
        },
        ...state.walletTransactions,
      ],
    });
  },

  // 8. Parcel Delivery State
  parcels: [
    {
      id: 'pkg_ng_5521',
      senderName: 'Chris Bakare',
      senderPhone: '+234 803 456 7890',
      pickupAddress: '14 Adeola Odeku St, Victoria Island',
      receiverName: 'Tunde Afolayan',
      receiverPhone: '+234 802 334 5566',
      dropoffAddress: 'Plot 12, Commercial Ave, Sabo, Yaba',
      packageType: 'electronics',
      packageSize: 'medium',
      weightKg: 2.5,
      instructions: 'Handle with care. Call receiver upon arrival at gate.',
      deliveryFee: 1850,
      paymentMethod: 'wallet',
      paymentStatus: 'paid',
      status: 'in_transit',
      courierName: 'Aminu Bello',
      courierPhone: '+234 814 556 7788',
      courierVehicle: 'Haojue Express 150cc (LND-512-XY)',
      createdAt: new Date().toISOString(),
      estimatedDeliveryTime: '25 mins',
    },
  ],
  addParcelDelivery: (parcel) => {
    setState({
      parcels: [parcel, ...state.parcels],
      walletTransactions: [
        {
          id: 'tx_pkg_' + Date.now(),
          type: 'ride_payment',
          amount: parcel.deliveryFee,
          title: `Broader Express Parcel (${parcel.packageType.toUpperCase()})`,
          description: `To: ${parcel.dropoffAddress.split(',')[0]}`,
          date: 'Just now',
          status: 'completed',
        },
        ...state.walletTransactions,
      ],
    });
  },

  // 9. Freight / Commercial Cargo State
  freightShipments: [
    {
      id: 'frt_ng_9011',
      cargoType: 'building_materials',
      cargoWeightKg: 1200,
      dimensions: { length: 2.4, width: 1.2, height: 1.5 },
      pickupAddress: 'Dangote Cement Depot, Apapa Port Express',
      destinationAddress: 'Construction Site, Lekki Phase 2, Lagos',
      vehicleType: 'van',
      loadingInstructions: 'Forklift on site for loading; requires 2 helpers at destination.',
      requiresForklift: true,
      requiresHelpers: true,
      totalFreightCost: 28500,
      paymentMethod: 'wallet',
      paymentStatus: 'paid',
      status: 'in_transit',
      driverName: 'Ibrahim Danjuma',
      driverPhone: '+234 809 112 8899',
      plateNumber: 'APP-921-XJ',
      createdAt: new Date().toISOString(),
    },
  ],
  addFreightShipment: (shipment) => {
    setState({
      freightShipments: [shipment, ...state.freightShipments],
      walletTransactions: [
        {
          id: 'tx_frt_' + Date.now(),
          type: 'ride_payment',
          amount: shipment.totalFreightCost,
          title: `Broader Freight: ${shipment.cargoType.replace('_', ' ').toUpperCase()}`,
          description: `Vehicle: ${shipment.vehicleType} • ${shipment.cargoWeightKg}kg`,
          date: 'Just now',
          status: 'completed',
        },
        ...state.walletTransactions,
      ],
    });
  },

  // 10. Ambulance Emergency Dispatch State
  ambulanceBookings: [],
  addAmbulanceBooking: (booking) => {
    setState({
      ambulanceBookings: [booking, ...state.ambulanceBookings],
      walletTransactions: [
        {
          id: 'tx_amb_' + Date.now(),
          type: 'ride_payment',
          amount: booking.fee,
          title: `Emergency Medical Dispatch (${booking.ambulanceType.toUpperCase()})`,
          description: `To: ${booking.destinationHospital}`,
          date: 'Just now',
          status: 'completed',
        },
        ...state.walletTransactions,
      ],
    });
  },

  messages: [
    {
      id: 'm1',
      sender: 'support',
      text: 'Welcome to Broader Nigeria! Need help with your ride or route?',
      timestamp: '10:00 AM',
    },
    {
      id: 'm2',
      sender: 'driver',
      text: "Hello! I'm Babatunde Adeleke, your Broader driver. I'm on my way in a Silver Toyota Corolla.",
      timestamp: '10:14 AM',
    },
  ],
  addMessage: (text, sender = 'user') => {
    const newMsg: Message = {
      id: 'msg_' + Date.now(),
      sender,
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setState({ messages: [...state.messages, newMsg] });
  },
};

const listeners = new Set<() => void>();

function setState(partial: Partial<BroaderStoreState>) {
  state = { ...state, ...partial };
  listeners.forEach((l) => l());
}

import { useSyncExternalStore } from 'react';

export function useBroaderStore<T>(selector: (s: BroaderStoreState) => T): T {
  return useSyncExternalStore(
    (onStoreChange) => {
      listeners.add(onStoreChange);
      return () => listeners.delete(onStoreChange);
    },
    () => selector(state),
  );
}

export const getBroaderStore = () => state;
