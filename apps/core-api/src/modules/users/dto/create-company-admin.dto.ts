import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsStrongPassword,
  Matches,
  MinLength,
} from 'class-validator';

export class CreateCompanyAdminDto {
  /**
   * Nombre completo del administrador
   * @example 'Juan Pérez'
   */
  @IsString()
  @IsNotEmpty()
  fullName: string;

  /**
   * Correo electrónico corporativo
   * @example 'example@example.com'
   */
  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim().toLowerCase() : (value as string),
  )
  @IsNotEmpty()
  @IsEmail({}, { message: 'El correo electrónico no es válido' })
  email: string;

  /**
   * Contraseña segura
   * @example 'ClaveSegura123!'
   */
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
        'La contraseña debe incluir mayúscula, minúscula, número y símbolo.',
    },
  )
  password: string;

  /**
   * Teléfono de contacto (Formato Chile)
   * @example '+56912345678'
   */
  @Matches(/^\+569[0-9]{8}$/, {
    message: 'El teléfono debe tener formato chileno válido (Ej: +56912345678)',
  })
  @IsString()
  @IsOptional()
  phone?: string;
}
