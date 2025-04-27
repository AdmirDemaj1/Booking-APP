import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { JourneyModule } from './journeys/journey.module';
import { DatabaseModule } from './database/database.module';
import { VehicleModule } from './vehicles/vehicle.module';
import { UnassignedJourneyModule } from './unassigned-journey/unassigned-journey.module';

@Module({
  imports: [
    // ConfigModule.forRoot(),
    // TypeOrmModule.forRoot({
    //   type: 'postgres',
    //   host: process.env.DATABASE_HOST || 'localhost',
    //   port: parseInt(process.env.DATABASE_PORT || '5432'),
    //   username: process.env.DATABASE_USERNAME || 'postgres',
    //   password: process.env.DATABASE_PASSWORD || 'postgres',
    //   database: process.env.DATABASE_NAME || 'booking_api',
    //   entities: [User, Journey, Vehicle],
    //   synchronize: true,
    // }),
    DatabaseModule,
    UserModule,
    VehicleModule,
    JourneyModule,
    UnassignedJourneyModule
  ],
})
export class AppModule {}
