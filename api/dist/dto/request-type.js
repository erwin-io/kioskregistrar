"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateRequestRequirementDto = exports.CreateRequestRequirementDto = exports.RequestRequirementDto = exports.UpdateRequestTypeDto = exports.RequestTypeDto = void 0;
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
class RequestTypeDto {
    constructor() {
        this.authorizeACopy = false;
        this.isPaymentRequired = false;
    }
}
exports.RequestTypeDto = RequestTypeDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)()
], RequestTypeDto.prototype, "name", void 0);
__decorate([
    (0, class_transformer_1.Transform)(({ obj, key }) => {
        return obj[key].toString();
    }),
    (0, class_validator_1.IsBooleanString)()
], RequestTypeDto.prototype, "authorizeACopy", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumberString)(),
    (0, class_transformer_1.Transform)(({ obj, key }) => {
        return obj[key].toString();
    })
], RequestTypeDto.prototype, "fee", void 0);
__decorate([
    (0, class_transformer_1.Transform)(({ obj, key }) => {
        return obj[key].toString();
    }),
    (0, class_validator_1.IsBooleanString)()
], RequestTypeDto.prototype, "isPaymentRequired", void 0);
class UpdateRequestTypeDto extends RequestTypeDto {
}
exports.UpdateRequestTypeDto = UpdateRequestTypeDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)()
], UpdateRequestTypeDto.prototype, "requestTypeId", void 0);
class RequestRequirementDto {
    constructor() {
        this.requireToSubmitProof = false;
    }
}
exports.RequestRequirementDto = RequestRequirementDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)()
], RequestRequirementDto.prototype, "name", void 0);
__decorate([
    (0, class_transformer_1.Transform)(({ obj, key }) => {
        return obj[key].toString();
    }),
    (0, class_validator_1.IsBooleanString)()
], RequestRequirementDto.prototype, "requireToSubmitProof", void 0);
class CreateRequestRequirementDto extends RequestRequirementDto {
}
exports.CreateRequestRequirementDto = CreateRequestRequirementDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)()
], CreateRequestRequirementDto.prototype, "requestTypeId", void 0);
class UpdateRequestRequirementDto extends RequestRequirementDto {
}
exports.UpdateRequestRequirementDto = UpdateRequestRequirementDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)()
], UpdateRequestRequirementDto.prototype, "requestRequirementsId", void 0);
