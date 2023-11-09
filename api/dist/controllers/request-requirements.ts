import { Router, Request, Response, NextFunction } from "express";
import { getRepository, getManager, getTreeRepository } from "typeorm";
import { validatorDto } from "../utils/validator";
import { RequestType } from '../../src/db/entities/RequestType';
import { RequestRequirements } from '../../src/db/entities/RequestRequirements';
import { CreateRequestRequirementDto, UpdateRequestRequirementDto } from '../dto/request-type';

export const requestRequirementsRouter = Router();

requestRequirementsRouter.get(
  "/findByRequestType/:requestTypeId",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { requestTypeId } = req.params;
      const results = await getRepository(RequestRequirements).find({
      where: {
        requestType: {
          requestTypeId
        },
        active: true,
      }
    });
      return res.status(200).json({
        data: results,
        success: true,
      });
    } catch (ex) {
      return res.status(500).json({
        message: ex.message,
      });
    }
  }
);

requestRequirementsRouter.get(
  "/:requestRequirementsId",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { requestRequirementsId } = req.params;
      let result = await getRepository(RequestRequirements).findOne({
        where:  {
          requestRequirementsId
        }
      });
      if (result) {
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

requestRequirementsRouter.post(
  "/",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body = req.body as CreateRequestRequirementDto;
      await validatorDto(CreateRequestRequirementDto, body);
      let requestRequirement = new RequestRequirements();
      requestRequirement.name = body.name;
      const requestType = await getTreeRepository(RequestType).findOne({
        where: { requestTypeId: body.requestTypeId }
      });
      if(!requestType) {
        return res.status(404).json({
          message: "Bad request! Request type not found",
        });
      }
      requestRequirement.requestType = requestType;
      requestRequirement.requireToSubmitProof = body.requireToSubmitProof;
      requestRequirement = await getManager().transaction(
        async (transactionalEntityManager) => {
          return await transactionalEntityManager.save(requestRequirement);
        }
      );
      return res.status(200).json({
        message: "Request requirement saved successfully",
        data: requestRequirement,
        success: true,
      });
    } catch (ex) {
      return res.status(500).json({
        message: ex.message,
      });
    }
  }
);

requestRequirementsRouter.put(
  "/:requestRequirementsId",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body = { ...req.body, ...req.params } as UpdateRequestRequirementDto;
      await validatorDto(UpdateRequestRequirementDto, body);
      let requestRequirement = await getRepository(RequestRequirements).findOne({
        where: {
          requestRequirementsId: body.requestRequirementsId,
          active: true
        },
      });
      if (requestRequirement) {
        requestRequirement.name = body.name;
        requestRequirement.requireToSubmitProof = body.requireToSubmitProof;
        requestRequirement = await getManager().transaction(
          async (transactionalEntityManager) => {
            return await transactionalEntityManager.save(RequestRequirements, requestRequirement);
          }
        );
        return res.status(200).json({
          message: "Request requirement updated successfully",
          data: requestRequirement,
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

requestRequirementsRouter.delete(
  "/:requestRequirementsId",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (req.params && req.params.requestRequirementsId) {
        let { requestRequirementsId } = req.params;
        let requestRequirement = await getRepository(RequestRequirements).findOne({
          where: {
            requestRequirementsId,
            active: true,
          },
        });

        if (requestRequirement) {
          requestRequirement.active = false;
          requestRequirement = await getManager().transaction(
            async (transactionalEntityManager) => {
              return await transactionalEntityManager.save(requestRequirement);
            }
          );
          return res.status(200).json({
            message: "Request requirement deleted successfully",
            data: requestRequirement,
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
