"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const api_response_constant_1 = require("../../common/constant/api-response.constant");
const reset_password_dto_1 = require("../../core/dto/auth/reset-password.dto");
const pagination_params_dto_1 = require("../../core/dto/pagination-params.dto");
const user_member_dto_1 = require("../../core/dto/user/user-member.dto");
const users_admin_dto_1 = require("../../core/dto/user/users-admin.dto");
const users_service_1 = require("../../services/users.service");
let UsersController = class UsersController {
    constructor(userService) {
        this.userService = userService;
    }
    async getAllAdmin() {
        const res = {};
        try {
            res.data = await this.userService.getAllAdmin();
            res.success = true;
            return res;
        }
        catch (e) {
            res.success = false;
            res.message = e.message !== undefined ? e.message : e;
            return res;
        }
    }
    async getAdminDetails(adminCode) {
        const res = {};
        try {
            res.data = await this.userService.getAdminByCode(adminCode);
            res.success = true;
            return res;
        }
        catch (e) {
            res.success = false;
            res.message = e.message !== undefined ? e.message : e;
            return res;
        }
    }
    async getMemberDetails(memberCode) {
        const res = {};
        try {
            res.data = await this.userService.getMemberByCode(memberCode);
            res.success = true;
            return res;
        }
        catch (e) {
            res.success = false;
            res.message = e.message !== undefined ? e.message : e;
            return res;
        }
    }
    async getPaginatedAdminUsers(paginationParams) {
        const res = {};
        try {
            res.data = await this.userService.getUserPaginationAdmin(paginationParams);
            res.success = true;
            return res;
        }
        catch (e) {
            res.success = false;
            res.message = e.message !== undefined ? e.message : e;
            return res;
        }
    }
    async getPaginatedMemberUsers(status = "", paginationParams) {
        const res = {};
        try {
            res.data = await this.userService.getUserPaginationMember(paginationParams, (status === null || status === void 0 ? void 0 : status.toUpperCase()) == "VERIFIED");
            res.success = true;
            return res;
        }
        catch (e) {
            res.success = false;
            res.message = e.message !== undefined ? e.message : e;
            return res;
        }
    }
    async createAdmin(createAdminUserDto) {
        const res = {};
        try {
            res.data = await this.userService.createAdmin(createAdminUserDto);
            res.success = true;
            res.message = `Admin ${api_response_constant_1.SAVING_SUCCESS}`;
            return res;
        }
        catch (e) {
            res.success = false;
            res.message = e.message !== undefined ? e.message : e;
            return res;
        }
    }
    async updateAdminProfile(adminCode, dto) {
        const res = {};
        try {
            res.data = await this.userService.updateAdminProfile(adminCode, dto);
            res.success = true;
            res.message = `Admin ${api_response_constant_1.UPDATE_SUCCESS}`;
            return res;
        }
        catch (e) {
            res.success = false;
            res.message = e.message !== undefined ? e.message : e;
            return res;
        }
    }
    async updateAdmin(adminCode, updateAdminUserDto) {
        const res = {};
        try {
            res.data = await this.userService.updateAdmin(adminCode, updateAdminUserDto);
            res.success = true;
            res.message = `Admin ${api_response_constant_1.UPDATE_SUCCESS}`;
            return res;
        }
        catch (e) {
            res.success = false;
            res.message = e.message !== undefined ? e.message : e;
            return res;
        }
    }
    async updateMember(memberCode, updateMemberUserDto) {
        const res = {};
        try {
            res.data = await this.userService.updateMember(memberCode, updateMemberUserDto);
            res.success = true;
            res.message = `Member ${api_response_constant_1.UPDATE_SUCCESS}`;
            return res;
        }
        catch (e) {
            res.success = false;
            res.message = e.message !== undefined ? e.message : e;
            return res;
        }
    }
    async resetAdminPassword(adminCode, updateAdminUserDto) {
        const res = {};
        try {
            res.data = await this.userService.resetAdminPassword(adminCode, updateAdminUserDto);
            res.success = true;
            res.message = `Admin password ${api_response_constant_1.UPDATE_SUCCESS}`;
            return res;
        }
        catch (e) {
            res.success = false;
            res.message = e.message !== undefined ? e.message : e;
            return res;
        }
    }
    async resetMemberPassword(memberCode, updateMemberUserDto) {
        const res = {};
        try {
            res.data = await this.userService.resetMemberPassword(memberCode, updateMemberUserDto);
            res.success = true;
            res.message = `Member password ${api_response_constant_1.UPDATE_SUCCESS}`;
            return res;
        }
        catch (e) {
            res.success = false;
            res.message = e.message !== undefined ? e.message : e;
            return res;
        }
    }
    async deleteAdmin(adminCode) {
        const res = {};
        try {
            res.data = await this.userService.deleteAdmin(adminCode);
            res.success = true;
            res.message = `Admin ${api_response_constant_1.DELETE_SUCCESS}`;
            return res;
        }
        catch (e) {
            res.success = false;
            res.message = e.message !== undefined ? e.message : e;
            return res;
        }
    }
    async approveMember(dto) {
        const res = {};
        try {
            res.data = await this.userService.approveMemberBatch(dto);
            res.success = true;
            res.message = `Member approval ${api_response_constant_1.UPDATE_SUCCESS}`;
            return res;
        }
        catch (e) {
            res.success = false;
            res.message = e.message !== undefined ? e.message : e;
            return res;
        }
    }
};
__decorate([
    (0, common_1.Get)("/admin/all"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getAllAdmin", null);
__decorate([
    (0, common_1.Get)("/admin/:adminCode/details"),
    __param(0, (0, common_1.Param)("adminCode")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getAdminDetails", null);
__decorate([
    (0, common_1.Get)("/member/:memberCode/details"),
    __param(0, (0, common_1.Param)("memberCode")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getMemberDetails", null);
__decorate([
    (0, common_1.Post)("/admin/page"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pagination_params_dto_1.PaginationParamsDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getPaginatedAdminUsers", null);
__decorate([
    (0, swagger_1.ApiParam)({
        name: "status",
        required: false,
        example: "",
        description: "status: VERIFIED",
    }),
    (0, common_1.Post)("/member/page/:status"),
    __param(0, (0, common_1.Param)("status")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, pagination_params_dto_1.PaginationParamsDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getPaginatedMemberUsers", null);
__decorate([
    (0, common_1.Post)("/admin"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [users_admin_dto_1.CreateAdminUserDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "createAdmin", null);
__decorate([
    (0, common_1.Put)("/admin/:adminCode/profile"),
    __param(0, (0, common_1.Param)("adminCode")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, users_admin_dto_1.UpdateAdminUserProfileDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "updateAdminProfile", null);
__decorate([
    (0, common_1.Put)("/admin/:adminCode"),
    __param(0, (0, common_1.Param)("adminCode")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, users_admin_dto_1.UpdateAdminUserDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "updateAdmin", null);
__decorate([
    (0, common_1.Put)("/member/:memberCode"),
    __param(0, (0, common_1.Param)("memberCode")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, user_member_dto_1.UpdateMemberUserDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "updateMember", null);
__decorate([
    (0, common_1.Put)("/admin/:adminCode/resetPassword"),
    __param(0, (0, common_1.Param)("adminCode")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, reset_password_dto_1.UpdateAdminUserResetPasswordDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "resetAdminPassword", null);
__decorate([
    (0, common_1.Put)("/member/:memberCode/resetPassword"),
    __param(0, (0, common_1.Param)("memberCode")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, reset_password_dto_1.UpdateMemberUserResetPasswordDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "resetMemberPassword", null);
__decorate([
    (0, common_1.Delete)("/admin/:adminCode"),
    __param(0, (0, common_1.Param)("adminCode")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "deleteAdmin", null);
__decorate([
    (0, common_1.Post)("/member/approve"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_member_dto_1.MemberVerificationDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "approveMember", null);
UsersController = __decorate([
    (0, swagger_1.ApiTags)("users"),
    (0, common_1.Controller)("users"),
    __metadata("design:paramtypes", [users_service_1.UsersService])
], UsersController);
exports.UsersController = UsersController;
//# sourceMappingURL=users.controller.js.map