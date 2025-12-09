/**
 * Tasks Service Unit Tests
 * ------------------------
 * Tests for the TasksService CRUD operations.
 */

import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { Task } from './entities/task.entity';
import { Role, TaskStatus } from '../common/enums';

describe('TasksService', () => {
    let tasksService: TasksService;
    let tasksRepository: Repository<Task>;

    // Mock user data
    const mockUser = {
        id: 'user-uuid',
        email: 'test@example.com',
        role: Role.USER,
    };

    const mockAdmin = {
        id: 'admin-uuid',
        email: 'admin@example.com',
        role: Role.ADMIN,
    };

    // Mock task data
    const mockTask = {
        id: 'task-uuid',
        title: 'Test Task',
        description: 'Test Description',
        status: TaskStatus.OPEN,
        userId: 'user-uuid',
        createdAt: new Date(),
        updatedAt: new Date(),
    };

    // Mock repository
    const mockRepository = {
        create: jest.fn(),
        save: jest.fn(),
        find: jest.fn(),
        findOne: jest.fn(),
        remove: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                TasksService,
                {
                    provide: getRepositoryToken(Task),
                    useValue: mockRepository,
                },
            ],
        }).compile();

        tasksService = module.get<TasksService>(TasksService);
        tasksRepository = module.get<Repository<Task>>(getRepositoryToken(Task));

        jest.clearAllMocks();
    });

    describe('create', () => {
        const createTaskDto = {
            title: 'New Task',
            description: 'New Description',
        };

        it('should create a new task', async () => {
            // Arrange
            const newTask = { ...mockTask, ...createTaskDto };
            mockRepository.create.mockReturnValue(newTask);
            mockRepository.save.mockResolvedValue(newTask);

            // Act
            const result = await tasksService.create(createTaskDto, mockUser as any);

            // Assert
            expect(result).toEqual(newTask);
            expect(mockRepository.create).toHaveBeenCalledWith({
                ...createTaskDto,
                userId: mockUser.id,
            });
            expect(mockRepository.save).toHaveBeenCalled();
        });
    });

    describe('findAll', () => {
        it('should return all tasks for the user', async () => {
            // Arrange
            const tasks = [mockTask];
            mockRepository.find.mockResolvedValue(tasks);

            // Act
            const result = await tasksService.findAll(mockUser as any);

            // Assert
            expect(result).toEqual(tasks);
            expect(mockRepository.find).toHaveBeenCalledWith({
                where: { userId: mockUser.id },
                order: { createdAt: 'DESC' },
            });
        });
    });

    describe('findOne', () => {
        it('should return a task if it belongs to the user', async () => {
            // Arrange
            mockRepository.findOne.mockResolvedValue(mockTask);

            // Act
            const result = await tasksService.findOne(mockTask.id, mockUser as any);

            // Assert
            expect(result).toEqual(mockTask);
        });

        it('should throw NotFoundException if task does not exist', async () => {
            // Arrange
            mockRepository.findOne.mockResolvedValue(null);

            // Act & Assert
            await expect(
                tasksService.findOne('non-existent-id', mockUser as any),
            ).rejects.toThrow(NotFoundException);
        });

        it('should throw ForbiddenException if task belongs to another user', async () => {
            // Arrange
            const otherUserTask = { ...mockTask, userId: 'other-user-id' };
            mockRepository.findOne.mockResolvedValue(otherUserTask);

            // Act & Assert
            await expect(
                tasksService.findOne(mockTask.id, mockUser as any),
            ).rejects.toThrow(ForbiddenException);
        });
    });

    describe('update', () => {
        const updateTaskDto = {
            title: 'Updated Title',
            status: TaskStatus.IN_PROGRESS,
        };

        it('should update a task', async () => {
            // Arrange
            const updatedTask = { ...mockTask, ...updateTaskDto };
            mockRepository.findOne.mockResolvedValue(mockTask);
            mockRepository.save.mockResolvedValue(updatedTask);

            // Act
            const result = await tasksService.update(
                mockTask.id,
                updateTaskDto,
                mockUser as any,
            );

            // Assert
            expect(result.title).toBe(updateTaskDto.title);
            expect(mockRepository.save).toHaveBeenCalled();
        });
    });

    describe('remove', () => {
        it('should delete a task for the owner', async () => {
            // Arrange
            mockRepository.findOne.mockResolvedValue(mockTask);
            mockRepository.remove.mockResolvedValue(undefined);

            // Act
            await tasksService.remove(mockTask.id, mockUser as any);

            // Assert
            expect(mockRepository.remove).toHaveBeenCalledWith(mockTask);
        });

        it('should allow admin to delete any task', async () => {
            // Arrange
            mockRepository.findOne.mockResolvedValue(mockTask);
            mockRepository.remove.mockResolvedValue(undefined);

            // Act
            await tasksService.remove(mockTask.id, mockAdmin as any);

            // Assert
            expect(mockRepository.remove).toHaveBeenCalledWith(mockTask);
        });

        it('should throw ForbiddenException if non-owner tries to delete', async () => {
            // Arrange
            const otherUser = { ...mockUser, id: 'other-user-id' };
            mockRepository.findOne.mockResolvedValue(mockTask);

            // Act & Assert
            await expect(
                tasksService.remove(mockTask.id, otherUser as any),
            ).rejects.toThrow(ForbiddenException);
        });

        it('should throw NotFoundException if task does not exist', async () => {
            // Arrange
            mockRepository.findOne.mockResolvedValue(null);

            // Act & Assert
            await expect(
                tasksService.remove('non-existent-id', mockUser as any),
            ).rejects.toThrow(NotFoundException);
        });
    });
});
