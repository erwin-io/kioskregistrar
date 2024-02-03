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
exports.SupportTickets = void 0;
const typeorm_1 = require("typeorm");
const SupportTicketConvo_1 = require("./SupportTicketConvo");
const Admin_1 = require("./Admin");
const Member_1 = require("./Member");
let SupportTickets = class SupportTickets {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: "bigint", name: "SupportTicketId" }),
    __metadata("design:type", String)
], SupportTickets.prototype, "supportTicketId", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", { name: "Title" }),
    __metadata("design:type", String)
], SupportTickets.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", { name: "Description" }),
    __metadata("design:type", String)
], SupportTickets.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)("timestamp with time zone", {
        name: "Date",
        default: () => "(now() AT TIME ZONE 'Asia/Manila')",
    }),
    __metadata("design:type", Date)
], SupportTickets.prototype, "date", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", { name: "Status", default: () => "'OPEN'" }),
    __metadata("design:type", String)
], SupportTickets.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => SupportTicketConvo_1.SupportTicketConvo, (supportTicketConvo) => supportTicketConvo.supportTicket),
    __metadata("design:type", Array)
], SupportTickets.prototype, "supportTicketConvos", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Admin_1.Admin, (admin) => admin.supportTickets),
    (0, typeorm_1.JoinColumn)([{ name: "AssignedAdminId", referencedColumnName: "adminId" }]),
    __metadata("design:type", Admin_1.Admin)
], SupportTickets.prototype, "assignedAdmin", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Member_1.Member, (member) => member.supportTickets),
    (0, typeorm_1.JoinColumn)([
        { name: "RequestedByMemberId", referencedColumnName: "memberId" },
    ]),
    __metadata("design:type", Member_1.Member)
], SupportTickets.prototype, "requestedByMember", void 0);
SupportTickets = __decorate([
    (0, typeorm_1.Index)("SupportTickets_pkey", ["supportTicketId"], { unique: true }),
    (0, typeorm_1.Entity)("SupportTickets", { schema: "dbo" })
], SupportTickets);
exports.SupportTickets = SupportTickets;
//# sourceMappingURL=SupportTickets.js.map