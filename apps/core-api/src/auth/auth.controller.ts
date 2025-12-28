import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterClientDto } from './dto/register-client.dto';
import { RegisterDriverDto } from './dto/register-driver.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { ActiveUser } from './decorators/active-user.decorator';
import { IActiveUser } from './interfaces/active-user.interface';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register/client')
  async registerClient(@Body() registerClientDto: RegisterClientDto) {
    return await this.authService.registerClient(registerClientDto);
  }

  @Post('register/driver')
  async registerDriver(@Body() registerDriverDto: RegisterDriverDto) {
    return await this.authService.registerDriver(registerDriverDto);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@ActiveUser() user: IActiveUser) {
    return await this.authService.login(user);
  }
}
