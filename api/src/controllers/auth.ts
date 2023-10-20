/** source/controllers/posts.ts */
import { Router, Request, Response, NextFunction } from "express";
import axios, { AxiosResponse } from "axios";
import { Users } from "../db/entities/Users";
import { In, getManager, getRepository } from "typeorm";
import { Roles } from "../db/entities/Roles";
import { CONST_USERTYPE } from "../utils/constant";
import { compare, hash } from "../utils/utils";
var cors = require('cors')

export const authRouter = Router();

authRouter.post("/login/admin", async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (req.body && 
        req.body.mobileNumber && 
        req.body.password) {
      const { mobileNumber, password } = req.body;
      let user: Users = await getRepository(Users).findOne({
        where: {
          mobileNumber,
          userType: "ADMIN",
          active: true
        },
      });
      if(user && await compare(user.password, password)) {
        delete user.password;
        return res.status(200).json({
          data: user,
          success: true
        });
      } else {
        return res.status(404).json({
          message: "Not found!",
        });
      }
    } else {
      return res.status(404).json({
        message: "Bad Request!",
      });
    }
  } catch (ex) {
    return res.status(500).json({
      message: ex.message,
    });
  }
});

authRouter.post("/login/member", async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (req.body && 
        req.body.mobileNumber && 
        req.body.password) {
      const { mobileNumber, password } = req.body;
      let user: Users = await getRepository(Users).findOne({
        where: {
          mobileNumber,
          userType: "MEMBER",
          active: true
        },
      });
      if(user && await compare(user.password, password)) {
        delete user.password;
        return res.status(200).json({
          data: user,
          success: true
        });
      } else {
        return res.status(404).json({
          message: "Not found!",
        });
      }
    } else {
      return res.status(404).json({
        message: "Bad Request!",
      });
    }
  } catch (ex) {
    return res.status(500).json({
      message: ex.message,
    });
  }
});

authRouter.post("/registerMember", async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (req.body && 
        req.body.name && 
        req.body.mobileNumber && 
        req.body.password && 
        req.body.userType &&
        ( 
          CONST_USERTYPE.some(x=> req.body.userType.toString().toUpperCase() === x.toUpperCase())
        )) {
      const { name, mobileNumber, password, userType } = req.body;
      let user = new Users();
      user.name = name;
      user.mobileNumber = mobileNumber;
      user.password = await hash(password);
      user.userType = userType.toString().toUpperCase();
      user.roles = [];
      user = await getManager().transaction(
        async (transactionalEntityManager) => {
          return await transactionalEntityManager.save(user);
        },
      );
      delete user.password;
      return res.status(200).json({
        data: user,
        success: true
      });
    } else {
      return res.status(404).json({
        message: "Bad Request!",
      });
    }
  } catch (ex) {
    return res.status(500).json({
      message: ex.message,
    });
  }
});

