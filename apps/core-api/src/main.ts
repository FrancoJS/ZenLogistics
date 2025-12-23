import { NestFactory } from '@nestjs/core';
import { CoreApiModule } from './core-api.module';
import { ValidationPipe } from '@nestjs/common';
import { DbExceptionFilter } from '@app/common';

async function bootstrap() {
  const app = await NestFactory.create(CoreApiModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.useGlobalFilters(new DbExceptionFilter());

  await app.listen(process.env.port ?? 3000);
}
bootstrap()
  .then(() => {
    console.log('Core API is running...');
  })
  .catch((err) => {
    console.error('Error starting Core API:', err);
  });
