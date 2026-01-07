import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from '../../users/users.service';
import { ConfigService } from '@nestjs/config';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { IJwtPayload } from '../interfaces/jwt-payload';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly userService: UsersService,
    configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow<string>('JWT_SECRET'),
    });
  }

  async validate(payload: IJwtPayload) {
    const { sub: id, ver: tokenVersion } = payload;

    const user = await this.userService.findForJwtValidate(id);

    if (!user) throw new UnauthorizedException('Token no valido');

    if (tokenVersion !== user.tokenVersion) {
      throw new UnauthorizedException('Sesión caducada');
    }

    return {
      id: user.id,
      email: user.email,
      role: user.role,
      driverId: user.driverProfile?.id,
      tokenVersion: user.tokenVersion,
    };
  }
}
