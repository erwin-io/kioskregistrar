import { UpdateAdminUserResetPasswordDto, UpdateMemberUserResetPasswordDto } from "src/core/dto/auth/reset-password.dto";
import { PaginationParamsDto } from "src/core/dto/pagination-params.dto";
import { MemberVerificationDto, UpdateMemberUserDto } from "src/core/dto/user/user-member.dto";
import { CreateAdminUserDto, UpdateAdminUserDto, UpdateAdminUserProfileDto } from "src/core/dto/user/users-admin.dto";
import { ApiResponseModel } from "src/core/models/api-response.model";
import { Admin } from "src/db/entities/Admin";
import { Member } from "src/db/entities/Member";
import { UsersService } from "src/services/users.service";
export declare class UsersController {
    private readonly userService;
    constructor(userService: UsersService);
    getAllAdmin(): Promise<ApiResponseModel<Admin[]>>;
    getAdminDetails(adminCode: string): Promise<ApiResponseModel<Admin>>;
    getMemberDetails(memberCode: string): Promise<ApiResponseModel<Member>>;
    getPaginatedAdminUsers(paginationParams: PaginationParamsDto): Promise<ApiResponseModel<{
        results: Admin[];
        total: number;
    }>>;
    getPaginatedMemberUsers(status: string, paginationParams: PaginationParamsDto): Promise<ApiResponseModel<{
        results: Member[];
        total: number;
    }>>;
    createAdmin(createAdminUserDto: CreateAdminUserDto): Promise<ApiResponseModel<Admin>>;
    updateAdminProfile(adminCode: string, dto: UpdateAdminUserProfileDto): Promise<ApiResponseModel<Admin>>;
    updateAdmin(adminCode: string, updateAdminUserDto: UpdateAdminUserDto): Promise<ApiResponseModel<Admin>>;
    updateMember(memberCode: string, updateMemberUserDto: UpdateMemberUserDto): Promise<ApiResponseModel<Member>>;
    resetAdminPassword(adminCode: string, updateAdminUserDto: UpdateAdminUserResetPasswordDto): Promise<ApiResponseModel<Admin>>;
    resetMemberPassword(memberCode: string, updateMemberUserDto: UpdateMemberUserResetPasswordDto): Promise<ApiResponseModel<Member>>;
    deleteAdmin(adminCode: string): Promise<ApiResponseModel<Admin>>;
    approveMember(dto: MemberVerificationDto): Promise<ApiResponseModel<{
        success: Member[];
        failed: Member[];
    }>>;
}
