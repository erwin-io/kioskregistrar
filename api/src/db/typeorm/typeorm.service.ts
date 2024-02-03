import { Admin } from "../entities/Admin";
import { Files } from "../entities/Files";
import { Member } from "../entities/Member";
import { RequestRequirements } from "../entities/RequestRequirements";
import { RequestType } from "../entities/RequestType";
import { SystemConfig } from "../entities/SystemConfig";
import { Users } from "../entities/Users";
import { TypeOrmOptionsFactory, TypeOrmModuleOptions } from "@nestjs/typeorm";
import { ConfigService } from "@nestjs/config";
import { Injectable, Inject } from "@nestjs/common";
import { Request } from "../entities/Request";
import { Notifications } from "../entities/Notifications";
import { SubmittedRequirements } from "../entities/SubmittedRequirements";
import { UserOneSignalSubscription } from "../entities/UserOneSignalSubscription";
import { SupportTicketConvo } from "../entities/SupportTicketConvo";
import { SupportTickets } from "../entities/SupportTickets";
import { Courses } from "../entities/Courses";

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  @Inject(ConfigService)
  private readonly config: ConfigService;

  public createTypeOrmOptions(): TypeOrmModuleOptions {
    const ssl = this.config.get<string>("SSL");
    const config: TypeOrmModuleOptions = {
      type: "postgres",
      host: this.config.get<string>("DATABASE_HOST"),
      port: Number(this.config.get<number>("DATABASE_PORT")),
      database: this.config.get<string>("DATABASE_NAME"),
      username: this.config.get<string>("DATABASE_USER"),
      password: this.config.get<string>("DATABASE_PASSWORD"),
      entities: [
        SystemConfig,
        Users,
        Admin,
        Member,
        Files,
        RequestType,
        RequestRequirements,
        Request,
        Notifications,
        SubmittedRequirements,
        UserOneSignalSubscription,
        SupportTickets,
        SupportTicketConvo,
        Courses
      ],
      synchronize: false, // never use TRUE in production!
      ssl: ssl.toLocaleLowerCase().includes("true"),
      extra: {},
    };
    if (config.ssl) {
      config.extra.ssl = {
        require: true,
        rejectUnauthorized: false,
      };
    }
    return config;
  }
}
