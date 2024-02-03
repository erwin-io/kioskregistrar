/* eslint-disable @typescript-eslint/no-unused-vars */
import { toPromise } from "./../common/utils/utils";
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
import { EntityManager, Not, Repository } from "typeorm";
import {
  AssignRequestDto,
  CancelRequestDto,
  MarkRequestAsClosedDto,
  MarkRequestAsCompletedDto,
  MarkRequestAsPaidDto,
  MarkRequestAsProcessedDto,
  RejectRequestDto,
  UpdateRequestDescriptionDto,
  UpdateRequestDto,
} from "src/core/dto/request/request-update.dto";
import { Admin } from "src/db/entities/Admin";
import { CONST_QUERYCURRENT_TIMESTAMP } from "src/common/constant/timestamp.constant";
import { Notifications } from "src/db/entities/Notifications";
import { Users } from "src/db/entities/Users";
import {
  NOTIF_TITLE,
  NOTIF_TYPE,
} from "src/common/constant/notifications.constant";
import { PusherService } from "./pusher.service";
import { RequestRequirements } from "src/db/entities/RequestRequirements";
import { SubmittedRequirements } from "src/db/entities/SubmittedRequirements";
import { Files } from "src/db/entities/Files";
import { v4 as uuid } from "uuid";
import { extname } from "path";
import { FirebaseProvider } from "src/core/provider/firebase/firebase-provider";
import { type } from "os";
import { title } from "process";
import { OneSignalNotificationService } from "./one-signal-notification.service";

@Injectable()
export class RequestService {
  constructor(
    private firebaseProvoder: FirebaseProvider,
    @InjectRepository(Request)
    private readonly requestRepo: Repository<Request>,
    private pusherService: PusherService,
    private oneSignalNotificationService: OneSignalNotificationService
  ) {}

  async getRequestPagination({
    pageSize,
    pageIndex,
    order,
    columnDef,
    assignedAdminId,
  }) {
    try {
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
              user: {
                profileFile: true,
              },
            },
            assignedAdmin: {
              user: {
                profileFile: true,
              },
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
    } catch (ex) {
      throw ex;
    }
  }

  async getByRequestNo(requestNo) {
    const request = await this.requestRepo.findOne({
      where: {
        requestNo,
      },
      relations: {
        requestedBy: {
          user: {
            profileFile: true,
          },
        },
        assignedAdmin: {
          user: {
            profileFile: true,
          },
        },
        requestType: {
          requestRequirements: true,
        },
        submittedRequirements: {
          requestRequirements: true,
        },
      },
    });

    const requestRequirements = await this.requestRepo.manager.find(
      RequestRequirements,
      {
        where: {
          requestType: {
            requestTypeId: request.requestType?.requestTypeId,
          },
          active: true,
        },
      }
    );
    return {
      ...request,
      requestType: {
        ...request?.requestType,
        requestRequirements,
      },
    };
  }

  async create(dto: RequestDto) {
    return await this.requestRepo.manager.transaction(async (entityManager) => {
      const request = new Request();
      request.description = dto.description;
      const timestamp = await entityManager
        .query(CONST_QUERYCURRENT_TIMESTAMP)
        .then((res) => {
          return res[0]["timestamp"];
        });
      request.dateLastUpdated = timestamp;
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
      const bucket = this.firebaseProvoder.app.storage().bucket();
      for (const item of dto.requirements) {
        const newRequirement = new SubmittedRequirements();
        const newRequirementFiles: Files[] = [];
        for (const file of item?.files) {
          const newFile = new Files();
          newFile.guid = uuid();
          newFile.name = `${file.name}`;
          const bucketFile = bucket.file(
            `request/submitted-requirements/${newFile.guid}${extname(
              file.name
            )}`
          );
          const fileData = Buffer.from(file.data, "base64");
          await bucketFile.save(fileData).then(async () => {
            const url = await bucketFile.getSignedUrl({
              action: "read",
              expires: "03-09-2500",
            });
            newFile.url = url[0];
            newRequirementFiles.push(newFile);
          });
        }
        newRequirement.files = newRequirementFiles;
        newRequirement.request = _res;
        newRequirement.requestRequirements = await entityManager.findOne(
          RequestRequirements,
          { where: { requestRequirementsId: item.requestRequirementsId } }
        );
        await entityManager.save(SubmittedRequirements, newRequirement);
      }
      return await entityManager.save(Request, _res);
    });
  }

