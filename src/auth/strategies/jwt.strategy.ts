/**
 * JWT Strategy
 * ------------
 * This strategy validates JWT tokens from incoming requests.
 * It extracts the token from the Authorization header,
 * verifies it, and attaches the user to the request object.
 */

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../../users/users.service';

// This interface defines what's stored in the JWT payload
interface JwtPayload {
    sub: string; // User ID (sub = subject, standard JWT claim)
    email: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private configService: ConfigService,
        private usersService: UsersService,
    ) {
        super({
            // Extract JWT from Authorization header as Bearer token
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            // Don't allow expired tokens
            ignoreExpiration: false,
            // Use the same secret we used to sign the token
            secretOrKey: configService.get('JWT_SECRET'),
        });
    }

    /**
     * Validate method is called by Passport after token is verified
     * Whatever we return here gets attached to request.user
     * 
     * @param payload - The decoded JWT payload
     * @returns The user object to attach to request
     */
    async validate(payload: JwtPayload) {
        // Find the user in the database using the ID from the token
        const user = await this.usersService.findById(payload.sub);

        if (!user) {
            throw new UnauthorizedException('User not found');
        }

        // Return user object - this will be available as request.user
        return user;
    }
}
