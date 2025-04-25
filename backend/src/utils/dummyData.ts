import { User, UserRole, DriverStatus } from '../entities/user.entity';
import { Journey, JourneyStatus, PaymentStatus, PaymentMethod } from '../entities/journey.entity';
import { Vehicle, VehicleStatus } from '../entities/vehicle.entity';

export const generateDummyUsers = (count: number): Partial<User>[] => {
  const users: Partial<User>[] = [];
  for (let i = 0; i < count; i++) {
    const isDriver = i !== 0;
    users.push({
      email: `user${i + 1}@example.com`,
      password: 'password123',
      firstName: `User${i + 1}`,
      lastName: `Last${i + 1}`,
      phoneNumber: `+123456789${i}`,
      role: isDriver ? UserRole.DRIVER : UserRole.ADMIN,
      isActive: true,
      driverStatus: isDriver ? DriverStatus.AVAILABLE : undefined,
      currentLocation: isDriver ? {
        latitude: 41.3275 + (i * 0.01),
        longitude: 19.8187 + (i * 0.01),
        lastUpdated: new Date()
      } : undefined,
      fcmToken: isDriver ? `dummy-fcm-token-${i}` : undefined
    });
  }
  return users;
};

export const generateDummyVehicles = (count: number): Partial<Vehicle>[] => {
  const vehicles: Partial<Vehicle>[] = [];
  const makes = ['Toyota', 'Honda', 'Ford', 'Chevrolet', 'Nissan'];
  const models = ['Camry', 'Accord', 'Focus', 'Malibu', 'Altima'];
  const colors = ['Red', 'Blue', 'Black', 'White', 'Silver'];

  for (let i = 0; i < count; i++) {
    vehicles.push({
      make: makes[i % makes.length],
      model: models[i % models.length],
      year: 2020 + (i % 3),
      licensePlate: `ABC${i + 100}`,
      color: colors[i % colors.length],
      status: VehicleStatus.ACTIVE,
      wialonData: {
        unitId: `WIALON-${i + 1000}`,
        lastLocation: {
          latitude: 41.3275 + (i * 0.01),
          longitude: 19.8187 + (i * 0.01),
          speed: 0,
          timestamp: new Date(),
        },
      },
    });
  }
  return vehicles;
};

export const generateDummyJourneys = (count: number, drivers: User[], vehicles: Vehicle[]): Partial<Journey>[] => {
  const journeys: Partial<Journey>[] = [];
  const locations = [
    { name: 'Tirana International Airport', lat: 41.4147, lng: 19.7206 },
    { name: 'Skanderbeg Square', lat: 41.3275, lng: 19.8187 },
    { name: 'Blloku', lat: 41.3218, lng: 19.8196 },
    { name: 'Durres Port', lat: 41.3125, lng: 19.4547 },
  ];

  for (let i = 0; i < count; i++) {
    const pickupIndex = i % locations.length;
    const dropoffIndex = (i + 1) % locations.length;
    const driver = drivers[i % drivers.length];
    const vehicle = vehicles[i % vehicles.length];
    const distance = Math.random() * 20 + 5; // Random distance between 5-25 km

    journeys.push({
      pickupLocation: {
        latitude: locations[pickupIndex].lat,
        longitude: locations[pickupIndex].lng
      },
      dropoffLocation: locations[dropoffIndex].name,
      pickupCoordinates: {
        latitude: locations[pickupIndex].lat,
        longitude: locations[pickupIndex].lng,
      },
      dropoffCoordinates: {
        latitude: locations[dropoffIndex].lat,
        longitude: locations[dropoffIndex].lng,
      },
      pickupTime: new Date(Date.now() + i * 3600000),
      passengerName: `Passenger${i + 1}`,
      passengerPhone: `+123456789${i}`,
      status: JourneyStatus.PENDING,
      paymentStatus: PaymentStatus.PENDING,
      paymentMethod: PaymentMethod.CASH,
      fare: parseFloat((distance * 2.5).toFixed(2)), // $2.5 per km
      distance: parseFloat(distance.toFixed(2)),
      estimatedDuration: Math.round(distance * 3), // Roughly 3 minutes per km
      driverId: driver?.id,
      wialonData: {
        unitId: vehicle?.wialonData?.unitId || `WIALON-${i + 1000}`,
        lastLocation: {
          latitude: locations[pickupIndex].lat,
          longitude: locations[pickupIndex].lng,
          speed: 0,
          timestamp: new Date(),
        },
      },
    });
  }
  return journeys;
}; 