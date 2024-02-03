"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestModule = void 0;
const common_1 = require("@nestjs/common");
const request_controller_1 = require("./request.controller");
const request_service_1 = require("../../services/request.service");
const typeorm_1 = require("@nestjs/typeorm");
const Request_1 = require("../../db/entities/Request");
const pusher_service_1 = require("../../services/pusher.service");
const firebase_provider_module_1 = require("../../core/provider/firebase/firebase-provider.module");
const axios_1 = require("@nestjs/axios");
const one_signal_notification_service_1 = require("../../services/one-signal-notification.service");
let RequestModule = class RequestModule {
};
RequestModule = __decorate([
    (0, common_1.Module)({
        imports: [
            firebase_provider_module_1.FirebaseProviderModule,
            axios_1.HttpModule,
            typeorm_1.TypeOrmModule.forFeature([Request_1.Request]),
        ],
        controllers: [request_controller_1.RequestController],
        providers: [request_service_1.RequestService, pusher_service_1.PusherService, one_signal_notification_service_1.OneSignalNotificationService],
        exports: [request_service_1.RequestService, pusher_service_1.PusherService, one_signal_notification_service_1.OneSignalNotificationService],
    })
], RequestModule);
exports.RequestModule = RequestModule;
//# sourceMappingURL=request.module.js.map