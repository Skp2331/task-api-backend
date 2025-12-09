/**
 * User Entity
 * -----------
 * This defines our User table in the database.
 * TypeORM uses decorators to map this class to a database table.
 */

import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
} from 'typeorm';
import { Task } from '../../tasks/entities/task.entity';
import { Role } from '../../common/enums';

@Entity('users') // This creates a 'users' table
export class User {
    // Primary key - auto-generated UUID
    @PrimaryGeneratedColumn('uuid')
    id: string;

    // Email must be unique - no two users can have the same email
    @Column({ unique: true })
    email: string;

    // Password will be stored as a hashed string
    // select: false means password won't be returned in queries by default
    @Column({ select: false })
    password: string;

    // User role - defaults to 'user'
    @Column({
        type: 'enum',
        enum: Role,
        default: Role.USER,
    })
    role: Role;

    // Timestamps - automatically managed by TypeORM
    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    // One user can have many tasks
    // When a user is deleted, their tasks are also deleted (cascade)
    @OneToMany(() => Task, (task) => task.user, { cascade: true })
    tasks: Task[];
}
