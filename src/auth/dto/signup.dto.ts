/**
 * Signup DTO (Data Transfer Object)
 * ----------------------------------
 * Defines the shape of data expected when a user signs up.
 * class-validator decorators validate the incoming data automatically.
 */

import { IsEmail, IsNotEmpty, IsString, MinLength, IsEnum, IsOptional } from 'class-validator';
import { Role } from '../../common/enums';

export class SignupDto {
    // Email must be a valid email format
    @IsEmail({}, { message: 'Please provide a valid email address' })
    @IsNotEmpty({ message: 'Email is required' })
    email: string;

    // Password must be at least 6 characters
    @IsString()
    @IsNotEmpty({ message: 'Password is required' })
    @MinLength(6, { message: 'Password must be at least 6 characters long' })
    password: string;

    // Role is optional - defaults to 'user' if not provided
    @IsOptional()
    @IsEnum(Role, { message: 'Role must be either "user" or "admin"' })
    role?: Role;
}
