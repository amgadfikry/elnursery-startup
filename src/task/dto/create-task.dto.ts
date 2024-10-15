// initialize createTaskDto
import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

// Data transfer object for creating a new task
export class CreateTaskDto {
  // Title field of the Task
  @ApiProperty({ example: 'Speak 5 words', description: 'Title of the task'})
  @IsString({ message: 'Title must be a string' })
  @IsNotEmpty()
  title: string;

  // Category field of the Task
  @ApiProperty({ example: 'Speaking', description: 'Category of the task'})
  @IsString({ message: 'Category must be a string' })
  @IsNotEmpty()
  category: string;

  // Description field of the Task
  @ApiProperty({ example: 'Speak 5 words in English', description: 'Description of the task'})
  @IsString({ message: 'Description must be a string' })
  @IsOptional()
  description?: string;

  // Data field of the Task
  @ApiProperty({ example: 'https://www.googldrive.com/1234', description: 'Url of the task'})
  @IsString({ message: 'Date must string of url' })
  @IsNotEmpty()
  data: string;

  // Level field of the Task
  @ApiProperty({ example: 5, description: 'Level of the task'})
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  level?: number;
}
