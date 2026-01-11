import { AbstractEntity, AuthProvider, UserRole } from '@app/common';
import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { DriverProfile } from './driver-profile.entity';
import { Exclude } from 'class-transformer';
import { Company } from '../../companies/entities/company.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('users')
export class User extends AbstractEntity {
  @ApiProperty({ example: 'juan@empresa.com' })
  @Column({ type: 'varchar', unique: true, length: 255 })
  email: string;

  @Column({ type: 'varchar', length: 255, select: false, nullable: true })
  @Exclude()
  password: string | null;

  @ApiProperty({ example: 'Juan Pérez' })
  @Column({ type: 'varchar', length: 150 })
  fullName: string;

  @ApiProperty({ example: '+56912345678', required: false })
  @Column({ type: 'varchar', length: 20, nullable: true, unique: true })
  phone: string;

  @ApiProperty({ enum: UserRole, example: UserRole.COMPANY_ADMIN })
  @Column({ type: 'enum', enum: UserRole, default: UserRole.COMPANY_ADMIN })
  role: UserRole;

  @ApiProperty({ enum: AuthProvider, example: AuthProvider.LOCAL })
  @Column({ type: 'enum', enum: AuthProvider, default: AuthProvider.LOCAL })
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

  @Column({
    type: 'varchar',
    nullable: true,
    select: false,
    name: 'refreshToken',
  })
  @Exclude()
  refreshToken: string | null;

  @Column({ type: 'int', select: false, default: 1 })
  @Exclude()
  tokenVersion: number = 1;

  @ManyToOne(() => Company, (company) => company.users, { nullable: true })
  @JoinColumn({ name: 'companyId' })
  company: Company;

  @Column({ nullable: true })
  companyId: string;
}
