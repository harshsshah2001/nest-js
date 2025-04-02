// main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configure CORS to allow PATCH requests and multiple origins
  app.enableCors({
    origin: ["http://192.168.3.73:3001", "http://127.0.0.1:3000"], // Allow both frontend URLs
    methods: "GET,POST,PUT,PATCH,DELETE", // Added PATCH explicitly
    allowedHeaders: "Content-Type,Authorization", // Allowed headers
    credentials: true, // Allow credentials if needed (e.g., for auth)
  });

  // Enable global validation pipe for DTO validation
  app.useGlobalPipes(new ValidationPipe({
    transform: true, // Transform incoming data to DTO classes
    whitelist: true, // Strip properties not in DTO
    forbidNonWhitelisted: true, // Throw error for extra properties
  }));

  // Listen on port 3001, accessible from all network interfaces
  await app.listen(3001, '0.0.0.0');
}

bootstrap();