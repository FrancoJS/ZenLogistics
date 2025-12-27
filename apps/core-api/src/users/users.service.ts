import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { ICreateClientParams } from './interfaces/create-client-params.interface';
import { ICreateDriverParams } from './interfaces/create-driver-params.interface';
import { DriverProfile } from './entities/driver.entity';
import { UserRole } from './enums/user-role.enum';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createClient(params: ICreateClientParams) {
    const user = this.userRepository.create({
      ...params,
      role: UserRole.CLIENT,
    });

    return await this.userRepository.save(user);
  }

  async createDriver(params: ICreateDriverParams) {
    const { rut, documents, ...userData } = params;

    const licenseNumber = rut;
    const driverProfile = new DriverProfile();

    driverProfile.rut = rut;
    driverProfile.licenseNumber = licenseNumber;

    if (documents) {
      driverProfile.documents = documents;
    }

    const user = this.userRepository.create({
      ...userData,
      role: UserRole.DRIVER,
    });

    user.driverProfile = driverProfile;
    driverProfile.user = user;

    return await this.userRepository.save(user);
  }

  async findOneByEmail(email: string) {
    return this.userRepository
      .createQueryBuilder('user')
      .where('user.email = :email', { email })
      .addSelect('user.password')
      .getOne();
  }
}
