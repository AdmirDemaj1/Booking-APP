import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UnassignedJourney } from '../entities/unassigned_journeys.entity';
import { UnassignedJourneyController } from './unassigned-journey.controller';
import { UnassignedJourneyService } from './unassigned-journey.service';
import { UnassignedJourneyGateway } from './unassigned-journey.gateway';

@Module({
  imports: [TypeOrmModule.forFeature([UnassignedJourney])],
  controllers: [UnassignedJourneyController],
  providers: [UnassignedJourneyService, UnassignedJourneyGateway],
  exports: [UnassignedJourneyService],
})
export class UnassignedJourneyModule {}
