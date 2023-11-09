"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
/** source/server.ts */
const http = __importStar(require("http"));
const express = require("express");
const path = __importStar(require("path"));
const dotenv = __importStar(require("dotenv"));
const typeorm_1 = require("typeorm");
const typeOrmConfig = __importStar(require("../src/db/typeorm"));
const users_1 = require("../src/controllers/users");
const auth_1 = require("../src/controllers/auth");
const request_type_1 = require("../src/controllers/request-type");
const request_requirements_1 = require("./controllers/request-requirements");
const request_1 = require("./controllers/request");
const app = express();
const cors = require('cors');
app.use(cors({
    origin: "*",
}));
// Parsing the env file.
if (!process.env.NODE_ENV) {
    dotenv.config({ path: path.resolve(__dirname, "./envs/development.env") });
}
/** Parse the request */
app.use(express.urlencoded({ extended: false }));
/** Takes care of JSON data */
app.use(express.json());
const dbConfig = typeOrmConfig.createConfig();
(0, typeorm_1.createConnection)(dbConfig)
    .then((connection) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Connected to DB");
}))
    .catch((error) => console.log("TypeORM connection error: ", error));
/** Routes */
const routePrefix = "api/";
app.use("/" + routePrefix + "auth", auth_1.authRouter);
app.use("/" + routePrefix + "users", users_1.usersRouter);
app.use("/" + routePrefix + "request", request_1.requestRouter);
app.use("/" + routePrefix + "requestType", request_type_1.requestTypeRouter);
app.use("/" + routePrefix + "requestRequirements", request_requirements_1.requestRequirementsRouter);
/** Error handling */
app.use((req, res, next) => {
    const error = new Error("not found");
    return res.status(404).json({
        message: error.message,
    });
});
/** Server */
const httpServer = http.createServer(app);
const PORT = (_a = process.env.PORT) !== null && _a !== void 0 ? _a : 3000;
httpServer.listen(PORT, () => console.log(`The server is running on port ${PORT} use this link http://localhost:${PORT}/${routePrefix}`));
