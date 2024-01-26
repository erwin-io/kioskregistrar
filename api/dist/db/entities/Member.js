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
exports.Member = void 0;
const typeorm_1 = require("typeorm");
const Files_1 = require("./Files");
const Users_1 = require("./Users");
const Request_1 = require("./Request");
let Member = class Member {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: "bigint", name: "MemberId" }),
    __metadata("design:type", String)
], Member.prototype, "memberId", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", { name: "FullName" }),
    __metadata("design:type", String)
], Member.prototype, "fullName", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", { name: "Email", nullable: true }),
    __metadata("design:type", String)
], Member.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", { name: "MobileNumber" }),
    __metadata("design:type", String)
], Member.prototype, "mobileNumber", void 0);
__decorate([
    (0, typeorm_1.Column)("date", { name: "BirthDate" }),
    __metadata("design:type", String)
], Member.prototype, "birthDate", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", { name: "Address", nullable: true }),
    __metadata("design:type", String)
], Member.prototype, "address", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", { name: "Gender" }),
    __metadata("design:type", String)
], Member.prototype, "gender", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", { name: "CourseTaken" }),
    __metadata("design:type", String)
], Member.prototype, "courseTaken", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", { name: "Major", nullable: true }),
    __metadata("design:type", String)
], Member.prototype, "major", void 0);
__decorate([
    (0, typeorm_1.Column)("boolean", { name: "IsAlumni", default: () => "false" }),
    __metadata("design:type", Boolean)
], Member.prototype, "isAlumni", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", { name: "SchoolYearLastAttended" }),
    __metadata("design:type", String)
], Member.prototype, "schoolYearLastAttended", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", { name: "PrimarySchoolName", nullable: true }),
    __metadata("design:type", String)
], Member.prototype, "primarySchoolName", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", { name: "PrimarySYGraduated", nullable: true }),
    __metadata("design:type", String)
], Member.prototype, "primarySyGraduated", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", { name: "SecondarySchoolName", nullable: true }),
    __metadata("design:type", String)
], Member.prototype, "secondarySchoolName", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", { name: "SecondarySYGraduated", nullable: true }),
    __metadata("design:type", String)
], Member.prototype, "secondarySyGraduated", void 0);
__decorate([
    (0, typeorm_1.Column)("boolean", { name: "IsVerified", default: () => "false" }),
    __metadata("design:type", Boolean)
], Member.prototype, "isVerified", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", { name: "MemberCode", default: () => "''" }),
    __metadata("design:type", String)
], Member.prototype, "memberCode", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Files_1.Files, (files) => files.members),
    (0, typeorm_1.JoinColumn)([{ name: "BirthCertFileId", referencedColumnName: "fileId" }]),
    __metadata("design:type", Files_1.Files)
], Member.prototype, "birthCertFile", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Users_1.Users, (users) => users.members),
    (0, typeorm_1.JoinColumn)([{ name: "UserId", referencedColumnName: "userId" }]),
    __metadata("design:type", Users_1.Users)
], Member.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Request_1.Request, (request) => request.requestedBy),
    __metadata("design:type", Array)
], Member.prototype, "requests", void 0);
Member = __decorate([
    (0, typeorm_1.Index)("Member_pkey", ["memberId"], { unique: true }),
    (0, typeorm_1.Entity)("Member", { schema: "dbo" })
], Member);
exports.Member = Member;
//# sourceMappingURL=Member.js.map