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
exports.requestRouter = void 0;
const express_1 = require("express");
const typeorm_1 = require("typeorm");
const Request_1 = require("../db/entities/Request");
const request_1 = require("../dto/request");
const utils_1 = require("../utils/utils");
const validator_1 = require("../utils/validator");
const RequestType_1 = require("../db/entities/RequestType");
const Member_1 = require("../db/entities/Member");
const constant_1 = require("../utils/constant");
const Admin_1 = require("../db/entities/Admin");
exports.requestRouter = (0, express_1.Router)();
exports.requestRouter.post("/page/:requestStatus", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        let { pageSize, pageIndex, order, columnDef, requestStatus, assignedAdminId } = Object.assign(Object.assign({}, req.body), req.params);
        const skip = Number(pageIndex) > 0 ? Number(pageIndex) * Number(pageSize) : 0;
        const take = Number(pageSize);
        let condition = (0, utils_1.columnDefToTypeORMCondition)(columnDef);
        if (!condition.requestStatus || condition.requestStatus === "") {
            if (!requestStatus || requestStatus === "") {
                requestStatus = "PENDING";
            }
            condition.requestStatus = requestStatus;
        }
        if (condition.requestStatus.toUpperCase() !== constant_1.CONST_REQUEST_STATUS_ENUM.PENDING && (!((_a = condition === null || condition === void 0 ? void 0 : condition.assignedAdmin) === null || _a === void 0 ? void 0 : _a.adminId) || ((_b = condition === null || condition === void 0 ? void 0 : condition.assignedAdmin) === null || _b === void 0 ? void 0 : _b.adminId) === "")) {
            if (assignedAdminId && assignedAdminId !== "") {
                condition = Object.assign(Object.assign({}, condition), { assignedAdmin: {
                        adminId: assignedAdminId
                    } });
            }
        }
        let [results, total] = yield Promise.all([
            (0, typeorm_1.getRepository)(Request_1.Request).find({
                relations: {
                    requestedBy: {
                        user: true
                    },
                    assignedAdmin: {
                        user: true
                    },
                    requestType: {
                        requestRequirements: true
                    }
                },
                where: condition,
                skip,
                take,
                order
            }),
            (0, typeorm_1.getRepository)(Request_1.Request).count({ where: condition }),
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
exports.requestRouter.get("/:requestNo", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { requestNo } = req.params;
        let result = yield (0, typeorm_1.getRepository)(Request_1.Request).findOne({
            where: {
                requestNo
            },
            relations: {
                requestedBy: {
                    user: true
                },
                assignedAdmin: {
                    user: true
                },
                requestType: {
                    requestRequirements: true
                }
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
exports.requestRouter.post("/", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = req.body;
        yield (0, validator_1.validatorDto)(request_1.RequestDto, body);
        let request = new Request_1.Request();
        request.description = body.description;
        const requestedBy = yield (0, typeorm_1.getRepository)(Member_1.Member).findOne({
            where: {
                memberId: body.requestedById
            },
        });
        if (!requestedBy) {
            return res.status(404).json({
                message: "Requested by Member Not found!",
            });
        }
        request.requestedBy = requestedBy;
        const requestType = yield (0, typeorm_1.getRepository)(RequestType_1.RequestType).findOne({
            where: {
                requestTypeId: body.requestTypeId
            },
        });
        if (!requestType) {
            return res.status(404).json({
                message: "Requested Type Not found!",
            });
        }
        request.requestType = requestType;
        request = yield (0, typeorm_1.getManager)().transaction((transactionalEntityManager) => __awaiter(void 0, void 0, void 0, function* () {
            const _res = yield transactionalEntityManager.save(request);
            _res.requestNo = (0, utils_1.generateRequestNo)(_res.requestId);
            return yield transactionalEntityManager.save(Request_1.Request, _res);
        }));
        return res.status(200).json({
            message: "Request saved successfully",
            data: request,
            success: true,
        });
    }
    catch (ex) {
        return res.status(500).json({
            message: ex.message,
        });
    }
}));
//updateDescription
exports.requestRouter.put("/:requestNo/updateDescription", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = Object.assign(Object.assign({}, req.body), req.params);
        yield (0, validator_1.validatorDto)(request_1.UpdateRequestDescriptionDto, body);
        let request = yield (0, typeorm_1.getRepository)(Request_1.Request).findOne({
            where: {
                requestNo: body.requestNo
            },
        });
        if (request) {
            request.description = body.description;
            request = yield (0, typeorm_1.getManager)().transaction((transactionalEntityManager) => __awaiter(void 0, void 0, void 0, function* () {
                return yield transactionalEntityManager.save(Request_1.Request, request);
            }));
            return res.status(200).json({
                message: "Request updated successfully",
                data: request,
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
//assignRequest - to pay
exports.requestRouter.put("/:requestNo/assignRequest", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = Object.assign(Object.assign({}, req.body), req.params);
        yield (0, validator_1.validatorDto)(request_1.AssignRequestDto, body);
        let request = yield (0, typeorm_1.getRepository)(Request_1.Request).findOne({
            where: {
                requestNo: body.requestNo
            },
        });
        if (request) {
            if (request.requestStatus.toUpperCase() === constant_1.CONST_REQUEST_STATUS_ENUM.CLOSED) {
                return res.status(404).json({
                    message: "Request already closed!",
                });
            }
            if (request.requestStatus.toUpperCase() === constant_1.CONST_REQUEST_STATUS_ENUM.TOPAY || request.requestStatus.toUpperCase() === constant_1.CONST_REQUEST_STATUS_ENUM.TOCOMPLETE || request.requestStatus.toUpperCase() === constant_1.CONST_REQUEST_STATUS_ENUM.PROCESSING) {
                return res.status(404).json({
                    message: "Request already being processed!",
                });
            }
            if (request.requestStatus.toUpperCase() === constant_1.CONST_REQUEST_STATUS_ENUM.TOPAY || (request.assignedAdmin && request.assignedAdmin.adminId)) {
                return res.status(404).json({
                    message: "Request already assigned!",
                });
            }
            yield (0, validator_1.validatorDto)(request_1.AssignRequestDto, body);
            let assignedAdmin = yield (0, typeorm_1.getRepository)(Admin_1.Admin).findOne({
                where: {
                    adminId: body.assignedAdminId
                },
            });
            if (!assignedAdmin) {
                return res.status(404).json({
                    message: "Invalid Assignee!",
                });
            }
            request.assignedAdmin = assignedAdmin;
            request.requestStatus = constant_1.CONST_REQUEST_STATUS_ENUM.TOPAY;
            request = yield (0, typeorm_1.getManager)().transaction((transactionalEntityManager) => __awaiter(void 0, void 0, void 0, function* () {
                const timestamp = yield transactionalEntityManager.query(constant_1.CONST_QUERYCURRENT_TIMESTAMP).then(res => {
                    return res[0]['timestamp'];
                });
                request.dateAssigned = timestamp;
                request.dateLastUpdated = timestamp;
                return yield transactionalEntityManager.save(Request_1.Request, request);
            }));
            request = yield (0, typeorm_1.getRepository)(Request_1.Request).findOne({
                where: {
                    requestNo: request.requestNo
                },
                relations: {
                    requestedBy: {
                        user: true
                    },
                    assignedAdmin: {
                        user: true
                    },
                    requestType: {
                        requestRequirements: true
                    }
                }
            });
            return res.status(200).json({
                message: "Request updated successfully",
                data: request,
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
//payRequest - processing
exports.requestRouter.put("/:requestNo/payRequest", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = Object.assign(Object.assign({}, req.body), req.params);
        yield (0, validator_1.validatorDto)(request_1.MarkRequestAsPaidDto, body);
        let request = yield (0, typeorm_1.getRepository)(Request_1.Request).findOne({
            where: {
                requestNo: body.requestNo
            },
        });
        if (request) {
            if (request.requestStatus.toUpperCase() === constant_1.CONST_REQUEST_STATUS_ENUM.CLOSED) {
                return res.status(404).json({
                    message: "Request already closed!",
                });
            }
            if (request.requestStatus.toUpperCase() === constant_1.CONST_REQUEST_STATUS_ENUM.TOCOMPLETE || request.requestStatus.toUpperCase() === constant_1.CONST_REQUEST_STATUS_ENUM.PROCESSING) {
                return res.status(404).json({
                    message: "Request already being processed!",
                });
            }
            if (request.dateCompleted) {
                return res.status(404).json({
                    message: "Request was already completed!",
                });
            }
            if (!request.dateAssigned) {
                return res.status(404).json({
                    message: "Request not assigned!",
                });
            }
            if (request.isPaid) {
                return res.status(404).json({
                    message: "Request already assigned!",
                });
            }
            request.isPaid = true;
            request.requestStatus = constant_1.CONST_REQUEST_STATUS_ENUM.PROCESSING;
            request = yield (0, typeorm_1.getManager)().transaction((transactionalEntityManager) => __awaiter(void 0, void 0, void 0, function* () {
                const timestamp = yield transactionalEntityManager.query(constant_1.CONST_QUERYCURRENT_TIMESTAMP).then(res => {
                    return res[0]['timestamp'];
                });
                request.datePaid = timestamp;
                request.dateProcessStarted = timestamp;
                request.dateLastUpdated = timestamp;
                return yield transactionalEntityManager.save(Request_1.Request, request);
            }));
            request = yield (0, typeorm_1.getRepository)(Request_1.Request).findOne({
                where: {
                    requestNo: request.requestNo
                },
                relations: {
                    requestedBy: {
                        user: true
                    },
                    assignedAdmin: {
                        user: true
                    },
                    requestType: {
                        requestRequirements: true
                    }
                }
            });
            return res.status(200).json({
                message: "Request updated successfully",
                data: request,
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
//markAsToComplete - to complete
exports.requestRouter.put("/:requestNo/markAsToComplete", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = Object.assign(Object.assign({}, req.body), req.params);
        yield (0, validator_1.validatorDto)(request_1.MarkRequestAsProcessedDto, body);
        let request = yield (0, typeorm_1.getRepository)(Request_1.Request).findOne({
            where: {
                requestNo: body.requestNo
            },
        });
        if (request) {
            if (request.requestStatus.toUpperCase() === constant_1.CONST_REQUEST_STATUS_ENUM.CLOSED) {
                return res.status(404).json({
                    message: "Request already closed!",
                });
            }
            if (request.dateCompleted) {
                return res.status(404).json({
                    message: "Request was already completed!",
                });
            }
            if (!request.dateProcessStarted) {
                return res.status(404).json({
                    message: "Request was not processed!",
                });
            }
            if (!request.isPaid) {
                return res.status(404).json({
                    message: "Request not paid!",
                });
            }
            if (!request.dateAssigned) {
                return res.status(404).json({
                    message: "Request not assigned!",
                });
            }
            request.requestStatus = constant_1.CONST_REQUEST_STATUS_ENUM.TOCOMPLETE;
            request = yield (0, typeorm_1.getManager)().transaction((transactionalEntityManager) => __awaiter(void 0, void 0, void 0, function* () {
                const timestamp = yield transactionalEntityManager.query(constant_1.CONST_QUERYCURRENT_TIMESTAMP).then(res => {
                    return res[0]['timestamp'];
                });
                request.dateProcessEnd = timestamp;
                request.dateLastUpdated = timestamp;
                return yield transactionalEntityManager.save(Request_1.Request, request);
            }));
            request = yield (0, typeorm_1.getRepository)(Request_1.Request).findOne({
                where: {
                    requestNo: request.requestNo
                },
                relations: {
                    requestedBy: {
                        user: true
                    },
                    assignedAdmin: {
                        user: true
                    },
                    requestType: {
                        requestRequirements: true
                    }
                }
            });
            return res.status(200).json({
                message: "Request updated successfully",
                data: request,
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
//completeRequest - completed date
exports.requestRouter.put("/:requestNo/completeRequest", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = Object.assign(Object.assign({}, req.body), req.params);
        yield (0, validator_1.validatorDto)(request_1.MarkRequestAsCompletedDto, body);
        let request = yield (0, typeorm_1.getRepository)(Request_1.Request).findOne({
            where: {
                requestNo: body.requestNo
            },
        });
        if (request) {
            if (request.requestStatus.toUpperCase() === constant_1.CONST_REQUEST_STATUS_ENUM.CLOSED) {
                return res.status(404).json({
                    message: "Request already closed!",
                });
            }
            if (request.dateCompleted) {
                return res.status(404).json({
                    message: "Request was already completed!",
                });
            }
            if (!request.dateProcessEnd) {
                return res.status(404).json({
                    message: "Request was not completed!",
                });
            }
            if (!request.dateProcessStarted) {
                return res.status(404).json({
                    message: "Request was not processed!",
                });
            }
            if (!request.isPaid) {
                return res.status(404).json({
                    message: "Request not paid!",
                });
            }
            if (!request.dateAssigned) {
                return res.status(404).json({
                    message: "Request not assigned!",
                });
            }
            request = yield (0, typeorm_1.getManager)().transaction((transactionalEntityManager) => __awaiter(void 0, void 0, void 0, function* () {
                const timestamp = yield transactionalEntityManager.query(constant_1.CONST_QUERYCURRENT_TIMESTAMP).then(res => {
                    return res[0]['timestamp'];
                });
                request.dateCompleted = timestamp;
                request.dateLastUpdated = timestamp;
                return yield transactionalEntityManager.save(Request_1.Request, request);
            }));
            request = yield (0, typeorm_1.getRepository)(Request_1.Request).findOne({
                where: {
                    requestNo: request.requestNo
                },
                relations: {
                    requestedBy: {
                        user: true
                    },
                    assignedAdmin: {
                        user: true
                    },
                    requestType: {
                        requestRequirements: true
                    }
                }
            });
            return res.status(200).json({
                message: "Request updated successfully",
                data: request,
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
//closeRequest - closed
exports.requestRouter.put("/:requestNo/closeRequest", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = Object.assign(Object.assign({}, req.body), req.params);
        yield (0, validator_1.validatorDto)(request_1.MarkRequestAsClosedDto, body);
        let request = yield (0, typeorm_1.getRepository)(Request_1.Request).findOne({
            where: {
                requestNo: body.requestNo
            },
        });
        if (request) {
            if (request.requestStatus.toUpperCase() === constant_1.CONST_REQUEST_STATUS_ENUM.CLOSED) {
                return res.status(404).json({
                    message: "Request already closed!",
                });
            }
            if (!request.dateCompleted) {
                return res.status(404).json({
                    message: "Request was not completed!",
                });
            }
            if (!request.dateProcessEnd) {
                return res.status(404).json({
                    message: "Request was not completed!",
                });
            }
            if (!request.dateProcessStarted) {
                return res.status(404).json({
                    message: "Request was not processed!",
                });
            }
            if (!request.isPaid) {
                return res.status(404).json({
                    message: "Request not paid!",
                });
            }
            if (!request.dateAssigned) {
                return res.status(404).json({
                    message: "Request not assigned!",
                });
            }
            request.requestStatus = constant_1.CONST_REQUEST_STATUS_ENUM.CLOSED;
            request = yield (0, typeorm_1.getManager)().transaction((transactionalEntityManager) => __awaiter(void 0, void 0, void 0, function* () {
                const timestamp = yield transactionalEntityManager.query(constant_1.CONST_QUERYCURRENT_TIMESTAMP).then(res => {
                    return res[0]['timestamp'];
                });
                request.dateClosed = timestamp;
                request.dateLastUpdated = timestamp;
                return yield transactionalEntityManager.save(Request_1.Request, request);
            }));
            request = yield (0, typeorm_1.getRepository)(Request_1.Request).findOne({
                where: {
                    requestNo: request.requestNo
                },
                relations: {
                    requestedBy: {
                        user: true
                    },
                    assignedAdmin: {
                        user: true
                    },
                    requestType: {
                        requestRequirements: true
                    }
                }
            });
            return res.status(200).json({
                message: "Request updated successfully",
                data: request,
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
