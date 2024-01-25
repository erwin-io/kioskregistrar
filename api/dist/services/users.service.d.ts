import { UpdateAdminUserResetPasswordDto, UpdateMemberUserResetPasswordDto } from "src/core/dto/auth/reset-password.dto";
import { MemberVerificationDto, UpdateMemberUserDto } from "src/core/dto/user/user-member.dto";
import { CreateAdminUserDto, UpdateAdminUserDto, UpdateAdminUserProfileDto } from "src/core/dto/user/users-admin.dto";
import { FirebaseProvider } from "src/core/provider/firebase/firebase-provider";
import { Admin } from "src/db/entities/Admin";
import { Member } from "src/db/entities/Member";
import { Users } from "src/db/entities/Users";
import { Repository } from "typeorm";
export declare class UsersService {
    private firebaseProvoder;
    private readonly userRepo;
    constructor(firebaseProvoder: FirebaseProvider, userRepo: Repository<Users>);
    getUserPaginationAdmin({ pageSize, pageIndex, order, columnDef }: {
        pageSize: any;
        pageIndex: any;
        order: any;
        columnDef: any;
    }): Promise<{
        results: Admin[];
        total: number;
    }>;
    getUserPaginationMember({ pageSize, pageIndex, order, columnDef }: {
        pageSize: any;
        pageIndex: any;
        order: any;
        columnDef: any;
    }, verified: any): Promise<{
        results: Member[];
        total: number;
    }>;
    getUserById(userId: any): Promise<Users>;
    getAdminByCode(adminCode: any): Promise<Admin>;
    getMemberByCode(memberCode: any): Promise<Member>;
    getAllAdmin(): Promise<Admin[]>;
    createAdmin(dto: CreateAdminUserDto): Promise<Admin>;
    updateAdmin(adminCode: any, dto: UpdateAdminUserDto): Promise<Admin>;
    updateAdminProfile(adminCode: any, dto: UpdateAdminUserProfileDto): Promise<Admin>;
    updateMember(memberCode: any, dto: UpdateMemberUserDto): Promise<Member>;
    resetAdminPassword(adminCode: any, dto: UpdateAdminUserResetPasswordDto): Promise<Admin>;
    resetMemberPassword(memberCode: any, dto: UpdateMemberUserResetPasswordDto): Promise<Member>;
    deleteAdmin(adminCode: any): Promise<Admin>;
    approveMemberBatch(dto: MemberVerificationDto): Promise<{
        success: any[];
        failed: any[];
    }>;
}
