import { NestFactory } from '@nestjs/core';
import { CoreApiModule } from './core-api.module';

async function bootstrap() {
  const app = await NestFactory.create(CoreApiModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
