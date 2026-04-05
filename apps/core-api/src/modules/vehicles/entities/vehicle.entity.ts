import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Company } from '../../companies/entities/company.entity';
import { DriverProfile } from '../../users/entities/driver-profile.entity';

export enum VehicleType {
  TRUCK = 'TRUCK',
  VAN = 'VAN',
  PICKUP = 'PICKUP',
}

@Entity('vehicles')
@Index(['company', 'plate'], { unique: true })
export class Vehicle {
  @ApiProperty({
    example: '64fd2ef9-3f90-4668-bdf2-e98e469a8f79',
    description: 'Identificador unico del vehiculo',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    example: '23f7b56c-93f5-4af7-a66b-3f718f3553ec',
    description: 'Empresa propietaria del vehiculo',
  })
  @ManyToOne(() => Company, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'company_id' })
  company: Company;

  @ApiProperty({ example: 'ABCD12', description: 'Patente del vehiculo' })
  @Column({ type: 'varchar', length: 10 })
  plate: string;

  @ApiProperty({ enum: VehicleType, example: VehicleType.TRUCK })
  @Column({ type: 'enum', enum: VehicleType })
  type: VehicleType;

  @ApiProperty({
    example: 3500,
    description: 'Capacidad maxima en kilogramos',
  })
  @Column({ type: 'int', name: 'capacity_kg' })
  capacity_kg: number;

  @ApiProperty({
    example: '69052fd4-915f-44d9-a315-ecbb8ce5ea9f',
    required: false,
    nullable: true,
    description: 'Conductor asignado actualmente al vehiculo',
  })
  @ManyToOne(() => DriverProfile, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'driver_id' })
  driverProfile: DriverProfile | null;
}
