"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MarkRequestAsClosedDto = exports.MarkRequestAsCompletedDto = exports.MarkRequestAsProcessedDto = exports.MarkRequestAsPaidDto = exports.AssignRequestDto = exports.UpdateRequestStatusDto = exports.UpdateRequestDescriptionDto = exports.RequestDto = void 0;
const class_validator_1 = require("class-validator");
class RequestDto {
}
exports.RequestDto = RequestDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)()
], RequestDto.prototype, "requestedById", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)()
], RequestDto.prototype, "requestTypeId", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)()
], RequestDto.prototype, "description", void 0);
class UpdateRequestDescriptionDto {
}
exports.UpdateRequestDescriptionDto = UpdateRequestDescriptionDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)()
], UpdateRequestDescriptionDto.prototype, "requestNo", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)()
], UpdateRequestDescriptionDto.prototype, "description", void 0);
class UpdateRequestStatusDto {
}
exports.UpdateRequestStatusDto = UpdateRequestStatusDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)()
], UpdateRequestStatusDto.prototype, "requestNo", void 0);
class AssignRequestDto extends UpdateRequestStatusDto {
}
exports.AssignRequestDto = AssignRequestDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)()
], AssignRequestDto.prototype, "assignedAdminId", void 0);
class MarkRequestAsPaidDto extends UpdateRequestStatusDto {
}
exports.MarkRequestAsPaidDto = MarkRequestAsPaidDto;
class MarkRequestAsProcessedDto extends UpdateRequestStatusDto {
}
exports.MarkRequestAsProcessedDto = MarkRequestAsProcessedDto;
class MarkRequestAsCompletedDto extends UpdateRequestStatusDto {
}
exports.MarkRequestAsCompletedDto = MarkRequestAsCompletedDto;
class MarkRequestAsClosedDto extends UpdateRequestStatusDto {
}
exports.MarkRequestAsClosedDto = MarkRequestAsClosedDto;
