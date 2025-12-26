import { AbstractEntity } from '@app/common';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { User } from './user.entity';
import { DriverDocumentsDto } from '../dto/driver-documents.dto';
import { Exclude } from 'class-transformer';

export enum DriverStatus {
  ONLINE = 'online', // Puede recibir pedidos
  OFFLINE = 'offline', // No conectado
  BUSY = 'busy', // En medio de un viaje
  SUSPENDED = 'suspended', // Bloqueado por la plataforma
}

@Entity('driver_profiles')
export class DriverProfile extends AbstractEntity {
  @Column({ type: 'varchar', unique: true, length: 12 })
  rut: string;

  @Column({ type: 'varchar', unique: true, length: 12 })
  licenseNumber: string;

  @Column({ type: 'date', nullable: true })
  licenseExpiryDate: Date;

  //Fecha de la utlima revision de antecedentes, lo ideal revisar cada 1 año
  @Column({ type: 'date', nullable: true })
  lastBackgroundCheckDate: Date;

  @Column({ default: false })
  isVerified: boolean;

  @Column({ type: 'enum', enum: DriverStatus, default: DriverStatus.OFFLINE })
  status: DriverStatus;

  //Documentos flexibles de postgres, va a servir para guardar urls y metadatos de manera ordenada
  /*Ejemplo de estructura esperada:
    {
      "licenseFront": { "url": "s3://...", "uploadedAt": "2023-10-10" },
      "licenseBack": { "url": "s3://..." },
      "criminalRecord": { "url": "s3://..." }
    }*/
  @Column({ type: 'jsonb', nullable: true })
  documents: DriverDocumentsDto;

  @OneToOne(() => User, (user) => user.driverProfile)
  @JoinColumn()
  @Exclude()
  user: User;
}
