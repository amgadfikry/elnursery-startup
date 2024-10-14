import { IsEmail, IsString, IsNumber, IsArray, IsOptional, IsBoolean, IsDate } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';
import { ObjectId } from 'mongoose';

// Data transfer object for returning an user
export class ReturnedUserDto {
  // Unique ID of the user
	@ApiProperty()
	@IsString()
  @Transform(({ value }) => value.toString())
	@Expose()
  id: string;

  // Unique email address of user
	@ApiProperty()
	@IsEmail()
	@Expose()
	email: string;

  // Full name of user
	@ApiProperty()
	@IsString()
	@Expose()
	name: string;

  // number of children
  @ApiProperty()
  @IsNumber()
  @IsOptional()
  @Expose()
  children?: number;

  // list of childern names and ids of children in children collection
  @ApiProperty()
  @IsArray()
  @IsOptional()
  @Expose()
  childrenList?: { name: string, id: string | ObjectId }[];

  // Class of user
  @ApiProperty()
  @IsString()
  @IsOptional()
  @Expose()
  class?: string;

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

  // isactive boolean to check if user is active
  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  @Expose()
  isActive?: boolean;

  // lastActivatedDate date to check when user was last activated
  @ApiProperty()
  @IsDate()
  @IsOptional()
  @Expose()
  lastActivatedDate?: Date;
}
