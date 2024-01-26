import { RequestDto } from "src/core/dto/request/request.dto";
import { Request } from "src/db/entities/Request";
import { EntityManager, Repository } from "typeorm";
import { AssignRequestDto, CancelRequestDto, MarkRequestAsClosedDto, MarkRequestAsCompletedDto, MarkRequestAsPaidDto, MarkRequestAsProcessedDto, RejectRequestDto, UpdateRequestDescriptionDto } from "src/core/dto/request/request-update.dto";
import { Users } from "src/db/entities/Users";
import { PusherService } from "./pusher.service";
export declare class RequestService {
    private readonly requestRepo;
    private pusherService;
    constructor(requestRepo: Repository<Request>, pusherService: PusherService);
    getRequestPagination({ pageSize, pageIndex, order, columnDef, assignedAdminId, }: {
        pageSize: any;
        pageIndex: any;
        order: any;
        columnDef: any;
        assignedAdminId: any;
    }): Promise<{
        results: Request[];
        total: number;
    }>;
    getByRequestNo(requestNo: any): Promise<Request>;
    create(dto: RequestDto): Promise<Request>;
    updateDescription(requestNo: any, dto: UpdateRequestDescriptionDto): Promise<Request>;
    assignRequest(requestNo: any, dto: AssignRequestDto): Promise<Request>;
    payRequest(requestNo: any, dto: MarkRequestAsPaidDto): Promise<Request>;
    markAsToComplete(requestNo: any, dto: MarkRequestAsProcessedDto): Promise<Request>;
    completeRequest(requestNo: any, dto: MarkRequestAsCompletedDto): Promise<Request>;
    closeRequest(requestNo: any, dto: MarkRequestAsClosedDto): Promise<Request>;
    rejectRequest(requestNo: any, dto: RejectRequestDto): Promise<Request>;
    cancelRequest(requestNo: any, dto: CancelRequestDto): Promise<Request>;
    logNotification(users: Users[], request: Request, entityManager: EntityManager, title: string, description: string): Promise<void>;
    syncRealTime(userIds: string[], request: Request): Promise<void>;
}
