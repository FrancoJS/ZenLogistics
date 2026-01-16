import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { EntityManager, Repository } from 'typeorm';

import { DriverProfile } from './entities/driver-profile.entity';
import { UserRole } from '../../../../libs/common/src/enums/user-role.enum';
import {
  AuthProvider,
  HASHING_SERVICE_TOKEN,
  IHashingService,
} from '@app/common';
import { CompanyAdminDto } from './dto/company-admin.dto';
import { Company } from '../companies/entities/company.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @Inject(HASHING_SERVICE_TOKEN)
    private readonly hashingService: IHashingService,
  ) {}

  async createCompanyAdmin(
    dto: CompanyAdminDto,
    company: Company,
    manager?: EntityManager,
  ): Promise<User> {
    const repo = manager ? manager.getRepository(User) : this.userRepository;

    const hashedPassword = await this.hashingService.hash(dto.password);

    const newAdmin = repo.create({
      ...dto,
      password: hashedPassword,
      company: company,
      role: UserRole.COMPANY_ADMIN,
      authProvider: AuthProvider.LOCAL,
      isEmailVerified: false,
    });

    return repo.save(newAdmin);
  }

  // async createLocalDriver(params: ICreateLocalDriverParams) {
  //   const { rut, documents, ...userData } = params;

  //   const licenseNumber = rut;
  //   const driverProfile = new DriverProfile();

  //   driverProfile.rut = rut;
  //   driverProfile.licenseNumber = licenseNumber;

  //   if (documents) {
  //     driverProfile.documents = documents;
  //   }

  //   const hashedPassword = await this.hashingService.hash(params.password);
  //   const user = this.userRepository.create({
  //     ...userData,
  //     password: hashedPassword,
  //     role: UserRole.DRIVER,
  //   });

  //   user.driverProfile = driverProfile;
  //   driverProfile.user = user;

  //   return await this.userRepository.save(user);
  // }

  async findForLogin(email: string) {
    return this.userRepository
      .createQueryBuilder('user')
      .where('user.email = :email', { email })
      .addSelect('user.password')
      .addSelect('user.tokenVersion')
      .leftJoin('user.driverProfile', 'driverProfile')
      .addSelect(['driverProfile.id'])
      .getOne();
  }

  async findForJwtValidate(userId: string) {
    return this.userRepository
      .createQueryBuilder('user')
      .where('user.id = :id', { id: userId })
      .addSelect('user.tokenVersion')
      .leftJoin('user.driverProfile', 'driverProfile')
      .addSelect(['driverProfile.id'])
      .getOne();
  }

  async findForJwtRefresh(userId: string) {
    return this.userRepository
      .createQueryBuilder('user')
      .where('user.id = :id', { id: userId })
      .addSelect('user.refreshToken')
      .addSelect('user.tokenVersion')
      .leftJoin('user.driverProfile', 'driverProfile')
      .addSelect(['driverProfile.id'])
      .getOne();
  }

  async findOneById(id: string) {
    return await this.userRepository.findOne({
      where: { id },
      relations: ['driverProfile'],
    });
  }

  async setRefreshToken(refreshTokenHash: string, userId: string) {
    const updateResult = await this.userRepository.update(userId, {
      refreshToken: refreshTokenHash,
    });

    if (updateResult.affected === 0) {
      throw new NotFoundException('No se puedo actualizar el token');
    }
  }

  // async removeRefreshToken(userId: string) {
  //   return await this.userRepository.update(userId, {
  //     refreshToken: null,
  //   });
  // }
}
