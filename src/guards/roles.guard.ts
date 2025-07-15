
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Roles } from './roles.decorator';
import { ROLES } from 'src/enums/role.enum';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean {

        const roles = this.reflector.get<ROLES>(Roles, context.getHandler());
        if (!roles) {
            return true;
        }
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        return this.matchRoles(roles, user.role);
    }

    matchRoles(roles: ROLES | ROLES[], userRole: any): boolean {
        if (Array.isArray(roles)) {
            return roles.includes(userRole);
        }
        return roles === userRole;
    }

}