"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validatorDto = void 0;
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
/**
 *
 * Validate the payload will be sending or receiving, make sure the data is suitable
 *
 * @param dto The DTO object to validate
 * @param obj The object recieved from response body
 *
 * @example
 * ```ts
 *  await validatorDto(EmployeeDTO, response.data.employee);
 *
 * ```
 */
const validatorDto = (dto, obj) => __awaiter(void 0, void 0, void 0, function* () {
    // tranform the literal object to class object
    const objInstance = (0, class_transformer_1.plainToClass)(dto, obj);
    // validating and check the errors, throw the errors if exist
    const errors = yield (0, class_validator_1.validate)(objInstance);
    // errors is an array of validation errors
    if (errors.length > 0 && errors[0]["constraints"] && Object.keys(errors[0]["constraints"]).length > 0 && Object.keys(errors[0]["constraints"])[0]) {
        throw new Error(errors[0]["constraints"][Object.keys(errors[0]["constraints"])[0]]);
    }
    else if (errors.length > 0 && errors[0]["children"].length > 0 && errors[0]["children"][0]["constraints"] && Object.keys(errors[0]["children"][0]["constraints"]).length > 0 && Object.keys(errors[0]["children"][0]["constraints"])[0]) {
        throw new Error(errors[0]["children"][0]["constraints"][Object.keys(errors[0]["children"][0]["constraints"])[0]]);
    }
});
exports.validatorDto = validatorDto;
