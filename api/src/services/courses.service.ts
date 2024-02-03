import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { REQUEST_TYPE_ERROR_NOT_FOUND } from "src/common/constant/request-type.constant";
import { columnDefToTypeORMCondition } from "src/common/utils/utils";
import { UpdateCourseDto } from "src/core/dto/course/course-update.dto";
import { CourseDto } from "src/core/dto/course/course.dto";
import { Courses } from "src/db/entities/Courses";
import { RequestRequirements } from "src/db/entities/RequestRequirements";
import { Repository } from "typeorm";

@Injectable()
export class CoursesService {
  constructor(
    @InjectRepository(Courses)
    private readonly courseRepo: Repository<Courses>
  ) {}

  async getAll() {
    return await this.courseRepo.find();
  }

  async getById(courseId) {
    return await this.courseRepo.findOneBy({ courseId });
  }

  async create({ courseName }) {
    return await this.courseRepo.manager.transaction(async (entityManager) => {
      const course = new Courses();
      course.courseName = courseName;
      return entityManager.save(Courses, course);
    });
  }

  async update(courseId, dto: UpdateCourseDto) {
    return await this.courseRepo.manager.transaction(async (entityManager) => {
      const course = await entityManager.findOne(Courses, {
        where: {
          courseId,
        },
      });
      if (!course) {
        throw Error("Course not found!");
      }
      course.courseName = dto.courseName;
      return await entityManager.save(Courses, course);
    });
  }

  async delete(courseId) {
    return await this.courseRepo.manager.transaction(async (entityManager) => {
      const course = await entityManager.findOne(Courses, {
        where: {
          courseId,
        },
      });
      if (!course) {
        throw Error("Course not found!");
      }
      await entityManager.delete(Courses, course);
      return course;
    });
  }
}
