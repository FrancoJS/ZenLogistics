import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';

export class CreateDriverDto {
  /**
   * Nombre completo del conductor
   * @example 'Juan Pérez'
   */
  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim() : (value as string),
  )
  @IsString()
  @IsNotEmpty()
  fullName: string;

  /**
   * Correo electrónico de contacto
   * @example 'example@example.com'
   */
  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim().toLowerCase() : (value as string),
  )
  @IsNotEmpty()
  @IsEmail({}, { message: 'El correo electrónico no es válido' })
  email: string;

  /**
   * Teléfono móvil (Formato Chile)
   * @example '+56912345678'
   */
  @IsString()
  @IsOptional()
  @Matches(/^\+569[0-9]{8}$/, {
    message: 'El teléfono debe tener formato chileno válido (Ej: +56912345678)',
  })
  phone?: string;

  /**
   * RUT del conductor (Sin puntos ni guión)
   * Se formatea automáticamente a mayúsculas y sin caracteres especiales.
   * @example '12345678K'
   */
  @Transform(({ value }) => {
    if (typeof value !== 'string') return value as string;
    // Elimina todo lo que no sea número o K, y lo pasa a mayúsculas
    return value.replace(/[^0-9kK]/g, '').toUpperCase();
  })
  @IsString()
  @IsOptional()
  @Matches(/^[0-9]{7,8}[0-9K]$/, {
    message: 'El formato del RUT no es válido (ej: 12345678K)',
  })
  rut?: string;

  /**
   * Código interno de empleado
   * @example 'EMP-001'
   */
  @IsString()
  @IsOptional()
  employeeId?: string;
}
