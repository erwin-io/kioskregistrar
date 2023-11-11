import { Module } from "@nestjs/common";
import { RequestController } from "./request.controller";
import { RequestService } from "src/services/request.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Request } from "src/db/entities/Request";

@Module({
  imports: [TypeOrmModule.forFeature([Request])],
  controllers: [RequestController],
  providers: [RequestService],
  exports: [RequestService],
})
export class RequestModule {}
