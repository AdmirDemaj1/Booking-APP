import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Journey } from '../entities/journey.entity';
import { JourneyService } from './journey.service';

@Module({
  imports: [TypeOrmModule.forFeature([Journey])],
  providers: [JourneyService],
  exports: [JourneyService],
})
export class JourneyModule {} 