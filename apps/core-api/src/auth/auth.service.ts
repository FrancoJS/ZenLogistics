import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { IJwtPayload } from './interfaces/jwt-payload';
import { ConfigService } from '@nestjs/config';
import {
  HASHING_SERVICE_TOKEN,
  IActiveUser,
  IHashingService,
} from '@app/common';
import { RegisterCompanyDto } from './dto/register-company.dto';
import { CompaniesService } from '../companies/companies.service';
import { DataSource } from 'typeorm';
import { CreateCompanyDto } from '../companies/dto/create-company.dto';
import { CreateCompanyAdminDto } from '../users/dto/create-company-admin.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly companiesService: CompaniesService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @Inject(HASHING_SERVICE_TOKEN)
    private readonly hashingService: IHashingService,
    private readonly dataSource: DataSource,
  ) {}

  async login(user: IActiveUser) {
    const { accessToken, refreshToken } = await this.getTokens(user);

    await this.updateRefreshTokenHash(user.id, refreshToken);

    return {
      accessToken,
      refreshToken,
      user,
    };
  }

  async validateUser(email: string, password: string) {
    const user = await this.userService.findForLogin(email);

    if (!user?.password || !user) {
      return null;
    }

    if (await this.hashingService.compare(password, user.password)) {
      const { password, ...result } = user;

      return result;
    }
  }

  async registerCompany(dto: RegisterCompanyDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const createCompanyData: CreateCompanyDto = {
        name: dto.companyName,
        rut: dto.companyRut,
        address: dto.companyAddress,
      };

      const savedCompany = await this.companiesService.create(
        createCompanyData,
        queryRunner.manager,
      );

      const companyAdminData: CreateCompanyAdminDto = {
        fullName: dto.fullName,
        email: dto.email,
        password: dto.password,
        phone: dto.phone,
      };

      const newAdmin = await this.userService.createCompanyAdmin(
        companyAdminData,
        savedCompany,
        queryRunner.manager,
      );

      await queryRunner.commitTransaction();

      const activeUser: IActiveUser = {
        id: newAdmin.id,
        email: newAdmin.email,
        role: newAdmin.role,
        driverId: newAdmin.driverProfile?.id,
        tokenVersion: newAdmin.tokenVersion,
        companyId: newAdmin.companyId,
      };

      const tokens = await this.getTokens(activeUser);

      await this.updateRefreshTokenHash(newAdmin.id, tokens.refreshToken);
      return {
        message: 'Empresa Creada con exito',
        company: savedCompany,
        companyAdmin: newAdmin,
        tokens,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      // Libera la conexion
      await queryRunner.release();
    }
  }

  private async getTokens(user: IActiveUser) {
    const payload: IJwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      ver: user.tokenVersion,
      companyId: user.companyId,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload),

      this.jwtService.signAsync(payload, {
        secret: this.configService.getOrThrow<string>('JWT_REFRESH'),
        expiresIn: this.configService.getOrThrow('JWT_REFRESH_EXP'),
      }),
    ]);

    return { accessToken, refreshToken };
  }

  private async updateRefreshTokenHash(userId: string, refreshToken: string) {
    const hash = await this.hashingService.hash(refreshToken);

    await this.userService.setRefreshToken(hash, userId);
  }

  async refreshTokens(userId: string, refreshToken: string) {
    const user = await this.userService.findForJwtRefresh(userId);

    if (!user || !user.refreshToken) {
      throw new ForbiddenException('Acceso denegado');
    }

    const refreshTokenMatches = await this.hashingService.compare(
      refreshToken,
      user.refreshToken,
    );

    if (!refreshTokenMatches) {
      throw new ForbiddenException('Acceso denegado: Token inválido');
    }

    const activeUser: IActiveUser = {
      id: user.id,
      email: user.email,
      role: user.role,
      driverId: user.driverProfile?.id,
      tokenVersion: user.tokenVersion,
      companyId: user.companyId,
    };

    const tokens = await this.getTokens(activeUser);

    await this.updateRefreshTokenHash(user.id, tokens.refreshToken);

    return tokens;
  }
}