  async update(requestNo, dto: UpdateRequestDto) {
    return await this.requestRepo.manager.transaction(async (entityManager) => {
      let request = await entityManager.findOne(Request, {
        where: {
          requestNo,
        },
      });
      if (!request) {
        throw Error(REQUEST_ERROR_NOT_FOUND);
      }
      request.description = dto.description;
      const timestamp = await entityManager
        .query(CONST_QUERYCURRENT_TIMESTAMP)
        .then((res) => {
          return res[0]["timestamp"];
        });
      request.dateLastUpdated = timestamp;
      request = await entityManager.save(Request, request);
      const bucket = this.firebaseProvoder.app.storage().bucket();
      const submittedRequirements = await entityManager.find(
        SubmittedRequirements,
        {
          where: {
            request: {
              requestId: request.requestId,
            },
          },
        }
      );
      const files = submittedRequirements.map((x) => x.files as Files).flat(1);
      await entityManager
        .createQueryBuilder("SubmittedRequirements", '"SubmittedRequirements"')
        .where('"SubmittedRequirements"."RequestId" = :requestId')
        .setParameters({
          requestId: request.requestId,
        })
        .delete()
        .execute();
      // await entityManager.query(
      //   `delete from dbo."SubmittedRequirements" where "RequestId" = '${request.requestId}'`
      // );
      for (const item of files) {
        try {
          const bucketFile = bucket.file(
            `request/submitted-requirements/${item.guid}${extname(item.name)}`
          );
          bucketFile.delete();
        } catch (ex) {
          console.log(ex);
        }
      }
      for (const item of dto.requirements) {
        const newRequirement = new SubmittedRequirements();
        const newRequirementFiles: Files[] = [];
        for (const file of item?.files) {
          const newFile = new Files();
          newFile.guid = uuid();
          newFile.name = `${file.name}`;
          const bucketFile = bucket.file(
            `request/submitted-requirements/${newFile.guid}${extname(
              file.name
            )}`
          );
          const fileData = Buffer.from(file.data, "base64");
          await bucketFile.save(fileData).then(async () => {
            const url = await bucketFile.getSignedUrl({
              action: "read",
              expires: "03-09-2500",
            });
            newFile.url = url[0];
            newRequirementFiles.push(newFile);
          });
        }
        newRequirement.files = newRequirementFiles;
        newRequirement.request = request;
        newRequirement.requestRequirements = await entityManager.findOne(
          RequestRequirements,
          { where: { requestRequirementsId: item.requestRequirementsId } }
        );
        await entityManager.save(SubmittedRequirements, newRequirement);
      }
      request = await entityManager.save(Request, request);
      return request;
    });
  }

  async updateDescription(requestNo, dto: UpdateRequestDescriptionDto) {
    return await this.requestRepo.manager.transaction(async (entityManager) => {
      let request = await entityManager.findOne(Request, {
        where: {
          requestNo,
        },
      });
      if (!request) {
        throw Error(REQUEST_ERROR_NOT_FOUND);
      }
      request.description = dto.description;
      const timestamp = await entityManager
        .query(CONST_QUERYCURRENT_TIMESTAMP)
        .then((res) => {
          return res[0]["timestamp"];
        });
      request.dateLastUpdated = timestamp;
      request = await entityManager.save(Request, request);
      await this.logNotification(
        [request.assignedAdmin.user],
        request,
        entityManager,
        NOTIF_TITLE.REQUEST_DESCRIPTION_UPDATED,
        `Request #${request.requestNo} description was updated by the requestor!`
      );
      await this.syncRealTime([request.assignedAdmin.user.userId], request);
      return request;
    });
  }

