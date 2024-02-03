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
exports.Files = void 0;
const typeorm_1 = require("typeorm");
const Member_1 = require("./Member");
const Users_1 = require("./Users");
let Files = class Files {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: "bigint", name: "FileId" }),
    __metadata("design:type", String)
], Files.prototype, "fileId", void 0);
__decorate([
    (0, typeorm_1.Column)("text", { name: "Name" }),
    __metadata("design:type", String)
], Files.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)("text", { name: "Url", nullable: true }),
    __metadata("design:type", String)
], Files.prototype, "url", void 0);
__decorate([
    (0, typeorm_1.Column)("text", { name: "GUID" }),
    __metadata("design:type", String)
], Files.prototype, "guid", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Member_1.Member, (member) => member.birthCertFile),
    __metadata("design:type", Array)
], Files.prototype, "members", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Users_1.Users, (users) => users.profileFile),
    __metadata("design:type", Array)
], Files.prototype, "users", void 0);
Files = __decorate([
    (0, typeorm_1.Index)("pk_files_901578250", ["fileId"], { unique: true }),
    (0, typeorm_1.Entity)("Files", { schema: "dbo" })
], Files);
exports.Files = Files;
//# sourceMappingURL=Files.js.map