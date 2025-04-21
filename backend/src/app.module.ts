import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { UserModule } from './user/user.module';
import { VehicleModule } from './vehicles/vehicle.module';
import { JourneyModule } from './journeys/journey.module';

@Module({
  imports: [
    DatabaseModule,
    UserModule,
    VehicleModule,
    JourneyModule,
  ],
})
export class AppModule {}
