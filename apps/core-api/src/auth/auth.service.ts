import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { RegisterClientDto } from './dto/register-client.dto';
import { RegisterDriverDto } from './dto/register-driver.dto';
import { AuthProvider } from '../../../../libs/common/src/enums/auth-provider.enum';
import { JwtService } from '@nestjs/jwt';
import { IJwtPayload } from './interfaces/jwt-payload';
import { ConfigService } from '@nestjs/config';
import {
  HASHING_SERVICE_TOKEN,
  IActiveUser,
  IHashingService,
} from '@app/common';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @Inject(HASHING_SERVICE_TOKEN)
    private readonly hashingService: IHashingService,
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

    if (user && (await this.hashingService.compare(password, user.password))) {
      const { password, ...result } = user;

      return result;
    }

    return null;
  }

  async registerClient(registerClientDto: RegisterClientDto) {
    const user = await this.userService.createClient({
      ...registerClientDto,
      authProvider: AuthProvider.LOCAL,
    });

    const activeUser: IActiveUser = {
      id: user.id,
      email: user.email,
      role: user.role,
      driverId: user.driverProfile?.id,
      tokenVersion: user.tokenVersion,
    };

    const tokens = await this.getTokens(activeUser);

    await this.updateRefreshTokenHash(user.id, tokens.refreshToken);

    return {
      user,
      tokens,
    };
  }

  async registerDriver(registerDriverDto: RegisterDriverDto) {
    const user = await this.userService.createDriver({
      ...registerDriverDto,
      authProvider: AuthProvider.LOCAL,
    });

    const activeUser: IActiveUser = {
      id: user.id,
      email: user.email,
      role: user.role,
      driverId: user.driverProfile?.id,
      tokenVersion: user.tokenVersion,
    };

    const tokens = await this.getTokens(activeUser);

    await this.updateRefreshTokenHash(user.id, tokens.refreshToken);

    return {
      user,
      tokens,
    };
  }

  private async getTokens(user: IActiveUser) {
    const payload: IJwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      ver: user.tokenVersion,
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
    };

    const tokens = await this.getTokens(activeUser);

    await this.updateRefreshTokenHash(user.id, tokens.refreshToken);

    return tokens;
  }
}
