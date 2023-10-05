import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { corsOptions } from '@constants/cors';
import { AppModule } from './app.module';

(async () => {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: corsOptions,
  });

  app.setGlobalPrefix('/api');
  const port = process.env.PORT || 3001;

  await app.listen(port, () => console.log(`[Server started on port ${port}]`));
})();
