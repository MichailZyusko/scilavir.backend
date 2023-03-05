import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

const origin = process.env.NODE_ENV === 'prod' ? ['https://scilavir-frontend.vercel.app'] : ['http://localhost:3000'];
console.log('🚀 ~ file: cors.ts:4 ~ origin:', origin);

export const corsOptions: CorsOptions = {
  origin,
  methods: ['GET', 'OPTIONS', 'PATCH', 'DELETE', 'POST', 'PUT'],
  allowedHeaders: [
    'X-CSRF-Token', 'X-Requested-With', 'Accept',
    'Accept-Version', 'Content-Length', 'Content-MD5',
    'Content-Type', 'Date', 'X-Api-Version',
    'Authorization',
  ],
  credentials: true,
  optionsSuccessStatus: 200,
};
