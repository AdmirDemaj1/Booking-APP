import { Controller, Get, Post, Put, Delete, Body, Param, NotFoundException, HttpCode } from '@nestjs/common';
import { UserService } from './user.service';
import { User, DriverStatus, UserRole } from '../entities/user.entity';

@Controller('api')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('drivers')
  async getDrivers(): Promise<Partial<User>[]> {
    return this.userService.getDrivers();
  }

  @Get('users')
  async findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Get('users/:id')
  async findOne(@Param('id') id: string): Promise<User> {
    const user = await this.userService.findOne(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  @Post('users')
  async create(@Body() userData: Partial<User>): Promise<User> {
    return this.userService.create(userData);
  }

  @Put('users/:id')
  async update(@Param('id') id: string, @Body() userData: Partial<User>): Promise<User> {
    const updatedUser = await this.userService.update(id, userData);
    if (!updatedUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return updatedUser;
  }

  @Put('drivers/:id/status')
  async updateDriverStatus(
    @Param('id') id: string, 
    @Body('status') status: DriverStatus
  ): Promise<User> {
    const user = await this.userService.findOne(id);
    if (!user) {
      throw new NotFoundException(`Driver with ID ${id} not found`);
    }
    if (user.role !== UserRole.DRIVER) {
      throw new NotFoundException(`User with ID ${id} is not a driver`);
    }
    
    const updatedUser = await this.userService.updateDriverStatus(id, status);
    if (!updatedUser) {
      throw new NotFoundException(`Driver with ID ${id} not found`);
    }
    return updatedUser;
  }

  @Delete('users/:id')
  @HttpCode(204)
  async delete(@Param('id') id: string): Promise<void> {
    const user = await this.userService.findOne(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    await this.userService.delete(id);
  }
} 