import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { REQUEST_TYPE_ERROR_NOT_FOUND } from "src/common/constant/request-type.constant";
import { CONST_REQUEST_STATUS_ENUM } from "src/common/constant/request.constant";
import { columnDefToTypeORMCondition } from "src/common/utils/utils";
import { UpdateRequestTypeDto } from "src/core/dto/request-type/request-type-update.dto";
import { RequestTypeDto } from "src/core/dto/request-type/request-type.dto";
import { UpdateAdminUserDto } from "src/core/dto/user/users-admin.dto";
import { RequestRequirements } from "src/db/entities/RequestRequirements";
import { RequestType } from "src/db/entities/RequestType";
import { Repository } from "typeorm";

@Injectable()
export class RequestTypeService {
  constructor(
    @InjectRepository(RequestType)
    private readonly requestTypeRepo: Repository<RequestType>
  ) {}

  async getRequestTypePagination({ pageSize, pageIndex, order, columnDef }) {
    const skip =
      Number(pageIndex) > 0 ? Number(pageIndex) * Number(pageSize) : 0;
    const take = Number(pageSize);

    const condition = columnDefToTypeORMCondition(columnDef);
    const [results, total] = await Promise.all([
      this.requestTypeRepo.find({
        where: {
          ...condition,
          active: true,
        },
        relations: {
          requestRequirements: true,
        },
        skip,
        take,
        order,
      }),
      this.requestTypeRepo.count({
        where: {
          ...condition,
          active: true,
        },
      }),
    ]);
    return {
      results,
      total,
    };
  }

  async getById(requestTypeId) {
    const result = await this.requestTypeRepo.findOne({
      where: {
        requestTypeId,
        active: true,
      },
    });
    if (!result) {
      throw Error(REQUEST_TYPE_ERROR_NOT_FOUND);
    }
    const requestRequirements = await this.requestTypeRepo.manager.find(
      RequestRequirements,
      {
        where: {
          requestType: {
            requestTypeId,
          },
          active: true,
        },
      }
    );
    return {
      ...result,
      requestRequirements,
    };
  }

  async create(dto: RequestTypeDto) {
    return await this.requestTypeRepo.manager.transaction(
      async (entityManager) => {
        const requestType = new RequestType();
        requestType.name = dto.name;
        requestType.authorizeACopy = dto.authorizeACopy;
        requestType.fee = dto.fee;
        requestType.isPaymentRequired = dto.isPaymentRequired;
        return await entityManager.save(requestType);
      }
    );
  }

  async update(requestTypeId, dto: UpdateRequestTypeDto) {
    return await this.requestTypeRepo.manager.transaction(
      async (entityManager) => {
        const requestType = await entityManager.findOne(RequestType, {
          where: {
            requestTypeId,
            active: true,
          },
        });
        if (!requestType) {
          throw Error(REQUEST_TYPE_ERROR_NOT_FOUND);
        }
        requestType.name = dto.name;
        requestType.authorizeACopy = dto.authorizeACopy;
        requestType.fee = dto.fee;
        requestType.isPaymentRequired = dto.isPaymentRequired;
        return await entityManager.save(RequestType, requestType);
      }
    );
  }

  async delete(requestTypeId) {
    return await this.requestTypeRepo.manager.transaction(
      async (entityManager) => {
        const requestType = await entityManager.findOne(RequestType, {
          where: {
            requestTypeId,
            active: true,
          },
        });
        if (!requestType) {
          throw Error(REQUEST_TYPE_ERROR_NOT_FOUND);
        }
        requestType.active = false;
        return await entityManager.save(RequestType, requestType);
      }
    );
  }
}
