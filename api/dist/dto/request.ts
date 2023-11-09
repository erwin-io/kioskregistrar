import { Transform, Type } from "class-transformer";
import {
  IsNotEmpty,
  IsNumberString,
  ArrayNotEmpty,
  ValidateNested,
  IsBooleanString,
  IsEnum,
} from "class-validator";
import { CONST_REQUEST_STATUS } from "../utils/constant";
export class RequestDto {
  @IsNotEmpty()
  requestedById: string;

  @IsNotEmpty()
  requestTypeId: string;

  @IsNotEmpty()
  description: string;
}

export class UpdateRequestDescriptionDto {
  @IsNotEmpty()
  requestNo: string;

  @IsNotEmpty()
  description: string;
}

export class UpdateRequestStatusDto {
  @IsNotEmpty()
  requestNo: string;
  // @IsNotEmpty()
  // @Transform(({ obj, key }) => {
  //   return obj[key].toString().toUpperCase();
  // })
  // @IsEnum(CONST_REQUEST_STATUS, {
  //   message: "requestStatus must be one of the following values: " + CONST_REQUEST_STATUS.toString()
  // })
  // requestStatus: "PENDING" | "TOPAY" | "PROCESSING" | "TOCOMPLETE" | "CLOSED";
}


export class AssignRequestDto extends UpdateRequestStatusDto {
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
