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
exports.SupportTicketConvo = void 0;
const typeorm_1 = require("typeorm");
const Users_1 = require("./Users");
const SupportTickets_1 = require("./SupportTickets");
let SupportTicketConvo = class SupportTicketConvo {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: "bigint", name: "SupportTicketConvoId" }),
    __metadata("design:type", String)
], SupportTicketConvo.prototype, "supportTicketConvoId", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", { name: "Message" }),
    __metadata("design:type", String)
], SupportTicketConvo.prototype, "message", void 0);
__decorate([
    (0, typeorm_1.Column)("timestamp with time zone", {
        name: "Date",
        default: () => "(now() AT TIME ZONE 'Asia/Manila')",
    }),
    __metadata("design:type", Date)
], SupportTicketConvo.prototype, "date", void 0);
__decorate([
    (0, typeorm_1.Column)("boolean", { name: "Active", default: () => "true" }),
    __metadata("design:type", Boolean)
], SupportTicketConvo.prototype, "active", void 0);
__decorate([
    (0, typeorm_1.Column)("boolean", { name: "Read", default: () => "false" }),
    __metadata("design:type", Boolean)
], SupportTicketConvo.prototype, "read", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Users_1.Users, (users) => users.supportTicketConvos),
    (0, typeorm_1.JoinColumn)([{ name: "FromUserId", referencedColumnName: "userId" }]),
    __metadata("design:type", Users_1.Users)
], SupportTicketConvo.prototype, "fromUser", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => SupportTickets_1.SupportTickets, (supportTickets) => supportTickets.supportTicketConvos),
    (0, typeorm_1.JoinColumn)([
        { name: "SupportTicketId", referencedColumnName: "supportTicketId" },
    ]),
    __metadata("design:type", SupportTickets_1.SupportTickets)
], SupportTicketConvo.prototype, "supportTicket", void 0);
SupportTicketConvo = __decorate([
    (0, typeorm_1.Index)("SupportTicketConvo_pkey", ["supportTicketConvoId"], { unique: true }),
    (0, typeorm_1.Entity)("SupportTicketConvo", { schema: "dbo" })
], SupportTicketConvo);
exports.SupportTicketConvo = SupportTicketConvo;
//# sourceMappingURL=SupportTicketConvo.js.map