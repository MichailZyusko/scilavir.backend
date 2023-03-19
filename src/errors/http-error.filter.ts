import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
  Inject,
  LoggerService,
} from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

type ApiError = {
  httpCode: number;
  name: string;
  message: string;
  timestamp: string;
  stack: any;
  path?: string;
  method?: string;
};

const generateError = (e: any): ApiError => {
  const httpCode = e.status || HttpStatus.INTERNAL_SERVER_ERROR;

  return {
    httpCode,
    name: e.name,
    message: e.message,
    timestamp: new Date().toISOString(),
    stack: e.stack,
  };
};

@Catch()
export class HttpErrorFilter implements ExceptionFilter {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: LoggerService,
  ) { }

  catch(exception: Error, host: ArgumentsHost): any {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest();
    const response = ctx.getResponse();

    const errorResponse = generateError(exception);

    this.logger.warn(`${request.method} ${request.url}`);
    this.logger.error(exception);

    response.status(errorResponse.httpCode).json(errorResponse);
  }
}
