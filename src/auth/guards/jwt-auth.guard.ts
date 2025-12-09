/**
 * JWT Auth Guard
 * --------------
 * This guard protects routes that require authentication.
 * It uses the JwtStrategy to validate the token.
 * 
 * Usage: @UseGuards(JwtAuthGuard) on controller or route
 */

import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') { }
