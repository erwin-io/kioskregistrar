import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import {
  IsArray,
  IsBooleanString,
  IsDateString,
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsUppercase,
  Matches,
} from "class-validator";

export class MemberVerificationDto {
  @ApiProperty()
  @IsArray()
  memberCodes: string[] = [];
}

export class DefaultMemberDto {
  @ApiProperty()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty()
  @IsOptional()
  middleName: string;

  @ApiProperty()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  @Transform(({ obj, key }) => {
    return obj[key].toString();
  })
  @IsNumberString()
  mobileNumber: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsDateString({ strict: true } as any)
  birthDate: Date;

  @ApiProperty()
  @IsNotEmpty()
  address: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsIn(["MALE", "FEMALE", "OTHERS"])
  @IsUppercase()
  gender: "MALE" | "FEMALE" | "OTHERS";

  @ApiProperty()
  @IsNotEmpty()
  courseTaken: string;

  @ApiProperty()
  @IsOptional()
  major: string;

  @ApiProperty()
  @Transform(({ obj, key }) => {
    return obj[key].toString();
  })
  @IsBooleanString()
  isAlumni = false;

  @ApiProperty()
  @IsNotEmpty()
  @Matches(
    /^ *((\d *- *\d)|(\d{2} *- *\d{2})|(\d{3} *- *\d{3})|(\d{4} *- *\d{4})|(\d{5} *- *\d{5})) *$/,
    {
      message:
        "Invalid format for secondarySyGraduated, must match 0000-0000 format",
    }
  )
  schoolYearLastAttended: string;

  @ApiProperty()
  @IsNotEmpty()
  primarySchoolName = "";

  @ApiProperty()
  @IsNotEmpty()
  @Matches(
    /^ *((\d *- *\d)|(\d{2} *- *\d{2})|(\d{3} *- *\d{3})|(\d{4} *- *\d{4})|(\d{5} *- *\d{5})) *$/,
    {
      message:
        "Invalid format for secondarySyGraduated, must match 0000-0000 format",
    }
  )
  primarySyGraduated = "";

  @ApiProperty()
  @IsNotEmpty()
  secondarySchoolName = "";

  @ApiProperty()
  @IsNotEmpty()
  @Matches(
    /^ *((\d *- *\d)|(\d{2} *- *\d{2})|(\d{3} *- *\d{3})|(\d{4} *- *\d{4})|(\d{5} *- *\d{5})) *$/,
    {
      message:
        "Invalid format for secondarySyGraduated, must match 0000-0000 format",
    }
  )
  secondarySyGraduated = "";

  @ApiProperty()
  @IsOptional()
  birthCertFile: any;

  @ApiProperty()
  @IsOptional()
  profileFile: any;
}

export class UpdateMemberUserDto extends DefaultMemberDto {
}
