import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { UserRole } from '../enums/user-role.enum';
import { IActiveUser } from '../interfaces/active-user.interface';

import { Request } from 'express';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    //Supongo que es publica ya que ni la clase ni el metodo tienen roles permitidos
    if (!requiredRoles) {
      return true;
    }

    const request: Request = context.switchToHttp().getRequest();

    const user = request.user as IActiveUser;

    return requiredRoles.includes(user.role);
  }
}
