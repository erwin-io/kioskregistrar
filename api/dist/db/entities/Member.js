"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Member = void 0;
const typeorm_1 = require("typeorm");
const Files_1 = require("./Files");
const Users_1 = require("./Users");
const Request_1 = require("./Request");
let Member = class Member {
};
exports.Member = Member;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: "bigint", name: "MemberId" })
], Member.prototype, "memberId", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", { name: "FirstName" })
], Member.prototype, "firstName", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", { name: "MiddleName", nullable: true })
], Member.prototype, "middleName", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", { name: "LastName" })
], Member.prototype, "lastName", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", { name: "Email", nullable: true })
], Member.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", { name: "MobileNumber" })
], Member.prototype, "mobileNumber", void 0);
__decorate([
    (0, typeorm_1.Column)("date", { name: "BirthDate" })
], Member.prototype, "birthDate", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", { name: "Address", nullable: true })
], Member.prototype, "address", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", { name: "Gender" })
], Member.prototype, "gender", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", { name: "CourseTaken" })
], Member.prototype, "courseTaken", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", { name: "Major", nullable: true })
], Member.prototype, "major", void 0);
__decorate([
    (0, typeorm_1.Column)("boolean", { name: "IsAlumni", default: () => "false" })
], Member.prototype, "isAlumni", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", { name: "SchoolYearLastAttended" })
], Member.prototype, "schoolYearLastAttended", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", { name: "PrimarySchoolName", nullable: true })
], Member.prototype, "primarySchoolName", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", { name: "PrimarySYGraduated", nullable: true })
], Member.prototype, "primarySyGraduated", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", { name: "SecondarySchoolName", nullable: true })
], Member.prototype, "secondarySchoolName", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", { name: "SecondarySYGraduated", nullable: true })
], Member.prototype, "secondarySyGraduated", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", { name: "FullName", default: () => "''" })
], Member.prototype, "fullName", void 0);
__decorate([
    (0, typeorm_1.Column)("boolean", { name: "IsVerified", default: () => "false" })
], Member.prototype, "isVerified", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", { name: "MemberCode", default: () => "''" })
], Member.prototype, "memberCode", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Files_1.Files, (files) => files.members),
    (0, typeorm_1.JoinColumn)([{ name: "BirthCertFileId", referencedColumnName: "fileId" }])
], Member.prototype, "birthCertFile", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Users_1.Users, (users) => users.members),
    (0, typeorm_1.JoinColumn)([{ name: "UserId", referencedColumnName: "userId" }])
], Member.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Request_1.Request, (request) => request.requestedBy)
], Member.prototype, "requests", void 0);
exports.Member = Member = __decorate([
    (0, typeorm_1.Index)("Member_pkey", ["memberId"], { unique: true }),
    (0, typeorm_1.Entity)("Member", { schema: "dbo" })
], Member);
