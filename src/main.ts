import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe, Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'error', 'warn', 'debug', 'verbose'],
  });

  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
  );
  app.enableCors();
  app.setGlobalPrefix('api');
  app.useGlobalPipes(
  new ValidationPipe({
    whitelist: true, // strips unexpected properties
    forbidNonWhitelisted: true, // throws error if unexpected props exist
    transform: true,
  }),
);


  const config = new DocumentBuilder()
    .setTitle('EcoStep API')
    .setDescription('API documentation for EcoStep')
    .setVersion('1.0')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'Bearer',
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  const port = process.env.PORT || 3000;
  Logger.log(
    `EcoStep API running on http://localhost:${port}/api-docs`,
    'Bootstrap',
  );
  await app.listen(port);
}
bootstrap();
