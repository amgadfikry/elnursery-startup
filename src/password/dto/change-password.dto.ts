import { IsString, IsNotEmpty, MinLength, MaxLength, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Match } from 'src/common/decorators/match.decorator';

// Data transfer object for changing password
export class ChangePasswordDto {
  // Old password
  @ApiProperty({ example: 'AbcdefG@22', description: 'Old password of user'})
  @IsString({ message: 'Password must be a string' })
  @IsNotEmpty()
  oldPassword: string;

  // new password 
  @ApiProperty({
    example: 'AbcdefG@22',
    description: 'Password must be at least 8 character, not more than 20 character,\
    and contain at least one uppercase, one lowercase, one number, and one special character'
  })
  @IsString({ message: 'Password must be a string' })
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @MaxLength(20, { message: 'Password cannot be longer than 20 characters' })
  @Matches(/(?=.*[A-Z])/, { message: 'Password must contain at least one uppercase letter' })
  @Matches(/(?=.*[a-z])/, { message: 'Password must contain at least one lowercase letter' })
  @Matches(/(?=.*\d)/, { message: 'Password must contain at least one number' })
  @Matches(/(?=.*[@$!%*?&])/, { message: 'Password must contain at least one special character' })
  @IsNotEmpty()
  newPassword: string;

  // confirm new password
  @ApiProperty({ example: 'AbcdefG@22', description: 'Must match the new password', })
  @IsString({ message: 'Password must be a string' })
  @Match('newPassword', { message: 'Passwords do not match' }) // custome decorator to match the new password with confirm password
  @IsNotEmpty()
  confirmPassword: string;
}
