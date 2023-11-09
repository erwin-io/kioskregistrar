"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestType = void 0;
const typeorm_1 = require("typeorm");
const Request_1 = require("./Request");
const RequestRequirements_1 = require("./RequestRequirements");
let RequestType = class RequestType {
};
exports.RequestType = RequestType;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: "bigint", name: "RequestTypeId" })
], RequestType.prototype, "requestTypeId", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", { name: "Name" })
], RequestType.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)("boolean", { name: "AuthorizeACopy", default: () => "false" })
], RequestType.prototype, "authorizeACopy", void 0);
__decorate([
    (0, typeorm_1.Column)("numeric", { name: "Fee", default: () => "0" })
], RequestType.prototype, "fee", void 0);
__decorate([
    (0, typeorm_1.Column)("boolean", { name: "IsPaymentRequired", default: () => "false" })
], RequestType.prototype, "isPaymentRequired", void 0);
__decorate([
    (0, typeorm_1.Column)("boolean", { name: "Active", default: () => "true" })
], RequestType.prototype, "active", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Request_1.Request, (request) => request.requestType)
], RequestType.prototype, "requests", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => RequestRequirements_1.RequestRequirements, (requestRequirements) => requestRequirements.requestType)
], RequestType.prototype, "requestRequirements", void 0);
exports.RequestType = RequestType = __decorate([
    (0, typeorm_1.Index)("u_requestType", ["active", "name"], { unique: true }),
    (0, typeorm_1.Index)("RequestType_pkey", ["requestTypeId"], { unique: true }),
    (0, typeorm_1.Entity)("RequestType", { schema: "dbo" })
], RequestType);
