import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { TransformFnParams } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsStrongPassword,
  Matches,
  MinLength,
} from 'class-validator';

export class RegisterClientDto {
  @ApiProperty({
    example: 'Juan Pérez',
  })
  @Transform(({ value }) => {
    return typeof value === 'string' ? value.trim() : (value as string);
  })
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @ApiProperty({
    example: 'example@example.com',
  })
  @Transform(({ value }: TransformFnParams) => {
    return typeof value === 'string'
      ? value.trim().toLowerCase()
      : (value as string);
  })
  @IsNotEmpty()
  @IsEmail({}, { message: 'El correo electrónico no es válido' })
  email: string;

  @ApiProperty({
    example: 'ClaveSegura123!',
    minLength: 8,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
  @IsStrongPassword(
    {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    },
    {
      message:
        'La contraseña no es lo suficientemente fuerte. Debe incluir al menos una letra mayúscula, una letra minúscula, un número y un símbolo.',
    },
  )
  password: string;

  @ApiProperty({
    example: '+56912345678',
    required: false,
  })
  @Matches(/^\+569[0-9]{8}$/, {
    message: 'El teléfono debe tener formato chileno válido (Ej: +56912345678)',
  })
  @IsString()
  @IsOptional()
  phone?: string;
}
