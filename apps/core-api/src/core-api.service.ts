import { Injectable } from '@nestjs/common';

@Injectable()
export class CoreApiService {
  getHello(): string {
    return 'Hello World!';
  }
}
