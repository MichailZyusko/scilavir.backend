import { NestFactory } from '@nestjs/core';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';

async function bootstrap() {
  // TODO: Set up `cors` properly
  const app = await NestFactory.create(AppModule, {
    cors: {
      credentials: true,
      preflightContinue: true,
      origin: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    },
  });

  app.use(cookieParser());

  await app.listen(3001);
}
bootstrap();
