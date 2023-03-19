import { WinstonModuleOptions } from 'nest-winston';
import { format, transports } from 'winston';

const formatter = format.printf(({
  level: logLevel, message, timestamp, stack,
}) => {
  if (!logLevel.includes('error')) {
    return `${logLevel}:[${timestamp}]: ${message}`;
  }

  return `${logLevel}:[${timestamp}]:\n${stack}`;
});

export const winstonConf: WinstonModuleOptions = {
  transports: process.env.NODE_ENV !== 'production'
    ? [
      new transports.Console({
        format: format.combine(
          format.colorize({
            all: true,
            colors: {
              info: 'blue',
              error: 'red',
              warn: 'yellow',
            },
          }),
          format.timestamp({
            format: () => new Intl.DateTimeFormat('en-US', {
              year: 'numeric',
              month: 'numeric',
              day: 'numeric',
              hour: 'numeric',
              minute: 'numeric',
              second: 'numeric',
            }).format(Date.now()),
          }),
          format.errors({ stack: true }),
          formatter,
        ),
      }),
    ] : [
      new transports.Console({
        format: format.combine(
          format.colorize({
            all: true,
            colors: {
              info: 'blue',
              error: 'red',
              warn: 'yellow',
            },
          }),
          format.timestamp({
            format: () => new Intl.DateTimeFormat('en-US', {
              year: 'numeric',
              month: 'numeric',
              day: 'numeric',
              hour: 'numeric',
              minute: 'numeric',
              second: 'numeric',
            }).format(Date.now()),
          }),
          format.errors({ stack: true }),
          formatter,
        ),
      }),
      new transports.File({ filename: 'logs/error.log', level: 'error' }),
      new transports.File({ filename: 'logs/combined.log' }),
    ],
};
