import { Module } from "@nestjs/common";
import { RequestRequirementsController } from "./request-requirements.controller";
import { RequestRequirements } from "src/db/entities/RequestRequirements";
import { TypeOrmModule } from "@nestjs/typeorm";
import { RequestRequirementsService } from "src/services/request-requirements.service";

@Module({
  imports: [TypeOrmModule.forFeature([RequestRequirements])],
  controllers: [RequestRequirementsController],
  providers: [RequestRequirementsService],
  exports: [RequestRequirementsService],
})
export class RequestRequirementsModule {}
