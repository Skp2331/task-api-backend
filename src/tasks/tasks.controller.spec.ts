/**
 * Tasks Controller Unit Tests
 * ---------------------------
 * Tests for the TasksController endpoints.
 */

import { Test, TestingModule } from '@nestjs/testing';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { Role, TaskStatus } from '../common/enums';

describe('TasksController', () => {
    let controller: TasksController;
    let tasksService: TasksService;

    // Mock user data
    const mockUser = {
        id: 'user-uuid',
        email: 'test@example.com',
        role: Role.USER,
    };

    // Mock task data
    const mockTask = {
        id: 'task-uuid',
        title: 'Test Task',
        description: 'Test Description',
        status: TaskStatus.OPEN,
        userId: mockUser.id,
        createdAt: new Date(),
        updatedAt: new Date(),
    };

    // Mock TasksService
    const mockTasksService = {
        create: jest.fn(),
        findAll: jest.fn(),
        findOne: jest.fn(),
        update: jest.fn(),
        remove: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [TasksController],
            providers: [
                {
                    provide: TasksService,
                    useValue: mockTasksService,
                },
            ],
        }).compile();

        controller = module.get<TasksController>(TasksController);
        tasksService = module.get<TasksService>(TasksService);

        jest.clearAllMocks();
    });

    describe('create', () => {
        const createTaskDto = {
            title: 'New Task',
            description: 'New Description',
        };

        it('should create a task', async () => {
            // Arrange
            mockTasksService.create.mockResolvedValue(mockTask);

            // Act
            const result = await controller.create(createTaskDto, mockUser as any);

            // Assert
            expect(result).toEqual(mockTask);
            expect(tasksService.create).toHaveBeenCalledWith(createTaskDto, mockUser);
        });
    });

    describe('findAll', () => {
        it('should return all tasks for the user', async () => {
            // Arrange
            const tasks = [mockTask];
            mockTasksService.findAll.mockResolvedValue(tasks);

            // Act
            const result = await controller.findAll(mockUser as any);

            // Assert
            expect(result).toEqual(tasks);
            expect(tasksService.findAll).toHaveBeenCalledWith(mockUser);
        });
    });

    describe('findOne', () => {
        it('should return a single task', async () => {
            // Arrange
            mockTasksService.findOne.mockResolvedValue(mockTask);

            // Act
            const result = await controller.findOne(mockTask.id, mockUser as any);

            // Assert
            expect(result).toEqual(mockTask);
            expect(tasksService.findOne).toHaveBeenCalledWith(mockTask.id, mockUser);
        });
    });

    describe('update', () => {
        const updateTaskDto = {
            title: 'Updated Title',
        };

        it('should update a task', async () => {
            // Arrange
            const updatedTask = { ...mockTask, ...updateTaskDto };
            mockTasksService.update.mockResolvedValue(updatedTask);

            // Act
            const result = await controller.update(
                mockTask.id,
                updateTaskDto,
                mockUser as any,
            );

            // Assert
            expect(result).toEqual(updatedTask);
            expect(tasksService.update).toHaveBeenCalledWith(
                mockTask.id,
                updateTaskDto,
                mockUser,
            );
        });
    });

    describe('remove', () => {
        it('should delete a task', async () => {
            // Arrange
            mockTasksService.remove.mockResolvedValue(undefined);

            // Act
            await controller.remove(mockTask.id, mockUser as any);

            // Assert
            expect(tasksService.remove).toHaveBeenCalledWith(mockTask.id, mockUser);
        });
    });
});
