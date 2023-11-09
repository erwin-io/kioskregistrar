"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestRequirementsRouter = void 0;
const express_1 = require("express");
const typeorm_1 = require("typeorm");
const validator_1 = require("../utils/validator");
const RequestType_1 = require("../../src/db/entities/RequestType");
const RequestRequirements_1 = require("../../src/db/entities/RequestRequirements");
const request_type_1 = require("../dto/request-type");
exports.requestRequirementsRouter = (0, express_1.Router)();
exports.requestRequirementsRouter.get("/findByRequestType/:requestTypeId", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { requestTypeId } = req.params;
        const results = yield (0, typeorm_1.getRepository)(RequestRequirements_1.RequestRequirements).find({
            where: {
                requestType: {
                    requestTypeId
                },
                active: true,
            }
        });
        return res.status(200).json({
            data: results,
            success: true,
        });
    }
    catch (ex) {
        return res.status(500).json({
            message: ex.message,
        });
    }
}));
exports.requestRequirementsRouter.get("/:requestRequirementsId", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { requestRequirementsId } = req.params;
        let result = yield (0, typeorm_1.getRepository)(RequestRequirements_1.RequestRequirements).findOne({
            where: {
                requestRequirementsId
            }
        });
        if (result) {
            return res.status(200).json({
                data: result,
                success: true,
            });
        }
        else {
            return res.status(404).json({
                message: "Not found!",
            });
        }
    }
    catch (ex) {
        return res.status(500).json({
            message: ex.message,
        });
    }
}));
exports.requestRequirementsRouter.post("/", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = req.body;
        yield (0, validator_1.validatorDto)(request_type_1.CreateRequestRequirementDto, body);
        let requestRequirement = new RequestRequirements_1.RequestRequirements();
        requestRequirement.name = body.name;
        const requestType = yield (0, typeorm_1.getTreeRepository)(RequestType_1.RequestType).findOne({
            where: { requestTypeId: body.requestTypeId }
        });
        if (!requestType) {
            return res.status(404).json({
                message: "Bad request! Request type not found",
            });
        }
        requestRequirement.requestType = requestType;
        requestRequirement.requireToSubmitProof = body.requireToSubmitProof;
        requestRequirement = yield (0, typeorm_1.getManager)().transaction((transactionalEntityManager) => __awaiter(void 0, void 0, void 0, function* () {
            return yield transactionalEntityManager.save(requestRequirement);
        }));
        return res.status(200).json({
            message: "Request requirement saved successfully",
            data: requestRequirement,
            success: true,
        });
    }
    catch (ex) {
        return res.status(500).json({
            message: ex.message,
        });
    }
}));
exports.requestRequirementsRouter.put("/:requestRequirementsId", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = Object.assign(Object.assign({}, req.body), req.params);
        yield (0, validator_1.validatorDto)(request_type_1.UpdateRequestRequirementDto, body);
        let requestRequirement = yield (0, typeorm_1.getRepository)(RequestRequirements_1.RequestRequirements).findOne({
            where: {
                requestRequirementsId: body.requestRequirementsId,
                active: true
            },
        });
        if (requestRequirement) {
            requestRequirement.name = body.name;
            requestRequirement.requireToSubmitProof = body.requireToSubmitProof;
            requestRequirement = yield (0, typeorm_1.getManager)().transaction((transactionalEntityManager) => __awaiter(void 0, void 0, void 0, function* () {
                return yield transactionalEntityManager.save(RequestRequirements_1.RequestRequirements, requestRequirement);
            }));
            return res.status(200).json({
                message: "Request requirement updated successfully",
                data: requestRequirement,
                success: true,
            });
        }
        else {
            return res.status(404).json({
                message: "Not Found!",
            });
        }
    }
    catch (ex) {
        return res.status(500).json({
            message: ex.message,
        });
    }
}));
exports.requestRequirementsRouter.delete("/:requestRequirementsId", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (req.params && req.params.requestRequirementsId) {
            let { requestRequirementsId } = req.params;
            let requestRequirement = yield (0, typeorm_1.getRepository)(RequestRequirements_1.RequestRequirements).findOne({
                where: {
                    requestRequirementsId,
                    active: true,
                },
            });
            if (requestRequirement) {
                requestRequirement.active = false;
                requestRequirement = yield (0, typeorm_1.getManager)().transaction((transactionalEntityManager) => __awaiter(void 0, void 0, void 0, function* () {
                    return yield transactionalEntityManager.save(requestRequirement);
                }));
                return res.status(200).json({
                    message: "Request requirement deleted successfully",
                    data: requestRequirement,
                    success: true,
                });
            }
            else {
                return res.status(404).json({
                    message: "Not Found!",
                });
            }
        }
        else {
            return res.status(400).json({
                message: "Bad request!",
            });
        }
    }
    catch (ex) {
        return res.status(500).json({
            message: ex.message,
        });
    }
}));
