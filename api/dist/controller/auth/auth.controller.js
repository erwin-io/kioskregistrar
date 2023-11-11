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
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("../../services/auth.service");
const login_dto_1 = require("../../core/dto/auth/login.dto");
const register_member_dto_1 = require("../../core/dto/auth/register-member.dto");
const swagger_1 = require("@nestjs/swagger");
const api_response_constant_1 = require("../../common/constant/api-response.constant");
let AuthController = class AuthController {
    constructor(authService) {
        this.authService = authService;
    }
    async register(createUserDto) {
        const res = {};
        try {
            res.data = await this.authService.registerMember(createUserDto);
            res.success = true;
            res.message = `Member ${api_response_constant_1.REGISTER_SUCCESS}`;
            return res;
        }
        catch (e) {
            res.success = false;
            res.message = e.message !== undefined ? e.message : e;
            return res;
        }
    }
    async registerBatch(createUserDto) {
        const res = {};
        try {
            res.data = await this.authService.registerMemberBatch(createUserDto.members);
            res.success = true;
            res.message = `Batch register completed!`;
            return res;
        }
        catch (e) {
            res.success = false;
            res.message = e.message !== undefined ? e.message : e;
            return res;
        }
    }
    async loginAdmin(type, loginUserDto) {
        const res = {};
        try {
            if (type.toUpperCase().trim() === "ADMIN") {
                res.data = await this.authService.loginAdmin(loginUserDto);
            }
            else {
                res.data = await this.authService.loginMember(loginUserDto);
            }
            res.success = true;
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
    (0, common_1.Post)("register/member"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [register_member_dto_1.RegisterMemberUserDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "register", null);
__decorate([
    (0, common_1.Post)("register/member/batch"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [register_member_dto_1.RegisterMemberBatchUserDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "registerBatch", null);
__decorate([
    (0, swagger_1.ApiParam)({
        name: "type",
        required: true,
        description: "either an ADMIN or MEMBER",
    }),
    (0, common_1.Post)("login/:type"),
    __param(0, (0, common_1.Param)("type")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, login_dto_1.LogInDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "loginAdmin", null);
AuthController = __decorate([
    (0, swagger_1.ApiTags)("auth"),
    (0, common_1.Controller)("auth"),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
exports.AuthController = AuthController;
//# sourceMappingURL=auth.controller.js.map