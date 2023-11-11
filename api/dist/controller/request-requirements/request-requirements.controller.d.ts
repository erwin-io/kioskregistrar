import { UpdateRequestRequirementDto } from "src/core/dto/request-type/request-type-update.dto";
import { CreateRequestRequirementDto } from "src/core/dto/request-type/request-type.dto";
import { ApiResponseModel } from "src/core/models/api-response.model";
import { RequestRequirements } from "src/db/entities/RequestRequirements";
import { RequestRequirementsService } from "src/services/request-requirements.service";
export declare class RequestRequirementsController {
    private readonly requestRequirementsService;
    constructor(requestRequirementsService: RequestRequirementsService);
    getAdminDetails(requestTypeId: string): Promise<ApiResponseModel<RequestRequirements[]>>;
    getById(requestRequirementsId: string): Promise<ApiResponseModel<RequestRequirements>>;
    create(dto: CreateRequestRequirementDto): Promise<ApiResponseModel<RequestRequirements>>;
    update(requestRequirementsId: string, dto: UpdateRequestRequirementDto): Promise<ApiResponseModel<RequestRequirements>>;
    delete(requestRequirementsId: string): Promise<ApiResponseModel<RequestRequirements>>;
}
