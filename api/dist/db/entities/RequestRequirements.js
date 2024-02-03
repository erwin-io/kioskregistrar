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
exports.RequestRequirements = void 0;
const typeorm_1 = require("typeorm");
const RequestType_1 = require("./RequestType");
const SubmittedRequirements_1 = require("./SubmittedRequirements");
let RequestRequirements = class RequestRequirements {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: "bigint", name: "RequestRequirementsId" }),
    __metadata("design:type", String)
], RequestRequirements.prototype, "requestRequirementsId", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", { name: "Name" }),
    __metadata("design:type", String)
], RequestRequirements.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)("bigint", { name: "RequestTypeId" }),
    __metadata("design:type", String)
], RequestRequirements.prototype, "requestTypeId", void 0);
__decorate([
    (0, typeorm_1.Column)("boolean", { name: "RequireToSubmitProof", default: () => "false" }),
    __metadata("design:type", Boolean)
], RequestRequirements.prototype, "requireToSubmitProof", void 0);
__decorate([
    (0, typeorm_1.Column)("boolean", { name: "Active", default: () => "true" }),
    __metadata("design:type", Boolean)
], RequestRequirements.prototype, "active", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => RequestType_1.RequestType, (requestType) => requestType.requestRequirements),
    (0, typeorm_1.JoinColumn)([
        { name: "RequestTypeId", referencedColumnName: "requestTypeId" },
    ]),
    __metadata("design:type", RequestType_1.RequestType)
], RequestRequirements.prototype, "requestType", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => SubmittedRequirements_1.SubmittedRequirements, (submittedRequirements) => submittedRequirements.requestRequirements),
    __metadata("design:type", Array)
], RequestRequirements.prototype, "submittedRequirements", void 0);
RequestRequirements = __decorate([
    (0, typeorm_1.Index)("u_requestRequirement", ["active", "name", "requestTypeId"], {
        unique: true,
    }),
    (0, typeorm_1.Index)("RequestRequirements_pkey", ["requestRequirementsId"], { unique: true }),
    (0, typeorm_1.Entity)("RequestRequirements", { schema: "dbo" })
], RequestRequirements);
exports.RequestRequirements = RequestRequirements;
//# sourceMappingURL=RequestRequirements.js.map