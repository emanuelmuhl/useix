import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global Validation Pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // CORS Configuration
  app.enableCors({
    origin: ['http://localhost:3102', 'http://localhost:3000'],
    credentials: true,
  });

  // Swagger Documentation
  const config = new DocumentBuilder()
    .setTitle('Userix API')
    .setDescription('Mandantenfähige SaaS-API für Schulverwaltung')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  // Global Prefix
  app.setGlobalPrefix('api');

  const port = process.env.PORT || 3101;
  await app.listen(port);
  
  console.log(`🚀 Userix Backend läuft auf http://localhost:${port}`);
  console.log(`📚 API Dokumentation: http://localhost:${port}/api/docs`);
}

bootstrap();
