import { IsString, IsEmail, IsNotEmpty } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

// Data transfer object for logging in a user
export class LoginDto {
  // Email address of admin or user
  @ApiProperty({ example: 'dr.amgad_sh92@yahoo.com', description: 'Email address of admin or user'})
  @IsEmail({}, { message: 'Email must be a valid email address' })
  @IsNotEmpty()
  email: string;

  // Password of admin or user account
  @ApiProperty({ example: 'AbcdefG@22', description: 'Password of admin or user account'})
  @IsString({ message: 'Password must be a string' })
  @IsNotEmpty()
  password: string;
}
