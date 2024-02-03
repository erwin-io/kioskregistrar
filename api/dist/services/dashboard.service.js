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
exports.DashboardService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const Request_1 = require("../db/entities/Request");
const request_constant_1 = require("../common/constant/request.constant");
const Member_1 = require("../db/entities/Member");
let DashboardService = class DashboardService {
    constructor(requestRepo, memberRepo) {
        this.requestRepo = requestRepo;
        this.memberRepo = memberRepo;
    }
    async getMemberDashboard(memberId) {
        const res = await Promise.all([
            this.requestRepo.manager.count(Request_1.Request, {
                where: {
                    requestStatus: request_constant_1.CONST_REQUEST_STATUS_ENUM.PENDING,
                    requestedBy: {
                        memberId,
                    },
                },
            }),
            this.requestRepo.manager.findOne(Request_1.Request, {
                where: {
                    requestStatus: request_constant_1.CONST_REQUEST_STATUS_ENUM.PENDING,
                    requestedBy: {
                        memberId,
                    },
                },
                relations: {
                    requestType: true,
                    requestedBy: true,
                },
                order: {
                    dateRequested: "ASC",
                },
            }),
            this.requestRepo.manager.count(Request_1.Request, {
                where: {
                    requestStatus: request_constant_1.CONST_REQUEST_STATUS_ENUM.TOPAY,
                    requestedBy: {
                        memberId,
                    },
                },
            }),
            this.requestRepo.manager.findOne(Request_1.Request, {
                where: {
                    requestStatus: request_constant_1.CONST_REQUEST_STATUS_ENUM.TOPAY,
                    requestedBy: {
                        memberId,
                    },
                },
                relations: {
                    requestType: true,
                    requestedBy: true,
                    assignedAdmin: true,
                },
                order: {
                    dateRequested: "ASC",
                },
            }),
            this.requestRepo.manager.count(Request_1.Request, {
                where: {
                    requestStatus: request_constant_1.CONST_REQUEST_STATUS_ENUM.TOCOMPLETE,
                    requestedBy: {
                        memberId,
                    },
                    dateCompleted: (0, typeorm_2.IsNull)(),
                },
            }),
            this.requestRepo.manager.findOne(Request_1.Request, {
                where: {
                    requestStatus: request_constant_1.CONST_REQUEST_STATUS_ENUM.TOCOMPLETE,
                    requestedBy: {
                        memberId,
                    },
                    dateCompleted: (0, typeorm_2.IsNull)(),
                },
                relations: {
                    requestType: true,
                    requestedBy: true,
                    assignedAdmin: true,
                },
                order: {
                    dateRequested: "ASC",
                },
            }),
            this.requestRepo.manager.count(Request_1.Request, {
                where: {
                    requestStatus: request_constant_1.CONST_REQUEST_STATUS_ENUM.PROCESSING,
                    requestedBy: {
                        memberId,
                    },
                },
            }),
            this.requestRepo.manager.findOne(Request_1.Request, {
                where: {
                    requestStatus: request_constant_1.CONST_REQUEST_STATUS_ENUM.PROCESSING,
                    requestedBy: {
                        memberId,
                    },
                },
                relations: {
                    requestType: true,
                    requestedBy: true,
                    assignedAdmin: true,
                },
                order: {
                    dateRequested: "ASC",
                },
            }),
        ]);
        return {
            pending: {
                total: res[0],
                prio: res[1],
            },
            toPay: {
                total: res[2],
                prio: res[3],
            },
            toComplete: {
                total: res[4],
                prio: res[5],
            },
            processing: {
                total: res[6],
                prio: res[7],
            },
        };
    }
    async getSummaryMemberUsers() {
        const [verified, unVerified] = await Promise.all([
            this.memberRepo.count({
                where: {
                    isVerified: true,
                },
            }),
            this.memberRepo.count({
                where: {
                    isVerified: false,
                },
            }),
        ]);
        return {
            verified,
            unVerified,
        };
    }
};
DashboardService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(Request_1.Request)),
    __param(1, (0, typeorm_1.InjectRepository)(Member_1.Member)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], DashboardService);
exports.DashboardService = DashboardService;
//# sourceMappingURL=dashboard.service.js.map