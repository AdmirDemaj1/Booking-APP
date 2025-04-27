import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Journey } from '../entities/journey.entity';
import { JourneyService } from './journey.service';
import { JourneyController } from './journey.controller';
import { DriverAssignmentService } from '../services/driver-assignment.service';
import { User } from '../entities/user.entity';
import { Vehicle } from '../entities/vehicle.entity';
import { UnassignedJourney } from '../entities/unassigned_journeys.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Journey, User, Vehicle, UnassignedJourney])],
  providers: [JourneyService, DriverAssignmentService],
  controllers: [JourneyController],
  exports: [JourneyService],
})
export class JourneyModule {} 