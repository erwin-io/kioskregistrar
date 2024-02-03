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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CoursesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const Courses_1 = require("../db/entities/Courses");
const typeorm_2 = require("typeorm");
let CoursesService = class CoursesService {
    constructor(courseRepo) {
        this.courseRepo = courseRepo;
    }
    async getAll() {
        return await this.courseRepo.find();
    }
    async getById(courseId) {
        return await this.courseRepo.findOneBy({ courseId });
    }
    async create({ courseName }) {
        return await this.courseRepo.manager.transaction(async (entityManager) => {
            const course = new Courses_1.Courses();
            course.courseName = courseName;
            return entityManager.save(Courses_1.Courses, course);
        });
    }
    async update(courseId, dto) {
        return await this.courseRepo.manager.transaction(async (entityManager) => {
            const course = await entityManager.findOne(Courses_1.Courses, {
                where: {
                    courseId,
                },
            });
            if (!course) {
                throw Error("Course not found!");
            }
            course.courseName = dto.courseName;
            return await entityManager.save(Courses_1.Courses, course);
        });
    }
    async delete(courseId) {
        return await this.courseRepo.manager.transaction(async (entityManager) => {
            const course = await entityManager.findOne(Courses_1.Courses, {
                where: {
                    courseId,
                },
            });
            if (!course) {
                throw Error("Course not found!");
            }
            await entityManager.delete(Courses_1.Courses, course);
            return course;
        });
    }
};
CoursesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(Courses_1.Courses)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], CoursesService);
exports.CoursesService = CoursesService;
//# sourceMappingURL=courses.service.js.map