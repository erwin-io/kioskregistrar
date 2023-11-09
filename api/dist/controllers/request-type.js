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
exports.requestTypeRouter = void 0;
const utils_1 = require("./../utils/utils");
const express_1 = require("express");
const typeorm_1 = require("typeorm");
const validator_1 = require("../utils/validator");
const RequestType_1 = require("../db/entities/RequestType");
const RequestRequirements_1 = require("../db/entities/RequestRequirements");
const request_type_1 = require("../dto/request-type");
exports.requestTypeRouter = (0, express_1.Router)();
exports.requestTypeRouter.post("/page", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { pageSize, pageIndex, order, columnDef } = req.body;
        const skip = Number(pageIndex) > 0 ? Number(pageIndex) * Number(pageSize) : 0;
        const take = Number(pageSize);
        const condition = (0, utils_1.columnDefToTypeORMCondition)(columnDef);
        let [results, total] = yield Promise.all([
            (0, typeorm_1.getRepository)(RequestType_1.RequestType).find({
                where: Object.assign(Object.assign({}, condition), { active: true }),
                skip,
                take,
                order
            }),
            (0, typeorm_1.getRepository)(RequestType_1.RequestType).count({ where: Object.assign(Object.assign({}, condition), { active: true }) }),
        ]);
        return res.status(200).json({
            data: {
                results: results,
                total
            },
            success: true,
        });
    }
    catch (ex) {
        return res.status(500).json({
            message: ex.message,
        });
    }
}));
exports.requestTypeRouter.get("/:requestTypeId", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { requestTypeId } = req.params;
        let result = yield (0, typeorm_1.getRepository)(RequestType_1.RequestType).findOne({
            where: {
                requestTypeId
            }
        });
        if (result) {
            let requestRequirements = yield (0, typeorm_1.getRepository)(RequestRequirements_1.RequestRequirements).find({
                where: {
                    requestType: {
                        requestTypeId
                    },
                    active: true
                }
            });
            return res.status(200).json({
                data: Object.assign(Object.assign({}, result), { requestRequirements }),
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
exports.requestTypeRouter.post("/", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = req.body;
        yield (0, validator_1.validatorDto)(request_type_1.RequestTypeDto, body);
        let requestType = new RequestType_1.RequestType();
        requestType.name = body.name;
        requestType.authorizeACopy = body.authorizeACopy;
        requestType.fee = body.fee;
        requestType.isPaymentRequired = body.isPaymentRequired;
        requestType = yield (0, typeorm_1.getManager)().transaction((transactionalEntityManager) => __awaiter(void 0, void 0, void 0, function* () {
            return yield transactionalEntityManager.save(requestType);
        }));
        return res.status(200).json({
            message: "Request Type saved successfully",
            data: requestType,
            success: true,
        });
    }
    catch (ex) {
        return res.status(500).json({
            message: ex.message,
        });
    }
}));
exports.requestTypeRouter.put("/:requestTypeId", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = Object.assign(Object.assign({}, req.body), req.params);
        yield (0, validator_1.validatorDto)(request_type_1.UpdateRequestTypeDto, body);
        let requestType = yield (0, typeorm_1.getRepository)(RequestType_1.RequestType).findOne({
            where: {
                requestTypeId: body.requestTypeId,
                active: true
            },
        });
        if (requestType) {
            requestType.name = body.name;
            requestType.authorizeACopy = body.authorizeACopy;
            requestType.fee = body.fee;
            requestType.isPaymentRequired = body.isPaymentRequired;
            requestType = yield (0, typeorm_1.getManager)().transaction((transactionalEntityManager) => __awaiter(void 0, void 0, void 0, function* () {
                return yield transactionalEntityManager.save(RequestType_1.RequestType, requestType);
            }));
            return res.status(200).json({
                message: "Request Type updated successfully",
                data: requestType,
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
exports.requestTypeRouter.delete("/:requestTypeId", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (req.params && req.params.requestTypeId) {
            let { requestTypeId } = req.params;
            let requestType = yield (0, typeorm_1.getRepository)(RequestType_1.RequestType).findOne({
                where: {
                    requestTypeId,
                    active: true,
                },
            });
            if (requestType) {
                requestType.active = false;
                requestType = yield (0, typeorm_1.getManager)().transaction((transactionalEntityManager) => __awaiter(void 0, void 0, void 0, function* () {
                    return yield transactionalEntityManager.save(requestType);
                }));
                return res.status(200).json({
                    message: "Request Type deleted successfully",
                    data: requestType,
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
