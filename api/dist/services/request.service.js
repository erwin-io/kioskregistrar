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
exports.RequestService = void 0;
const request_type_constant_1 = require("../common/constant/request-type.constant");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const request_constant_1 = require("../common/constant/request.constant");
const user_error_constant_1 = require("../common/constant/user-error.constant");
const utils_1 = require("../common/utils/utils");
const Member_1 = require("../db/entities/Member");
const Request_1 = require("../db/entities/Request");
const RequestType_1 = require("../db/entities/RequestType");
const typeorm_2 = require("typeorm");
const Admin_1 = require("../db/entities/Admin");
const timestamp_constant_1 = require("../common/constant/timestamp.constant");
const Notifications_1 = require("../db/entities/Notifications");
const notifications_constant_1 = require("../common/constant/notifications.constant");
const pusher_service_1 = require("./pusher.service");
let RequestService = class RequestService {
    constructor(requestRepo, pusherService) {
        this.requestRepo = requestRepo;
        this.pusherService = pusherService;
    }
    async getRequestPagination({ pageSize, pageIndex, order, columnDef, assignedAdminId, }) {
        var _a, _b;
        try {
            const skip = Number(pageIndex) > 0 ? Number(pageIndex) * Number(pageSize) : 0;
            const take = Number(pageSize);
            let condition = (0, utils_1.columnDefToTypeORMCondition)(columnDef);
            if (columnDef &&
                columnDef.find((x) => x.apiNotation === "requestStatus") &&
                columnDef.find((x) => x.apiNotation === "requestStatus").type ===
                    "precise" &&
                columnDef.find((x) => x.apiNotation === "requestStatus").filter !==
                    "PENDING" &&
                (!((_a = condition === null || condition === void 0 ? void 0 : condition.assignedAdmin) === null || _a === void 0 ? void 0 : _a.adminId) ||
                    ((_b = condition === null || condition === void 0 ? void 0 : condition.assignedAdmin) === null || _b === void 0 ? void 0 : _b.adminId) === "")) {
                if (assignedAdminId && assignedAdminId !== "") {
                    condition = Object.assign(Object.assign({}, condition), { assignedAdmin: {
                            adminId: assignedAdminId,
                        } });
                }
            }
            const [results, total] = await Promise.all([
                this.requestRepo.find({
                    relations: {
                        requestedBy: {
                            user: {
                                profileFile: true,
                            },
                        },
                        assignedAdmin: {
                            user: {
                                profileFile: true,
                            },
                        },
                        requestType: {
                            requestRequirements: true,
                        },
                    },
                    where: condition,
                    skip,
                    take,
                    order,
                }),
                this.requestRepo.count({ where: condition }),
            ]);
            return {
                results,
                total,
            };
        }
        catch (ex) {
            throw ex;
        }
    }
    async getByRequestNo(requestNo) {
        return await this.requestRepo.findOne({
            where: {
                requestNo,
            },
            relations: {
                requestedBy: {
                    user: {
                        profileFile: true,
                    },
                },
                assignedAdmin: {
                    user: {
                        profileFile: true,
                    },
                },
                requestType: {
                    requestRequirements: true,
                },
            },
        });
    }
    async create(dto) {
        return await this.requestRepo.manager.transaction(async (entityManager) => {
            const request = new Request_1.Request();
            request.description = dto.description;
            const requestedBy = await entityManager.findOne(Member_1.Member, {
                where: {
                    memberId: dto.requestedById,
                },
            });
            if (!requestedBy) {
                throw Error(user_error_constant_1.USER_ERROR_MEMBER_NOT_FOUND);
            }
            request.requestedBy = requestedBy;
            const requestType = await entityManager.findOne(RequestType_1.RequestType, {
                where: {
                    requestTypeId: dto.requestTypeId,
                },
            });
            if (!requestType) {
                throw Error(request_type_constant_1.REQUEST_TYPE_ERROR_NOT_FOUND);
            }
            request.requestType = requestType;
            const _res = await entityManager.save(request);
            _res.requestNo = (0, utils_1.generateRequestNo)(_res.requestId);
            return await entityManager.save(Request_1.Request, _res);
        });
    }
    async updateDescription(requestNo, dto) {
        return await this.requestRepo.manager.transaction(async (entityManager) => {
            let request = await entityManager.findOne(Request_1.Request, {
                where: {
                    requestNo,
                },
            });
            if (!request) {
                throw Error(request_constant_1.REQUEST_ERROR_NOT_FOUND);
            }
            request.description = dto.description;
            request = await entityManager.save(Request_1.Request, request);
            await this.logNotification([request.assignedAdmin.user], request, entityManager, notifications_constant_1.NOTIF_TITLE.REQUEST_DESCRIPTION_UPDATED, `Request #${request.requestNo} description was updated by the requestor!`);
            await this.syncRealTime([request.assignedAdmin.user.userId], request);
            return request;
        });
    }
    async assignRequest(requestNo, dto) {
        return await this.requestRepo.manager.transaction(async (entityManager) => {
            let request = await entityManager.findOne(Request_1.Request, {
                where: {
                    requestNo,
                },
                relations: {
                    assignedAdmin: {
                        user: {
                            profileFile: true,
                        },
                    },
                    requestedBy: {
                        user: {
                            profileFile: true,
                        },
                    },
                },
            });
            if (!request) {
                throw Error(request_constant_1.REQUEST_ERROR_NOT_FOUND);
            }
            if (request.requestStatus.toUpperCase() === request_constant_1.CONST_REQUEST_STATUS_ENUM.CLOSED) {
                throw Error("Request already closed!");
            }
            if (request.requestStatus.toUpperCase() ===
                request_constant_1.CONST_REQUEST_STATUS_ENUM.TOPAY ||
                request.requestStatus.toUpperCase() ===
                    request_constant_1.CONST_REQUEST_STATUS_ENUM.TOCOMPLETE ||
                request.requestStatus.toUpperCase() ===
                    request_constant_1.CONST_REQUEST_STATUS_ENUM.PROCESSING) {
                throw Error("Request already being processed!");
            }
            if (request.requestStatus.toUpperCase() ===
                request_constant_1.CONST_REQUEST_STATUS_ENUM.TOPAY ||
                (request.assignedAdmin && request.assignedAdmin.adminId)) {
                throw Error("Request already assigned!");
            }
            const assignedAdmin = await entityManager.findOne(Admin_1.Admin, {
                where: {
                    adminId: dto.assignedAdminId,
                },
                relations: {
                    user: {
                        profileFile: true,
                    },
                },
            });
            if (!assignedAdmin) {
                throw Error("Invalid Assignee!");
            }
            request.assignedAdmin = assignedAdmin;
            request.requestStatus = request_constant_1.CONST_REQUEST_STATUS_ENUM.TOPAY;
            const timestamp = await entityManager
                .query(timestamp_constant_1.CONST_QUERYCURRENT_TIMESTAMP)
                .then((res) => {
                return res[0]["timestamp"];
            });
            request.dateAssigned = timestamp;
            request.dateLastUpdated = timestamp;
            request = await entityManager.save(Request_1.Request, request);
            await this.logNotification([request.assignedAdmin.user, request.requestedBy.user], request, entityManager, notifications_constant_1.NOTIF_TITLE.REQUEST_ASSIGNED, `Request #${request.requestNo} is now assigned to ${request.assignedAdmin.fullName}!`);
            await this.syncRealTime([request.assignedAdmin.user.userId, request.requestedBy.user.userId], request);
            return await entityManager.findOne(Request_1.Request, {
                where: {
                    requestNo: request.requestNo,
                },
                relations: {
                    requestedBy: {
                        user: true,
                    },
                    assignedAdmin: {
                        user: true,
                    },
                    requestType: {
                        requestRequirements: true,
                    },
                },
            });
        });
    }
    async payRequest(requestNo, dto) {
        return await this.requestRepo.manager.transaction(async (entityManager) => {
            let request = await entityManager.findOne(Request_1.Request, {
                where: {
                    requestNo,
                },
                relations: {
                    assignedAdmin: {
                        user: {
                            profileFile: true,
                        },
                    },
                    requestedBy: {
                        user: {
                            profileFile: true,
                        },
                    },
                },
            });
            if (!request) {
                throw Error(request_constant_1.REQUEST_ERROR_NOT_FOUND);
            }
            if (request.requestStatus.toUpperCase() === request_constant_1.CONST_REQUEST_STATUS_ENUM.CLOSED) {
                throw Error("Request already closed!");
            }
            if (request.requestStatus.toUpperCase() ===
                request_constant_1.CONST_REQUEST_STATUS_ENUM.TOCOMPLETE ||
                request.requestStatus.toUpperCase() ===
                    request_constant_1.CONST_REQUEST_STATUS_ENUM.PROCESSING) {
                throw Error("Request already being processed!");
            }
            if (request.dateCompleted) {
                throw Error("Request was already completed!");
            }
            if (!request.dateAssigned) {
                throw Error("Request not assigned!");
            }
            if (request.isPaid) {
                throw Error("Request already assigned!");
            }
            request.isPaid = true;
            request.requestStatus = request_constant_1.CONST_REQUEST_STATUS_ENUM.PROCESSING;
            const timestamp = await entityManager
                .query(timestamp_constant_1.CONST_QUERYCURRENT_TIMESTAMP)
                .then((res) => {
                return res[0]["timestamp"];
            });
            request.datePaid = timestamp;
            request.dateProcessStarted = timestamp;
            request.dateLastUpdated = timestamp;
            request = await entityManager.save(Request_1.Request, request);
            return await entityManager.findOne(Request_1.Request, {
                where: {
                    requestNo: request.requestNo,
                },
                relations: {
                    requestedBy: {
                        user: true,
                    },
                    assignedAdmin: {
                        user: true,
                    },
                    requestType: {
                        requestRequirements: true,
                    },
                },
            });
        });
    }
    async markAsToComplete(requestNo, dto) {
        return await this.requestRepo.manager.transaction(async (entityManager) => {
            let request = await entityManager.findOne(Request_1.Request, {
                where: {
                    requestNo,
                },
                relations: {
                    assignedAdmin: {
                        user: {
                            profileFile: true,
                        },
                    },
                    requestedBy: {
                        user: {
                            profileFile: true,
                        },
                    },
                },
            });
            if (!request) {
                throw Error(request_constant_1.REQUEST_ERROR_NOT_FOUND);
            }
            if (request.requestStatus.toUpperCase() === request_constant_1.CONST_REQUEST_STATUS_ENUM.CLOSED) {
                throw Error("Request already closed!");
            }
            if (request.dateCompleted) {
                throw Error("Request was already completed!");
            }
            if (!request.dateProcessStarted) {
                throw Error("Request was not processed!");
            }
            if (!request.isPaid) {
                throw Error("Request not paid!");
            }
            if (!request.dateAssigned) {
                throw Error("Request not assigned!");
            }
            request.requestStatus = request_constant_1.CONST_REQUEST_STATUS_ENUM.TOCOMPLETE;
            const timestamp = await entityManager
                .query(timestamp_constant_1.CONST_QUERYCURRENT_TIMESTAMP)
                .then((res) => {
                return res[0]["timestamp"];
            });
            request.dateProcessEnd = timestamp;
            request.dateLastUpdated = timestamp;
            request = await entityManager.save(Request_1.Request, request);
            await this.logNotification([request.requestedBy.user], request, entityManager, notifications_constant_1.NOTIF_TITLE.REQUEST_READY, `Request #${request.requestNo} is now ready!`);
            await this.syncRealTime([request.requestedBy.user.userId], request);
            return await entityManager.findOne(Request_1.Request, {
                where: {
                    requestNo: request.requestNo,
                },
                relations: {
                    requestedBy: {
                        user: true,
                    },
                    assignedAdmin: {
                        user: true,
                    },
                    requestType: {
                        requestRequirements: true,
                    },
                },
            });
        });
    }
    async completeRequest(requestNo, dto) {
        return await this.requestRepo.manager.transaction(async (entityManager) => {
            let request = await entityManager.findOne(Request_1.Request, {
                where: {
                    requestNo,
                },
                relations: {
                    assignedAdmin: {
                        user: {
                            profileFile: true,
                        },
                    },
                    requestedBy: {
                        user: {
                            profileFile: true,
                        },
                    },
                },
            });
            if (!request) {
                throw Error(request_constant_1.REQUEST_ERROR_NOT_FOUND);
            }
            if (request.requestStatus.toUpperCase() === request_constant_1.CONST_REQUEST_STATUS_ENUM.CLOSED) {
                throw Error("Request already closed!");
            }
            if (request.dateCompleted) {
                throw Error("Request was already completed!");
            }
            if (!request.dateProcessEnd) {
                throw Error("Request was not processed!");
            }
            if (!request.dateProcessStarted) {
                throw Error("Request was not processed!");
            }
            if (!request.isPaid) {
                throw Error("Request not paid!");
            }
            if (!request.dateAssigned) {
                throw Error("Request not assigned!");
            }
            const timestamp = await entityManager
                .query(timestamp_constant_1.CONST_QUERYCURRENT_TIMESTAMP)
                .then((res) => {
                return res[0]["timestamp"];
            });
            request.dateCompleted = timestamp;
            request.dateLastUpdated = timestamp;
            request = await entityManager.save(Request_1.Request, request);
            await this.logNotification([request.requestedBy.user, request.assignedAdmin.user], request, entityManager, notifications_constant_1.NOTIF_TITLE.REQUEST_COMPLETED, `Request #${request.requestNo} is now completed`);
            await this.syncRealTime([request.requestedBy.user.userId, request.assignedAdmin.user.userId], request);
            return await entityManager.findOne(Request_1.Request, {
                where: {
                    requestNo: request.requestNo,
                },
                relations: {
                    requestedBy: {
                        user: true,
                    },
                    assignedAdmin: {
                        user: true,
                    },
                    requestType: {
                        requestRequirements: true,
                    },
                },
            });
        });
    }
    async closeRequest(requestNo, dto) {
        return await this.requestRepo.manager.transaction(async (entityManager) => {
            let request = await entityManager.findOne(Request_1.Request, {
                where: {
                    requestNo,
                },
                relations: {
                    assignedAdmin: {
                        user: {
                            profileFile: true,
                        },
                    },
                    requestedBy: {
                        user: {
                            profileFile: true,
                        },
                    },
                },
            });
            if (!request) {
                throw Error(request_constant_1.REQUEST_ERROR_NOT_FOUND);
            }
            if (request.requestStatus.toUpperCase() === request_constant_1.CONST_REQUEST_STATUS_ENUM.CLOSED) {
                throw Error("Request already closed!");
            }
            if (!request.dateCompleted) {
                throw Error("Request was not completed!");
            }
            if (!request.dateProcessEnd) {
                throw Error("Request was not processed!");
            }
            if (!request.dateProcessStarted) {
                throw Error("Request was not processed!");
            }
            if (!request.isPaid) {
                throw Error("Request not paid!");
            }
            if (!request.dateAssigned) {
                throw Error("Request not assigned!");
            }
            request.requestStatus = request_constant_1.CONST_REQUEST_STATUS_ENUM.CLOSED;
            const timestamp = await entityManager
                .query(timestamp_constant_1.CONST_QUERYCURRENT_TIMESTAMP)
                .then((res) => {
                return res[0]["timestamp"];
            });
            request.dateClosed = timestamp;
            request.dateLastUpdated = timestamp;
            request = await entityManager.save(Request_1.Request, request);
            await this.logNotification([request.requestedBy.user], request, entityManager, notifications_constant_1.NOTIF_TITLE.REQUEST_CLOSED, `Your request #${request.requestNo} is now closed`);
            await this.syncRealTime([request.requestedBy.user.userId], request);
            return await entityManager.findOne(Request_1.Request, {
                where: {
                    requestNo: request.requestNo,
                },
                relations: {
                    requestedBy: {
                        user: true,
                    },
                    assignedAdmin: {
                        user: true,
                    },
                    requestType: {
                        requestRequirements: true,
                    },
                },
            });
        });
    }
    async rejectRequest(requestNo, dto) {
        return await this.requestRepo.manager.transaction(async (entityManager) => {
            let request = await entityManager.findOne(Request_1.Request, {
                where: {
                    requestNo,
                },
                relations: {
                    requestedBy: {
                        user: true,
                    },
                    assignedAdmin: {
                        user: true,
                    },
                },
            });
            if (!request) {
                throw Error(request_constant_1.REQUEST_ERROR_NOT_FOUND);
            }
            if (request.requestStatus.toUpperCase() ===
                request_constant_1.CONST_REQUEST_STATUS_ENUM.REJECTED) {
                throw Error("Request already rejected!");
            }
            if (request.requestStatus.toUpperCase() === request_constant_1.CONST_REQUEST_STATUS_ENUM.CANCEL) {
                throw Error("Request already cancelled!");
            }
            if (request.requestStatus.toUpperCase() === request_constant_1.CONST_REQUEST_STATUS_ENUM.CLOSED) {
                throw Error("Request already closed!");
            }
            if (!["PENDING", "TOPAY"].some((x) => x === request.requestStatus.toUpperCase())) {
                throw Error("Not allowed to cancel!, Request was already being process!");
            }
            request.requestStatus = request_constant_1.CONST_REQUEST_STATUS_ENUM.REJECTED;
            const timestamp = await entityManager
                .query(timestamp_constant_1.CONST_QUERYCURRENT_TIMESTAMP)
                .then((res) => {
                return res[0]["timestamp"];
            });
            request.dateLastUpdated = timestamp;
            request = await entityManager.save(Request_1.Request, request);
            await this.logNotification([request.requestedBy.user], request, entityManager, notifications_constant_1.NOTIF_TITLE.REQUEST_REJECTED, `Your request #${request.requestNo} was rejected`);
            await this.syncRealTime([request.assignedAdmin.user.userId], request);
            return await entityManager.findOne(Request_1.Request, {
                where: {
                    requestNo: request.requestNo,
                },
                relations: {
                    requestedBy: {
                        user: true,
                    },
                    assignedAdmin: {
                        user: true,
                    },
                    requestType: {
                        requestRequirements: true,
                    },
                },
            });
        });
    }
    async cancelRequest(requestNo, dto) {
        return await this.requestRepo.manager.transaction(async (entityManager) => {
            let request = await entityManager.findOne(Request_1.Request, {
                where: {
                    requestNo,
                },
                relations: {
                    assignedAdmin: {
                        user: {
                            profileFile: true,
                        },
                    },
                    requestedBy: {
                        user: {
                            profileFile: true,
                        },
                    },
                },
            });
            if (!request) {
                throw Error(request_constant_1.REQUEST_ERROR_NOT_FOUND);
            }
            if (request.requestStatus.toUpperCase() === request_constant_1.CONST_REQUEST_STATUS_ENUM.CANCEL) {
                throw Error("Request already cancelled!");
            }
            if (request.requestStatus.toUpperCase() === request_constant_1.CONST_REQUEST_STATUS_ENUM.CLOSED) {
                throw Error("Request already closed!");
            }
            if (!["PENDING", "TOPAY"].some((x) => x === request.requestStatus.toUpperCase())) {
                throw Error("Not allowed to cancel!, Request was already being process!");
            }
            request.requestStatus = request_constant_1.CONST_REQUEST_STATUS_ENUM.CANCEL;
            const timestamp = await entityManager
                .query(timestamp_constant_1.CONST_QUERYCURRENT_TIMESTAMP)
                .then((res) => {
                return res[0]["timestamp"];
            });
            request.dateLastUpdated = timestamp;
            request = await entityManager.save(Request_1.Request, request);
            return await entityManager.findOne(Request_1.Request, {
                where: {
                    requestNo: request.requestNo,
                },
                relations: {
                    requestedBy: {
                        user: true,
                    },
                    assignedAdmin: {
                        user: true,
                    },
                    requestType: {
                        requestRequirements: true,
                    },
                },
            });
        });
    }
    async logNotification(users, request, entityManager, title, description) {
        const notifications = [];
        for (const user of users) {
            notifications.push({
                title,
                description,
                type: notifications_constant_1.NOTIF_TYPE.REQUEST.toString(),
                referenceId: request.requestNo.toString(),
                isRead: false,
                user: user,
            });
        }
        await entityManager.save(Notifications_1.Notifications, notifications);
        await this.pusherService.sendNotif(users.map((x) => x.userId), title, description);
    }
    async syncRealTime(userIds, request) {
        await this.pusherService.requestChanges(userIds, request);
    }
};
RequestService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(Request_1.Request)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        pusher_service_1.PusherService])
], RequestService);
exports.RequestService = RequestService;
//# sourceMappingURL=request.service.js.map