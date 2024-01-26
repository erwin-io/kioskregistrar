import { Module } from "@nestjs/common";
import { RequestController } from "./request.controller";
import { RequestService } from "src/services/request.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Request } from "src/db/entities/Request";
import { PusherService } from "src/services/pusher.service";

@Module({
  imports: [TypeOrmModule.forFeature([Request])],
  controllers: [RequestController],
  providers: [RequestService, PusherService],
  exports: [RequestService, PusherService],
})
export class RequestModule {}
