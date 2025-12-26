import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { TransformFnParams } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsStrongPassword,
  Matches,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { DriverDocumentsDto } from '../../users/dto/driver-documents.dto';

export class RegisterDriverDto {
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
    example: 'ClaveSegura123!',
    required: true,
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
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiProperty({
    example: '12345678k',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => {
    if (typeof value !== 'string') return value as string;

    return value.replace(/[^0-9kK]/g, '').toUpperCase();
  })
  @Matches(/^[0-9]{7,8}[0-9K]$/, {
    message: 'El formato del RUT no es válido (ej: 12345678K)',
  })
  rut: string;

  @ApiProperty({
    description: 'Documentos del conductor para verificación',
    type: () => DriverDocumentsDto,
    required: false,
  })
  @IsOptional()
  @Type(() => DriverDocumentsDto)
  @ValidateNested()
  documents?: DriverDocumentsDto;
}
