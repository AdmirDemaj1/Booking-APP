import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Journey } from '../entities/journey.entity';
import { Vehicle } from '../entities/vehicle.entity';
import { UnassignedJourney } from '../entities/unassigned_journeys.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST || 'localhost',
      port: parseInt(process.env.DATABASE_PORT || '5432', 10),
      username: process.env.DATABASE_USER || 'postgres',
      password: process.env.DATABASE_PASSWORD || 'postgres',
      database: process.env.DATABASE_NAME || 'booking_api',
      entities: [User, Journey, Vehicle, UnassignedJourney],
      synchronize: true, // This will create tables automatically
      logging: true, // Enable SQL logging
      migrations: ['dist/migrations/*.js'],
      migrationsRun: true,
    }),
    TypeOrmModule.forFeature([User, Journey, Vehicle, UnassignedJourney]),

  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {} 
