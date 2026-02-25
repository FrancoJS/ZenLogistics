import { Module } from '@nestjs/common';
import { CoreApiController } from './core-api.controller';
import { CoreApiService } from './core-api.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { RedisModule } from '@app/common';
import { CompaniesModule } from './companies/companies.module';
import { typeOrmSharedOptions } from './database/data-source';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot({
      ...(typeOrmSharedOptions as TypeOrmModuleOptions),
      autoLoadEntities: true,
    }),
    UsersModule,
    AuthModule,
    RedisModule,
    CompaniesModule,
  ],
  controllers: [CoreApiController],
  providers: [CoreApiService],
})
export class CoreApiModule {}
