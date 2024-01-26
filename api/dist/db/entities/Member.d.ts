import { Files } from "./Files";
import { Users } from "./Users";
import { Request } from "./Request";
export declare class Member {
    memberId: string;
    fullName: string;
    email: string | null;
    mobileNumber: string;
    birthDate: string;
    address: string | null;
    gender: string;
    courseTaken: string;
    major: string | null;
    isAlumni: boolean;
    schoolYearLastAttended: string;
    primarySchoolName: string | null;
    primarySyGraduated: string | null;
    secondarySchoolName: string | null;
    secondarySyGraduated: string | null;
    isVerified: boolean;
    memberCode: string;
    birthCertFile: Files;
    user: Users;
    requests: Request[];
}
