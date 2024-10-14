import { OmitType } from "@nestjs/swagger";
import { ChangePasswordDto } from "./change-password.dto";
import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsNotEmpty } from "class-validator";

// ChangePasswordTokenDto is a class that extends the ChangePasswordDto class.
export class ChangePasswordTokenDto extends OmitType(ChangePasswordDto, ['oldPassword'] as const) {
  // token
  @ApiProperty({ example: '123456', description: 'Token for changing password' })
  @IsNumber()
  @IsNotEmpty()
  code: number;
}
