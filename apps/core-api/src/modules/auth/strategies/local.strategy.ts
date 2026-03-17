import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      usernameField: 'email',
      passwordField: 'password',
    });
  }

  async validate(email: string, password: string) {
    const cleanEmail = email.trim().toLowerCase();

    const user = await this.authService.validateUser(cleanEmail, password);

    if (!user) {
      throw new UnauthorizedException('Usuario o contraseña incorrectas');
    }

    const activeUser = {
      id: user.id,
      email: user.email,
      role: user.role,
      driverId: user.driverProfile?.id,
      tokenVersion: user.tokenVersion,
    };

    return activeUser;
  }
}
