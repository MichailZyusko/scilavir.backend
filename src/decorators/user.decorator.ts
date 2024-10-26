import { RequireAuthProp } from '@clerk/clerk-sdk-node';
import { PRIVATE_ROUTES } from '@constants/routes';
import { createParamDecorator, UnauthorizedException, type ExecutionContext } from '@nestjs/common';

export const User = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const req: RequireAuthProp<Request> = context.switchToHttp().getRequest();
    const { userId } = req?.auth || {};

    if (!userId && PRIVATE_ROUTES.has(req.url)) {
      throw new UnauthorizedException('User is not authorized to access this route');
    }

    return userId;
  },
);
