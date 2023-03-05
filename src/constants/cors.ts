import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

export const corsOptions: CorsOptions = {
  origin: ['https://scilavir-frontend.vercel.app', 'http://localhost:3000'],
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
