import { Controller, Get, Post, Put, Delete, Body, Param, Query, NotFoundException, HttpCode, BadRequestException } from '@nestjs/common';
import { JourneyService } from './journey.service';
import { Journey, JourneyStatus } from '../entities/journey.entity';
import { DriverAssignmentService } from '../services/driver-assignment.service';
import { UnassignedJourneyService } from '../unassigned-journey/unassigned-journey.service'; // 👈


@Controller('api/journeys')
export class JourneyController {
  constructor(
    private readonly journeyService: JourneyService,
    private readonly driverAssignmentService: DriverAssignmentService,
    private readonly unassignedJourneyService: UnassignedJourneyService 

  ) {}

  @Post()
  async create(@Body() journeyData: Partial<Journey>): Promise<Journey> {

    console.log('journeyData', journeyData);
    // First create the journey with PENDING status
    const journey = await this.journeyService.create({
      ...journeyData,
      status: JourneyStatus.PENDING,
    });

    // Try to assign a driver based on the algorithm
    const assigned = await this.driverAssignmentService.assignDriver(journey);

    if (assigned) {
      // If driver assignment was successful, refresh the journey to get the updated data
      const updatedJourney = await this.journeyService.findOne(journey.id);
      if (!updatedJourney) {
        throw new NotFoundException(`Journey with ID ${journey.id} not found after driver assignment`);
      }
      return updatedJourney;
    }

    await this.unassignedJourneyService.create({
      journeyId: journey.id,
      reason: 'No available drivers at time of creation'
    });
    
    // If no driver was assigned, return the journey as is (with PENDING status)
    return journey;
  }

  @Post(':id/assign-driver')
  async assignDriver(@Param('id') id: string): Promise<Journey> {
    const journey = await this.journeyService.findOne(id);
    if (!journey) {
      throw new NotFoundException(`Journey with ID ${id} not found`);
    }
    
    if (journey.status !== JourneyStatus.PENDING) {
      throw new BadRequestException(`Cannot assign driver to journey that is not in PENDING status`);
    }
    
    const assigned = await this.driverAssignmentService.assignDriver(journey);
    if (!assigned) {
      throw new BadRequestException(`No available drivers found to assign to this journey`);
    }
    
    const updatedJourney = await this.journeyService.findOne(id);
    if (!updatedJourney) {
      throw new NotFoundException(`Journey with ID ${id} not found after driver assignment`);
    }
    return updatedJourney;
  }

  @Get()
  async findAll(): Promise<Journey[]> {
    return this.journeyService.findAll();
  }

  @Get('driver/:driverId')
  async findByDriver(@Param('driverId') driverId: string): Promise<Journey[]> {
    return this.journeyService.findByDriver(driverId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Journey> {
    const journey = await this.journeyService.findOne(id);
    if (!journey) {
      throw new NotFoundException(`Journey with ID ${id} not found`);
    }
    return journey;
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() journeyData: Partial<Journey>): Promise<Journey> {
    const updatedJourney = await this.journeyService.update(id, journeyData);
    if (!updatedJourney) {
      throw new NotFoundException(`Journey with ID ${id} not found`);
    }
    return updatedJourney;
  }

  @Put(':id/status')
  async updateStatus(
    @Param('id') id: string, 
    @Body('status') status: JourneyStatus
  ): Promise<Journey> {
    const journey = await this.journeyService.findOne(id);
    if (!journey) {
      throw new NotFoundException(`Journey with ID ${id} not found`);
    }
    
    const updatedJourney = await this.journeyService.update(id, { status });
    if (!updatedJourney) {
      throw new NotFoundException(`Journey with ID ${id} not found`);
    }
    return updatedJourney;
  }

  @Delete(':id')
  @HttpCode(204)
  async delete(@Param('id') id: string): Promise<void> {
    const journey = await this.journeyService.findOne(id);
    if (!journey) {
      throw new NotFoundException(`Journey with ID ${id} not found`);
    }
    await this.journeyService.delete(id);
  }
} 