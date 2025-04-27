import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UnassignedJourney } from '../entities/unassigned_journeys.entity';
import { UnassignedJourneyController } from './unassigned-journey.controller';
import { UnassignedJourneyService } from './unassigned-journey.service';


@Module({
  imports: [TypeOrmModule.forFeature([UnassignedJourney])],
  controllers: [UnassignedJourneyController],
  providers: [UnassignedJourneyService],
  exports: [UnassignedJourneyService]
})
export class UnassignedJourneyModule {}
