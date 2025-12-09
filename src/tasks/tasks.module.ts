/**
 * Tasks Module
 * ------------
 * Groups all task-related components together.
 */

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { Task } from './entities/task.entity';

@Module({
    imports: [
        // Register Task entity with TypeORM
        TypeOrmModule.forFeature([Task]),
    ],
    controllers: [TasksController],
    providers: [TasksService],
})
export class TasksModule { }
