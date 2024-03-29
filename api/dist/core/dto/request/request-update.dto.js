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
exports.RejectRequestDto = exports.CancelRequestDto = exports.MarkRequestAsClosedDto = exports.MarkRequestAsCompletedDto = exports.MarkRequestAsProcessedDto = exports.MarkRequestAsPaidDto = exports.AssignRequestDto = exports.UpdateRequestStatusDto = exports.UpdateRequestDescriptionDto = exports.UpdateRequestDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const request_dto_1 = require("./request.dto");
class UpdateRequestDto {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], UpdateRequestDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        isArray: true,
        type: request_dto_1.RequestRequirementsDto
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_transformer_1.Type)(() => request_dto_1.RequestRequirementsDto),
    (0, class_validator_1.ValidateNested)(),
    __metadata("design:type", Array)
], UpdateRequestDto.prototype, "requirements", void 0);
exports.UpdateRequestDto = UpdateRequestDto;
class UpdateRequestDescriptionDto {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], UpdateRequestDescriptionDto.prototype, "description", void 0);
exports.UpdateRequestDescriptionDto = UpdateRequestDescriptionDto;
class UpdateRequestStatusDto {
}
exports.UpdateRequestStatusDto = UpdateRequestStatusDto;
class AssignRequestDto extends UpdateRequestStatusDto {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], AssignRequestDto.prototype, "assignedAdminId", void 0);
exports.AssignRequestDto = AssignRequestDto;
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
class CancelRequestDto extends UpdateRequestStatusDto {
}
exports.CancelRequestDto = CancelRequestDto;
class RejectRequestDto extends UpdateRequestStatusDto {
}
exports.RejectRequestDto = RejectRequestDto;
//# sourceMappingURL=request-update.dto.js.map