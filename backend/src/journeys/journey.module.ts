import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Journey } from '../entities/journey.entity';
import { JourneyService } from './journey.service';
import { JourneyController } from './journey.controller';
import { DriverAssignmentService } from '../services/driver-assignment.service';
import { User } from '../entities/user.entity';
import { Vehicle } from '../entities/vehicle.entity';
import { UserModule } from '../user/user.module';
import { VehicleModule } from '../vehicles/vehicle.module';
import { UnassignedJourneyModule } from '../unassigned-journey/unassigned-journey.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Journey, User, Vehicle]),
    UserModule,
    VehicleModule,
    UnassignedJourneyModule,
  ],
  providers: [JourneyService, DriverAssignmentService],
  controllers: [JourneyController],
  exports: [JourneyService],
})
export class JourneyModule {} 