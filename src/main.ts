import { NestFactory } from '@nestjs/core';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';

async function bootstrap() {
  // TODO: Set up `cors` properly
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: '*',
      methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
      preflightContinue: false,
      optionsSuccessStatus: 204,
    },
  });
  app.use(cookieParser());

  await app.listen(3001);
}
bootstrap();
