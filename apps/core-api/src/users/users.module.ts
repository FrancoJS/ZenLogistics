import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { DriverProfile } from './entities/driver.entity';
import { HashingModule } from '@app/common';

@Module({
  imports: [TypeOrmModule.forFeature([User, DriverProfile]), HashingModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
