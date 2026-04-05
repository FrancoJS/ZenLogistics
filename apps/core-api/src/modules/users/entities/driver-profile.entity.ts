import { AbstractEntity } from '@app/common';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { User } from './user.entity';
import { DriverDocumentsDto } from '../dto/driver-documents.dto';
import { Exclude } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { Vehicle } from '../../vehicles/entities/vehicle.entity';
import { OneToMany } from 'typeorm';

export enum DriverStatus {
  ONLINE = 'online', // Puede recibir pedidos
  OFFLINE = 'offline', // No conectado
  BUSY = 'busy', // En medio de un viaje
  ON_BREAK = 'on_break', // En descanso
  SUSPENDED = 'suspended', // Bloqueado por la plataforma
}

@Entity('driver_profiles')
export class DriverProfile extends AbstractEntity {
  @ApiProperty({ example: '12.345.678-9', description: 'Rut del conductor' })
  @Column({ type: 'varchar', unique: true, length: 12, nullable: true })
  rut: string | null;

  @ApiProperty({ example: 'EMP-12345', description: 'ID del empleado' })
  @Column({ type: 'varchar', nullable: true })
  employeeId: string | null;

  @ApiProperty({
    example: 'Clase B',
    description: 'Clase de la licencia de conducir',
    nullable: true,
  })
  @Column({ type: 'varchar', length: 5, nullable: true })
  licenseClass: string | null;

  @ApiProperty({
    example: '1234567890',
    description: 'Número de licencia de conducir',
  })
  @Column({ type: 'varchar', unique: true, length: 12, nullable: true })
  licenseNumber: string | null;

  @ApiProperty({
    example: '2025-12-31',
    description: 'Fecha de expiración de la licencia',
  })
  @Column({ type: 'date', nullable: true })
  licenseExpiryDate: Date | null;

  //Fecha de la utlima revision de antecedentes, lo ideal revisar cada 1 año
  @Column({ type: 'date', nullable: true })
  lastBackgroundCheckDate: Date | null;

  // Seguridad y gestión
  @ApiProperty({
    example: 'María López',
    description: 'Contacto de emergencia',
  })
  @Column({ type: 'varchar', length: 150, nullable: true })
  emergencyContactName: string | null;

  @ApiProperty({
    example: '+56987654321',
    description: 'Teléfono del contacto de emergencia',
  })
  @Column({ type: 'varchar', length: 20, nullable: true })
  emergencyContactPhone: string | null;

  // Estados

  @ApiProperty({ example: false })
  @Column({ default: false })
  isVerified: boolean;

  @ApiProperty({ enum: DriverStatus, example: DriverStatus.OFFLINE })
  @Column({ type: 'enum', enum: DriverStatus, default: DriverStatus.OFFLINE })
  status: DriverStatus;

  //Documentos flexibles de postgres, va a servir para guardar urls y metadatos de manera ordenada
  /*Ejemplo de estructura esperada:
    {
      "licenseFront": { "url": "s3://...", "uploadedAt": "2023-10-10" },
      "licenseBack": { "url": "s3://..." },
      "criminalRecord": { "url": "s3://..." }
    }*/
  @ApiProperty({
    example: {
      licenseFront: { url: 's3://...', uploadedAt: '2023-10-10' },
      licenseBack: { url: 's3://...' },
      criminalRecord: { url: 's3://...' },
    },
    description:
      'Documentos del conductor, como licencia de conducir y antecedentes',
  })
  @Column({ type: 'jsonb', nullable: true })
  documents: DriverDocumentsDto | null;

  @OneToOne(() => User, (user) => user.driverProfile)
  @JoinColumn()
  @Exclude()
  user: User;

  @OneToMany(() => Vehicle, (vehicle) => vehicle.driverProfile)
  vehicles: Vehicle[];
}
