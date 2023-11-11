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

export class UpdateRequestDescriptionDto {
  @ApiProperty()
  @IsNotEmpty()
  description: string;
}

export class UpdateRequestStatusDto {
}


export class AssignRequestDto extends UpdateRequestStatusDto {
  @ApiProperty()
  @IsNotEmpty()
  assignedAdminId: string;
}

export class MarkRequestAsPaidDto extends UpdateRequestStatusDto {
}

export class MarkRequestAsProcessedDto extends UpdateRequestStatusDto {
}

export class MarkRequestAsCompletedDto extends UpdateRequestStatusDto {
}

export class MarkRequestAsClosedDto extends UpdateRequestStatusDto {
}
