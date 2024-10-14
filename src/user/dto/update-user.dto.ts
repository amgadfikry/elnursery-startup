import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";


export class UpdateUserDto {
  // avatar of the user
  @ApiProperty({example: "url to the user avatar", description: "Avatar of the user"})
  @IsString({message: "Avatar must be a string"})
  @IsOptional()
  avatar?: string;
}
