import { Module } from "@nestjs/common";
import { RequestController } from "./request.controller";
import { RequestService } from "src/services/request.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Request } from "src/db/entities/Request";
import { PusherService } from "src/services/pusher.service";
import { FirebaseProviderModule } from "src/core/provider/firebase/firebase-provider.module";
import { HttpModule } from "@nestjs/axios";
import { OneSignalNotificationService } from "src/services/one-signal-notification.service";

@Module({
  imports: [
    FirebaseProviderModule,
    HttpModule,
    TypeOrmModule.forFeature([Request]),
  ],
  controllers: [RequestController],
  providers: [RequestService, PusherService, OneSignalNotificationService],
  exports: [RequestService, PusherService, OneSignalNotificationService],
})
export class RequestModule {}
