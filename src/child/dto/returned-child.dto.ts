import { IsString, IsNumber, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';

// Data transfer object for returning an user
export class ReturnedChildDto {
  // Unique ID of the child
  @ApiProperty()
  @IsString()
  @Transform(({ value }) => value.toString())
  @Expose()
  id: string;

  // parent id of child
  @ApiProperty()
  @IsString()
  @Expose()
  parentID: string;

  // Full name of user
  @ApiProperty()
  @IsString()
  @Expose()
  name: string;

  // Date of birth of child
  @ApiProperty()
  @IsString()
  @Expose()
  dateOfBirth: string;

  // Age of child
  @ApiProperty()
  @IsNumber()
  @Expose()
  age: number;

  // pause program boolean to check if child is paused
  @ApiProperty()
  @IsBoolean()
  @Expose()
  pauseProgram?: boolean;

  // Avatar URL of child
  @ApiProperty()
  @IsString()
  @IsOptional()
  @Expose()
  avatar?: string;
}