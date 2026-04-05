import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VehiclesService } from './vehicles.service';
import { VehiclesController } from './vehicles.controller';
import { Vehicle } from './entities/vehicle.entity';
import { DriverProfile } from '../users/entities/driver-profile.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Vehicle, DriverProfile])],
  controllers: [VehiclesController],
  providers: [VehiclesService],
})
export class VehiclesModule {}
