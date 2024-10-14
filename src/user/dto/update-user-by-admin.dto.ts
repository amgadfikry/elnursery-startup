import { PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';

// PartialType is a mapped type that creates a new class with the same properties as the provided class, but all optional.
export class UpdateUserByAdminDto extends PartialType(CreateUserDto) {
  // isActive of the user
  @ApiProperty({example: true, description: "User is active or not"})
  @IsBoolean({message: "isActive must be a boolean"})
  @IsOptional()
  isActive?: boolean;
}
