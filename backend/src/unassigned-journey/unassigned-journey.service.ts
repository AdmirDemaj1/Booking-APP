import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UnassignedJourney } from '../entities/unassigned_journeys.entity';
import { CreateUnassignedJourneyDto } from './dto/create-unassigned-journey.dto';

@Injectable()
export class UnassignedJourneyService {
  constructor(
    @InjectRepository(UnassignedJourney)
    private readonly repo: Repository<UnassignedJourney>,
  ) {}

  async create(data: CreateUnassignedJourneyDto): Promise<UnassignedJourney> {
    const entry = this.repo.create(data);
    return this.repo.save(entry);
  }

  async findAll(): Promise<UnassignedJourney[]> {
    return this.repo.find({ relations: ['journey'] });
  }

  async remove(id: string): Promise<void> {
    await this.repo.delete(id);
  }
}
