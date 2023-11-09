import { Router, Response, NextFunction } from "express";
import { getRepository, getManager } from "typeorm";
import { Request } from "../db/entities/Request";
import { AssignRequestDto, MarkRequestAsCompletedDto, MarkRequestAsClosedDto, MarkRequestAsPaidDto, MarkRequestAsProcessedDto, RequestDto, UpdateRequestDescriptionDto, UpdateRequestStatusDto } from "../dto/request";
import { columnDefToTypeORMCondition, generateRequestNo } from "../utils/utils";
import { validatorDto } from "../utils/validator";
import { RequestType } from "../db/entities/RequestType";
import { Member } from "../db/entities/Member";
import { CONST_QUERYCURRENT_TIMESTAMP, CONST_REQUEST_STATUS_ENUM } from "../utils/constant";
import { Admin } from "../db/entities/Admin";

export const requestRouter = Router();

requestRouter.post(
  "/page/:requestStatus",
  async (req: { body: any, params: any }, res: Response, next: NextFunction) => {
    try {
      let { pageSize, pageIndex, order, columnDef, requestStatus, assignedAdminId } = { ...req.body, ...req.params } as any;
      const skip = Number(pageIndex) > 0 ? Number(pageIndex) * Number(pageSize) : 0;
      const take = Number(pageSize);
      let condition = columnDefToTypeORMCondition(columnDef);
      if(!condition.requestStatus || condition.requestStatus === "") {
        if(!requestStatus || requestStatus === "") {
          requestStatus = "PENDING";
        }
        condition.requestStatus = requestStatus;
      }
      if(condition.requestStatus.toUpperCase() !== CONST_REQUEST_STATUS_ENUM.PENDING && (!condition?.assignedAdmin?.adminId || condition?.assignedAdmin?.adminId === "")) {
        if(assignedAdminId && assignedAdminId !== "") {
          condition = {
            ...condition,
            assignedAdmin: {
              adminId: assignedAdminId
            }
          }
        }
      }
      let [results, total] = await Promise.all([
        getRepository(Request).find({
          relations: {
            requestedBy: {
              user: true
            },
            assignedAdmin: {
              user: true
            },
            requestType: {
              requestRequirements: true
            }
          },
          where: condition,
          skip,
          take,
          order
        }),
        getRepository(Request).count({ where: condition}),
      ]);
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

requestRouter.get(
  "/:requestNo",
  async (req: { params: any }, res: Response, next: NextFunction) => {
    try {
      const { requestNo } = req.params;
      let result = await getRepository(Request).findOne({
        where:  {
          requestNo
        },
        relations: {
          requestedBy: {
            user: true
          },
          assignedAdmin: {
            user: true
          },
          requestType: {
            requestRequirements: true
          }
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

requestRouter.post(
  "/",
  async (req: { body: any }, res: Response, next: NextFunction) => {
    try {
      const body = req.body as RequestDto;
      await validatorDto(RequestDto, body);
      let request = new Request();
      request.description = body.description;
      const requestedBy = await getRepository(Member).findOne({
        where: {
          memberId: body.requestedById
        },
      });
      if(!requestedBy) {
        return res.status(404).json({
          message: "Requested by Member Not found!",
        });
      }
      request.requestedBy = requestedBy;
      const requestType = await getRepository(RequestType).findOne({
        where: {
          requestTypeId: body.requestTypeId
        },
      });
      if(!requestType) {
        return res.status(404).json({
          message: "Requested Type Not found!",
        });
      }
      request.requestType = requestType;
      request = await getManager().transaction(
        async (transactionalEntityManager) => {
          const _res = await transactionalEntityManager.save(request);
          _res.requestNo = generateRequestNo(_res.requestId);
          return await transactionalEntityManager.save(Request, _res);
        }
      );

      return res.status(200).json({
        message: "Request saved successfully",
        data: request,
        success: true,
      });
    } catch (ex) {
      return res.status(500).json({
        message: ex.message,
      });
    }
  }
);
//updateDescription
requestRouter.put(
  "/:requestNo/updateDescription",
  async (req: { body: any; params: any }, res: Response, next: NextFunction) => {
    try {
      const body = { ...req.body, ...req.params } as UpdateRequestDescriptionDto;
      await validatorDto(UpdateRequestDescriptionDto, body);
      let request = await getRepository(Request).findOne({
        where: {
          requestNo: body.requestNo
        },
      });
      if (request) {
        request.description = body.description;
        request = await getManager().transaction(
          async (transactionalEntityManager) => {
            return await transactionalEntityManager.save(Request, request);
          }
        );
        return res.status(200).json({
          message: "Request updated successfully",
          data: request,
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
//assignRequest - to pay
requestRouter.put(
  "/:requestNo/assignRequest",
  async (req: { body: any; params: any }, res: Response, next: NextFunction) => {
    try {
      const body = { ...req.body, ...req.params } as AssignRequestDto;
      await validatorDto(AssignRequestDto, body);
      let request = await getRepository(Request).findOne({
        where: {
          requestNo: body.requestNo
        },
      });
      if (request) {
        if(request.requestStatus.toUpperCase() === CONST_REQUEST_STATUS_ENUM.CLOSED) {
          return res.status(404).json({
            message: "Request already closed!",
          });
        }
        if(request.requestStatus.toUpperCase() === CONST_REQUEST_STATUS_ENUM.TOPAY || request.requestStatus.toUpperCase() === CONST_REQUEST_STATUS_ENUM.TOCOMPLETE || request.requestStatus.toUpperCase() === CONST_REQUEST_STATUS_ENUM.PROCESSING) {
          return res.status(404).json({
            message: "Request already being processed!",
          });
        }
        if(request.requestStatus.toUpperCase() === CONST_REQUEST_STATUS_ENUM.TOPAY || (request.assignedAdmin && request.assignedAdmin.adminId)) {
          return res.status(404).json({
            message: "Request already assigned!",
          });
        }
        await validatorDto(AssignRequestDto, body);
        let assignedAdmin = await getRepository(Admin).findOne({
          where: {
            adminId: body.assignedAdminId
          },
        });
        if(!assignedAdmin) {
          return res.status(404).json({
            message: "Invalid Assignee!",
          });
        }
        request.assignedAdmin = assignedAdmin;
        request.requestStatus = CONST_REQUEST_STATUS_ENUM.TOPAY;
        request = await getManager().transaction(
          async (transactionalEntityManager) => {
            const timestamp = await transactionalEntityManager.query(CONST_QUERYCURRENT_TIMESTAMP).then(res=> {
              return res[0]['timestamp'];
            });
            request.dateAssigned = timestamp;
            request.dateLastUpdated = timestamp;
            return await transactionalEntityManager.save(Request, request);
          }
        );
        request = await getRepository(Request).findOne({
          where:  {
            requestNo: request.requestNo
          },
          relations: {
            requestedBy: {
              user: true
            },
            assignedAdmin: {
              user: true
            },
            requestType: {
              requestRequirements: true
            }
          }
        });
        return res.status(200).json({
          message: "Request updated successfully",
          data: request,
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
//payRequest - processing
requestRouter.put(
  "/:requestNo/payRequest",
  async (req: { body: any; params: any }, res: Response, next: NextFunction) => {
    try {
      const body = { ...req.body, ...req.params } as MarkRequestAsPaidDto;
      await validatorDto(MarkRequestAsPaidDto, body);
      let request = await getRepository(Request).findOne({
        where: {
          requestNo: body.requestNo
        },
      });
      if (request) {
        if(request.requestStatus.toUpperCase() === CONST_REQUEST_STATUS_ENUM.CLOSED) {
          return res.status(404).json({
            message: "Request already closed!",
          });
        }
        if(request.requestStatus.toUpperCase() === CONST_REQUEST_STATUS_ENUM.TOCOMPLETE || request.requestStatus.toUpperCase() === CONST_REQUEST_STATUS_ENUM.PROCESSING) {
          return res.status(404).json({
            message: "Request already being processed!",
          });
        }
        if(request.dateCompleted) {
          return res.status(404).json({
            message: "Request was already completed!",
          });
        }
        if(!request.dateAssigned) {
          return res.status(404).json({
            message: "Request not assigned!",
          });
        }
        if(request.isPaid) {
          return res.status(404).json({
            message: "Request already assigned!",
          });
        }
        request.isPaid = true;
        request.requestStatus = CONST_REQUEST_STATUS_ENUM.PROCESSING;
        request = await getManager().transaction(
          async (transactionalEntityManager) => {
            const timestamp = await transactionalEntityManager.query(CONST_QUERYCURRENT_TIMESTAMP).then(res=> {
              return res[0]['timestamp'];
            });
            request.datePaid = timestamp;
            request.dateProcessStarted = timestamp;
            request.dateLastUpdated = timestamp;
            return await transactionalEntityManager.save(Request, request);
          }
        );
        request = await getRepository(Request).findOne({
          where:  {
            requestNo: request.requestNo
          },
          relations: {
            requestedBy: {
              user: true
            },
            assignedAdmin: {
              user: true
            },
            requestType: {
              requestRequirements: true
            }
          }
        });
        return res.status(200).json({
          message: "Request updated successfully",
          data: request,
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
//markAsToComplete - to complete
requestRouter.put(
  "/:requestNo/markAsToComplete",
  async (req: { body: any; params: any }, res: Response, next: NextFunction) => {
    try {
      const body = { ...req.body, ...req.params } as MarkRequestAsProcessedDto;
      await validatorDto(MarkRequestAsProcessedDto, body);
      let request = await getRepository(Request).findOne({
        where: {
          requestNo: body.requestNo
        },
      });
      if (request) {
        if(request.requestStatus.toUpperCase() === CONST_REQUEST_STATUS_ENUM.CLOSED) {
          return res.status(404).json({
            message: "Request already closed!",
          });
        }
        if(request.dateCompleted) {
          return res.status(404).json({
            message: "Request was already completed!",
          });
        }
        if(!request.dateProcessStarted) {
          return res.status(404).json({
            message: "Request was not processed!",
          });
        }
        if(!request.isPaid) {
          return res.status(404).json({
            message: "Request not paid!",
          });
        }
        if(!request.dateAssigned) {
          return res.status(404).json({
            message: "Request not assigned!",
          });
        }
        request.requestStatus = CONST_REQUEST_STATUS_ENUM.TOCOMPLETE;
        request = await getManager().transaction(
          async (transactionalEntityManager) => {
            const timestamp = await transactionalEntityManager.query(CONST_QUERYCURRENT_TIMESTAMP).then(res=> {
              return res[0]['timestamp'];
            });
            request.dateProcessEnd = timestamp;
            request.dateLastUpdated = timestamp;
            return await transactionalEntityManager.save(Request, request);
          }
        );
        request = await getRepository(Request).findOne({
          where:  {
            requestNo: request.requestNo
          },
          relations: {
            requestedBy: {
              user: true
            },
            assignedAdmin: {
              user: true
            },
            requestType: {
              requestRequirements: true
            }
          }
        });
        return res.status(200).json({
          message: "Request updated successfully",
          data: request,
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
//completeRequest - completed date
requestRouter.put(
  "/:requestNo/completeRequest",
  async (req: { body: any; params: any }, res: Response, next: NextFunction) => {
    try {
      const body = { ...req.body, ...req.params } as MarkRequestAsCompletedDto;
      await validatorDto(MarkRequestAsCompletedDto, body);
      let request = await getRepository(Request).findOne({
        where: {
          requestNo: body.requestNo
        },
      });
      if (request) {
        if(request.requestStatus.toUpperCase() === CONST_REQUEST_STATUS_ENUM.CLOSED) {
          return res.status(404).json({
            message: "Request already closed!",
          });
        }
        if(request.dateCompleted) {
          return res.status(404).json({
            message: "Request was already completed!",
          });
        }
        if(!request.dateProcessEnd) {
          return res.status(404).json({
            message: "Request was not completed!",
          });
        }
        if(!request.dateProcessStarted) {
          return res.status(404).json({
            message: "Request was not processed!",
          });
        }
        if(!request.isPaid) {
          return res.status(404).json({
            message: "Request not paid!",
          });
        }
        if(!request.dateAssigned) {
          return res.status(404).json({
            message: "Request not assigned!",
          });
        }
        request = await getManager().transaction(
          async (transactionalEntityManager) => {
            const timestamp = await transactionalEntityManager.query(CONST_QUERYCURRENT_TIMESTAMP).then(res=> {
              return res[0]['timestamp'];
            });
            request.dateCompleted = timestamp;
            request.dateLastUpdated = timestamp;
            return await transactionalEntityManager.save(Request, request);
          }
        );
        request = await getRepository(Request).findOne({
          where:  {
            requestNo: request.requestNo
          },
          relations: {
            requestedBy: {
              user: true
            },
            assignedAdmin: {
              user: true
            },
            requestType: {
              requestRequirements: true
            }
          }
        });
        return res.status(200).json({
          message: "Request updated successfully",
          data: request,
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
//closeRequest - closed
requestRouter.put(
  "/:requestNo/closeRequest",
  async (req: { body: any; params: any }, res: Response, next: NextFunction) => {
    try {
      const body = { ...req.body, ...req.params } as MarkRequestAsClosedDto;
      await validatorDto(MarkRequestAsClosedDto, body);
      let request = await getRepository(Request).findOne({
        where: {
          requestNo: body.requestNo
        },
      });
      if (request) {
        if(request.requestStatus.toUpperCase() === CONST_REQUEST_STATUS_ENUM.CLOSED) {
          return res.status(404).json({
            message: "Request already closed!",
          });
        }
        if(!request.dateCompleted) {
          return res.status(404).json({
            message: "Request was not completed!",
          });
        }
        if(!request.dateProcessEnd) {
          return res.status(404).json({
            message: "Request was not completed!",
          });
        }
        if(!request.dateProcessStarted) {
          return res.status(404).json({
            message: "Request was not processed!",
          });
        }
        if(!request.isPaid) {
          return res.status(404).json({
            message: "Request not paid!",
          });
        }
        if(!request.dateAssigned) {
          return res.status(404).json({
            message: "Request not assigned!",
          });
        }
        request.requestStatus = CONST_REQUEST_STATUS_ENUM.CLOSED;
        request = await getManager().transaction(
          async (transactionalEntityManager) => {
            const timestamp = await transactionalEntityManager.query(CONST_QUERYCURRENT_TIMESTAMP).then(res=> {
              return res[0]['timestamp'];
            });
            request.dateClosed = timestamp;
            request.dateLastUpdated = timestamp;
            return await transactionalEntityManager.save(Request, request);
          }
        );
        request = await getRepository(Request).findOne({
          where:  {
            requestNo: request.requestNo
          },
          relations: {
            requestedBy: {
              user: true
            },
            assignedAdmin: {
              user: true
            },
            requestType: {
              requestRequirements: true
            }
          }
        });
        return res.status(200).json({
          message: "Request updated successfully",
          data: request,
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