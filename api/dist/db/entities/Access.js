"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Access = void 0;
const typeorm_1 = require("typeorm");
let Access = class Access {
};
exports.Access = Access;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: "bigint", name: "AccessId" })
], Access.prototype, "accessId", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", { name: "Name" })
], Access.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)("boolean", { name: "Active", default: () => "true" })
], Access.prototype, "active", void 0);
exports.Access = Access = __decorate([
    (0, typeorm_1.Index)("Access_pkey", ["accessId"], { unique: true }),
    (0, typeorm_1.Index)("u_access", ["active", "name"], { unique: true }),
    (0, typeorm_1.Entity)("Access", { schema: "dbo" })
], Access);
