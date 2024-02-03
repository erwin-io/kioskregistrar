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
exports.CreateRequestRequirementDto = exports.RequestRequirementDto = exports.RequestTypeDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
class RequestTypeDto {
    constructor() {
        this.authorizeACopy = false;
        this.isPaymentRequired = false;
    }
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], RequestTypeDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: Boolean
    }),
    (0, class_transformer_1.Transform)(({ obj, key }) => {
        return obj[key].toString();
    }),
    (0, class_validator_1.IsBooleanString)(),
    __metadata("design:type", Object)
], RequestTypeDto.prototype, "authorizeACopy", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumberString)(),
    (0, class_transformer_1.Transform)(({ obj, key }) => {
        return obj[key].toString();
    }),
    __metadata("design:type", String)
], RequestTypeDto.prototype, "fee", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: Boolean
    }),
    (0, class_transformer_1.Transform)(({ obj, key }) => {
        return obj[key].toString();
    }),
    (0, class_validator_1.IsBooleanString)(),
    __metadata("design:type", Object)
], RequestTypeDto.prototype, "isPaymentRequired", void 0);
exports.RequestTypeDto = RequestTypeDto;
class RequestRequirementDto {
    constructor() {
        this.requireToSubmitProof = false;
    }
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], RequestRequirementDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: Boolean
    }),
    (0, class_transformer_1.Transform)(({ obj, key }) => {
        return obj[key].toString();
    }),
    (0, class_validator_1.IsBooleanString)(),
    __metadata("design:type", Object)
], RequestRequirementDto.prototype, "requireToSubmitProof", void 0);
exports.RequestRequirementDto = RequestRequirementDto;
class CreateRequestRequirementDto extends RequestRequirementDto {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateRequestRequirementDto.prototype, "requestTypeId", void 0);
exports.CreateRequestRequirementDto = CreateRequestRequirementDto;
//# sourceMappingURL=request-type.dto.js.map