import { Module } from '@nestjs/common';
import { ArgonService } from './argon.service';

const HASHING_SERVICE_TOKEN = 'HASHING_SERVICE_TOKEN';

@Module({
  providers: [
    ArgonService,
    {
      provide: HASHING_SERVICE_TOKEN,
      useClass: ArgonService,
    },
  ],
  exports: [HASHING_SERVICE_TOKEN],
})
export class HashingModule {}
