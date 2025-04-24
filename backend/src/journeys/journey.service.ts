import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Journey } from '../entities/journey.entity';

@Injectable()
export class JourneyService {
  constructor(
    @InjectRepository(Journey)
    private journeyRepository: Repository<Journey>,
  ) {}

  async create(journeyData: Partial<Journey>): Promise<Journey> {
    const journey = this.journeyRepository.create(journeyData);
    return this.journeyRepository.save(journey);
  }

  async findAll(): Promise<Journey[]> {
    return this.journeyRepository.find();
  }

  async findOne(id: string): Promise<Journey | null> {
    return this.journeyRepository.findOne({ where: { id } });
  }

  async update(id: string, journeyData: Partial<Journey>): Promise<Journey | null> {
    await this.journeyRepository.update(id, journeyData);
    return this.findOne(id);
  }

  async findByDriver(driverId: string): Promise<Journey[]> {
    return this.journeyRepository.find({ where: { driverId } });
  }

  async delete(id: string): Promise<void> {
    await this.journeyRepository.delete(id);
  }
} 