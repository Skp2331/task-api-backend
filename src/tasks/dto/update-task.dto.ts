/**
 * Update Task DTO
 * ---------------
 * Defines the data that can be updated on a task.
 * All fields are optional - only provided fields will be updated.
 */

import { IsOptional, IsString, IsEnum, MaxLength } from 'class-validator';
import { TaskStatus } from '../../common/enums';

export class UpdateTaskDto {
    @IsOptional()
    @IsString()
    @MaxLength(100, { message: 'Title cannot exceed 100 characters' })
    title?: string;

    @IsOptional()
    @IsString()
    @MaxLength(500, { message: 'Description cannot exceed 500 characters' })
    description?: string;

    @IsOptional()
    @IsEnum(TaskStatus, {
        message: 'Status must be one of: OPEN, IN_PROGRESS, DONE',
    })
    status?: TaskStatus;
}
