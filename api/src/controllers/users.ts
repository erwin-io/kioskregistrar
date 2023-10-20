/** source/controllers/posts.ts */
import { Router, Request, Response, NextFunction } from "express";
import axios, { AxiosResponse } from "axios";
import { Users } from "../../src/db/entities/Users";
import { In, getManager, getRepository } from "typeorm";
import { Roles } from "../../src/db/entities/Roles";
import { CONST_USERTYPE } from "../utils/constant";
import { compare, hash } from "../utils/utils";
var cors = require('cors')

export const usersRouter = Router();


usersRouter.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    let users: Users[] = await getRepository(Users).find({
      where: {
        active: true
      }
    });
    return res.status(200).json({
      data: users.map(x=> {
        delete x.password;
        return x;
      }),
      success: true
    });
  } catch (ex) {
    return res.status(500).json({
      message: ex.message,
    });
  }
});

usersRouter.get("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    let user: Users = await getRepository(Users).findOne({
      where: {
        userId: id,
        active: true
      },
    });
    if(user) {
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
  } catch (ex) {
    return res.status(500).json({
      message: ex.message,
    });
  }
});

usersRouter.post("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (req.body && 
        req.body.name && 
        req.body.mobileNumber && 
        req.body.password && 
        req.body.userType &&
        ( 
          CONST_USERTYPE.some(x=> req.body.userType.toString().toUpperCase() === x.toUpperCase())
        )) {
      const { name, mobileNumber, password, userType, roles } = req.body;
      let user = new Users();
      user.name = name;
      user.mobileNumber = mobileNumber;
      user.password = await hash(password);
      user.userType = userType.toString().toUpperCase();
      if(roles && roles.length > 0) {
        const dbRoles = await getRepository(Roles).find({
          where: {
            roleId: In(roles),
            active: true
          },
        });
        if(roles.length && roles.length != dbRoles.length) {
          return res.status(404).json({
            message: "Bad Request!",
          });
        }
      }
      user.roles = roles;
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

usersRouter.put("/:id", async (req: Request,res: Response,next: NextFunction,) => {

  try {
    if (req.params && 
        req.params.id && 
        req.body && 
        req.body.name) {
      let { name, id } = { ...req.body as any, ...req.params as any } as any;
      let user: Users = await getRepository(Users).findOne({
        where: {
          userId: id,
          active: true
        },
      });
      if(user) {
        user.name = name;
        user = await getManager().transaction(
          async (transactionalEntityManager) => {
            return await transactionalEntityManager.save(user);
          },
        );
        delete user.password;
        return res.status(200).json({
          message: "user updated successfully",
          data: user,
          success: true
        });
      } else {
        return res.status(404).json({
            message: "Not Found!",
        });
      }
    } else {
      return res.status(400).json({
        message: "Bad request!",
      });
    }
  } catch (ex) {
    return res.status(500).json({
      message: ex.message,
    });
  }
});

usersRouter.put("/:id/changePassword", async (req: Request,res: Response,next: NextFunction,) => {

  try {
    if (req.params && 
        req.params.id && 
        req.body && 
        req.body.password) {
      let { password, id } = { ...req.body as any, ...req.params as any } as any;
      let user: Users = await getRepository(Users).findOne({
        where: {
          userId: id,
          active: true
        },
      });
      if(user) {
        user.password = await hash(password);
        user = await getManager().transaction(
          async (transactionalEntityManager) => {
            return await transactionalEntityManager.save(user);
          },
        );
        delete user.password;
        return res.status(200).json({
          message: "user updated successfully",
          data: user,
          success: true
        });
      } else {
        return res.status(404).json({
            message: "Not Found!",
        });
      }
    } else {
      return res.status(400).json({
        message: "Bad request!",
      });
    }
  } catch (ex) {
    return res.status(500).json({
      message: ex.message,
    });
  }
});

usersRouter.delete("/:id", async ( req: Request, res: Response, next: NextFunction,) => {
  try {
    if (req.params && req.params.id) {
      let { id } = req.params;
      let user: Users = await getRepository(Users).findOne({
        where: {
          userId: id,
          active: true
        },
      });
      
      if(user) {
        delete user.password;
        user.active = false;
        user = await getManager().transaction(
          async (transactionalEntityManager) => {
            return await transactionalEntityManager.save(user);
          },
        );
        return res.status(200).json({
          message: "user deleted successfully",
          data: user,
          success: true
        });
      } else {
        return res.status(404).json({
          message: "Not Found!",
        });
      }
    } else {
      return res.status(400).json({
        message: "Bad request!",
      });
    }
  } catch (ex) {
    return res.status(500).json({
      message: ex.message,
    });
  }
});
