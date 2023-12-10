import { REQUEST_TYPE_ERROR_NOT_FOUND } from "src/common/constant/request-type.constant";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import {
  CONST_REQUEST_STATUS_ENUM,
  REQUEST_ERROR_NOT_FOUND,
} from "src/common/constant/request.constant";
import { USER_ERROR_MEMBER_NOT_FOUND } from "src/common/constant/user-error.constant";
import {
  columnDefToTypeORMCondition,
  generateRequestNo,
} from "src/common/utils/utils";
import { RequestDto } from "src/core/dto/request/request.dto";
import { Member } from "src/db/entities/Member";
import { Request } from "src/db/entities/Request";
import { RequestType } from "src/db/entities/RequestType";
import { Repository } from "typeorm";
import {
  AssignRequestDto,
  CancelRequestDto,
  MarkRequestAsClosedDto,
  MarkRequestAsCompletedDto,
  MarkRequestAsPaidDto,
  MarkRequestAsProcessedDto,
  RejectRequestDto,
  UpdateRequestDescriptionDto,
} from "src/core/dto/request/request-update.dto";
import { Admin } from "src/db/entities/Admin";
import { CONST_QUERYCURRENT_TIMESTAMP } from "src/common/constant/timestamp.constant";

@Injectable()
export class RequestService {
  constructor(
    @InjectRepository(Request) private readonly requestRepo: Repository<Request>
  ) {}

  async getRequestPagination({
    pageSize,
    pageIndex,
    order,
    columnDef,
    assignedAdminId,
  }) {
    const skip =
      Number(pageIndex) > 0 ? Number(pageIndex) * Number(pageSize) : 0;
    const take = Number(pageSize);

    let condition = columnDefToTypeORMCondition(columnDef);
    if (
      columnDef &&
      columnDef.find((x) => x.apiNotation === "requestStatus") &&
      columnDef.find((x) => x.apiNotation === "requestStatus").type ===
        "precise" &&
      columnDef.find((x) => x.apiNotation === "requestStatus").filter !==
        "PENDING" &&
      (!condition?.assignedAdmin?.adminId ||
        condition?.assignedAdmin?.adminId === "")
    ) {
      if (assignedAdminId && assignedAdminId !== "") {
        condition = {
          ...condition,
          assignedAdmin: {
            adminId: assignedAdminId,
          },
        };
      }
    }
    const [results, total] = await Promise.all([
      this.requestRepo.find({
        relations: {
          requestedBy: {
            user: true,
          },
          assignedAdmin: {
            user: true,
          },
          requestType: {
            requestRequirements: true,
          },
        },
        where: condition,
        skip,
        take,
        order,
      }),
      this.requestRepo.count({ where: condition }),
    ]);
    return {
      results,
      total,
    };
  }

  async getByRequestNo(requestNo) {
    return await this.requestRepo.findOne({
      where: {
        requestNo,
      },
      relations: {
        requestedBy: {
          user: true,
        },
        assignedAdmin: {
          user: true,
        },
        requestType: {
          requestRequirements: true,
        },
      },
    });
  }

  async create(dto: RequestDto) {
    return await this.requestRepo.manager.transaction(async (entityManager) => {
      const request = new Request();
      request.description = dto.description;
      const requestedBy = await entityManager.findOne(Member, {
        where: {
          memberId: dto.requestedById,
        },
      });
      if (!requestedBy) {
        throw Error(USER_ERROR_MEMBER_NOT_FOUND);
      }
      request.requestedBy = requestedBy;
      const requestType = await entityManager.findOne(RequestType, {
        where: {
          requestTypeId: dto.requestTypeId,
        },
      });
      if (!requestType) {
        throw Error(REQUEST_TYPE_ERROR_NOT_FOUND);
      }
      request.requestType = requestType;
      const _res = await entityManager.save(request);
      _res.requestNo = generateRequestNo(_res.requestId);
      return await entityManager.save(Request, _res);
    });
  }

