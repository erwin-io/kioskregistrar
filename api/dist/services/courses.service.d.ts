import { UpdateCourseDto } from "src/core/dto/course/course-update.dto";
import { Courses } from "src/db/entities/Courses";
import { Repository } from "typeorm";
export declare class CoursesService {
    private readonly courseRepo;
    constructor(courseRepo: Repository<Courses>);
    getAll(): Promise<Courses[]>;
    getById(courseId: any): Promise<Courses>;
    create({ courseName }: {
        courseName: any;
    }): Promise<Courses>;
    update(courseId: any, dto: UpdateCourseDto): Promise<Courses>;
    delete(courseId: any): Promise<Courses>;
}
