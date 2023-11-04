import { Transform, Type } from 'class-transformer';
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
    IsIn,
    IsNotEmpty,
    IsNumberString,
    ArrayNotEmpty,
    IsOptional,
    IsDateString,
    IsBooleanString,
    IsUppercase,
    Validate,
    Matches,
    IsArray,
    ArrayMaxSize,
    ArrayMinSize,
    ValidateNested
  } from 'class-validator';
import { Match } from './match.decorator';
  

  export class DefaultAdminUserDto {
    @IsNotEmpty()
    firstName: string;

    @IsNotEmpty()
    lastName: string;
  
    @IsNotEmpty()
    @IsNumberString()
    @Transform(({obj, key}) => {
      return obj[key].toString();
    })
    mobileNumber: string;

    @IsNotEmpty()
    @ArrayNotEmpty()
      
    @IsArray()
    @Type(() => CreateAdminUserAccessDto)
    @ValidateNested()
    access: CreateAdminUserAccessDto[];
  }

export class CreateAdminUserDto extends DefaultAdminUserDto {
    @IsNotEmpty()
    userName: string;

    @IsNotEmpty()
    password: string;
    
    @IsOptional()
    userProfilePic: any;
}

export class UpdateAdminUserDto extends DefaultAdminUserDto {
    @IsNotEmpty()
    userId: string;
}

export class UpdateAdminUserResetPasswordDto {
  @IsNotEmpty()
  userId: string;

  @IsNotEmpty()
  password: string;

  @Match("password")
  @IsNotEmpty()
  confirmPassword: string;
}

export class DefaultMemberDto {
  @IsNotEmpty()
  firstName: string;
  
  @IsOptional()
  middleName: string;

  @IsNotEmpty()
  lastName: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @Transform(({obj, key}) => {
    return obj[key].toString();
  })
  @IsNumberString()
  mobileNumber: string;

  @IsNotEmpty()
  @IsDateString({ strict: true } as any)
  birthDate: Date;

  @IsNotEmpty()
  address: string;
  
  @IsNotEmpty()
  @IsIn(['MALE', 'FEMALE', 'OTHERS'])
  @IsUppercase()
  gender: "MALE" | "FEMALE" | "OTHERS";
  
  @IsNotEmpty()
  courseTaken: string;
  
  @IsOptional()
  major: string;
  
  @Transform(({obj, key}) => {
    return obj[key].toString();
  })
  @IsBooleanString()
  isAlumni: boolean = false;
  
  @IsNotEmpty()
  @Matches(/^ *((\d *- *\d)|(\d{2} *- *\d{2})|(\d{3} *- *\d{3})|(\d{4} *- *\d{4})|(\d{5} *- *\d{5})) *$/, {
    message: "Invalid format for secondarySyGraduated, must match 0000-0000 format"
  })
  schoolYearLastAttended: string;
  
  @IsNotEmpty()
  primarySchoolName: string = "";
  
  @IsNotEmpty()
  @Matches(/^ *((\d *- *\d)|(\d{2} *- *\d{2})|(\d{3} *- *\d{3})|(\d{4} *- *\d{4})|(\d{5} *- *\d{5})) *$/, {
    message: "Invalid format for secondarySyGraduated, must match 0000-0000 format"
  })
  primarySyGraduated: string = "";
  
  @IsNotEmpty()
  secondarySchoolName: string = "";
  
  @IsNotEmpty()
  @Matches(/^ *((\d *- *\d)|(\d{2} *- *\d{2})|(\d{3} *- *\d{3})|(\d{4} *- *\d{4})|(\d{5} *- *\d{5})) *$/, {
    message: "Invalid format for secondarySyGraduated, must match 0000-0000 format"
  })
  secondarySyGraduated: string = "";
  
  @IsOptional()
  birthCertFile: any;

  @IsOptional()
  userProfilePic: any;
}

export class CreateMemberUserDto extends DefaultMemberDto {
  @IsNotEmpty()
  userName: string;

  @IsNotEmpty()
  password: string;
}

export class UpdateMemberUserDto extends DefaultMemberDto {
    @IsNotEmpty()
    userId: string;
}

export class CreateAdminUserAccessDto  {
  @IsNotEmpty()
  page: string;
  
  @IsNotEmpty()
  @Transform(({obj, key}) => {
    return obj[key].toString();
  })
  @IsBooleanString()
  view: boolean = false;
  
  @IsNotEmpty()
  @Transform(({obj, key}) => {
    return obj[key].toString();
  })
  @IsBooleanString()
  modify: boolean = false;
}