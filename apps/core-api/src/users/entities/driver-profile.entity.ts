import { AbstractEntity } from '@app/common';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { User } from './user.entity';
import { DriverDocumentsDto } from '../dto/driver-documents.dto';
import { Exclude } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export enum DriverStatus {
  ONLINE = 'online', // Puede recibir pedidos
  OFFLINE = 'offline', // No conectado
  BUSY = 'busy', // En medio de un viaje
  SUSPENDED = 'suspended', // Bloqueado por la plataforma
}

@Entity('driver_profiles')
export class DriverProfile extends AbstractEntity {
  @ApiProperty({ example: '12.345.678-9', description: 'Rut del conductor' })
  @Column({ type: 'varchar', unique: true, length: 12, nullable: true })
  rut: string | null;

  @ApiProperty({
    example: 'AB123456',
    description: 'Número de licencia de conducir',
  })
  @Column({ type: 'varchar', unique: true, length: 12 })
  licenseNumber: string;

  @ApiProperty({
    example: '2025-12-31',
    description: 'Fecha de expiración de la licencia',
  })
  @Column({ type: 'date', nullable: true })
  licenseExpiryDate: Date | null;

  //Fecha de la utlima revision de antecedentes, lo ideal revisar cada 1 año
  @Column({ type: 'date', nullable: true })
  lastBackgroundCheckDate: Date | null;

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
}
