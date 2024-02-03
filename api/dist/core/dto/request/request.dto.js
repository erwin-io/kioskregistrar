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
exports.RequestDto = exports.RequestRequirementsDto = exports.RequestRequirementsFileDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
class RequestRequirementsFileDto {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], RequestRequirementsFileDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Object)
], RequestRequirementsFileDto.prototype, "data", void 0);
exports.RequestRequirementsFileDto = RequestRequirementsFileDto;
class RequestRequirementsDto {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], RequestRequirementsDto.prototype, "requestRequirementsId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        isArray: true,
        type: RequestRequirementsFileDto
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_transformer_1.Type)(() => RequestRequirementsFileDto),
    (0, class_validator_1.ValidateNested)(),
    __metadata("design:type", Array)
], RequestRequirementsDto.prototype, "files", void 0);
exports.RequestRequirementsDto = RequestRequirementsDto;
class RequestDto {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], RequestDto.prototype, "requestedById", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], RequestDto.prototype, "requestTypeId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], RequestDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        isArray: true,
        type: RequestRequirementsDto
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_transformer_1.Type)(() => RequestRequirementsDto),
    (0, class_validator_1.ValidateNested)(),
    __metadata("design:type", Array)
], RequestDto.prototype, "requirements", void 0);
exports.RequestDto = RequestDto;
//# sourceMappingURL=request.dto.js.map