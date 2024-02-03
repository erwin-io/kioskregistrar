import { PaginationParamsDto } from "src/core/dto/pagination-params.dto";
import { UpdateRequestTypeDto } from "src/core/dto/request-type/request-type-update.dto";
import { RequestTypeDto } from "src/core/dto/request-type/request-type.dto";
import { ApiResponseModel } from "src/core/models/api-response.model";
import { RequestType } from "src/db/entities/RequestType";
import { RequestTypeService } from "src/services/request-type.service";
export declare class RequestTypeController {
    private readonly requestTypeService;
    constructor(requestTypeService: RequestTypeService);
    getDetails(requestTypeId: string): Promise<ApiResponseModel<RequestType>>;
    getPaginated(params: PaginationParamsDto): Promise<ApiResponseModel<{
        results: RequestType[];
        total: number;
    }>>;
    create(requestTypeDto: RequestTypeDto): Promise<ApiResponseModel<RequestType>>;
    update(requestTypeId: string, dto: UpdateRequestTypeDto): Promise<ApiResponseModel<RequestType>>;
    delete(requestTypeId: string): Promise<ApiResponseModel<RequestType>>;
}
