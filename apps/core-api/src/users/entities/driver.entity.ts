import { AbstractEntity } from '@app/common';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { User } from './user.entity';

export enum DriverStatus {
  ONLINE = 'online', // Puede recibir pedidos
  OFFLINE = 'offline', // No conectado
  BUSY = 'busy', // En medio de un viaje
  SUSPENDED = 'suspended', // Bloqueado por la plataforma
}

@Entity('driver_profiles')
export class DriverProfile extends AbstractEntity {
  @Column({ type: 'varchar', unique: true, length: 50 })
  rut: string;

  @Column({ type: 'varchar', unique: true, length: 50 })
  licenceNumber: string;

  @Column({ type: 'date', nullable: true })
  licenceExpiryDate: Date;

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
  documents: Record<string, any>;

  @OneToOne(() => User, (user) => user.driverProfile)
  @JoinColumn()
  user: User;
}
