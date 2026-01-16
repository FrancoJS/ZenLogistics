import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCompanyDto {
  @ApiProperty({ example: 'Transportes Rápidos Ltda' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: '76.123.456-K' })
  @IsString()
  @IsNotEmpty()
  rut: string;

  @ApiProperty({ example: 'Av. Siempre Viva 123', required: false })
  @IsString()
  @IsOptional()
  address?: string;
}
