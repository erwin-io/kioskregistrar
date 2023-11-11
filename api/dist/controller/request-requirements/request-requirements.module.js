"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestRequirementsModule = void 0;
const common_1 = require("@nestjs/common");
const request_requirements_controller_1 = require("./request-requirements.controller");
const RequestRequirements_1 = require("../../db/entities/RequestRequirements");
const typeorm_1 = require("@nestjs/typeorm");
const request_requirements_service_1 = require("../../services/request-requirements.service");
let RequestRequirementsModule = class RequestRequirementsModule {
};
RequestRequirementsModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([RequestRequirements_1.RequestRequirements])],
        controllers: [request_requirements_controller_1.RequestRequirementsController],
        providers: [request_requirements_service_1.RequestRequirementsService],
        exports: [request_requirements_service_1.RequestRequirementsService],
    })
], RequestRequirementsModule);
exports.RequestRequirementsModule = RequestRequirementsModule;
//# sourceMappingURL=request-requirements.module.js.map