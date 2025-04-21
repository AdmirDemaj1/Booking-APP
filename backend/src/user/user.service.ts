import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from '../entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async getDrivers(): Promise<Partial<User>[]> {
    return this.userRepository.find({
      where: {
        role: UserRole.DRIVER,
        isActive: true,
      },
      select: [
        'id',
        'firstName',
        'lastName',
        'currentLocation',
        'driverStatus',
      ],
    });
  }
} 