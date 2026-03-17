import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger'; // Solo conservamos este para agrupar
import { AuthService } from './auth.service';
import { RegisterCompanyDto } from './dto/register-company.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { RefreshTokenGuard } from './guards/refresh-token.guard';
import {
  IRefreshTokenPayload,
  JwtAuthGuard,
  GetUser,
  IActiveUser,
} from '@app/common';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Registrar una nueva empresa y su administrador
   * * Crea la estructura base de la organización y el usuario root.
   */
  @Post('register-company')
  // IMPORTANTE: Tipar el retorno para que Swagger sepa qué mostrar
  async registerCompany(@Body() dto: RegisterCompanyDto) {
    return this.authService.registerCompany(dto);
  }

  /**
   * Iniciar sesión
   * * Autentica credenciales y devuelve tokens de acceso.
   */
  @HttpCode(HttpStatus.OK) // 👈 Forzamos 200, porque @Post por defecto es 201
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(
    @GetUser() user: IActiveUser,
    // Mantenemos el Body aunque LocalGuard lo lea, para que aparezca en Swagger
    @Body() dto: LoginUserDto,
  ) {
    return this.authService.login(user);
  }

  /**
   * Refrescar tokens de acceso
   * * Usa el Refresh Token para obtener un nuevo Access Token sin loguearse.
   */
  @UseGuards(RefreshTokenGuard)
  @Post('refresh')
  async refreshTokens(
    @GetUser<IRefreshTokenPayload>('sub') userId: string,
    @GetUser<IRefreshTokenPayload>('refreshToken') refreshToken: string,
  ) {
    return this.authService.refreshTokens(userId, refreshToken);
  }

  /**
   * Perfil del usuario actual
   */
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@GetUser() user: IActiveUser) {
    return user;
  }
}
