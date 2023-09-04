import { RequireAuthProp } from '@clerk/clerk-sdk-node';
import { BadRequestException, createParamDecorator, type ExecutionContext } from '@nestjs/common';

export const User = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const req: RequireAuthProp<Request> = context.switchToHttp().getRequest();
    const { userId } = req?.auth || {};

    if (!userId) throw new BadRequestException('User not found');

    return userId;
  },
);
