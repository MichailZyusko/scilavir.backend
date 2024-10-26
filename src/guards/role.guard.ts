import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ExpressRequestWithAuth } from '@clerk/express';
import { getUserById } from '@utils/index';
import { Role } from '@users/enums/users.enums';
import { ROLES_KEY } from '@decorators/role.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }

    const { auth: { userId } }: ExpressRequestWithAuth = context.switchToHttp().getRequest();
    const user = await getUserById(userId);

    // return requiredRoles.some((role) => user.publicMetadata?.role?.includes(role));
    return !!user.publicMetadata.isAdmin;
  }
}
