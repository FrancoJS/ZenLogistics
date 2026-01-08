import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterClientDto } from './dto/register-client.dto';
import { RegisterDriverDto } from './dto/register-driver.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { RefreshTokenGuard } from './guards/refresh-token.guard';
import { IRefreshTokenPayload } from './interfaces/refresh-jwt-payload';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { GetUser } from '@app/common';
import { IActiveUser } from '@app/common';

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
  async login(@GetUser() user: IActiveUser) {
    return await this.authService.login(user);
  }

  @UseGuards(RefreshTokenGuard)
  @Post('refresh')
  async refreshTokens(
    @GetUser<IRefreshTokenPayload>('sub') userId: string,
    @GetUser<IRefreshTokenPayload>('refreshToken') refreshToken: string,
  ) {
    return await this.authService.refreshTokens(userId, refreshToken);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@GetUser() user: IActiveUser) {
    return user;
  }
}
