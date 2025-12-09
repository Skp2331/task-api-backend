/**
 * Auth Service
 * ------------
 * Handles user authentication: signup and login.
 * Uses bcrypt for password hashing and JWT for token generation.
 */

import {
    Injectable,
    UnauthorizedException,
    ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { SignupDto, LoginDto } from './dto';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
    ) { }

    /**
     * Register a new user
     * 
     * @param signupDto - The signup data (email, password, role)
     * @returns Object containing access token and user info
     */
    async signup(signupDto: SignupDto) {
        const { email, password, role } = signupDto;

        // Check if user already exists
        const existingUser = await this.usersService.findByEmail(email);
        if (existingUser) {
            throw new ConflictException('User with this email already exists');
        }

        // Hash the password before saving
        // Salt rounds of 10 provides good security without being too slow
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create the user in the database
        const user = await this.usersService.create(email, hashedPassword, role);

        // Generate JWT token for the new user
        const token = this.generateToken(user.id, user.email);

        return {
            message: 'User registered successfully',
            accessToken: token,
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
            },
        };
    }

    /**
     * Authenticate a user and return a JWT token
     * 
     * @param loginDto - The login credentials (email, password)
     * @returns Object containing access token and user info
     */
    async login(loginDto: LoginDto) {
        const { email, password } = loginDto;

        // Find user by email (include password for verification)
        const user = await this.usersService.findByEmail(email, true);

        // Check if user exists and password is correct
        if (!user || !(await bcrypt.compare(password, user.password))) {
            throw new UnauthorizedException('Invalid credentials');
        }

        // Generate JWT token
        const token = this.generateToken(user.id, user.email);

        return {
            message: 'Login successful',
            accessToken: token,
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
            },
        };
    }

    /**
     * Generate a JWT token for a user
     * 
     * @param userId - The user's ID
     * @param email - The user's email
     * @returns The signed JWT token
     */
    private generateToken(userId: string, email: string): string {
        // JWT payload - 'sub' is a standard claim for subject (user ID)
        const payload = { sub: userId, email };
        return this.jwtService.sign(payload);
    }
}
