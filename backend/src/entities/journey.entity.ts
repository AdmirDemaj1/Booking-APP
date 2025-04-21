import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';

export enum JourneyStatus {
  PENDING = 'pending',
  ASSIGNED = 'assigned',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

export enum PaymentStatus {
  PENDING = 'pending',
  PAID = 'paid',
  FAILED = 'failed'
}

export enum PaymentMethod {
  CASH = 'cash',
  CARD = 'card',
  MOBILE = 'mobile'
}

@Entity('journeys')
export class Journey {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  pickupLocation: string;

  @Column()
  dropoffLocation: string;

  @Column('jsonb')
  pickupCoordinates: {
    latitude: number;
    longitude: number;
  };

  @Column('jsonb')
  dropoffCoordinates: {
    latitude: number;
    longitude: number;
  };

  @Column()
  pickupTime: Date;

  @Column({ nullable: true })
  actualPickupTime: Date;

  @Column({ nullable: true })
  dropoffTime: Date;

  @Column()
  passengerName: string;

  @Column()
  passengerPhone: string;

  @Column({ nullable: true })
  notes: string;

  @Column({
    type: 'enum',
    enum: JourneyStatus,
    default: JourneyStatus.PENDING
  })
  status: JourneyStatus;

  @Column({
    type: 'enum',
    enum: PaymentStatus,
    default: PaymentStatus.PENDING
  })
  paymentStatus: PaymentStatus;

  @Column({
    type: 'enum',
    enum: PaymentMethod,
    nullable: true
  })
  paymentMethod: PaymentMethod;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  fare: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  distance: number; // in kilometers

  @Column({ type: 'integer', nullable: true })
  estimatedDuration: number; // in minutes

  @ManyToOne(() => User, { 
    nullable: true,
    onDelete: 'CASCADE'
  })
  @JoinColumn({ name: 'driverId' })
  driver: User;

  @Column({ nullable: true })
  driverId: string;

  @Column({ type: 'jsonb', nullable: true })
  wialonData: {
    unitId: string;
    lastLocation: {
      latitude: number;
      longitude: number;
      speed: number;
      timestamp: Date;
    };
  };

  @Column({ type: 'jsonb', nullable: true })
  driverLocationAtPickup: {
    latitude: number;
    longitude: number;
    timestamp: Date;
  };

  @Column({ type: 'jsonb', nullable: true })
  driverLocationAtDropoff: {
    latitude: number;
    longitude: number;
    timestamp: Date;
  };

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 