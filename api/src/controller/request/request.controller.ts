import { Body, Controller, Get, Param, Post, Put } from "@nestjs/common";
import { ApiParam, ApiTags } from "@nestjs/swagger";
import { RequestPaginationParamsDto } from "src/core/dto/request/request-pagination-params.dto";
import { ApiResponseModel } from "src/core/models/api-response.model";
import { RequestService } from "src/services/request.service";
import { Admin } from "typeorm";
import { Request } from "src/db/entities/Request";
import {
  SAVING_SUCCESS,
  UPDATE_SUCCESS,
} from "src/common/constant/api-response.constant";
import { RequestDto } from "src/core/dto/request/request.dto";
import {
  AssignRequestDto,
  CancelRequestDto,
  MarkRequestAsClosedDto,
  MarkRequestAsCompletedDto,
  MarkRequestAsPaidDto,
  MarkRequestAsProcessedDto,
  UpdateRequestDescriptionDto,
  UpdateRequestDto,
} from "src/core/dto/request/request-update.dto";
import { RequestType } from "src/db/entities/RequestType";

@ApiTags("request")
@Controller("request")
export class RequestController {
  constructor(private readonly requestService: RequestService) {}
  @Post("/page/")
  //   @UseGuards(JwtAuthGuard)
  async getPaginatedAdminUsers(@Body() params: RequestPaginationParamsDto) {
    const res: ApiResponseModel<{ results: Request[]; total: number }> =
      {} as any;
    try {
      res.data = await this.requestService.getRequestPagination(params);
      res.success = true;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }

  @Get("/:requestNo")
  //   @UseGuards(JwtAuthGuard)
  async getAdminDetails(@Param("requestNo") requestNo: string) {
    const res = {} as ApiResponseModel<Request>;
    try {
      res.data = await this.requestService.getByRequestNo(requestNo);
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
  async create(@Body() requestDto: RequestDto) {
    const res: ApiResponseModel<Request> = {} as any;
    try {
      res.data = await this.requestService.create(requestDto);
      res.success = true;
      res.message = `Request ${SAVING_SUCCESS}`;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }

  @Put("/:requestNo")
  //   @UseGuards(JwtAuthGuard)
  async update(
    @Param("requestNo") requestNo: string,
    @Body() dto: UpdateRequestDto
  ) {
    const res: ApiResponseModel<Request> = {} as any;
    try {
      res.data = await this.requestService.update(requestNo, dto);
      res.success = true;
      res.message = `Request ${UPDATE_SUCCESS}`;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }

  @Put("/:requestNo/updateDescription")
  //   @UseGuards(JwtAuthGuard)
  async updateDescription(
    @Param("requestNo") requestNo: string,
    @Body() dto: UpdateRequestDescriptionDto
  ) {
    const res: ApiResponseModel<Request> = {} as any;
    try {
      res.data = await this.requestService.updateDescription(requestNo, dto);
      res.success = true;
      res.message = `Request ${UPDATE_SUCCESS}`;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }

  @Put("/:requestNo/assignRequest")
  //   @UseGuards(JwtAuthGuard)
  async assignRequest(
    @Param("requestNo") requestNo: string,
    @Body() dto: AssignRequestDto
  ) {
    const res: ApiResponseModel<Request> = {} as any;
    try {
      res.data = await this.requestService.assignRequest(requestNo, dto);
      res.success = true;
      res.message = `Request ${UPDATE_SUCCESS}`;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }

  @Put("/:requestNo/payRequest")
  //   @UseGuards(JwtAuthGuard)
  async payRequest(
    @Param("requestNo") requestNo: string,
    @Body() dto: MarkRequestAsPaidDto
  ) {
    const res: ApiResponseModel<Request> = {} as any;
    try {
      res.data = await this.requestService.payRequest(requestNo, dto);
      res.success = true;
      res.message = `Request ${UPDATE_SUCCESS}`;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }

  @Put("/:requestNo/markAsToComplete")
  //   @UseGuards(JwtAuthGuard)
  async markAsToComplete(
    @Param("requestNo") requestNo: string,
    @Body() dto: MarkRequestAsProcessedDto
  ) {
    const res: ApiResponseModel<Request> = {} as any;
    try {
      res.data = await this.requestService.markAsToComplete(requestNo, dto);
      res.success = true;
      res.message = `Request ${UPDATE_SUCCESS}`;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }

  @Put("/:requestNo/completeRequest")
  //   @UseGuards(JwtAuthGuard)
  async completeRequest(
    @Param("requestNo") requestNo: string,
    @Body() dto: MarkRequestAsCompletedDto
  ) {
    const res: ApiResponseModel<Request> = {} as any;
    try {
      res.data = await this.requestService.completeRequest(requestNo, dto);
      res.success = true;
      res.message = `Request ${UPDATE_SUCCESS}`;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }

  @Put("/:requestNo/closeRequest")
  //   @UseGuards(JwtAuthGuard)
  async closeRequest(
    @Param("requestNo") requestNo: string,
    @Body() dto: MarkRequestAsClosedDto
  ) {
    const res: ApiResponseModel<Request> = {} as any;
    try {
      res.data = await this.requestService.closeRequest(requestNo, dto);
      res.success = true;
      res.message = `Request ${UPDATE_SUCCESS}`;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }

  @Put("/:requestNo/cancelRequest")
  //   @UseGuards(JwtAuthGuard)
  async cancelRequest(
    @Param("requestNo") requestNo: string,
    @Body() dto: CancelRequestDto
  ) {
    const res: ApiResponseModel<Request> = {} as any;
    try {
      res.data = await this.requestService.cancelRequest(requestNo, dto);
      res.success = true;
      res.message = `Request ${UPDATE_SUCCESS}`;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }
}
