"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Admin = void 0;
const typeorm_1 = require("typeorm");
const Users_1 = require("./Users");
const Request_1 = require("./Request");
let Admin = class Admin {
};
exports.Admin = Admin;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: "bigint", name: "AdminId" })
], Admin.prototype, "adminId", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", { name: "FirstName" })
], Admin.prototype, "firstName", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", { name: "LastName" })
], Admin.prototype, "lastName", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", { name: "MobileNumber" })
], Admin.prototype, "mobileNumber", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", { name: "FullName", default: () => "''" })
], Admin.prototype, "fullName", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", { name: "AdminCode", default: () => "''" })
], Admin.prototype, "adminCode", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Users_1.Users, (users) => users.admins),
    (0, typeorm_1.JoinColumn)([{ name: "UserId", referencedColumnName: "userId" }])
], Admin.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Request_1.Request, (request) => request.assignedAdmin)
], Admin.prototype, "requests", void 0);
exports.Admin = Admin = __decorate([
    (0, typeorm_1.Index)("Admin_pkey", ["adminId"], { unique: true }),
    (0, typeorm_1.Entity)("Admin", { schema: "dbo" })
], Admin);
