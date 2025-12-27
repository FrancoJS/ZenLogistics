import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { RegisterClientDto } from './dto/register-client.dto';
import { RegisterDriverDto } from './dto/register-driver.dto';
import { AuthProvider } from '../users/enums/auth-provider.enum';
import { JwtService } from '@nestjs/jwt';
import { IJwtPayload } from './interfaces/jwt-payload';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  private getJwtToken(payload: IJwtPayload) {
    return this.jwtService.sign(payload);
  }

  async validateUser(email: string, password: string) {
    const user = await this.userService.findOneByEmail(email);

    if (user && (await bcrypt.compare(password, user.password))) {
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
