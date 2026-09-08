import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { PRIVILEGES_KEY } from "../decorators/privileges.decorator";
import { Privilege } from "../enums/privilege.enum";
import { Reflector } from "@nestjs/core";

@Injectable()
export class PrivilegesGuard implements CanActivate {

  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {

    const requiredPrivileges =
      this.reflector.getAllAndOverride<Privilege[]>(
        PRIVILEGES_KEY,
        [
          context.getHandler(),
          context.getClass(),
        ],
      );

    if (!requiredPrivileges) {
      return true;
    }

    const { user } =
      context.switchToHttp().getRequest();

    const hasPrivilege = requiredPrivileges.some(
      (privilege) =>
        user.privileges?.includes(privilege),
    );

    if (!hasPrivilege) {
      throw new ForbiddenException(
        'You do not have permission to perform this action',
      );
    }

    return true;
  }
}