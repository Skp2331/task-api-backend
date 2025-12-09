/**
 * Roles Decorator
 * ---------------
 * A custom decorator to specify which roles can access a route.
 * 
 * Usage: @Roles(Role.ADMIN) on a controller method
 */

import { SetMetadata } from '@nestjs/common';
import { Role } from '../../common/enums';

// Key used to store roles metadata
export const ROLES_KEY = 'roles';

// The decorator function
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
