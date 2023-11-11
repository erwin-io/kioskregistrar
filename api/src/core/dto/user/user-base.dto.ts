import { ApiProperty } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import {
  ArrayNotEmpty,
  IsArray,
  IsNotEmpty,
  IsNumberString,
  ValidateNested,
} from "class-validator";

export class UserDto {
  @ApiProperty()
  @IsNotEmpty()
  userId: string;
}