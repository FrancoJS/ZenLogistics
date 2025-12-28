import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { IActiveUser } from '../interfaces/active-user.interface';
import { Request } from 'express';

export const ActiveUser = createParamDecorator(
  (data: unknown, context: ExecutionContext): IActiveUser => {
    const request: Request = context.switchToHttp().getRequest();

    return request.user as IActiveUser;
  },
);
