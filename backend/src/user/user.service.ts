import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole, DriverStatus } from '../entities/user.entity';
import * as bcrypt from 'bcrypt';

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

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findOne(id: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { id } });
  }

  async create(userData: Partial<User>): Promise<User> {
    console.log("userData before processing", userData);
    
    // Create the user entity
    const user = this.userRepository.create(userData);
    console.log("User entity after create()", user);
    
    // Save the user to the database
    return await this.userRepository.save(user);
 
  }

  async update(id: string, userData: Partial<User>): Promise<User | null> {

    console.log("userData", userData, "id", id)
    await this.userRepository.update(id, userData);
    return this.findOne(id);
  }

  async updateDriverStatus(id: string, status: DriverStatus): Promise<User | null> {
    await this.userRepository.update(id, { driverStatus: status });
    return this.findOne(id);
  }

  async delete(id: string): Promise<void> {
    await this.userRepository.delete(id);
  }
} 