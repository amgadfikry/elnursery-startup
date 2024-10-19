import { IsString, IsNotEmpty, IsOptional, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

// Data transfer object for creating a new Child
export class CreateChildDto {
  //name of parent
  @ApiProperty({ example: 'Ahmed Ali', description: 'Full name of child'})
  @IsString({ message: 'Name must be a string' })
  @IsNotEmpty()
  name: string;

  // date of birth of child
  @ApiProperty({ example: '2021-01-01', description: 'Date of birth of child'})
  @IsDateString()
  @IsNotEmpty()
  dateOfBirth: Date;

  // avatar URL of child
  @ApiProperty({ example: 'https://example.com/avatar.png', description: 'Avatar URL of child'})
  @IsString({ message: 'Avatar must be a string' })
  @IsOptional()
  avatar?: string;
}
