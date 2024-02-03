"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const course_controller_1 = require("./course.controller");
describe("CourseController", () => {
    let controller;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            controllers: [course_controller_1.CourseController],
        }).compile();
        controller = module.get(course_controller_1.CourseController);
    });
    it("should be defined", () => {
        expect(controller).toBeDefined();
    });
});
//# sourceMappingURL=course.controller.spec.js.map