import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCompanyDto {
  /**
   * Nombre o Razón Social de la empresa
   * @example 'Transportes Rápidos Ltda'
   */
  @IsString()
  @IsNotEmpty()
  name: string;

  /**
   * Identificador tributario (RUT)
   * @example '76.123.456-K'
   */
  @IsString()
  @IsNotEmpty()
  rut: string;

  /**
   * Dirección comercial
   * @example 'Av. Siempre Viva 123'
   */
  @IsString()
  @IsOptional()
  address?: string;
}
