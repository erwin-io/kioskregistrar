"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestTypeModule = void 0;
const common_1 = require("@nestjs/common");
const request_type_controller_1 = require("./request-type.controller");
const RequestType_1 = require("../../db/entities/RequestType");
const request_type_service_1 = require("../../services/request-type.service");
const typeorm_1 = require("@nestjs/typeorm");
let RequestTypeModule = class RequestTypeModule {
};
RequestTypeModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([RequestType_1.RequestType])],
        controllers: [request_type_controller_1.RequestTypeController],
        providers: [request_type_service_1.RequestTypeService],
        exports: [request_type_service_1.RequestTypeService],
    })
], RequestTypeModule);
exports.RequestTypeModule = RequestTypeModule;
//# sourceMappingURL=request-type.module.js.map