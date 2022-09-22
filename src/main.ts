import { NestFactory } from '@nestjs/core';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as dotenv from 'dotenv';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
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
  const config = new DocumentBuilder()
    .setTitle('Membeder Backend API Document')
    .setDescription('2022 Digital Content')
    .setVersion('0.0.1')
    .addCookieAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  await app.listen(parseInt(process.env.SERVER_PORT) || 3000);
}
bootstrap();
