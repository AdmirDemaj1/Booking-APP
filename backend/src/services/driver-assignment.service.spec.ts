import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DriverAssignmentService } from './driver-assignment.service';
import { User, UserRole, DriverStatus } from '../entities/user.entity';
import { Vehicle, VehicleStatus } from '../entities/vehicle.entity';
import { Journey, JourneyStatus } from '../entities/journey.entity';

describe('DriverAssignmentService', () => {
  let service: DriverAssignmentService;
  let userRepository: Repository<User>;
  let vehicleRepository: Repository<Vehicle>;
  let journeyRepository: Repository<Journey>;

  const mockUserRepository = {
    find: jest.fn(),
    update: jest.fn(),
  };

  const mockVehicleRepository = {
    update: jest.fn(),
  };

  const mockJourneyRepository = {
    update: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DriverAssignmentService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
        {
          provide: getRepositoryToken(Vehicle),
          useValue: mockVehicleRepository,
        },
        {
          provide: getRepositoryToken(Journey),
          useValue: mockJourneyRepository,
        },
      ],
    }).compile();

    service = module.get<DriverAssignmentService>(DriverAssignmentService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    vehicleRepository = module.get<Repository<Vehicle>>(getRepositoryToken(Vehicle));
    journeyRepository = module.get<Repository<Journey>>(getRepositoryToken(Journey));
  });

  describe('findBestDriver', () => {
    it('should return null when no drivers are available', async () => {
      mockUserRepository.find.mockResolvedValue([]);

      const journey = {
        pickupCoordinates: { latitude: 40.7128, longitude: -74.0060 },
        dropoffCoordinates: { latitude: 40.7128, longitude: -74.0060 },
      } as Journey;

      const result = await service.findBestDriver(journey);
      expect(result).toBeNull();
    });

    it('should select the closest available driver', async () => {
      const drivers = [
        {
          id: '1',
          role: UserRole.DRIVER,
          driverStatus: DriverStatus.AVAILABLE,
          isActive: true,
          currentLocation: { latitude: 40.7128, longitude: -74.0060 },
          vehicles: [{ id: '1', status: VehicleStatus.ACTIVE }],
        },
        {
          id: '2',
          role: UserRole.DRIVER,
          driverStatus: DriverStatus.AVAILABLE,
          isActive: true,
          currentLocation: { latitude: 40.7129, longitude: -74.0061 },
          vehicles: [{ id: '2', status: VehicleStatus.ACTIVE }],
        },
      ];

      mockUserRepository.find.mockResolvedValue(drivers);

      const journey = {
        pickupCoordinates: { latitude: 40.7128, longitude: -74.0060 },
        dropoffCoordinates: { latitude: 40.7128, longitude: -74.0060 },
      } as Journey;

      const result = await service.findBestDriver(journey);
      expect(result).toBeDefined();
      if (result) {
        expect(result.driver.id).toBe('1'); // Should select the first driver as they're at the exact location
      }
    });

    it('should consider vehicle status in scoring', async () => {
      const drivers = [
        {
          id: '1',
          role: UserRole.DRIVER,
          driverStatus: DriverStatus.AVAILABLE,
          isActive: true,
          currentLocation: { latitude: 40.7128, longitude: -74.0060 },
          vehicles: [{ id: '1', status: VehicleStatus.INACTIVE }],
        },
        {
          id: '2',
          role: UserRole.DRIVER,
          driverStatus: DriverStatus.AVAILABLE,
          isActive: true,
          currentLocation: { latitude: 40.7129, longitude: -74.0061 },
          vehicles: [{ id: '2', status: VehicleStatus.ACTIVE }],
        },
      ];

      mockUserRepository.find.mockResolvedValue(drivers);

      const journey = {
        pickupCoordinates: { latitude: 40.7128, longitude: -74.0060 },
        dropoffCoordinates: { latitude: 40.7128, longitude: -74.0060 },
      } as Journey;

      const result = await service.findBestDriver(journey);
      expect(result).toBeDefined();
      if (result) {
        expect(result.driver.id).toBe('2'); // Should select the second driver despite being slightly further
      }
    });
  });

  describe('assignDriver', () => {
    it('should return false when no suitable driver is found', async () => {
      mockUserRepository.find.mockResolvedValue([]);

      const journey = {
        id: '1',
        pickupCoordinates: { latitude: 40.7128, longitude: -74.0060 },
        dropoffCoordinates: { latitude: 40.7128, longitude: -74.0060 },
      } as Journey;

      const result = await service.assignDriver(journey);
      expect(result).toBe(false);
    });

    it('should update driver, vehicle, and journey status when assignment is successful', async () => {
      const drivers = [
        {
          id: '1',
          role: UserRole.DRIVER,
          driverStatus: DriverStatus.AVAILABLE,
          isActive: true,
          currentLocation: { latitude: 40.7128, longitude: -74.0060 },
          vehicles: [{ id: '1', status: VehicleStatus.ACTIVE }],
        },
      ];

      mockUserRepository.find.mockResolvedValue(drivers);

      const journey = {
        id: '1',
        pickupCoordinates: { latitude: 40.7128, longitude: -74.0060 },
        dropoffCoordinates: { latitude: 40.7128, longitude: -74.0060 },
      } as Journey;

      const result = await service.assignDriver(journey);
      expect(result).toBe(true);

      // Verify repository updates
      expect(mockJourneyRepository.update).toHaveBeenCalledWith('1', {
        driverId: '1',
        status: JourneyStatus.ASSIGNED,
      });
      expect(mockUserRepository.update).toHaveBeenCalledWith('1', {
        driverStatus: DriverStatus.ON_TRIP,
      });
      expect(mockVehicleRepository.update).toHaveBeenCalledWith('1', {
        status: VehicleStatus.INACTIVE,
      });
    });
  });

  describe('calculateDistance', () => {
    it('should calculate correct distance between two points', () => {
      // Test case: Distance between New York and Boston
      const nyLat = 40.7128;
      const nyLon = -74.0060;
      const bostonLat = 42.3601;
      const bostonLon = -71.0589;

      const distance = service['calculateDistance'](nyLat, nyLon, bostonLat, bostonLon);
      expect(distance).toBeCloseTo(306, 0); // Approximately 306 km
    });

    it('should return 0 for same coordinates', () => {
      const lat = 40.7128;
      const lon = -74.0060;

      const distance = service['calculateDistance'](lat, lon, lat, lon);
      expect(distance).toBe(0);
    });
  });
}); 