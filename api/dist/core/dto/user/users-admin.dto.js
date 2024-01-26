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
exports.UpdateAdminUserProfileDto = exports.UpdateAdminUserDto = exports.CreateAdminUserDto = exports.DefaultAdminUserDto = exports.CreateAdminUserAccessDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
class CreateAdminUserAccessDto {
    constructor() {
        this.view = false;
        this.modify = false;
        this.rights = [];
    }
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateAdminUserAccessDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_transformer_1.Transform)(({ obj, key }) => {
        return obj[key].toString();
    }),
    (0, class_validator_1.IsBooleanString)(),
    __metadata("design:type", Object)
], CreateAdminUserAccessDto.prototype, "view", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_transformer_1.Transform)(({ obj, key }) => {
        return obj[key].toString();
    }),
    (0, class_validator_1.IsBooleanString)(),
    __metadata("design:type", Object)
], CreateAdminUserAccessDto.prototype, "modify", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        isArray: true,
        type: String
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsArray)(),
    (0, class_transformer_1.Type)(() => String),
    __metadata("design:type", Array)
], CreateAdminUserAccessDto.prototype, "rights", void 0);
exports.CreateAdminUserAccessDto = CreateAdminUserAccessDto;
class DefaultAdminUserDto {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], DefaultAdminUserDto.prototype, "fullName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumberString)(),
    (0, class_transformer_1.Transform)(({ obj, key }) => {
        return obj[key].toString();
    }),
    __metadata("design:type", String)
], DefaultAdminUserDto.prototype, "mobileNumber", void 0);
exports.DefaultAdminUserDto = DefaultAdminUserDto;
class CreateAdminUserDto extends DefaultAdminUserDto {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateAdminUserDto.prototype, "userName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_transformer_1.Transform)(({ obj, key }) => {
        return obj[key].toString();
    }),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateAdminUserDto.prototype, "password", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        isArray: true,
        type: CreateAdminUserAccessDto
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.ArrayNotEmpty)(),
    (0, class_validator_1.IsArray)(),
    (0, class_transformer_1.Type)(() => CreateAdminUserAccessDto),
    (0, class_validator_1.ValidateNested)(),
    __metadata("design:type", Array)
], CreateAdminUserDto.prototype, "access", void 0);
exports.CreateAdminUserDto = CreateAdminUserDto;
class UpdateAdminUserDto extends DefaultAdminUserDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({
        isArray: true,
        type: CreateAdminUserAccessDto
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.ArrayNotEmpty)(),
    (0, class_validator_1.IsArray)(),
    (0, class_transformer_1.Type)(() => CreateAdminUserAccessDto),
    (0, class_validator_1.ValidateNested)(),
    __metadata("design:type", Array)
], UpdateAdminUserDto.prototype, "access", void 0);
exports.UpdateAdminUserDto = UpdateAdminUserDto;
class UpdateAdminUserProfileDto extends DefaultAdminUserDto {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], UpdateAdminUserProfileDto.prototype, "profileFile", void 0);
exports.UpdateAdminUserProfileDto = UpdateAdminUserProfileDto;
//# sourceMappingURL=users-admin.dto.js.map