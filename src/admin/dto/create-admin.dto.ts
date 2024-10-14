// initialize createAdminDto
import { IsEmail, IsString, IsNotEmpty, IsOptional, IsArray, MinLength, MaxLength, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

// Data transfer object for creating a new admin
export class CreateAdminDto {
  // Unique email address of admin
	@ApiProperty({ example: 'dr.amgad_sh92@yahoo.com', description: 'Unique email address of admin'})
	@IsEmail({}, { message: 'Email must be a valid email address' })
	@IsNotEmpty()
	email: string;

  // Full name of admin
	@ApiProperty({ example: 'John Doe', description: 'Full name of admin'})
	@IsString({ message: 'Name must be a string' })
	@IsNotEmpty()
	name: string;

  // Roles of admin
	@ApiProperty({ example: ['organizer', 'groupName'], description: 'Optional roles of admin as organizer or name of group controll them'})
	@IsArray({ message: 'Roles must be an array of strings' })
	@IsOptional()
	roles?: string[];
}
