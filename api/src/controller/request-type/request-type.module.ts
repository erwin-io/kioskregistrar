import { Module } from "@nestjs/common";
import { RequestTypeController } from "./request-type.controller";
import { RequestType } from "src/db/entities/RequestType";
import { RequestController } from "../request/request.controller";
import { RequestTypeService } from "src/services/request-type.service";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
  imports: [TypeOrmModule.forFeature([RequestType])],
  controllers: [RequestTypeController],
  providers: [RequestTypeService],
  exports: [RequestTypeService],
})
export class RequestTypeModule {}
