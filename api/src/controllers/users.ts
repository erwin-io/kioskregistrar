/** source/controllers/posts.ts */
import { Router, Request, Response, NextFunction, response } from "express";
import axios, { AxiosResponse } from "axios";
import { Users } from "../../src/db/entities/Users";
import { In, getManager, getRepository } from "typeorm";
import { Access } from "../../src/db/entities/Access";
import { CONST_USERTYPE } from "../../src/utils/constant";
import { compare, hash } from "../../src/utils/utils";
import { CreateAdminUser, UpdateAdminUser } from "../../src/dto/users";
import { Admin } from "../../src/db/entities/Admin";
import { validatorDto } from "../../src/middleware/validator";
import { Member } from "../../src/db/entities/Member";

export const usersRouter = Router();

usersRouter.get(
  "/:type",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { type } = req.params;
      if(!["ADMIN", "MEMBER"].some(x=>x === type.toUpperCase())) {
        throw Error("Invalid type");
      }
      let data: Admin[] | Member[] = await getRepository(type.toUpperCase() === "ADMIN" ? Admin : Member).find({
        where: {
          user: {
            userType: type.toUpperCase(),
            active: true,
          }
        },
        relations: {
          user: true
        }
      });
      return res.status(200).json({
        data: data.map((x) => {
          delete x.user.password;
          return x;
        }),
        success: true,
      });
    } catch (ex) {
      return res.status(500).json({
        message: ex.message,
      });
    }
  }
);

usersRouter.get(
  "/:type/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id, type } = req.params;
      if(!["ADMIN", "MEMBER"].some(x=>x === type.toUpperCase())) {
        throw Error("Invalid type");
      }
      let result: Admin | Member = await getRepository(type.toUpperCase() === "ADMIN" ? Admin : Member).findOne({
        where:  {
          user: {
            userType: type.toUpperCase(),
            active: true,
          }
        },
        relations: {
          user: true
        }
      });
      if (result) {
        delete result.user.password;
        return res.status(200).json({
          data: result,
          success: true,
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
  }
);

usersRouter.post(
  "/admin/",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body = req.body as CreateAdminUser;
      await validatorDto(CreateAdminUser, body);
      let user = new Users();
      user.userName = body.userName;
      user.password = await hash(body.password);
      user.userType = "ADMIN";
      user.access = body.access;
      user.accessGranted = true;
      let admin = new Admin();
      admin.firstName = body.firstName;
      admin.lastName = body.lastName;
      admin.mobileNumber = body.mobileNumber;
      admin = await getManager().transaction(
        async (transactionalEntityManager) => {
          user = await transactionalEntityManager.save(user);
          admin.user = user;
          return await transactionalEntityManager.save(admin);
        }
      );
      delete admin.user.password;
      return res.status(200).json({
        data: admin,
        success: true,
      });
    } catch (ex) {
      return res.status(500).json({
        message: ex.message,
      });
    }
  }
);

usersRouter.put(
  "/admin/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body = { ...req.body, ...req.params } as UpdateAdminUser;
      await validatorDto(UpdateAdminUser, body);
      let admin: Admin = await getRepository(Admin).findOne({
        where: {
          user: {
            userId: body.id,
            userType: "ADMIN",
            active: true,
          },
        },
        relations: {
          user: {
            profileFile: true
          },
        }
      });
      if (admin) {
        admin.firstName = body.firstName;
        admin.lastName = body.lastName;
        admin.mobileNumber = body.mobileNumber;
        admin.user.access = body.access;
        admin.user.access = body.access;
        admin = await getManager().transaction(
          async (transactionalEntityManager) => {
            return await transactionalEntityManager.save(admin);
          }
        );
        delete admin.user.password;
        return res.status(200).json({
          message: "user updated successfully",
          data: admin,
          success: true,
        });
      } else {
        return res.status(404).json({
          message: "Not Found!",
        });
      }
    } catch (ex) {
      return res.status(500).json({
        message: ex.message,
      });
    }
  }
);

usersRouter.put(
  "/admin/:id/changePassword",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (req.params && req.params.id && req.body && req.body.password) {
        let { password, id } = {
          ...(req.body as any),
          ...(req.params as any),
        } as any;
        let user: Users = await getRepository(Users).findOne({
          where: {
            userId: id,
            userType: "ADMIN",
            active: true,
          },
        });
        if (user) {
          user.password = await hash(password);
          user = await getManager().transaction(
            async (transactionalEntityManager) => {
              return await transactionalEntityManager.save(user);
            }
          );
          delete user.password;
          return res.status(200).json({
            message: "user updated successfully",
            data: user,
            success: true,
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
  }
);

usersRouter.delete(
  "/admin/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (req.params && req.params.id) {
        let { id } = req.params;
        let user: Users = await getRepository(Users).findOne({
          where: {
            userId: id,
            active: true,
            userType: "ADMIN"
          },
        });

        if (user) {
          delete user.password;
          user.active = false;
          user = await getManager().transaction(
            async (transactionalEntityManager) => {
              return await transactionalEntityManager.save(user);
            }
          );
          return res.status(200).json({
            message: "user deleted successfully",
            data: user,
            success: true,
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
  }
);
