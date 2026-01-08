import {
  createParamDecorator,
  ExecutionContext,
  InternalServerErrorException,
} from '@nestjs/common';
import { Request } from 'express';
import { IActiveUser } from '../interfaces/active-user.interface';

export const GetUser = createParamDecorator(
  <T = IActiveUser>(data: keyof T | undefined, context: ExecutionContext) => {
    const request: Request = context.switchToHttp().getRequest();
    const user = request.user as T;

    if (!user) return null;
    if (!data) return user;

    if (!(data in (user as object))) {
      throw new InternalServerErrorException(
        `La propiedad '${String(data)}' no existe en el objeto User (GetUser Decorator)`,
      );
    }

    return user[data];
  },
);
