import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';
import { VehicleType } from '../entities/vehicle.entity';

export class CreateVehicleDto {
  @ApiProperty({
    example: 'ABCD12',
    description: 'Patente del vehiculo. Se normaliza a mayusculas.',
  })
  @IsString()
  plate: string;

  @ApiProperty({ enum: VehicleType, example: VehicleType.TRUCK })
  @IsEnum(VehicleType)
  type: VehicleType;

  @ApiProperty({ example: 3500, description: 'Capacidad maxima en kilogramos' })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  capacity_kg: number;

  @ApiPropertyOptional({
    example: '69052fd4-915f-44d9-a315-ecbb8ce5ea9f',
    nullable: true,
    description: 'Conductor asignado al vehiculo',
  })
  @IsOptional()
  @IsUUID()
  driver_id?: string | null;
}
