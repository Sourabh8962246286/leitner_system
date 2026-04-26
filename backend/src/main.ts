import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: process.env.NODE_ENV === 'production'
      ? process.env.FRONTEND_URL      // e.g. https://leitnerpro.netlify.app
      : ['http://localhost:5173'],    // Vite dev server
  });

  // All API routes will be prefixed with /api (e.g., /api/cards, /api/auth)
  app.setGlobalPrefix('api');

  // Use a global pipe to enforce validation rules on all incoming client payloads
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strip away any properties that do not have any decorators
      forbidNonWhitelisted: true, // Throw an error if non-whitelisted values are provided
      transform: true, // Automatically transform payloads to be objects typed according to their DTO classes
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
