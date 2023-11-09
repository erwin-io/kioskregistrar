"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createConfig = void 0;
require("reflect-metadata");
const SystemConfig_1 = require("./entities/SystemConfig");
const Users_1 = require("./entities/Users");
const Admin_1 = require("./entities/Admin");
const Member_1 = require("./entities/Member");
const Files_1 = require("./entities/Files");
const RequestType_1 = require("./entities/RequestType");
const RequestRequirements_1 = require("./entities/RequestRequirements");
const Request_1 = require("./entities/Request");
function createConfig() {
    const ssl = process.env.SSL;
    const config = {
        type: "postgres",
        host: process.env.DATABASE_HOST,
        port: Number(process.env.DATABASE_PORT),
        database: process.env.DATABASE_NAME,
        username: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD,
        entities: [SystemConfig_1.SystemConfig, Users_1.Users, Admin_1.Admin, Member_1.Member, Files_1.Files, RequestType_1.RequestType, RequestRequirements_1.RequestRequirements, Request_1.Request],
        synchronize: false,
        ssl: ssl.toLocaleLowerCase().includes("true"),
        extra: {}
    };
    if (config.ssl) {
        config.extra.ssl = {
            require: true,
            rejectUnauthorized: false,
        };
    }
    return config;
}
exports.createConfig = createConfig;
