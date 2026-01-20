import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateDriverDto } from './dto/create-driver.dto';
import { GetUser, IActiveUser, UserRole } from '@app/common';
import { Auth } from '@app/common/decorators/auth.decorator';

@ApiTags('Users')
@Auth(UserRole.COMPANY_ADMIN)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * Crear un nuevo conductor
   * * Registra un nuevo conductor asociado a la empresa del administrador que realiza la petición.
   * Valida que el RUT no exista previamente y asigna el rol de conductor.
   */
  @Post('drivers')
  async createDriver(
    @Body() dto: CreateDriverDto,
    @GetUser() user: IActiveUser,
  ) {
    return this.usersService.createDriver(dto, user.companyId!);
  }
}
