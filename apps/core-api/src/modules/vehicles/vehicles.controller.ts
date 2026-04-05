import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Auth, GetUser, IActiveUser, UserRole } from '@app/common';
import { VehiclesService } from './vehicles.service';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { Vehicle } from './entities/vehicle.entity';

@ApiTags('Vehicles')
@Auth(UserRole.COMPANY_ADMIN, UserRole.DISPATCHER)
@Controller('vehicles')
export class VehiclesController {
  constructor(private readonly vehiclesService: VehiclesService) {}

  /**
   * Crear vehiculo
   * El plugin de Swagger toma los tipos de entrada/salida para documentar el endpoint.
   */
  @Post()
  create(
    @Body() createVehicleDto: CreateVehicleDto,
    @GetUser() user: IActiveUser,
  ): Promise<Vehicle> {
    return this.vehiclesService.create(user.companyId, createVehicleDto);
  }

  /**
   * Listar vehiculos de la empresa autenticada.
   */
  @Get()
  findAll(@GetUser() user: IActiveUser): Promise<Vehicle[]> {
    return this.vehiclesService.findAll(user.companyId);
  }

  /**
   * Obtener un vehiculo por id.
   */
  @Get(':id')
  findOne(
    @Param('id', new ParseUUIDPipe()) id: string,
    @GetUser() user: IActiveUser,
  ): Promise<Vehicle> {
    return this.vehiclesService.findOne(id, user.companyId);
  }

  /**
   * Actualizar un vehiculo por id.
   */
  @Patch(':id')
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateVehicleDto: UpdateVehicleDto,
    @GetUser() user: IActiveUser,
  ): Promise<Vehicle> {
    return this.vehiclesService.update(id, user.companyId, updateVehicleDto);
  }

  /**
   * Eliminar un vehiculo por id.
   */
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  remove(
    @Param('id', new ParseUUIDPipe()) id: string,
    @GetUser() user: IActiveUser,
  ): Promise<void> {
    return this.vehiclesService.remove(id, user.companyId);
  }
}
