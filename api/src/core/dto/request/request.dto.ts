import { ApiProperty } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import {
  IsNotEmpty,
  IsNumberString,
  ArrayNotEmpty,
  ValidateNested,
  IsBooleanString,
  IsEnum,
} from "class-validator";
export class RequestDto {
  @ApiProperty()
  @IsNotEmpty()
  requestedById: string;

  @ApiProperty()
  @IsNotEmpty()
  requestTypeId: string;

  @ApiProperty()
  @IsNotEmpty()
  description: string;
}
