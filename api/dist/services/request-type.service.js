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
exports.RequestTypeService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const request_type_constant_1 = require("../common/constant/request-type.constant");
const utils_1 = require("../common/utils/utils");
const RequestRequirements_1 = require("../db/entities/RequestRequirements");
const RequestType_1 = require("../db/entities/RequestType");
const typeorm_2 = require("typeorm");
let RequestTypeService = class RequestTypeService {
    constructor(requestTypeRepo) {
        this.requestTypeRepo = requestTypeRepo;
    }
    async getRequestTypePagination({ pageSize, pageIndex, order, columnDef }) {
        const skip = Number(pageIndex) > 0 ? Number(pageIndex) * Number(pageSize) : 0;
        const take = Number(pageSize);
        const condition = (0, utils_1.columnDefToTypeORMCondition)(columnDef);
        const [results, total] = await Promise.all([
            this.requestTypeRepo.find({
                where: Object.assign(Object.assign({}, condition), { active: true }),
                skip,
                take,
                order,
            }),
            this.requestTypeRepo.count({
                where: Object.assign(Object.assign({}, condition), { active: true }),
            }),
        ]);
        return {
            results,
            total,
        };
    }
    async getById(requestTypeId) {
        const result = await this.requestTypeRepo.findOne({
            where: {
                requestTypeId,
                active: true,
            },
        });
        if (!result) {
            throw Error(request_type_constant_1.REQUEST_TYPE_ERROR_NOT_FOUND);
        }
        const requestRequirements = await this.requestTypeRepo.manager.find(RequestRequirements_1.RequestRequirements, {
            where: {
                requestType: {
                    requestTypeId,
                },
                active: true,
            },
        });
        return Object.assign(Object.assign({}, result), { requestRequirements });
    }
    async create(dto) {
        return await this.requestTypeRepo.manager.transaction(async (entityManager) => {
            const requestType = new RequestType_1.RequestType();
            requestType.name = dto.name;
            requestType.authorizeACopy = dto.authorizeACopy;
            requestType.fee = dto.fee;
            requestType.isPaymentRequired = dto.isPaymentRequired;
            return await entityManager.save(requestType);
        });
    }
    async update(requestTypeId, dto) {
        return await this.requestTypeRepo.manager.transaction(async (entityManager) => {
            const requestType = await entityManager.findOne(RequestType_1.RequestType, {
                where: {
                    requestTypeId,
                    active: true,
                },
            });
            if (!requestType) {
                throw Error(request_type_constant_1.REQUEST_TYPE_ERROR_NOT_FOUND);
            }
            requestType.name = dto.name;
            requestType.authorizeACopy = dto.authorizeACopy;
            requestType.fee = dto.fee;
            requestType.isPaymentRequired = dto.isPaymentRequired;
            return await entityManager.save(RequestType_1.RequestType, requestType);
        });
    }
    async delete(requestTypeId) {
        return await this.requestTypeRepo.manager.transaction(async (entityManager) => {
            const requestType = await entityManager.findOne(RequestType_1.RequestType, {
                where: {
                    requestTypeId,
                    active: true,
                },
            });
            if (!requestType) {
                throw Error(request_type_constant_1.REQUEST_TYPE_ERROR_NOT_FOUND);
            }
            requestType.active = false;
            return await entityManager.save(RequestType_1.RequestType, requestType);
        });
    }
};
RequestTypeService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(RequestType_1.RequestType)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], RequestTypeService);
exports.RequestTypeService = RequestTypeService;
//# sourceMappingURL=request-type.service.js.map