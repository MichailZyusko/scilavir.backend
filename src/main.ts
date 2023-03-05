import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { corsOptions } from './constants/cors';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: corsOptions,
  });

  app.setGlobalPrefix('/api');
  app.use(cookieParser());

  await app.listen(3001);
}
bootstrap();
