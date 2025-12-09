/**
 * Create Task DTO
 * ---------------
 * Defines the data required to create a new task.
 */

import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateTaskDto {
    @IsString()
    @IsNotEmpty({ message: 'Title is required' })
    @MaxLength(100, { message: 'Title cannot exceed 100 characters' })
    title: string;

    @IsString()
    @IsNotEmpty({ message: 'Description is required' })
    @MaxLength(500, { message: 'Description cannot exceed 500 characters' })
    description: string;
}
