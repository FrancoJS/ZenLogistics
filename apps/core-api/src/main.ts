import { NestFactory } from '@nestjs/core';
import { CoreApiModule } from './core-api.module';

async function bootstrap() {
  const app = await NestFactory.create(CoreApiModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap()
  .then(() => {
    console.log('Core API is running...');
  })
  .catch((err) => {
    console.error('Error starting Core API:', err);
  });
