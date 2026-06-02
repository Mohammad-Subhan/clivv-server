import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import morgan from 'morgan';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.enableCors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
  });
  app.useGlobalPipes(new ValidationPipe());
  app.use(morgan('dev'));
  await app.listen(process.env.PORT ?? 8000);
}
bootstrap();
