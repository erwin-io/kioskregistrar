"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Users = void 0;
const typeorm_1 = require("typeorm");
const Admin_1 = require("./Admin");
const Member_1 = require("./Member");
const Files_1 = require("./Files");
let Users = class Users {
};
exports.Users = Users;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: "bigint", name: "UserId" })
], Users.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", { name: "UserName" })
], Users.prototype, "userName", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", { name: "Password" })
], Users.prototype, "password", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", { name: "UserType" })
], Users.prototype, "userType", void 0);
__decorate([
    (0, typeorm_1.Column)("boolean", { name: "Active", default: () => "true" })
], Users.prototype, "active", void 0);
__decorate([
    (0, typeorm_1.Column)("boolean", { name: "AccessGranted", default: () => "false" })
], Users.prototype, "accessGranted", void 0);
__decorate([
    (0, typeorm_1.Column)("json", { name: "Access", default: [] })
], Users.prototype, "access", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Admin_1.Admin, (admin) => admin.user)
], Users.prototype, "admins", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Member_1.Member, (member) => member.user)
], Users.prototype, "members", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Files_1.Files, (files) => files.users),
    (0, typeorm_1.JoinColumn)([{ name: "ProfileFileId", referencedColumnName: "fileId" }])
], Users.prototype, "profileFile", void 0);
exports.Users = Users = __decorate([
    (0, typeorm_1.Index)("u_user", ["active", "userName"], { unique: true }),
    (0, typeorm_1.Index)("pk_users_1557580587", ["userId"], { unique: true }),
    (0, typeorm_1.Entity)("Users", { schema: "dbo" })
], Users);
