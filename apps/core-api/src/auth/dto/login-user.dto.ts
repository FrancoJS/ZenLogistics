import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class LoginUserDto {
  /**
   * Correo electrónico registrado
   * @example 'admin@example.com'
   */
  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim().toLowerCase() : (value as string),
  )
  @IsNotEmpty()
  @IsEmail({}, { message: 'El correo electrónico no es válido' })
  email: string;

  /**
   * Contraseña de acceso
   * @example 'ClaveSegura123!'
   */
  @IsString()
  @IsNotEmpty()
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
  password: string;
}
