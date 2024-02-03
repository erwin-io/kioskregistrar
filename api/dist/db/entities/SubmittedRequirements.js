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
exports.SubmittedRequirements = void 0;
const typeorm_1 = require("typeorm");
const Request_1 = require("./Request");
const RequestRequirements_1 = require("./RequestRequirements");
let SubmittedRequirements = class SubmittedRequirements {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: "bigint", name: "SubmittedRequirementId" }),
    __metadata("design:type", String)
], SubmittedRequirements.prototype, "submittedRequirementId", void 0);
__decorate([
    (0, typeorm_1.Column)("json", { name: "Files", default: [] }),
    __metadata("design:type", Object)
], SubmittedRequirements.prototype, "files", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Request_1.Request, (request) => request.submittedRequirements),
    (0, typeorm_1.JoinColumn)([{ name: "RequestId", referencedColumnName: "requestId" }]),
    __metadata("design:type", Request_1.Request)
], SubmittedRequirements.prototype, "request", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => RequestRequirements_1.RequestRequirements, (requestRequirements) => requestRequirements.submittedRequirements),
    (0, typeorm_1.JoinColumn)([
        {
            name: "RequestRequirementsId",
            referencedColumnName: "requestRequirementsId",
        },
    ]),
    __metadata("design:type", RequestRequirements_1.RequestRequirements)
], SubmittedRequirements.prototype, "requestRequirements", void 0);
SubmittedRequirements = __decorate([
    (0, typeorm_1.Index)("SubmittedRequirements_pkey", ["submittedRequirementId"], {
        unique: true,
    }),
    (0, typeorm_1.Entity)("SubmittedRequirements", { schema: "dbo" })
], SubmittedRequirements);
exports.SubmittedRequirements = SubmittedRequirements;
//# sourceMappingURL=SubmittedRequirements.js.map