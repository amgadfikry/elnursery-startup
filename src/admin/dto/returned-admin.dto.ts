import {IsString, IsOptional, IsArray, IsEmail, IsBoolean, IsDate } from 'class-validator';
import { Expose, Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

// Data transfer object for returning an admin
export class ReturnedAdminDto {
  // Unique ID of the admin
	@ApiProperty()
	@IsString()
  @Transform(({ value }) => value.toString())
	@Expose()
  id: string;

  // Unique email address of admin
	@ApiProperty()
	@IsEmail()
	@Expose()
	email: string;

  // Full name of admin
	@ApiProperty()
	@IsString()
	@Expose()
	name: string;

  // Roles of admin
	@ApiProperty()
	@IsArray()
	@IsOptional()
	@Expose()
	roles?: string[];

  // Avatar URL of admin
	@ApiProperty()
	@IsString()
	@IsOptional()
	@Expose()
	avatar?: string;

  // Confirmpassword
  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  @Expose()
  changePassword?: boolean;
}
