import "reflect-metadata";
import { ConnectionOptions } from "typeorm";
import { SystemConfig } from "../../src/db/entities/SystemConfig";
import { Users } from "../../src/db/entities/Users";
import { Roles } from "../../src/db/entities/Roles";

export function createConfig(): ConnectionOptions {
   const ssl = process.env.SSL;
  const config: ConnectionOptions = {
    type: "postgres",
    host: process.env.DATABASE_HOST,
    port: Number(process.env.DATABASE_PORT),
    database: process.env.DATABASE_NAME,
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    entities: [SystemConfig, Users, Roles],
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
