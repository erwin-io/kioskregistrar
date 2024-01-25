export declare class MemberVerificationDto {
    memberCodes: string[];
}
export declare class DefaultMemberDto {
    firstName: string;
    middleName: string;
    lastName: string;
    email: string;
    mobileNumber: string;
    birthDate: Date;
    address: string;
    gender: "MALE" | "FEMALE" | "OTHERS";
    courseTaken: string;
    major: string;
    isAlumni: boolean;
    schoolYearLastAttended: string;
    primarySchoolName: string;
    primarySyGraduated: string;
    secondarySchoolName: string;
    secondarySyGraduated: string;
    birthCertFile: any;
    profileFile: any;
}
export declare class UpdateMemberUserDto extends DefaultMemberDto {
}
