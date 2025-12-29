import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS for frontend interaction
  app.enableCors({
    origin: 'https://sparkling-brioche-18b52b.netlify.app/', // Adjust this in production to restrict allowed origins
  });

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
