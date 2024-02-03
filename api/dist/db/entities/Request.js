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
exports.Request = void 0;
const typeorm_1 = require("typeorm");
const Admin_1 = require("./Admin");
const RequestType_1 = require("./RequestType");
const Member_1 = require("./Member");
const SubmittedRequirements_1 = require("./SubmittedRequirements");
let Request = class Request {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: "bigint", name: "RequestId" }),
    __metadata("design:type", String)
], Request.prototype, "requestId", void 0);
__decorate([
    (0, typeorm_1.Column)("timestamp with time zone", {
        name: "DateRequested",
        default: () => "(now() AT TIME ZONE 'Asia/Manila')",
    }),
    __metadata("design:type", Date)
], Request.prototype, "dateRequested", void 0);
__decorate([
    (0, typeorm_1.Column)("timestamp with time zone", { name: "DateAssigned", nullable: true }),
    __metadata("design:type", Date)
], Request.prototype, "dateAssigned", void 0);
__decorate([
    (0, typeorm_1.Column)("timestamp with time zone", { name: "DatePaid", nullable: true }),
    __metadata("design:type", Date)
], Request.prototype, "datePaid", void 0);
__decorate([
    (0, typeorm_1.Column)("timestamp with time zone", {
        name: "DateProcessStarted",
        nullable: true,
    }),
    __metadata("design:type", Date)
], Request.prototype, "dateProcessStarted", void 0);
__decorate([
    (0, typeorm_1.Column)("timestamp with time zone", {
        name: "DateProcessEnd",
        nullable: true,
    }),
    __metadata("design:type", Date)
], Request.prototype, "dateProcessEnd", void 0);
__decorate([
    (0, typeorm_1.Column)("timestamp with time zone", { name: "DateCompleted", nullable: true }),
    __metadata("design:type", Date)
], Request.prototype, "dateCompleted", void 0);
__decorate([
    (0, typeorm_1.Column)("timestamp with time zone", { name: "DateClosed", nullable: true }),
    __metadata("design:type", Date)
], Request.prototype, "dateClosed", void 0);
__decorate([
    (0, typeorm_1.Column)("timestamp with time zone", {
        name: "DateLastUpdated",
        nullable: true,
    }),
    __metadata("design:type", Date)
], Request.prototype, "dateLastUpdated", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", {
        name: "RequestStatus",
        default: () => "'PENDING'",
    }),
    __metadata("design:type", String)
], Request.prototype, "requestStatus", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", { name: "Description" }),
    __metadata("design:type", String)
], Request.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", { name: "RequestNo", default: () => "''" }),
    __metadata("design:type", String)
], Request.prototype, "requestNo", void 0);
__decorate([
    (0, typeorm_1.Column)("boolean", { name: "IsPaid", nullable: true, default: () => "false" }),
    __metadata("design:type", Boolean)
], Request.prototype, "isPaid", void 0);
__decorate([
    (0, typeorm_1.Column)("boolean", {
        name: "IsReAssigned",
        nullable: true,
        default: () => "false",
    }),
    __metadata("design:type", Boolean)
], Request.prototype, "isReAssigned", void 0);
__decorate([
    (0, typeorm_1.Column)("bigint", { name: "ReAssignedAdminId", nullable: true }),
    __metadata("design:type", String)
], Request.prototype, "reAssignedAdminId", void 0);
__decorate([
    (0, typeorm_1.Column)("timestamp with time zone", { name: "RAssignedDate", nullable: true }),
    __metadata("design:type", Date)
], Request.prototype, "rAssignedDate", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", { name: "RejectReason", nullable: true }),
    __metadata("design:type", String)
], Request.prototype, "rejectReason", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", { name: "CancelReason", nullable: true }),
    __metadata("design:type", String)
], Request.prototype, "cancelReason", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Admin_1.Admin, (admin) => admin.requests),
    (0, typeorm_1.JoinColumn)([{ name: "AssignedAdminId", referencedColumnName: "adminId" }]),
    __metadata("design:type", Admin_1.Admin)
], Request.prototype, "assignedAdmin", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => RequestType_1.RequestType, (requestType) => requestType.requests),
    (0, typeorm_1.JoinColumn)([
        { name: "RequestTypeId", referencedColumnName: "requestTypeId" },
    ]),
    __metadata("design:type", RequestType_1.RequestType)
], Request.prototype, "requestType", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Member_1.Member, (member) => member.requests),
    (0, typeorm_1.JoinColumn)([{ name: "RequestedById", referencedColumnName: "memberId" }]),
    __metadata("design:type", Member_1.Member)
], Request.prototype, "requestedBy", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => SubmittedRequirements_1.SubmittedRequirements, (submittedRequirements) => submittedRequirements.request),
    __metadata("design:type", Array)
], Request.prototype, "submittedRequirements", void 0);
Request = __decorate([
    (0, typeorm_1.Index)("Request_pkey", ["requestId"], { unique: true }),
    (0, typeorm_1.Entity)("Request", { schema: "dbo" })
], Request);
exports.Request = Request;
//# sourceMappingURL=Request.js.map