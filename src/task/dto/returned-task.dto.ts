import { IsNumber, IsString } from 'class-validator';
import { Expose, Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

// Data transfer object for returning an task
export class ReturnedTaskDto {
  // Unique ID of the task
	@ApiProperty()
	@IsString()
  @Transform(({ value }) => value.toString())
	@Expose()
  id: string;

  // Title field of the Task
  @ApiProperty()
  @IsString()
  @Expose()
  title: string;

  // Category field of the Task
  @ApiProperty()
  @IsString()
  @Expose()
  category: string;

  // Description field of the Task
  @ApiProperty()
  @IsString()
  @Expose()
  description: string;

  // Data field of the Task
  @ApiProperty()
  @IsString()
  @Expose()
  data: string;

  // Level field of the Task
  @ApiProperty()
  @IsNumber()
  @Expose()
  level: number;
}
