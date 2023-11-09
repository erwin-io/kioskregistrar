"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MemberVerificationDto = exports.CreateAdminUserAccessDto = exports.UpdateMemberUserResetPasswordDto = exports.UpdateMemberUserDto = exports.CreateMemberUserDto = exports.DefaultMemberDto = exports.UpdateAdminUserResetPasswordDto = exports.UpdateAdminUserDto = exports.CreateAdminUserDto = exports.DefaultAdminUserDto = void 0;
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const match_decorator_1 = require("./match.decorator");
class DefaultAdminUserDto {
}
exports.DefaultAdminUserDto = DefaultAdminUserDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)()
], DefaultAdminUserDto.prototype, "firstName", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)()
], DefaultAdminUserDto.prototype, "lastName", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumberString)(),
    (0, class_transformer_1.Transform)(({ obj, key }) => {
        return obj[key].toString();
    })
], DefaultAdminUserDto.prototype, "mobileNumber", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.ArrayNotEmpty)(),
    (0, class_validator_1.IsArray)(),
    (0, class_transformer_1.Type)(() => CreateAdminUserAccessDto),
    (0, class_validator_1.ValidateNested)()
], DefaultAdminUserDto.prototype, "access", void 0);
class CreateAdminUserDto extends DefaultAdminUserDto {
}
exports.CreateAdminUserDto = CreateAdminUserDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)()
], CreateAdminUserDto.prototype, "userName", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)()
], CreateAdminUserDto.prototype, "password", void 0);
__decorate([
    (0, class_validator_1.IsOptional)()
], CreateAdminUserDto.prototype, "userProfilePic", void 0);
class UpdateAdminUserDto extends DefaultAdminUserDto {
}
exports.UpdateAdminUserDto = UpdateAdminUserDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)()
], UpdateAdminUserDto.prototype, "adminCode", void 0);
class UpdateAdminUserResetPasswordDto {
}
exports.UpdateAdminUserResetPasswordDto = UpdateAdminUserResetPasswordDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)()
], UpdateAdminUserResetPasswordDto.prototype, "adminCode", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)()
], UpdateAdminUserResetPasswordDto.prototype, "password", void 0);
__decorate([
    (0, match_decorator_1.Match)("password"),
    (0, class_validator_1.IsNotEmpty)()
], UpdateAdminUserResetPasswordDto.prototype, "confirmPassword", void 0);
class DefaultMemberDto {
    constructor() {
        this.isAlumni = false;
        this.primarySchoolName = "";
        this.primarySyGraduated = "";
        this.secondarySchoolName = "";
        this.secondarySyGraduated = "";
    }
}
exports.DefaultMemberDto = DefaultMemberDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)()
], DefaultMemberDto.prototype, "firstName", void 0);
__decorate([
    (0, class_validator_1.IsOptional)()
], DefaultMemberDto.prototype, "middleName", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)()
], DefaultMemberDto.prototype, "lastName", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsEmail)()
], DefaultMemberDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_transformer_1.Transform)(({ obj, key }) => {
        return obj[key].toString();
    }),
    (0, class_validator_1.IsNumberString)()
], DefaultMemberDto.prototype, "mobileNumber", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsDateString)({ strict: true })
], DefaultMemberDto.prototype, "birthDate", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)()
], DefaultMemberDto.prototype, "address", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsIn)(['MALE', 'FEMALE', 'OTHERS']),
    (0, class_validator_1.IsUppercase)()
], DefaultMemberDto.prototype, "gender", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)()
], DefaultMemberDto.prototype, "courseTaken", void 0);
__decorate([
    (0, class_validator_1.IsOptional)()
], DefaultMemberDto.prototype, "major", void 0);
__decorate([
    (0, class_transformer_1.Transform)(({ obj, key }) => {
        return obj[key].toString();
    }),
    (0, class_validator_1.IsBooleanString)()
], DefaultMemberDto.prototype, "isAlumni", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.Matches)(/^ *((\d *- *\d)|(\d{2} *- *\d{2})|(\d{3} *- *\d{3})|(\d{4} *- *\d{4})|(\d{5} *- *\d{5})) *$/, {
        message: "Invalid format for secondarySyGraduated, must match 0000-0000 format"
    })
], DefaultMemberDto.prototype, "schoolYearLastAttended", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)()
], DefaultMemberDto.prototype, "primarySchoolName", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.Matches)(/^ *((\d *- *\d)|(\d{2} *- *\d{2})|(\d{3} *- *\d{3})|(\d{4} *- *\d{4})|(\d{5} *- *\d{5})) *$/, {
        message: "Invalid format for secondarySyGraduated, must match 0000-0000 format"
    })
], DefaultMemberDto.prototype, "primarySyGraduated", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)()
], DefaultMemberDto.prototype, "secondarySchoolName", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.Matches)(/^ *((\d *- *\d)|(\d{2} *- *\d{2})|(\d{3} *- *\d{3})|(\d{4} *- *\d{4})|(\d{5} *- *\d{5})) *$/, {
        message: "Invalid format for secondarySyGraduated, must match 0000-0000 format"
    })
], DefaultMemberDto.prototype, "secondarySyGraduated", void 0);
__decorate([
    (0, class_validator_1.IsOptional)()
], DefaultMemberDto.prototype, "birthCertFile", void 0);
__decorate([
    (0, class_validator_1.IsOptional)()
], DefaultMemberDto.prototype, "userProfilePic", void 0);
class CreateMemberUserDto extends DefaultMemberDto {
}
exports.CreateMemberUserDto = CreateMemberUserDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)()
], CreateMemberUserDto.prototype, "userName", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)()
], CreateMemberUserDto.prototype, "password", void 0);
class UpdateMemberUserDto extends DefaultMemberDto {
}
exports.UpdateMemberUserDto = UpdateMemberUserDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)()
], UpdateMemberUserDto.prototype, "memberCode", void 0);
class UpdateMemberUserResetPasswordDto {
}
exports.UpdateMemberUserResetPasswordDto = UpdateMemberUserResetPasswordDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)()
], UpdateMemberUserResetPasswordDto.prototype, "memberCode", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)()
], UpdateMemberUserResetPasswordDto.prototype, "password", void 0);
__decorate([
    (0, match_decorator_1.Match)("password"),
    (0, class_validator_1.IsNotEmpty)()
], UpdateMemberUserResetPasswordDto.prototype, "confirmPassword", void 0);
class CreateAdminUserAccessDto {
    constructor() {
        this.view = false;
        this.modify = false;
    }
}
exports.CreateAdminUserAccessDto = CreateAdminUserAccessDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)()
], CreateAdminUserAccessDto.prototype, "page", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_transformer_1.Transform)(({ obj, key }) => {
        return obj[key].toString();
    }),
    (0, class_validator_1.IsBooleanString)()
], CreateAdminUserAccessDto.prototype, "view", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_transformer_1.Transform)(({ obj, key }) => {
        return obj[key].toString();
    }),
    (0, class_validator_1.IsBooleanString)()
], CreateAdminUserAccessDto.prototype, "modify", void 0);
class MemberVerificationDto {
    constructor() {
        this.memberCodes = [];
    }
}
exports.MemberVerificationDto = MemberVerificationDto;
__decorate([
    (0, class_validator_1.IsArray)()
], MemberVerificationDto.prototype, "memberCodes", void 0);
