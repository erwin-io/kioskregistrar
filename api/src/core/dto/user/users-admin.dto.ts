import { ApiProperty } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import {
  IsNotEmpty,
  IsNumberString,
  ArrayNotEmpty,
  IsArray,
  ValidateNested,
  IsBooleanString,
  IsDateString,
  IsEmail,
  IsIn,
  IsOptional,
  IsUppercase,
  Matches,
} from "class-validator";


export class CreateAdminUserAccessDto {
  @ApiProperty()
  @IsNotEmpty()
  page: string;

  @ApiProperty()
  @IsNotEmpty()
  @Transform(({ obj, key }) => {
    return obj[key].toString();
  })
  @IsBooleanString()
  view = false;

  @ApiProperty()
  @IsNotEmpty()
  @Transform(({ obj, key }) => {
    return obj[key].toString();
  })
  @IsBooleanString()
  modify = false;

  @ApiProperty({
    isArray: true,
    type: String
  })
  @IsNotEmpty()
  @IsArray()
  @Type(() => String)
  rights: string[] = [];
}

export class DefaultAdminUserDto {
  @ApiProperty()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumberString()
  @Transform(({ obj, key }) => {
    return obj[key].toString();
  })
  mobileNumber: string;
}

export class CreateAdminUserDto extends DefaultAdminUserDto {
  @ApiProperty()
  @IsNotEmpty()
  userName: string;

  @ApiProperty()
  @Transform(({ obj, key }) => {
    return obj[key].toString();
  })
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    isArray: true,
    type: CreateAdminUserAccessDto
  })
  @IsNotEmpty()
  @ArrayNotEmpty()
  @IsArray()
  @Type(() => CreateAdminUserAccessDto)
  @ValidateNested()
  access: CreateAdminUserAccessDto[];
}

export class UpdateAdminUserDto extends DefaultAdminUserDto {

  @ApiProperty({
    isArray: true,
    type: CreateAdminUserAccessDto
  })
  @IsNotEmpty()
  @ArrayNotEmpty()
  @IsArray()
  @Type(() => CreateAdminUserAccessDto)
  @ValidateNested()
  access: CreateAdminUserAccessDto[];
}

export class UpdateAdminUserProfileDto extends DefaultAdminUserDto {
  @ApiProperty()
  @IsOptional()
  profileFile: any;
}
