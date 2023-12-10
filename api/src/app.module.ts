import { Module } from "@nestjs/common";
import { AppService } from "./app.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TypeOrmConfigService } from "./db/typeorm/typeorm.service";
import { ConfigModule } from "@nestjs/config";
import { AuthModule } from "./controller/auth/auth.module";
import { FirebaseProviderModule } from "./core/provider/firebase/firebase-provider.module";
import * as Joi from "@hapi/joi";
import { getEnvPath } from "./common/utils/utils";
import { UsersModule } from "./controller/users/users.module";
import { RequestModule } from "./controller/request/request.module";
import { RequestTypeModule } from "./controller/request-type/request-type.module";
import { RequestRequirementsModule } from "./controller/request-requirements/request-requirements.module";
import { DashboardModule } from "./controller/dashboard/dashboard.module";
const envFilePath: string = getEnvPath(`${__dirname}/common/envs`);
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath,
      isGlobal: true,
      validationSchema: Joi.object({
        UPLOADED_FILES_DESTINATION: Joi.string().required(),
      }),
    }),
    TypeOrmModule.forRootAsync({ useClass: TypeOrmConfigService }),
    AuthModule,
    UsersModule,
    FirebaseProviderModule,
    RequestModule,
    RequestTypeModule,
    RequestRequirementsModule,
    DashboardModule,
  ],
  providers: [AppService],
  controllers: [],
})
export class AppModule {}
