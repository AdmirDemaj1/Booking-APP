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
    host: process.env.DATABASE_HOST || 'localhost',
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

    // Clean up existing data in the correct order using raw SQL
    console.log('Cleaning up existing data...');
    await dataSource.query('TRUNCATE TABLE journeys CASCADE');
    await dataSource.query('TRUNCATE TABLE vehicles CASCADE');
    await dataSource.query('TRUNCATE TABLE users CASCADE');
    console.log('Cleanup completed');

 
    
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