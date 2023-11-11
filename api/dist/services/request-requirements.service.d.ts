import { UpdateRequestRequirementDto } from "src/core/dto/request-type/request-type-update.dto";
import { CreateRequestRequirementDto } from "src/core/dto/request-type/request-type.dto";
import { RequestRequirements } from "src/db/entities/RequestRequirements";
import { Repository } from "typeorm";
export declare class RequestRequirementsService {
    private readonly requestRequirements;
    constructor(requestRequirements: Repository<RequestRequirements>);
    getByRequestTypeId(requestTypeId: any): Promise<RequestRequirements[]>;
    getById(requestRequirementsId: any): Promise<RequestRequirements>;
    create(dto: CreateRequestRequirementDto): Promise<RequestRequirements>;
    update(requestRequirementsId: any, dto: UpdateRequestRequirementDto): Promise<RequestRequirements>;
    delete(requestRequirementsId: any): Promise<RequestRequirements>;
}