  async updateDescription(requestNo, dto: UpdateRequestDescriptionDto) {
    return await this.requestRepo.manager.transaction(async (entityManager) => {
      const request = await entityManager.findOne(Request, {
        where: {
          requestNo,
        },
      });
      if (!request) {
        throw Error(REQUEST_ERROR_NOT_FOUND);
      }
      request.description = dto.description;
      return await entityManager.save(Request, request);
    });
  }

  async assignRequest(requestNo, dto: AssignRequestDto) {
    return await this.requestRepo.manager.transaction(async (entityManager) => {
      let request = await entityManager.findOne(Request, {
        where: {
          requestNo,
        },
      });
      if (!request) {
        throw Error(REQUEST_ERROR_NOT_FOUND);
      }
      if (
        request.requestStatus.toUpperCase() === CONST_REQUEST_STATUS_ENUM.CLOSED
      ) {
        throw Error("Request already closed!");
      }
      if (
        request.requestStatus.toUpperCase() ===
          CONST_REQUEST_STATUS_ENUM.TOPAY ||
        request.requestStatus.toUpperCase() ===
          CONST_REQUEST_STATUS_ENUM.TOCOMPLETE ||
        request.requestStatus.toUpperCase() ===
          CONST_REQUEST_STATUS_ENUM.PROCESSING
      ) {
        throw Error("Request already being processed!");
      }
      if (
        request.requestStatus.toUpperCase() ===
          CONST_REQUEST_STATUS_ENUM.TOPAY ||
        (request.assignedAdmin && request.assignedAdmin.adminId)
      ) {
        throw Error("Request already assigned!");
      }
      const assignedAdmin = await entityManager.findOne(Admin, {
        where: {
          adminId: dto.assignedAdminId,
        },
      });
      if (!assignedAdmin) {
        throw Error("Invalid Assignee!");
      }
      request.assignedAdmin = assignedAdmin;
      request.requestStatus = CONST_REQUEST_STATUS_ENUM.TOPAY;
      const timestamp = await entityManager
        .query(CONST_QUERYCURRENT_TIMESTAMP)
        .then((res) => {
          return res[0]["timestamp"];
        });
      request.dateAssigned = timestamp;
      request.dateLastUpdated = timestamp;
      request = await entityManager.save(Request, request);
      return await entityManager.findOne(Request, {
        where: {
          requestNo: request.requestNo,
        },
        relations: {
          requestedBy: {
            user: true,
          },
          assignedAdmin: {
            user: true,
          },
          requestType: {
            requestRequirements: true,
          },
        },
      });
    });
  }

  async payRequest(requestNo, dto: MarkRequestAsPaidDto) {
    return await this.requestRepo.manager.transaction(async (entityManager) => {
      let request = await entityManager.findOne(Request, {
        where: {
          requestNo,
        },
      });
      if (!request) {
        throw Error(REQUEST_ERROR_NOT_FOUND);
      }

      if (
        request.requestStatus.toUpperCase() === CONST_REQUEST_STATUS_ENUM.CLOSED
      ) {
        throw Error("Request already closed!");
      }
      if (
        request.requestStatus.toUpperCase() ===
          CONST_REQUEST_STATUS_ENUM.TOCOMPLETE ||
        request.requestStatus.toUpperCase() ===
          CONST_REQUEST_STATUS_ENUM.PROCESSING
      ) {
        throw Error("Request already being processed!");
      }
      if (request.dateCompleted) {
        throw Error("Request was already completed!");
      }
      if (!request.dateAssigned) {
        throw Error("Request not assigned!");
      }
      if (request.isPaid) {
        throw Error("Request already assigned!");
      }
      request.isPaid = true;
      request.requestStatus = CONST_REQUEST_STATUS_ENUM.PROCESSING;
      const timestamp = await entityManager
        .query(CONST_QUERYCURRENT_TIMESTAMP)
        .then((res) => {
          return res[0]["timestamp"];
        });
      request.datePaid = timestamp;
      request.dateProcessStarted = timestamp;
      request.dateLastUpdated = timestamp;
      request = await entityManager.save(Request, request);
      return await entityManager.findOne(Request, {
        where: {
          requestNo: request.requestNo,
        },
        relations: {
          requestedBy: {
            user: true,
          },
          assignedAdmin: {
            user: true,
          },
          requestType: {
            requestRequirements: true,
          },
        },
      });
    });
  }

