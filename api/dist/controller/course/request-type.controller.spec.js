"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const request_type_controller_1 = require("./request-type.controller");
describe('RequestTypeController', () => {
    let controller;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            controllers: [request_type_controller_1.RequestTypeController],
        }).compile();
        controller = module.get(request_type_controller_1.RequestTypeController);
    });
    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
//# sourceMappingURL=request-type.controller.spec.js.map