import { Body, Controller, Get, Param, Post, Put } from "@nestjs/common";
import { ApiParam, ApiTags } from "@nestjs/swagger";
import { ApiResponseModel } from "src/core/models/api-response.model";
import { DashboardService } from "src/services/dashboard.service";
import { Admin } from "typeorm";
import { Request } from "src/db/entities/Request";
import {
  SAVING_SUCCESS,
  UPDATE_SUCCESS,
} from "src/common/constant/api-response.constant";
import { RequestType } from "src/db/entities/RequestType";

@ApiTags("dashboard")
@Controller("dashboard")
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get("getMemberDashboard/:memberId/")
  //   @UseGuards(JwtAuthGuard)
  async getMemberDashboard(@Param("memberId") memberId: string) {
    const res = {} as ApiResponseModel<any>;
    try {
      res.data = await this.dashboardService.getMemberDashboard(memberId);
      res.success = true;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }
}
