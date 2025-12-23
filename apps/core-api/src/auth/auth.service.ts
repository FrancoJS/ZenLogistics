import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { RegisterClientDto } from './dto/register-client.dto';
import { AuthProvider } from '../users/enums/user-role.enum';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UsersService) {}

  async registerClient(registerClientDto: RegisterClientDto) {
    return await this.userService.createClient({
      ...registerClientDto,
      authProvider: AuthProvider.LOCAL,
    });
  }
}
