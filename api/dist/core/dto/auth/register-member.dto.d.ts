import { DefaultMemberDto } from "../user/user-member.dto";
export declare class RegisterMemberUserDto extends DefaultMemberDto {
    userName: string;
    password: string;
}
export declare class RegisterMemberBatchUserDto {
    members: RegisterMemberUserDto[];
}
