"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Request = void 0;
const typeorm_1 = require("typeorm");
const Admin_1 = require("./Admin");
const RequestType_1 = require("./RequestType");
const Member_1 = require("./Member");
let Request = class Request {
};
exports.Request = Request;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: "bigint", name: "RequestId" })
], Request.prototype, "requestId", void 0);
__decorate([
    (0, typeorm_1.Column)("timestamp with time zone", {
        name: "DateRequested",
        default: () => "(now() AT TIME ZONE 'Asia/Manila')",
    })
], Request.prototype, "dateRequested", void 0);
__decorate([
    (0, typeorm_1.Column)("timestamp with time zone", { name: "DateAssigned", nullable: true })
], Request.prototype, "dateAssigned", void 0);
__decorate([
    (0, typeorm_1.Column)("timestamp with time zone", { name: "DatePaid", nullable: true })
], Request.prototype, "datePaid", void 0);
__decorate([
    (0, typeorm_1.Column)("timestamp with time zone", {
        name: "DateProcessStarted",
        nullable: true,
    })
], Request.prototype, "dateProcessStarted", void 0);
__decorate([
    (0, typeorm_1.Column)("timestamp with time zone", {
        name: "DateProcessEnd",
        nullable: true,
    })
], Request.prototype, "dateProcessEnd", void 0);
__decorate([
    (0, typeorm_1.Column)("timestamp with time zone", { name: "DateCompleted", nullable: true })
], Request.prototype, "dateCompleted", void 0);
__decorate([
    (0, typeorm_1.Column)("timestamp with time zone", { name: "DateClosed", nullable: true })
], Request.prototype, "dateClosed", void 0);
__decorate([
    (0, typeorm_1.Column)("timestamp with time zone", {
        name: "DateLastUpdated",
        nullable: true,
    })
], Request.prototype, "dateLastUpdated", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", {
        name: "RequestStatus",
        default: () => "'PENDING'",
    })
], Request.prototype, "requestStatus", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", { name: "Description" })
], Request.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", { name: "RequestNo", default: () => "''" })
], Request.prototype, "requestNo", void 0);
__decorate([
    (0, typeorm_1.Column)("boolean", { name: "IsPaid", nullable: true, default: () => "false" })
], Request.prototype, "isPaid", void 0);
__decorate([
    (0, typeorm_1.Column)("boolean", {
        name: "IsReAssigned",
        nullable: true,
        default: () => "false",
    })
], Request.prototype, "isReAssigned", void 0);
__decorate([
    (0, typeorm_1.Column)("bigint", { name: "ReAssignedAdminId", nullable: true })
], Request.prototype, "reAssignedAdminId", void 0);
__decorate([
    (0, typeorm_1.Column)("timestamp with time zone", { name: "RAssignedDate", nullable: true })
], Request.prototype, "rAssignedDate", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Admin_1.Admin, (admin) => admin.requests),
    (0, typeorm_1.JoinColumn)([{ name: "AssignedAdminId", referencedColumnName: "adminId" }])
], Request.prototype, "assignedAdmin", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => RequestType_1.RequestType, (requestType) => requestType.requests),
    (0, typeorm_1.JoinColumn)([
        { name: "RequestTypeId", referencedColumnName: "requestTypeId" },
    ])
], Request.prototype, "requestType", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Member_1.Member, (member) => member.requests),
    (0, typeorm_1.JoinColumn)([{ name: "RequestedById", referencedColumnName: "memberId" }])
], Request.prototype, "requestedBy", void 0);
exports.Request = Request = __decorate([
    (0, typeorm_1.Index)("Request_pkey", ["requestId"], { unique: true }),
    (0, typeorm_1.Entity)("Request", { schema: "dbo" })
], Request);
