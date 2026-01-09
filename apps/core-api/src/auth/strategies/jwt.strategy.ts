import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from '../../users/users.service';
import { ConfigService } from '@nestjs/config';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { IJwtPayload } from '../interfaces/jwt-payload';
import Redis from 'ioredis';
import { IActiveUser, REDIS_CLIENT } from '@app/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly userService: UsersService,
    configService: ConfigService,
    @Inject(REDIS_CLIENT)
    private readonly redis: Redis,
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

    const cachedUserJson = await this.redis.get(cacheKey);

    if (cachedUserJson) {
      const cachedUser: IActiveUser = JSON.parse(cachedUserJson) as IActiveUser;

      if (cachedUser.tokenVersion === tokenVersion) return cachedUser;

      await this.redis.del(cacheKey);
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
    };

    await this.redis.set(cacheKey, JSON.stringify(activeUser), 'EX', 900);

    return activeUser;
  }
}
