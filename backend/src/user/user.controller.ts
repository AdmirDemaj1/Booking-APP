import { Controller, Get } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from '../entities/user.entity';

@Controller('api/drivers')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getDrivers(): Promise<Partial<User>[]> {
    return this.userService.getDrivers();
  }
} 