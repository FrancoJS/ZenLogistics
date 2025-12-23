import { Injectable } from '@nestjs/common';
import { CreateClientDto } from './dto/create-client.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { UserRole } from './enums/auth-provider.enum';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createClient(createClientDto: CreateClientDto) {
    const user = this.userRepository.create({
      ...createClientDto,
      authProvider: createClientDto.authProvider,
      role: UserRole.CLIENT,
    });

    return await this.userRepository.save(user);
  }
}
