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
Object.defineProperty(exports, "__esModule", { value: true });
exports.OneSignalNotificationService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const rxjs_1 = require("rxjs");
const axios_1 = require("@nestjs/axios");
let OneSignalNotificationService = class OneSignalNotificationService {
    constructor(httpService, config) {
        this.httpService = httpService;
        this.config = config;
    }
    async sendToSubscriber(subscriptionId, type, referenceId, notificationIds, title, description) {
        const url = this.config.get("ONE_SIGNAL_NOTIF_URL");
        const apiKey = this.config.get("ONE_SIGNAL_API_KEY");
        let large_icon;
        if (type === "REQUEST") {
            large_icon = this.config.get("ONE_SIGNAL_NOTIF_IMAGE_REQUEST");
        }
        else if (type === "SUPPORT") {
            large_icon = this.config.get("ONE_SIGNAL_NOTIF_IMAGE_SUPPORT");
        }
        else {
            large_icon = this.config.get("ONE_SIGNAL_NOTIF_IMAGE");
        }
        let result;
        try {
            result = await (0, rxjs_1.firstValueFrom)(this.httpService
                .post(url, {
                app_id: this.config.get("ONE_SIGNAL_APP_ID"),
                include_subscription_ids: [subscriptionId],
                data: {
                    notificationIds,
                    type,
                    referenceId,
                },
                large_icon: large_icon,
                headings: {
                    en: title,
                },
                contents: {
                    en: description,
                },
                android_sound: this.config.get("ONE_SIGNAL_NOTIF_A_SOUND"),
                existing_android_channel_id: this.config.get("ONE_SIGNAL_NOTIF_A_EXISTING_CHANNEL_ID"),
            }, {
                responseType: "json",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Basic " + apiKey,
                },
            })
                .pipe((0, rxjs_1.catchError)((error) => {
                throw new common_1.HttpException(error.response, common_1.HttpStatus.BAD_REQUEST);
            })));
        }
        catch (ex) {
            return { subscriptionId, success: false };
        }
        console.log(result === null || result === void 0 ? void 0 : result.data);
        return { subscriptionId, success: true };
    }
    async sendToExternalUser(userId, type, referenceId, notificationIds, title, description) {
        const url = this.config.get("ONE_SIGNAL_NOTIF_URL");
        const apiKey = this.config.get("ONE_SIGNAL_API_KEY");
        let large_icon;
        if (type === "REQUEST") {
            large_icon = this.config.get("ONE_SIGNAL_NOTIF_IMAGE_REQUEST");
        }
        else if (type === "SUPPORT") {
            large_icon = this.config.get("ONE_SIGNAL_NOTIF_IMAGE_SUPPORT");
        }
        else {
            large_icon = this.config.get("ONE_SIGNAL_NOTIF_IMAGE");
        }
        let result;
        try {
            result = await (0, rxjs_1.firstValueFrom)(this.httpService
                .post(url, {
                app_id: this.config.get("ONE_SIGNAL_APP_ID"),
                include_external_user_ids: [userId],
                data: {
                    notificationIds,
                    type,
                    referenceId,
                },
                large_icon: large_icon,
                headings: {
                    en: title,
                },
                contents: {
                    en: description,
                },
                android_sound: this.config.get("ONE_SIGNAL_NOTIF_A_SOUND"),
                existing_android_channel_id: this.config.get("ONE_SIGNAL_NOTIF_A_EXISTING_CHANNEL_ID"),
            }, {
                responseType: "json",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Basic " + apiKey,
                },
            })
                .pipe((0, rxjs_1.catchError)((error) => {
                throw new common_1.HttpException(error.response, common_1.HttpStatus.BAD_REQUEST);
            })));
        }
        catch (ex) {
            return { userId, success: false };
        }
        return { userId, success: true };
    }
    async setExternalUserId(subscriptionId, externalUserId) {
        const url = this.config.get("ONE_SIGNAL_PLAYERS_URL");
        const apiKey = this.config.get("ONE_SIGNAL_API_KEY");
        let result;
        try {
            result = await (0, rxjs_1.firstValueFrom)(this.httpService
                .put(url.slice(-1) === "/"
                ? `${url}${subscriptionId}`
                : `${url}/${subscriptionId}`, {
                app_id: this.config.get("ONE_SIGNAL_APP_ID"),
                external_user_id: externalUserId,
            }, {
                responseType: "json",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Basic " + apiKey,
                },
            })
                .pipe((0, rxjs_1.catchError)((error) => {
                throw new common_1.HttpException(error.response, common_1.HttpStatus.BAD_REQUEST);
            })));
        }
        catch (ex) {
            return ex.message;
        }
        console.log(result === null || result === void 0 ? void 0 : result.data);
        return result === null || result === void 0 ? void 0 : result.data;
    }
    async setTags(subscriptionId, tags) {
        const url = this.config.get("ONE_SIGNAL_PLAYERS_URL");
        const apiKey = this.config.get("ONE_SIGNAL_API_KEY");
        let result;
        try {
            result = await (0, rxjs_1.firstValueFrom)(this.httpService
                .put(url.slice(-1) === "/"
                ? `${url}${subscriptionId}`
                : `${url}/${subscriptionId}`, {
                app_id: this.config.get("ONE_SIGNAL_APP_ID"),
                tags,
            }, {
                responseType: "json",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Basic " + apiKey,
                },
            })
                .pipe((0, rxjs_1.catchError)((error) => {
                throw new common_1.HttpException(error.response, common_1.HttpStatus.BAD_REQUEST);
            })));
        }
        catch (ex) {
            return ex.message;
        }
        return result === null || result === void 0 ? void 0 : result.data;
    }
};
OneSignalNotificationService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [axios_1.HttpService,
        config_1.ConfigService])
], OneSignalNotificationService);
exports.OneSignalNotificationService = OneSignalNotificationService;
//# sourceMappingURL=one-signal-notification.service.js.map