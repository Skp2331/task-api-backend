/**
 * Roles Guard
 * -----------
 * This guard checks if the user has the required role to access a route.
 * It works together with the @Roles() decorator.
 * 
 * Usage: 
 * @Roles(Role.ADMIN)
 * @UseGuards(JwtAuthGuard, RolesGuard)
 */

import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '../../common/enums';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean {
        // Get the required roles from the @Roles() decorator
        const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        // If no roles are required, allow access
        if (!requiredRoles || requiredRoles.length === 0) {
            return true;
        }

        // Get the user from the request (attached by JwtAuthGuard)
        const { user } = context.switchToHttp().getRequest();

        // Check if user has one of the required roles
        return requiredRoles.some((role) => user.role === role);
    }
}
