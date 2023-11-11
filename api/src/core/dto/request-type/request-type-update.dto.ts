import { Transform, Type } from "class-transformer";
import {
  IsNotEmpty,
  IsNumberString,
  ArrayNotEmpty,
  ValidateNested,
  IsBooleanString,
} from "class-validator";
import { RequestRequirementDto, RequestTypeDto } from "./request-type.dto";
import { ApiProperty } from "@nestjs/swagger";

export class UpdateRequestTypeDto extends RequestTypeDto {
}

export class UpdateRequestRequirementDto extends RequestRequirementDto {
}
