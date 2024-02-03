import { RequestPaginationParamsDto } from "src/core/dto/request/request-pagination-params.dto";
import { ApiResponseModel } from "src/core/models/api-response.model";
import { RequestService } from "src/services/request.service";
import { Request } from "src/db/entities/Request";
import { RequestDto } from "src/core/dto/request/request.dto";
import { AssignRequestDto, CancelRequestDto, MarkRequestAsClosedDto, MarkRequestAsCompletedDto, MarkRequestAsPaidDto, MarkRequestAsProcessedDto, UpdateRequestDescriptionDto, UpdateRequestDto } from "src/core/dto/request/request-update.dto";
export declare class RequestController {
    private readonly requestService;
    constructor(requestService: RequestService);
    getPaginatedAdminUsers(params: RequestPaginationParamsDto): Promise<ApiResponseModel<{
        results: Request[];
        total: number;
    }>>;
    getAdminDetails(requestNo: string): Promise<ApiResponseModel<Request>>;
    create(requestDto: RequestDto): Promise<ApiResponseModel<Request>>;
    update(requestNo: string, dto: UpdateRequestDto): Promise<ApiResponseModel<Request>>;
    updateDescription(requestNo: string, dto: UpdateRequestDescriptionDto): Promise<ApiResponseModel<Request>>;
    assignRequest(requestNo: string, dto: AssignRequestDto): Promise<ApiResponseModel<Request>>;
    payRequest(requestNo: string, dto: MarkRequestAsPaidDto): Promise<ApiResponseModel<Request>>;
    markAsToComplete(requestNo: string, dto: MarkRequestAsProcessedDto): Promise<ApiResponseModel<Request>>;
    completeRequest(requestNo: string, dto: MarkRequestAsCompletedDto): Promise<ApiResponseModel<Request>>;
    closeRequest(requestNo: string, dto: MarkRequestAsClosedDto): Promise<ApiResponseModel<Request>>;
    cancelRequest(requestNo: string, dto: CancelRequestDto): Promise<ApiResponseModel<Request>>;
}
