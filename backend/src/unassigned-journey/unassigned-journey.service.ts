import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UnassignedJourney } from '../entities/unassigned_journeys.entity';
import { CreateUnassignedJourneyDto } from './dto/create-unassigned-journey.dto';
import { UnassignedJourneyGateway } from './unassigned-journey.gateway';

@Injectable()
export class UnassignedJourneyService {
  constructor(
    @InjectRepository(UnassignedJourney)
    private readonly repo: Repository<UnassignedJourney>,
    private readonly socketGateway: UnassignedJourneyGateway,
  ) {}

  async create(data: CreateUnassignedJourneyDto): Promise<UnassignedJourney> {
    console.log('Creating unassigned journey', data);
    const entry = this.repo.create(data);

    console.log('Unassigned journey entry', entry);
    const saved = await this.repo.save(entry);

    this.socketGateway.notifyNewUnassignedJourney(saved);

    return saved;
  }

  async findAll(): Promise<UnassignedJourney[]> {
    return this.repo.find({ relations: ['journey'] });
  }

  async remove(id: string): Promise<void> {
    await this.repo.delete(id);
  }
}
