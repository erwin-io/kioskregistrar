import { Transform } from 'class-transformer';
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
    Matches
  } from 'class-validator';
  

  export class DefaultAdminUser {
    @IsNotEmpty()
    firstName: string;

    @IsNotEmpty()
    lastName: string;
  
    @IsNotEmpty()
    @IsNumberString()
    mobileNumber: string;

    @IsNotEmpty()
    @ArrayNotEmpty()
    access: string[];
  }

export class CreateAdminUser extends DefaultAdminUser {
    @IsNotEmpty()
    userName: string;

    @IsNotEmpty()
    password: string;
    
    @IsOptional()
    userProfilePic: any;
}

export class UpdateAdminUser extends DefaultAdminUser {
    @IsNotEmpty()
    id: string;
}

export class DefaultMember {
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

export class CreateMemberUser extends DefaultMember {
  @IsNotEmpty()
  userName: string;

  @IsNotEmpty()
  password: string;
}

export class UpdateMemberUser extends DefaultMember {
    @IsNotEmpty()
    id: string;
}
