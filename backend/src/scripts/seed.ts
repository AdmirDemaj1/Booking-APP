import { DataSource } from 'typeorm';
import { User, UserRole, DriverStatus } from '../entities/user.entity';
import { Vehicle, VehicleStatus } from '../entities/vehicle.entity';
import { Journey, JourneyStatus, PaymentStatus, PaymentMethod } from '../entities/journey.entity';
import * as bcrypt from 'bcrypt';

async function seed() {
  const dataSource = new DataSource({
    type: 'postgres',
    host: process.env.DATABASE_HOST || 'localhost',
    port: parseInt(process.env.DATABASE_PORT || '5432'),
    username: process.env.DATABASE_USERNAME || 'postgres',
    password: process.env.DATABASE_PASSWORD || 'postgres',
    database: process.env.DATABASE_NAME || 'booking_api',
    entities: [User, Vehicle, Journey],
    synchronize: true,
  });

  try {
    await dataSource.initialize();

    // Get repositories
    const userRepository = dataSource.getRepository(User);
    const vehicleRepository = dataSource.getRepository(Vehicle);
    const journeyRepository = dataSource.getRepository(Journey);

    // Clean up existing data in the correct order using raw SQL
    console.log('Cleaning up existing data...');
    await dataSource.query('TRUNCATE TABLE journeys CASCADE');
    await dataSource.query('TRUNCATE TABLE vehicles CASCADE');
    await dataSource.query('TRUNCATE TABLE users CASCADE');
    console.log('Cleanup completed');

    // Create admin user
    const adminPassword = await bcrypt.hash('admin123', 10);
    const admin = await userRepository.save({
      email: 'admin@admin.com',
      password: adminPassword,
      role: UserRole.ADMIN,
      firstName: 'Admin',
      lastName: 'User',
      phoneNumber: '+1234567890',
      isActive: true
    });

    // Create driver users with Tirana locations
    const drivers = await Promise.all([
      userRepository.save({
        email: 'driver1@example.com',
        password: await bcrypt.hash('driver123', 10),
        role: UserRole.DRIVER,
        firstName: 'John',
        lastName: 'Doe',
        phoneNumber: '+1234567891',
        isActive: true,
        driverStatus: DriverStatus.AVAILABLE,
        currentLocation: {
          latitude: 41.3275,
          longitude: 19.8187,
          lastUpdated: new Date()
        }
      }),
      userRepository.save({
        email: 'driver2@example.com',
        password: await bcrypt.hash('driver123', 10),
        role: UserRole.DRIVER,
        firstName: 'Jane',
        lastName: 'Smith',
        phoneNumber: '+1234567892',
        isActive: true,
        driverStatus: DriverStatus.AVAILABLE,
        currentLocation: {
          latitude: 41.3300,
          longitude: 19.8200,
          lastUpdated: new Date()
        }
      }),
      userRepository.save({
        email: 'driver3@example.com',
        password: await bcrypt.hash('driver123', 10),
        role: UserRole.DRIVER,
        firstName: 'Mike',
        lastName: 'Johnson',
        phoneNumber: '+1234567893',
        isActive: true,
        driverStatus: DriverStatus.AVAILABLE,
        currentLocation: {
          latitude: 41.3250,
          longitude: 19.8150,
          lastUpdated: new Date()
        }
      }),
      userRepository.save({
        email: 'driver4@example.com',
        password: await bcrypt.hash('driver123', 10),
        role: UserRole.DRIVER,
        firstName: 'Sarah',
        lastName: 'Williams',
        phoneNumber: '+1234567894',
        isActive: true,
        driverStatus: DriverStatus.AVAILABLE,
        currentLocation: {
          latitude: 41.3325,
          longitude: 19.8250,
          lastUpdated: new Date()
        }
      }),
    ]);

    // Create vehicles
    const vehicles = await Promise.all([
      vehicleRepository.save({
        make: 'Toyota',
        model: 'Camry',
        year: 2020,
        licensePlate: 'ABC123',
        color: 'Black',
        status: VehicleStatus.ACTIVE,
        driver: drivers[0],
      }),
      vehicleRepository.save({
        make: 'Honda',
        model: 'Civic',
        year: 2021,
        licensePlate: 'XYZ789',
        color: 'White',
        status: VehicleStatus.ACTIVE,
        driver: drivers[1],
      }),
      vehicleRepository.save({
        make: 'Ford',
        model: 'Focus',
        year: 2019,
        licensePlate: 'DEF456',
        color: 'Blue',
        status: VehicleStatus.ACTIVE,
        driver: drivers[2],
      }),
      vehicleRepository.save({
        make: 'Chevrolet',
        model: 'Malibu',
        year: 2022,
        licensePlate: 'GHI789',
        color: 'Red',
        status: VehicleStatus.ACTIVE,
        driver: drivers[3],
      }),
    ]);

    // Create journeys with Tirana locations
    const locations = [
      { pickup: 'Skanderbeg Square', dropoff: 'Blloku', coordinates: { pickup: { lat: 41.3275, lng: 19.8187 }, dropoff: { lat: 41.3300, lng: 19.8200 } } },
      { pickup: 'Tirana International Airport', dropoff: 'City Center', coordinates: { pickup: { lat: 41.4147, lng: 19.7206 }, dropoff: { lat: 41.3275, lng: 19.8187 } } },
      { pickup: 'Grand Park', dropoff: 'Tirana East Gate', coordinates: { pickup: { lat: 41.3200, lng: 19.8300 }, dropoff: { lat: 41.3400, lng: 19.8500 } } },
      { pickup: 'Tirana Lake', dropoff: 'Dajti Mountain', coordinates: { pickup: { lat: 41.3350, lng: 19.8400 }, dropoff: { lat: 41.3500, lng: 19.9000 } } },
    ];

    const statuses = [JourneyStatus.PENDING, JourneyStatus.IN_PROGRESS, JourneyStatus.COMPLETED, JourneyStatus.CANCELLED];

    const journeys: Journey[] = [];
    for (let i = 0; i < 10; i++) {
      const randomLocation = locations[Math.floor(Math.random() * locations.length)];
      const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
      const randomVehicle = vehicles[Math.floor(Math.random() * vehicles.length)];

      const journey = await journeyRepository.save({
        pickupLocation: randomLocation.pickup,
        dropoffLocation: randomLocation.dropoff,
        pickupCoordinates: {
          latitude: randomLocation.coordinates.pickup.lat,
          longitude: randomLocation.coordinates.pickup.lng
        },
        dropoffCoordinates: {
          latitude: randomLocation.coordinates.dropoff.lat,
          longitude: randomLocation.coordinates.dropoff.lng
        },
        pickupTime: new Date(),
        passengerName: `Passenger ${i + 1}`,
        passengerPhone: `+123456789${i}`,
        status: randomStatus,
        paymentStatus: PaymentStatus.PENDING,
        paymentMethod: PaymentMethod.CASH,
        fare: 10.00,
        driverId: randomVehicle.driver.id
      });
      journeys.push(journey);
    }

    console.log('Seed data created successfully!');
  } catch (error) {
    console.error('Error during seeding:', error);
    throw error;
  } finally {
    await dataSource.destroy();
  }
}

seed().catch((error) => {
  console.error('Error seeding database:', error);
  process.exit(1);
}); 