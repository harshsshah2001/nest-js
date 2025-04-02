




import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: ["http://192.168.3.77:3001", "http://127.0.0.1:3000",], // Allow both frontend URLs
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: "Content-Type,Authorization",
  });
  await app.listen(3001, '0.0.0.0');
}

bootstrap();
