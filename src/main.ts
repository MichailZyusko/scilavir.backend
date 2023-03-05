import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';

async function bootstrap() {
  // TODO: Set up `cors` properly
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: {
      origin: ['https://scilavir-frontend.vercel.app'],
      methods: ['POST'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      credentials: true,
      optionsSuccessStatus: 200,
    },
  });

  app.use(cookieParser());

  await app.listen(3001);
}
bootstrap();
