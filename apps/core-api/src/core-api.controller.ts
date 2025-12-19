import { Controller, Get } from '@nestjs/common';
import { CoreApiService } from './core-api.service';

@Controller()
export class CoreApiController {
  constructor(private readonly coreApiService: CoreApiService) {}

  @Get()
  getHello(): string {
    return this.coreApiService.getHello();
  }
}
