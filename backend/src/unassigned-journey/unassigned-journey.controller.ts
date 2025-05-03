import { Controller, Post, Get, Delete, Param, Body } from '@nestjs/common';
import { UnassignedJourneyService } from './unassigned-journey.service';
import { CreateUnassignedJourneyDto } from './dto/create-unassigned-journey.dto';

@Controller('api/unassigned-journeys')
export class UnassignedJourneyController {
  constructor(private readonly service: UnassignedJourneyService) {}

  @Post()
  async create(@Body() dto: CreateUnassignedJourneyDto) {
    try {
      console.log('Creating unassigned journey', dto);
      return await this.service.create(dto);
    } catch (error) {
      console.error('Error in creating unassigned journey:', error);
      throw error;
    }
  }

  @Get()
  findAll() {
    console.log('Fetching all unassigned journeys');

    return this.service.findAll();
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
