import { columnDefToTypeORMCondition } from './../utils/utils';
import { Router, Request, Response, NextFunction } from "express";
import moment from "moment";
import { Between, ILike, getRepository, getManager } from "typeorm";
import { Member } from "../db/entities/Member";
import { Users } from "../db/entities/Users";
import { convertColumnNotationToObject, hash, getFullName } from "../utils/utils";
import { validatorDto } from "../utils/validator";
import { Admin } from "../db/entities/Admin";
import { CONST_USERTYPE } from "../utils/constant";
import { RequestType } from '../db/entities/RequestType';
import { RequestRequirements } from '../db/entities/RequestRequirements';
import { RequestTypeDto, UpdateRequestTypeDto } from '../dto/request-type';

export const requestTypeRouter = Router();

requestTypeRouter.post(
  "/page",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      let { pageSize, pageIndex, order, columnDef } = req.body as any;
      const skip = Number(pageIndex) > 0 ? Number(pageIndex) * Number(pageSize) : 0;
      const take = Number(pageSize);
      const condition = columnDefToTypeORMCondition(columnDef);
      let [results, total] = await Promise.all([
        getRepository(RequestType).find({
        where: {
          ...condition,
          active: true,
        },
        skip,
        take,
        order
      }),
      getRepository(RequestType).count({ where: condition}),
    ])
      return res.status(200).json({
        data: {
          results: results,
          total
        },
        success: true,
      });
    } catch (ex) {
      return res.status(500).json({
        message: ex.message,
      });
    }
  }
);

requestTypeRouter.get(
  "/:requestTypeId",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { requestTypeId } = req.params;
      let result = await getRepository(RequestType).findOne({
        where:  {
          requestTypeId
        }
      });
      if (result) {
        let requestRequirements = await getRepository(RequestRequirements).find({
          where:  {
            requestType: {
              requestTypeId
            },
            active: true
          }
        });
        return res.status(200).json({
          data: {
            ...result,
            requestRequirements
          },
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

requestTypeRouter.post(
  "/",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body = req.body as RequestTypeDto;
      await validatorDto(RequestTypeDto, body);
      let requestType = new RequestType();
      requestType.name = body.name;
      requestType.authorizeACopy = body.authorizeACopy;
      requestType.fee = body.fee;
      requestType.isPaymentRequired = body.isPaymentRequired;
      requestType = await getManager().transaction(
        async (transactionalEntityManager) => {
          return await transactionalEntityManager.save(requestType);
        }
      );
      return res.status(200).json({
        message: "Request Type saved successfully",
        data: requestType,
        success: true,
      });
    } catch (ex) {
      return res.status(500).json({
        message: ex.message,
      });
    }
  }
);

requestTypeRouter.put(
  "/:requestTypeId",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body = { ...req.body, ...req.params } as UpdateRequestTypeDto;
      await validatorDto(UpdateRequestTypeDto, body);
      let requestType = await getRepository(RequestType).findOne({
        where: {
          requestTypeId: body.requestTypeId,
          active: true
        },
      });
      if (requestType) {
        requestType.name = body.name;
        requestType.authorizeACopy = body.authorizeACopy;
        requestType.fee = body.fee;
        requestType.isPaymentRequired = body.isPaymentRequired;
        requestType = await getManager().transaction(
          async (transactionalEntityManager) => {
            return await transactionalEntityManager.save(RequestType, requestType);
          }
        );
        return res.status(200).json({
          message: "Request Type updated successfully",
          data: requestType,
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

requestTypeRouter.delete(
  "/:requestTypeId",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (req.params && req.params.requestTypeId) {
        let { requestTypeId } = req.params;
        let requestType = await getRepository(RequestType).findOne({
          where: {
            requestTypeId,
            active: true,
          },
        });

        if (requestType) {
          requestType.active = false;
          requestType = await getManager().transaction(
            async (transactionalEntityManager) => {
              return await transactionalEntityManager.save(requestType);
            }
          );
          return res.status(200).json({
            message: "Request Type deleted successfully",
            data: requestType,
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
