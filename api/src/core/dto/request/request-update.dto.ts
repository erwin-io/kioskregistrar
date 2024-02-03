import { ApiProperty } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import {
  IsNotEmpty,
  IsNumberString,
  ArrayNotEmpty,
  ValidateNested,
  IsBooleanString,
  IsEnum,
  IsIn,
  IsUppercase,
  IsArray,
  IsOptional,
} from "class-validator";
import { RequestRequirementsDto } from "./request.dto";

export class UpdateRequestDto {
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

export class UpdateRequestDescriptionDto {
  @ApiProperty()
  @IsNotEmpty()
  description: string;
}

export class UpdateRequestStatusDto {}

export class AssignRequestDto extends UpdateRequestStatusDto {
  @ApiProperty()
  @IsNotEmpty()
  assignedAdminId: string;
}

export class MarkRequestAsPaidDto extends UpdateRequestStatusDto {}

export class MarkRequestAsProcessedDto extends UpdateRequestStatusDto {}

export class MarkRequestAsCompletedDto extends UpdateRequestStatusDto {}

export class MarkRequestAsClosedDto extends UpdateRequestStatusDto {}

export class CancelRequestDto extends UpdateRequestStatusDto {
  // @ApiProperty({
  //   type: String,
  //   default: "",
  // })
  // @IsNotEmpty()
  // @IsIn([
  //   "CHANGE_MY_MIND",
  //   "BUSY_SCHEDULE",
  //   "PAYMENT_ISSUE",
  //   "FOR_CLARIFACTION",
  // ])
  // @IsUppercase()
  // cancelReason:
  //   | "CHANGE_MY_MIND"
  //   | "BUSY_SCHEDULE"
  //   | "PAYMENT_ISSUE"
  //   | "FOR_CLARIFACTION";
}

export class RejectRequestDto extends UpdateRequestStatusDto {
  // @ApiProperty({
  //   type: String,
  //   default: "",
  // })
  // @IsNotEmpty()
  // @IsIn([
  //   "NO_SHOW_LATE",
  //   "INVALID_REQUEST",
  //   "FOR_CLARIFACTION",
  //   "REGISTRAR_CONCERNS",
  //   "NOT_AVAILABLE",
  // ])
  // @IsUppercase()
  // rejectReason:
  //   | "NO_SHOW_LATE"
  //   | "INVALID_REQUEST"
  //   | "FOR_CLARIFACTION"
  //   | "REGISTRAR_CONCERNS"
  //   | "NOT_AVAILABLE";
}
