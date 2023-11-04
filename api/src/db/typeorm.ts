import "reflect-metadata";
import { ConnectionOptions } from "typeorm";
import { SystemConfig } from "../../src/db/entities/SystemConfig";
import { Users } from "../../src/db/entities/Users";
import { Admin } from "../../src/db/entities/Admin";
import { Member } from "../../src/db/entities/Member";
import { Files } from "../../src/db/entities/Files";
import { RequestType } from "./entities/RequestType";
import { RequestRequirements } from "./entities/RequestRequirements";
import { Request } from "./entities/Request";

export function createConfig(): ConnectionOptions {
   const ssl = process.env.SSL;
  const config: ConnectionOptions = {
    type: "postgres",
    host: process.env.DATABASE_HOST,
    port: Number(process.env.DATABASE_PORT),
    database: process.env.DATABASE_NAME,
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    entities: [SystemConfig, Users, Admin, Member, Files, RequestType, RequestRequirements, Request],
    synchronize: false,
    ssl: ssl.toLocaleLowerCase().includes("true"),
    extra: {
    }
  };
  if(config.ssl) {
    config.extra.ssl = {
      require: true,
      rejectUnauthorized: false,
    }
  }
  return config;
}
