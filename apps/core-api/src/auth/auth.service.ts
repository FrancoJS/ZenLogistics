import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { RegisterClientDto } from './dto/register-client.dto';
import { RegisterDriverDto } from './dto/register-driver.dto';
import { AuthProvider } from '../users/enums/auth-provider.enum';
import { JwtService } from '@nestjs/jwt';
import { IJwtPayload } from './interfaces/jwt-payload';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  private getJwtToken(payload: IJwtPayload) {
    return this.jwtService.sign(payload);
  }

  async registerClient(registerClientDto: RegisterClientDto) {
    const user = await this.userService.createClient({
      ...registerClientDto,
      authProvider: AuthProvider.LOCAL,
    });

    const token = this.getJwtToken({
      sub: user.id,
      email: user.email,
      role: user.role,
    });

    return {
      user,
      token,
    };
  }

  async registerDriver(registerDriverDto: RegisterDriverDto) {
    const user = await this.userService.createDriver({
      ...registerDriverDto,
      authProvider: AuthProvider.LOCAL,
    });

    const token = this.getJwtToken({
      sub: user.id,
      email: user.email,
      role: user.role,
    });

    return {
      user,
      token,
    };
  }
}
