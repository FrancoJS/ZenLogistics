import { Module } from '@nestjs/common';
import { ArgonService } from './argon.service';
import { HASHING_SERVICE_TOKEN } from './hashing.constants';

@Module({
  providers: [
    {
      provide: HASHING_SERVICE_TOKEN,
      useClass: ArgonService,
    },
  ],
  exports: [HASHING_SERVICE_TOKEN],
})
export class HashingModule {}
