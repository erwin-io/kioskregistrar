/** source/controllers/posts.ts */
import { Router, Request, Response, NextFunction } from "express";
import axios, { AxiosResponse } from "axios";
import { Access } from "../db/entities/Access";
import { getManager, getRepository } from "typeorm";
import FileMiddleware from "../middleware/file-middleware";

export const accessRouter = Router();


accessRouter.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    let accesss: Access[] = await getRepository(Access).find({
      where: {
        active: true
      }
    });
    return res.status(200).json({
      data: accesss,
    });
  } catch (ex) {
    return res.status(500).json({
      message: ex.message,
    });
  }
});

accessRouter.get("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    let access: Access = await getRepository(Access).findOne({
      where: {
        accessId: id,
        active: true
      },
    });
    return res.status(200).json({
      message: access,
    });
  } catch (ex) {
    return res.status(500).json({
      message: ex.message,
    });
  }
});

accessRouter.post("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (req.body && req.body.name) {
      const { name } = req.body;
      let access = new Access();
      access.name = name.toString().toUpperCase();
      access = await getManager().transaction(
        async (transactionalEntityManager) => {
          return await transactionalEntityManager.save(access);
        },
      );
      return res.status(200).json({
        data: access,
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

accessRouter.put("/:id", async (req: Request,res: Response,next: NextFunction,) => {

  try {
    if (req.body && req.body.name && req.params && req.params.id) {
      let { name, id } = { ...req.body as any, ...req.params as any } as any;
      let access: Access = await getRepository(Access).findOne({
        where: {
          accessId: id,
          active: true
        },
      });
      if(access) {
        access.name = name.toString().toUpperCase();
        access = await getManager().transaction(
          async (transactionalEntityManager) => {
            return await transactionalEntityManager.save(access);
          },
        );
        return res.status(200).json({
          message: "access updated successfully",
          data: access,
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

accessRouter.delete("/:id", async ( req: Request, res: Response, next: NextFunction,) => {
  try {
    if (req.params && req.params.id) {
      let { id } = req.params;
      let access: Access = await getRepository(Access).findOne({
        where: {
          accessId: id,
          active: true
        },
      });
      
      if(access) {
        access.active = false;
        access = await getManager().transaction(
          async (transactionalEntityManager) => {
            return await transactionalEntityManager.save(access);
          },
        );
        return res.status(200).json({
          message: "access deleted successfully",
          data: access,
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
