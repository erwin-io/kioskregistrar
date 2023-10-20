/** source/server.ts */
import * as http from "http";
import { Express, NextFunction, Request, Response } from "express";
import express = require("express");
import * as path from "path";
import * as dotenv from "dotenv";
import { createConnection } from "typeorm";
import * as typeOrmConfig from "./db/typeorm";
import { usersRouter } from "./controllers/users";
import { rolesRouter } from "./controllers/roles";
import { authRouter } from "./controllers/auth";

const app: Express = express();

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

createConnection(dbConfig)
  .then(async (connection) => {
    console.log("Connected to DB");
  })
  .catch((error) => console.log("TypeORM connection error: ", error));


/** Routes */
const routePrefix = "api/";
app.use("/" + routePrefix + "auth", authRouter);
app.use("/" + routePrefix + "users", usersRouter);
app.use("/" + routePrefix + "roles", rolesRouter);
/** Error handling */
app.use((req, res, next) => {
  const error = new Error("not found");
  return res.status(404).json({
    message: error.message,
  });
});

/** Server */
const httpServer = http.createServer(app);
const PORT: any = process.env.PORT ?? 3000;
httpServer.listen(PORT, () =>
  console.log(
    `The server is running on port ${PORT} use this link http://localhost:${PORT}/${routePrefix}`,
  ),
);
