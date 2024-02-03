import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("Courses_pkey", ["courseId"], { unique: true })
@Entity("Courses", { schema: "dbo" })
export class Courses {
  @PrimaryGeneratedColumn({ type: "bigint", name: "CourseId" })
  courseId: string;

  @Column("character varying", { name: "CourseName" })
  courseName: string;
}
