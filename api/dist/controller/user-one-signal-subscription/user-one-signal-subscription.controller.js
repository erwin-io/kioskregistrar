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
exports.UserOneSignalSubscriptionController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const api_response_constant_1 = require("../../common/constant/api-response.constant");
const user_one_signal_subscription_create_dto_1 = require("../../core/dto/user-one-signal-subscription/user-one-signal-subscription.create.dto");
const user_one_signal_subscription_service_1 = require("../../services/user-one-signal-subscription.service");
let UserOneSignalSubscriptionController = class UserOneSignalSubscriptionController {
    constructor(userOneSignalSubscriptionsService) {
        this.userOneSignalSubscriptionsService = userOneSignalSubscriptionsService;
    }
    async getBySubscriptionId(subscriptionId) {
        const res = {};
        try {
            res.data =
                await this.userOneSignalSubscriptionsService.getBySubscriptionId(subscriptionId);
            res.success = true;
            return res;
        }
        catch (e) {
            res.success = false;
            res.message = e.message !== undefined ? e.message : e;
            return res;
        }
    }
    async create(userOneSignalSubscriptionsDto) {
        const res = {};
        try {
            res.data = await this.userOneSignalSubscriptionsService.create(userOneSignalSubscriptionsDto);
            res.success = true;
            res.message = `User One Signal Subscription ${api_response_constant_1.SAVING_SUCCESS}`;
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
    (0, common_1.Get)("/getBySubscriptionId/:subscriptionId"),
    __param(0, (0, common_1.Param)("subscriptionId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserOneSignalSubscriptionController.prototype, "getBySubscriptionId", null);
__decorate([
    (0, common_1.Post)(""),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_one_signal_subscription_create_dto_1.CreateUserOneSignalSubscriptionDto]),
    __metadata("design:returntype", Promise)
], UserOneSignalSubscriptionController.prototype, "create", null);
UserOneSignalSubscriptionController = __decorate([
    (0, swagger_1.ApiTags)("user-one-signal-subscription"),
    (0, common_1.Controller)("user-one-signal-subscription"),
    __metadata("design:paramtypes", [user_one_signal_subscription_service_1.UserOneSignalSubscriptionService])
], UserOneSignalSubscriptionController);
exports.UserOneSignalSubscriptionController = UserOneSignalSubscriptionController;
//# sourceMappingURL=user-one-signal-subscription.controller.js.map