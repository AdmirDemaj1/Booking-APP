import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Journey } from './journey.entity';
import { Vehicle } from './vehicle.entity';

export enum UserRole {
  ADMIN = 'admin',
  DRIVER = 'driver'
}

export enum DriverStatus {
  OFFLINE = 'offline',
  AVAILABLE = 'available',
  ON_TRIP = 'on_trip',
  BREAK = 'break'
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  phoneNumber: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.DRIVER
  })
  role: UserRole;

  @Column({
    type: 'enum',
    enum: DriverStatus,
    default: DriverStatus.OFFLINE,
    nullable: true
  })
  driverStatus: DriverStatus;

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'jsonb', nullable: true })
  currentLocation: {
    latitude: number;
    longitude: number;
    lastUpdated: Date;
  };

  @Column({ type: 'jsonb', nullable: true })
  fcmToken: string; // For push notifications

  @OneToMany(() => Journey, journey => journey.driver, { 
    cascade: ['remove'],
    onDelete: 'CASCADE'
  })
  journeys: Journey[];

  @OneToMany(() => Vehicle, vehicle => vehicle.driver, { 
    cascade: ['remove'],
    onDelete: 'CASCADE'
  })
  vehicles: Vehicle[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 