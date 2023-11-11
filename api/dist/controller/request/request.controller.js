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
exports.RequestController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const request_pagination_params_dto_1 = require("../../core/dto/request/request-pagination-params.dto");
const request_service_1 = require("../../services/request.service");
const api_response_constant_1 = require("../../common/constant/api-response.constant");
const request_dto_1 = require("../../core/dto/request/request.dto");
const request_update_dto_1 = require("../../core/dto/request/request-update.dto");
let RequestController = class RequestController {
    constructor(requestService) {
        this.requestService = requestService;
    }
    async getPaginatedAdminUsers(requestStatus, params) {
        const res = {};
        try {
            res.data = await this.requestService.getRequestPagination(requestStatus, params);
            res.success = true;
            return res;
        }
        catch (e) {
            res.success = false;
            res.message = e.message !== undefined ? e.message : e;
            return res;
        }
    }
    async getAdminDetails(requestNo) {
        const res = {};
        try {
            res.data = await this.requestService.getByRequestNo(requestNo);
            res.success = true;
            return res;
        }
        catch (e) {
            res.success = false;
            res.message = e.message !== undefined ? e.message : e;
            return res;
        }
    }
    async create(requestDto) {
        const res = {};
        try {
            res.data = await this.requestService.create(requestDto);
            res.success = true;
            res.message = `Request ${api_response_constant_1.SAVING_SUCCESS}`;
            return res;
        }
        catch (e) {
            res.success = false;
            res.message = e.message !== undefined ? e.message : e;
            return res;
        }
    }
    async update(requestNo, dto) {
        const res = {};
        try {
            res.data = await this.requestService.updateDescription(requestNo, dto);
            res.success = true;
            res.message = `Request ${api_response_constant_1.UPDATE_SUCCESS}`;
            return res;
        }
        catch (e) {
            res.success = false;
            res.message = e.message !== undefined ? e.message : e;
            return res;
        }
    }
    async assignRequest(requestNo, dto) {
        const res = {};
        try {
            res.data = await this.requestService.assignRequest(requestNo, dto);
            res.success = true;
            res.message = `Request ${api_response_constant_1.UPDATE_SUCCESS}`;
            return res;
        }
        catch (e) {
            res.success = false;
            res.message = e.message !== undefined ? e.message : e;
            return res;
        }
    }
    async payRequest(requestNo, dto) {
        const res = {};
        try {
            res.data = await this.requestService.payRequest(requestNo, dto);
            res.success = true;
            res.message = `Request ${api_response_constant_1.UPDATE_SUCCESS}`;
            return res;
        }
        catch (e) {
            res.success = false;
            res.message = e.message !== undefined ? e.message : e;
            return res;
        }
    }
    async markAsToComplete(requestNo, dto) {
        const res = {};
        try {
            res.data = await this.requestService.markAsToComplete(requestNo, dto);
            res.success = true;
            res.message = `Request ${api_response_constant_1.UPDATE_SUCCESS}`;
            return res;
        }
        catch (e) {
            res.success = false;
            res.message = e.message !== undefined ? e.message : e;
            return res;
        }
    }
    async completeRequest(requestNo, dto) {
        const res = {};
        try {
            res.data = await this.requestService.completeRequest(requestNo, dto);
            res.success = true;
            res.message = `Request ${api_response_constant_1.UPDATE_SUCCESS}`;
            return res;
        }
        catch (e) {
            res.success = false;
            res.message = e.message !== undefined ? e.message : e;
            return res;
        }
    }
    async closeRequest(requestNo, dto) {
        const res = {};
        try {
            res.data = await this.requestService.closeRequest(requestNo, dto);
            res.success = true;
            res.message = `Request ${api_response_constant_1.UPDATE_SUCCESS}`;
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
    (0, swagger_1.ApiParam)({
        name: "requestStatus",
        required: true,
        example: "PENDING",
        description: "status: PENDING,TOPAY,PROCESSING,TOCOMPLETE,CLOSED",
    }),
    (0, common_1.Post)("/page/:requestStatus"),
    __param(0, (0, common_1.Param)("requestStatus")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, request_pagination_params_dto_1.RequestPaginationParamsDto]),
    __metadata("design:returntype", Promise)
], RequestController.prototype, "getPaginatedAdminUsers", null);
__decorate([
    (0, common_1.Get)("/:requestNo"),
    __param(0, (0, common_1.Param)("requestNo")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RequestController.prototype, "getAdminDetails", null);
__decorate([
    (0, common_1.Post)(""),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [request_dto_1.RequestDto]),
    __metadata("design:returntype", Promise)
], RequestController.prototype, "create", null);
__decorate([
    (0, common_1.Put)("/:requestNo/updateDescription"),
    __param(0, (0, common_1.Param)("requestNo")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, request_update_dto_1.UpdateRequestDescriptionDto]),
    __metadata("design:returntype", Promise)
], RequestController.prototype, "update", null);
__decorate([
    (0, common_1.Put)("/:requestNo/assignRequest"),
    __param(0, (0, common_1.Param)("requestNo")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, request_update_dto_1.AssignRequestDto]),
    __metadata("design:returntype", Promise)
], RequestController.prototype, "assignRequest", null);
__decorate([
    (0, common_1.Put)("/:requestNo/payRequest"),
    __param(0, (0, common_1.Param)("requestNo")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, request_update_dto_1.MarkRequestAsPaidDto]),
    __metadata("design:returntype", Promise)
], RequestController.prototype, "payRequest", null);
__decorate([
    (0, common_1.Put)("/:requestNo/markAsToComplete"),
    __param(0, (0, common_1.Param)("requestNo")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, request_update_dto_1.MarkRequestAsProcessedDto]),
    __metadata("design:returntype", Promise)
], RequestController.prototype, "markAsToComplete", null);
__decorate([
    (0, common_1.Put)("/:requestNo/completeRequest"),
    __param(0, (0, common_1.Param)("requestNo")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, request_update_dto_1.MarkRequestAsCompletedDto]),
    __metadata("design:returntype", Promise)
], RequestController.prototype, "completeRequest", null);
__decorate([
    (0, common_1.Put)("/:requestNo/closeRequest"),
    __param(0, (0, common_1.Param)("requestNo")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, request_update_dto_1.MarkRequestAsClosedDto]),
    __metadata("design:returntype", Promise)
], RequestController.prototype, "closeRequest", null);
RequestController = __decorate([
    (0, swagger_1.ApiTags)("request"),
    (0, common_1.Controller)("request"),
    __metadata("design:paramtypes", [request_service_1.RequestService])
], RequestController);
exports.RequestController = RequestController;
//# sourceMappingURL=request.controller.js.map