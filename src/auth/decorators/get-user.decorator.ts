/**
 * GetUser Decorator
 * -----------------
 * A custom decorator to extract the current user from the request.
 * This makes it easy to get the authenticated user in controllers.
 * 
 * Usage: 
 * @GetUser() user: User - gets the full user object
 * @GetUser('email') email: string - gets just the email
 */

import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '../../users/entities/user.entity';

export const GetUser = createParamDecorator(
    (data: keyof User | undefined, ctx: ExecutionContext) => {
        // Get the request object from the context
        const request = ctx.switchToHttp().getRequest();

        // Get the user (attached by JwtAuthGuard)
        const user = request.user;

        // If a specific property was requested, return just that
        // Otherwise return the full user object
        return data ? user?.[data] : user;
    },
);
