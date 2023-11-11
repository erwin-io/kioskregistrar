"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const request_requirements_controller_1 = require("./request-requirements.controller");
describe('RequestRequirementsController', () => {
    let controller;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            controllers: [request_requirements_controller_1.RequestRequirementsController],
        }).compile();
        controller = module.get(request_requirements_controller_1.RequestRequirementsController);
    });
    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
//# sourceMappingURL=request-requirements.controller.spec.js.map