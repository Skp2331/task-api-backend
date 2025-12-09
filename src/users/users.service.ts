/**
 * Users Service
 * -------------
 * Handles all database operations related to users.
 * This service is used by the AuthService for signup/login.
 */

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { Role } from '../common/enums';

@Injectable()
export class UsersService {
    constructor(
        // Inject the User repository for database operations
        @InjectRepository(User)
        private usersRepository: Repository<User>,
    ) { }

    /**
     * Find a user by their email address
     * Used during login to check if user exists
     * 
     * @param email - The email to search for
     * @param includePassword - Whether to include password in result (needed for login)
     * @returns The user if found, undefined otherwise
     */
    async findByEmail(email: string, includePassword = false): Promise<User | undefined> {
        const query = this.usersRepository
            .createQueryBuilder('user')
            .where('user.email = :email', { email });

        // Only include password when explicitly requested (for login verification)
        if (includePassword) {
            query.addSelect('user.password');
        }

        return query.getOne();
    }

    /**
     * Find a user by their ID
     * 
     * @param id - The user's UUID
     * @returns The user if found
     */
    async findById(id: string): Promise<User | undefined> {
        return this.usersRepository.findOne({ where: { id } });
    }

    /**
     * Create a new user in the database
     * Password should already be hashed before calling this
     * 
     * @param email - User's email
     * @param hashedPassword - Already hashed password
     * @param role - User role (defaults to 'user')
     * @returns The created user (without password)
     */
    async create(email: string, hashedPassword: string, role: Role = Role.USER): Promise<User> {
        const user = this.usersRepository.create({
            email,
            password: hashedPassword,
            role,
        });

        // Save and return the user
        const savedUser = await this.usersRepository.save(user);

        // Remove password from the returned object
        delete savedUser.password;
        return savedUser;
    }
}
