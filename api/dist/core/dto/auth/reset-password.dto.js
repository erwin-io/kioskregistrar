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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateMemberUserResetPasswordDto = exports.UpdateAdminUserResetPasswordDto = void 0;
const class_validator_1 = require("class-validator");
const match_decorator_dto_1 = require("../match.decorator.dto");
const swagger_1 = require("@nestjs/swagger");
class UpdateAdminUserResetPasswordDto {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], UpdateAdminUserResetPasswordDto.prototype, "password", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, match_decorator_dto_1.Match)("password"),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], UpdateAdminUserResetPasswordDto.prototype, "confirmPassword", void 0);
exports.UpdateAdminUserResetPasswordDto = UpdateAdminUserResetPasswordDto;
class UpdateMemberUserResetPasswordDto {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], UpdateMemberUserResetPasswordDto.prototype, "password", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, match_decorator_dto_1.Match)("password"),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], UpdateMemberUserResetPasswordDto.prototype, "confirmPassword", void 0);
exports.UpdateMemberUserResetPasswordDto = UpdateMemberUserResetPasswordDto;
//# sourceMappingURL=reset-password.dto.js.map