import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { Company } from '../companies/entities/company.entity';
import { DriverProfile } from '../users/entities/driver-profile.entity';
import { Vehicle } from './entities/vehicle.entity';
import { Repository } from 'typeorm';

@Injectable()
export class VehiclesService {
  constructor(
    @InjectRepository(Vehicle)
    private readonly vehicleRepository: Repository<Vehicle>,
    @InjectRepository(DriverProfile)
    private readonly driverProfileRepository: Repository<DriverProfile>,
  ) {}

  async create(
    company_id: string | undefined,
    createVehicleDto: CreateVehicleDto,
  ) {
    const tenantCompanyId = this.ensureCompanyId(company_id);

    const plate = createVehicleDto.plate.trim().toUpperCase();
    const duplicatedPlate = await this.vehicleRepository.exists({
      where: {
        company: { id: tenantCompanyId },
        plate,
      },
    });

    if (duplicatedPlate) {
      throw new ConflictException('La patente ya existe para esta empresa');
    }

    const driverProfile = await this.resolveDriverProfileForTenant(
      createVehicleDto.driver_id,
      tenantCompanyId,
    );

    const vehicle = this.vehicleRepository.create({
      ...createVehicleDto,
      plate,
      company: { id: tenantCompanyId } as Company,
      driverProfile,
    });

    return this.vehicleRepository.save(vehicle);
  }

  async findAll(company_id: string | undefined) {
    const tenantCompanyId = this.ensureCompanyId(company_id);

    return this.vehicleRepository.find({
      where: { company: { id: tenantCompanyId } },
      order: { plate: 'ASC' },
    });
  }

  async findOne(id: string, company_id: string | undefined) {
    const tenantCompanyId = this.ensureCompanyId(company_id);
    const vehicle = await this.vehicleRepository.findOne({
      where: {
        id,
        company: { id: tenantCompanyId },
      },
    });

    if (!vehicle) {
      throw new NotFoundException('Vehiculo no encontrado');
    }

    return vehicle;
  }

  async update(
    id: string,
    company_id: string | undefined,
    updateVehicleDto: UpdateVehicleDto,
  ) {
    const tenantCompanyId = this.ensureCompanyId(company_id);
    const vehicle = await this.findOne(id, tenantCompanyId);

    if (updateVehicleDto.plate) {
      const normalizedPlate = updateVehicleDto.plate.trim().toUpperCase();

      const duplicatedPlate = await this.vehicleRepository
        .createQueryBuilder('vehicle')
        .leftJoin('vehicle.company', 'company')
        .where('company.id = :companyId', {
          companyId: tenantCompanyId,
        })
        .andWhere('vehicle.plate = :plate', { plate: normalizedPlate })
        .andWhere('vehicle.id <> :id', { id })
        .getExists();

      if (duplicatedPlate) {
        throw new ConflictException('La patente ya existe para esta empresa');
      }

      updateVehicleDto.plate = normalizedPlate;
    }

    const nextDriverProfile =
      updateVehicleDto.driver_id === undefined
        ? vehicle.driverProfile
        : await this.resolveDriverProfileForTenant(
            updateVehicleDto.driver_id,
            tenantCompanyId,
          );

    const merged = this.vehicleRepository.merge(vehicle, {
      ...updateVehicleDto,
      driverProfile: nextDriverProfile,
    });

    return this.vehicleRepository.save(merged);
  }

  async remove(id: string, company_id: string | undefined): Promise<void> {
    const tenantCompanyId = this.ensureCompanyId(company_id);
    const vehicle = await this.findOne(id, tenantCompanyId);

    await this.vehicleRepository.remove(vehicle);
  }

  private ensureCompanyId(company_id: string | undefined): string {
    if (!company_id) {
      throw new ForbiddenException(
        'El usuario autenticado no tiene una empresa asociada',
      );
    }

    return company_id;
  }

  private async resolveDriverProfileForTenant(
    driver_id: string | null | undefined,
    companyId: string,
  ): Promise<DriverProfile | null> {
    if (driver_id === undefined || driver_id === null) {
      return null;
    }

    const driverProfile = await this.driverProfileRepository
      .createQueryBuilder('driverProfile')
      .innerJoin('driverProfile.user', 'user')
      .where('driverProfile.id = :driverId', { driverId: driver_id })
      .andWhere('user.companyId = :companyId', { companyId })
      .getOne();

    if (!driverProfile) {
      throw new NotFoundException(
        'El conductor no existe o no pertenece a la empresa autenticada',
      );
    }

    return driverProfile;
  }
}
