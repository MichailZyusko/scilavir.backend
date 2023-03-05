import { NestFactory } from '@nestjs/core';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';

async function bootstrap() {
  // TODO: Set up `cors` properly
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: ['https://scilavir-frontend.vercel.app', '*'],
      allowedHeaders: '*',
      credentials: false,
      methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
      preflightContinue: false,
      optionsSuccessStatus: 204,
    },
  });
  app.use(cookieParser());

  await app.listen(3001);
}
bootstrap();
