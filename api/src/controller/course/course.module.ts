import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Courses } from "src/db/entities/Courses";
import { CourseController } from "./course.controller";
import { CoursesService } from "src/services/courses.service";

@Module({
  imports: [TypeOrmModule.forFeature([Courses])],
  controllers: [CourseController],
  providers: [CoursesService],
  exports: [CoursesService],
})
export class CourseModule {}
