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
import {
  DELETE_SUCCESS,
  SAVING_SUCCESS,
  UPDATE_SUCCESS,
} from "src/common/constant/api-response.constant";
import { PaginationParamsDto } from "src/core/dto/pagination-params.dto";
import { UpdateRequestTypeDto } from "src/core/dto/request-type/request-type-update.dto";
import { RequestTypeDto } from "src/core/dto/request-type/request-type.dto";
import { ApiResponseModel } from "src/core/models/api-response.model";
import { RequestType } from "src/db/entities/RequestType";
import { RequestTypeService } from "src/services/request-type.service";

@ApiTags("requestType")
@Controller("requestType")
export class RequestTypeController {
  constructor(private readonly requestTypeService: RequestTypeService) {}

  @Get("/:requestTypeId")
  //   @UseGuards(JwtAuthGuard)
  async getDetails(@Param("requestTypeId") requestTypeId: string) {
    const res = {} as ApiResponseModel<RequestType>;
    try {
      res.data = await this.requestTypeService.getById(requestTypeId);
      res.success = true;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }

  @Post("/page")
  //   @UseGuards(JwtAuthGuard)
  async getPaginated(@Body() params: PaginationParamsDto) {
    const res: ApiResponseModel<{ results: RequestType[]; total: number }> =
      {} as any;
    try {
      res.data = await this.requestTypeService.getRequestTypePagination(params);
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
  async create(@Body() requestTypeDto: RequestTypeDto) {
    const res: ApiResponseModel<RequestType> = {} as any;
    try {
      res.data = await this.requestTypeService.create(requestTypeDto);
      res.success = true;
      res.message = `Request type ${SAVING_SUCCESS}`;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }

  @Put("/:requestTypeId")
  //   @UseGuards(JwtAuthGuard)
  async update(
    @Param("requestTypeId") requestTypeId: string,
    @Body() dto: UpdateRequestTypeDto
  ) {
    const res: ApiResponseModel<RequestType> = {} as any;
    try {
      res.data = await this.requestTypeService.update(requestTypeId, dto);
      res.success = true;
      res.message = `Request type ${UPDATE_SUCCESS}`;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }

  @Delete("/:requestTypeId")
  //   @UseGuards(JwtAuthGuard)
  async delete(@Param("requestTypeId") requestTypeId: string) {
    const res: ApiResponseModel<RequestType> = {} as any;
    try {
      res.data = await this.requestTypeService.delete(requestTypeId);
      res.success = true;
      res.message = `Request type ${DELETE_SUCCESS}`;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }
}
