import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsNotEmpty, IsOptional } from "class-validator";
import { PaginationParamsDto } from "../pagination-params.dto";

export class RequestPaginationParamsDto extends PaginationParamsDto {
  @ApiProperty({
    default: ""
  })
  @IsOptional()
  @Transform(({ obj, key }) => {
    return obj[key]?.toString();
  })
  assignedAdminId: string;
}
