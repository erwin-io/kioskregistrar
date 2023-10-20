/** source/controllers/posts.ts */
import { Router, Request, Response, NextFunction } from "express";
import axios, { AxiosResponse } from "axios";
import { Roles } from "../../src/db/entities/Roles";
import { getManager, getRepository } from "typeorm";
import FileMiddleware from "../middleware/file-middleware";

export const rolesRouter = Router();


rolesRouter.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    let roless: Roles[] = await getRepository(Roles).find({
      where: {
        active: true
      }
    });
    return res.status(200).json({
      data: roless,
    });
  } catch (ex) {
    return res.status(500).json({
      message: ex.message,
    });
  }
});

rolesRouter.get("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    let roles: Roles = await getRepository(Roles).findOne({
      where: {
        roleId: id,
        active: true
      },
    });
    return res.status(200).json({
      message: roles,
    });
  } catch (ex) {
    return res.status(500).json({
      message: ex.message,
    });
  }
});

rolesRouter.post("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (req.body && req.body.name) {
      const { name } = req.body;
      let roles = new Roles();
      roles.name = name.toString().toUpperCase();
      roles = await getManager().transaction(
        async (transactionalEntityManager) => {
          return await transactionalEntityManager.save(roles);
        },
      );
      return res.status(200).json({
        data: roles,
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

rolesRouter.put("/:id", async (req: Request,res: Response,next: NextFunction,) => {

  try {
    if (req.body && req.body.name && req.params && req.params.id) {
      let { name, id } = { ...req.body as any, ...req.params as any } as any;
      let roles: Roles = await getRepository(Roles).findOne({
        where: {
          roleId: id,
          active: true
        },
      });
      if(roles) {
        roles.name = name.toString().toUpperCase();
        roles = await getManager().transaction(
          async (transactionalEntityManager) => {
            return await transactionalEntityManager.save(roles);
          },
        );
        return res.status(200).json({
          message: "roles updated successfully",
          data: roles,
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

rolesRouter.delete("/:id", async ( req: Request, res: Response, next: NextFunction,) => {
  try {
    if (req.params && req.params.id) {
      let { id } = req.params;
      let roles: Roles = await getRepository(Roles).findOne({
        where: {
          roleId: id,
          active: true
        },
      });
      
      if(roles) {
        roles.active = false;
        roles = await getManager().transaction(
          async (transactionalEntityManager) => {
            return await transactionalEntityManager.save(roles);
          },
        );
        return res.status(200).json({
          message: "roles deleted successfully",
          data: roles,
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
