import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { UserRole } from '../../../../../libs/common/src/enums/user-role.enum';
import {
  AuthProvider,
  HASHING_SERVICE_TOKEN,
  IHashingService,
} from '@app/common';
import { CreateCompanyAdminDto } from './dto/create-company-admin.dto';
import { Company } from '../companies/entities/company.entity';
import { DriverProfile } from './entities/driver-profile.entity';
import { CreateDriverDto } from './dto/create-driver.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @Inject(HASHING_SERVICE_TOKEN)
    private readonly hashingService: IHashingService,
    private readonly dataSource: DataSource,
  ) {}

  async createCompanyAdmin(
    dto: CreateCompanyAdminDto,
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

  async createDriver(dto: CreateDriverDto, companyId: string) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const txCompanyRepo = queryRunner.manager.getRepository(Company);
      const txUserRepo = queryRunner.manager.getRepository(User);
      const txProfileRepo = queryRunner.manager.getRepository(DriverProfile);

      const company = await txCompanyRepo.findOne({ where: { id: companyId } });

      if (!company) throw new NotFoundException('Empresa no válida');

      // Enviar credenciales por correo al driver en version mas avanzada
      const tempPassword = 'ZenDriver123!'; // Solo por mvp, No estara hardcodeada en version mas avanzada
      const hashedPassword = await this.hashingService.hash(tempPassword);

      const newUser = txUserRepo.create({
        fullName: dto.fullName,
        email: dto.email,
        phone: dto.phone || null,
        password: hashedPassword,
        role: UserRole.DRIVER,
        authProvider: AuthProvider.LOCAL,
        company: company,
      });

      const savedUser = await txUserRepo.save(newUser);

      const newProfile = txProfileRepo.create({
        user: savedUser,
        rut: dto.rut || null,
        employeeId: dto.employeeId || null,
      });

      await txProfileRepo.save(newProfile);

      await queryRunner.commitTransaction();

      return {
        driver: {
          id: savedUser.id,
          email: savedUser.email,
          fullName: savedUser.fullName,
        },
        tempPassword: tempPassword,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

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
