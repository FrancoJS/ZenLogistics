import { applyDecorators, UseGuards } from '@nestjs/common';
import { UserRole } from '../enums/user-role.enum';
import { Roles } from './roles.decorator';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { ApiBearerAuth, ApiForbiddenResponse } from '@nestjs/swagger';

export function Auth(...roles: UserRole[]) {
  return applyDecorators(
    Roles(...roles),
    UseGuards(JwtAuthGuard, RolesGuard),
    ApiBearerAuth(),
    ApiForbiddenResponse({ description: 'No estas autorizado' }),
  );
}
