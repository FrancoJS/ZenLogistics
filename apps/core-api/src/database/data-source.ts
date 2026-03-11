import 'dotenv/config';
import { DataSource, DataSourceOptions } from 'typeorm';

const isCompiled = process.env.NODE_ENV === 'production';

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT ?? 5432),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: isCompiled
    ? ['dist/apps/core-api/**/*.entity.js']
    : ['apps/core-api/src/**/*.entity{.ts,.js}'],
  migrations: isCompiled
    ? ['dist/apps/core-api/database/migrations/*.js']
    : ['apps/core-api/src/database/migrations/*{.ts,.js}'],
  migrationsTableName: 'typeorm_migrations',
  synchronize: false,
};

const AppDataSource = new DataSource(dataSourceOptions);
export default AppDataSource;
