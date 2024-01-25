import { Module } from "@nestjs/common";
import { DashboardController } from "./dashboard.controller";
import { DashboardService } from "src/services/dashboard.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Request } from "src/db/entities/Request";
import { Member } from "src/db/entities/Member";

@Module({
  imports: [TypeOrmModule.forFeature([Request, Member])],
  controllers: [DashboardController],
  providers: [DashboardService],
  exports: [DashboardService],
})
export class DashboardModule {}
