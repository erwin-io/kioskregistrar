import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Request } from "src/db/entities/Request";
import { CONST_REQUEST_STATUS_ENUM } from "src/common/constant/request.constant";

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Request) private readonly requestRepo: Repository<Request>
  ) {}

  async getMemberDashboard(memberId) {
    const res = await Promise.all([
      this.requestRepo.manager.count(Request, {
        where: {
          requestStatus: CONST_REQUEST_STATUS_ENUM.PENDING,
          requestedBy: {
            memberId,
          },
        },
      }),
      this.requestRepo.manager.findOne(Request, {
        where: {
          requestStatus: CONST_REQUEST_STATUS_ENUM.PENDING,
          requestedBy: {
            memberId,
          },
        },
        relations: {
          requestType: true,
          requestedBy: true,
        },
        order: {
          dateRequested: "ASC",
        },
      }),
      this.requestRepo.manager.count(Request, {
        where: {
          requestStatus: CONST_REQUEST_STATUS_ENUM.TOPAY,
          requestedBy: {
            memberId,
          },
        },
      }),
      this.requestRepo.manager.findOne(Request, {
        where: {
          requestStatus: CONST_REQUEST_STATUS_ENUM.TOPAY,
          requestedBy: {
            memberId,
          },
        },
        relations: {
          requestType: true,
          requestedBy: true,
          assignedAdmin: true,
        },
        order: {
          dateRequested: "ASC",
        },
      }),
      this.requestRepo.manager.count(Request, {
        where: {
          requestStatus: CONST_REQUEST_STATUS_ENUM.TOCOMPLETE,
          requestedBy: {
            memberId,
          },
        },
      }),
      this.requestRepo.manager.findOne(Request, {
        where: {
          requestStatus: CONST_REQUEST_STATUS_ENUM.TOCOMPLETE,
          requestedBy: {
            memberId,
          },
        },
        relations: {
          requestType: true,
          requestedBy: true,
          assignedAdmin: true,
        },
        order: {
          dateRequested: "ASC",
        },
      }),
      this.requestRepo.manager.count(Request, {
        where: {
          requestStatus: CONST_REQUEST_STATUS_ENUM.PROCESSING,
          requestedBy: {
            memberId,
          },
        },
      }),
      this.requestRepo.manager.findOne(Request, {
        where: {
          requestStatus: CONST_REQUEST_STATUS_ENUM.PROCESSING,
          requestedBy: {
            memberId,
          },
        },
        relations: {
          requestType: true,
          requestedBy: true,
          assignedAdmin: true,
        },
        order: {
          dateRequested: "ASC",
        },
      }),
    ]);
    return {
      pending: {
        total: res[0],
        prio: res[1],
      },
      toPay: {
        total: res[2],
        prio: res[3],
      },
      toComplete: {
        total: res[4],
        prio: res[5],
      },
      processing: {
        total: res[6],
        prio: res[7],
      },
    };
  }
}
