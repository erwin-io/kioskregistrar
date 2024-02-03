"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserOneSignalSubscriptionModule = void 0;
const common_1 = require("@nestjs/common");
const user_one_signal_subscription_controller_1 = require("./user-one-signal-subscription.controller");
const user_one_signal_subscription_service_1 = require("../../services/user-one-signal-subscription.service");
const typeorm_1 = require("@nestjs/typeorm");
const UserOneSignalSubscription_1 = require("../../db/entities/UserOneSignalSubscription");
const pusher_service_1 = require("../../services/pusher.service");
const one_signal_notification_service_1 = require("../../services/one-signal-notification.service");
const axios_1 = require("@nestjs/axios");
let UserOneSignalSubscriptionModule = class UserOneSignalSubscriptionModule {
};
UserOneSignalSubscriptionModule = __decorate([
    (0, common_1.Module)({
        imports: [axios_1.HttpModule, typeorm_1.TypeOrmModule.forFeature([UserOneSignalSubscription_1.UserOneSignalSubscription])],
        controllers: [user_one_signal_subscription_controller_1.UserOneSignalSubscriptionController],
        providers: [
            user_one_signal_subscription_service_1.UserOneSignalSubscriptionService,
            pusher_service_1.PusherService,
            one_signal_notification_service_1.OneSignalNotificationService,
        ],
        exports: [
            user_one_signal_subscription_service_1.UserOneSignalSubscriptionService,
            pusher_service_1.PusherService,
            one_signal_notification_service_1.OneSignalNotificationService,
        ],
    })
], UserOneSignalSubscriptionModule);
exports.UserOneSignalSubscriptionModule = UserOneSignalSubscriptionModule;
//# sourceMappingURL=user-one-signal-subscription.module.js.map