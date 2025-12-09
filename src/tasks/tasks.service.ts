/**
 * Tasks Service
 * -------------
 * Handles all business logic for tasks.
 * Each method includes proper authorization checks.
 */

import {
    Injectable,
    NotFoundException,
    ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './entities/task.entity';
import { CreateTaskDto, UpdateTaskDto } from './dto';
import { User } from '../users/entities/user.entity';
import { Role } from '../common/enums';

@Injectable()
export class TasksService {
    constructor(
        @InjectRepository(Task)
        private tasksRepository: Repository<Task>,
    ) { }

    /**
     * Create a new task for the authenticated user
     * 
     * @param createTaskDto - The task data
     * @param user - The authenticated user
     * @returns The created task
     */
    async create(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
        const task = this.tasksRepository.create({
            ...createTaskDto,
            userId: user.id,
        });

        return this.tasksRepository.save(task);
    }

    /**
     * Get all tasks for the authenticated user
     * 
     * @param user - The authenticated user
     * @returns Array of user's tasks
     */
    async findAll(user: User): Promise<Task[]> {
        // Users can only see their own tasks
        return this.tasksRepository.find({
            where: { userId: user.id },
            order: { createdAt: 'DESC' },
        });
    }

    /**
     * Get a single task by ID
     * Only returns the task if it belongs to the user
     * 
     * @param id - The task ID
     * @param user - The authenticated user
     * @returns The task
     * @throws NotFoundException if task not found
     * @throws ForbiddenException if task belongs to another user
     */
    async findOne(id: string, user: User): Promise<Task> {
        const task = await this.tasksRepository.findOne({ where: { id } });

        if (!task) {
            throw new NotFoundException(`Task with ID "${id}" not found`);
        }

        // Check if the task belongs to the user
        if (task.userId !== user.id) {
            throw new ForbiddenException('You can only access your own tasks');
        }

        return task;
    }

    /**
     * Update a task
     * Only the task owner can update their tasks
     * 
     * @param id - The task ID
     * @param updateTaskDto - The update data
     * @param user - The authenticated user
     * @returns The updated task
     */
    async update(id: string, updateTaskDto: UpdateTaskDto, user: User): Promise<Task> {
        // First, verify the task exists and belongs to the user
        const task = await this.findOne(id, user);

        // Merge the update data with the existing task
        Object.assign(task, updateTaskDto);

        return this.tasksRepository.save(task);
    }

    /**
     * Delete a task
     * - Regular users can only delete their own tasks
     * - Admins can delete any task
     * 
     * @param id - The task ID
     * @param user - The authenticated user
     */
    async remove(id: string, user: User): Promise<void> {
        const task = await this.tasksRepository.findOne({ where: { id } });

        if (!task) {
            throw new NotFoundException(`Task with ID "${id}" not found`);
        }

        // Check authorization:
        // - Admins can delete any task
        // - Regular users can only delete their own tasks
        if (user.role !== Role.ADMIN && task.userId !== user.id) {
            throw new ForbiddenException('You can only delete your own tasks');
        }

        await this.tasksRepository.remove(task);
    }
}