  async assignRequest(requestNo, dto: AssignRequestDto) {
    return await this.requestRepo.manager.transaction(async (entityManager) => {
      let request = await entityManager.findOne(Request, {
        where: {
          requestNo,
        },
        relations: {
          assignedAdmin: {
            user: {
              profileFile: true,
            },
          },
          requestedBy: {
            user: {
              profileFile: true,
            },
          },
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
        relations: {
          user: {
            profileFile: true,
          },
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
      const title = NOTIF_TITLE.REQUEST_ASSIGNED;
      const desc = `Request #${request.requestNo} is now assigned to ${request.assignedAdmin.fullName}!`;
      const notificationIds = await this.logNotification(
        [request.assignedAdmin.user, request.requestedBy.user],
        request,
        entityManager,
        title,
        desc
      );
      await this.syncRealTime(
        [request.assignedAdmin.user.userId, request.requestedBy.user.userId],
        request
      );
      const pushNotifResults: { userId: string; success: boolean }[] =
        await Promise.all([
          this.oneSignalNotificationService.sendToExternalUser(
            request.requestedBy.user.userName,
            "REQUEST",
            request.requestId,
            notificationIds,
            title,
            desc
          ),
        ]);
      console.log("Push notif results ", JSON.stringify(pushNotifResults));
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
        relations: {
          assignedAdmin: {
            user: {
              profileFile: true,
            },
          },
          requestedBy: {
            user: {
              profileFile: true,
            },
          },
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
        relations: {
          assignedAdmin: {
            user: {
              profileFile: true,
            },
          },
          requestedBy: {
            user: {
              profileFile: true,
            },
          },
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
      const title = NOTIF_TITLE.REQUEST_READY;
      const desc = `Request #${request.requestNo} is now ready!`;
      const notificationIds = await this.logNotification(
        [request.requestedBy.user],
        request,
        entityManager,
        title,
        desc
      );
      await this.syncRealTime([request.requestedBy.user.userId], request);
      const pushNotifResults: { userId: string; success: boolean }[] =
        await Promise.all([
          this.oneSignalNotificationService.sendToExternalUser(
            request.requestedBy.user.userName,
            "REQUEST",
            request.requestId,
            notificationIds,
            title,
            desc
          ),
        ]);
      console.log("Push notif results ", JSON.stringify(pushNotifResults));
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
        relations: {
          assignedAdmin: {
            user: {
              profileFile: true,
            },
          },
          requestedBy: {
            user: {
              profileFile: true,
            },
          },
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
      const title = NOTIF_TITLE.REQUEST_COMPLETED;
      const desc = `Request #${request.requestNo} is now completed`;
      const notificationIds = await this.logNotification(
        [request.requestedBy.user, request.assignedAdmin.user],
        request,
        entityManager,
        title,
        desc
      );
      await this.syncRealTime(
        [request.requestedBy.user.userId, request.assignedAdmin.user.userId],
        request
      );
      const pushNotifResults: { userId: string; success: boolean }[] =
        await Promise.all([
          this.oneSignalNotificationService.sendToExternalUser(
            request.requestedBy.user.userName,
            "REQUEST",
            request.requestId,
            notificationIds,
            title,
            desc
          ),
        ]);
      console.log("Push notif results ", JSON.stringify(pushNotifResults));
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
        relations: {
          assignedAdmin: {
            user: {
              profileFile: true,
            },
          },
          requestedBy: {
            user: {
              profileFile: true,
            },
          },
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
      const title = NOTIF_TITLE.REQUEST_CLOSED;
      const desc = `Your request #${request.requestNo} is now closed`;
      const notificationIds = await this.logNotification(
        [request.requestedBy.user],
        request,
        entityManager,
        NOTIF_TITLE.REQUEST_CLOSED,
        `Your request #${request.requestNo} is now closed`
      );
      await this.syncRealTime([request.requestedBy.user.userId], request);
      const pushNotifResults: { userId: string; success: boolean }[] =
        await Promise.all([
          this.oneSignalNotificationService.sendToExternalUser(
            request.requestedBy.user.userName,
            "REQUEST",
            request.requestId,
            notificationIds,
            title,
            desc
          ),
        ]);
      console.log("Push notif results ", JSON.stringify(pushNotifResults));
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
        relations: {
          requestedBy: {
            user: true,
          },
          assignedAdmin: {
            user: true,
          },
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
      const title = NOTIF_TITLE.REQUEST_REJECTED;
      const desc = `Your request #${request.requestNo} was rejected`;
      const notificationIds = await this.logNotification(
        [request.requestedBy.user],
        request,
        entityManager,
        NOTIF_TITLE.REQUEST_REJECTED,
        `Your request #${request.requestNo} was rejected`
      );
      await this.syncRealTime([request.assignedAdmin.user.userId], request);
      const pushNotifResults: { userId: string; success: boolean }[] =
        await Promise.all([
          this.oneSignalNotificationService.sendToExternalUser(
            request.requestedBy.user.userName,
            "REQUEST",
            request.requestId,
            notificationIds,
            title,
            desc
          ),
        ]);
      console.log("Push notif results ", JSON.stringify(pushNotifResults));
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
        relations: {
          assignedAdmin: {
            user: {
              profileFile: true,
            },
          },
          requestedBy: {
            user: {
              profileFile: true,
            },
          },
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

  async logNotification(
    users: Users[],
    request: Request,
    entityManager: EntityManager,
    title: string,
    description: string
  ) {
    const notifications: Notifications[] = [];

    for (const user of users) {
      notifications.push({
        title,
        description,
        type: NOTIF_TYPE.REQUEST.toString(),
        referenceId: request.requestNo.toString(),
        isRead: false,
        user: user,
      } as Notifications);
    }
    const res: Notifications[] = await entityManager.save(
      Notifications,
      notifications
    );
    const notificationsIds = res.map((x) => x.notificationId);
    await this.pusherService.sendNotif(
      users.map((x) => x.userId),
      title,
      description
    );
    return notificationsIds;
  }

  async syncRealTime(userIds: string[], request: Request) {
    await this.pusherService.requestChanges(userIds, request);
  }
}
