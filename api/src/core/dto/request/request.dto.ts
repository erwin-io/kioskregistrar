import { ApiProperty } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import {
  IsNotEmpty,
  IsNumberString,
  ArrayNotEmpty,
  ValidateNested,
  IsBooleanString,
  IsEnum,
  IsArray,
  IsOptional,
} from "class-validator";

export class RequestRequirementsFileDto {
  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  data: any;
}

export class RequestRequirementsDto {
  @ApiProperty()
  @IsNotEmpty()
  requestRequirementsId: string;

  @ApiProperty({
    isArray: true,
    type: RequestRequirementsFileDto
  })
  @IsOptional()
  @IsArray()
  @Type(() => RequestRequirementsFileDto)
  @ValidateNested()
  files: RequestRequirementsFileDto[];
}

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
  
  @ApiProperty({
    isArray: true,
    type: RequestRequirementsDto
  })
  @IsOptional()
  @IsArray()
  @Type(() => RequestRequirementsDto)
  @ValidateNested()
  requirements: RequestRequirementsDto[];
}
