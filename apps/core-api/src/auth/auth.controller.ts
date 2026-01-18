import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterCompanyDto } from './dto/register-company.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { RefreshTokenGuard } from './guards/refresh-token.guard';
import { IRefreshTokenPayload } from '@app/common';
import { JwtAuthGuard } from '@app/common';
import { GetUser } from '@app/common';
import { IActiveUser } from '@app/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoginUserDto } from './dto/login-user.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register-company')
  @ApiOperation({
    summary: 'Registrar una nueva empresa + Admin',
    description: 'Crear una nueva empresa y su usuario administrador',
  })
  @ApiResponse({
    status: 201,
    description: 'Empresa y usuario administrador creados exitosamente',
  })
  async registerCompany(@Body() dto: RegisterCompanyDto) {
    return await this.authService.registerCompany(dto);
  }

  @Post('login')
  @ApiOperation({
    summary: 'Login de usuario',
    description: 'Autenticar un usuario y obtener tokens de acceso y refresco',
  })
  @ApiResponse({
    status: 200,
    description: 'Login exitoso, devuelve los access y refresh tokens',
  })
  @UseGuards(LocalAuthGuard)
  async login(@GetUser() user: IActiveUser, @Body() dto: LoginUserDto) {
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
