import 'dotenv/config';
import { DataSource, DataSourceOptions } from 'typeorm';

export const typeOrmSharedOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT ?? 5432),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: ['apps/core-api/src/**/*.entity{.ts,.js}'],
  migrations: ['apps/core-api/src/database/migrations/*{.ts,.js}'],
  migrationsTableName: 'typeorm_migrations',
  synchronize: false,
};

export const AppDataSource = new DataSource(typeOrmSharedOptions);
