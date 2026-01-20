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

export class RegisterCompanyDto {
  /**
   * Razón social de la empresa
   * @example 'Transportes Express Ltda.'
   */
  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim() : (value as string),
  )
  @IsString()
  @IsNotEmpty()
  companyName: string;

  /**
   * RUT de la empresa (Identificador fiscal)
   * @example '76.123.456-K'
   */
  @IsString()
  @IsNotEmpty()
  companyRut: string;

  /**
   * Dirección física de la casa matriz
   * @example 'Av. Siempre Viva 742'
   */
  @IsString()
  @IsOptional()
  companyAddress?: string; // 👈 El signo '?' le dice a Swagger que no es required

  // --- Datos del Admin ---

  /**
   * Nombre completo del administrador
   * @example 'Juan Pérez'
   */
  @IsString()
  @IsNotEmpty()
  fullName: string;

  /**
   * Correo electrónico corporativo
   * @example 'admin@transportes.cl'
   */
  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim().toLowerCase() : (value as string),
  )
  @IsEmail({}, { message: 'El correo electrónico no es válido' })
  @IsNotEmpty()
  email: string;

  /**
   * Contraseña segura para la cuenta
   * @example 'ClaveSegura123!'
   */
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
   * Teléfono de contacto con formato chileno
   * @example '+56912345678'
   */
  @Matches(/^\+569[0-9]{8}$/, {
    message: 'El teléfono debe tener formato chileno válido (Ej: +56912345678)',
  })
  @IsString()
  @IsOptional()
  phone?: string;
}
