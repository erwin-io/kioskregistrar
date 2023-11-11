"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const request_requirements_service_1 = require("./request-requirements.service");
describe('RequestRequirementsService', () => {
    let service;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            providers: [request_requirements_service_1.RequestRequirementsService],
        }).compile();
        service = module.get(request_requirements_service_1.RequestRequirementsService);
    });
    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
//# sourceMappingURL=request-requirements.service.spec.js.map