  async markAsToComplete(requestNo, dto: MarkRequestAsProcessedDto) {
    return await this.requestRepo.manager.transaction(async (entityManager) => {
      let request = await entityManager.findOne(Request, {
        where: {
          requestNo,
        },
      });
      if (!request) {
        throw Error(REQUEST_ERROR_NOT_FOUND);
      }

      if (
        request.requestStatus.toUpperCase() === CONST_REQUEST_STATUS_ENUM.CLOSED
      ) {
        throw Error("Request already closed!");
      }
      if (request.dateCompleted) {
        throw Error("Request was already completed!");
      }
      if (!request.dateProcessStarted) {
        throw Error("Request was not processed!");
      }
      if (!request.isPaid) {
        throw Error("Request not paid!");
      }
      if (!request.dateAssigned) {
        throw Error("Request not assigned!");
      }

      request.requestStatus = CONST_REQUEST_STATUS_ENUM.TOCOMPLETE;
      const timestamp = await entityManager
        .query(CONST_QUERYCURRENT_TIMESTAMP)
        .then((res) => {
          return res[0]["timestamp"];
        });
      request.dateProcessEnd = timestamp;
      request.dateLastUpdated = timestamp;
      request = await entityManager.save(Request, request);
      return await entityManager.findOne(Request, {
        where: {
          requestNo: request.requestNo,
        },
        relations: {
          requestedBy: {
            user: true,
          },
          assignedAdmin: {
            user: true,
          },
          requestType: {
            requestRequirements: true,
          },
        },
      });
    });
  }

  async completeRequest(requestNo, dto: MarkRequestAsCompletedDto) {
    return await this.requestRepo.manager.transaction(async (entityManager) => {
      let request = await entityManager.findOne(Request, {
        where: {
          requestNo,
        },
      });
      if (!request) {
        throw Error(REQUEST_ERROR_NOT_FOUND);
      }
      if (
        request.requestStatus.toUpperCase() === CONST_REQUEST_STATUS_ENUM.CLOSED
      ) {
        throw Error("Request already closed!");
      }
      if (request.dateCompleted) {
        throw Error("Request was already completed!");
      }
      if (!request.dateProcessEnd) {
        throw Error("Request was not processed!");
      }
      if (!request.dateProcessStarted) {
        throw Error("Request was not processed!");
      }
      if (!request.isPaid) {
        throw Error("Request not paid!");
      }
      if (!request.dateAssigned) {
        throw Error("Request not assigned!");
      }

      const timestamp = await entityManager
        .query(CONST_QUERYCURRENT_TIMESTAMP)
        .then((res) => {
          return res[0]["timestamp"];
        });
      request.dateCompleted = timestamp;
      request.dateLastUpdated = timestamp;
      request = await entityManager.save(Request, request);
      return await entityManager.findOne(Request, {
        where: {
          requestNo: request.requestNo,
        },
        relations: {
          requestedBy: {
            user: true,
          },
          assignedAdmin: {
            user: true,
          },
          requestType: {
            requestRequirements: true,
          },
        },
      });
    });
  }

  async closeRequest(requestNo, dto: MarkRequestAsClosedDto) {
    return await this.requestRepo.manager.transaction(async (entityManager) => {
      let request = await entityManager.findOne(Request, {
        where: {
          requestNo,
        },
      });
      if (!request) {
        throw Error(REQUEST_ERROR_NOT_FOUND);
      }
      if (
        request.requestStatus.toUpperCase() === CONST_REQUEST_STATUS_ENUM.CLOSED
      ) {
        throw Error("Request already closed!");
      }
      if (!request.dateCompleted) {
        throw Error("Request was not completed!");
      }
      if (!request.dateProcessEnd) {
        throw Error("Request was not processed!");
      }
      if (!request.dateProcessStarted) {
        throw Error("Request was not processed!");
      }
      if (!request.isPaid) {
        throw Error("Request not paid!");
      }
      if (!request.dateAssigned) {
        throw Error("Request not assigned!");
      }

      request.requestStatus = CONST_REQUEST_STATUS_ENUM.CLOSED;
      const timestamp = await entityManager
        .query(CONST_QUERYCURRENT_TIMESTAMP)
        .then((res) => {
          return res[0]["timestamp"];
        });
      request.dateClosed = timestamp;
      request.dateLastUpdated = timestamp;
      request = await entityManager.save(Request, request);
      return await entityManager.findOne(Request, {
        where: {
          requestNo: request.requestNo,
        },
        relations: {
          requestedBy: {
            user: true,
          },
          assignedAdmin: {
            user: true,
          },
          requestType: {
            requestRequirements: true,
          },
        },
      });
    });
  }

