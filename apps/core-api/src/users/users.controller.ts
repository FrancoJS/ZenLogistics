import { Body, Controller, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateDriverDto } from './dto/create-driver.dto';
import { GetUser, IActiveUser, UserRole } from '@app/common';
import { ApiTags } from '@nestjs/swagger';
import { Auth } from '@app/common/decorators/auth.decorator';

@ApiTags('Users')
@Auth(UserRole.COMPANY_ADMIN)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('drivers')
  async createDriver(
    @Body() dto: CreateDriverDto,
    @GetUser() user: IActiveUser,
  ) {
    return this.usersService.createDriver(dto, user.companyId!);
  }
}
