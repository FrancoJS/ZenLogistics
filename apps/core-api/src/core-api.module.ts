import { Module } from '@nestjs/common';
import { CoreApiController } from './core-api.controller';
import { CoreApiService } from './core-api.service';

@Module({
  imports: [],
  controllers: [CoreApiController],
  providers: [CoreApiService],
})
export class CoreApiModule {}
