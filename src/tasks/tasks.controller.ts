/**
 * Tasks Controller
 * ----------------
 * Handles HTTP requests for task endpoints.
 * All routes are protected with JWT authentication.
 */

import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
    ParseUUIDPipe,
    HttpCode,
    HttpStatus,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto, UpdateTaskDto } from './dto';
import { JwtAuthGuard } from '../auth/guards';
import { GetUser } from '../auth/decorators';
import { User } from '../users/entities/user.entity';

@Controller('tasks')
@UseGuards(JwtAuthGuard) // All routes require authentication
export class TasksController {
    constructor(private readonly tasksService: TasksService) { }

    /**
     * POST /tasks
     * Create a new task for the authenticated user
     */
    @Post()
    create(@Body() createTaskDto: CreateTaskDto, @GetUser() user: User) {
        return this.tasksService.create(createTaskDto, user);
    }

    /**
     * GET /tasks
     * Get all tasks for the authenticated user
     */
    @Get()
    findAll(@GetUser() user: User) {
        return this.tasksService.findAll(user);
    }

    /**
     * GET /tasks/:id
     * Get a specific task by ID
     * ParseUUIDPipe validates that the ID is a valid UUID
     */
    @Get(':id')
    findOne(@Param('id', ParseUUIDPipe) id: string, @GetUser() user: User) {
        return this.tasksService.findOne(id, user);
    }

    /**
     * PATCH /tasks/:id
     * Update a specific task
     */
    @Patch(':id')
    update(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() updateTaskDto: UpdateTaskDto,
        @GetUser() user: User,
    ) {
        return this.tasksService.update(id, updateTaskDto, user);
    }

    /**
     * DELETE /tasks/:id
     * Delete a specific task
     * - Regular users can only delete their own tasks
     * - Admins can delete any task
     */
    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT) // Return 204 on successful delete
    remove(@Param('id', ParseUUIDPipe) id: string, @GetUser() user: User) {
        return this.tasksService.remove(id, user);
    }
}
