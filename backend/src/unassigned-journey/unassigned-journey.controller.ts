import { Controller, Post, Get, Delete, Param, Body } from '@nestjs/common';
import { UnassignedJourneyService } from './unassigned-journey.service';
import { CreateUnassignedJourneyDto } from './dto/create-unassigned-journey.dto';

@Controller('unassigned-journeys')
export class UnassignedJourneyController {
  constructor(private readonly service: UnassignedJourneyService) {}

  @Post()
  create(@Body() dto: CreateUnassignedJourneyDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
