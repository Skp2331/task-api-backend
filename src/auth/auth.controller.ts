/**
 * Auth Controller
 * ---------------
 * Handles HTTP requests for authentication endpoints.
 * Routes: POST /auth/signup, POST /auth/login
 */

import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto, LoginDto } from './dto';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    /**
     * POST /auth/signup
     * Register a new user
     */
    @Post('signup')
    async signup(@Body() signupDto: SignupDto) {
        return this.authService.signup(signupDto);
    }

    /**
     * POST /auth/login
     * Authenticate user and get JWT token
     */
    @Post('login')
    @HttpCode(HttpStatus.OK) // Return 200 instead of 201 for login
    async login(@Body() loginDto: LoginDto) {
        return this.authService.login(loginDto);
    }
}
