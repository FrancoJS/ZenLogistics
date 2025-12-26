import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { RegisterClientDto } from './dto/register-client.dto';
import { RegisterDriverDto } from './dto/register-driver.dto';
import { AuthProvider } from '../users/enums/auth-provider.enum';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UsersService) {}

  async registerClient(registerClientDto: RegisterClientDto) {
    return await this.userService.createClient({
      ...registerClientDto,
      authProvider: AuthProvider.LOCAL,
    });
  }

  async registerDriver(registerDriverDto: RegisterDriverDto) {
    return await this.userService.createDriver({
      ...registerDriverDto,
      authProvider: AuthProvider.LOCAL,
    });
  }
}
