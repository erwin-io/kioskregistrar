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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestRequirementsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const request_type_update_dto_1 = require("../../core/dto/request-type/request-type-update.dto");
const request_type_dto_1 = require("../../core/dto/request-type/request-type.dto");
const request_requirements_service_1 = require("../../services/request-requirements.service");
let RequestRequirementsController = class RequestRequirementsController {
    constructor(requestRequirementsService) {
        this.requestRequirementsService = requestRequirementsService;
    }
    async getAdminDetails(requestTypeId) {
        const res = {};
        try {
            res.data = await this.requestRequirementsService.getByRequestTypeId(requestTypeId);
            res.success = true;
            return res;
        }
        catch (e) {
            res.success = false;
            res.message = e.message !== undefined ? e.message : e;
            return res;
        }
    }
    async getById(requestRequirementsId) {
        const res = {};
        try {
            res.data = await this.requestRequirementsService.getById(requestRequirementsId);
            res.success = true;
            return res;
        }
        catch (e) {
            res.success = false;
            res.message = e.message !== undefined ? e.message : e;
            return res;
        }
    }
    async create(dto) {
        const res = {};
        try {
            res.data = await this.requestRequirementsService.create(dto);
            res.success = true;
            return res;
        }
        catch (e) {
            res.success = false;
            res.message = e.message !== undefined ? e.message : e;
            return res;
        }
    }
    async update(requestRequirementsId, dto) {
        const res = {};
        try {
            res.data = await this.requestRequirementsService.update(requestRequirementsId, dto);
            res.success = true;
            return res;
        }
        catch (e) {
            res.success = false;
            res.message = e.message !== undefined ? e.message : e;
            return res;
        }
    }
    async delete(requestRequirementsId) {
        const res = {};
        try {
            res.data = await this.requestRequirementsService.delete(requestRequirementsId);
            res.success = true;
            return res;
        }
        catch (e) {
            res.success = false;
            res.message = e.message !== undefined ? e.message : e;
            return res;
        }
    }
};
__decorate([
    (0, common_1.Get)("/findByRequestType/:requestTypeId"),
    __param(0, (0, common_1.Param)("requestTypeId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RequestRequirementsController.prototype, "getAdminDetails", null);
__decorate([
    (0, common_1.Get)("/:requestRequirementsId"),
    __param(0, (0, common_1.Param)("requestRequirementsId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RequestRequirementsController.prototype, "getById", null);
__decorate([
    (0, common_1.Post)("/"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [request_type_dto_1.CreateRequestRequirementDto]),
    __metadata("design:returntype", Promise)
], RequestRequirementsController.prototype, "create", null);
__decorate([
    (0, common_1.Put)("/:requestRequirementsId"),
    __param(0, (0, common_1.Param)("requestRequirementsId")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, request_type_update_dto_1.UpdateRequestRequirementDto]),
    __metadata("design:returntype", Promise)
], RequestRequirementsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)("/:requestRequirementsId"),
    __param(0, (0, common_1.Param)("requestRequirementsId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RequestRequirementsController.prototype, "delete", null);
RequestRequirementsController = __decorate([
    (0, swagger_1.ApiTags)("requestRequirements"),
    (0, common_1.Controller)("requestRequirements"),
    __metadata("design:paramtypes", [request_requirements_service_1.RequestRequirementsService])
], RequestRequirementsController);
exports.RequestRequirementsController = RequestRequirementsController;
//# sourceMappingURL=request-requirements.controller.js.map