"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_service_1 = require("./app.service");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_service_1 = require("./db/typeorm/typeorm.service");
const config_1 = require("@nestjs/config");
const auth_module_1 = require("./controller/auth/auth.module");
const firebase_provider_module_1 = require("./core/provider/firebase/firebase-provider.module");
const Joi = __importStar(require("@hapi/joi"));
const utils_1 = require("./common/utils/utils");
const users_module_1 = require("./controller/users/users.module");
const request_module_1 = require("./controller/request/request.module");
const request_type_module_1 = require("./controller/request-type/request-type.module");
const request_requirements_module_1 = require("./controller/request-requirements/request-requirements.module");
const dashboard_module_1 = require("./controller/dashboard/dashboard.module");
const user_one_signal_subscription_module_1 = require("./controller/user-one-signal-subscription/user-one-signal-subscription.module");
const notifications_module_1 = require("./controller/notifications/notifications.module");
const files_service_1 = require("./services/files.service");
const course_module_1 = require("./controller/course/course.module");
const envFilePath = (0, utils_1.getEnvPath)(`${__dirname}/common/envs`);
let AppModule = class AppModule {
};
AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                envFilePath,
                isGlobal: true,
                validationSchema: Joi.object({
                    UPLOADED_FILES_DESTINATION: Joi.string().required(),
                }),
            }),
            typeorm_1.TypeOrmModule.forRootAsync({ useClass: typeorm_service_1.TypeOrmConfigService }),
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            firebase_provider_module_1.FirebaseProviderModule,
            request_module_1.RequestModule,
            request_type_module_1.RequestTypeModule,
            request_requirements_module_1.RequestRequirementsModule,
            dashboard_module_1.DashboardModule,
            user_one_signal_subscription_module_1.UserOneSignalSubscriptionModule,
            notifications_module_1.NotificationsModule,
            course_module_1.CourseModule
        ],
        providers: [app_service_1.AppService, files_service_1.FilesService],
        controllers: [],
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map