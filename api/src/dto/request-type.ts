import { Transform, Type } from "class-transformer";
import {
  IsNotEmpty,
  IsNumberString,
  ArrayNotEmpty,
  ValidateNested,
  IsBooleanString,
} from "class-validator";
export class RequestTypeDto {
  @IsNotEmpty()
  name: string;

  @Transform(({ obj, key }) => {
    return obj[key].toString();
  })
  @IsBooleanString()
  authorizeACopy: boolean = false;

  @IsNotEmpty()
  @IsNumberString()
  @Transform(({ obj, key }) => {
    return obj[key].toString();
  })
  fee: string;

  @Transform(({ obj, key }) => {
    return obj[key].toString();
  })
  @IsBooleanString()
  isPaymentRequired: boolean = false;
}

export class UpdateRequestTypeDto extends RequestTypeDto {
  @IsNotEmpty()
  requestTypeId: string;
}

export class RequestRequirementDto {
  @IsNotEmpty()
  name: string;

  @Transform(({ obj, key }) => {
    return obj[key].toString();
  })
  @IsBooleanString()
  requireToSubmitProof: boolean = false;
}

export class CreateRequestRequirementDto extends RequestRequirementDto {
  @IsNotEmpty()
  requestTypeId: string;
}

export class UpdateRequestRequirementDto extends RequestRequirementDto {
  @IsNotEmpty()
  requestRequirementsId: string;
}
