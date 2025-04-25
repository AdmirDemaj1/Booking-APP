import { Controller, Get, Post, Put, Delete, Body, Param, NotFoundException, HttpCode } from '@nestjs/common';
import { VehicleService } from './vehicle.service';
import { Vehicle, VehicleStatus } from '../entities/vehicle.entity';

@Controller('api/vehicles')
export class VehicleController {
  constructor(private readonly vehicleService: VehicleService) {}

  @Post()
  async create(@Body() vehicleData: Partial<Vehicle>): Promise<Vehicle> {
    return this.vehicleService.create(vehicleData);
  }

  @Get()
  async findAll(): Promise<Vehicle[]> {
    return this.vehicleService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Vehicle> {
    const vehicle = await this.vehicleService.findOne(id);
    if (!vehicle) {
      throw new NotFoundException(`Vehicle with ID ${id} not found`);
    }
    return vehicle;
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() vehicleData: Partial<Vehicle>): Promise<Vehicle> {
    const updatedVehicle = await this.vehicleService.update(id, vehicleData);
    if (!updatedVehicle) {
      throw new NotFoundException(`Vehicle with ID ${id} not found`);
    }
    return updatedVehicle;
  }

  @Put(':id/status')
  async updateStatus(
    @Param('id') id: string, 
    @Body('status') status: VehicleStatus
  ): Promise<Vehicle> {
    const updatedVehicle = await this.vehicleService.update(id, { status });
    if (!updatedVehicle) {
      throw new NotFoundException(`Vehicle with ID ${id} not found`);
    }
    return updatedVehicle;
  }
  
  @Delete(':id')
  @HttpCode(204)
  async delete(@Param('id') id: string): Promise<void> {
    const vehicle = await this.vehicleService.findOne(id);
    if (!vehicle) {
      throw new NotFoundException(`Vehicle with ID ${id} not found`);
    }
    await this.vehicleService.delete(id);
  }
} 