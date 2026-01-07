import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterClientDto } from './dto/register-client.dto';
import { RegisterDriverDto } from './dto/register-driver.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { IActiveUser } from './interfaces/active-user.interface';
import { RefreshTokenGuard } from './guards/refresh-token.guard';
import { GetUser } from './decorators/get-user.decorator';
import { IRefreshTokenPayload } from './interfaces/refresh-jwt-payload';
import { LoginUserDto } from './dto/login-user.dto';
import { ref } from 'process';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

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
  async login(@Body() loginDto: LoginUserDto, @GetUser() user: IActiveUser) {
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
