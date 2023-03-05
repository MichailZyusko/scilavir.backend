import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';

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
  catch(exception: Error, host: ArgumentsHost): any {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest();
    const response = ctx.getResponse();

    const errorResponse = generateError(exception);

    console.error(
      `request method: ${request.method} \nrequest url${request.url}\nexception:`,
      exception,
    );

    response.status(errorResponse.httpCode).json(errorResponse);
  }
}
