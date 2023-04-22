import { BadRequestException, createParamDecorator, type ExecutionContext } from '@nestjs/common';
import { User } from '@supabase/supabase-js';

export const CurrentUser = createParamDecorator(
  (data: unknown, context: ExecutionContext): User => {
    const req: Request & { user: any } = context.switchToHttp().getRequest();
    const user = req?.user;

    if (!user) throw new BadRequestException('User not found');

    return user;
  },
);