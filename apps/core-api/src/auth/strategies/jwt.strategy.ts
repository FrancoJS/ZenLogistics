import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from '../../users/users.service';
import { ConfigService } from '@nestjs/config';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { IJwtPayload } from '../interfaces/jwt-payload';
import { CacheService, IActiveUser } from '@app/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly userService: UsersService,
    configService: ConfigService,
    private readonly cacheService: CacheService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow<string>('JWT_SECRET'),
    });
  }

  async validate(payload: IJwtPayload) {
    const { sub: id, ver: tokenVersion } = payload;

    const cacheKey = `user:active:${id}`;

    const cachedUser = await this.cacheService.get<IActiveUser>(cacheKey);

    if (cachedUser) {
      if (cachedUser.tokenVersion === tokenVersion) {
        return cachedUser;
      }

      await this.cacheService.del(cacheKey);
    }

    const user = await this.userService.findForJwtValidate(id);

    if (!user) throw new UnauthorizedException('Token no valido');

    if (tokenVersion !== user.tokenVersion) {
      throw new UnauthorizedException('Sesión caducada');
    }

    const activeUser: IActiveUser = {
      id: user.id,
      email: user.email,
      role: user.role,
      driverId: user.driverProfile?.id,
      tokenVersion: user.tokenVersion,
      companyId: user.companyId,
    };

    void this.cacheService.set<IActiveUser>(cacheKey, activeUser, 900);

    return activeUser;
  }
}
