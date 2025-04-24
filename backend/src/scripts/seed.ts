import { DataSource } from 'typeorm';
import { User, UserRole, DriverStatus } from '../entities/user.entity';
import { Vehicle, VehicleStatus } from '../entities/vehicle.entity';
import { Journey, JourneyStatus, PaymentStatus, PaymentMethod } from '../entities/journey.entity';
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

console.log('Starting database seed...');
console.log('Database connection parameters:');
console.log(`Host: ${process.env.DATABASE_HOST || 'localhost'}`);
console.log(`Port: ${process.env.DATABASE_PORT || '5432'}`);
console.log(`Database: ${process.env.DATABASE_NAME || 'booking_api'}`);
console.log(`User: ${process.env.DATABASE_USER || 'postgres'}`);

async function seed() {
  const dataSource = new DataSource({
    type: 'postgres',
    host: process.env.DATABASE_HOST || 'db',
    port: parseInt(process.env.DATABASE_PORT || '5432', 10),
    username: process.env.DATABASE_USER || 'postgres', // Match the variable name in database.module.ts
    password: process.env.DATABASE_PASSWORD || 'postgres',
    database: process.env.DATABASE_NAME || 'booking_api',
    entities: [User, Vehicle, Journey],
    synchronize: true,
    logging: true,
  });

  try {
    console.log('Initializing database connection...');
    await dataSource.initialize();
    console.log('Database connection established successfully');

    // Get repositories
    const userRepository = dataSource.getRepository(User);
    const vehicleRepository = dataSource.getRepository(Vehicle);
    const journeyRepository = dataSource.getRepository(Journey);

   

    // Create admin user
    console.log('Creating admin user...');
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
    console.log(`Created admin user with ID: ${admin.id}`);

    // Create driver users with Tirana locations
    console.log('Creating driver users...');
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
    console.log(`Created ${drivers.length} driver users`);

    // Create vehicles
    console.log('Creating vehicles...');
    const vehicles = await Promise.all([
      vehicleRepository.save({
        make: 'Toyota',
        model: 'Camry',
        year: 2020,
        licensePlate: 'ABC123',
        color: 'Black',
        status: VehicleStatus.ACTIVE,
        driver: drivers[0],
        driverId: drivers[0].id
      }),
      vehicleRepository.save({
        make: 'Honda',
        model: 'Civic',
        year: 2021,
        licensePlate: 'XYZ789',
        color: 'White',
        status: VehicleStatus.ACTIVE,
        driver: drivers[1],
        driverId: drivers[1].id
      }),
      vehicleRepository.save({
        make: 'Ford',
        model: 'Focus',
        year: 2019,
        licensePlate: 'DEF456',
        color: 'Blue',
        status: VehicleStatus.ACTIVE,
        driver: drivers[2],
        driverId: drivers[2].id
      }),
      vehicleRepository.save({
        make: 'Chevrolet',
        model: 'Malibu',
        year: 2022,
        licensePlate: 'GHI789',
        color: 'Red',
        status: VehicleStatus.ACTIVE,
        driver: drivers[3],
        driverId: drivers[3].id
      }),
    ]);
    console.log(`Created ${vehicles.length} vehicles`);

    // Create journeys with Tirana locations
    console.log('Creating journeys...');
    const journeyLocations = [
      {
        pickupLocation: 'Skanderbeg Square',
        dropoffLocation: 'Blloku',
        pickupCoordinates: { latitude: 41.3275, longitude: 19.8187 },
        dropoffCoordinates: { latitude: 41.3300, longitude: 19.8200 }
      },
      {
        pickupLocation: 'Tirana International Airport',
        dropoffLocation: 'City Center',
        pickupCoordinates: { latitude: 41.4147, longitude: 19.7206 },
        dropoffCoordinates: { latitude: 41.3275, longitude: 19.8187 }
      },
      {
        pickupLocation: 'Grand Park',
        dropoffLocation: 'Tirana East Gate',
        pickupCoordinates: { latitude: 41.3200, longitude: 19.8300 },
        dropoffCoordinates: { latitude: 41.3400, longitude: 19.8500 }
      },
      {
        pickupLocation: 'Tirana Lake',
        dropoffLocation: 'Dajti Mountain',
        pickupCoordinates: { latitude: 41.3350, longitude: 19.8400 },
        dropoffCoordinates: { latitude: 41.3500, longitude: 19.9000 }
      },
    ];

    const statuses = [JourneyStatus.PENDING, JourneyStatus.ASSIGNED, JourneyStatus.IN_PROGRESS, JourneyStatus.COMPLETED, JourneyStatus.CANCELLED];

    const journeys: Journey[] = [];
    for (let i = 0; i < 10; i++) {
      const randomLocation = journeyLocations[Math.floor(Math.random() * journeyLocations.length)];
      const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
      const randomDriver = drivers[Math.floor(Math.random() * drivers.length)];

      // Only assign driver if not pending or cancelled
      const shouldAssignDriver = randomStatus !== JourneyStatus.PENDING && randomStatus !== JourneyStatus.CANCELLED;
      
      const journeyData: Partial<Journey> = {
        pickupLocation: randomLocation.pickupCoordinates,
        dropoffLocation: randomLocation.dropoffLocation,
        pickupCoordinates: randomLocation.pickupCoordinates,
        dropoffCoordinates: randomLocation.dropoffCoordinates,
        pickupTime: new Date(),
        passengerName: `Passenger ${i + 1}`,
        passengerPhone: `+123456789${i}`,
        status: randomStatus,
        paymentStatus: PaymentStatus.PENDING,
        paymentMethod: PaymentMethod.CASH,
        fare: parseFloat((Math.random() * 30 + 10).toFixed(2)), // Random fare between 10 and 40
        distance: parseFloat((Math.random() * 15).toFixed(2)), // Random distance up to 15km
        estimatedDuration: Math.floor(Math.random() * 30) + 10, // Random duration between 10-40 minutes
      };

      // Only add driver info if journey is assigned or beyond
      if (shouldAssignDriver) {
        journeyData.driverId = randomDriver.id;
        journeyData.assignedDriver = randomDriver;
      }

      // Add actual pickup/dropoff times for in-progress and completed journeys
      if (randomStatus === JourneyStatus.IN_PROGRESS || randomStatus === JourneyStatus.COMPLETED) {
        journeyData.actualPickupTime = new Date(Date.now() - Math.floor(Math.random() * 3600000)); // Random time within the last hour
      }
      
      if (randomStatus === JourneyStatus.COMPLETED) {
        journeyData.dropoffTime = new Date();
      }

      const journey = await journeyRepository.save(journeyData);
      console.log(`Created journey with ID: ${journey.id} and status: ${journey.status}`);
      journeys.push(journey);
    }

    console.log('Seed data created successfully!');
    console.log(`Created ${drivers.length} drivers`);
    console.log(`Created ${vehicles.length} vehicles`);
    console.log(`Created ${journeys.length} journeys`);
    
  } catch (error) {
    console.error('Error during seeding:', error);
    throw error;
  } finally {
    if (dataSource && dataSource.isInitialized) {
      await dataSource.destroy();
      console.log('Database connection closed');
    }
  }
}

seed().catch((error) => {
  console.error('Error seeding database:', error);
  process.exit(1);
}); 