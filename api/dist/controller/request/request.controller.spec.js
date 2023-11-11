"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const request_controller_1 = require("./request.controller");
describe('RequestController', () => {
    let controller;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            controllers: [request_controller_1.RequestController],
        }).compile();
        controller = module.get(request_controller_1.RequestController);
    });
    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
//# sourceMappingURL=request.controller.spec.js.map