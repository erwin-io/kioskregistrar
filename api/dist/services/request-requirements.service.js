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
exports.RequestRequirementsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const request_requirements_constant_1 = require("../common/constant/request-requirements.constant");
const request_type_constant_1 = require("../common/constant/request-type.constant");
const RequestRequirements_1 = require("../db/entities/RequestRequirements");
const RequestType_1 = require("../db/entities/RequestType");
const typeorm_2 = require("typeorm");
let RequestRequirementsService = class RequestRequirementsService {
    constructor(requestRequirements) {
        this.requestRequirements = requestRequirements;
    }
    async getByRequestTypeId(requestTypeId) {
        return await this.requestRequirements.find({
            where: {
                requestType: {
                    requestTypeId,
                },
                active: true,
            },
        });
    }
    async getById(requestRequirementsId) {
        return await this.requestRequirements.findOne({
            where: {
                requestRequirementsId,
                active: true,
            },
        });
    }
    async create(dto) {
        return await this.requestRequirements.manager.transaction(async (entityManager) => {
            const requestRequirement = new RequestRequirements_1.RequestRequirements();
            requestRequirement.name = dto.name;
            const requestType = await entityManager.findOne(RequestType_1.RequestType, {
                where: { requestTypeId: dto.requestTypeId },
            });
            if (!requestType) {
                throw Error(request_type_constant_1.REQUEST_TYPE_ERROR_NOT_FOUND);
            }
            requestRequirement.requestType = requestType;
            requestRequirement.requireToSubmitProof = dto.requireToSubmitProof;
            return await entityManager.save(requestRequirement);
        });
    }
    async update(requestRequirementsId, dto) {
        return await this.requestRequirements.manager.transaction(async (entityManager) => {
            const requestRequirement = await entityManager.findOne(RequestRequirements_1.RequestRequirements, {
                where: { requestRequirementsId, active: true },
            });
            if (!requestRequirement) {
                throw Error(request_requirements_constant_1.REQUEST_REQUIREMENT_ERROR_NOT_FOUND);
            }
            requestRequirement.name = dto.name;
            requestRequirement.requireToSubmitProof = dto.requireToSubmitProof;
            return await entityManager.save(RequestRequirements_1.RequestRequirements, requestRequirement);
        });
    }
    async delete(requestRequirementsId) {
        return await this.requestRequirements.manager.transaction(async (entityManager) => {
            const requestRequirement = await entityManager.findOne(RequestRequirements_1.RequestRequirements, {
                where: { requestRequirementsId, active: true },
            });
            if (!requestRequirement) {
                throw Error(request_requirements_constant_1.REQUEST_REQUIREMENT_ERROR_NOT_FOUND);
            }
            requestRequirement.active = false;
            return await entityManager.save(RequestRequirements_1.RequestRequirements, requestRequirement);
        });
    }
};
RequestRequirementsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(RequestRequirements_1.RequestRequirements)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], RequestRequirementsService);
exports.RequestRequirementsService = RequestRequirementsService;
//# sourceMappingURL=request-requirements.service.js.map