import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ✅ Configure CORS to allow requests from specific frontends
  app.enableCors({
    origin: [
      'http://192.168.3.74:8000', // ✅ Correct frontend IP without trailing slash
      'http://127.0.0.1:3000',    // Localhost frontend
      'http://192.168.3.74:3000',    // Optional: localhost without IP
    ],
    methods: 'GET,POST,PUT,PATCH,DELETE',
    allowedHeaders: 'Content-Type,Authorization',
    credentials: true, // ✅ Required for cookie/session-based auth
  });

  // ✅ Apply global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  // ✅ Listen on all network interfaces so it's accessible by IP
  await app.listen(3001, '0.0.0.0');
}

bootstrap();
