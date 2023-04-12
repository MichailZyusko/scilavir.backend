import { createParamDecorator, type ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  (data: unknown, context: ExecutionContext): string => {
    const req: Request & { user: any } = context.switchToHttp().getRequest();
    const user = req?.user || {};

    return user;
  },
);
