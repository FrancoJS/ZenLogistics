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

export class RegisterCompanyDto {
  @ApiProperty({
    example: 'Transportes Express Ltda.',
    description: 'Razón social de la empresa',
  })
  @Transform(({ value }: TransformFnParams) => {
    return typeof value === 'string' ? value.trim() : (value as string);
  })
  @IsString()
  @IsNotEmpty()
  companyName: string;

  @ApiProperty({
    example: '76.123.456-K',
    description: 'RUT de la empresa',
  })
  @IsString()
  @IsNotEmpty()
  companyRut: string;

  @ApiProperty({
    example: 'Av. Siempre Viva 742',
    description: 'Dirección de la empresa',
    required: false,
  })
  @IsString()
  @IsOptional()
  companyAddress?: string;

  // Usuario administrador de la empresa
  @ApiProperty({
    example: 'Juan Pérez',
    description: 'Nombre del administrador',
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
