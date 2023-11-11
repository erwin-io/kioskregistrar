import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { REQUEST_REQUIREMENT_ERROR_NOT_FOUND } from "src/common/constant/request-requirements.constant";
import { REQUEST_TYPE_ERROR_NOT_FOUND } from "src/common/constant/request-type.constant";
import { UpdateRequestRequirementDto } from "src/core/dto/request-type/request-type-update.dto";
import { CreateRequestRequirementDto } from "src/core/dto/request-type/request-type.dto";
import { RequestRequirements } from "src/db/entities/RequestRequirements";
import { RequestType } from "src/db/entities/RequestType";
import { Repository } from "typeorm";

@Injectable()
export class RequestRequirementsService {
  constructor(
    @InjectRepository(RequestRequirements)
    private readonly requestRequirements: Repository<RequestRequirements>
  ) {}

  async getByRequestTypeId(requestTypeId) {
    return await this.requestRequirements.find({
      where: {
        requestType: {
          requestTypeId,
        },
        active: true,
      },
    });
  }

  async getById(requestRequirementsId) {
    return await this.requestRequirements.findOne({
      where: {
        requestRequirementsId,
        active: true,
      },
    });
  }

  async create(dto: CreateRequestRequirementDto) {
    return await this.requestRequirements.manager.transaction(
      async (entityManager) => {
        const requestRequirement = new RequestRequirements();
        requestRequirement.name = dto.name;
        const requestType = await entityManager.findOne(RequestType, {
          where: { requestTypeId: dto.requestTypeId },
        });
        if (!requestType) {
          throw Error(REQUEST_TYPE_ERROR_NOT_FOUND);
        }
        requestRequirement.requestType = requestType;
        requestRequirement.requireToSubmitProof = dto.requireToSubmitProof;
        return await entityManager.save(requestRequirement);
      }
    );
  }

  async update(requestRequirementsId, dto: UpdateRequestRequirementDto) {
    return await this.requestRequirements.manager.transaction(
      async (entityManager) => {
        const requestRequirement = await entityManager.findOne(
          RequestRequirements,
          {
            where: { requestRequirementsId, active: true },
          }
        );
        if (!requestRequirement) {
          throw Error(REQUEST_REQUIREMENT_ERROR_NOT_FOUND);
        }
        requestRequirement.name = dto.name;
        requestRequirement.requireToSubmitProof = dto.requireToSubmitProof;
        return await entityManager.save(
          RequestRequirements,
          requestRequirement
        );
      }
    );
  }

  async delete(requestRequirementsId) {
    return await this.requestRequirements.manager.transaction(
      async (entityManager) => {
        const requestRequirement = await entityManager.findOne(
          RequestRequirements,
          {
            where: { requestRequirementsId, active: true },
          }
        );
        if (!requestRequirement) {
          throw Error(REQUEST_REQUIREMENT_ERROR_NOT_FOUND);
        }
        requestRequirement.active = false;
        return await entityManager.save(
          RequestRequirements,
          requestRequirement
        );
      }
    );
  }
}
