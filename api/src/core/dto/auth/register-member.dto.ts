import { Transform, Type } from "class-transformer";
import {
  validate,
  validateOrReject,
  Contains,
  IsInt,
  Length,
  IsEmail,
  IsFQDN,
  IsDate,
  Min,
  Max,
  IsNotEmpty,
  IsArray,
  ValidateNested,
} from "class-validator";
import { Match } from "../match.decorator.dto";
import { DefaultMemberDto } from "../user/user-member.dto";
import { ApiProperty } from "@nestjs/swagger";

export class RegisterMemberUserDto extends DefaultMemberDto {
  
  @ApiProperty()
  @IsNotEmpty()
  userName: string;

  @ApiProperty()
  @Transform(({ obj, key }) => {
    return obj[key].toString();
  })
  @IsNotEmpty()
  password: string;
}
export class RegisterMemberBatchUserDto {
  
  @ApiProperty({
    isArray: true,
    type: RegisterMemberUserDto
  })
  @IsArray()
  @IsNotEmpty()
  @Type(() => RegisterMemberUserDto)
  @ValidateNested()
  members: RegisterMemberUserDto[];
}