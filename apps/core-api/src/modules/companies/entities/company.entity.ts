import { AbstractEntity } from '@app/common';
import { SubscriptionPlan } from '@app/common/enums/subscription-plan.enum';
import { Column, Entity, OneToMany } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Vehicle } from '../../vehicles/entities/vehicle.entity';

@Entity('companies')
export class Company extends AbstractEntity {
  @ApiProperty({
    example: 'Transportes Rápidos Ltda',
    description: 'Nombre legal',
  })
  @Column({ type: 'varchar', unique: true })
  name: string;

  @ApiProperty({ example: '76.123.456-K', description: 'Rut de Empresa' })
  @Column({ type: 'varchar', unique: true })
  rut: string;

  @ApiProperty({ example: 'Av. Libertador Bernardo O Higgins 1234' })
  @Column({ nullable: true, type: 'varchar' })
  address: string | null;

  @ApiProperty({ enum: SubscriptionPlan, example: SubscriptionPlan.BASIC })
  @Column({
    type: 'enum',
    enum: SubscriptionPlan,
    default: SubscriptionPlan.BASIC,
  })
  plan: SubscriptionPlan;

  @ApiProperty({ example: true })
  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @OneToMany(() => User, (user) => user.company)
  users: User[];

  @OneToMany(() => Vehicle, (vehicle) => vehicle.company)
  vehicles: Vehicle[];
}
