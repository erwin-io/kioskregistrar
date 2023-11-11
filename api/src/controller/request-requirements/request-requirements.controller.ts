import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { UpdateRequestRequirementDto } from "src/core/dto/request-type/request-type-update.dto";
import { CreateRequestRequirementDto } from "src/core/dto/request-type/request-type.dto";
import { ApiResponseModel } from "src/core/models/api-response.model";
import { RequestRequirements } from "src/db/entities/RequestRequirements";
import { RequestRequirementsService } from "src/services/request-requirements.service";

@ApiTags("requestRequirements")
@Controller("requestRequirements")
export class RequestRequirementsController {
  constructor(
    private readonly requestRequirementsService: RequestRequirementsService
  ) {}
  @Get("/findByRequestType/:requestTypeId")
  //   @UseGuards(JwtAuthGuard)
  async getAdminDetails(@Param("requestTypeId") requestTypeId: string) {
    const res = {} as ApiResponseModel<RequestRequirements[]>;
    try {
      res.data = await this.requestRequirementsService.getByRequestTypeId(
        requestTypeId
      );
      res.success = true;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }

  @Get("/:requestRequirementsId")
  //   @UseGuards(JwtAuthGuard)
  async getById(@Param("requestRequirementsId") requestRequirementsId: string) {
    const res = {} as ApiResponseModel<RequestRequirements>;
    try {
      res.data = await this.requestRequirementsService.getById(
        requestRequirementsId
      );
      res.success = true;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }
  @Post("/")
  //   @UseGuards(JwtAuthGuard)
  async create(@Body() dto: CreateRequestRequirementDto) {
    const res = {} as ApiResponseModel<RequestRequirements>;
    try {
      res.data = await this.requestRequirementsService.create(dto);
      res.success = true;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }

  @Put("/:requestRequirementsId")
  //   @UseGuards(JwtAuthGuard)
  async update(
    @Param("requestRequirementsId") requestRequirementsId: string,
    @Body() dto: UpdateRequestRequirementDto
  ) {
    const res = {} as ApiResponseModel<RequestRequirements>;
    try {
      res.data = await this.requestRequirementsService.update(
        requestRequirementsId,
        dto
      );
      res.success = true;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }

  @Delete("/:requestRequirementsId")
  //   @UseGuards(JwtAuthGuard)
  async delete(@Param("requestRequirementsId") requestRequirementsId: string) {
    const res = {} as ApiResponseModel<RequestRequirements>;
    try {
      res.data = await this.requestRequirementsService.delete(
        requestRequirementsId
      );
      res.success = true;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }
}
