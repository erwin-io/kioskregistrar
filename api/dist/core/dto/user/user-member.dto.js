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
exports.UpdateMemberUserDto = exports.DefaultMemberDto = exports.MemberVerificationDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
class MemberVerificationDto {
    constructor() {
        this.memberCodes = [];
    }
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], MemberVerificationDto.prototype, "memberCodes", void 0);
exports.MemberVerificationDto = MemberVerificationDto;
class DefaultMemberDto {
    constructor() {
        this.isAlumni = false;
        this.primarySchoolName = "";
        this.primarySyGraduated = "";
        this.secondarySchoolName = "";
        this.secondarySyGraduated = "";
    }
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], DefaultMemberDto.prototype, "firstName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], DefaultMemberDto.prototype, "middleName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], DefaultMemberDto.prototype, "lastName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], DefaultMemberDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_transformer_1.Transform)(({ obj, key }) => {
        return obj[key].toString();
    }),
    (0, class_validator_1.IsNumberString)(),
    __metadata("design:type", String)
], DefaultMemberDto.prototype, "mobileNumber", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsDateString)({ strict: true }),
    __metadata("design:type", Date)
], DefaultMemberDto.prototype, "birthDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], DefaultMemberDto.prototype, "address", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsIn)(["MALE", "FEMALE", "OTHERS"]),
    (0, class_validator_1.IsUppercase)(),
    __metadata("design:type", String)
], DefaultMemberDto.prototype, "gender", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], DefaultMemberDto.prototype, "courseTaken", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], DefaultMemberDto.prototype, "major", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_transformer_1.Transform)(({ obj, key }) => {
        return obj[key].toString();
    }),
    (0, class_validator_1.IsBooleanString)(),
    __metadata("design:type", Object)
], DefaultMemberDto.prototype, "isAlumni", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.Matches)(/^ *((\d *- *\d)|(\d{2} *- *\d{2})|(\d{3} *- *\d{3})|(\d{4} *- *\d{4})|(\d{5} *- *\d{5})) *$/, {
        message: "Invalid format for secondarySyGraduated, must match 0000-0000 format",
    }),
    __metadata("design:type", String)
], DefaultMemberDto.prototype, "schoolYearLastAttended", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Object)
], DefaultMemberDto.prototype, "primarySchoolName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.Matches)(/^ *((\d *- *\d)|(\d{2} *- *\d{2})|(\d{3} *- *\d{3})|(\d{4} *- *\d{4})|(\d{5} *- *\d{5})) *$/, {
        message: "Invalid format for secondarySyGraduated, must match 0000-0000 format",
    }),
    __metadata("design:type", Object)
], DefaultMemberDto.prototype, "primarySyGraduated", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Object)
], DefaultMemberDto.prototype, "secondarySchoolName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.Matches)(/^ *((\d *- *\d)|(\d{2} *- *\d{2})|(\d{3} *- *\d{3})|(\d{4} *- *\d{4})|(\d{5} *- *\d{5})) *$/, {
        message: "Invalid format for secondarySyGraduated, must match 0000-0000 format",
    }),
    __metadata("design:type", Object)
], DefaultMemberDto.prototype, "secondarySyGraduated", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], DefaultMemberDto.prototype, "birthCertFile", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], DefaultMemberDto.prototype, "profileFile", void 0);
exports.DefaultMemberDto = DefaultMemberDto;
class UpdateMemberUserDto extends DefaultMemberDto {
}
exports.UpdateMemberUserDto = UpdateMemberUserDto;
//# sourceMappingURL=user-member.dto.js.map