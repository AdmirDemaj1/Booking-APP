import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole, DriverStatus } from '../entities/user.entity';
import { Journey, JourneyStatus } from '../entities/journey.entity';
import { Vehicle, VehicleStatus } from '../entities/vehicle.entity';

@Injectable()
export class DriverAssignmentService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Vehicle)
    private vehicleRepository: Repository<Vehicle>,
    @InjectRepository(Journey)
    private journeyRepository: Repository<Journey>,
  ) {}

  // Calculate distance between two points using Haversine formula
  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.toRad(lat2 - lat1);
    const dLon = this.toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private toRad(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  // Calculate driver score based on multiple factors
  private calculateDriverScore(
    driver: User,
    vehicle: Vehicle,
    journey: Journey,
    distanceToPickup: number,
  ): number {
    let score = 0;

    // Base score for available drivers
    if (driver.driverStatus === DriverStatus.AVAILABLE) {
      score += 100;
    }

    // Distance factor (closer is better)
    const maxDistance = 50; // Maximum acceptable distance in km
    const distanceScore = Math.max(0, 100 - (distanceToPickup / maxDistance) * 100);
    score += distanceScore;

    // Vehicle status factor
    if (vehicle.status === VehicleStatus.ACTIVE) {
      score += 50;
    }

    // Driver rating factor (if implemented)
    if (driver['rating']) {
      score += driver['rating'] * 20;
    }

    // Recent trips factor (prefer drivers with fewer recent trips)
    if (driver['recentTrips']) {
      const recentTripsScore = Math.max(0, 50 - driver['recentTrips'] * 5);
      score += recentTripsScore;
    }

    // Vehicle capacity factor
    if (vehicle['capacity'] >= journey['passengerCount']) {
      score += 30;
    }

    return score;
  }

  async findBestDriver(journey: Journey): Promise<{ driver: User; vehicle: Vehicle; score: number } | null> {
    // Get all available drivers with their vehicles
    const availableDrivers = await this.userRepository.find({
      where: {
        role: UserRole.DRIVER,
        driverStatus: DriverStatus.AVAILABLE,
        isActive: true,
      },
      relations: ['vehicles'],
    });

    if (availableDrivers.length === 0) {
      return null;
    }

    let bestMatch: { driver: User; vehicle: Vehicle; score: number } | null = null;
    let highestScore = 0;

    for (const driver of availableDrivers) {
      // Get driver's active vehicle
      const vehicle = driver.vehicles.find(v => v.status === VehicleStatus.ACTIVE);
      if (!vehicle) continue;

      // Calculate distance from driver's current location to pickup point
      const distanceToPickup = this.calculateDistance(
        driver.currentLocation.latitude,
        driver.currentLocation.longitude,
        journey.pickupCoordinates.latitude,
        journey.pickupCoordinates.longitude,
      );

      // Calculate driver score
      const score = this.calculateDriverScore(driver, vehicle, journey, distanceToPickup);

      // Update best match if this driver has a higher score
      if (score > highestScore) {
        highestScore = score;
        bestMatch = { driver, vehicle, score };
      }
    }

    return bestMatch;
  }

  async assignDriver(journey: Journey): Promise<boolean> {
    const bestMatch = await this.findBestDriver(journey);
    
    if (!bestMatch) {
      return false;
    }

    // Update journey with assigned driver
    await this.journeyRepository.update(journey.id, {
      driverId: bestMatch.driver.id,
      status: JourneyStatus.ASSIGNED,
    });

    // Update driver status
    await this.userRepository.update(bestMatch.driver.id, {
      driverStatus: DriverStatus.ON_TRIP,
    });

    // Update vehicle status
    await this.vehicleRepository.update(bestMatch.vehicle.id, {
      status: VehicleStatus.INACTIVE,
    });

    return true;
  }
} 