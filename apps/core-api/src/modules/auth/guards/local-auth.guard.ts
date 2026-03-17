import { BadRequestException, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { plainToInstance } from 'class-transformer';
import { Request } from 'express';
import { LoginUserDto } from '../dto/login-user.dto';
import { validate } from 'class-validator';

export class LocalAuthGuard extends AuthGuard('local') {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();

    const loginDto = plainToInstance(LoginUserDto, request.body);

    const errors = await validate(loginDto);

    if (errors.length > 0) {
      const messages = errors.map((err) =>
        Object.values(err.constraints || {}).join(', '),
      );
      throw new BadRequestException(messages);
    }

    request.body = loginDto;

    return super.canActivate(context) as Promise<boolean>;
  }
}
