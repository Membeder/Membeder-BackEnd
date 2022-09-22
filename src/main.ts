import { NestFactory } from '@nestjs/core';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as dotenv from 'dotenv';
dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      ...(process.env.NODE_ENV == 'production' && {
        disableErrorMessages: true,
      }),
    }),
  );
  app.enableCors();
  app.use(cookieParser());
  await app.listen(parseInt(process.env.SERVER_PORT) || 3000);
}
bootstrap();
