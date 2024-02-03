import { UpdateCourseDto } from "src/core/dto/course/course-update.dto";
import { CourseDto } from "src/core/dto/course/course.dto";
import { ApiResponseModel } from "src/core/models/api-response.model";
import { Courses } from "src/db/entities/Courses";
import { CoursesService } from "src/services/courses.service";
export declare class CourseController {
    private readonly courseService;
    constructor(courseService: CoursesService);
    getById(courseId: string): Promise<ApiResponseModel<Courses>>;
    getAll(): Promise<ApiResponseModel<Courses[]>>;
    create(courseDto: CourseDto): Promise<ApiResponseModel<Courses>>;
    update(courseId: string, dto: UpdateCourseDto): Promise<ApiResponseModel<Courses>>;
    delete(courseId: string): Promise<ApiResponseModel<Courses>>;
}
