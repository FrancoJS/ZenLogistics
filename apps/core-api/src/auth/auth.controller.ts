import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterLocalClientDto } from './dto/register-company.dto';
import { RegisterLocalDriverDto } from '../users/dto/register-driver.dto';
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
  async registerLocalClient(@Body() dto: RegisterLocalClientDto) {
    return await this.authService.registerLocalClient(dto);
  }

  @Post('register/driver')
  async registerLocalDriver(@Body() dto: RegisterLocalDriverDto) {
    return await this.authService.registerLocalDriver(dto);
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
