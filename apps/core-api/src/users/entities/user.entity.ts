import { AbstractEntity } from '@app/common';
import { Column, Entity, OneToOne } from 'typeorm';
import { DriverProfile } from './driver.entity';

export enum UserRole {
  CLIENT = 'client',
  DRIVER = 'driver',
  ADMIN = 'admin',
}

export enum AuthProvider {
  EMAIL = 'email',
  GOOGLE = 'google',
}

@Entity('users')
export class User extends AbstractEntity {
  @Column({ type: 'varchar', unique: true, length: 255 })
  email: string;

  @Column({ type: 'varchar', length: 255, select: false, nullable: true })
  password: string;

  @Column({ type: 'varchar', length: 150 })
  full_name: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  phone: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.CLIENT })
  role: UserRole;

  @Column({ type: 'enum', enum: AuthProvider, default: AuthProvider.EMAIL })
  authProvider: AuthProvider;

  @Column({ type: 'varchar', nullable: true, select: false })
  googleId: string;

  @Column({ default: false })
  isEmailVerified: boolean;

  // Campo adicional para vincular user con driver profile si es el caso
  @OneToOne(() => DriverProfile, (driverProfile) => driverProfile.user, {
    nullable: true,
    cascade: true,
  })
  driverProfile: DriverProfile;
}
