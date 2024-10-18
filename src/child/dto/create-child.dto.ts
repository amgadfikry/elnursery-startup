import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

// Data transfer object for creating a new Child
export class CreateChildDto {
  //name of parent
  @ApiProperty({ example: 'Ahmed Ali', description: 'Full name of child'})
  @IsString({ message: 'Name must be a string' })
  @IsNotEmpty()
  name: string;

  // date of birth of child
  @ApiProperty({ example: '12/12/2022', description: 'Date of birth of child'})
  @IsString({ message: 'Date of birth must be a string' })
  @IsNotEmpty()
  dateOfBirth: string;

  // avatar URL of child
  @ApiProperty({ example: 'https://example.com/avatar.png', description: 'Avatar URL of child'})
  @IsString({ message: 'Avatar must be a string' })
  @IsOptional()
  avatar?: string;
}
