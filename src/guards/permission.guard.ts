
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS } from '../enums/all.enum';
import { Permission } from './permission.decorator';

@Injectable()
export class PermissionGuard implements CanActivate {
    constructor(private reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean {

        const permissions = this.reflector.get<PERMISSIONS>(Permission, context.getHandler());
        if (!permissions) {
            return true;
        }
        const request = context.switchToHttp().getRequest();
        const user = request.user;

        // console.log(user, "=====")
        return this.matchPermission(permissions, user.permissions);
    }

    matchPermission(permissions: PERMISSIONS | PERMISSIONS[], userPermissions: string[]): boolean {
        // console.log(permissions, "==============******=====", userPermissions);

        if (Array.isArray(permissions)) {
            return permissions.some(permission => userPermissions.includes(permission));
        }

        return userPermissions.includes(permissions);
    }


}