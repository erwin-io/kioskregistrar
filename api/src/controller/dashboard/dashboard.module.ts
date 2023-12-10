import { Module } from "@nestjs/common";
import { DashboardController } from "./dashboard.controller";
import { DashboardService } from "src/services/dashboard.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Request } from "src/db/entities/Request";

@Module({
  imports: [TypeOrmModule.forFeature([Request])],
  controllers: [DashboardController],
  providers: [DashboardService],
  exports: [DashboardService],
})
export class DashboardModule {}
