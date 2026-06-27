import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import morgan from 'morgan';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.enableCors({
    origin: process.env.FRONTEND_URL || "https://clivvpass.vercel.app",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  });
  app.useGlobalPipes(new ValidationPipe());
  app.use(morgan('dev'));
  await app.listen(process.env.PORT ?? 8000);
}
bootstrap();
