/**
 * Task Entity
 * -----------
 * This defines our Task table in the database.
 * Each task belongs to a user (many-to-one relationship).
 */

import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { TaskStatus } from '../../common/enums';

@Entity('tasks') // This creates a 'tasks' table
export class Task {
    // Primary key - auto-generated UUID
    @PrimaryGeneratedColumn('uuid')
    id: string;

    // Task title - required
    @Column()
    title: string;

    // Task description - required
    @Column('text')
    description: string;

    // Task status - defaults to OPEN
    @Column({
        type: 'enum',
        enum: TaskStatus,
        default: TaskStatus.OPEN,
    })
    status: TaskStatus;

    // Foreign key to user
    @Column()
    userId: string;

    // Many tasks belong to one user
    // eager: false means user won't be loaded automatically
    // onDelete: CASCADE means if user is deleted, their tasks are too
    @ManyToOne(() => User, (user) => user.tasks, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'userId' })
    user: User;

    // Timestamps
    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
