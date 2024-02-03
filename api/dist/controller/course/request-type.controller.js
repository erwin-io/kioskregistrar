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
exports.RequestTypeController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const api_response_constant_1 = require("../../common/constant/api-response.constant");
const pagination_params_dto_1 = require("../../core/dto/pagination-params.dto");
const request_type_update_dto_1 = require("../../core/dto/request-type/request-type-update.dto");
const request_type_dto_1 = require("../../core/dto/request-type/request-type.dto");
const request_type_service_1 = require("../../services/request-type.service");
let RequestTypeController = class RequestTypeController {
    constructor(requestTypeService) {
        this.requestTypeService = requestTypeService;
    }
    async getDetails(requestTypeId) {
        const res = {};
        try {
            res.data = await this.requestTypeService.getById(requestTypeId);
            res.success = true;
            return res;
        }
        catch (e) {
            res.success = false;
            res.message = e.message !== undefined ? e.message : e;
            return res;
        }
    }
    async getPaginated(params) {
        const res = {};
        try {
            res.data = await this.requestTypeService.getRequestTypePagination(params);
            res.success = true;
            return res;
        }
        catch (e) {
            res.success = false;
            res.message = e.message !== undefined ? e.message : e;
            return res;
        }
    }
    async create(requestTypeDto) {
        const res = {};
        try {
            res.data = await this.requestTypeService.create(requestTypeDto);
            res.success = true;
            res.message = `Request type ${api_response_constant_1.SAVING_SUCCESS}`;
            return res;
        }
        catch (e) {
            res.success = false;
            res.message = e.message !== undefined ? e.message : e;
            return res;
        }
    }
    async update(requestTypeId, dto) {
        const res = {};
        try {
            res.data = await this.requestTypeService.update(requestTypeId, dto);
            res.success = true;
            res.message = `Request type ${api_response_constant_1.UPDATE_SUCCESS}`;
            return res;
        }
        catch (e) {
            res.success = false;
            res.message = e.message !== undefined ? e.message : e;
            return res;
        }
    }
    async delete(requestTypeId) {
        const res = {};
        try {
            res.data = await this.requestTypeService.delete(requestTypeId);
            res.success = true;
            res.message = `Request type ${api_response_constant_1.DELETE_SUCCESS}`;
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
    (0, common_1.Get)("/:requestTypeId"),
    __param(0, (0, common_1.Param)("requestTypeId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RequestTypeController.prototype, "getDetails", null);
__decorate([
    (0, common_1.Post)("/page"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pagination_params_dto_1.PaginationParamsDto]),
    __metadata("design:returntype", Promise)
], RequestTypeController.prototype, "getPaginated", null);
__decorate([
    (0, common_1.Post)(""),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [request_type_dto_1.RequestTypeDto]),
    __metadata("design:returntype", Promise)
], RequestTypeController.prototype, "create", null);
__decorate([
    (0, common_1.Put)("/:requestTypeId"),
    __param(0, (0, common_1.Param)("requestTypeId")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, request_type_update_dto_1.UpdateRequestTypeDto]),
    __metadata("design:returntype", Promise)
], RequestTypeController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)("/:requestTypeId"),
    __param(0, (0, common_1.Param)("requestTypeId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RequestTypeController.prototype, "delete", null);
RequestTypeController = __decorate([
    (0, swagger_1.ApiTags)("requestType"),
    (0, common_1.Controller)("requestType"),
    __metadata("design:paramtypes", [request_type_service_1.RequestTypeService])
], RequestTypeController);
exports.RequestTypeController = RequestTypeController;
//# sourceMappingURL=request-type.controller.js.map