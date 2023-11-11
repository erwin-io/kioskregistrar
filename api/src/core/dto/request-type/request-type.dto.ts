import { ApiProperty } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import {
  IsNotEmpty,
  IsNumberString,
  ArrayNotEmpty,
  ValidateNested,
  IsBooleanString,
} from "class-validator";
export class RequestTypeDto {
  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    type: Boolean
  })
  @Transform(({ obj, key }) => {
    return obj[key].toString();
  })
  @IsBooleanString()
  authorizeACopy = false;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumberString()
  @Transform(({ obj, key }) => {
    return obj[key].toString();
  })
  fee: string;

  @ApiProperty({
    type: Boolean
  })
  @Transform(({ obj, key }) => {
    return obj[key].toString();
  })
  @IsBooleanString()
  isPaymentRequired = false;
}

export class RequestRequirementDto {
  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    type: Boolean
  })
  @Transform(({ obj, key }) => {
    return obj[key].toString();
  })
  @IsBooleanString()
  requireToSubmitProof = false;
}

export class CreateRequestRequirementDto extends RequestRequirementDto {
  @ApiProperty()
  @IsNotEmpty()
  requestTypeId: string;
}
