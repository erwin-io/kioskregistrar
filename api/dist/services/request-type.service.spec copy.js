"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const request_type_service_1 = require("./request-type.service");
describe('RequestTypeService', () => {
    let service;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            providers: [request_type_service_1.RequestTypeService],
        }).compile();
        service = module.get(request_type_service_1.RequestTypeService);
    });
    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
//# sourceMappingURL=request-type.service.spec%20copy.js.map