import { AbstractEntity } from '@app/common';
import { BeforeInsert, BeforeUpdate, Column, Entity, OneToOne } from 'typeorm';
import { DriverProfile } from './driver.entity';
import * as bcrypt from 'bcrypt';
import { UserRole } from '../enums/auth-provider.enum';
import { AuthProvider } from '../enums/user-role.enum';

@Entity('users')
export class User extends AbstractEntity {
  @Column({ type: 'varchar', unique: true, length: 255 })
  email: string;

  @Column({ type: 'varchar', length: 255, select: false, nullable: true })
  password: string;

  // Hasheamos la contraseña antes de insertar o actualizar el usuario
  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (!this.password) return;

    // Regex para verificar si la contraseña ya está hasheada
    const isAlreadyHashed = /^\$2[aby]\$.{56}$/.test(this.password);

    if (!isAlreadyHashed) {
      const genSalt = await bcrypt.genSalt();
      this.password = await bcrypt.hash(this.password, genSalt);
    }
  }

  @Column({ type: 'varchar', length: 150 })
  fullName: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  phone: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.CLIENT })
  role: UserRole;

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
}
