import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Put,
  Delete,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import {
  SAVING_SUCCESS,
  UPDATE_SUCCESS,
  DELETE_SUCCESS,
} from "src/common/constant/api-response.constant";
import { UpdateCourseDto } from "src/core/dto/course/course-update.dto";
import { CourseDto } from "src/core/dto/course/course.dto";
import { PaginationParamsDto } from "src/core/dto/pagination-params.dto";
import { ApiResponseModel } from "src/core/models/api-response.model";
import { Courses } from "src/db/entities/Courses";
import { CoursesService } from "src/services/courses.service";

@ApiTags("courses")
@Controller("courses")
export class CourseController {
  constructor(private readonly courseService: CoursesService) {}

  @Get("/:courseId")
  //   @UseGuards(JwtAuthGuard)
  async getById(@Param("courseId") courseId: string) {
    const res = {} as ApiResponseModel<Courses>;
    try {
      res.data = await this.courseService.getById(courseId);
      res.success = true;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }

  @Get("")
  //   @UseGuards(JwtAuthGuard)
  async getAll() {
    const res = {} as ApiResponseModel<Courses[]>;
    try {
      res.data = await this.courseService.getAll();
      res.success = true;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }

  @Post("")
  //   @UseGuards(JwtAuthGuard)
  async create(@Body() courseDto: CourseDto) {
    const res: ApiResponseModel<Courses> = {} as any;
    try {
      res.data = await this.courseService.create(courseDto);
      res.success = true;
      res.message = `Course ${SAVING_SUCCESS}`;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }

  @Put("/:courseId")
  //   @UseGuards(JwtAuthGuard)
  async update(
    @Param("courseId") courseId: string,
    @Body() dto: UpdateCourseDto
  ) {
    const res: ApiResponseModel<Courses> = {} as any;
    try {
      res.data = await this.courseService.update(courseId, dto);
      res.success = true;
      res.message = `Course ${UPDATE_SUCCESS}`;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }

  @Delete("/:courseId")
  //   @UseGuards(JwtAuthGuard)
  async delete(@Param("courseId") courseId: string) {
    const res: ApiResponseModel<Courses> = {} as any;
    try {
      res.data = await this.courseService.delete(courseId);
      res.success = true;
      res.message = `Course ${DELETE_SUCCESS}`;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }
}
