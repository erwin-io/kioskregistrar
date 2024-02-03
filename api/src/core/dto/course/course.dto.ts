import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";
export class CourseDto {
  @ApiProperty()
  @IsNotEmpty()
  courseName: string;
}
