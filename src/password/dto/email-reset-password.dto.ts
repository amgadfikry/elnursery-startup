import { IsNotEmpty, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class EmailResetPasswordDto {
  @ApiProperty({ example: 'dr.amgad_sh92@yahoo.com', description: 'Unique email address of admin'})
  @IsEmail({}, { message: 'Email must be a valid email address' })
  @IsNotEmpty()
  email: string;
}
