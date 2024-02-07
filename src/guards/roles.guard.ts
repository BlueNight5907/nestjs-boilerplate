import {
  type CanActivate,
  type ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(_context: ExecutionContext): boolean {
    // const roles = this.reflector.get<RoleType[]>('roles', _context.getHandler());

    // const request: Request = context.switchToHttp().getRequest();
    // const user = <UserEntity>request.user;

    return true;
  }
}
