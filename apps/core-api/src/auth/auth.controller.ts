import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterClientDto } from './dto/register-client.dto';
import { RegisterDriverDto } from './dto/register-driver.dto';

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
}
