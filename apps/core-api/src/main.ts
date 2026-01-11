import { NestFactory, Reflector } from '@nestjs/core';
import { CoreApiModule } from './core-api.module';
import {
  ClassSerializerInterceptor,
  Logger,
  ValidationPipe,
} from '@nestjs/common';
import { DbExceptionFilter } from '@app/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(CoreApiModule);
  const logger = new Logger('Bootstrap');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.useGlobalFilters(new DbExceptionFilter());

  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  const config = new DocumentBuilder()
    .setTitle('Zen Logistics API')
    .setDescription(
      'Plataforma SaaS B2B para gestion de lógistica y transporte.',
    )
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  await app.listen(process.env.PORT || 3000);

  logger.log(`Aplicación corriendo en el puerto ${process.env.PORT}`);
  logger.log(
    `Documentación disponible en http://localhost:${process.env.PORT}/docs`,
  );
}
bootstrap()
  .then(() => {
    console.log('Core API is running...');
  })
  .catch((err) => {
    console.error('Error starting Core API:', err);
  });
