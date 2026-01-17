import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { TransformFnParams } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';

export class CreateDriverDto {
  @ApiProperty({
    example: 'Juan Pérez',
    required: true,
  })
  @Transform(({ value }) => {
    return typeof value === 'string' ? value.trim() : (value as string);
  })
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @ApiProperty({
    example: 'example@example.com',
    required: true,
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
    example: '+56912345678',
    required: false,
  })
  @IsString()
  @IsOptional()
  @Matches(/^\+569[0-9]{8}$/, {
    message: 'El teléfono debe tener formato chileno válido (Ej: +56912345678)',
  })
  phone?: string;
  @ApiProperty({
    example: '12345678k',
    required: false,
  })
  @IsString()
  @IsOptional()
  @Transform(({ value }) => {
    if (typeof value !== 'string') return value as string;

    return value.replace(/[^0-9kK]/g, '').toUpperCase();
  })
  @Matches(/^[0-9]{7,8}[0-9K]$/, {
    message: 'El formato del RUT no es válido (ej: 12345678K)',
  })
  rut?: string;

  @ApiProperty({
    example: 'EMP-001',
    description: 'Código interno de empleado',
    required: false,
  })
  @IsString()
  @IsOptional()
  employeeId?: string;
}