  async rejectRequest(requestNo, dto: RejectRequestDto) {
    return await this.requestRepo.manager.transaction(async (entityManager) => {
      let request = await entityManager.findOne(Request, {
        where: {
          requestNo,
        },
      });
      if (!request) {
        throw Error(REQUEST_ERROR_NOT_FOUND);
      }
      if (
        request.requestStatus.toUpperCase() ===
        CONST_REQUEST_STATUS_ENUM.REJECTED
      ) {
        throw Error("Request already rejected!");
      }
      if (
        request.requestStatus.toUpperCase() === CONST_REQUEST_STATUS_ENUM.CANCEL
      ) {
        throw Error("Request already cancelled!");
      }
      if (
        request.requestStatus.toUpperCase() === CONST_REQUEST_STATUS_ENUM.CLOSED
      ) {
        throw Error("Request already closed!");
      }
      if (
        !["PENDING", "TOPAY"].some(
          (x) => x === request.requestStatus.toUpperCase()
        )
      ) {
        throw Error(
          "Not allowed to cancel!, Request was already being process!"
        );
      }

      request.requestStatus = CONST_REQUEST_STATUS_ENUM.REJECTED;
      const timestamp = await entityManager
        .query(CONST_QUERYCURRENT_TIMESTAMP)
        .then((res) => {
          return res[0]["timestamp"];
        });
      request.dateLastUpdated = timestamp;
      request = await entityManager.save(Request, request);
      return await entityManager.findOne(Request, {
        where: {
          requestNo: request.requestNo,
        },
        relations: {
          requestedBy: {
            user: true,
          },
          assignedAdmin: {
            user: true,
          },
          requestType: {
            requestRequirements: true,
          },
        },
      });
    });
  }

  async cancelRequest(requestNo, dto: CancelRequestDto) {
    return await this.requestRepo.manager.transaction(async (entityManager) => {
      let request = await entityManager.findOne(Request, {
        where: {
          requestNo,
        },
      });
      if (!request) {
        throw Error(REQUEST_ERROR_NOT_FOUND);
      }
      if (
        request.requestStatus.toUpperCase() === CONST_REQUEST_STATUS_ENUM.CANCEL
      ) {
        throw Error("Request already cancelled!");
      }
      if (
        request.requestStatus.toUpperCase() === CONST_REQUEST_STATUS_ENUM.CLOSED
      ) {
        throw Error("Request already closed!");
      }
      if (
        !["PENDING", "TOPAY"].some(
          (x) => x === request.requestStatus.toUpperCase()
        )
      ) {
        throw Error(
          "Not allowed to cancel!, Request was already being process!"
        );
      }

      request.requestStatus = CONST_REQUEST_STATUS_ENUM.CANCEL;
      const timestamp = await entityManager
        .query(CONST_QUERYCURRENT_TIMESTAMP)
        .then((res) => {
          return res[0]["timestamp"];
        });
      request.dateLastUpdated = timestamp;
      request = await entityManager.save(Request, request);
      return await entityManager.findOne(Request, {
        where: {
          requestNo: request.requestNo,
        },
        relations: {
          requestedBy: {
            user: true,
          },
          assignedAdmin: {
            user: true,
          },
          requestType: {
            requestRequirements: true,
          },
        },
      });
    });
  }
}
