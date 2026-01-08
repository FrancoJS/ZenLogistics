import { Injectable } from '@nestjs/common';
import { IHashingService } from '../interfaces/hashing-service.interface';
import * as argon2 from 'argon2';

@Injectable()
export class ArgonService implements IHashingService {
  async hash(data: string): Promise<string> {
    return await argon2.hash(data);
  }

  async compare(data: string, encrypted: string): Promise<boolean> {
    return argon2.verify(encrypted, data);
  }
}
