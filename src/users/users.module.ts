/**
 * Users Module
 * ------------
 * Groups all user-related components together.
 * Exports UsersService so other modules (like Auth) can use it.
 */

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

@Module({
    imports: [
        // Register User entity with TypeORM for this module
        TypeOrmModule.forFeature([User]),
    ],
    providers: [UsersService],
    // Export UsersService so AuthModule can use it
    exports: [UsersService],
})
export class UsersModule { }
