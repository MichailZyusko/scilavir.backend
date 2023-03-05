/* eslint-disable @typescript-eslint/return-await */
/* eslint-disable consistent-return */
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';

// const allowCors = (fn) => async (req, res) => {
//   // res.setHeader('Access-Control-Allow-Credentials', true);
//   // res.setHeader('Access-Control-Allow-Origin', '*');
//   // another common pattern
//   // res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
//   res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
//   res.setHeader(
//     'Access-Control-Allow-Headers',
//     'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version',
//   );
//   if (req.method === 'OPTIONS') {
//     res.status(200).end();
//     return;
//   }

//   return await fn(req, res);
// };

async function bootstrap() {
  // TODO: Set up `cors` properly
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: {
      origin: '*',
      methods: 'GET,OPTIONS,PATCH,DELETE,POST,PUT',
      allowedHeaders: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version',
      credentials: true,
      optionsSuccessStatus: 200,
    },
  });

  // app.setGlobalPrefix('/api');
  app.use(cookieParser());

  await app.listen(3001);
}
bootstrap();
