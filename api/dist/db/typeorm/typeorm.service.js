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
exports.TypeOrmConfigService = void 0;
const Admin_1 = require("../entities/Admin");
const Files_1 = require("../entities/Files");
const Member_1 = require("../entities/Member");
const RequestRequirements_1 = require("../entities/RequestRequirements");
const RequestType_1 = require("../entities/RequestType");
const SystemConfig_1 = require("../entities/SystemConfig");
const Users_1 = require("../entities/Users");
const config_1 = require("@nestjs/config");
const common_1 = require("@nestjs/common");
const Request_1 = require("../entities/Request");
const Notifications_1 = require("../entities/Notifications");
const SubmittedRequirements_1 = require("../entities/SubmittedRequirements");
const UserOneSignalSubscription_1 = require("../entities/UserOneSignalSubscription");
const SupportTicketConvo_1 = require("../entities/SupportTicketConvo");
const SupportTickets_1 = require("../entities/SupportTickets");
const Courses_1 = require("../entities/Courses");
let TypeOrmConfigService = class TypeOrmConfigService {
    createTypeOrmOptions() {
        const ssl = this.config.get("SSL");
        const config = {
            type: "postgres",
            host: this.config.get("DATABASE_HOST"),
            port: Number(this.config.get("DATABASE_PORT")),
            database: this.config.get("DATABASE_NAME"),
            username: this.config.get("DATABASE_USER"),
            password: this.config.get("DATABASE_PASSWORD"),
            entities: [
                SystemConfig_1.SystemConfig,
                Users_1.Users,
                Admin_1.Admin,
                Member_1.Member,
                Files_1.Files,
                RequestType_1.RequestType,
                RequestRequirements_1.RequestRequirements,
                Request_1.Request,
                Notifications_1.Notifications,
                SubmittedRequirements_1.SubmittedRequirements,
                UserOneSignalSubscription_1.UserOneSignalSubscription,
                SupportTickets_1.SupportTickets,
                SupportTicketConvo_1.SupportTicketConvo,
                Courses_1.Courses
            ],
            synchronize: false,
            ssl: ssl.toLocaleLowerCase().includes("true"),
            extra: {},
        };
        if (config.ssl) {
            config.extra.ssl = {
                require: true,
                rejectUnauthorized: false,
            };
        }
        return config;
    }
};
__decorate([
    (0, common_1.Inject)(config_1.ConfigService),
    __metadata("design:type", config_1.ConfigService)
], TypeOrmConfigService.prototype, "config", void 0);
TypeOrmConfigService = __decorate([
    (0, common_1.Injectable)()
], TypeOrmConfigService);
exports.TypeOrmConfigService = TypeOrmConfigService;
//# sourceMappingURL=typeorm.service.js.map