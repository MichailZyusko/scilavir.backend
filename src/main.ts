import { NestFactory } from '@nestjs/core';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';

async function bootstrap() {
  // TODO: Set up `cors` properly
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.enableCors();

  await app.listen(3001);
}
bootstrap();
