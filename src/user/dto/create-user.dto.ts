// initialize createUserDto
import { IsEmail, IsString, IsNotEmpty, IsOptional, MinLength, MaxLength, Matches, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

// Data transfer object for creating a new User
export class CreateUserDto {
  // Unique email address of User
	@ApiProperty({ example: 'dr.amgad_sh92@yahoo.com', description: 'Unique email address of user'})
	@IsEmail({}, { message: 'Email must be a valid email address' })
	@IsNotEmpty()
	email: string;
  
  // Full name of user
	@ApiProperty({ example: 'John Doe', description: 'Full name of user'})
	@IsString({ message: 'Name must be a string' })
	@IsNotEmpty()
	name: string;

  // Class of user
  @ApiProperty({ example: 'Class 1', description: 'Class of user'})
  @IsString({ message: 'Class must be a string' })
  @IsOptional()
  @IsNotEmpty()
  class?: string;

  // Number of children
	@ApiProperty({ example: 2, description: 'Number of children of user with default value of 1'})
	@IsNumber({ allowNaN: false, allowInfinity: false }, { message: 'Children number must be a number' })
	@IsOptional()
	children: number;
}

