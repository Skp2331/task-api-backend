/**
 * Auth Service Unit Tests
 * -----------------------
 * Tests for the AuthService signup and login methods.
 */

import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { Role } from '../common/enums';

// Mock bcrypt module
jest.mock('bcrypt');

describe('AuthService', () => {
    let authService: AuthService;
    let usersService: UsersService;
    let jwtService: JwtService;

    // Mock user data for testing
    const mockUser = {
        id: 'test-uuid',
        email: 'test@example.com',
        password: 'hashedPassword',
        role: Role.USER,
    };

    // Create mock implementations for dependencies
    const mockUsersService = {
        findByEmail: jest.fn(),
        create: jest.fn(),
    };

    const mockJwtService = {
        sign: jest.fn().mockReturnValue('mock-jwt-token'),
    };

    beforeEach(async () => {
        // Create testing module with mocked dependencies
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                { provide: UsersService, useValue: mockUsersService },
                { provide: JwtService, useValue: mockJwtService },
            ],
        }).compile();

        authService = module.get<AuthService>(AuthService);
        usersService = module.get<UsersService>(UsersService);
        jwtService = module.get<JwtService>(JwtService);

        // Clear all mocks before each test
        jest.clearAllMocks();
    });

    describe('signup', () => {
        const signupDto = {
            email: 'test@example.com',
            password: 'password123',
        };

        it('should create a new user and return access token', async () => {
            // Arrange
            mockUsersService.findByEmail.mockResolvedValue(null); // User doesn't exist
            mockUsersService.create.mockResolvedValue(mockUser);
            (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');

            // Act
            const result = await authService.signup(signupDto);

            // Assert
            expect(result).toHaveProperty('accessToken');
            expect(result).toHaveProperty('user');
            expect(result.user.email).toBe(signupDto.email);
            expect(mockUsersService.findByEmail).toHaveBeenCalledWith(signupDto.email);
            expect(bcrypt.hash).toHaveBeenCalledWith(signupDto.password, 10);
        });

        it('should throw ConflictException if user already exists', async () => {
            // Arrange
            mockUsersService.findByEmail.mockResolvedValue(mockUser);

            // Act & Assert
            await expect(authService.signup(signupDto)).rejects.toThrow(
                ConflictException,
            );
        });
    });

    describe('login', () => {
        const loginDto = {
            email: 'test@example.com',
            password: 'password123',
        };

        it('should return access token for valid credentials', async () => {
            // Arrange
            mockUsersService.findByEmail.mockResolvedValue(mockUser);
            (bcrypt.compare as jest.Mock).mockResolvedValue(true);

            // Act
            const result = await authService.login(loginDto);

            // Assert
            expect(result).toHaveProperty('accessToken');
            expect(result).toHaveProperty('user');
            expect(result.user.email).toBe(loginDto.email);
            expect(mockJwtService.sign).toHaveBeenCalled();
        });

        it('should throw UnauthorizedException if user not found', async () => {
            // Arrange
            mockUsersService.findByEmail.mockResolvedValue(null);

            // Act & Assert
            await expect(authService.login(loginDto)).rejects.toThrow(
                UnauthorizedException,
            );
        });

        it('should throw UnauthorizedException if password is incorrect', async () => {
            // Arrange
            mockUsersService.findByEmail.mockResolvedValue(mockUser);
            (bcrypt.compare as jest.Mock).mockResolvedValue(false);

            // Act & Assert
            await expect(authService.login(loginDto)).rejects.toThrow(
                UnauthorizedException,
            );
        });
    });
});
